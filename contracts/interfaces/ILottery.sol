// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

interface ILottery {
    struct Round {
        uint256 id;
        uint256 startTime;
        uint256 duration;
        bool isClosed;
        bool isOracleFulfilled;
        bool isFinished;
        uint256 initialPrize;
        uint256 totalPrize;
        uint256 maxTicketsFromOneMember;
        uint256 tokensForOneTicket;
        uint256[] winnersForLevel;
        uint256[] prizeForLevel;
        uint256 totalTickets;
        address[] members;
        uint256 randomWord;
        address[][] winners;
    }

    function getUserRoundEntry(address user, uint256 roundId)
        external
        view
        returns (uint256);

    function getRound(uint256 id) external view returns (Round memory);
}
