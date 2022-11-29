import { BigNumber, BigNumberish, ethers } from 'ethers';

export const bigNumberToString = (
  value: BigNumberish,
  decimals: number = 18,
  precision: number = 2
) => {
  const parts = ethers.utils.formatUnits(value, decimals).split('.');
  let fractional = parts[1].slice(0, precision);
  if (fractional === '0') fractional = '00';
  return fractional ? `${parts[0]}.${fractional}` : `${parts[0]}`;
};

export const bigNumberToNumber = (
  value: BigNumberish,
  decimals: number = 18,
  precision: number = 2
) => {
  const stringValue = bigNumberToString(value, decimals, precision);
  return parseFloat(stringValue);
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
  {
    decimals = 18,
    precision = 2,
    shortify = false,
  }: {
    decimals?: number;
    precision?: number;
    shortify?: boolean;
  } = {}
) => {
  const realAmount = parseFloat(ethers.utils.formatUnits(amount, decimals));
  const shortAmount = shortify ? realAmount * 10 : realAmount;

  if (shortAmount < 1000) return `${realAmount.toFixed(precision)}`;
  if (shortAmount < 1000000) return `${(realAmount / 1000).toFixed(precision)}k`;
  return `${(shortAmount / 1000000).toFixed(precision)}M`;
};

export const makeBigNumber = (value: BigNumberish, decimals: number = 18) => {
  return ethers.utils.parseUnits(value.toString(), decimals);
};
