import { ContractTransaction } from 'ethers';
import { Logger } from 'ethers/lib/utils';

export const waitForTransaction = async (tx: ContractTransaction): Promise<string> => {
  try {
    await tx.wait();
    return tx.hash;
  } catch (error: any) {
    if (error.code === Logger.errors.TRANSACTION_REPLACED && !error.cancelled) {
      return error?.replacement?.hash || '';
    }
    throw error;
  }
};
