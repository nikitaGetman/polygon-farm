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
  let fractional = parts[1].slice(0, precision).padEnd(precision, '0');
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

export const getYearlyAPR = (apr: string | number) => {
  return parseFloat(apr.toString()).toFixed(2);
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

  let parts = amountNumber > 0 ? [symbol] : [amountNumber, symbol];
  let restNumber = amountNumber;
  while (restNumber > 0) {
    const isLastPart = restNumber < 1000;
    parts.unshift((restNumber % 1000).toString().padStart(isLastPart ? 0 : 3, '0'));
    restNumber = Math.floor(restNumber / 1000);
  }

  const delimiter = prettify ? ' ' : '';

  return parts.join(delimiter);
};

const roundToPrecision = (amount: number, precision: number) => {
  const mul = 10 ** precision;
  return Math.floor(amount * mul) / mul;
};
