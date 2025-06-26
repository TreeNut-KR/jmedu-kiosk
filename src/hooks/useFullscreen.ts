import { useCallback } from "react";

export default function useFullscreen() {
  const toggleFullscreen = useCallback(() => {
    const el = document.documentElement;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen();
    }
  }, []);

  return { toggleFullscreen };
}
