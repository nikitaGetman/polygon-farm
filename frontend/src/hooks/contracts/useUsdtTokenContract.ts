import { ERC20 } from '@/types';
import { BigNumber } from 'ethers';
import { useContract, useNetwork, erc20ABI, useProvider, useSigner } from 'wagmi';
import Contracts from '@/config/contracts.json';
import { ChainIDsEnum } from '@/config';

const POLYGON_USDT_ADDRESS = '';

export const useUsdtTokenContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { chain } = useNetwork();

  let address;
  //   TODO: add usdt addresses
  if (chain?.network === 'matic') {
    address = POLYGON_USDT_ADDRESS;
  } else if (chain?.network === 'maticmum') {
    address = (Contracts as any)[ChainIDsEnum.mumbai][0].contracts.ERC20BurnableMock.address;
  } else {
    address = (Contracts as any)[ChainIDsEnum.hardhat][0].contracts.ERC20BurnableMock.address;
  }

  const contract = useContract({
    address,
    abi: erc20ABI,
    signerOrProvider: signer || provider,
  }) as unknown as ERC20;

  const balanceOf = async (address: string): Promise<BigNumber> => {
    return contract.balanceOf(address);
  };

  const decimals = async () => {
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
    balanceOf,
    decimals,
    allowance,
    approve,
  };
};
