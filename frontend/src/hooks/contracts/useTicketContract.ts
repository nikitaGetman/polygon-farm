import { Ticket } from '@/types';
import { useContract, useProvider, useSigner } from 'wagmi';
import { ContractsEnum, useContractAbi } from './useContractAbi';

export const useTicketContract = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const { address: contractAddress, abi } = useContractAbi({
    contract: ContractsEnum.Ticket,
  });

  const contract = useContract({
    address: contractAddress,
    abi,
    signerOrProvider: signer || provider,
  }) as Ticket;

  const balanceOf = (account: string, tokenId: number = 0) => {
    return contract.balanceOf(account, tokenId);
  };

  const isApprovedForAll = (account: string, operator: string) => {
    return contract.isApprovedForAll(account, operator);
  };
  const setApprovalForAll = async (operator: string, isApproved: boolean) => {
    const tx = await contract.setApprovalForAll(operator, isApproved);
    await tx.wait();
    return tx.hash;
  };

  return {
    contract,
    address: contractAddress,

    balanceOf,
    isApprovedForAll,
    setApprovalForAll,
  };
};
