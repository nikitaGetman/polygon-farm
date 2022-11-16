// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IStaking.sol";
import "./interfaces/ISquads.sol";
import "./interfaces/IReferralManager.sol";

contract Staking is IStaking, AccessControl {
    StakingPlan[] public stakingPlans;

    mapping(uint256 => mapping(address => Staker)) private users;

    uint256 public PERCENTS_DIVIDER = 1000;
    uint256 public TIME_STEP = 1 days;
    uint256 public MIN_STAKE_LIMIT = 1 * 1e17; // 0.1 Token

    bool public shouldAddReferrerOnToken2Stake;

    ERC20Burnable public token1;
    ERC20Burnable public token2;
    IReferralManager public referralManager;
    ISquads public squadsManager;
    address private rewardPool;

    event Staked(
        address indexed user,
        uint256 indexed planId,
        uint256 indexed stakeIndex,
        uint256 amount,
        uint256 profit,
        bool isToken2,
        uint256 timestamp
    );
    event Claimed(
        address indexed user,
        uint256 indexed planId,
        uint256 indexed stakeIndex,
        uint256 amount,
        bool isToken2,
        uint256 timestamp
    );
    event StakingPlanCreated(
        uint256 indexed planId,
        uint256 duration,
        uint256 rewardPercent
    );
    event ActivityChanged(uint256 indexed planId, bool isActive);
    event Subscribed(address indexed user, uint256 indexed planId);

    constructor(
        address token1_,
        address token2_,
        address rewardPool_,
        address referralManager_,
        address squadsManager_
    ) {
        require(token1_ != address(0));
        require(token2_ != address(0));
        require(rewardPool_ != address(0));
        require(referralManager_ != address(0));

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        rewardPool = rewardPool_;

        token1 = ERC20Burnable(token1_);
        token2 = ERC20Burnable(token2_);
        referralManager = IReferralManager(referralManager_);
        squadsManager = ISquads(squadsManager_);
    }

    function deposit(
        uint256 planId,
        uint256 depositAmount,
        bool isToken2,
        address referrer
    ) public {
        require(stakingPlans[planId].isActive, "Staking plan is not active");
        require(
            hasSubscription(planId, _msgSender()),
            "You are not subscriber"
        );
        require(
            depositAmount >= MIN_STAKE_LIMIT,
            "Stake amount less than minimum value"
        );
        require(referrer != _msgSender(), "Referrer can not be sender");
        uint256 stakingProfit = calculateStakeProfit(planId, depositAmount);

        require(
            stakingProfit <= token1.balanceOf(rewardPool),
            "Not enough tokens for reward"
        );
        if (isToken2) {
            token2.burnFrom(_msgSender(), depositAmount);
        } else {
            token1.transferFrom(_msgSender(), address(this), depositAmount);
        }
        token1.transferFrom(rewardPool, address(this), stakingProfit);

        StakingPlan storage plan = stakingPlans[planId];
        Staker storage user = users[planId][_msgSender()];

        Stake memory newStake = Stake({
            amount: depositAmount,
            timeStart: getTimestamp(),
            timeEnd: getTimestamp() + plan.stakingDuration * TIME_STEP,
            profitPercent: plan.profitPercent,
            profit: stakingProfit,
            isClaimed: false,
            isToken2: isToken2
        });

        user.stakes.push(newStake);

        if (isToken2) {
            user.currentToken2Staked += depositAmount;
            plan.totalStakedToken2 += depositAmount;
            plan.currentToken2Locked += depositAmount;
            plan.totalStakesToken2No += 1;
        } else {
            user.currentToken1Staked += depositAmount;
            plan.totalStakedToken1 += depositAmount;
            plan.currentToken1Locked += depositAmount;
            plan.totalStakesToken1No += 1;
        }

        // Referrals
        if (!isToken2 || shouldAddReferrerOnToken2Stake) {
            address userReferrer = referralManager.getUserReferrer(
                _msgSender()
            );
            if (userReferrer == address(0) && referrer != address(0)) {
                referralManager.setUserReferrer(_msgSender(), referrer);
                userReferrer = referralManager.getUserReferrer(_msgSender());
            }
            _assignRefRewards(planId, _msgSender(), stakingProfit);

            // Squads
            if (address(squadsManager) != address(0)) {
                try
                    squadsManager.tryToAddMember(
                        planId,
                        userReferrer,
                        _msgSender(),
                        depositAmount
                    )
                {} catch {}
            }
        }
        emit Staked(
            _msgSender(),
            planId,
            user.stakes.length - 1,
            newStake.amount,
            newStake.profit,
            newStake.isToken2,
            getTimestamp()
        );
    }

    function withdraw(uint256 planId, uint256 stakeId) public {
        StakingPlan storage plan = stakingPlans[planId];
        Staker storage user = users[planId][_msgSender()];
        Stake storage stake = user.stakes[stakeId];

        require(!stake.isClaimed, "Stake is already claimed");
        require(stake.timeEnd <= getTimestamp(), "Stake is not ready yet");

        uint256 withdrawAmount = _getAvailableStakeReward(stake);
        stake.isClaimed = true;

        token1.transfer(_msgSender(), withdrawAmount);
        user.totalClaimed += withdrawAmount;
        plan.totalClaimed += withdrawAmount;
        if (stake.isToken2) {
            user.currentToken2Staked -= stake.amount;
            plan.currentToken2Locked -= stake.amount;
        } else {
            user.currentToken1Staked -= stake.amount;
            plan.currentToken1Locked -= stake.amount;
        }

        emit Claimed(
            _msgSender(),
            planId,
            stakeId,
            withdrawAmount,
            stake.isToken2,
            getTimestamp()
        );
    }

    function _assignRefRewards(
        uint256 planId,
        address depositSender,
        uint256 stakingReward
    ) internal {
        uint256 totalLevels = referralManager.getReferralLevels();
        address currentLevelUser = depositSender;

        for (uint256 level = 1; level <= totalLevels; level++) {
            address referrer = referralManager.getUserReferrer(
                currentLevelUser
            );

            if (referrer != address(0)) {
                if (referralManager.userHasSubscription(referrer, level)) {
                    uint256 refReward = referralManager.calculateRefReward(
                        stakingReward,
                        level
                    );
                    uint256 currentToken1Staked = users[planId][referrer]
                        .currentToken1Staked;

                    uint256 truncatedReward = refReward <= currentToken1Staked
                        ? refReward
                        : currentToken1Staked;

                    referralManager.addUserDividends(referrer, truncatedReward);
                }

                currentLevelUser = referrer;
            } else break;
        }
    }

    function subscribe(uint256 planId) public {
        StakingPlan storage plan = stakingPlans[planId];
        require(plan.isActive, "Staking plan is not active");

        token1.burnFrom(_msgSender(), plan.subscriptionCost);
        uint256 startDate = users[planId][_msgSender()].subscription <
            getTimestamp()
            ? getTimestamp()
            : users[planId][_msgSender()].subscription;
        users[planId][_msgSender()].subscription =
            startDate +
            plan.subscriptionDuration *
            TIME_STEP;

        emit Subscribed(_msgSender(), planId);
    }

    function addStakingPlan(
        uint256 subscriptionCost,
        uint256 subscriptionDuration,
        uint256 stakingDuration,
        uint256 profitPercent
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(stakingDuration > 0, "Insufficient duration");
        require(profitPercent > 0, "Insufficient profit percent");

        StakingPlan memory plan = StakingPlan({
            isActive: true,
            subscriptionCost: subscriptionCost,
            subscriptionDuration: subscriptionDuration,
            stakingDuration: stakingDuration,
            profitPercent: profitPercent,
            totalStakesToken1No: 0,
            totalStakesToken2No: 0,
            totalStakedToken1: 0,
            totalStakedToken2: 0,
            currentToken1Locked: 0,
            currentToken2Locked: 0,
            totalClaimed: 0
        });

        stakingPlans.push(plan);

        emit StakingPlanCreated(
            stakingPlans.length - 1,
            stakingDuration,
            profitPercent
        );
    }

    function calculateStakeProfit(uint256 planId, uint256 amount)
        public
        view
        returns (uint256)
    {
        return (amount * stakingPlans[planId].profitPercent) / PERCENTS_DIVIDER;
    }

    function _getAvailableStakeReward(Stake storage stake)
        internal
        view
        returns (uint256)
    {
        if (stake.timeStart == 0 || stake.isClaimed) return 0;

        uint256 stakeReward = stake.isToken2
            ? stake.profit
            : stake.amount + stake.profit;

        if (stake.timeEnd <= getTimestamp()) return stakeReward;

        return
            ((getTimestamp() - stake.timeStart) * stakeReward) /
            (stake.timeEnd - stake.timeStart);
    }

    // --------- Helper functions ---------
    function getStakingPlans() public view returns (StakingPlan[] memory) {
        return stakingPlans;
    }

    function getUserPlanInfo(uint256 planId, address userAddress)
        public
        view
        returns (UserStakingInfo memory)
    {
        Staker storage user = users[planId][userAddress];

        UserStakingInfo memory info = UserStakingInfo(
            user.totalClaimed,
            user.currentToken1Staked,
            user.currentToken2Staked,
            hasSubscription(planId, userAddress),
            user.subscription
        );

        return info;
    }

    function getUserPlansInfo(address userAddress)
        public
        view
        returns (UserStakingInfo[] memory)
    {
        UserStakingInfo[] memory plansInfo = new UserStakingInfo[](
            stakingPlans.length
        );

        for (uint256 i = 0; i < stakingPlans.length; i++) {
            plansInfo[i] = getUserPlanInfo(i, userAddress);
        }

        return plansInfo;
    }

    function getUserStakes(uint256 planId, address userAddress)
        public
        view
        returns (Stake[] memory)
    {
        return users[planId][userAddress].stakes;
    }

    // TODO: can i optimize it?
    function getUserStakesWithRewards(uint256 planId, address userAddress)
        public
        view
        returns (StakeWithRewardsInfo[] memory)
    {
        uint256 stakesLength = users[planId][userAddress].stakes.length;
        StakeWithRewardsInfo[] memory stakesInfo = new StakeWithRewardsInfo[](
            stakesLength
        );

        for (uint256 i = 0; i < stakesLength; i++) {
            stakesInfo[i].stake = users[planId][userAddress].stakes[i];
            if (!stakesInfo[i].stake.isClaimed) {
                stakesInfo[i].reward = _getAvailableStakeReward(
                    users[planId][userAddress].stakes[i]
                );
            }
        }

        return stakesInfo;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function getAvailableStakeReward(
        uint256 planId,
        address userAddress,
        uint256 stakeId
    ) public view returns (uint256) {
        return
            _getAvailableStakeReward(
                users[planId][userAddress].stakes[stakeId]
            );
    }

    function hasSubscription(uint256 planId, address user)
        public
        view
        returns (bool)
    {
        return users[planId][user].subscription > getTimestamp();
    }

    // --------- Administrative functions ---------
    function updateShouldAddReferrerOnToken2Stake(bool value)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        shouldAddReferrerOnToken2Stake = value;
    }

    function updateRewardPool(address poolAddress_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardPool = poolAddress_;
    }

    function updateToken1(address token1_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token1 = ERC20Burnable(token1_);
    }

    function updateToken2(address token2_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token2 = ERC20Burnable(token2_);
    }

    function updateReferralManager(address referralManager_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        referralManager = IReferralManager(referralManager_);
    }

    function updateSquadsManager(address squadsManager_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        squadsManager = ISquads(squadsManager_);
    }

    function updatePercentDivider(uint256 divider_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        PERCENTS_DIVIDER = divider_;
    }

    function updateTimeStep(uint256 step_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        TIME_STEP = step_;
    }

    function updateMinStakeLimit(uint256 minLimit_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        MIN_STAKE_LIMIT = minLimit_;
    }

    function updatePlanActivity(uint256 planId, bool isActive)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingPlans[planId].isActive = isActive;

        emit ActivityChanged(planId, isActive);
    }

    function updatePlanDurationDays(uint256 planId, uint256 duration)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingPlans[planId].stakingDuration = duration;
    }

    function updatePlanReward(uint256 planId, uint256 percent)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingPlans[planId].profitPercent = percent;
    }

    function updatePlanSubscriptionCost(uint256 planId, uint256 cost)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingPlans[planId].subscriptionCost = cost;
    }

    function updatePlanSubscriptionPeriod(
        uint256 planId,
        uint256 subscriptionDuration
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        stakingPlans[planId].subscriptionDuration = subscriptionDuration;
    }
}
