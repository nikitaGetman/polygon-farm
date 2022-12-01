import { useEffect, useMemo, useState } from 'react';

export const useCountdown = (timestamp: number) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const calculateElapsedTime = () => setElapsedTime(Math.max(0, timestamp - Date.now()));

    const interval = setInterval(calculateElapsedTime, 1000);
    calculateElapsedTime();

    return () => clearInterval(interval);
  }, [timestamp, setElapsedTime]);

  const stamps = useMemo(() => {
    const elapsedSeconds = Math.floor(elapsedTime / 1000);
    const secInMin = 60;
    const secInHour = 60 * secInMin;
    const secInDay = 24 * secInHour;

    const days = Math.floor(elapsedSeconds / secInDay);
    const hours = Math.floor((elapsedSeconds % secInDay) / secInHour);
    const minutes = Math.floor(((elapsedSeconds % secInDay) % secInHour) / secInMin);
    const seconds = elapsedSeconds % secInMin;

    return { days, hours, minutes, seconds };
  }, [elapsedTime]);

  const stampStrings = useMemo(() => {
    const daysString = stamps.days.toString().padStart(2, '0');
    const hoursString = stamps.hours.toString().padStart(2, '0');
    const minsString = stamps.minutes.toString().padStart(2, '0');
    const secString = stamps.seconds.toString().padStart(2, '0');

    return { daysString, hoursString, minsString, secString };
  }, [stamps]);

  return { elapsedTime, stamps, stampStrings };
};
