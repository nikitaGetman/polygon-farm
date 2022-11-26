// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IReferralManager.sol";
import "./interfaces/IStaking.sol";
import "./interfaces/ISquads.sol";

contract Helper is Ownable {
    IERC20 public token1;
    IERC20 public token2;
    IStaking public staking;
    IReferralManager public referralManager;
    ISquads public squads;

    constructor(
        address _token1,
        address _token2,
        address _staking,
        address _referralManager,
        address _squads
    ) Ownable() {
        token1 = IERC20(_token1);
        token2 = IERC20(_token2);
        staking = IStaking(_staking);
        referralManager = IReferralManager(_referralManager);
        squads = ISquads(_squads);
    }

    // ------- HELPER FUNCTIONS -------
    struct ReferralFullInfo {
        address referralAddress;
        uint256 level;
        uint256 activationDate;
        uint256 token1Balance;
        uint256 token2Balance;
        bool isReferralSubscriptionActive;
        bool isStakingSubscriptionActive;
    }

    // level = 1..10
    function getUserReferralsFullInfoByLevel(address user, uint256 level)
        public
        view
        returns (ReferralFullInfo[] memory)
    {
        IReferralManager.Referral[] memory referrals = referralManager
            .getUserReferralsByLevel(user, level);

        ReferralFullInfo[] memory referralsFullInfo = new ReferralFullInfo[](
            referrals.length
        );

        for (uint256 i = 0; i < referrals.length; i++) {
            address refAddress = referrals[i].referralAddress;
            referralsFullInfo[i] = ReferralFullInfo({
                referralAddress: refAddress,
                level: referrals[i].level,
                activationDate: referrals[i].activationDate,
                isReferralSubscriptionActive: referrals[i]
                    .isReferralSubscriptionActive,
                token1Balance: token1.balanceOf(refAddress),
                token2Balance: token2.balanceOf(refAddress),
                isStakingSubscriptionActive: staking.hasAnySubscription(
                    refAddress
                )
            });
        }

        return referralsFullInfo;
    }

    // Squads
    struct UserSquadInfo {
        ISquads.Squad squadStatus;
        ISquads.SquadPlan plan;
        address[] members;
        bool userHasSufficientStaking;
    }

    function getUserSquadInfo(uint256 planId, address user)
        public
        view
        returns (UserSquadInfo memory)
    {
        ISquads.Squad memory squadStatus = squads.getUserSubscription(
            user,
            planId
        );
        ISquads.SquadPlan memory plan = squads.getPlan(planId);
        address[] memory members = squads.getUserSquadMembers(user, planId);
        bool hasStaking = squads.userHasSufficientStaking(user, planId);

        return UserSquadInfo(squadStatus, plan, members, hasStaking);
    }

    function getUserSquadsInfo(address user)
        public
        view
        returns (UserSquadInfo[] memory)
    {
        uint256 length = squads.getPlans().length;

        UserSquadInfo[] memory squadsInfo = new UserSquadInfo[](length);

        for (uint256 i = 0; i < length; i++) {
            squadsInfo[i] = getUserSquadInfo(i, user);
        }

        return squadsInfo;
    }

    // --------------------------------

    function updateToken1(address _token1) public onlyOwner {
        token1 = IERC20(_token1);
    }

    function updateToken2(address _token2) public onlyOwner {
        token2 = IERC20(_token2);
    }

    function updateStaking(address _staking) public onlyOwner {
        staking = IStaking(_staking);
    }

    function updateReferralManager(address _referralManager) public onlyOwner {
        referralManager = IReferralManager(_referralManager);
    }

    function updateSquads(address _squads) public onlyOwner {
        squads = ISquads(_squads);
    }
}
