import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import {
  IconCloud,
  IconCloudOff,
  IconLoader2,
  IconQrcode,
  IconQrcodeOff,
} from "@tabler/icons-react";
import useSerial from "@/hooks/useSerial";
import useMultiClick from "@/hooks/useMultiClick";
import useSerialReader from "@/hooks/useSerialReader";
import useCheckAPIInterval from "@/hooks/useCheckAPIInterval";
import { usePortStore } from "@/store";
import { cn } from "@/utils/shadcn";
import z from "zod/v4";
import useFullscreen from "@/hooks/useFullscreen";

import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow } from "@/stackflow";
import { type ActivityComponentType, useStack } from "@stackflow/react";

const QRScan: ActivityComponentType = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const stack = useStack();
  const { push } = useFlow();
  const { port } = usePortStore();
  const { connect } = useSerial();
  const { theme, toggleTheme } = useTheme();
  const { toggleFullscreen } = useFullscreen();
  const { isLoading, isOnline } = useCheckAPIInterval(
    window.APP_CONFIG.API_CHECK_INTERVAL_MILLISECONDS,
    window.APP_CONFIG.API_TIMEOUT_MILLISECONDS,
  );

  const handleSettingBtn = useMultiClick(() => connect());
  const handleFullscreenBtn = useMultiClick(() => toggleFullscreen());
  const handleThemeBtn = useMultiClick(() => toggleTheme());

  const scanImagePath = useMemo(() => {
    if (theme === "light") return "/img/qr_scan_guide_light.gif";
    else if (theme === "dark") return "/img/qr_scan_guide_dark.gif";
    else return "/img/qr_scan_guide.gif";
  }, [theme]);

  useSerialReader(port);

  useEffect(() => {
    const handler = async (event: Event) => {
      if (!stack.activities[0].isActive) return;
      if (isProcessing) return;
      setIsProcessing(true);

      const customEvent = event as CustomEvent<{ qr_data: string }>;
      const qr_data = customEvent.detail?.qr_data;
      if (!qr_data) {
        setIsProcessing(false);
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        window.APP_CONFIG.API_TIMEOUT_MILLISECONDS,
      );

      try {
        const res = await fetch(`${window.APP_CONFIG.API_URL}/qr`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qr_data }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const json = await res.json();

        const responseSchema = z.object({
          success: z.boolean(),
          message: z.string(),
          description: z.string().optional(),
          error_context: z.any().optional(),
        });

        const parse = responseSchema.safeParse(json);

        if (!parse.success) {
          push("Result", {
            type: "error",
            title: "API 응답 형식이 올바르지 않습니다",
            description: "관리자에게 문의해주세요",
          });
        } else {
          push("Result", {
            type: parse.data.success ? "success" : "error",
            title: parse.data.message,
            description: parse.data.description,
          });
        }
      } catch (err: unknown) {
        clearTimeout(timeoutId);
        console.error("등하원 처리 실패:", err);

        push("Result", {
          type: "error",
          title: "등원 처리 실패",
          description: "관리자에게 문의해주세요",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    window.addEventListener("qrscan", handler as EventListener);

    return () => {
      window.removeEventListener("qrscan", handler as EventListener);
    };
  }, [isProcessing, push, stack]);

  return (
    <AppScreen backgroundColor="var(--adaptiveGray50)">
      <section className="relative flex h-full w-full flex-col justify-between p-9">
        <div
          className={cn([
            "absolute top-0 left-0 flex h-full w-full items-center justify-center",
            !isProcessing && "hidden",
          ])}
        >
          <div className="bg-adaptiveGray-100 absolute h-full w-full opacity-50"></div>
          <IconLoader2
            className="text-adaptiveBlue-500 size-18 animate-spin"
            stroke={3}
          />
        </div>
        <header className="flex flex-row items-center justify-between">
          <Button
            variant="ghost"
            className="size-14"
            onClick={handleThemeBtn}
          ></Button>
          <Button
            variant="ghost"
            className="size-14"
            onClick={handleFullscreenBtn}
          ></Button>
        </header>
        <div className="flex flex-col items-center">
          <p className="text-center text-4xl font-semibold break-keep">
            QR을 <span className="text-adaptiveRed-500">아래</span>에
            스캔해주세요
          </p>
          <img
            className="w-full"
            alt="qr scan guide image"
            src={scanImagePath}
          />
        </div>
        <footer className="flex flex-row items-center justify-between">
          <Button variant="ghost" className="size-14">
            {isLoading ? (
              <IconLoader2 className="text-adaptiveGray-400 size-8 animate-spin ease-in-out" />
            ) : isOnline ? (
              <IconCloud className="text-adaptiveGray-400 size-8" />
            ) : (
              <IconCloudOff className="text-adaptiveGray-400 size-8" />
            )}
          </Button>
          <Button
            variant="ghost"
            className="size-14"
            onClick={handleSettingBtn}
          >
            {port?.readable ? (
              <IconQrcode className="text-adaptiveGray-400 size-8" />
            ) : (
              <IconQrcodeOff className="text-adaptiveGray-400 size-8" />
            )}
          </Button>
        </footer>
      </section>
    </AppScreen>
  );
};

export default QRScan;
