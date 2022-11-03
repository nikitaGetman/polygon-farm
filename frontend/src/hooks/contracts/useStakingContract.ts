import { Staking } from '@/types';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { useAccount, useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';
import { useSavContract } from './useSavContract';
import { useSavRContract } from './useSavRContract';

export const useStakingContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address: accountAddress } = useAccount();

  const { address: contractAddress, abi } = useContractAbi({ contract: ContractsEnum.Staking });
  const savToken = useSavContract();
  const savRToken = useSavRContract();

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Staking;

  const deposit = async ({
    planId,
    amount,
    referrer,
    isToken2,
  }: {
    planId: number;
    amount: BigNumberish;
    isToken2: boolean;
    referrer?: string;
  }): Promise<void> => {
    // TODO: what if call this method unauthorized
    if (!accountAddress) return;

    const token = isToken2 ? savRToken : savToken;

    const allowance = await token.allowance(accountAddress, contractAddress);
    if (allowance < BigNumber.from(amount)) {
      await token.approve(contractAddress, ethers.constants.MaxUint256);
    }

    const tx = await contract.deposit(
      planId,
      amount,
      isToken2,
      referrer || ethers.constants.AddressZero
    );
    await tx.wait();
  };

  const withdraw = async (planId: number, stakeId: number) => {
    return contract.withdraw(planId, stakeId);
  };

  const getContractInfo = async () => {
    return contract.getContractInfo();
  };

  // hasSubscription
  // subscribe

  return {
    contract,
    address: contractAddress,
    deposit,
    withdraw,
    getContractInfo,
  };
};
