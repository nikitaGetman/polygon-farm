// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface IReferralManager {
    struct Referral {
        address referralAddress;
        uint256 level;
        uint256 activationDate;
        bool isReferralSubscriptionActive;
    }

    struct AddDividendsParams {
        address user;
        uint256 reward;
        address referral;
        uint256 level;
        uint256 depositAmount;
        uint256 stakingPlanId;
        // REASONS:
        // 0 - full reward
        // 1 - no ref subscription
        // 2 - no user stake
        // 3 - trancated by user stake
        // 4 - team
        uint256 reason;
    }

    function getReferralLevels() external pure returns (uint256);

    function addUserDividends(AddDividendsParams memory params) external;

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

    function getUserReferralsByLevel(address userAddress, uint256 level)
        external
        view
        returns (Referral[] memory);
}
