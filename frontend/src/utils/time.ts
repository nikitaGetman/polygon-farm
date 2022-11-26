import { BigNumber, BigNumberish } from 'ethers';

export const getReadableDuration = (days: BigNumberish) => {
  const numberDays = BigNumber.from(days).toNumber();

  if (numberDays % 365 === 0) {
    const numberYears = numberDays / 365;
    return numberYears > 1 ? `${numberYears} Years` : `${numberYears} Year`;
  }

  return numberDays > 1 ? `${numberDays} days` : `${numberDays} day`;
};

export const getLocalDateTimeString = (timestamp: BigNumberish) => {
  const t = BigNumber.from(timestamp).toNumber() * 1000;
  const date = new Date(t);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const secs = date.getSeconds();

  return `${year}-${month + 1}-${day}, ${hours}:${minutes}:${secs}`;
};

export const getLocalDateString = (timestamp: BigNumberish) => {
  const t = BigNumber.from(timestamp).toNumber() * 1000;
  const date = new Date(t);

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${year}-${month + 1}-${day}`;
};
