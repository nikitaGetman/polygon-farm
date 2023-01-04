import { useEffect, useMemo, useRef, useState } from 'react';

import { getStampsFromDuration } from '@/utils/time';

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
    if (elapsedTime === 0 && isActive && timestamp) {
      clearInterval(interval.current);
      setIsActive(false);
      onExpire?.();
    }
  }, [elapsedTime, onExpire, isActive, timestamp]);

  const stamps = useMemo(() => getStampsFromDuration(elapsedTime || 0), [elapsedTime]);

  const stampStrings = useMemo(() => {
    const daysString = stamps.days.toString().padStart(2, '0');
    const hoursString = stamps.hours.toString().padStart(2, '0');
    const minsString = stamps.minutes.toString().padStart(2, '0');
    const secString = stamps.seconds.toString().padStart(2, '0');

    return { daysString, hoursString, minsString, secString };
  }, [stamps]);

  return { elapsedTime, stamps, stampStrings };
};
