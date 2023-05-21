import { useEffect, useReducer, useState } from "react";

export const useFlashTime = (
  timeout: number = 300,
  delayedStartUp: boolean = false
) => {
  const [isFlashTime, setIsFlashTime] = useState(true);
  const [flashStartCounter, startFlashTime] = useReducer((v) => v + 1, 0);

  useEffect(() => {
    if (!timeout || (delayedStartUp && flashStartCounter === 0)) return;

    setIsFlashTime(true);
    const timeoutId = setTimeout(() => {
      setIsFlashTime(false);
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [delayedStartUp, flashStartCounter, timeout]);

  return [isFlashTime, startFlashTime] as const;
};
