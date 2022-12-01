import { VendorSell } from '@/types';
import { BigNumberish } from 'ethers';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useVendorSellContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.VendorSell,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as VendorSell;

  const getSwapRate = () => {
    return contract.swapRate();
  };

  const isSellAvailable = () => {
    return contract.isSellAvailable();
  };

  const buyTokens = async (spendAmount: BigNumberish) => {
    const tx = await contract.buyTokens(spendAmount);
    await tx.wait();
    return tx.hash;
  };

  const sellTokens = async (sellAmount: BigNumberish) => {
    const tx = await contract.sellTokens(sellAmount);
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address: contractAddress,
    getSwapRate,
    isSellAvailable,
    buyTokens,
    sellTokens,
  };
};
