// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IStaking.sol";
import "./interfaces/ISquads.sol";
import "./interfaces/IReferralManager.sol";

contract Squads is ISquads, AccessControl {
    uint256 public SUBSCRIPTION_PERIOD_DAYS = 365;

    SquadPlan[] public plans;
    mapping(uint256 => mapping(address => Squad)) private userSubscriptions;
    mapping(uint256 => mapping(address => address[])) private squadMembers;

    ERC20Burnable public subscriptionToken;
    IReferralManager public referralManager;
    IStaking public stakingContract;

    event Subscribed(
        address indexed subscriber,
        uint256 indexed planId,
        uint256 indexed timestamp
    );
    event SquadFilled(
        address indexed user,
        uint256 indexed planId,
        uint256 indexed squadCount
    );
    event MemberAdded(
        address indexed user,
        uint256 indexed planId,
        address member,
        uint256 squadMembers
    );
    event SquadPlanCreated(
        uint256 indexed planId,
        uint256 subscriptionCost,
        uint256 reward,
        uint256 stakingThreshold,
        uint256 squadSize,
        uint256 stakingPlanId
    );
    event SquadActivityChanged(uint256 indexed planId, bool isActive);

    constructor(
        address subscriptionToken_,
        address referralManager_,
        address stakingContract_
    ) {
        require(subscriptionToken_ != address(0));
        require(referralManager_ != address(0));
        require(stakingContract_ != address(0));

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        subscriptionToken = ERC20Burnable(subscriptionToken_);
        referralManager = IReferralManager(referralManager_);
        stakingContract = IStaking(stakingContract_);
    }

    function subscribe(uint256 planId) public {
        require(planId < plans.length, "Incorrect plan id");

        address subscriber = _msgSender();
        SquadPlan storage plan = plans[planId];

        require(plan.isActive, "Plan is not active");

        subscriptionToken.burnFrom(subscriber, plan.subscriptionCost);

        squadMembers[planId][subscriber] = new address[](0);

        uint256 startDate = userSubscriptions[planId][subscriber].subscription <
            getTimestamp()
            ? getTimestamp()
            : userSubscriptions[planId][subscriber].subscription;
        userSubscriptions[planId][subscriber].subscription =
            startDate +
            SUBSCRIPTION_PERIOD_DAYS *
            1 days;

        emit Subscribed(subscriber, planId, startDate);
    }

    function tryToAddMember(
        uint256 stakingPlanId,
        address referrer,
        address member,
        uint256 amount
    ) public returns (bool) {
        if (referrer == address(0) || member == address(0)) return false;

        int256 _planId = getSufficientPlanIdByStakingAmount(amount);

        if (_planId < 0) return false;

        uint256 planId = uint256(_planId);

        if (plans[planId].stakingPlanId != stakingPlanId) return false;

        if (
            _isSenderAuthorized(_msgSender()) &&
            userHasPlanSubscription(referrer, planId) &&
            userHasSufficientStaking(referrer, planId) &&
            !_isMemberInSquad(referrer, planId, member)
        ) {
            squadMembers[planId][referrer].push(member);
            uint256 membersAmount = squadMembers[planId][referrer].length;

            emit MemberAdded(referrer, planId, member, membersAmount);

            if (membersAmount >= plans[planId].squadSize) {
                Squad storage partner = userSubscriptions[planId][referrer];

                partner.squadsFilled += 1;
                partner.subscription = 0;

                referralManager.addUserDividends(
                    IReferralManager.AddDividendsParams(
                        referrer,
                        plans[planId].reward,
                        address(this),
                        1,
                        plans[planId].stakingThreshold,
                        stakingPlanId
                    )
                );

                emit SquadFilled(referrer, planId, partner.squadsFilled);
            }

            return true;
        }

        return false;
    }

    // --------- Helper functions ---------
    function getUserSubscription(address user, uint256 planId)
        public
        view
        returns (Squad memory)
    {
        return userSubscriptions[planId][user];
    }

    function getUserSquadMembers(address user, uint256 planId)
        public
        view
        returns (address[] memory)
    {
        return squadMembers[planId][user];
    }

    function getPlan(uint256 planId) public view returns (SquadPlan memory) {
        return plans[planId];
    }

    function getPlans() public view returns (SquadPlan[] memory) {
        return plans;
    }

    function userHasSufficientStaking(address user, uint256 planId)
        public
        view
        returns (bool)
    {
        IStaking.Stake[] memory stakes = stakingContract.getUserStakes(
            plans[planId].stakingPlanId,
            user
        );

        for (uint256 i = stakes.length; i > 0; i--) {
            // stake is: active + in SAV token + sufficient amount
            if (
                stakes[i - 1].timeEnd > block.timestamp &&
                !stakes[i - 1].isToken2 &&
                getSufficientPlanIdByStakingAmount(stakes[i - 1].amount) ==
                int256(planId)
            ) return true;
        }

        return false;
    }

    function userHasPlanSubscription(address user, uint256 planId)
        public
        view
        returns (bool)
    {
        return userSubscriptions[planId][user].subscription > block.timestamp;
    }

    function getSufficientPlanIdByStakingAmount(uint256 amount)
        public
        view
        returns (int256)
    {
        int256 planId = -1;
        for (uint256 i = 0; i < plans.length; i++) {
            if (amount >= plans[i].stakingThreshold) planId = int256(i);
        }

        return planId;
    }

    function _isMemberInSquad(
        address user,
        uint256 planId,
        address member
    ) internal view returns (bool) {
        address[] memory squad = squadMembers[planId][user];

        for (uint256 i = 0; i < squad.length; i++) {
            if (squad[i] == member) return true;
        }

        return false;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function _isSenderAuthorized(address contractAddress)
        internal
        view
        returns (bool)
    {
        return address(stakingContract) == contractAddress;
    }

    // --------- Administrative functions ---------
    function addPlan(
        uint256 subscriptionCost_,
        uint256 reward_,
        uint256 stakingThreshold_,
        uint256 squadSize_,
        uint256 stakingPlanId_
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        SquadPlan memory plan = SquadPlan(
            subscriptionCost_,
            reward_,
            stakingThreshold_,
            squadSize_,
            stakingPlanId_,
            true
        );

        plans.push(plan);

        emit SquadPlanCreated(
            plans.length - 1,
            subscriptionCost_,
            reward_,
            stakingThreshold_,
            squadSize_,
            stakingPlanId_
        );
    }

    function updatePlanSubscriptionCost(
        uint256 planId,
        uint256 subscriptionCost
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        plans[planId].subscriptionCost = subscriptionCost;
    }

    function updatePlanReward(uint256 planId, uint256 reward)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        plans[planId].reward = reward;
    }

    function updatePlanStakingThreshold(uint256 planId, uint256 threshold)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        plans[planId].stakingThreshold = threshold;
    }

    function updatePlanSquadSize(uint256 planId, uint256 size)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        plans[planId].squadSize = size;
    }

    function updatePlanStakingId(uint256 planId, uint256 stakingPlanId)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        plans[planId].stakingPlanId = stakingPlanId;
    }

    function updatePlanActivity(uint256 planId, bool isActive)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        plans[planId].isActive = isActive;
        emit SquadActivityChanged(planId, isActive);
    }

    function updateSubscriptionPeriod(uint256 numDays)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        SUBSCRIPTION_PERIOD_DAYS = numDays;
    }

    function updateSubscriptionToken(address token)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        subscriptionToken = ERC20Burnable(token);
    }

    function updateSubscriptionReferralManager(address referralManager_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        referralManager = IReferralManager(referralManager_);
    }

    function updateStakingContract(address stakingContract_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingContract = IStaking(stakingContract_);
    }
}
