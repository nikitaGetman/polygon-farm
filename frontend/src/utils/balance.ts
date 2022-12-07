import { BigNumber } from 'ethers';

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
  currentToken1Balance: BigNumber,
  currentToken2Balance: BigNumber,
  currentBlock: number,
  userAccount: string
): BalanceHistoryReturnType => {
  const token1Address = token1Transfers[0] ? token1Transfers[0].address : null;

  const tokensHistory = token1Transfers
    .concat(token2Transfers)
    .sort((t1, t2) => t2.blockNumber - t1.blockNumber)
    .reduce(
      (acc, transfer) => {
        const block = transfer.blockNumber;
        const isToken1 = transfer.address === token1Address;
        let transferAmount = bigNumberToNumber(transfer.args.value);
        if (transfer.args.from === userAccount) {
          transferAmount = -transferAmount;
        }

        const lastBalance = acc[acc.length - 1];

        if (lastBalance.block === block) {
          if (isToken1) {
            acc[acc.length - 1].token1 -= transferAmount;
          } else {
            acc[acc.length - 1].token2 -= transferAmount;
          }
        } else {
          if (isToken1) {
            acc.push({
              token1: lastBalance.token1 - transferAmount,
              token2: lastBalance.token2,
              block,
            });
          } else {
            acc.push({
              token1: lastBalance.token1,
              token2: lastBalance.token2 - transferAmount,
              block,
            });
          }
        }

        return acc;
      },
      [
        {
          token1: bigNumberToNumber(currentToken1Balance),
          token2: bigNumberToNumber(currentToken2Balance),
          block: currentBlock,
        },
      ] as BalanceHistoryType[]
    )
    .reverse();

  // Hack for preventing single dot on chart
  if (tokensHistory.length === 1) {
    tokensHistory.push({ ...tokensHistory[0], block: tokensHistory[0].block + 1 });
  }

  return tokensHistory;
};
