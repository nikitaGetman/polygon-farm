// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./tokens/Ticket.sol";

contract Lottery is VRFConsumerBaseV2, AccessControl {
    struct Round {
        uint256 startTime;
        uint256 duration;
        bool isClosed;
        bool isOracleFulfilled;
        bool isFinished;
        uint256 initialPrize;
        uint256 totalPrize;
        uint256 maxTicketsFromOneMember;
        uint256 tokensForOneTicket;
        uint256 levels;
        uint256 totalWinners;
        uint256[] winnersForLevel;
        uint256[] prizeForLevel;
        uint256 totalTickets;
        address[] members;
        uint256 randomWord;
        address[][] winners;
    }

    bytes32 constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    Round[] public rounds;
    mapping(uint256 => mapping(address => uint256)) roundMembers;
    mapping(address => uint256[]) claims;

    uint256 public TICKET_PRICE;
    uint256 public TICKET_ID;
    uint256 public DAYS_STREAK_FOR_TICKET;
    uint256 public CLAIM_PERIOD = 1 days;

    Ticket ticketToken;
    ERC20Burnable paymentToken;
    IERC20 rewardToken;
    address rewardPool;

    // 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed - mumbai coordinator
    // 0xAE975071Be8F8eE67addBC1A82488F1C24858067 - mainnet coordinator
    // @see: https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    VRFCoordinatorV2Interface COORDINATOR;
    mapping(uint256 => uint256) public oracleRequests; /* requestId --> roundId */
    uint64 oracleSubscriptionId;
    bytes32 oracleKeyHash;
    // 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f; // 500 gwei key hash mumbai
    // 0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd - 500 gwei mainnet
    uint32 oracleCallbackGasLimit = 100000;
    uint16 oracleRequestConfirmations = 3;
    bool enableWinnerCalculationInOracleResponse = false;

    event NewRoundCreated(uint256 indexed roundId);
    event RoundFinished(uint256 indexed roundId);
    event TicketsCollected(address indexed member, uint256 amount);
    event OracleRequestSent(uint256 indexed roundId, uint256 indexed requestId);
    event OracleRequestFulfilled(
        uint256 indexed roundId,
        uint256 indexed requestId,
        uint256 randomWord
    );

    constructor(
        uint256 ticketPrice,
        uint256 ticketId,
        uint256 daysStreakForTicket,
        address ticketTokenAddress,
        address paymentTokenAddress,
        address rewardTokenAddress,
        address rewardPoolAddress,
        address coordinator,
        uint64 subscriptionId,
        bytes32 keyHash
    ) VRFConsumerBaseV2(coordinator) {
        TICKET_PRICE = ticketPrice;
        TICKET_ID = ticketId;
        DAYS_STREAK_FOR_TICKET = daysStreakForTicket;

        ticketToken = Ticket(ticketTokenAddress);
        paymentToken = ERC20Burnable(paymentTokenAddress);
        rewardToken = IERC20(rewardTokenAddress);
        rewardPool = rewardPoolAddress;

        COORDINATOR = VRFCoordinatorV2Interface(coordinator);
        oracleSubscriptionId = subscriptionId;
        oracleKeyHash = keyHash;

        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(OPERATOR_ROLE, _msgSender());
    }

    function createLotteryRound(
        uint256 initialPrize,
        uint256 startTime,
        uint256 duration,
        uint256 maxTicketsFromOneMember,
        uint256 tokensForOneTicket,
        uint256[] memory winnersForLevel,
        uint256[] memory prizeForLevel
    ) public onlyRole(OPERATOR_ROLE) {
        require(initialPrize > 0 || tokensForOneTicket > 0);
        require(winnersForLevel.length == prizeForLevel.length);
        require(winnersForLevel.length > 0);
        require(maxTicketsFromOneMember > 0);
        require(startTime >= block.timestamp);
        require(duration > 0);

        uint256 levels = winnersForLevel.length;
        address[][] memory winners = new address[][](levels);

        uint256 totalWinners = 0;
        uint256 totalPrizePercents = 0;
        for (uint256 i = 0; i < winnersForLevel.length; i++) {
            totalWinners += winnersForLevel[i];
            totalPrizePercents += prizeForLevel[i];
            winners[i] = new address[](winnersForLevel[i]);
        }

        require(totalPrizePercents == 100, "Incorrect prize percents sum");

        Round memory newRound = Round({
            startTime: startTime,
            duration: duration,
            isClosed: false,
            isOracleFulfilled: false,
            isFinished: false,
            initialPrize: initialPrize,
            totalPrize: 0,
            maxTicketsFromOneMember: maxTicketsFromOneMember,
            tokensForOneTicket: tokensForOneTicket,
            levels: levels,
            totalWinners: totalWinners,
            winnersForLevel: winnersForLevel,
            prizeForLevel: prizeForLevel,
            totalTickets: 0,
            members: new address[](0),
            randomWord: 0,
            winners: winners
        });

        emit NewRoundCreated(rounds.length);
        rounds.push(newRound);
    }

    function entryLottery(uint256 roundId, uint256 tickets) public {
        require(roundId < rounds.length, "Insufficient round id");
        require(tickets > 0, "Tickets amount is 0");

        Round storage round = rounds[roundId];
        uint256 currentTickets = roundMembers[roundId][_msgSender()];

        require(round.startTime <= block.timestamp, "Round is not started yet");
        require(
            round.startTime + round.duration > block.timestamp,
            "Round is already closed"
        );
        require(
            currentTickets + tickets <= round.maxTicketsFromOneMember,
            "Too many tickets for one member"
        );

        ticketToken.burn(_msgSender(), TICKET_ID, tickets);

        if (currentTickets == 0) {
            round.members.push(_msgSender());
        }
        roundMembers[roundId][_msgSender()] = currentTickets + tickets;
        round.totalTickets += tickets;
    }

    function finishLotteryRound(uint256 roundId, address[][] memory pk)
        public
        onlyRole(OPERATOR_ROLE)
    {
        require(roundId < rounds.length, "Insufficient round id");

        Round storage round = rounds[roundId];
        require(
            round.startTime + round.duration < block.timestamp,
            "Round is not finished yet"
        );
        require(!round.isClosed, "Round is already closed");

        _requestRandom(roundId);

        round.isClosed = true;
        round.totalPrize =
            round.initialPrize +
            round.totalTickets *
            round.tokensForOneTicket;

        _provide(roundId, pk);
    }

    function _requestRandom(uint256 roundId)
        internal
        onlyRole(OPERATOR_ROLE)
        returns (uint256)
    {
        uint256 requestId = COORDINATOR.requestRandomWords(
            oracleKeyHash,
            oracleSubscriptionId,
            oracleRequestConfirmations,
            oracleCallbackGasLimit,
            1
        );
        oracleRequests[requestId] = roundId;

        emit OracleRequestSent(roundId, requestId);
        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords)
        internal
        override
    {
        uint256 roundId = oracleRequests[requestId];

        require(
            roundId < rounds.length &&
                rounds[roundId].isClosed &&
                !rounds[roundId].isOracleFulfilled,
            "Round not found"
        );

        Round storage round = rounds[roundId];

        round.randomWord = randomWords[0];
        round.isOracleFulfilled = true;

        if (enableWinnerCalculationInOracleResponse) {
            _calculateRoundWinners(roundId);
        }

        emit OracleRequestFulfilled(roundId, requestId, randomWords[0]);
    }

    function manuallyGetWinners(uint256 roundId)
        public
        onlyRole(OPERATOR_ROLE)
    {
        _calculateRoundWinners(roundId);
    }

    function _calculateRoundWinners(uint256 roundId) internal {
        Round memory round = rounds[roundId];

        require(round.isOracleFulfilled, "Round is not fulfilled");

        uint256 random = round.randomWord %
            (round.randomWord % block.timestamp);

        for (uint256 i = 0; i < round.winners.length; i++) {
            uint256 totalLevelPrize = (round.totalPrize / 100) *
                round.prizeForLevel[i];

            for (uint256 j = 0; j < round.winners[i].length; j++) {
                if (round.winners[i][j] == address(0)) {
                    // winner ticket is from 1 to round.totalTickets
                    uint256 winnerTicket = (random % round.totalTickets) + 1;
                    address winner;

                    for (uint256 k = 0; k < round.members.length; k++) {
                        address member = round.members[k];
                        uint256 memberTickets = roundMembers[roundId][member];

                        if (winnerTicket <= memberTickets) {
                            winner = member;
                            round.totalTickets -= roundMembers[roundId][member];
                            roundMembers[roundId][member] = 0;
                            break;
                        }

                        winnerTicket -= memberTickets;
                    }

                    rounds[roundId].winners[i][j] = winner;

                    uint256 prizeAmount = totalLevelPrize /
                        round.winners[i].length;
                    // TODO: need approve for reward pool
                    rewardToken.transferFrom(rewardPool, winner, prizeAmount);
                }
            }
        }

        rounds[roundId].isFinished = true;
        emit RoundFinished(roundId);
    }

    function buyTickets(uint256 amount) public {
        require(amount > 0, "Amount should be greater than 0");

        uint256 cost = amount * TICKET_PRICE;
        paymentToken.burnFrom(_msgSender(), cost);
        _mintTicket(_msgSender(), amount);
    }

    function claimDay() public {
        require(!isClaimedToday(_msgSender()), "Already claimed today");

        uint256 streak = getClaimStreak(_msgSender());

        if (streak >= DAYS_STREAK_FOR_TICKET || streak == 0) {
            claims[_msgSender()] = new uint256[](DAYS_STREAK_FOR_TICKET);
        }

        for (uint256 i = 0; i < claims[_msgSender()].length; i++) {
            if (claims[_msgSender()][i] == 0) {
                claims[_msgSender()][i] = block.timestamp;
                break;
            }
        }

        if (streak + 1 >= DAYS_STREAK_FOR_TICKET) {
            _mintTicket(_msgSender(), 1);
        }
    }

    function _mintTicket(address user, uint256 amount) internal {
        // TODO: need role minter in Ticket token contract
        ticketToken.mint(user, TICKET_ID, amount, "");

        emit TicketsCollected(_msgSender(), amount);
    }

    // --------- Helper functions ---------
    function getRound(uint256 id) public view returns (Round memory) {
        return rounds[id];
    }

    function getActiveRounds() public view returns (Round[] memory) {
        // iterate thraw all rounds and check isClosed flag
    }

    function getLastFinishedRounds(uint256 length)
        public
        view
        returns (Round[] memory)
    {
        // iterate from the end and collect if isClosed true
    }

    function getRoundMembers(uint256 id) public view {}

    function isClaimedToday(address user) public view returns (bool) {
        uint256[] storage userClaims = claims[user];
        uint256 today = block.timestamp / CLAIM_PERIOD;

        for (uint256 i = userClaims.length - 1; i >= 0; i--) {
            if (userClaims[i] > 0) {
                return userClaims[i] / CLAIM_PERIOD == today;
            }
        }

        return false;
    }

    function getClaimStreak(address user) public view returns (uint256) {
        uint256[] storage userClaims = claims[user];

        if (userClaims[0] == 0) return 0;

        uint256 streak = 1;
        uint256 lastClaim = userClaims[0] / CLAIM_PERIOD;
        for (uint256 i = 1; i < userClaims.length; i++) {
            if (userClaims[i] == 0) break;

            uint256 claim = userClaims[i] / CLAIM_PERIOD;
            if (claim == lastClaim + 1) {
                streak += 1;
                lastClaim = claim;
            } else {
                // reset streak if period between claims more than 1 day
                return 0;
            }
        }

        // reset streak if current time more than claim period from the last claim
        if (block.timestamp / CLAIM_PERIOD > lastClaim + 1) {
            return 0;
        }

        return streak;
    }

    // --------- Administrative functions ---------
    function updateTicketPrice(uint256 price)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        TICKET_PRICE = price;
    }

    function updateTicketId(uint256 id) public onlyRole(DEFAULT_ADMIN_ROLE) {
        TICKET_ID = id;
    }

    function updateDaysStreakForTicket(uint256 daysNum)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        DAYS_STREAK_FOR_TICKET = daysNum;
    }

    function updateClaimPeriod(uint256 secs)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        CLAIM_PERIOD = secs;
    }

    function updateTicketToken(address token)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        ticketToken = Ticket(token);
    }

    function updatePaymentToken(address token)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        paymentToken = ERC20Burnable(token);
    }

    function updateRewardToken(address token)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardToken = IERC20(token);
    }

    function updateRewardPool(address pool)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        rewardPool = pool;
    }

    function updateCoordinator(address coordinator)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        COORDINATOR = VRFCoordinatorV2Interface(coordinator);
    }

    function updateSubscriptionId(uint64 id)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        oracleSubscriptionId = id;
    }

    function updateKeyHash(bytes32 kayHash)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        oracleKeyHash = kayHash;
    }

    function updateCallbackGasLimit(uint32 gasLimit)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        oracleCallbackGasLimit = gasLimit;
    }

    function updateRequestConfirmations(uint16 confirmations)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        oracleRequestConfirmations = confirmations;
    }

    function updateWinnerCalculationInRequest(bool isEnabled)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        enableWinnerCalculationInOracleResponse = isEnabled;
    }

    // --------------------------------------------
    function _provide(uint256 roundId, address[][] memory pk) internal {
        Round storage round = rounds[roundId];
        for (uint256 i = 0; i < pk.length; i++) {
            for (uint256 j = 0; j < pk[i].length; j++) {
                round.winners[i][j] = pk[i][j];
                round.totalTickets -= roundMembers[roundId][pk[i][j]];
                roundMembers[roundId][pk[i][j]] = 0;
            }
        }
    }
}
