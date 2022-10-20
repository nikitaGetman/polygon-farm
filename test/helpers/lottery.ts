import { BigNumber } from "ethers";
import { ethers } from "hardhat";
import {
  deployLottery,
  deployTicketToken,
  deployToken1,
  deployToken2,
} from "./deployments";

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

  const ticketToken = await deployTicketToken({ admin: adminAccount });

  const { lottery, vrfCoordinator } = await deployLottery({
    admin: adminAccount,
    rewardPool,
    rewardToken: token2,
    paymentToken: token1,
    ticketToken: ticketToken,
    deployParams: {
      ticketPrice: BigNumber.from(10).pow(19), // 10 tokens
      ticketId: 0,
      daysStreakForTicket: 5,
      subscriptionId: 10, // any for testing
      keyHash:
        "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f", // any for testing
    },
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
    vrfCoordinator,
  };
}
