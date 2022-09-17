// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IReferralManager {
    function getReferralLevels() external pure returns (uint256);

    function addUserDividends(address user, uint256 reward) external;

    function getUserReferrer(address user) external view returns (address);

    function setUserReferrer(address user, address referrer) external;

    function userHasSubscription(address user, uint256 level)
        external
        view
        returns (bool);

    function calculateRefReward(uint256 amount, uint256 level)
        external
        view
        returns (uint256);
}
