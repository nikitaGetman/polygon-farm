import { BigNumberish, ethers } from 'ethers';

export const bigNumberToString = (value: BigNumberish, decimals: number) => {
  const parts = ethers.utils.formatUnits(value, decimals).split('.');
  const fractional = parts[1].slice(0, 3);
  return `${parts[0]}.${fractional}`;
};
