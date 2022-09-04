// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./tokens/Token1.sol";
import "./tokens/Token2.sol";
import "./extensions/Subscribable.sol";

contract Staking is AccessControl, Subscribable {
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
        // address referrer;
        // uint256[8] refCount;
        // uint256 totalRefDividends;
        // uint256 totalRefDividendsClaimed;
    }

    mapping(address => User) public users;

    uint256 public PERCENTS_DIVIDER = 1000;
    uint256 public TIME_STEP = 1 days;
    uint256 public MIN_STAKE_LIMIT = 1 * 1e17; // 0.1 Token
    // uint256 public WALLET_DEPOSIT_LIMIT = 25 * 1e18; // 25 Tokens
    // uint256[] public REFERRAL_PERCENTS	= [50, 1, 1];   // 5% 0.1% 0.1%
    address private _rewardPool;
    uint256 public durationDays;
    uint256 public reward; // percents, e.g. 70 == 7%

    bool public isActive;

    uint256 public totalStakesToken1No;
    uint256 public totalStakesToken2No;
    uint256 public totalStakedToken1;
    uint256 public totalStakedToken2;
    uint256 public totalClaimed;
    // uint256 public totalRefDividends;
    // uint256 public totalRefDividendsClaimed;

    Token1 public token1;
    Token2 public token2;

    event Staked(
        address indexed user,
        uint256 indexed stakeIndex,
        uint256 amount,
        uint256 profit,
        bool isToken2,
        uint256 indexed timestamp
    );
    event Claimed(
        address indexed user,
        uint256 indexed stakeIndex,
        uint256 amount,
        bool isToken2,
        uint256 indexed timestamp
    );
    event ActivityChanged(bool isActive, address admin);

    constructor(
        address token1_,
        address token2_,
        address rewardPool_,
        uint256 durationDays_,
        uint256 rewardPercent_,
        uint256 subscriptionCost_,
        uint256 subscriptionPeriodDays_
    ) Subscribable(token1_, subscriptionCost_, subscriptionPeriodDays_) {
        require(token1_ != address(0), "Zero address for token 1");
        require(token2_ != address(0), "Zero address for token 2");
        require(rewardPool_ != address(0), "Zero address for reward pool");
        require(durationDays_ > 0, "Duration should be greater than 0");
        require(rewardPercent_ > 0, "Reward should be greater than 0");

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());

        _rewardPool = rewardPool_;
        durationDays = durationDays_;
        reward = rewardPercent_;

        token1 = Token1(token1_);
        token2 = Token2(token2_);
    }

    function deposit(uint256 depositAmount_, bool isToken2_)
        public
        whenActive
        subscribersOnly
    {
        require(
            depositAmount_ >= MIN_STAKE_LIMIT,
            "Stake amount less than minimum value"
        );
        uint256 profit = calculateStakeProfit(depositAmount_);

        require(
            profit <= token1.balanceOf(_rewardPool),
            "Not enough tokens for reward"
        );
        if (isToken2_) {
            token2.burnFrom(_msgSender(), depositAmount_);
        } else {
            token1.transferFrom(_msgSender(), address(this), depositAmount_);
        }
        token1.transferFrom(_rewardPool, address(this), profit);

        User storage user = users[_msgSender()];
        uint256 stakeId = user.stakes.length;

        Stake memory newStake = Stake(
            stakeId,
            depositAmount_,
            block.timestamp,
            block.timestamp + durationDays * TIME_STEP,
            reward,
            profit,
            false,
            isToken2_
        );

        user.stakes.push(newStake);

        if (isToken2_) {
            user.totalStakedToken2 += depositAmount_;
            totalStakedToken2 += depositAmount_;
            totalStakesToken2No++;
        } else {
            user.totalStakedToken1 += depositAmount_;
            totalStakedToken1 += depositAmount_;
            totalStakesToken1No++;
        }

        emit Staked(
            _msgSender(),
            newStake.stakeId,
            newStake.amount,
            newStake.profit,
            newStake.isToken2,
            block.timestamp
        );
    }

    function withdraw(uint256 stakeId_) public {
        User storage user = users[_msgSender()];
        require(stakeId_ < user.stakes.length, "Invalid stake id");

        Stake storage stake = user.stakes[stakeId_];
        require(!stake.isClaimed, "Stake is already claimed");
        require(stake.timeEnd <= block.timestamp, "Stake is not ready yet");

        uint256 withdrawAmount = _calculateStakeReward(stake);
        stake.isClaimed = true;

        token1.transfer(_msgSender(), withdrawAmount);
        user.totalClaimed += withdrawAmount;
        totalClaimed += withdrawAmount;

        emit Claimed(
            _msgSender(),
            stake.stakeId,
            withdrawAmount,
            stake.isToken2,
            block.timestamp
        );
    }

    function subscribe() public {
        _subscribe(_msgSender());
    }

    // --------- Helper functions ---------
    function getContractInfo()
        public
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
        )
    {
        _durationDays = durationDays;
        _reward = reward;
        _isActive = isActive;
        _totalStakesToken1No = totalStakesToken1No;
        _totalStakesToken2No = totalStakesToken2No;
        _totalStakedToken1 = totalStakedToken1;
        _totalStakedToken2 = totalStakedToken2;
        _totalClaimed = totalClaimed;
        _subscriptionCost = subscriptionCost;
        _subscriptionPeriodDays = subscriptionPeriodDays;
    }

    function getUserInfo(address userAddr_)
        public
        view
        returns (
            uint256 _totalStakedToken1,
            uint256 _totalStakedToken2,
            uint256 _totalClaimed,
            bool _subscribed,
            uint256 _subscribedTill
        )
    {
        User storage user = users[userAddr_];

        _totalStakedToken1 = user.totalStakedToken1;
        _totalStakedToken2 = user.totalStakedToken2;
        _totalClaimed = user.totalClaimed;
        _subscribed = isSubscriber(userAddr_);
        _subscribedTill = _subscribed ? subscribers[userAddr_] : 0;
    }

    function getUserStakes(address userAddr_)
        public
        view
        returns (Stake[] memory stakes)
    {
        return users[userAddr_].stakes;
    }

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function calculateStakeProfit(uint256 amount_)
        public
        view
        returns (uint256)
    {
        return (amount_ * reward) / PERCENTS_DIVIDER;
    }

    function calculateStakeReward(address userAddr_, uint256 stakeId_)
        public
        view
        returns (uint256)
    {
        return _calculateStakeReward(users[userAddr_].stakes[stakeId_]);
    }

    function _calculateStakeReward(Stake storage stake)
        internal
        view
        returns (uint256)
    {
        if (stake.timeStart == 0 || stake.isClaimed) return 0;

        uint256 stakeReward = stake.isToken2
            ? stake.profit
            : stake.amount + stake.profit;

        if (stake.timeEnd <= block.timestamp) return stakeReward;

        return
            ((block.timestamp - stake.timeStart) * stakeReward) /
            (stake.timeEnd - stake.timeStart);
    }

    modifier whenActive() {
        require(isActive, "Contract is not active");
        _;
    }

    // --------- Administrative functions ---------
    function setActive(bool value_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isActive = value_;
        emit ActivityChanged(value_, _msgSender());
    }

    function updateRewardPool(address poolAddress_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _rewardPool = poolAddress_;
    }

    function updateToken1(address token1_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token1 = Token1(token1_);
    }

    function updateToken2(address token2_) public onlyRole(DEFAULT_ADMIN_ROLE) {
        token2 = Token2(token2_);
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

    function updateDurationDays(uint256 duration_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        durationDays = duration_;
    }

    function updateReward(uint256 newReward_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        reward = newReward_;
    }

    function updateSubscriptionCost(uint256 cost_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _updateSubscriptionCost(cost_);
    }

    function updateSubscriptionPeriod(uint256 periodDays_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _updateSubscriptionPeriod(periodDays_);
    }

    function updateSubscriptionToken(address token_)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _updateSubscriptionToken(token_);
    }
}
