// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./tokens/Token1.sol";
import "./tokens/Token2.sol";

contract Staking is AccessControl {
    struct Stake {
        uint256 stakeId;
        uint256 amount;
        uint256 timeStart;
        uint256 timeEnd;
        uint256 percent;
        uint256 profit;
        bool isClaimed;
        bool isToken1;
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

    Token1 token1;
    Token2 token2;

    event Staked(
        address indexed user,
        uint256 amount,
        uint256 indexed stakeIndex,
        uint256 timestamp,
        bool indexed isToken1
    );
    event Claimed(
        address indexed user,
        uint256 amount,
        uint256 indexed stakeIndex,
        uint256 timestamp,
        bool indexed isToken1
    );
    event ActivityChanged(bool isActive);

    constructor(
        address token1_,
        address token2_,
        address rewardPool_,
        uint256 durationDays_,
        uint256 rewardPercent_
    ) {
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

    function deposit(uint256 depositAmount, bool isToken2) public whenActive {
        require(
            depositAmount >= MIN_STAKE_LIMIT,
            "Stake amount less than minimum value"
        );
        uint256 profit = calculateStakeProfit(depositAmount);

        require(
            profit <= token1.balanceOf(_rewardPool),
            "Not enough tokens for reward"
        );
        if (isToken2) {
            token2.burnFrom(_msgSender(), depositAmount);
        } else {
            token1.transferFrom(_msgSender(), address(this), depositAmount);
        }
        token1.transferFrom(_rewardPool, address(this), profit);

        User storage user = users[_msgSender()];
        uint256 stakeId = 0; //isToken2_ ? user.token2Stakes.length : user.token1Stakes.length;

        Stake memory newStake = Stake(
            stakeId, // TODO: нужен ли id?
            depositAmount,
            block.timestamp,
            block.timestamp + durationDays * TIME_STEP,
            reward,
            profit,
            false,
            !isToken2
        );

        user.stakes.push(newStake);

        if (isToken2) {
            user.totalStakedToken2 += depositAmount;
            totalStakedToken2 += depositAmount;
            totalStakesToken2No++;
        } else {
            user.totalStakedToken1 += depositAmount;
            totalStakedToken1 += depositAmount;
            totalStakesToken1No++;
        }

        emit Staked(
            _msgSender(),
            depositAmount,
            stakeId,
            block.timestamp,
            !isToken2
        );
    }

    function withdraw(uint256 stakeId) public {
        User storage user = users[_msgSender()];
        // TODO: test with stakeId out of range
        Stake storage stake = user.stakes[stakeId];

        require(stake.timeStart > 0, "Invalid stake id");
        require(!stake.isClaimed, "Stake is already claimed");
        require(stake.timeEnd <= block.timestamp, "Stake is not ready yet");

        uint256 withdrawAmount = _calculateStakeReward(stake);
        stake.isClaimed = true;

        token1.transfer(_msgSender(), withdrawAmount);
        user.totalClaimed += withdrawAmount;
        totalClaimed += withdrawAmount;

        emit Claimed(
            _msgSender(),
            withdrawAmount,
            stakeId,
            block.timestamp,
            stake.isToken1
        );
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
            uint256 _totalClaimed
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
    }

    function getUserInfo(address userAddr)
        public
        view
        returns (
            uint256 _totalStakedToken1,
            uint256 _totalStakedToken2,
            // uint256 _totalStakesToken1No,
            // uint256 _totalStakesToken2No,
            uint256 _totalClaimed
        )
    {
        User storage user = users[userAddr];

        _totalStakedToken1 = user.totalStakedToken1;
        _totalStakedToken2 = user.totalStakedToken2;
        _totalClaimed = user.totalClaimed;

        // TODO: это нужно?
        // _totalStakesToken1No = user.stakes.length;
        // _totalStakesToken2No = user.token2Stakes.length;
    }

    function getUserStakes(address user) public view {}

    function getTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function calculateStakeProfit(uint256 amount)
        public
        view
        returns (uint256)
    {
        return (amount * reward) / PERCENTS_DIVIDER;
    }

    function calculateStakeReward(address userAddr, uint256 stakeId)
        public
        view
        returns (uint256)
    {
        return _calculateStakeReward(users[userAddr].stakes[stakeId]);
    }

    function _calculateStakeReward(Stake storage stake)
        internal
        view
        returns (uint256)
    {
        if (stake.timeStart == 0 || stake.isClaimed) return 0;

        uint256 stakeReward = stake.isToken1
            ? stake.amount + stake.profit
            : stake.profit;

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
    function setActive(bool value) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isActive = value;
        emit ActivityChanged(value);
    }

    function updateRewardPool(address poolAddress)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _rewardPool = poolAddress;
    }

    function updatePercentDivider(uint256 divider)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        PERCENTS_DIVIDER = divider;
    }

    function updateTimeStep(uint256 step) public onlyRole(DEFAULT_ADMIN_ROLE) {
        TIME_STEP = step;
    }

    function updateMinStakeLimit(uint256 minLimit)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        MIN_STAKE_LIMIT = minLimit;
    }

    function updateDurationDays(uint256 duration)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        durationDays = duration * TIME_STEP;
    }

    function updateReward(uint256 newReward)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        reward = newReward;
    }
}
