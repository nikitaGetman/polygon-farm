import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import { Lottery } from "typechain-types";
import {
  deployLottery,
  deployTicketToken,
  deployToken1,
  deployToken2,
} from "./deployments";

export async function deployTicketFixture() {
  const [adminAccount, ...restSigners] = await ethers.getSigners();
  const ticketToken = await deployTicketToken({ admin: adminAccount });
  return { ticketToken, adminAccount, restSigners };
}

export async function deployLotteryFixture() {
  const [adminAccount, token1Holder, token2Holder, rewardPool, ...restSigners] =
    await ethers.getSigners();

  // Deploy Tokens
  const initialSupply = BigNumber.from(10).pow(18).mul(21_000_000);
  const token1 = await deployToken1({
    admin: adminAccount,
    initialSupply,
    initialHolder: token1Holder.address,
  });

  const token2 = await deployToken2({
    admin: adminAccount,
    initialSupply,
    initialHolder: token2Holder.address,
  });
  await token2
    .connect(token2Holder)
    .transfer(rewardPool.address, initialSupply);
  await token2.connect(adminAccount).addToWhitelist([rewardPool.address]);

  const ticketToken = await deployTicketToken({ admin: adminAccount });

  const lotteryDeployParams = {
    ticketPrice: BigNumber.from(10).pow(19), // 10 tokens
    ticketId: 0,
    daysStreakForTicket: 5,
    subscriptionId: 10, // any for testing
    keyHash:
      "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f", // any for testing
  };

  const { lottery, vrfCoordinator } = await deployLottery({
    admin: adminAccount,
    rewardPool,
    rewardToken: token2,
    paymentToken: token1,
    ticketToken: ticketToken,
    deployParams: lotteryDeployParams,
  });

  return {
    adminAccount,
    initialSupply,
    token1,
    token2,
    token1Holder,
    token2Holder,
    rewardPool,
    restSigners,
    ticketToken,
    lottery,
    lotteryDeployParams,
    vrfCoordinator,
  };
}

type LotteryRound = {
  startTimestamp: number;
  duration: number;
  initialPrize: number | BigNumber;
  tokensForOneTicket: number | BigNumber;
  maxTicketsFromOneMember: number;
  winners: number[];
  prizeForLevel: number[];
};
export async function createLotteryRounds(
  lottery: Lottery,
  admin: SignerWithAddress,
  rounds: LotteryRound[]
) {
  for (let i = 0; i < rounds.length; i++) {
    const {
      startTimestamp,
      duration,
      initialPrize,
      tokensForOneTicket,
      maxTicketsFromOneMember,
      winners,
      prizeForLevel,
    } = rounds[i];

    await lottery
      .connect(admin)
      .createLotteryRound(
        startTimestamp,
        duration,
        initialPrize,
        tokensForOneTicket,
        maxTicketsFromOneMember,
        winners,
        prizeForLevel
      );
  }
}
