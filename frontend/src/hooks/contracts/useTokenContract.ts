import EthDater from 'ethereum-block-by-date';
import type { BigNumber } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';

import { Token1 } from '@/types';
import { BALANCE_HISTORY_PERIOD } from '@/utils/balance';
import { waitForTransaction } from '@/utils/waitForTransaction';

import { ContractsEnum, useContractAbi } from './useContractAbi';

export enum SavEvent {
  Transfer = 'Transfer',
  Approval = 'Approval',
}

export const useTokenContract = (token: ContractsEnum.SAV | ContractsEnum.SAVR) => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  const dater = new EthDater(provider);

  const { address, abi } = useContractAbi({ contract: token });

  const contract = useContract({
    address,
    abi,
    signerOrProvider: signer || provider,
  }) as Token1;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const getBalanceHistoryTransfers = async (account: string) => {
    const { block } = await dater.getDate(Date.now() - BALANCE_HISTORY_PERIOD);

    const filterFrom = contract.filters.Transfer(account);
    const filterTo = contract.filters.Transfer(null, account);

    const fromTransfersRequest = contract.queryFilter(filterFrom, block);
    const toTransfersRequest = contract.queryFilter(filterTo, block);
    return (await Promise.all([fromTransfersRequest, toTransfersRequest]))
      .reduce((acc, transfers) => {
        acc.push(...transfers);
        return acc;
      }, [])
      .sort((t1, t2) => t1.blockNumber - t2.blockNumber);
  };

  const decimals = async (): Promise<number> => {
    return contract.decimals();
  };

  const allowance = async (owner: string, spender: string): Promise<BigNumber> => {
    return contract.allowance(owner, spender);
  };

  const totalSupply = async () => {
    return contract.totalSupply();
  };

  const totalBurned = async () => {
    return contract.totalBurn();
  };

  const approve = async (spender: string, amount: BigNumber): Promise<string> => {
    const tx = await contract.approve(spender, amount);
    return waitForTransaction(tx);
  };

  return {
    contract,
    address,
    balanceOf,
    getBalanceHistoryTransfers,
    decimals,
    allowance,
    approve,
    totalBurned,
    totalSupply,
  };
};
