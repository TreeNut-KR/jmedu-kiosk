import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/components/ThemeProvider";
import App from "@/App.tsx";
import "@stackflow/plugin-basic-ui/index.css";
import "@/styles/index.css";

const rootEl = document.getElementById("root")!;

if (window.APP_CONFIG.IS_SCREEN_ROTATE) {
  rootEl.classList.add("rotated");
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
