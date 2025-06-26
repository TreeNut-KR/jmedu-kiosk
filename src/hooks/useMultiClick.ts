import { useRef } from "react";

export default function useMultiClick(
  callback: () => void,
  count: number = 3,
  timeoutMs: number = 500,
): () => void {
  const countRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    countRef.current += 1;

    if (countRef.current >= count) {
      callback();
      countRef.current = 0;
      timerRef.current = null;
      return;
    }

    timerRef.current = setTimeout(() => {
      countRef.current = 0;
      timerRef.current = null;
    }, timeoutMs);
  };
}
