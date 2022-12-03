import { Lottery } from '@/types';
import { useContract, useProvider, useSigner } from 'wagmi';
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

  const getRound = (roundId: number) => {
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
    await tx.wait();
    return tx.hash;
  };

  const buyTickets = async (amount: number) => {
    const tx = await contract.buyTickets(amount);
    await tx.wait();
    return tx.hash;
  };

  const claimDay = async () => {
    const tx = await contract.claimDay();
    await tx.wait();
    return tx.hash;
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
