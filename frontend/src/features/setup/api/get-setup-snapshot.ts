import { backendJson } from "@/lib/backend";

import type { BackendStatus, ClientsSnapshot, SetupSnapshot } from "../types";

export async function getSetupSnapshot(): Promise<SetupSnapshot> {
  const [status, clientsSnapshot] = await Promise.all([
    backendJson<BackendStatus>("status"),
    backendJson<ClientsSnapshot>("clients"),
  ]);

  return {
    status,
    clients: clientsSnapshot.clients,
    benchmarks: clientsSnapshot.benchmarks,
  };
}