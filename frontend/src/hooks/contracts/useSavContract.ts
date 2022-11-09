import { useProvider, useSigner, useContract, useAccount } from 'wagmi';
import type { BigNumber } from 'ethers';
import { ContractsEnum, useContractAbi } from './useContractAbi';

import { Token1 } from '@/types';

export enum SavEvent {
  Transfer = 'Transfer',
  Approval = 'Approval',
}

export const useSavContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address: accountAddress } = useAccount();

  const { address, abi } = useContractAbi({ contract: ContractsEnum.SAV });

  const contract = useContract({
    address,
    abi,
    signerOrProvider: signer || provider,
  }) as Token1;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const getUserBalance = async (): Promise<BigNumber | null> => {
    return accountAddress ? await contract.balanceOf(accountAddress) : null;
  };

  const decimals = async (): Promise<number> => {
    return contract.decimals();
  };

  const allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return contract.allowance(owner, spender);
  };

  const approve = async (spender: string, amount: BigNumber): Promise<void> => {
    const tx = await contract.approve(spender, amount);
    await tx.wait();
  };

  return {
    contract,
    address,
    balanceOf,
    decimals,
    allowance,
    approve,
    getUserBalance,
  };
};
