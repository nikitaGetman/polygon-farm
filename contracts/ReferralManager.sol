// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IReferralManager.sol";

contract ReferralManager is IReferralManager, AccessControl {
    uint256 public constant LEVELS = 10;
    uint256 public SUBSCRIPTION_PERIOD_DAYS = 365;
    uint256[] public REFERRAL_PERCENTS = [
        100,
        90,
        80,
        70,
        60,
        50,
        40,
        30,
        20,
        10
    ];

    struct User {
        address referrer;
        uint256[LEVELS] activeLevels;
        uint256 totalRefDividends;
        uint256 totalRefDividendsClaimed;
        address[] referrals_1_lvl;
        uint256[LEVELS] refCount;
        bool isActive;
    }

    struct Referral {
        address referralAddress;
        uint256 level;
    }

    uint256 public levelSubscriptionCost;
    uint256 public fullSubscriptionCost;

    mapping(address => User) private users;
    mapping(address => bool) private authorizedContracts;

    ERC20Burnable public subscriptionToken;
    IERC20 public rewardToken;
    address private rewardPool;

    event Subscribed(
        address indexed subscriber,
        uint256 levels,
        uint256 indexed timestamp
    );
    event ReferralAdded(address indexed referrer, address indexed referral);

    constructor(
        address subscriptionToken_,
        address rewardToken_,
        address rewardPool_,
        uint256 fullSubscriptionCost_,
        uint256 levelSubscriptionCost_
    ) {
        require(subscriptionToken_ != address(0));
        require(rewardToken_ != address(0));
        require(rewardPool_ != address(0));
        require(fullSubscriptionCost_ > 0);
        require(levelSubscriptionCost_ > 0);

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        subscriptionToken = ERC20Burnable(subscriptionToken_);
        rewardToken = IERC20(rewardToken_);
        rewardPool = rewardPool_;
        fullSubscriptionCost = fullSubscriptionCost_;
        levelSubscriptionCost = levelSubscriptionCost_;
    }

    function subscribeToLevel(uint256 level) public {
        require(level > 0, "Too low level");
        require(level <= LEVELS, "Too big level");

        address subscriber = _msgSender();

        subscriptionToken.burnFrom(subscriber, levelSubscriptionCost);

        uint256 startDate = users[subscriber].activeLevels[level - 1] <
            getTimestamp()
            ? getTimestamp()
            : users[subscriber].activeLevels[level - 1];
        users[subscriber].activeLevels[level - 1] =
            startDate +
            SUBSCRIPTION_PERIOD_DAYS *
            1 days;

        users[subscriber].isActive = true;
        emit Subscribed(subscriber, level, startDate);
    }

    function subscribeToAllLevels() public {
        address subscriber = _msgSender();

        subscriptionToken.burnFrom(subscriber, fullSubscriptionCost);
        uint256 subscriptionEnd = getTimestamp() +
            SUBSCRIPTION_PERIOD_DAYS *
            1 days;

        for (uint256 i = 0; i < LEVELS; i++) {
            users[subscriber].activeLevels[i] = subscriptionEnd;
        }

        users[subscriber].isActive = true;
        emit Subscribed(subscriber, LEVELS + 1, block.timestamp);
    }

    function addUserDividends(address user, uint256 reward)
        public
        onlyAuthorizedContracts
    {
        users[user].totalRefDividends += reward;
    }

    function claimDividends(uint256 amount) public {
        User storage user = users[_msgSender()];
        require(
            user.totalRefDividends - user.totalRefDividendsClaimed >= amount,
            "Insufficient amount"
        );

        user.totalRefDividendsClaimed += amount;
        rewardToken.transferFrom(rewardPool, _msgSender(), amount);
    }

    function setMyReferrer(address referrer) public {
        return _setUserReferrer(_msgSender(), referrer);
    }

    function setUserReferrer(address user, address referrer)
        public
        onlyAuthorizedContracts
    {
        return _setUserReferrer(user, referrer);
    }

    function _setUserReferrer(address user, address referrer) internal {
        require(user != address(0), "User is zero address");
        require(referrer != address(0), "Referrer is zero address");
        require(referrer != user, "Referrer can not be user");
        require(
            users[user].referrer == address(0),
            "Referrer is already specified"
        );
        require(
            userHasSubscription(referrer, 1),
            "Referrer has no subscription"
        );

        users[user].referrer = referrer;
        users[referrer].referrals_1_lvl.push(user);

        address nextReferrer = referrer;
        for (uint256 i = 0; i < LEVELS; i++) {
            require(nextReferrer != user, "Cyclic chain!");
            User storage ref = users[nextReferrer];
            if (ref.isActive) {
                ref.refCount[i] += 1;
                nextReferrer = ref.referrer;
            } else break;
        }

        emit ReferralAdded(referrer, user);
    }

    // --------- Helper functions ---------
    function getReferralLevels() public pure returns (uint256) {
        return LEVELS;
    }

    function getUserInfo(address userAddress)
        public
        view
        returns (
            address referrer,
            uint256[LEVELS] memory activeLevels,
            uint256 totalDividends,
            uint256 totalClaimedDividends,
            address[] memory referrals_1_lvl,
            uint256[LEVELS] memory refCount,
            uint256 totalReferrals,
            bool isActive
        )
    {
        User storage user = users[userAddress];

        referrer = user.referrer;
        activeLevels = user.activeLevels;
        totalDividends = user.totalRefDividends;
        totalClaimedDividends = user.totalRefDividendsClaimed;
        referrals_1_lvl = user.referrals_1_lvl;
        refCount = user.refCount;
        totalReferrals = _getUserTotalReferralsCount(userAddress, 0);
        isActive = user.isActive;
    }

    function getUserReferrer(address user) public view returns (address) {
        return users[user].referrer;
    }

    function getUser1LvlReferrals(address userAddress)
        public
        view
        returns (address[] memory)
    {
        return users[userAddress].referrals_1_lvl;
    }

    function _getUserTotalReferralsCount(
        address userAddress,
        uint256 currentLevel
    ) internal view returns (uint256) {
        User storage user = users[userAddress];
        uint256 referralCounter = 0;

        for (uint256 i = 0; i < LEVELS - currentLevel; i++) {
            referralCounter += user.refCount[i];
        }

        return referralCounter;
    }

    // TODO: add staking info to referrals
    function getUserReferrals(address userAddress, uint256 currentLevel)
        public
        view
        returns (Referral[] memory)
    {
        uint256 referralsCount = _getUserTotalReferralsCount(
            userAddress,
            currentLevel
        );

        uint256 nextReferralIndex = 0;
        Referral[] memory referrals = new Referral[](referralsCount);

        address[] memory level1Referrals = getUser1LvlReferrals(userAddress);

        for (uint256 i = 0; i < level1Referrals.length; i++) {
            referrals[nextReferralIndex] = Referral(
                level1Referrals[i],
                currentLevel + 1
            );
            nextReferralIndex++;

            if (currentLevel + 1 < LEVELS) {
                Referral[] memory theirReferrals = getUserReferrals(
                    level1Referrals[i],
                    currentLevel + 1
                );

                for (uint256 j = 0; j < theirReferrals.length; j++) {
                    referrals[nextReferralIndex] = theirReferrals[j];
                    nextReferralIndex++;
                }
            }
        }

        return referrals;
    }

    function userHasSubscription(address user, uint256 level)
        public
        view
        returns (bool)
    {
        return users[user].activeLevels[level - 1] > getTimestamp();
    }

    function calculateRefReward(uint256 amount, uint256 level)
        public
        view
        returns (uint256)
    {
        require(level > 0);
        require(level <= LEVELS);
        return (amount * REFERRAL_PERCENTS[level - 1]) / 100;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function isAuthorized(address contractAddress) public view returns (bool) {
        return authorizedContracts[contractAddress];
    }

    modifier onlyAuthorizedContracts() {
        require(isAuthorized(_msgSender()), "Address not authorized");
        _;
    }

    // --------- Administrative functions ---------

    function authorizeContract(address contractAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        authorizedContracts[contractAddress] = true;
    }

    function removeContractAuthorization(address contractAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        authorizedContracts[contractAddress] = false;
    }

    function updateSubscriptionPeriod(uint256 durationDays)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        SUBSCRIPTION_PERIOD_DAYS = durationDays;
    }

    function updateReferralPercent(uint256 level, uint256 percent)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(level > 0);
        require(level <= LEVELS);
        REFERRAL_PERCENTS[level - 1] = percent;
    }

    function updateSubscriptionToken(address token)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        subscriptionToken = ERC20Burnable(token);
    }

    function updateRewardToken(address token)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardToken = IERC20(token);
    }

    function updateRewardPool(address poolAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardPool = poolAddress;
    }

    function updateLevelSubscriptionCost(uint256 cost)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        levelSubscriptionCost = cost;
    }

    function updateFullSubscriptionCost(uint256 cost)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        fullSubscriptionCost = cost;
    }
}
