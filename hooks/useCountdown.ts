
import { useState, useEffect } from 'react';

export const useCountdown = (targetTimestamp: number | null, onEnd: () => void) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  useEffect(() => {
    if (targetTimestamp === null) {
      setRemainingTime(null);
      return;
    }

    const calculateRemainingTime = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;
      return Math.max(0, Math.floor(difference / 1000));
    };

    setRemainingTime(calculateRemainingTime());

    const intervalId = setInterval(() => {
      const newRemainingTime = calculateRemainingTime();
      setRemainingTime(newRemainingTime);
      if (newRemainingTime <= 0) {
        clearInterval(intervalId);
        onEnd();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTimestamp]);

  return remainingTime;
};
