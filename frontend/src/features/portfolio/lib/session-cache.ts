// Session-only memory for the Portfolio tab, so switching to another tab and
// back keeps the last viewed client and any in-progress edits (proposed
// weights, added/removed managers) instead of resetting to the first client.
//
// Module-level like lib/state/bucket-overrides: route components unmount on
// navigation, but the module survives until a full page reload. Nothing here
// is persisted — Save still goes through the explicit Save button, and
// Discard drops the cached working copy for that client (user request
// 2026-09-04: "keep it in the cache until the end of my session").

import type { PortfolioManager } from "../types";

let lastClient: string | null = null;
const managersByClient = new Map<string, PortfolioManager[]>();

export function rememberPortfolioClient(client: string) {
  lastClient = client;
}

export function getLastPortfolioClient(): string | null {
  return lastClient;
}

// Callers pass an already-cloned array (clonePortfolioManagers) so cached
// state can't be mutated behind the screen's back.
export function cachePortfolioManagers(client: string, managers: PortfolioManager[]) {
  managersByClient.set(client, managers);
}

export function getCachedPortfolioManagers(client: string): PortfolioManager[] | null {
  return managersByClient.get(client) ?? null;
}

// Discard = forget the working copy so the next load is the server truth.
export function dropCachedPortfolioManagers(client: string) {
  managersByClient.delete(client);
}
