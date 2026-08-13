import { formatPercent } from "@/lib/utils";

import type { ContributionManager, ContributionResponse } from "../types";

// Moved from the Portfolio tab (portfolio-analytics-sections.tsx) when the
// Performance Attribution tab was created — same tables, same math.

function contributionCellClass(value: number | null | undefined) {
  if (value == null) {
    return "";
  }
  return value >= 0 ? "skill-pos" : "skill-neg";
}

function buildContributionGroups(managers: ContributionManager[]) {
  const groups: Record<string, ContributionManager[]> = {
    "Value (V-G > 25%)": [],
    Core: [],
    "Growth (V-G < -25%)": [],
  };

  managers.forEach((manager) => {
    if ((manager.vg_full ?? 0) > 0.25) {
      groups["Value (V-G > 25%)"].push(manager);
      return;
    }
    if ((manager.vg_full ?? 0) < -0.25) {
      groups["Growth (V-G < -25%)"].push(manager);
      return;
    }
    groups.Core.push(manager);
  });

  return Object.entries(groups)
    .map(([label, rows]) => {
      const totalWeight = rows.reduce((sum, row) => sum + (row.weight || 0), 0);
      const sumStat = (key: keyof ContributionManager) => {
        const available = rows.filter((row) => row[key] != null);
        if (!available.length) {
          return null;
        }
        return available.reduce(
          (sum, row) => sum + (row.weight || 0) * Number(row[key] || 0),
          0,
        );
      };

      return {
        label,
        totalWeight,
        qtd_style: sumStat("qtd_style"),
        qtd_skill: sumStat("qtd_skill"),
        t1_style: sumStat("t1_style"),
        t1_skill: sumStat("t1_skill"),
        t3_style: sumStat("t3_style"),
        t3_skill: sumStat("t3_skill"),
      };
    })
    .filter((group) => group.totalWeight > 0);
}

function totalContribution(groups: ReturnType<typeof buildContributionGroups>) {
  return groups.reduce(
    (total, group) => ({
      totalWeight: total.totalWeight + group.totalWeight,
      qtd_style: (total.qtd_style ?? 0) + (group.qtd_style ?? 0),
      qtd_skill: (total.qtd_skill ?? 0) + (group.qtd_skill ?? 0),
      t1_style: (total.t1_style ?? 0) + (group.t1_style ?? 0),
      t1_skill: (total.t1_skill ?? 0) + (group.t1_skill ?? 0),
      t3_style: (total.t3_style ?? 0) + (group.t3_style ?? 0),
      t3_skill: (total.t3_skill ?? 0) + (group.t3_skill ?? 0),
    }),
    {
      totalWeight: 0,
      qtd_style: 0,
      qtd_skill: 0,
      t1_style: 0,
      t1_skill: 0,
      t3_style: 0,
      t3_skill: 0,
    },
  );
}

type Props = {
  contribution: ContributionResponse | null;
  emptyHint?: string;
};

