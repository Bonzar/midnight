import { useEffect, useState } from "react";

export const useFlashTime = (timeout: number = 300) => {
  const [isFlashTime, setIsFlashTime] = useState(true);

  useEffect(() => {
    if (!timeout) return;

    const timeoutId = setTimeout(() => {
      setIsFlashTime(false);
    }, timeout);

    return () => clearTimeout(timeoutId);
  }, [timeout]);

  return isFlashTime;
};
