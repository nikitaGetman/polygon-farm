import { task } from "hardhat/config";
import { LOTTERIES } from "../../config/mocks/lottery";

task("create-lottery-from-mock", "Create lottery rounds from mock").setAction(
  async (_, { run }) => {
    for (const lottery of LOTTERIES) {
      await run("create-lottery", {
        startTime: lottery.startTime.toString(),
        duration: lottery.duration.toString(),
        initialPrize: lottery.initialPrize.toString(),
        tokensForOneTicket: lottery.tokensForOneTicket.toString(),
        maxTicketsFromOneMember: lottery.maxTicketsFromOneMember.toString(),
        winnersForLevel: JSON.stringify(lottery.winnersForLevel),
        prizeForLevel: JSON.stringify(lottery.prizeForLevel),
      });
    }
  }
);
