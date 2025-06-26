export {};

declare global {
  interface Window {
    APP_CONFIG: {
      HOST: string;
      PORT: number;
      WIDTH: number;
      HEIGHT: number;
      IS_SCREEN_ROTATE: boolean;
      THEME: "light" | "dark";
    };
  }
}