export function ContributionSections({ contribution, emptyHint }: Props) {
  const hint = emptyHint ?? "Select a client account to load data.";
  const contributionGroups = buildContributionGroups(contribution?.managers ?? []);
  const contributionTotals = totalContribution(contributionGroups);

  return (
    <div className="contrib-section">
      <div className="panel mb-16">
        <div className="panel-header">
          <span className="panel-title">Current Portfolio Contribution</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th rowSpan={2}>Manager</th>
                <th rowSpan={2}>Weight</th>
                <th colSpan={4} className="period-group sep-col">Past Quarter</th>
                <th colSpan={2} className="period-group sep-col">Trailing 1 Year</th>
                <th colSpan={2} className="period-group sep-col">Trailing 3 Year</th>
              </tr>
              <tr>
                <th className="sub sep-col">Mgr Return</th>
                <th className="sub">Bench Excess</th>
                <th className="sub">Passive Style</th>
                <th className="sub">Mgr Skill</th>
                <th className="sub sep-col">Passive Style</th>
                <th className="sub">Mgr Skill</th>
                <th className="sub sep-col">Passive Style</th>
                <th className="sub">Mgr Skill</th>
              </tr>
            </thead>
            <tbody>
              {contribution?.error ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", color: "var(--amber)", padding: 20 }}>
                    {contribution.error}
                  </td>
                </tr>
              ) : contribution?.managers.length ? (
                contribution.managers.map((manager) => (
                  <tr key={manager.name}>
                    <td>{manager.name}</td>
                    <td className="mono">{formatPercent(manager.weight)}</td>
                    <td className="mono sep-col">{manager.qtd_mgr == null ? "--" : `${manager.qtd_mgr.toFixed(1)}%`}</td>
                    <td className="mono">{manager.qtd_bench == null ? "--" : `${manager.qtd_bench.toFixed(1)}%`}</td>
                    <td className={`mono ${contributionCellClass(manager.qtd_style)}`}>{manager.qtd_style == null ? "--" : `${manager.qtd_style.toFixed(1)}%`}</td>
                    <td className={`mono ${contributionCellClass(manager.qtd_skill)}`}>{manager.qtd_skill == null ? "--" : `${manager.qtd_skill.toFixed(1)}%`}</td>
                    <td className={`mono sep-col ${contributionCellClass(manager.t1_style)}`}>{manager.t1_style == null ? "--" : `${manager.t1_style.toFixed(1)}%`}</td>
                    <td className={`mono ${contributionCellClass(manager.t1_skill)}`}>{manager.t1_skill == null ? "--" : `${manager.t1_skill.toFixed(1)}%`}</td>
                    <td className={`mono sep-col ${contributionCellClass(manager.t3_style)}`}>{manager.t3_style == null ? "--" : `${manager.t3_style.toFixed(1)}%`}</td>
                    <td className={`mono ${contributionCellClass(manager.t3_skill)}`}>{manager.t3_skill == null ? "--" : `${manager.t3_skill.toFixed(1)}%`}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                    {hint}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel mb-16">
        <div className="panel-header"><span className="panel-title">Contribution by Style Group</span></div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table w-full">
            <thead>
              <tr>
                <th rowSpan={2}>Group</th>
                <th rowSpan={2}>Weight</th>
                <th colSpan={2} className="period-group sep-col">Past Quarter Contribution</th>
                <th colSpan={2} className="period-group sep-col">Trailing 1yr Contribution</th>
                <th colSpan={2} className="period-group sep-col">Trailing 3yr Contribution</th>
              </tr>
              <tr>
                <th className="sub sep-col">Style</th><th className="sub">Skill</th>
                <th className="sub sep-col">Style</th><th className="sub">Skill</th>
                <th className="sub sep-col">Style</th><th className="sub">Skill</th>
              </tr>
            </thead>
            <tbody>
              {contributionGroups.length ? (
                <>
                  {contributionGroups.map((group) => (
                    <tr key={group.label}>
                      <td>{group.label}</td>
                      <td className="mono">{formatPercent(group.totalWeight)}</td>
                      <td className={`mono sep-col ${contributionCellClass(group.qtd_style)}`}>{group.qtd_style == null ? "--" : `${group.qtd_style.toFixed(2)}%`}</td>
                      <td className={`mono ${contributionCellClass(group.qtd_skill)}`}>{group.qtd_skill == null ? "--" : `${group.qtd_skill.toFixed(2)}%`}</td>
                      <td className={`mono sep-col ${contributionCellClass(group.t1_style)}`}>{group.t1_style == null ? "--" : `${group.t1_style.toFixed(2)}%`}</td>
                      <td className={`mono ${contributionCellClass(group.t1_skill)}`}>{group.t1_skill == null ? "--" : `${group.t1_skill.toFixed(2)}%`}</td>
                      <td className={`mono sep-col ${contributionCellClass(group.t3_style)}`}>{group.t3_style == null ? "--" : `${group.t3_style.toFixed(2)}%`}</td>
                      <td className={`mono ${contributionCellClass(group.t3_skill)}`}>{group.t3_skill == null ? "--" : `${group.t3_skill.toFixed(2)}%`}</td>
                    </tr>
                  ))}
                  <tr>
                    <td>Estimated Total Contribution</td>
                    <td className="mono">{formatPercent(contributionTotals.totalWeight)}</td>
                    <td className={`mono sep-col ${contributionCellClass(contributionTotals.qtd_style)}`}>{contributionTotals.qtd_style.toFixed(2)}%</td>
                    <td className={`mono ${contributionCellClass(contributionTotals.qtd_skill)}`}>{contributionTotals.qtd_skill.toFixed(2)}%</td>
                    <td className={`mono sep-col ${contributionCellClass(contributionTotals.t1_style)}`}>{contributionTotals.t1_style.toFixed(2)}%</td>
                    <td className={`mono ${contributionCellClass(contributionTotals.t1_skill)}`}>{contributionTotals.t1_skill.toFixed(2)}%</td>
                    <td className={`mono sep-col ${contributionCellClass(contributionTotals.t3_style)}`}>{contributionTotals.t3_style.toFixed(2)}%</td>
                    <td className={`mono ${contributionCellClass(contributionTotals.t3_skill)}`}>{contributionTotals.t3_skill.toFixed(2)}%</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", color: "var(--text3)", padding: 20 }}>
                    {hint}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
