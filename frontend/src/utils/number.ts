import { BigNumber, BigNumberish, ethers } from 'ethers';

export const bigNumberToString = (
  value: BigNumberish,
  {
    decimals = 18,
    precision = 2,
  }: {
    decimals?: number;
    precision?: number;
  } = {}
) => {
  const parts = ethers.utils.formatUnits(value, decimals).split('.');
  let fractional = parts[1].slice(0, precision);
  if (fractional === '0') fractional = '00';
  return fractional ? `${parts[0]}.${fractional}` : `${parts[0]}`;
};

export const bigNumberToNumber = (
  value: BigNumberish,
  {
    decimals = 18,
    precision = 2,
  }: {
    decimals?: number;
    precision?: number;
  } = {}
) => {
  const stringValue = bigNumberToString(value, { decimals, precision });
  return parseFloat(stringValue);
};

const PERCENT_DIVIDER = 1000.0;
export const getYearlyAPR = (profit: BigNumberish, duration: BigNumberish) => {
  return roundToPrecision(
    (((BigNumber.from(profit).toNumber() / PERCENT_DIVIDER) * 100) /
      BigNumber.from(duration).toNumber()) *
      365.0,
    2
  );
};

export const getReadableAmount = (
  amount: BigNumberish,
  {
    decimals = 18,
    precision = 2,
    shortify = false,
    prettify = false,
  }: {
    decimals?: number;
    precision?: number;
    shortify?: boolean;
    prettify?: boolean;
  } = {}
) => {
  const realAmount = parseFloat(ethers.utils.formatUnits(amount, decimals));
  const shortAmount = shortify ? realAmount * 10 : realAmount;

  if (shortAmount < 1000) return roundToPrecision(realAmount, precision);
  if (shortAmount < 1000000)
    return beautifyAmount(roundToPrecision(realAmount / 1000, precision), 'k', prettify);

  return beautifyAmount(roundToPrecision(realAmount / 1000000, precision), 'M', prettify);
};

export const makeBigNumber = (value: BigNumberish, decimals: number = 18) => {
  return ethers.utils.parseUnits(value.toString(), decimals);
};

export const beautifyAmount = (amount: number | string, symbol: string, prettify: boolean) => {
  const amountNumber = parseFloat(amount.toString());

  const delimiter = prettify ? ' ' : '';
  if (amount < 1000) return `${amountNumber}${delimiter}${symbol}`;
  return `${roundToPrecision(amountNumber / 1000, 0)}${delimiter}${(amountNumber % 1000)
    .toString()
    .padStart(3, '0')}${delimiter}${symbol}`;
};

const roundToPrecision = (amount: number, precision: number) => {
  const mul = 10 ** precision;
  return Math.floor(amount * mul) / mul;
};
