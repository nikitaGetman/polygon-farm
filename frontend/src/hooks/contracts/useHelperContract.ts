import { useContract, useProvider, useSigner } from 'wagmi';

import { Helper } from '@/types';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useHelperContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Helper,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Helper;

  const getReferralsFullInfoByLevel = async (user: string, level: number) => {
    const res = await contract.getUserReferralsFullInfoByLevel(user, level);
    return res.map((r) => ({ ...r }));
  };

  const getUserSquadsInfo = async (address: string) => {
    const res = await contract.getUserSquadsInfo(address);
    return res.map(({ plan, squadStatus, members, userHasSufficientStaking }) => ({
      plan: { ...plan },
      squadStatus: { ...squadStatus },
      members,
      userHasSufficientStaking,
    }));
  };

  const getLotteryRoundWinnersWithTickets = async (roundId?: number) => {
    return roundId !== undefined
      ? await contract.getLotteryRoundWinnersWithTickets(roundId)
      : Promise.reject('Round id is undefined');
  };

  return {
    contract,
    address: contractAddress,
    getReferralsFullInfoByLevel,
    getUserSquadsInfo,
    getLotteryRoundWinnersWithTickets,
  };
};
