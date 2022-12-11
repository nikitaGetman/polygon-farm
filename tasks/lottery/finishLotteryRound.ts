import { BigNumber } from "ethers";
import { task, types } from "hardhat/config";
import { Lottery } from "typechain-types";

task("finish-lottery", "Finish lottery round")
  .addParam("round", "Round ID", null, types.int)
  //   .addOptionalParam("pk", "Winner public keys", null, types.any)
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const lottery = await ethers.getContract<Lottery>("Lottery", adminSigner);

    // const pk = [
    //   ["0x1E0B929A89Db54E0771E848ca5Ca3c601D93EAdE"],
    //   ["0x1839E2Baa7a4E3EEE4452Dae58E88FD7F0883f87"],
    //   ["0x09C8F037a9b779294aa1e2a1d9cAe9D73A71Ba40"],
    // ];
    const pk = [[]];

    console.log(lottery.address, taskArgs.round, pk);
    const tx = await lottery.finishLotteryRound(
      BigNumber.from(taskArgs.round),
      pk
    );
    await tx.wait();
  });
