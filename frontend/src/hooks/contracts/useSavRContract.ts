import { useProvider, useSigner, useContract, useAccount } from 'wagmi';
import type { BigNumber } from 'ethers';
import { ContractsEnum, useContractAbi } from './useContractAbi';

import { Token2 } from '@/types';

export enum SavREvent {
  Transfer = 'Transfer',
  Approval = 'Approval',
}

export const useSavRContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address: accountAddress } = useAccount();

  const { address, abi } = useContractAbi({ contract: ContractsEnum.SAVR });

  const contract = useContract({
    address,
    abi,
    signerOrProvider: signer || provider,
  }) as Token2;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const getUserBalance = async (): Promise<BigNumber | null> => {
    return accountAddress ? contract.balanceOf(accountAddress) : null;
  };

  const decimals = async (): Promise<number> => {
    return contract.decimals();
  };

  const allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return contract.allowance(owner, spender);
  };

  const approve = async (spender: string, amount: BigNumber): Promise<string> => {
    const tx = await contract.approve(spender, amount);
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address,
    balanceOf,
    getUserBalance,
    decimals,
    allowance,
    approve,
  };
};
