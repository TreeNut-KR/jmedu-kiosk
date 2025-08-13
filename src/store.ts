import { create } from "zustand";

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
