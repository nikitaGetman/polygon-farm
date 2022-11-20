// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IStaking {
    struct StakingPlan {
        bool isActive;
        uint256 subscriptionCost;
        uint256 subscriptionDuration;
        uint256 stakingDuration;
        uint256 profitPercent;
        uint256 totalStakesToken1No;
        uint256 totalStakesToken2No;
        uint256 totalStakedToken1;
        uint256 totalStakedToken2;
        uint256 currentToken1Locked;
        uint256 currentToken2Locked;
        uint256 totalClaimed;
    }

    struct Stake {
        uint256 amount;
        uint256 timeStart;
        uint256 timeEnd;
        uint256 profitPercent;
        uint256 profit;
        bool isClaimed;
        bool isToken2;
    }

    struct Staker {
        Stake[] stakes;
        uint256 subscription;
        uint256 totalClaimed;
        uint256 currentToken1Staked;
        uint256 currentToken2Staked;
    }

    struct UserStakingInfo {
        uint256 totalClaimed;
        uint256 currentToken1Staked;
        uint256 currentToken2Staked;
        bool isSubscribed;
        uint256 subscribedTill;
    }

    struct StakeWithRewardsInfo {
        Stake stake;
        uint256 reward;
    }

    function deposit(
        uint256 planId,
        uint256 depositAmount,
        bool isToken2,
        address referrer
    ) external;

    function withdraw(uint256 planId, uint256 stakeId) external;

    function subscribe(uint256 planId) external;

    // --------- Helper functions ---------
    function getUserPlanInfo(uint256 planId, address userAddress)
        external
        view
        returns (UserStakingInfo memory);

    function getUserStakes(uint256 planId, address userAddress)
        external
        view
        returns (Stake[] memory stakes);

    function getAvailableStakeReward(
        uint256 planId,
        address userAddress,
        uint256 stakeId
    ) external view returns (uint256);

    function hasSubscription(uint256 planId, address user)
        external
        view
        returns (bool);

    function hasAnySubscription(address user) external view returns (bool);
}
