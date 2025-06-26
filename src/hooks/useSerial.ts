import { usePortStore } from "@/store";

export default function useSerial() {
  const { setPort } = usePortStore((state) => state);

  const connect = async () => {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    setPort(port);
  };

  return { connect };
}
