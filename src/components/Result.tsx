import { useStack, type ActivityComponentType } from "@stackflow/react";
import { AppScreen } from "@stackflow/plugin-basic-ui";
import { useFlow } from "@/stackflow";
import { Button } from "@/components/ui/button";
import useCountdown from "@/hooks/useCountdown";
import { cn } from "@/utils/shadcn";

type ResultParams = {
  type: "success" | "error";
  title: string;
  description?: string;
};

const Result: ActivityComponentType<ResultParams> = ({
  params,
}: {
  params: ResultParams;
}) => {
  const { pop } = useFlow();
  const stack = useStack();

  const count = useCountdown(window.APP_CONFIG.RESULT_COUNTDOWN_SECONDS, () =>
    pop(),
  );

  return (
    <AppScreen backgroundColor="var(--adaptiveBackground)">
      <section className="flex h-full w-full flex-col justify-between p-9">
        <header className=""></header>
        <div className="flex flex-col items-center gap-10">
          <img
            className={cn([
              "w-45",
              params.type === "success" ? "animate-pop" : "animate-shake",
              stack.transitionDuration && `delay-${stack.transitionDuration}`,
            ])}
            alt={`${params.type} icon`}
            src={`/img/${params.type}.svg`}
          />
          <div className="space-y-4 text-center font-semibold break-keep">
            <p className="text-4xl">{params.title}</p>
            {params.description && (
              <p className="text-adaptiveGray-400 text-3xl">
                {params.description}
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
          <Button size="xxxl" onClick={() => pop()}>
            처음으로
          </Button>
        </footer>
      </section>
    </AppScreen>
  );
};

export default Result;
