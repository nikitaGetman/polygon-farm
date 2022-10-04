// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IStaking {
    struct Stake {
        uint256 stakeId;
        uint256 amount;
        uint256 timeStart;
        uint256 timeEnd;
        uint256 percent;
        uint256 profit;
        bool isClaimed;
        bool isToken2;
    }

    struct User {
        Stake[] stakes;
        uint256 totalStakedToken1;
        uint256 totalStakedToken2;
        uint256 totalClaimed;
        uint256 currentToken1Staked;
    }

    function deposit(
        uint256 depositAmount_,
        bool isToken2_,
        address referrer
    ) external;

    function withdraw(uint256 stakeId_) external;

    function subscribe() external;

    // --------- Helper functions ---------
    function getContractInfo()
        external
        view
        returns (
            uint256 _durationDays,
            uint256 _reward,
            bool _isActive,
            uint256 _totalStakesToken1No,
            uint256 _totalStakesToken2No,
            uint256 _totalStakedToken1,
            uint256 _totalStakedToken2,
            uint256 _totalClaimed,
            uint256 _subscriptionCost,
            uint256 _subscriptionPeriodDays
        );

    function getUserInfo(address userAddr_)
        external
        view
        returns (
            uint256 _totalStakedToken1,
            uint256 _totalStakedToken2,
            uint256 _totalClaimed,
            uint256 _currentToken1Staked,
            bool _subscribed,
            uint256 _subscribedTill
        );

    function getUserStakes(address userAddr_)
        external
        view
        returns (Stake[] memory stakes);

    function getTimestamp() external view returns (uint256);

    function calculateStakeProfit(uint256 amount_)
        external
        view
        returns (uint256);

    function calculateStakeReward(address userAddr_, uint256 stakeId_)
        external
        view
        returns (uint256);

    function min(uint256 a, uint256 b) external pure returns (uint256);

    // --------- Administrative functions ---------
    function setActive(bool value_) external;

    function updateShouldAddReferrerOnToken2Stake(bool value) external;

    function updateRewardPool(address poolAddress_) external;

    function updateToken1(address token1_) external;

    function updateToken2(address token2_) external;

    function updateReferralManager(address referralManager_) external;

    function updatePercentDivider(uint256 divider_) external;

    function updateTimeStep(uint256 step_) external;

    function updateMinStakeLimit(uint256 minLimit_) external;

    function updateDurationDays(uint256 duration_) external;

    function updateReward(uint256 newReward_) external;

    function updateSubscriptionCost(uint256 cost_) external;

    function updateSubscriptionPeriod(uint256 periodDays_) external;

    function updateSubscriptionToken(address token_) external;
}
