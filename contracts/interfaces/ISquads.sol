// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface ISquads {
    struct Squad {
        uint256 subscription; // when subscription expire
        uint256 squadsFilled; // how much squads user filled
    }

    struct SquadPlan {
        uint256 index;
        uint256 subscriptionCost;
        uint256 reward; // reward for filling full squad
        uint256 stakingThreshold; // min staking amount that member should do
        uint256 squadSize; // amount of squad members
        uint256 stakingPlanId;
        bool isActive;
    }

    function subscribe(uint256 planId) external;

    function tryToAddMember(
        uint256 stakingPlanId,
        address user,
        address member,
        uint256 amount
    ) external returns (bool);

    function getUserSquadMembers(address user, uint256 planId)
        external
        view
        returns (address[] memory);

    function userHasSufficientStaking(address user, uint256 planId)
        external
        view
        returns (bool);

    function getUserSubscription(address user, uint256 planId)
        external
        view
        returns (Squad memory);

    function hasAnySubscription(address user) external view returns (bool);

    function userHasPlanSubscription(address user, uint256 planId)
        external
        view
        returns (bool);

    function getSufficientPlanIdByStakingAmount(
        uint256 stakingPlanId,
        uint256 amount
    ) external view returns (int256);

    function getPlan(uint256 planId) external view returns (SquadPlan memory);

    function getPlans() external view returns (SquadPlan[] memory);

    function getActivePlans() external view returns (SquadPlan[] memory);
}
