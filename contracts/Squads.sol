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

    struct Squad {
        uint256 subscription; // when subscription expire
        uint256 squadsFilled; // how much squads user filled
    }

    struct Plan {
        uint256 subscriptionCost;
        uint256 reward; // reward for filling full squad
        uint256 stakingThreshold; // min staking amount that member should do
        uint256 squadSize; // amount of squad members
        IStaking authorizedStaking;
        bool isActive;
    }

    Plan[] public plans;
    mapping(address => mapping(uint256 => Squad)) private userSubscriptions;
    mapping(address => mapping(uint256 => address[])) private squadMembers;

    ERC20Burnable public subscriptionToken;
    IReferralManager public referralManager;

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

    constructor(address subscriptionToken_, address referralManager_) {
        require(subscriptionToken_ != address(0));
        require(referralManager_ != address(0));

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        subscriptionToken = ERC20Burnable(subscriptionToken_);
        referralManager = IReferralManager(referralManager_);
    }

    function subscribe(uint256 planId) public {
        require(planId < plans.length, "Incorrect plan id");

        address subscriber = _msgSender();
        Plan storage plan = plans[planId];

        require(plan.isActive, "Plan is not active");

        subscriptionToken.burnFrom(subscriber, plan.subscriptionCost);

        squadMembers[subscriber][planId] = new address[](0);
        userSubscriptions[subscriber][planId]
            .subscription = _getSubscriptionEnd();

        emit Subscribed(subscriber, planId, block.timestamp);
    }

    function tryToAddMember(
        address user,
        address member,
        uint256 amount
    ) public returns (bool) {
        int256 _planId = getSufficientPlanIdByStakingAmount(amount);
        if (_planId < 0) return false;

        uint256 planId = uint256(_planId);

        if (
            _isSenderAuthorized(planId, _msgSender()) &&
            userHasPlanSubscription(user, planId) &&
            userHasSufficientStaking(user, planId) &&
            !_isMemberInSquad(user, planId, member)
        ) {
            squadMembers[user][planId].push(member);
            uint256 membersAmount = squadMembers[user][planId].length;

            emit MemberAdded(user, planId, member, membersAmount);

            if (membersAmount >= plans[planId].squadSize) {
                Squad storage partner = userSubscriptions[user][planId];

                partner.squadsFilled += 1;
                partner.subscription = 0;

                referralManager.addUserDividends(user, plans[planId].reward);

                emit SquadFilled(user, planId, partner.squadsFilled);
            }

            return true;
        }

        return false;
    }

    // --------- Helper functions ---------
    function getUserSquadInfo(address user, uint256 planId)
        public
        view
        returns (Squad memory)
    {
        return userSubscriptions[user][planId];
    }

    function getUserSquadsInfo(address user)
        public
        view
        returns (Squad[] memory)
    {
        Squad[] memory squadsInfo = new Squad[](plans.length);

        for (uint256 i = 0; i < plans.length; i++) {
            squadsInfo[i] = getUserSquadInfo(user, i);
        }

        return squadsInfo;
    }

    function getUserSquadMembers(address user, uint256 planId)
        public
        view
        returns (address[] memory)
    {
        return squadMembers[user][planId];
    }

    function getPlans() public view returns (Plan[] memory) {
        return plans;
    }

    function userHasSufficientStaking(address user, uint256 planId)
        public
        view
        returns (bool)
    {
        IStaking.Stake[] memory stakes = plans[planId]
            .authorizedStaking
            .getUserStakes(user);

        for (uint256 i = 0; i < stakes.length; i++) {
            // stake is: active + in SAV token + sufficient amount
            if (
                stakes[i].timeEnd > block.timestamp &&
                !stakes[i].isToken2 &&
                getSufficientPlanIdByStakingAmount(stakes[i].amount) ==
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
        return userSubscriptions[user][planId].subscription > block.timestamp;
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
        address[] memory squad = squadMembers[user][planId];

        for (uint256 i = 0; i < squad.length; i++) {
            if (squad[i] == member) return true;
        }

        return false;
    }

    function _getSubscriptionEnd() internal view returns (uint256) {
        return block.timestamp + SUBSCRIPTION_PERIOD_DAYS * 1 days;
    }

    function _isSenderAuthorized(uint256 planId, address contractAddress)
        internal
        view
        returns (bool)
    {
        return address(plans[planId].authorizedStaking) == contractAddress;
    }

    // --------- Administrative functions ---------
    function addPlan(
        uint256 subscriptionCost_,
        uint256 reward_,
        uint256 stakingThreshold_,
        uint256 squadSize_,
        address authorizedStaking_
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        Plan memory plan = Plan(
            subscriptionCost_,
            reward_,
            stakingThreshold_,
            squadSize_,
            IStaking(authorizedStaking_),
            true
        );

        plans.push(plan);
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

    function updatePlanAuthorizedContract(
        uint256 planId,
        address contractAddress
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        plans[planId].authorizedStaking = IStaking(contractAddress);
    }

    function updatePlanActivity(uint256 planId, bool isActive)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        plans[planId].isActive = isActive;
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
}
