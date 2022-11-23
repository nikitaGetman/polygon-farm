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
        bool isActiveSubscriber;
        uint256 activationDate;
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
    event DividendsAdded(
        address indexed referrer,
        address indexed referral,
        uint256 indexed level,
        uint256 depositAmount,
        uint256 rewardAmount,
        uint256 stakingPlanId,
        uint256 timestamp
    );

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

    // LEVEL = 1...10
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

        users[subscriber].isActiveSubscriber = true;
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

        users[subscriber].isActiveSubscriber = true;
        emit Subscribed(subscriber, LEVELS + 1, block.timestamp);
    }

    function addUserDividends(AddDividendsParams memory params)
        public
        onlyAuthorizedContracts
    {
        users[params.user].totalRefDividends += params.reward;
        emit DividendsAdded(
            params.user,
            params.referral,
            params.level,
            params.depositAmount,
            params.reward,
            params.stakingPlanId,
            getTimestamp()
        );
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
        users[user].activationDate = getTimestamp();
        users[referrer].referrals_1_lvl.push(user);

        address nextReferrer = referrer;
        for (uint256 i = 0; i < LEVELS; i++) {
            require(nextReferrer != user, "Cyclic chain!");
            User storage ref = users[nextReferrer];
            if (ref.isActiveSubscriber) {
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
            bool isActiveSubscriber,
            uint256 activationDate
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
        isActiveSubscriber = user.isActiveSubscriber;
        activationDate = user.activationDate;
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

    // LEVEL = 1...10
    function getUserReferralsByLevel(address userAddress, uint256 level)
        public
        view
        returns (Referral[] memory)
    {
        return _getUserReferrals(userAddress, level, 1);
    }

    // Experimental function, probably may fail on a large data
    // requiredLevel = 1..10
    // currentLevel = 1..10
    function _getUserReferrals(
        address userAddress,
        uint256 requiredLevel,
        uint256 currentLevel
    ) internal view returns (Referral[] memory) {
        require(currentLevel <= requiredLevel, "Current level > level");

        address[] memory level1Referrals = getUser1LvlReferrals(userAddress);
        uint256 refCount = users[userAddress].refCount[
            requiredLevel - currentLevel
        ];
        Referral[] memory referrals = new Referral[](refCount);
        uint256 nextReferralIndex = 0;

        for (uint256 i = 0; i < level1Referrals.length; i++) {
            address referralAddress = level1Referrals[i];

            if (currentLevel == requiredLevel) {
                referrals[i] = Referral({
                    referralAddress: referralAddress,
                    level: currentLevel,
                    activationDate: users[referralAddress].activationDate,
                    isReferralSubscriptionActive: userHasAnySubscription(
                        referralAddress
                    )
                });
            } else {
                Referral[] memory theirReferrals = _getUserReferrals(
                    referralAddress,
                    requiredLevel,
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

    // LEVEL = 1...10
    function userHasSubscription(address user, uint256 level)
        public
        view
        returns (bool)
    {
        return users[user].activeLevels[level - 1] > getTimestamp();
    }

    function userHasAnySubscription(address user) public view returns (bool) {
        for (uint256 i = 1; i <= LEVELS; i++) {
            if (userHasSubscription(user, i)) {
                return true;
            }
        }
        return false;
    }

    // LEVEL = 1...10
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

    // LEVEL = 1...10
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
