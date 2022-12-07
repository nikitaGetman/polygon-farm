import { useEffect, useMemo, useRef, useState } from 'react';

export const useCountdown = (timestamp: number, onExpire?: () => void) => {
  const [elapsedTime, setElapsedTime] = useState<number>();
  const interval = useRef<any>();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const calculateElapsedTime = () => {
      const time = timestamp - Date.now();
      setElapsedTime(Math.max(0, time));
      if (time > 0) {
        setIsActive(true);
      }
    };

    interval.current = setInterval(calculateElapsedTime, 1000);
    calculateElapsedTime();

    return () => clearInterval(interval.current);
  }, [timestamp, setElapsedTime]);

  useEffect(() => {
    if (elapsedTime === 0 && isActive) {
      clearInterval(interval.current);
      onExpire?.();
    }
  }, [elapsedTime, onExpire, isActive]);

  const stamps = useMemo(() => {
    const elapsedSeconds = Math.floor((elapsedTime || 0) / 1000);
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
