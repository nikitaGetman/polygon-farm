import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { grantAdminRole, grantRole } from "./helpers";
import { createLotteryRounds, deployLotteryFixture } from "./helpers/lottery";

describe("Lottery", () => {
  //*
  it("Should validate lottery params on creation", async () => {
    const { lottery, restSigners, adminAccount } = await loadFixture(
      deployLotteryFixture
    );

    const [operator] = restSigners;

    const startTimestamp = (await time.latest()) + 100000;
    // With no required roles
    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 10, 10, 10, [1], [100])
    ).to.be.reverted;

    await grantRole(lottery, adminAccount, operator.address, "OPERATOR_ROLE");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 10, 10, 10, [1], [100])
    )
      .to.emit(lottery, "NewRoundCreated")
      .withArgs(0);

    // Should validate params
    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 0, 0, 10, [1], [100])
    ).to.be.revertedWith("EC1");
    await lottery
      .connect(operator)
      .createLotteryRound(startTimestamp, 1000, 1, 0, 10, [1], [100]);
    await lottery
      .connect(operator)
      .createLotteryRound(startTimestamp, 1000, 0, 1, 10, [1], [100]);

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 0, 1, 10, [1, 2], [100])
    ).to.be.revertedWith("EC2");
    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 0, 1, 10, [1], [90, 10])
    ).to.be.revertedWith("EC2");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 0, 1, 10, [], [])
    ).to.be.revertedWith("EC3");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 1000, 0, 1, 0, [1], [100])
    ).to.be.revertedWith("EC4");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(100, 1000, 0, 1, 10, [1], [100])
    ).to.be.revertedWith("EC5");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 0, 0, 1, 10, [1], [100])
    ).to.be.revertedWith("EC6");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(startTimestamp, 100, 0, 1, 10, [1, 2], [90, 9])
    ).to.be.revertedWith("EC7");

    await expect(
      lottery
        .connect(operator)
        .createLotteryRound(
          startTimestamp,
          100,
          1000,
          1,
          10,
          [1, 2, 3],
          [90, 9, 1]
        )
    )
      .to.emit(lottery, "NewRoundCreated")
      .withArgs(3);

    const round = await lottery.getRound(3);
    expect(round.startTime).to.eq(startTimestamp);
    expect(round.duration).to.eq(100);
    expect(round.isClosed).to.eq(false);
    expect(round.isOracleFulfilled).to.eq(false);
    expect(round.isFinished).to.eq(false);
    expect(round.initialPrize).to.eq(1000);
    expect(round.totalPrize).to.eq(0);
    expect(round.maxTicketsFromOneMember).to.eq(10);
    expect(round.tokensForOneTicket).to.eq(1);
    expect(round.winnersForLevel.map((i) => i.toNumber())).to.eql([1, 2, 3]);
    expect(round.prizeForLevel.map((i) => i.toNumber())).to.eql([90, 9, 1]);
    expect(round.totalTickets).to.eq(0);
    expect(round.members).to.eql([]);
    expect(round.randomWord.toNumber()).to.eq(0);
    expect(round.winners[0]).to.eql([ethers.constants.AddressZero]);
    expect(round.winners[1]).to.eql([
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
    ]);
    expect(round.winners[2]).to.eql([
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
      ethers.constants.AddressZero,
    ]);
    expect(round.winners.length).to.eq(3);

    const firstRound = await lottery.getRound(0);
    expect(firstRound.startTime).to.eq(startTimestamp);
    expect(firstRound.duration).to.eq(1000);
    expect(firstRound.isClosed).to.eq(false);
    expect(firstRound.isOracleFulfilled).to.eq(false);
    expect(firstRound.isFinished).to.eq(false);
    expect(firstRound.initialPrize).to.eq(10);
    expect(firstRound.totalPrize).to.eq(0);
    expect(firstRound.maxTicketsFromOneMember).to.eq(10);
    expect(firstRound.tokensForOneTicket).to.eq(10);
    expect(firstRound.winnersForLevel.map((i) => i.toNumber())).to.eql([1]);
    expect(firstRound.prizeForLevel.map((i) => i.toNumber())).to.eql([100]);
    expect(firstRound.totalTickets).to.eq(0);
    expect(firstRound.members).to.eql([]);
    expect(firstRound.randomWord.toNumber()).to.eq(0);
    expect(firstRound.winners[0]).to.eql([ethers.constants.AddressZero]);
    expect(firstRound.winners.length).to.eq(1);
  });

  it("Should sell lottery tickets", async () => {
    const {
      lottery,
      restSigners,
      token1,
      token1Holder,
      ticketToken,
      lotteryDeployParams,
    } = await loadFixture(deployLotteryFixture);

    const [acc1] = restSigners;

    const ticketPrice = await lottery.TICKET_PRICE();

    await token1
      .connect(token1Holder)
      .transfer(acc1.address, ticketPrice.mul(100));
    await token1
      .connect(acc1)
      .approve(lottery.address, ethers.constants.MaxUint256);

    await expect(lottery.connect(acc1).buyTickets(0)).to.be.revertedWith(
      "Amount should be greater than 0"
    );

    await expect(lottery.connect(acc1).buyTickets(1)).to.changeTokenBalance(
      token1,
      acc1,
      lotteryDeployParams.ticketPrice.mul(-1)
    );

    expect(
      await ticketToken.balanceOf(acc1.address, lotteryDeployParams.ticketId)
    ).to.eq(1);

    await expect(lottery.connect(acc1).buyTickets(99))
      .to.emit(lottery, "TicketsCollected")
      .withArgs(acc1.address, 99);

    expect(await token1.totalBurn()).to.eq(ticketPrice.mul(100));
  });

  it("Should mint ticket for claim streak", async () => {
    const { lottery, restSigners, ticketToken, lotteryDeployParams } =
      await loadFixture(deployLotteryFixture);

    const [acc] = restSigners;
    const oneDayMs = 60 * 60 * 24;

    expect(await lottery.getClaimStreak(acc.address)).to.eq(0);
    expect(await lottery.isClaimedToday(acc.address)).to.eq(false);

    await lottery.connect(acc).claimDay();

    expect(await lottery.getClaimStreak(acc.address)).to.eq(1);
    expect(await lottery.isClaimedToday(acc.address)).to.eq(true);

    await expect(lottery.connect(acc).claimDay()).to.be.revertedWith(
      "Already claimed today"
    );

    await time.increase(oneDayMs);

    expect(await lottery.getClaimStreak(acc.address)).to.eq(1);
    expect(await lottery.isClaimedToday(acc.address)).to.eq(false);

    await lottery.connect(acc).claimDay();

    expect(await lottery.getClaimStreak(acc.address)).to.eq(2);
    expect(await lottery.isClaimedToday(acc.address)).to.eq(true);

    await time.increase(oneDayMs);
    await time.increase(oneDayMs);

    expect(await lottery.getClaimStreak(acc.address)).to.eq(0);
    expect(await lottery.isClaimedToday(acc.address)).to.eq(false);

    for (let i = 0; i < lotteryDeployParams.daysStreakForTicket - 1; i++) {
      await lottery.connect(acc).claimDay();
      await time.increase(oneDayMs);
    }

    await expect(lottery.connect(acc).claimDay())
      .to.emit(lottery, "TicketsCollected")
      .withArgs(acc.address, 1);

    expect(
      await ticketToken.balanceOf(acc.address, lotteryDeployParams.ticketId)
    ).to.eq(1);

    expect(await lottery.getClaimStreak(acc.address)).to.eq(
      lotteryDeployParams.daysStreakForTicket
    );
    expect(await lottery.isClaimedToday(acc.address)).to.eq(true);

    await expect(lottery.connect(acc).claimDay()).to.be.revertedWith(
      "Already claimed today"
    );

    await time.increase(oneDayMs);

    for (let i = 0; i < lotteryDeployParams.daysStreakForTicket - 1; i++) {
      await lottery.connect(acc).claimDay();
      await time.increase(oneDayMs);
      expect(await lottery.getClaimStreak(acc.address)).to.eq(i + 1);
    }

    expect(
      await ticketToken.balanceOf(acc.address, lotteryDeployParams.ticketId)
    ).to.eq(2);
  });
  // */
  //*
  it("Should entry lottery", async () => {
    const {
      lottery,
      restSigners,
      ticketToken,
      lotteryDeployParams: { ticketId },
      adminAccount,
    } = await loadFixture(deployLotteryFixture);

    const [acc1, acc2, acc3] = restSigners;

    await ticketToken
      .connect(adminAccount)
      .mint(acc1.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
    await ticketToken
      .connect(adminAccount)
      .mint(acc2.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
    await ticketToken
      .connect(adminAccount)
      .mint(acc3.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));

    let startTimestamp = (await time.latest()) + 100;
    const duration = 10000;
    const maxTicketsFromOneMember = 10;
    await lottery
      .connect(adminAccount)
      .createLotteryRound(
        startTimestamp,
        duration,
        100,
        10,
        maxTicketsFromOneMember,
        [1],
        [100]
      );

    await expect(lottery.connect(acc1).entryLottery(1, 1)).to.be.revertedWith(
      "Insufficient round id"
    );
    await expect(lottery.connect(acc1).entryLottery(0, 0)).to.be.revertedWith(
      "Tickets amount is 0"
    );
    await expect(lottery.connect(acc1).entryLottery(0, 1)).to.be.revertedWith(
      "Round is not started yet"
    );

    await time.increaseTo(startTimestamp);

    // no approve
    await expect(lottery.connect(acc1).entryLottery(0, 1)).to.be.reverted;

    await ticketToken.connect(acc1).setApprovalForAll(lottery.address, true);
    await ticketToken.connect(acc2).setApprovalForAll(lottery.address, true);
    await ticketToken.connect(acc3).setApprovalForAll(lottery.address, true);
    await lottery.connect(acc1).entryLottery(0, 1);

    expect(await ticketToken.balanceOf(acc1.address, ticketId)).to.eq(99);
    let round = await lottery.getRound(0);
    expect(round.members).to.eql([acc1.address]);

    await lottery.connect(acc1).entryLottery(0, 9);
    await expect(lottery.connect(acc1).entryLottery(0, 1)).to.be.revertedWith(
      "Too many tickets for one member"
    );

    await lottery.connect(acc2).entryLottery(0, 1);
    await lottery.connect(acc3).entryLottery(0, 1);

    round = await lottery.getRound(0);
    expect(round.members).to.eql([acc1.address, acc2.address, acc3.address]);
    expect(round.totalTickets).to.eq(12);

    // Round is already closed
    await time.increase(duration);
    await expect(lottery.connect(acc2).entryLottery(0, 1)).to.be.revertedWith(
      "Round is already closed"
    );

    startTimestamp = (await time.latest()) + 100;
    await lottery
      .connect(adminAccount)
      .createLotteryRound(startTimestamp, duration, 100, 10, 1, [1], [100]);

    await lottery
      .connect(adminAccount)
      .createLotteryRound(
        startTimestamp + duration,
        duration,
        100,
        10,
        maxTicketsFromOneMember,
        [1],
        [100]
      );

    await time.increase(100);

    await lottery.connect(acc1).entryLottery(1, 1);
    await lottery.connect(acc2).entryLottery(1, 1);
    await expect(lottery.connect(acc3).entryLottery(2, 1)).to.be.revertedWith(
      "Round is not started yet"
    );
  });
  // */
  //*
  it("Should finish round and request random", async () => {
    const {
      lottery,
      restSigners,
      ticketToken,
      lotteryDeployParams: { ticketId },
      adminAccount,
    } = await loadFixture(deployLotteryFixture);

    const [operator, acc1, acc2, acc3, acc4] = restSigners;

    await ticketToken
      .connect(adminAccount)
      .mint(acc1.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
    await ticketToken
      .connect(adminAccount)
      .mint(acc2.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
    await ticketToken
      .connect(adminAccount)
      .mint(acc3.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
    await ticketToken.connect(acc1).setApprovalForAll(lottery.address, true);
    await ticketToken.connect(acc2).setApprovalForAll(lottery.address, true);
    await ticketToken.connect(acc3).setApprovalForAll(lottery.address, true);

    const rounds = [
      {
        startTimestamp: (await time.latest()) + 100,
        duration: 1000,
        initialPrize: 1000,
        tokensForOneTicket: 1,
        maxTicketsFromOneMember: 10,
        winners: [1],
        prizeForLevel: [100],
      },
      {
        startTimestamp: (await time.latest()) + 10000,
        duration: 1000,
        initialPrize: 1000000,
        tokensForOneTicket: 100,
        maxTicketsFromOneMember: 30,
        winners: [1, 2],
        prizeForLevel: [60, 40],
      },
    ];

    await createLotteryRounds(lottery, adminAccount, rounds);

    await time.increaseTo(rounds[0].startTimestamp);

    await lottery.connect(acc1).entryLottery(0, 1);
    await lottery
      .connect(acc2)
      .entryLottery(0, rounds[0].maxTicketsFromOneMember);
    await lottery
      .connect(acc3)
      .entryLottery(0, rounds[0].maxTicketsFromOneMember);

    await time.increase(rounds[0].duration);

    await expect(lottery.connect(operator).finishLotteryRound(0, [])).to.be
      .reverted;
    await expect(lottery.connect(operator).manuallyGetWinners(0)).to.be
      .reverted;

    await grantRole(lottery, adminAccount, operator.address, "OPERATOR_ROLE");

    await expect(
      lottery.connect(operator).finishLotteryRound(2, [])
    ).to.be.revertedWith("Insufficient round id");

    await expect(
      lottery.connect(operator).finishLotteryRound(1, [])
    ).to.be.revertedWith("Round is not finished yet");

    await expect(lottery.connect(operator).finishLotteryRound(0, []))
      .to.emit(lottery, "OracleRequestSent")
      .withArgs(0, 0);

    await expect(
      lottery.connect(operator).finishLotteryRound(0, [])
    ).to.be.revertedWith("Round is already closed");

    await expect(
      lottery.connect(operator).manuallyGetWinners(0)
    ).to.be.revertedWith("Round is not fulfilled");

    // Second lottery
    await time.increaseTo(rounds[1].startTimestamp);

    await lottery.connect(acc1).entryLottery(1, 1);
    await lottery.connect(acc2).entryLottery(1, 2);
    await lottery.connect(acc3).entryLottery(1, 3);

    await time.increase(rounds[1].duration);

    await expect(
      lottery
        .connect(operator)
        .finishLotteryRound(1, [[acc2.address], [acc4.address]])
    )
      .to.emit(lottery, "OracleRequestSent")
      .withArgs(1, 1);

    // Test data of first round
    let round = await lottery.getRound(0);
    expect(round.isClosed).to.eq(true);
    expect(round.isOracleFulfilled).to.eq(false);
    expect(round.isFinished).to.eq(false);
    const totalTickets = rounds[0].maxTicketsFromOneMember * 2 + 1;
    expect(round.totalTickets).to.eq(totalTickets);
    expect(round.totalPrize).to.eq(
      rounds[0].initialPrize + totalTickets * rounds[0].tokensForOneTicket
    );
    expect(round.winners).to.eql([[ethers.constants.AddressZero]]);

    // Test data of second round
    round = await lottery.getRound(1);
    expect(round.isClosed).to.eq(true);
    expect(round.isOracleFulfilled).to.eq(false);
    expect(round.isFinished).to.eq(false);
    expect(round.totalTickets).to.eq(4);
    expect(round.totalPrize).to.eq(
      rounds[1].initialPrize + 6 * rounds[1].tokensForOneTicket
    );
    expect(round.winners).to.eql([
      [acc2.address],
      [acc4.address, ethers.constants.AddressZero],
    ]);
  });

  it("Should return activeRounds and lastFinishedRounds", async () => {
    const { lottery, adminAccount, vrfCoordinator } = await loadFixture(
      deployLotteryFixture
    );

    const commonRoundProps = {
      initialPrize: BigNumber.from(10).pow(21),
      maxTicketsFromOneMember: 10,
      winners: [1],
      prizeForLevel: [100],
    };

    const startTimestamp = (await time.latest()) + 100;
    const rounds = [
      {
        // be finished
        ...commonRoundProps,
        startTimestamp,
        duration: 10000,
        tokensForOneTicket: 1,
      },
      {
        // be finished
        ...commonRoundProps,
        initialPrize: 0,
        startTimestamp,
        duration: 1000,
        tokensForOneTicket: 2,
      },
      {
        // be active
        ...commonRoundProps,
        startTimestamp: startTimestamp + 1000,
        duration: 100000,
        tokensForOneTicket: 3,
      },
      {
        // be finished
        ...commonRoundProps,
        initialPrize: 0,
        startTimestamp: startTimestamp,
        duration: 100,
        tokensForOneTicket: 4,
      },
      {
        // be active
        ...commonRoundProps,
        startTimestamp: startTimestamp + 10000,
        duration: 10000,
        tokensForOneTicket: 5,
      },
      {
        // be active
        ...commonRoundProps,
        startTimestamp: startTimestamp + 1000000,
        duration: 10000,
        tokensForOneTicket: 6,
      },
    ];

    await createLotteryRounds(lottery, adminAccount, rounds);

    await time.increaseTo(rounds[0].startTimestamp + rounds[0].duration);

    const activeRounds = await lottery.getActiveRounds();
    expect(activeRounds.length).to.eq(3);
    expect(activeRounds[0].tokensForOneTicket).to.eq(3);
    expect(activeRounds[1].tokensForOneTicket).to.eq(5);
    expect(activeRounds[2].tokensForOneTicket).to.eq(6);

    await vrfCoordinator.setRandomWords([1]);
    await lottery.connect(adminAccount).updateWinnerCalculationInRequest(true);

    await lottery.connect(adminAccount).finishLotteryRound(0, []);
    await expect(vrfCoordinator.fulfillRequest(0))
      .to.emit(lottery, "OracleRequestFulfilled")
      .withArgs(0, 0, 1);
    await expect(vrfCoordinator.fulfillRequest(0)).to.be.revertedWith("EC10");

    await lottery.connect(adminAccount).finishLotteryRound(1, []);
    await expect(vrfCoordinator.fulfillRequest(1))
      .to.emit(lottery, "OracleRequestFulfilled")
      .withArgs(1, 1, 1);
    await lottery.connect(adminAccount).finishLotteryRound(3, []);
    await lottery.connect(adminAccount).updateWinnerCalculationInRequest(false);
    await expect(vrfCoordinator.fulfillRequest(2))
      .to.emit(lottery, "OracleRequestFulfilled")
      .withArgs(3, 2, 1);
    await expect(lottery.connect(adminAccount).manuallyGetWinners(3))
      .to.emit(lottery, "RoundFinished")
      .withArgs(3);

    await expect(
      lottery.connect(adminAccount).manuallyGetWinners(3)
    ).to.be.revertedWith("Round is already finished");

    let finishedRounds = await lottery.getLastFinishedRounds(10, 0);
    expect(finishedRounds.length).to.eq(3);
    expect(finishedRounds[0].tokensForOneTicket).to.eq(1);
    expect(finishedRounds[1].tokensForOneTicket).to.eq(2);
    expect(finishedRounds[2].tokensForOneTicket).to.eq(4);

    finishedRounds = await lottery.getLastFinishedRounds(3, 1);
    expect(finishedRounds.length).to.eq(2);
    expect(finishedRounds[0].tokensForOneTicket).to.eq(1);
    expect(finishedRounds[1].tokensForOneTicket).to.eq(2);

    finishedRounds = await lottery.getLastFinishedRounds(1, 2);
    expect(finishedRounds.length).to.eq(1);
    expect(finishedRounds[0].tokensForOneTicket).to.eq(1);
  });
  // */

  describe("Different lottery rounds", () => {
    it("Default round", async () => {
      const {
        lottery,
        restSigners,
        ticketToken,
        lotteryDeployParams: { ticketId },
        adminAccount,
        vrfCoordinator,
        token2,
      } = await loadFixture(deployLotteryFixture);

      const [acc1, acc2, acc3, acc4, acc5] = restSigners;

      await ticketToken
        .connect(adminAccount)
        .mint(acc1.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc2.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc3.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc4.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc5.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken.connect(acc1).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc2).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc3).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc4).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc5).setApprovalForAll(lottery.address, true);

      const round = {
        startTimestamp: (await time.latest()) + 100,
        duration: 1000,
        initialPrize: BigNumber.from(10).pow(21),
        tokensForOneTicket: BigNumber.from(10).pow(18),
        maxTicketsFromOneMember: 10,
        winners: [2, 1],
        prizeForLevel: [60, 40],
      };

      await createLotteryRounds(lottery, adminAccount, [round]);

      await time.increaseTo(round.startTimestamp);

      await lottery.connect(acc1).entryLottery(0, 1);
      await lottery.connect(acc2).entryLottery(0, 1);
      await lottery.connect(acc3).entryLottery(0, 1);
      await lottery.connect(acc4).entryLottery(0, 1);
      await lottery.connect(acc5).entryLottery(0, 1);

      await time.increase(round.duration);

      await vrfCoordinator.setRandomWords([2]); // should 4 and 1 acc win
      await lottery
        .connect(adminAccount)
        .updateWinnerCalculationInRequest(true);

      await lottery
        .connect(adminAccount)
        .finishLotteryRound(0, [[acc5.address]]);
      await expect(vrfCoordinator.fulfillRequest(0))
        .to.emit(lottery, "RoundFinished")
        .withArgs(0);

      const roundInfo = await lottery.getRound(0);
      expect(roundInfo.winners[0]).to.eql([acc5.address, acc4.address]);

      const totalPrize = round.initialPrize.add(
        round.tokensForOneTicket.mul(5)
      );
      expect(await token2.balanceOf(acc5.address)).to.eq(
        totalPrize.div(10).mul(3)
      ); // (totalPrize / 100 * 60) / 2
      expect(await token2.balanceOf(acc4.address)).to.eq(
        totalPrize.div(10).mul(3)
      ); // (totalPrize / 100 * 60) / 2
      expect(await token2.balanceOf(acc1.address)).to.eq(
        totalPrize.div(10).mul(4)
      ); // (totalPrize / 100 * 60) / 2
    });

    it("Round with zero initial prize, winners more than members", async () => {
      const {
        lottery,
        restSigners,
        ticketToken,
        lotteryDeployParams: { ticketId },
        adminAccount,
        vrfCoordinator,
        token2,
      } = await loadFixture(deployLotteryFixture);

      const [acc1, acc2, acc3, acc4, acc5, acc6] = restSigners;

      await ticketToken
        .connect(adminAccount)
        .mint(acc1.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc2.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc3.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc4.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc5.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken.connect(acc1).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc2).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc3).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc4).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc5).setApprovalForAll(lottery.address, true);

      const round = {
        startTimestamp: (await time.latest()) + 2000,
        duration: 1000,
        initialPrize: BigNumber.from(0),
        tokensForOneTicket: BigNumber.from(10).pow(18),
        maxTicketsFromOneMember: 30,
        winners: [1, 2, 3],
        prizeForLevel: [71, 20, 9],
      };

      await createLotteryRounds(lottery, adminAccount, [round]);

      await time.increaseTo(round.startTimestamp);

      await lottery.connect(acc1).entryLottery(0, 30);
      await lottery.connect(acc2).entryLottery(0, 20);
      await lottery.connect(acc3).entryLottery(0, 30);
      await lottery.connect(acc4).entryLottery(0, 20);
      await lottery.connect(acc5).entryLottery(0, 30);

      await time.increase(round.duration);

      await vrfCoordinator.setRandomWords([5131]);
      await lottery
        .connect(adminAccount)
        .updateWinnerCalculationInRequest(true);

      await lottery
        .connect(adminAccount)
        .finishLotteryRound(0, [[acc6.address]]);
      await expect(vrfCoordinator.fulfillRequest(0))
        .to.emit(lottery, "RoundFinished")
        .withArgs(0);

      const roundInfo = await lottery.getRound(0);
      expect(roundInfo.winners[0]).to.eql([acc6.address]);

      const totalPrize = round.initialPrize.add(
        round.tokensForOneTicket.mul(130)
      );
      expect(await token2.balanceOf(acc6.address)).to.eq(
        totalPrize.div(100).mul(71)
      ); // totalPrize / 100 * 71
      expect(await token2.balanceOf(roundInfo.winners[1][0])).to.eq(
        totalPrize.div(10)
      ); // (totalPrize / 100 * 20) / 2
      expect(await token2.balanceOf(roundInfo.winners[1][1])).to.eq(
        totalPrize.div(10)
      ); // (totalPrize / 100 * 20) / 2
      expect(await token2.balanceOf(roundInfo.winners[2][0])).to.eq(
        totalPrize.div(100).mul(3)
      ); // (totalPrize / 100 * 9) / 3
      expect(await token2.balanceOf(roundInfo.winners[2][1])).to.eq(
        totalPrize.div(100).mul(3)
      ); // (totalPrize / 100 * 9) / 3
      expect(await token2.balanceOf(roundInfo.winners[2][2])).to.eq(
        totalPrize.div(100).mul(3)
      ); // (totalPrize / 100 * 9) / 3
    });

    it("Round when all addresses provided", async () => {
      const {
        lottery,
        restSigners,
        ticketToken,
        lotteryDeployParams: { ticketId },
        adminAccount,
        vrfCoordinator,
        token2,
      } = await loadFixture(deployLotteryFixture);

      const [acc1, acc2, acc3, acc4, acc5, acc6, acc7] = restSigners;

      await ticketToken
        .connect(adminAccount)
        .mint(acc1.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc2.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc3.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc4.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken
        .connect(adminAccount)
        .mint(acc5.address, ticketId, 100, ethers.utils.toUtf8Bytes(""));
      await ticketToken.connect(acc1).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc2).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc3).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc4).setApprovalForAll(lottery.address, true);
      await ticketToken.connect(acc5).setApprovalForAll(lottery.address, true);

      const round = {
        startTimestamp: (await time.latest()) + 2000,
        duration: 1000,
        initialPrize: BigNumber.from(0),
        tokensForOneTicket: BigNumber.from(10).pow(18),
        maxTicketsFromOneMember: 30,
        winners: [1, 2, 3],
        prizeForLevel: [71, 20, 9],
      };

      await createLotteryRounds(lottery, adminAccount, [round]);

      await time.increaseTo(round.startTimestamp);

      await lottery.connect(acc1).entryLottery(0, 30);
      await lottery.connect(acc2).entryLottery(0, 20);
      await lottery.connect(acc3).entryLottery(0, 30);
      await lottery.connect(acc4).entryLottery(0, 20);
      await lottery.connect(acc5).entryLottery(0, 30);

      await time.increase(round.duration);

      await vrfCoordinator.setRandomWords([5131]);
      await lottery
        .connect(adminAccount)
        .updateWinnerCalculationInRequest(true);

      await lottery
        .connect(adminAccount)
        .finishLotteryRound(0, [
          [acc6.address],
          [acc2.address, acc3.address],
          [acc4.address, acc5.address, acc7.address],
        ]);
      await expect(vrfCoordinator.fulfillRequest(0))
        .to.emit(lottery, "RoundFinished")
        .withArgs(0);

      const totalPrize = round.initialPrize.add(
        round.tokensForOneTicket.mul(130)
      );
      expect(await token2.balanceOf(acc6.address)).to.eq(
        totalPrize.div(100).mul(71)
      ); // totalPrize / 100 * 71
      expect(await token2.balanceOf(acc2.address)).to.eq(totalPrize.div(10)); // (totalPrize / 100 * 20) / 2
      expect(await token2.balanceOf(acc3.address)).to.eq(totalPrize.div(10)); // (totalPrize / 100 * 20) / 2
      expect(await token2.balanceOf(acc4.address)).to.eq(
        totalPrize.div(100).mul(3)
      ); // (totalPrize / 100 * 9) / 3
      expect(await token2.balanceOf(acc5.address)).to.eq(
        totalPrize.div(100).mul(3)
      ); // (totalPrize / 100 * 9) / 3
      expect(await token2.balanceOf(acc7.address)).to.eq(
        totalPrize.div(100).mul(3)
      ); // (totalPrize / 100 * 9) / 3
      expect(await token2.balanceOf(acc1.address)).to.eq(0);
    });
  });

  it("Should update params only by Admin", async () => {
    const { lottery, restSigners, adminAccount } = await loadFixture(
      deployLotteryFixture
    );

    const [
      acc,
      newTicketToken,
      newPaymentToken,
      newRewardToken,
      newRewardPool,
      newCoordinator,
    ] = restSigners;

    // updateTicketPrice
    await expect(lottery.connect(acc).updateTicketPrice(333)).to.be.reverted;
    // updateTicketId
    await expect(lottery.connect(acc).updateTicketId(5)).to.be.reverted;
    // updateDaysStreakForTicket
    await expect(lottery.connect(acc).updateDaysStreakForTicket(10)).to.be
      .reverted;
    // updateClaimPeriod
    await expect(lottery.connect(acc).updateClaimPeriod(100)).to.be.reverted;
    // updateTicketToken
    await expect(lottery.connect(acc).updateTicketToken(newTicketToken.address))
      .to.be.reverted;
    // updatePaymentToken
    await expect(
      lottery.connect(acc).updatePaymentToken(newPaymentToken.address)
    ).to.be.reverted;
    // updateRewardToken
    await expect(lottery.connect(acc).updateRewardToken(newRewardToken.address))
      .to.be.reverted;
    // updateRewardPool
    await expect(lottery.connect(acc).updateRewardPool(newRewardPool.address))
      .to.be.reverted;
    // updateSubscriptionId
    await expect(lottery.connect(acc).updateSubscriptionId(33)).to.be.reverted;
    // updateKeyHash
    await expect(
      lottery
        .connect(acc)
        .updateKeyHash(ethers.utils.formatBytes32String("new-hash"))
    ).to.be.reverted;
    // updateCallbackGasLimit
    await expect(lottery.connect(acc).updateCallbackGasLimit(555)).to.be
      .reverted;
    // updateRequestConfirmations
    await expect(lottery.connect(acc).updateRequestConfirmations(55)).to.be
      .reverted;
    // updateWinnerCalculationInRequest
    await expect(lottery.connect(acc).updateWinnerCalculationInRequest(true)).to
      .be.reverted;

    await grantAdminRole(lottery, adminAccount, acc.address);

    await lottery.connect(acc).updateTicketPrice(333);
    await lottery.connect(acc).updateTicketId(5);
    await lottery.connect(acc).updateDaysStreakForTicket(10);
    await lottery.connect(acc).updateClaimPeriod(100);
    await lottery.connect(acc).updateTicketToken(newTicketToken.address);
    await lottery.connect(acc).updatePaymentToken(newPaymentToken.address);
    await lottery.connect(acc).updateRewardToken(newRewardToken.address);
    await lottery.connect(acc).updateRewardPool(newRewardPool.address);
    await lottery.connect(acc).updateSubscriptionId(33);
    await lottery
      .connect(acc)
      .updateKeyHash(ethers.utils.formatBytes32String("new-hash"));
    await lottery.connect(acc).updateCallbackGasLimit(555);
    await lottery.connect(acc).updateRequestConfirmations(55);
    await lottery.connect(acc).updateWinnerCalculationInRequest(true);

    expect(await lottery.TICKET_PRICE()).to.eq(333);
    expect(await lottery.TICKET_ID()).to.eq(5);
    expect(await lottery.DAYS_STREAK_FOR_TICKET()).to.eq(10);
    expect(await lottery.CLAIM_PERIOD()).to.eq(100);
  });
});
