// Performance Attribution feature types. The contribution shapes mirror the
// backend /portfolio_contribution/<client> response
// (app.py _build_portfolio_contribution_rows).

export type ContributionManager = {
  name: string;
  weight: number;
  vg_full: number | null;
  qtd_mgr: number | null;
  qtd_bench: number | null;
  qtd_style: number | null;
  qtd_skill: number | null;
  t1_style: number | null;
  t1_skill: number | null;
  t3_style: number | null;
  t3_skill: number | null;
};

export type ContributionResponse = {
  managers: ContributionManager[];
  unmatched: string[];
  error?: string;
};

export type ClientsResponse = {
  clients: string[];
  benchmarks: Record<string, string>;
  editable: boolean;
};
