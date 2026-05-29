"use client";

import { cn } from "@/lib/utils";

type ClientSwitcherProps = {
  clients: string[];
  selectedClient: string | null;
  pending: boolean;
  benchmarks: Record<string, string>;
  onSelect(client: string): void;
};

export function ClientSwitcher({
  clients,
  selectedClient,
  pending,
  benchmarks,
  onSelect,
}: ClientSwitcherProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {clients.map((client) => {
        const isActive = client === selectedClient;
        return (
          <button
            key={client}
            type="button"
            onClick={() => onSelect(client)}
            className={cn(
              "rounded-full border px-4 py-3 text-left transition",
              isActive
                ? "border-accent bg-accent text-white"
                : "border-line bg-white/70 text-panel-strong hover:border-accent/25 hover:bg-white",
            )}
          >
            <span className="block text-sm font-medium tracking-[-0.02em]">{client}</span>
            <span className={cn("mt-1 block font-mono text-[11px] uppercase tracking-[0.2em]", isActive ? "text-white/70" : "text-muted-foreground")}>
              {benchmarks[client] ?? "Benchmark pending"}
            </span>
          </button>
        );
      })}
      {pending ? (
        <span className="self-center pl-2 font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
          Refreshing
        </span>
      ) : null}
    </div>
  );
}