import { useEffect, useRef, useState } from "react";

export default function useCheckAPIInterval(
  intervalMs: number,
  timeoutMs: number,
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let stopped = false;

    async function checkEndpoint() {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        setIsLoading(true);
        await fetch(`${window.APP_CONFIG.API_URL}`, {
          method: "GET",
          signal: controller.signal,
        });
        if (!stopped) {
          setIsLoading(false);
          setIsOnline(true);
        }
      } catch (err) {
        console.error(err);

        if (!stopped) {
          setIsLoading(false);
          setIsOnline(false);
        }
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    }

    checkEndpoint();

    intervalRef.current = setInterval(checkEndpoint, intervalMs);

    return () => {
      stopped = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs, timeoutMs]);

  return { isLoading, isOnline };
}
