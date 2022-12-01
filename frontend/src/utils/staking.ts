import { BigNumber } from 'ethers';

export const calculateStakeReward = (stake: {
  isToken2: boolean;
  profit: BigNumber;
  amount: BigNumber;
}) => {
  return stake.isToken2 ? stake.profit : stake.profit.add(stake.amount);
};
