// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface ISquads {
    function subscribe(uint256 planId) external;

    function tryToAddMember(
        uint256 stakingPlanId,
        address user,
        address member,
        uint256 amount
    ) external returns (bool);

    function userHasPlanSubscription(address user, uint256 planId)
        external
        view
        returns (bool);

    function getSufficientPlanIdByStakingAmount(uint256 amount)
        external
        view
        returns (int256);
}
