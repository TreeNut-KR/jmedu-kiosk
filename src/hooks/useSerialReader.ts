import { useEffect, useRef } from "react";

export default function useSerialReader(port: SerialPort | undefined) {
  const readerRef = useRef<ReadableStreamDefaultReader<string> | null>(null);

  useEffect(() => {
    if (!port) return;

    let cancelled = false;
    let buffer: (string | undefined)[] = [];
    const textDecoder = new TextDecoderStream();
    port.readable?.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    readerRef.current = reader;

    async function readLoop() {
      try {
        while (!cancelled) {
          const { value } = await reader.read();

          buffer.push(value?.toString());

          if (buffer[buffer.length - 1] === "\r") {
            const data = buffer.join("").replace(/\r$/, "");

            if (data.length === 36) {
              const qrscanEvent = new CustomEvent("qrscan", {
                detail: {
                  qr_data: data,
                },
              });

              window.dispatchEvent(qrscanEvent);
            } else {
              console.error(`QR은 36자리이어야 합니다, ${data}`);
            }

            buffer = [];
          }
        }
      } catch (e) {
        if (!cancelled) console.error(e);
      }
    }

    readLoop();

    return () => {
      cancelled = true;
      if (readerRef.current) {
        readerRef.current.cancel().catch(() => {});
        readerRef.current.releaseLock();
      }
    };
  }, [port]);

  return;
}
