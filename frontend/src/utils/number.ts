import { BigNumber, BigNumberish, ethers } from 'ethers';

export const bigNumberToString = (
  value: BigNumberish,
  decimals: number = 18,
  precision: number = 3
) => {
  const parts = ethers.utils.formatUnits(value, decimals).split('.');
  let fractional = parts[1].slice(0, precision);
  if (fractional === '0') fractional = '00';
  return fractional ? `${parts[0]}.${fractional}` : `${parts[0]}`;
};

const PERCENT_DIVIDER = 1000.0;
export const getYearlyAPR = (profit: BigNumberish, duration: BigNumberish) => {
  return (
    (((BigNumber.from(profit).toNumber() / PERCENT_DIVIDER) * 100) /
      BigNumber.from(duration).toNumber()) *
    365.0
  ).toFixed(2);
};

export const getReadableAmount = (
  amount: BigNumberish,
  decimals: number = 18,
  precision: number = 2
) => {
  const amountFloat = parseFloat(ethers.utils.formatUnits(amount, decimals));

  if (amountFloat < 1000) return `${amountFloat.toFixed(precision)}`;
  if (amountFloat < 1000000) return `${(amountFloat / 1000).toFixed(precision)}k`;
  return `${(amountFloat / 1000000).toFixed(precision)}M`;
};

export const makeBigNumber = (value: BigNumberish) => {
  return ethers.utils.parseEther(value.toString());
};
