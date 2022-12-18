import { task } from "hardhat/config";
import { Lottery, Staking, Ticket, VRFCoordinatorMock } from "typechain-types";
import { getRandom, wait } from "./utils";

task("create-finished-lottery", "Create new round and finish it").setAction(
  async (_, { ethers, getNamedAccounts, run, network }) => {
    const getChainTime = async () => {
      return (await staking.getTimestamp()).toNumber();
    };

    const { admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const lottery = await ethers.getContract<Lottery>("Lottery", adminSigner);
    const ticket = await ethers.getContract<Ticket>("Ticket", adminSigner);
    const staking = await ethers.getContract<Staking>("Staking", adminSigner);
    const vrfCoordinator = await ethers.getContract<VRFCoordinatorMock>(
      "VRFCoordinatorMock",
      adminSigner
    );

    const newRoundId = await lottery.getTotalRounds();

    const winners = Array.from({ length: getRandom(1, 3) }).map(() =>
      getRandom(1, 5)
    );

    const chainTime = await getChainTime();
    const startTime = chainTime + 5;
    const duration = 40;
    await run("create-lottery", {
      winnersForLevel: JSON.stringify(winners),
      startTime: startTime.toString(),
      duration: duration.toString(),
    });
    const { maxTicketsFromOneMember } = await lottery.getRound(newRoundId);

    await wait(5); // wait for round start

    // create lottery participants
    const signers = (await ethers.getSigners()).slice(10);
    let elapsedTime = 0;
    for (let i = 0; i < signers.length; i++) {
      const ticketsAmount = getRandom(1, maxTicketsFromOneMember.toNumber());
      const signer = signers[i];

      const mintTx = await ticket.mint(
        signer.address,
        0,
        ticketsAmount,
        ethers.utils.toUtf8Bytes("")
      );
      await mintTx.wait();

      const approveTx = await ticket
        .connect(signer)
        .setApprovalForAll(lottery.address, true);
      await approveTx.wait();

      const entryTx = await lottery
        .connect(signer)
        .entryLottery(newRoundId, ticketsAmount);
      await entryTx.wait();

      console.log(
        `${i + 1} participant (${
          signer.address
        }) entered with ${ticketsAmount} tickets`
      );

      const contractTime = await getChainTime();
      elapsedTime = startTime + duration - contractTime;
      if (elapsedTime < 0) {
        break;
      }
    }
    if (elapsedTime > 0) {
      console.log(`Time until round finish = ${elapsedTime} sec. Waiting...`);
      await wait(elapsedTime + 3);
    }

    if (!network.live) {
      const setRandomTx = await vrfCoordinator.setRandomWords([
        getRandom(1, 100),
      ]);
      await setRandomTx.wait();
    }
    const tx = await lottery.finishLotteryRound(newRoundId, [
      // [signers[0].address],
      // [signers[1].address],
    ]);
    await tx.wait();

    if (!network.live) {
      const requestsLength = (
        await vrfCoordinator.getRequestsLength()
      ).toNumber();
      const fulfillTx = await vrfCoordinator.fulfillRequest(requestsLength - 1);
      await fulfillTx.wait();

      const getWinnersTx = await lottery.manuallyGetWinners(newRoundId);
      await getWinnersTx.wait();
    }

    console.log(`Round with id ${newRoundId.toNumber()} finished`);
    console.log("Winners is: ");
    const roundState = await lottery.getRound(newRoundId);
    for (let i = 0; i < roundState.winners.length; i++) {
      console.log(`Level ${i}: `, roundState.winners[i]);
    }
  }
);
