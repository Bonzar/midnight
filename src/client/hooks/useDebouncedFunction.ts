import { useEffect, useRef } from "react";

export const useDebouncedFunction = <Fn extends (...args: any) => unknown>(
  func: Fn,
  delay: number
): Fn => {
  const timeoutRef = useRef<number | null>(null);

  // Очистка таймера
  function clearTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  // Очищаем таймер при размонтировании
  useEffect(() => clearTimer, []);

  return ((...args: any) => {
    clearTimer();
    timeoutRef.current = setTimeout(
      () => func(...args),
      delay
    ) as unknown as number;
  }) as Fn;
};
