import { BigNumber } from "ethers";
import { task, types } from "hardhat/config";
import { Lottery } from "typechain-types";

task("finish-lottery-round", "Finish lottery round")
  .addParam("round", "Round ID", null, types.int)
  //   .addOptionalParam("pk", "Winner public keys", null, types.any)
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const lottery = await ethers.getContract<Lottery>("Lottery", adminSigner);

    // const pk = [
    //   ["0xFCDF39C0FbE806857608f5Cc82CF5Dd6Ca69733D"],
    //   ["0x228B300FBfD88a46FED579C40Ad3630555E9339C"],
    // ];
    const pk = [[]];

    console.log(lottery.address, taskArgs.round, pk);
    await lottery.finishLotteryRound(BigNumber.from(taskArgs.round), pk);
  });
