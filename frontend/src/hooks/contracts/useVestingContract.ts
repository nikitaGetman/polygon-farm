import { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { TokenVesting } from '@/types';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export type VestingScheduleProps = {
  beneficiaries: string[];
  start: number;
  cliff: number;
  duration: number;
  slicePeriodSeconds: number;
  revocable: boolean;
  amount: BigNumber;
};
export const useVestingContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.TokenVesting,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as TokenVesting;

  const createVestingSchedules = async ({
    beneficiaries,
    start,
    cliff,
    duration,
    slicePeriodSeconds,
    revocable,
    amount,
  }: VestingScheduleProps) => {
    const tx = await contract.createVestingSchedules(
      beneficiaries,
      start,
      cliff,
      duration,
      slicePeriodSeconds,
      revocable,
      amount
    );
    return waitForTransaction(tx);
  };

  return { contract, contractAddress, createVestingSchedules };
};
