export {};

declare global {
  interface Window {
    APP_CONFIG: {
      API_URL: string;
      API_TIMEOUT_MILLISECONDS: number;
      API_CHECK_INTERVAL_MILLISECONDS: number;
      WIDTH: number;
      HEIGHT: number;
      IS_SCREEN_ROTATE: boolean;
      THEME: "light" | "dark";
      RESULT_COUNTDOWN_SECONDS: number;
    };
  }
}
