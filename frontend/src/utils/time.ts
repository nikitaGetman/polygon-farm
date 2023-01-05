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
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const secs = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}, ${hours}:${minutes}:${secs}`;
};

export const getLocalDateString = (timestamp: BigNumberish) => {
  const t = BigNumber.from(timestamp).toNumber() * 1000;
  const date = new Date(t);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const getStampsFromDuration = (duration: number) => {
  const elapsedSeconds = Math.floor((duration || 0) / 1000);
  const secInMin = 60;
  const secInHour = 60 * secInMin;
  const secInDay = 24 * secInHour;

  const days = Math.floor(elapsedSeconds / secInDay);
  const hours = Math.floor((elapsedSeconds % secInDay) / secInHour);
  const minutes = Math.floor(((elapsedSeconds % secInDay) % secInHour) / secInMin);
  const seconds = elapsedSeconds % secInMin;

  return { days, hours, minutes, seconds };
};
