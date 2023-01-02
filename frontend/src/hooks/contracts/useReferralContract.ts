import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { ReferralManager } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useReferralContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.ReferralManager,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as ReferralManager;

  const getUserInfo = async (address: string) => {
    return contract.getUserInfo(address);
  };

  const subscribeToLevel = async (level: number): Promise<string> => {
    const tx = await contract.subscribeToLevel(level);
    return waitForTransaction(tx);
  };

  const subscribeToAllLevels = async (): Promise<string> => {
    const tx = await contract.subscribeToAllLevels();
    return waitForTransaction(tx);
  };

  const setMyReferrer = async (referrer: string) => {
    const tx = await contract.setMyReferrer(referrer);
    return waitForTransaction(tx);
  };

  const claimRewards = async (amount: BigNumber) => {
    const tx = await contract.claimDividends(amount);
    return waitForTransaction(tx);
  };

  const getRewards = async (account: string) => {
    const filter = contract.filters.DividendsAdded(account);
    return await contract.queryFilter(filter);
  };

  const updateLevelSubscriptionCost = async (newCost: BigNumber) => {
    const tx = await contract.updateLevelSubscriptionCost(newCost);
    return waitForTransaction(tx);
  };

  const updateFullSubscriptionCost = async (newCost: BigNumber) => {
    const tx = await contract.updateFullSubscriptionCost(newCost);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address: contractAddress,
    getUserInfo,
    subscribeToLevel,
    subscribeToAllLevels,
    setMyReferrer,
    claimRewards,
    getRewards,
    updateLevelSubscriptionCost,
    updateFullSubscriptionCost,
  };
};
