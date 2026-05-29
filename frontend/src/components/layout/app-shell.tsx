"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { backendJson } from "@/lib/backend";
import type { BackendStatus } from "@/features/setup/types";
import { APP_NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { RunProgressOverlay } from "./run-progress-overlay";

type ProgressSnapshot = {
  running: boolean;
};

type ShellStatusTone = "idle" | "ready" | "running" | "error";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [shellStatus, setShellStatus] = useState<{
    tone: ShellStatusTone;
    text: string;
  }>({ tone: "idle", text: "Checking..." });

  useEffect(() => {
    let cancelled = false;

    async function loadShellStatus() {
      try {
        const [status, progress] = await Promise.all([
          backendJson<BackendStatus>("status"),
          backendJson<ProgressSnapshot>("progress"),
        ]);

        if (cancelled) {
          return;
        }

        if (progress.running) {
          setShellStatus({ tone: "running", text: "Computing clones..." });
          return;
        }

        if (status.has_results) {
          setShellStatus({
            tone: "ready",
            text: status.clone_stale
              ? "Results loaded — rerun recommended"
              : "Results loaded from cache",
          });
          return;
        }

        setShellStatus({ tone: "idle", text: "No data loaded" });
      } catch {
        if (!cancelled) {
          setShellStatus({ tone: "error", text: "Backend offline" });
        }
      }
    }

    void loadShellStatus();
    const intervalId = window.setInterval(() => {
      void loadShellStatus();
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <nav className="nav">
        <div className="nav-brand">Aapryl // Clone Tool</div>
        {APP_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("nav-tab", isActive && "active")}
            >
              {item.label}
            </Link>
          );
        })}
        <div className="nav-spacer" />
        <div className={cn("status-dot", shellStatus.tone !== "idle" && shellStatus.tone)} />
        <span id="status-text">{shellStatus.text}</span>
      </nav>
      <main className="main">{children}</main>
      <RunProgressOverlay />
    </div>
  );
}