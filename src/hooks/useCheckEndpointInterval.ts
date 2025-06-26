import { useEffect, useRef, useState } from "react";

export default function useCheckEndpointInterval(
  intervalMs: number = 15000,
  timeoutMs: number = 3000,
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
        await fetch(`${window.APP_CONFIG.HOST}:${window.APP_CONFIG.PORT}`, {
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
