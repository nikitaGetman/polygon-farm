import { TransferEvent } from '@/../../typechain-types/contracts/tokens/BasicToken';
import { bigNumberToNumber } from './number';

export const BALANCE_HISTORY_PERIOD = 1 * 30 * 24 * 60 * 60 * 1000; // 1 month

type BalanceHistoryType = {
  token1: number;
  token2: number;
  block: number;
};
type BalanceHistoryReturnType = BalanceHistoryType[];
export const getBalanceHistoryFromTransfers = (
  token1Transfers: TransferEvent[],
  token2Transfers: TransferEvent[],
  userAccount: string
): BalanceHistoryReturnType => {
  const token1Address = token1Transfers[0].address;

  const tokensHistory = token1Transfers
    .concat(token2Transfers)
    .sort((t1, t2) => t1.blockNumber - t2.blockNumber)
    .reduce((acc, transfer) => {
      const block = transfer.blockNumber;
      const isToken1 = transfer.address === token1Address;
      let amount = bigNumberToNumber(transfer.args.value);
      if (transfer.args.from === userAccount) {
        amount = -amount;
      }

      if (!acc.length) {
        if (isToken1) {
          acc.push({ token1: amount, token2: 0, block });
        } else {
          acc.push({ token1: 0, token2: amount, block });
        }
      } else {
        const lastBalance = acc[acc.length - 1];

        if (lastBalance.block === block) {
          if (isToken1) {
            acc[acc.length - 1].token1 += amount;
          } else {
            acc[acc.length - 1].token2 += amount;
          }
        } else {
          if (isToken1) {
            acc.push({ token1: lastBalance.token1 + amount, token2: lastBalance.token2, block });
          } else {
            acc.push({ token1: lastBalance.token1, token2: lastBalance.token2 + amount, block });
          }
        }
      }

      return acc;
    }, [] as BalanceHistoryType[]);

  // Hack for preventing only one dot on chart
  if (tokensHistory.length === 1) {
    const data = tokensHistory[0];
    tokensHistory.push({ ...data, block: data.block + 1 });
  }

  return tokensHistory;
};
