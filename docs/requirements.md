# Feature: Two-level grouping for Portfolio Exposures

## Background

The Portfolio tab's **Portfolio Exposures** table ([clone_tool/static/index.html:373-402](../clone_tool/static/index.html#L373-L402)) currently lets the user pick **one** grouping at a time:

- a **categorical** column (MSCI Region, MSCI Country, GICS Sector, GICS Industry), or
- a **continuous metric** (ROE, Beta, P/E, Market Cap, Div Yield, …) bucketed into 5 benchmark-wide quintiles.

Quintile breakpoints are computed once over the entire benchmark universe inside [exposures_engine.parse_exposures_file](../clone_tool/exposures_engine.py#L220-L241). That makes quintile labels comparable across the whole portfolio but hides intra-group dispersion: a portfolio overweight in Europe can't show whether the European stocks it holds are high-ROE or low-ROE *relative to other European stocks*.

The new feature adds a **secondary grouping** so the user can decompose any categorical group into quintiles computed *within* that group.

## Goal

Let the user pick **any** grouping (categorical or continuous) as the primary view, and — when the primary is categorical — optionally add a continuous **sub-grouping** so each primary bucket expands into 5 quintile rows whose breaks are computed from only that primary bucket's benchmark stocks. Standalone categorical and standalone continuous behavior must both be preserved exactly.

## Functional requirements

### Three supported modes

| Mode | Group | Sub-group | Behavior |
|---|---|---|---|
| **A. Categorical only** *(existing)* | a categorical column (e.g., MSCI Region) | — | One row per category, sorted by benchmark weight desc. Identical to today. |
| **B. Continuous only** *(existing)* | a continuous metric (e.g., ROE) | — | Five quintile rows + Unclassified. Quintile breaks computed across the **full benchmark**, identical to today. |
| **C. Categorical × continuous** *(new)* | a categorical column | a continuous metric | Nested rows. Each primary bucket is one collapsible row; expanding it reveals up to 6 child rows (Q1–Q5 + Unclassified) whose breaks are computed from only the benchmark stocks in that primary bucket. |

The user reaches Mode B by picking the continuous metric directly — no "set primary to None" detour. Sub-group only becomes available when the user has chosen a categorical as the group; for a continuous group, the sub-group selector is hidden (or disabled and ignored).

### Selectors

The exposures section gains a second selector row. Both rows live above the table inside `#exp-selector` ([static/index.html:381](../clone_tool/static/index.html#L381)).

| Row | Buttons | Default | Visibility |
|---|---|---|---|
| **Group** | every entry in `CATEGORICAL_COLS` and `CONTINUOUS_COLS`, grouped by `COL_GROUPS` ([exposures_engine.py:27-94](../clone_tool/exposures_engine.py#L27-L94)) — the existing selector, unchanged | `MSCI Region` (today's default) | Always visible |
| **Sub-group** | a "None" button (selected by default) + every entry in `CONTINUOUS_COLS`, grouped by `COL_GROUPS` | `None` | Visible only when the Group selection is a categorical; hidden / disabled otherwise |

Out of scope: categorical-as-sub-group (e.g., Sector within Region) — Sub-group buttons are continuous-only.

### Table layout

Reuse the current 6-column table ([static/index.html:383-399](../clone_tool/static/index.html#L383-L399)): `Group | Benchmark | Current | Proposed | Cur vs Bmk | Prop vs Bmk`.

In nested mode:

- Each primary bucket renders as one parent row, weights aggregated across all of its stocks (same as today's categorical view).
- A `▸` / `▾` chevron toggles a child block of up to 6 rows (`Q1 (High)` … `Q5 (Low)` + optional `Unclassified`). Child rows are visually indented (e.g., 16px left padding) and styled muted.
- All primary rows are collapsed by default; user expands the buckets they care about.
- Sort order of primary rows: by benchmark weight descending, `Unclassified` last (matches current categorical sort at [exposures_engine.py:419-422](../clone_tool/exposures_engine.py#L419-L422)).
- Child quintile rows are always in fixed order: `Q1 (High)`, `Q2`, `Q3`, `Q4`, `Q5 (Low)`, then `Unclassified` if non-zero.

### Quintile semantics

**Mode B (continuous only):** unchanged from today. Quintile breaks are computed once from the full benchmark in [parse_exposures_file](../clone_tool/exposures_engine.py#L220-L241) and applied to every portfolio.

**Mode C (categorical × continuous):** quintile breaks are recomputed *per primary bucket*:

1. For each primary bucket B, take the subset of benchmark stocks whose categorical value equals B (skip `'--'` / `None` — those stocks go into the `Unclassified` primary row).
2. Compute quintile breaks `[p20, p40, p60, p80]` from that subset's sub-group values, ignoring missing values, mirroring the logic at [exposures_engine.py:230-239](../clone_tool/exposures_engine.py#L230-L239).
3. **Sparse-bucket rule:** if the subset has fewer than `N_QUINTILES * 2 = 10` non-missing values (same threshold as today), do NOT compute quintiles. Instead the primary bucket renders normally but its expansion shows a single child row labeled **"Insufficient data"** with the bucket's full weight, and no quintile rows. (No fallback to terciles, no fallback to benchmark-wide breaks.)
4. Stocks within B that have a missing sub-group value go into a child `Unclassified` row.

### Weighting and normalization

- Per primary bucket, child quintile weights sum to that bucket's total weight (so children always reconcile to the parent for both benchmark and portfolio).
- Coverage continues to be reported in `coverage_current` / `coverage_proposed`. No per-bucket coverage breakdown is required for v1.
- Weight calculations reuse [exposures_engine._portfolio_exposure](../clone_tool/exposures_engine.py#L277-L299) over the primary subset, parameterized by per-bucket quintile breaks.

## API changes

### `POST /portfolio_exposures`

Request gains one optional field:

```jsonc
{
  "managers": [...],
  "client_name": "Acme",
  "grouping":     "MSCI Region",    // unchanged — any column (categorical or continuous)
  "sub_grouping": "New Custom ROE"  // NEW; null/absent for Modes A and B
}
```

`sub_grouping` is honored only when `grouping` is a categorical column. If `grouping` is continuous and `sub_grouping` is non-null, the backend ignores `sub_grouping` and returns the standalone-continuous response (Mode B).

**Modes A and B** return today's response shape byte-for-byte (no `children`, no `is_nested`, no `sub_grouping`, no `sub_label`).

**Mode C** returns:

```jsonc
{
  "grouping":       "MSCI Region",
  "sub_grouping":   "New Custom ROE",
  "display_label":  "MSCI Region",
  "sub_label":      "ROE",
  "is_categorical": true,
  "is_nested":      true,                 // NEW; true only in Mode C
  "rows": [
    {
      "label":          "Europe",
      "benchmark":      28.4,
      "current":        30.1,
      "proposed":       29.6,
      "delta_current":  1.7,
      "delta_proposed": 1.2,
      "children": [                       // NEW; present only in Mode C
        {"label": "Q1 (High)",    "benchmark": 5.7, "current": 7.1, "proposed": 6.5, "delta_current": 1.4, "delta_proposed": 0.8},
        {"label": "Q2",           ...},
        {"label": "Q3",           ...},
        {"label": "Q4",           ...},
        {"label": "Q5 (Low)",     ...},
        {"label": "Unclassified", ...}    // omitted when zero across bmk/cur/prop
      ],
      "insufficient_data": false          // true => children = [{label:"Insufficient data", ...full bucket weight}]
    },
    ...
  ],
  "coverage_current":  97.3,
  "coverage_proposed": 97.3,
  "matched":           [...],
  "unmatched":         [...]
}
```

The metadata-only call (`grouping: null`) at [app.py:1978-1985](../clone_tool/app.py#L1978-L1985) is unchanged — the existing menu already groups continuous metrics by category.

## UI requirements

### Files touched
- [clone_tool/static/index.html:373-402](../clone_tool/static/index.html#L373-L402) — selector + table markup.
- [clone_tool/static/index.html:3198-3322](../clone_tool/static/index.html#L3198-L3322) — `buildExposuresSelector`, `loadExposures` rendering.

### Behaviors
- Selector renders as two stacked rows (`Group` / `Sub-group`), labels left-aligned, buttons right of the label, active button highlighted with `btn-primary` (matches current pattern at [static/index.html:3219-3221](../clone_tool/static/index.html#L3219-L3221)).
- The Sub-group row hides (or fades to disabled) whenever the active Group is a continuous metric, and resets to "None" when the user switches Group from categorical to continuous.
- Clicking either selector triggers a single `/portfolio_exposures` POST and re-renders the table.
- Parent row gets a chevron `▸`/`▾` in the leftmost column when `children` is present (Mode C only). Click toggles only that row's children (no global expand/collapse for v1). In Modes A and B no chevron is shown — the table looks exactly like today.
- Coverage and unmatched-manager notes ([static/index.html:3273-3282](../clone_tool/static/index.html#L3273-L3282)) continue to render unchanged.
- Header column label shows `"<group> × <sub-group>"` (e.g., `"MSCI Region × ROE"`) in Mode C; in Modes A and B it shows the single grouping's display label, unchanged.

## Backend implementation notes

- Keep `compute_portfolio_exposures` callable in single-grouping mode (no signature break for any existing internal caller).
- Add a sibling function (or branch) that accepts both groupings, computes per-primary-bucket subsets of the benchmark, derives per-bucket quintile breaks, and weights each manager's holdings into both the primary bucket and the within-bucket quintile.
- `_assign_quintile` ([exposures_engine.py:260-274](../clone_tool/exposures_engine.py#L260-L274)) is reusable as-is — pass the per-bucket `breaks` array.
- The `'Unclassified'` primary row (stocks whose categorical value is missing) does not get expanded — its expansion is empty / hidden.

## Out of scope (v1)

- Categorical × categorical (e.g., Sector within Region).
- More than two levels of nesting.
- Persisting expand/collapse state across reloads.
- Sub-bucket coverage reporting.
- CSV / Excel export of the nested table.

## Acceptance criteria

1. **Mode A regression:** picking `MSCI Region` as Group with no Sub-group returns the same payload and table as today.
2. **Mode B regression:** picking `New Custom ROE` as Group (Sub-group hidden) returns the same payload and table as today's standalone ROE view, with quintile breaks computed across the full benchmark.
3. **Mode C basic:** picking `MSCI Region` + `New Custom ROE` returns a payload with `is_nested: true` and per-region `children` arrays. Region "Europe" benchmark percentage equals the sum of its children's benchmark percentages (within ±0.1% rounding).
4. **Sparse-bucket rule:** a region with fewer than 10 benchmark stocks for ROE returns `insufficient_data: true` and a single `"Insufficient data"` child row.
5. **UI toggle:** expanding / collapsing a region row in the UI does not re-fetch from the backend.
6. **One POST per change:** switching Group, switching Sub-group, or toggling Sub-group to None each triggers exactly one `/portfolio_exposures` POST.
7. **Sub-group is ignored for continuous groups:** if the client sends `grouping: "New Custom ROE"` with `sub_grouping: "Beta (3 yr)"`, the backend returns Mode B output (no `children`, no `sub_grouping` in response).
8. **Menu call unchanged:** the metadata call (`grouping: null`) returns the existing menu unchanged.

## Verification

- Boot via `clone_tool/venv/Scripts/python.exe clone_tool/run.py`, load a client with the cached state, upload a FactSet Exposures file, and step through the four combinations above on the Portfolio tab.
- Spot-check a single region: in the FactSet workbook, filter benchmark stocks to that region and compute their ROE 20/40/60/80 percentiles by hand; confirm they match the breakpoints used in the response.
- Confirm `coverage_current` is unchanged across single-grouping and nested modes for the same client.
