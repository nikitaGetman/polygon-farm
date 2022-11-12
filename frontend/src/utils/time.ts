import { BigNumber, BigNumberish } from 'ethers';

export const getReadableDuration = (days: BigNumberish) => {
  const numberDays = BigNumber.from(days).toNumber();

  if (numberDays < 30) return `${numberDays} days`;
  if (numberDays < 365) return `${numberDays / 30} mnth`;

  return `${numberDays / 365} years`;
};

export const getLocalDateString = (timestamp: BigNumberish) => {
  const t = BigNumber.from(timestamp).toNumber() * 1000;
  const date = new Date(t);

  return date.toLocaleString();
};