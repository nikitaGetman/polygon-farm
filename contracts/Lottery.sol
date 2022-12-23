// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "./interfaces/ILottery.sol";
import "./tokens/Ticket.sol";

contract Lottery is ILottery, VRFConsumerBaseV2, AccessControl {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    Round[] public rounds;
    mapping(uint256 => mapping(address => uint256)) roundMembers;
    mapping(uint256 => uint256) roundRestTickets;
    mapping(uint256 => mapping(address => uint256)) roundMembersHistory;
    mapping(address => uint256[]) claims;
    mapping(address => uint256) winnersRewards;
    mapping(address => uint256) lastTicketMint;

    uint256 public TICKET_PRICE;
    uint256 public TICKET_ID;
    uint256 public DAYS_STREAK_FOR_TICKET = 5;
    uint256 public CLAIM_PERIOD = 1 days;

    Ticket ticketToken;
    ERC20Burnable paymentToken;
    IERC20 rewardToken;
    address rewardPool;

    // @see: https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    VRFCoordinatorV2Interface COORDINATOR;
    mapping(uint256 => uint256) public oracleRequests; /* requestId --> roundId */
    uint64 oracleSubscriptionId;
    bytes32 oracleKeyHash;
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
        uint256 startTime,
        uint256 duration,
        uint256 initialPrize,
        uint256 tokensForOneTicket,
        uint256 maxTicketsFromOneMember,
        uint256[] memory winnersForLevel,
        uint256[] memory prizeForLevel
    ) public onlyRole(OPERATOR_ROLE) {
        require(initialPrize > 0 || tokensForOneTicket > 0, "EC1");
        require(winnersForLevel.length == prizeForLevel.length, "EC2");
        require(winnersForLevel.length > 0, "EC3");
        require(maxTicketsFromOneMember > 0, "EC4");
        require(startTime >= block.timestamp, "EC5");
        require(duration > 0, "EC6");

        uint256 levels = winnersForLevel.length;
        address[][] memory winners = new address[][](levels);

        // uint256 totalWinners = 0;
        uint256 totalPrizePercents = 0;
        for (uint256 i = 0; i < winnersForLevel.length; i++) {
            // totalWinners += winnersForLevel[i];
            totalPrizePercents += prizeForLevel[i];
            winners[i] = new address[](winnersForLevel[i]);
        }

        require(totalPrizePercents == 100, "EC7");

        Round memory newRound = Round({
            id: rounds.length,
            startTime: startTime,
            duration: duration,
            isClosed: false,
            isOracleFulfilled: false,
            isFinished: false,
            initialPrize: initialPrize,
            totalPrize: 0,
            maxTicketsFromOneMember: maxTicketsFromOneMember,
            tokensForOneTicket: tokensForOneTicket,
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
        roundMembersHistory[roundId][_msgSender()] = currentTickets + tickets;
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
        roundRestTickets[roundId] = round.totalTickets;

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

        require(!rounds[roundId].isOracleFulfilled, "EC10");

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
        require(!round.isFinished, "Round is already finished");

        rounds[roundId].isFinished = true;
        emit RoundFinished(roundId);

        uint256 random = round.randomWord;

        for (uint256 i = 0; i < round.winners.length; i++) {
            uint256 totalLevelPrize = (round.totalPrize / 100) *
                round.prizeForLevel[i];

            for (uint256 j = 0; j < round.winners[i].length; j++) {
                if (roundRestTickets[roundId] == 0) {
                    return;
                }

                random = ((random * (i + 1) * (j + 1)) % block.timestamp) + 1;
                address winner = round.winners[i][j];

                if (round.winners[i][j] == address(0)) {
                    // winner ticket is from 1 to tickets.length
                    uint256 winnerTicket = (random %
                        roundRestTickets[roundId]) + 1;

                    for (uint256 k = 0; k < round.members.length; k++) {
                        address member = round.members[k];
                        uint256 memberTickets = roundMembers[roundId][member];

                        if (winnerTicket <= memberTickets) {
                            winner = member;
                            roundRestTickets[roundId] -= roundMembers[roundId][
                                member
                            ];
                            roundMembers[roundId][member] = 0;
                            break;
                        }

                        winnerTicket -= memberTickets;
                    }

                    rounds[roundId].winners[i][j] = winner;
                }

                uint256 prizeAmount = totalLevelPrize / round.winners[i].length;
                rewardToken.transferFrom(rewardPool, winner, prizeAmount);
                winnersRewards[winner] += prizeAmount;
            }
        }
    }

    function buyTickets(uint256 amount) public {
        require(amount > 0, "Amount should be greater than 0");

        uint256 cost = amount * TICKET_PRICE;
        paymentToken.burnFrom(_msgSender(), cost);
        _mintTicket(_msgSender(), amount);
    }

    function claimDay() public {
        require(!isClaimedToday(_msgSender()), "Already claimed today");
        require(
            !isMintAvailable(_msgSender()),
            "Mint ticket before next claim"
        );

        uint256 streak = getClaimStreak(_msgSender());

        if (streak >= DAYS_STREAK_FOR_TICKET || streak == 0) {
            claims[_msgSender()] = new uint256[](DAYS_STREAK_FOR_TICKET);
            streak = 0;
        }

        for (uint256 i = 0; i < claims[_msgSender()].length; i++) {
            if (claims[_msgSender()][i] == 0) {
                // Cut fractionaal part
                claims[_msgSender()][i] =
                    (block.timestamp / CLAIM_PERIOD) *
                    CLAIM_PERIOD;
                break;
            }
        }
    }

    function mintMyTicket() public {
        require(isMintAvailable(_msgSender()), "Ticket mint is not available");

        _mintTicket(_msgSender(), 1);

        lastTicketMint[_msgSender()] = getLastClaimTime(_msgSender());
        claims[_msgSender()] = new uint256[](DAYS_STREAK_FOR_TICKET);
    }

    function _mintTicket(address user, uint256 amount) internal {
        ticketToken.mint(user, TICKET_ID, amount, "");
        emit TicketsCollected(_msgSender(), amount);
    }

    // --------- Helper functions ---------
    function getTotalRounds() public view returns (uint256) {
        return rounds.length;
    }

    function getWinnerPrize(address user) public view returns (uint256) {
        return winnersRewards[user];
    }

    function getRound(uint256 id) public view returns (Round memory) {
        return rounds[id];
    }

    function getUserRoundEntry(address user, uint256 roundId)
        public
        view
        returns (uint256)
    {
        return roundMembersHistory[roundId][user];
    }

    function getActiveRounds() public view returns (Round[] memory) {
        // TODO: how to optimize this?
        uint256 totalActiveRounds = 0;
        bool[] memory activeRoundsFlags = new bool[](rounds.length);
        for (uint256 i = 0; i < rounds.length; i++) {
            if (!rounds[i].isFinished) {
                activeRoundsFlags[i] = true;
                totalActiveRounds += 1;
            }
        }

        Round[] memory activeRounds = new Round[](totalActiveRounds);
        for (uint256 i = rounds.length; i > 0; i--) {
            if (activeRoundsFlags[i - 1]) {
                totalActiveRounds -= 1;
                activeRounds[totalActiveRounds] = rounds[i - 1];
                if (totalActiveRounds == 0) break;
            }
        }

        return activeRounds;
    }

    function getLastFinishedRounds(uint256 length, uint256 offset)
        public
        view
        returns (Round[] memory)
    {
        // TODO: how to optimize this?
        Round[] memory finishedRounds = new Round[](length);

        uint256 remainingRounds = length;
        uint256 remainingOffset = offset;
        for (uint256 i = rounds.length; i > 0; i--) {
            if (rounds[i - 1].isFinished) {
                if (remainingOffset > 0) {
                    remainingOffset -= 1;
                } else {
                    remainingRounds -= 1;
                    finishedRounds[remainingRounds] = rounds[i - 1];
                    if (remainingRounds == 0) {
                        // return if find required amount of rounds
                        return finishedRounds;
                    }
                }
            }
        }

        // else cut empty round items
        uint256 roundsFound = length - remainingRounds;
        Round[] memory foundFinishedRounds = new Round[](roundsFound);

        for (uint256 i = 0; i < roundsFound; i++) {
            foundFinishedRounds[i] = finishedRounds[i + remainingRounds];
        }

        return foundFinishedRounds;
    }

    function isClaimedToday(address user) public view returns (bool) {
        uint256 today = block.timestamp / CLAIM_PERIOD;
        return getLastClaimTime(user) / CLAIM_PERIOD == today;
    }

    function getLastClaimTime(address user) public view returns (uint256) {
        uint256[] storage userClaims = claims[user];

        if (userClaims.length == 0) return 0;

        for (uint256 i = userClaims.length; i > 0; i--) {
            if (userClaims[i - 1] > 0) {
                return userClaims[i - 1];
            }
        }

        return lastTicketMint[user];
    }

    function isMintAvailable(address user) public view returns (bool) {
        uint256 streak = getClaimStreak(user);
        return streak == DAYS_STREAK_FOR_TICKET;
    }

    function getClaimStreak(address user) public view returns (uint256) {
        uint256[] storage userClaims = claims[user];

        if (userClaims.length == 0) return 0;

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
        if (
            streak != DAYS_STREAK_FOR_TICKET &&
            block.timestamp / CLAIM_PERIOD > lastClaim + 1
        ) {
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

    function updateClaimPeriod(uint256 sec)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        CLAIM_PERIOD = sec;
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
                roundRestTickets[roundId] -= roundMembers[roundId][pk[i][j]];
                roundMembers[roundId][pk[i][j]] = 0;
            }
        }
    }
}
