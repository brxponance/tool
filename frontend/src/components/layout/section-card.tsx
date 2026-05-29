import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionCardProps = {
  title: string;
  kicker?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  kicker,
  description,
  actions,
  children,
  className,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "rounded-[24px] border border-line bg-white/72 p-5 backdrop-blur-sm md:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4 border-b border-line pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          {kicker ? (
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              {kicker}
            </p>
          ) : null}
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-panel-strong">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}