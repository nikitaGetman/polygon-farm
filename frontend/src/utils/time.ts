import { BigNumber, BigNumberish } from 'ethers';

export const getReadableDuration = (days: BigNumberish) => {
  const numberDays = BigNumber.from(days).toNumber();

  if (numberDays < 30) return numberDays > 1 ? `${numberDays} days` : `${numberDays} day`;
  if (numberDays < 365) return `${numberDays / 30} mnth`;

  const numberYears = numberDays / 365;
  return numberYears > 1 ? `${numberYears} years` : `${numberYears} year`;
};

export const getLocalDateTimeString = (timestamp: BigNumberish) => {
  const t = BigNumber.from(timestamp).toNumber() * 1000;
  const date = new Date(t);

  return date.toLocaleString();
};

export const getLocalDateString = (timestamp: BigNumberish) => {
  const t = BigNumber.from(timestamp).toNumber() * 1000;
  const date = new Date(t);

  return date.toLocaleDateString();
};
