import type { ReactNode } from "react";
import { create } from "zustand";

interface ViewState {
  view: ReactNode | ReactNode[] | undefined;
  setView: (view: ReactNode | ReactNode[] | undefined) => void;
}

export const useViewStore = create<ViewState>()((set) => ({
  view: undefined,
  setView(view: ReactNode | ReactNode[] | undefined) {
    set({ view });
  },
}));

interface PortState {
  port: SerialPort | undefined;
  setPort: (port: SerialPort) => void;
}

export const usePortStore = create<PortState>()((set) => ({
  port: undefined,
  setPort(port: SerialPort) {
    set({ port });
  },
}));
