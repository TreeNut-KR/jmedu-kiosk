import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ThemeProvider";
import App from "@/App.tsx";
import "@/styles/index.css";

const rootEl = document.getElementById("root")!;
rootEl.style.width = window.APP_CONFIG.WIDTH + "px";
rootEl.style.height = window.APP_CONFIG.HEIGHT + "px";

if (window.APP_CONFIG.IS_SCREEN_ROTATE) {
  rootEl.style.transform = `rotate(-90deg) translate(-${window.APP_CONFIG.WIDTH}px)`;
  rootEl.style.transformOrigin = "top left";
}

createRoot(rootEl).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme={window.APP_CONFIG.THEME}
      storageKey="jmedu-kiosk-theme"
    >
      <App />
    </ThemeProvider>
  </StrictMode>,
);
