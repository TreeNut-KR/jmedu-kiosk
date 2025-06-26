import { useState, useEffect, useRef, useCallback } from "react";

export default function useCountdown(
  maxCount?: number,
  onComplete?: () => void,
) {
  const [count, setCount] = useState(maxCount);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clear();
    if (typeof maxCount === "number") {
      setCount(maxCount);
      intervalRef.current = setInterval(() => {
        setCount((prev) => (prev !== undefined ? Math.max(prev - 1, 0) : prev));
      }, 1000);
    }
    return () => clear();
  }, [maxCount, clear]);

  useEffect(() => {
    if (count === 0 && onComplete) {
      onComplete();
      clear();
    }
  }, [count, onComplete, clear]);

  return count;
}
