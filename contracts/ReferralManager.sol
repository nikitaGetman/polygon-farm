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
    }

    struct Referral {
        address referralAddress;
        uint256 level;
    }

    mapping(address => User) private users;
    mapping(address => bool) private authorizedContracts;

    ERC20Burnable public subscriptionToken;
    IERC20 public rewardToken;
    address private rewardPool;
    uint256 public levelSubscriptionCost;
    uint256 public fullSubscriptionCost;

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

    function subscribeToLevels(uint256 levels) public {
        require(levels > 0, "Too low required levels");
        require(levels < LEVELS, "Too much required levels");

        uint256 price = levels * levelSubscriptionCost;
        subscriptionToken.burnFrom(_msgSender(), price);

        _setSubscription(_msgSender(), levels);
    }

    function subscribeToAllLevels() public {
        subscriptionToken.burnFrom(_msgSender(), fullSubscriptionCost);
        _setSubscription(_msgSender(), LEVELS);
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

    function setUserReferrer(address user, address referrer)
        public
        onlyAuthorizedContracts
    {
        require(referrer != address(0), "Referrer is required");
        require(referrer != user, "Referrer can not be user");
        require(
            users[user].referrer == address(0),
            "Referrer is already specified"
        );
        require(
            userHasSubscription(referrer, 0),
            "Referrer has no subscription"
        );

        users[user].referrer = referrer;
        users[referrer].referrals_1_lvl.push(user);

        address nextReferrer = referrer;
        for (uint256 i = 0; i < LEVELS; i++) {
            User storage ref = users[nextReferrer];
            ref.refCount[i] += 1;
            nextReferrer = ref.referrer;
        }

        emit ReferralAdded(referrer, user);
    }

    function _setSubscription(address subscriber, uint256 levels) internal {
        uint256 subscriptionEnd = block.timestamp +
            SUBSCRIPTION_PERIOD_DAYS *
            1 days;

        for (uint256 i = 0; i < levels - 1; i++) {
            users[subscriber].activeLevels[i] = subscriptionEnd;
        }

        emit Subscribed(subscriber, levels, block.timestamp);
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
            uint256 totalDividends,
            uint256 totalClaimedDividends,
            uint256 referrals_1_lvl,
            uint256 totalReferrals
        )
    {
        User storage user = users[userAddress];

        referrer = user.referrer;
        totalDividends = user.totalRefDividends;
        totalClaimedDividends = user.totalRefDividendsClaimed;
        referrals_1_lvl = user.referrals_1_lvl.length;
        totalReferrals = _getUserReferralsCount(userAddress, 0);
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

    function _getUserReferralsCount(address userAddress, uint256 currentLevel)
        internal
        view
        returns (uint256)
    {
        User storage user = users[userAddress];
        uint256 referralCounter = 0;

        for (uint256 i = currentLevel; i < LEVELS; i++) {
            referralCounter += user.refCount[i];
        }

        return referralCounter;
    }

    // TODO: добавить инфу о стейкингах в получение рефералов
    function getUserReferrals(address userAddress, uint256 currentLevel)
        public
        view
        returns (Referral[] memory)
    {
        uint256 referralsCount = _getUserReferralsCount(
            userAddress,
            currentLevel
        );

        uint256 nextReferralIndex = 0;
        Referral[] memory referrals = new Referral[](referralsCount);

        address[] memory level1Referrals = getUser1LvlReferrals(userAddress);

        for (uint256 i = 0; i < level1Referrals.length; i++) {
            referrals[nextReferralIndex] = Referral(
                level1Referrals[i],
                currentLevel
            );
            nextReferralIndex++;

            if (currentLevel + 1 < LEVELS) {
                Referral[] memory theirReferrals = getUserReferrals(
                    level1Referrals[i],
                    currentLevel + 1
                );

                for (uint256 j = 0; j < theirReferrals.length; j++) {
                    referrals[nextReferralIndex] = theirReferrals[i];
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
        return users[user].activeLevels[level] > block.timestamp;
    }

    function calculateRefReward(uint256 amount, uint256 level)
        public
        view
        returns (uint256)
    {
        require(level < LEVELS);
        return (amount * REFERRAL_PERCENTS[level]) / 100;
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
        require(level < LEVELS);
        REFERRAL_PERCENTS[level] = percent;
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
