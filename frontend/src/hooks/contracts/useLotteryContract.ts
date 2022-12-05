import { BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Lottery } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

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

  const getRound = (roundId: BigNumberish) => {
    return contract.getRound(roundId);
  };

  const getActiveRounds = () => {
    return contract.getActiveRounds();
  };

  const getLastFinishedRounds = (length: number, offset: number) => {
    return contract.getLastFinishedRounds(length, offset);
  };

  const isClaimedToday = (user: string) => {
    return contract.isClaimedToday(user);
  };

  const getClaimStreak = (user: string) => {
    return contract.getClaimStreak(user);
  };

  const entryLottery = async (roundId: number, tickets: number) => {
    const tx = await contract.entryLottery(roundId, tickets);
    return waitForTransaction(tx);
  };

  const buyTickets = async (amount: number) => {
    const tx = await contract.buyTickets(amount);
    return waitForTransaction(tx);
  };

  const claimDay = async () => {
    const tx = await contract.claimDay();
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getTicketPrice,
    getWinnerTotalPrize,
    getRound,
    getActiveRounds,
    getLastFinishedRounds,
    getClaimStreak,
    isClaimedToday,
    entryLottery,
    buyTickets,
    claimDay,
  };
};
