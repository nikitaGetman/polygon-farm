import { BigNumber } from "ethers";
import { task, types } from "hardhat/config";
import { Lottery } from "typechain-types";
import { calculateFairPercents } from "utils/calc-percents";
import { getRandom } from "./utils";

task("create-lottery", "Create lottery round (returns lottery id)")
  .addOptionalParam("startTime", "Start time (timestamp sec)")
  .addOptionalParam("duration", "Round duration (sec)")
  .addOptionalParam("initialPrize", "Initial prize (number of tokens)")
  .addOptionalParam("tokensForOneTicket", "Tokens for one ticket")
  .addOptionalParam("maxTicketsFromOneMember", "Max tickets from one member")
  .addOptionalParam(
    "winnersForLevel",
    "Winners for level (array)",
    null,
    types.json
  )
  .addOptionalParam(
    "prizeForLevel",
    "Prize for level (array)",
    null,
    types.json
  )
  .setAction(async (taskArgs, { ethers, getNamedAccounts }) => {
    const { admin } = await getNamedAccounts();
    const adminSigner = await ethers.getSigner(admin);
    const lottery = await ethers.getContract<Lottery>("Lottery", adminSigner);

    const params = {
      startTime:
        parseInt(taskArgs.startTime) ||
        Math.floor(Date.now() / 1000 + getRandom(30, 1800)),
      duration: parseInt(taskArgs.duration) || getRandom(300, 1800),
      initialPrize: parseInt(taskArgs.initialPrize) || getRandom(30, 5000),
      tokensForOneTicket:
        parseInt(taskArgs.tokensForOneTicket) || getRandom(0, 10),
      maxTicketsFromOneMember:
        parseInt(taskArgs.maxTicketsFromOneMember) || getRandom(1, 10),
      winnersForLevel: getWinners(taskArgs.winnersForLevel),
      prizeForLevel: getPrize(taskArgs.prizeForLevel),
    };

    console.log("Lottery params: ");
    console.dir(params);

    const totalRounds = await lottery.getTotalRounds();
    const tx = await lottery.createLotteryRound(
      params.startTime,
      params.duration,
      BigNumber.from(10).pow(18).mul(params.initialPrize),
      BigNumber.from(10).pow(18).mul(params.tokensForOneTicket),
      params.maxTicketsFromOneMember,
      params.winnersForLevel,
      params.prizeForLevel
    );
    await tx.wait();

    console.log(`Round created. RoundID = ${totalRounds.toNumber()}`);

    return totalRounds.toNumber();
  });

let _winnerLevels: number | null = null;
const getWinners = (winnersJson?: string) => {
  let winners = [];
  if (!winnersJson) {
    winners = getRandomWinners();
  } else {
    winners = JSON.parse(winnersJson);
    _winnerLevels = winners.length;
  }
  return winners;
};
const getRandomWinners = () => {
  const length = _winnerLevels || getRandom(1, 10);
  const winners = Array.from({ length }).map(() => getRandom(1, 5));

  _winnerLevels = _winnerLevels ? null : length; // toggle
  return winners;
};

const getPrize = (prizesJson?: string) => {
  let prizes = [];
  if (!prizesJson) {
    prizes = getRandomPrizes();
  } else {
    prizes = JSON.parse(prizesJson);
    _winnerLevels = prizes.length;
  }
  return prizes;
};
const getRandomPrizes = () => {
  const length = _winnerLevels || getRandom(1, 10);
  const prizes = Array.from({ length }).map(() => getRandom(1, 10));

  const fairPrizes = calculateFairPercents(prizes);

  _winnerLevels = _winnerLevels ? null : length; // toggle
  return fairPrizes;
};
