import QRScan from "@/components/QRScan";
import { Button } from "@/components/ui/button";
import useCountdown from "@/hooks/useCountdown";
import { useViewStore } from "@/store";
import { cn } from "@/utils/shadcn";

interface ResultProps {
  type: "success" | "error";
  title: string;
  description?: string;
}

export default function Result(props: ResultProps) {
  const { setView } = useViewStore();

  const count = useCountdown(window.APP_CONFIG.RESULT_COUNTDOWN_SECONDS, () =>
    setView(<QRScan />),
  );

  return (
    <section className="animate-fadein bg-adaptiveBackground flex h-full w-full flex-col justify-between p-9">
      <header className=""></header>
      <div className="flex flex-col items-center gap-10">
        <img
          className={cn([
            props.type === "success" ? "animate-pop" : "animate-shake",
            "w-45",
          ])}
          alt={`${props.type} icon`}
          src={`/img/${props.type}.svg`}
        />
        <div className="space-y-4 text-center font-semibold break-keep">
          <p className="text-4xl">{props.title}</p>
          {props.description && (
            <p className="text-adaptiveGray-400 text-3xl">
              {props.description}
            </p>
          )}
        </div>
      </div>
      <footer className="flex flex-col">
        <p
          className="text-adaptiveGray-500 mb-8 text-center text-2xl font-medium"
          hidden={!count}
        >
          {count}초 뒤에 닫혀요
        </p>
        <Button size="xxxl" onClick={() => setView(<QRScan />)}>
          처음으로
        </Button>
      </footer>
    </section>
  );
}
