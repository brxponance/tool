import { cn } from "@/lib/utils";

import type { SetupSnapshot } from "../types";

type ReadinessGridProps = {
  snapshot: SetupSnapshot | null;
  loading: boolean;
};

function readinessTone(isReady: boolean) {
  return isReady
    ? "border-success/25 bg-success/8 text-success"
    : "border-warning/25 bg-white text-panel-strong";
}

export function ReadinessGrid({ snapshot, loading }: ReadinessGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={`loading-${index}`}
            className="h-32 rounded-[22px] border border-line bg-white/55 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const cards = snapshot
    ? [
        {
          title: "Buy list engine",
          ready: snapshot.status.has_results,
          detail: snapshot.status.has_results
            ? "Cached clone results are available for the portfolio workflows."
            : "No clone results loaded yet.",
        },
        {
          title: "Weights and clients",
          ready: snapshot.status.has_weights,
          detail: snapshot.clients.length
            ? `${snapshot.clients.length} client portfolios are available.`
            : "No client weight file is loaded yet.",
        },
        {
          title: "Peer universe",
          ready: snapshot.status.has_universe,
          detail: snapshot.status.universe_tabs.length
            ? `Universe tabs cached: ${snapshot.status.universe_tabs.join(", ")}.`
            : "Universe clones have not been staged yet.",
        },
        {
          title: "Risk and exposures",
          ready:
            snapshot.status.has_risk ||
            snapshot.status.has_security_risk ||
            snapshot.status.has_exposures,
          detail:
            snapshot.status.has_security_risk || snapshot.status.has_exposures
              ? "FactSet risk or exposure inputs are available for richer analytics."
              : "Optional FactSet files are still offline.",
        },
      ]
    : [];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card) => {
        return (
          <article
            key={card.title}
            className={cn(
              "rounded-[22px] border px-5 py-5 transition",
              readinessTone(card.ready),
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                  {card.ready ? "Ready" : "Waiting"}
                </p>
                <h4 className="mt-3 text-lg font-medium tracking-[-0.03em]">
                  {card.title}
                </h4>
              </div>
              <div
                className={cn(
                  "mt-1 h-3 w-3 rounded-full border",
                  card.ready ? "border-success bg-success" : "border-warning bg-warning/60",
                )}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{card.detail}</p>
          </article>
        );
      })}
    </div>
  );
}