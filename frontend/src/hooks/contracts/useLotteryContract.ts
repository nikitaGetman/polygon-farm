import { BigNumber, BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Lottery } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export type CreateLotteryProps = {
  startTime: number;
  duration: number;
  initialPrize: BigNumber;
  tokensForOneTicket: BigNumber;
  maxTicketsFromOneMember: number;
  winnersForLevel: number[];
  prizeForLevel: number[];
};

export const useLotteryContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Lottery,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Lottery;

  const getWinnerTotalPrize = (address: string) => {
    return contract.getWinnerPrize(address);
  };

  const getTicketPrice = () => {
    return contract.TICKET_PRICE();
  };

  const getRounds = () => {
    return contract.getRounds();
  };

  const getRound = (roundId: BigNumberish) => {
    return contract.getRound(roundId);
  };

  const getUserRoundEntry = (user?: string, roundId?: BigNumberish) => {
    return user && roundId !== undefined
      ? contract.getUserRoundEntry(user, roundId)
      : Promise.reject('incorrect request params');
  };

  const getActiveRounds = () => {
    return contract.getActiveRounds();
  };

  const getLastFinishedRounds = (length: number, offset: number) => {
    return contract.getLastFinishedRounds(length, offset);
  };

  const getClaimPeriod = () => {
    return contract.CLAIM_PERIOD();
  };

  const isClaimedToday = (user?: string) => {
    return user ? contract.isClaimedToday(user) : Promise.reject('incorrect request data');
  };

  const getLastClaimTime = (user?: string) => {
    return user ? contract.getLastClaimTime(user) : Promise.reject('incorrect request data');
  };

  const getClaimStreak = (user?: string) => {
    return user ? contract.getClaimStreak(user) : Promise.reject('incorrect request data');
  };

  const isMintAvailable = (user?: string) => {
    return user ? contract.isMintAvailable(user) : Promise.reject('incorrect request data');
  };

  const entryLottery = async (roundId: BigNumberish, tickets: BigNumberish) => {
    const tx = await contract.entryLottery(roundId, tickets);
    return waitForTransaction(tx);
  };

  const buyTickets = async (amount: BigNumberish) => {
    const tx = await contract.buyTickets(amount);
    return waitForTransaction(tx);
  };

  const claimDay = async () => {
    const tx = await contract.claimDay();
    return waitForTransaction(tx);
  };

  const mintMyTicket = async () => {
    const tx = await contract.mintMyTicket();
    return waitForTransaction(tx);
  };

  // Administration
  const updateTicketPrice = async (price: BigNumber) => {
    const tx = await contract.updateTicketPrice(price);
    return waitForTransaction(tx);
  };

  const finishLotteryRound = async (roundId: number, pk: string[][]) => {
    const tx = await contract.finishLotteryRound(roundId, pk);
    return waitForTransaction(tx);
  };

  const manuallyGetWinners = async (roundId: number) => {
    const tx = await contract.manuallyGetWinners(roundId);
    return waitForTransaction(tx);
  };

  const createLotteryRound = async ({
    startTime,
    duration,
    initialPrize,
    tokensForOneTicket,
    maxTicketsFromOneMember,
    winnersForLevel,
    prizeForLevel,
  }: CreateLotteryProps) => {
    const tx = await contract.createLotteryRound(
      startTime,
      duration,
      initialPrize,
      tokensForOneTicket,
      maxTicketsFromOneMember,
      winnersForLevel,
      prizeForLevel
    );
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getTicketPrice,
    getWinnerTotalPrize,
    getRounds,
    getRound,
    getUserRoundEntry,
    getActiveRounds,
    getLastFinishedRounds,

    getClaimPeriod,
    getClaimStreak,
    isClaimedToday,
    getLastClaimTime,
    isMintAvailable,

    entryLottery,
    buyTickets,
    claimDay,
    mintMyTicket,

    updateTicketPrice,
    finishLotteryRound,
    manuallyGetWinners,
    createLotteryRound,
  };
};
