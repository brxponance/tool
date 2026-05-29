export type AllManagerIndexRow = {
  name: string;
  tab: string;
  r2_full: number | null;
  vg_full: number;
  ns_z: number | null;
};

export type AllManagersResponse = {
  managers: AllManagerIndexRow[];
};

export type PeerGroupManager = {
  name: string;
  r2_full: number | null;
  vg_full: number;
  pct_small: number;
  pct_em: number;
  ns_z: number | null;
  ns_n_obs?: number | null;
  ns_n_peers?: number | null;
  ns_adj_method?: string | null;
  t1_skill: number | null;
  t3_skill: number | null;
  t5_skill: number | null;
  si_skill: number | null;
  style_buckets: Record<string, number>;
};

export type PeerGroupsResponse = {
  tab: string;
  managers: PeerGroupManager[];
};

export type PeerStyle = "Growth" | "Core" | "Value";

export const STYLE_BUCKET_KEYS = [
  "Core",
  "Value",
  "Growth",
  "Yield",
  "Quality",
  "Dynamic",
  "Defensive",
  "Low Vol",
] as const;

export type StyleBucketKey = (typeof STYLE_BUCKET_KEYS)[number];