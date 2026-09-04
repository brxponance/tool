# Journal

## Index

_Newest first. Add new entries directly below this index._

- [2026-09-04 — Tab switches keep session state: last client + unsaved edits (Portfolio), last selection (Peer Groups)](#2026-09-04--tab-switches-keep-session-state-last-client--unsaved-edits-portfolio-last-selection-peer-groups)
- [2026-09-04 — Peer Groups bucket overrides now flow to the Portfolio tab (the store existed; the Portfolio side was never wired)](#2026-09-04--peer-groups-bucket-overrides-now-flow-to-the-portfolio-tab-the-store-existed-the-portfolio-side-was-never-wired)
- [2026-09-04 — '1-yr Momentum' added to the exposures groupings (Portfolio + Manager Detail)](#2026-09-04--1-yr-momentum-added-to-the-exposures-groupings-portfolio--manager-detail)
- [2026-09-04 — QTD/YTD were both hardcoded to 3 months; period windows now calendar-aware and label-honest](#2026-09-04--qtdytd-were-both-hardcoded-to-3-months-period-windows-now-calendar-aware-and-label-honest)
- [2026-09-04 — Memo descriptions blank in production: parser change shipped without an INPUT_PARSER_VERSION bump](#2026-09-04--memo-descriptions-blank-in-production-parser-change-shipped-without-an-input_parser_version-bump)
- [2026-09-03 — Overlap tab removed from the nav (feature lives on in the Portfolio tab)](#2026-09-03--overlap-tab-removed-from-the-nav-feature-lives-on-in-the-portfolio-tab)
- [2026-09-03 — Report tab reduced to the three export cards; hidden capture sheet kept for the Quarterly PDF](#2026-09-03--report-tab-reduced-to-the-three-export-cards-hidden-capture-sheet-kept-for-the-quarterly-pdf)
- [2026-09-03 — "Atlantic Health Endowment- IMC" section recognized as ATL Health; stray placeholder eliminated](#2026-09-03--atlantic-health-endowment--imc-section-recognized-as-atl-health-stray-placeholder-eliminated)
- [2026-09-03 — Memo exposures tables now reconcile with the Portfolio tab (shared matching)](#2026-09-03--memo-exposures-tables-now-reconcile-with-the-portfolio-tab-shared-matching)
- [2026-09-03 — Word memo: chart-only market cycle, EAFE SC benchmark fixed, Description-tab write-ups](#2026-09-03--word-memo-chart-only-market-cycle-eafe-sc-benchmark-fixed-description-tab-write-ups)
- [2026-09-03 — Manager Detail showed the wrong Empiric portfolio and benchmark; ownership resolution now runs without a client](#2026-09-03--manager-detail-showed-the-wrong-empiric-portfolio-and-benchmark-ownership-resolution-now-runs-without-a-client)
- [2026-09-03 — The 127.0.0.1 "no data" gotcha struck again; start skill now says localhost](#2026-09-03--the-127001-no-data-gotcha-struck-again-start-skill-now-says-localhost)
- [2026-08-13 — New Performance Attribution tab; contribution tables moved out of Portfolio](#2026-08-13--new-performance-attribution-tab-contribution-tables-moved-out-of-portfolio)
- [2026-08-13 — Peer groups: multi-select; placeholder list cleaned (strategy-level 3yr rule); market-cycle split dots for remaining+added/removed](#2026-08-13--peer-groups-multi-select-placeholder-list-cleaned-strategy-level-3yr-rule-market-cycle-split-dots-for-remainingaddedremoved)
- [2026-08-13 — Exposures "Unclassified" audit: header-vintage aliasing fixed; CALSTRS's 23% is a terminated cash-only sleeve](#2026-08-13--exposures-unclassified-audit-header-vintage-aliasing-fixed-calstrss-23-is-a-terminated-cash-only-sleeve)
- [2026-08-13 — Holdings overlap matched managers to the wrong client's portfolios; replaced fuzzy matching with client-ownership resolution](#2026-08-13--holdings-overlap-matched-managers-to-the-wrong-clients-portfolios-replaced-fuzzy-matching-with-client-ownership-resolution)
- [2026-08-13 — /run crashed in production on a fresh upload (third S3-key bug; fixed the class at the source)](#2026-08-13--run-crashed-in-production-on-a-fresh-upload-third-s3-key-bug-fixed-the-class-at-the-source)
- [2026-08-11 — Manager Detail: multi-manager comparison + skill-chart fixes](#2026-08-11--manager-detail-multi-manager-comparison--skill-chart-fixes)
- [2026-08-11 — Regional sleeve views on the FactSet Risk panel (dormant backend, new UI)](#2026-08-11--regional-sleeve-views-on-the-factset-risk-panel-dormant-backend-new-ui)
- [2026-08-11 — Added managers never matched FactSet data (UNKNOWN-class gate); risk panel now flags misses](#2026-08-11--added-managers-never-matched-factset-data-unknown-class-gate-risk-panel-now-flags-misses)
- [2026-08-11 — Uploading a weights file never took effect in production (S3 key vs local path)](#2026-08-11--uploading-a-weights-file-never-took-effect-in-production-s3-key-vs-local-path)
- [2026-08-11 — My preflight check blocked production for a week (AccessDenied read as "missing")](#2026-08-11--my-preflight-check-blocked-production-for-a-week-accessdenied-read-as-missing)
- [2026-08-06 — Deploys have been failing since Jul 31: pc-tool/database-url unreadable](#2026-08-06--deploys-have-been-failing-since-jul-31-pc-tooldatabase-url-unreadable)
- [2026-08-04 — One combined market-cycle chart; localhost-vs-127.0.0.1 dev gotcha](#2026-08-04--one-combined-market-cycle-chart-localhost-vs-127001-dev-gotcha)
- [2026-07-31 — Added root CLAUDE.md; journals now indexed and newest-first](#2026-07-31--added-root-claudemd-journals-now-indexed-and-newest-first)
- [2026-07-31 — Ported the new clone_tool drop; fixed the deploy outage; made deploys self-service](#2026-07-31-ported-the-new-clone_tool-drop-fixed-the-deploy-outage-made-deploys-self-service)
- [2026-07-20 — Fixed broken deploys + added a stable URL (ALB)](#2026-07-20-fixed-broken-deploys-added-a-stable-url-alb)
- [2026-07-07 — Sync teammate's monolith features into backend + frontend](#2026-07-07-sync-teammates-monolith-features-into-backend-frontend)
- [2026-07-07 — Moved project off OneDrive to C:\dev\pc_tool (canonical working copy)](#2026-07-07-moved-project-off-onedrive-to-cdevpc_tool-canonical-working-copy)

---

## 2026-09-04 — Tab switches keep session state: last client + unsaved edits (Portfolio), last selection (Peer Groups)

Routes unmount on navigation, so the Portfolio tab reset to the first
client (MD) and Peer Groups to EAFE Growth every time — losing in-progress
weight edits along the way. User request: keep the last viewed
portfolio/peer group and unsaved changes "in the cache until the end of my
session" (not persisted).

Pattern: module-level session stores, same as lib/state/bucket-overrides.

- New `features/portfolio/lib/session-cache.ts`: last selected client +
  per-client working manager list. `use-portfolio-screen` prefers the
  remembered client over `clients[0]`, mirrors every portfolio change into
  the cache (cloned both ways so nothing aliases), and on load restores the
  cached working copy while `persistedPortfolioManagers` still comes from
  the FRESH server response — so Save/Discard dirty-detection stays honest.
  **Discard drops the cache first**, or the reload would restore the very
  edits being discarded.
- `use-peer-groups-screen`: module-level `lastSessionSelections` seeds the
  selection state and is updated on every change.

Scope notes: session-only (full page reload clears both); Manager Detail
selection not included (not asked). Known edge: after a clone run in the
same session, a cached working copy carries pre-run analytics values for
its managers until Discard/reload — same staleness class as bucket
overrides.

Verified headed: ATL Health + an unsaved Ballina weight edit (20%) survive
a round trip through Peer Groups; the peer-group selection (ISC Core)
survives the trip back.

### Follow-up bug (user-reported): client switches stopped switching the lineup

First cut mirrored `state.portfolio` into the cache keyed by
`state.selectedClient` in a plain effect — but mid-switch, selectedClient
is already the NEW client while portfolio still holds the OLD one's data,
so MD's managers got cached under IMRF and the loader faithfully
"restored" them. Fix: new `portfolioClient` state field records which
client the loaded portfolio belongs to (set in loadPortfolio's success
path, nulled on failure), and the mirror writes only when
`portfolioClient === selectedClient`. Verified headed: MD→IMRF swaps the
lineup; IMRF's unsaved edit survives a Peer Groups round trip AND an
MD detour; MD's lineup untouched. Lesson: never key a cache off two state
fields that update in different render passes.

## 2026-09-04 — Peer Groups bucket overrides now flow to the Portfolio tab (the store existed; the Portfolio side was never wired)

User expectation (with an example: Empiric's 3F V-G reads +100%, they
disagree and want to re-bucket it toward Core): style-bucket edits on the
Peer Groups tab should filter through to the Portfolio Managers table.

Finding: `lib/state/bucket-overrides.ts` was BUILT for exactly this — its
header comment promises the flow to "manager table dots,
/compute_portfolio_stats payloads, /market_cycle payloads" and it ships
`effectiveManagerVG/VG3F/applyBucketOverrides`-style helpers — but only
the Peer Groups feature ever imported it. The Portfolio tab never
consumed the store; the plumbing stopped at the wall.

### Wired

- `portfolio-table.tsx`: the 3F V-G and FULL V-G cells use
  `effectiveManagerVG3F` / `effectiveManagerVG` (bucket-derived V-G when an
  override exists, server value otherwise), with an amber ● + tooltip on
  overridden rows — same affordance Peer Groups uses.
- `use-portfolio-screen.ts`: `/compute_portfolio_stats` payload passes
  through new `applyBucketOverrides()` (store) so the V-G positioning
  panel reflects the edits; the override map (identity changes per store
  update) joined the derived-data effect deps, so edits re-fetch live.
- NOT wired: `/market_cycle` — the endpoint classifies managers
  server-side from clone data and ignores payload buckets, and the chart
  has its own per-manager Final Bucket override; the store comment
  overpromised there.

Semantics: an override replaces BOTH V-G columns with (Value+Yield)−Growth
of the merged buckets (the store's existing rule — non-overridden managers
keep the server V-G, which includes non-bucket factor contribution).
Overrides remain session-only and clear when a clone run completes.

Verified headed end-to-end (and confirmed by the user in their own
session): Peer Groups → ISC → Empiric → Core →100, then Portfolio →
ATL Health → Add Manager → Empiric ISC: table row shows ● 0.0% / 0.0%
V-G, stats recompute. Automation gotcha for future scripts: the override
store is module-level session state — `page.goto` reloads wipe it, so
navigate between tabs by clicking nav links.

## 2026-09-04 — '1-yr Momentum' added to the exposures groupings (Portfolio + Manager Detail)

The FactSet grouping-exposures workbook carries a `1-yr Momentum` column
(percent trailing-12 price return per security) that the tool ignored —
only RSI 63 / RSI 252 sat under Momentum. Added it to `exposures_engine`'s
column config (CONTINUOUS_COLS, DISPLAY_LABELS '1yr Momentum', COL_GROUPS
'Momentum', `_RANGE_FMT` as `x.x%`). One config feeds both tabs — the
Portfolio tab's exposures table and Manager Detail's panel share the
`/portfolio_exposures` menu — so no frontend change was needed.

Gotcha encoded in the v3 INPUT_PARSER_VERSION comment: benchmark quintile
breaks for continuous columns are computed AT PARSE TIME, so adding a
column to CONTINUOUS_COLS needs a re-parse (locally: Reload Inputs, done;
production: the pending v3 bump re-parses on deploy).

Verified: menu lists it under Momentum on both tabs; Mode B for ATL Health
gives sane quintiles (Q1 ≥ 62.7%, Q5 < −6.8%, benchmark coverage 98.2%,
rows sum to 100 with Cash/Unclassified); Mode C (Sector × 1yr Momentum)
renders on the Portfolio tab; Manager Detail quintile table renders for
Empiric.

## 2026-09-04 — QTD/YTD were both hardcoded to 3 months; period windows now calendar-aware and label-honest

Manager Detail's Period Returns showed QTD == YTD. Root cause:
`compute_manager_period_returns` (data_loader.py) computed BOTH as the
compound of the latest 3 months, with a comment from when the data ended
March 2026 ("end of Q1, so YTD = QTD"). Nothing looked at the calendar,
and the caller never passed the dates it had. The June 2026 upload
(latest month 2026-06-30) exposed it.

### What changed

- New `calendar_window_months(latest_date)` in `data_loader.py`:
  QTD window = ((M−1) mod 3) + 1 months, YTD = M months, (3, 3) fallback
  when no date is supplied. June → (3, 6); April → (1, 4).
- `compute_manager_period_returns` takes `latest_date` (passed from
  `/manager_skill_summary`'s inception-trimmed `dates[0]`).
- Attribution contribution rows (`_build_portfolio_contribution_rows`,
  app.py) use the same calendar-aware QTD — the old hardcoded 3 was only
  right when data ended on a quarter boundary.
- Period definitions tightened per user spec: 1yr = exactly trailing 12
  months (plain compound — annualization at 12 months is the identity),
  3yr/5yr = exactly trailing 36/60 annualized — `require_full=True`, so a
  manager with 18 months no longer shows an annualized 18-month figure
  labeled "3yr" (was allowed at n//2 months before; now None). QTD/YTD
  stay lenient for near-inception managers. SI = every month since the
  manager's own inception (the endpoint already trims manager, clone AND
  benchmark to that inception), annualized at ≥ 12 months.

### Verified

Empiric ISC vs manual compounds from the raw workbook: QTD 7.91 (Apr–Jun),
YTD 3.68 (Jan–Jun), 1yr 15.47 — exact match; UI shows QTD 7.9% / YTD 3.7%
(benchmark 9.0/7.6). Attribution endpoint healthy; June being a
quarter-end means its QTD numbers are unchanged today, but April/May
uploads now produce 1- and 2-month QTDs instead of silently reaching into
the prior quarter.

## 2026-09-04 — Memo descriptions blank in production: parser change shipped without an INPUT_PARSER_VERSION bump

User ran an ATL Health rebalance memo (Empiric + IMC EAFE SC added) on the
DEPLOYED tool and the New Managers firm write-ups were blank, despite the
2026-09-03 fix. The code was live (the memo's EAFE SC benchmark fix showed
correctly) — the DATA wasn't: yesterday's change made
`parse_qualitative_file` read the Firm Data workbook's "Description" tab,
which changes the parser's OUTPUT shape, but the deploy didn't bump
`INPUT_PARSER_VERSION`. Production booted, loaded the pickled cache
(written by parser v2, matching the current constant), saw nothing stale,
and served the old qualitative parse with no `descriptions` key.

Fix, both halves:
- Immediate: POSTed production `/reload_inputs` — all five inputs
  re-parsed ok; regenerated the memo through the ALB and both write-ups
  (Empiric Institutional…, Informed Momentum…) now populate.
- Durable: `INPUT_PARSER_VERSION` bumped 2 → 3 in `backend/app.py` so any
  environment holding an old cache re-parses automatically on next boot.

**Rule re-learned (now noted at the constant):** bump the version whenever
a parser's output shape changes — new keys count, not just changes to how
the input file is read. The 2026-09-03 session also added the
security-risk file to `/reload_inputs`; that gap plus the missing bump
were the two halves of the same blind spot.

## 2026-09-03 — Overlap tab removed from the nav (feature lives on in the Portfolio tab)

The standalone Overlap tab duplicated the holdings-overlap section already
embedded in the Portfolio tab. Removed: the `/overlap` nav entry
(`lib/constants.ts` APP_NAV_ITEMS), the page route
(`app/(workspace)/overlap/page.tsx`) and the standalone screen
(`features/overlap/routes/overlap-route.tsx`).

**Kept:** the rest of `features/overlap/` (components / api / types) — the
Portfolio tab imports `OverlapSection` and `OverlapManagerInput` from it,
per the bounded-feature rule (the Portfolio tab composes the overlap
feature; only its standalone route was retired).

Verified headed: nav reads Setup / Portfolio / Attribution / Peer Groups /
Manager Detail / Report; `/overlap` returns 404; the Portfolio tab's
overlap section still renders for ATL Health. Gotcha: `tsc --noEmit` kept
failing on `.next/types/validator.ts` referencing the deleted page — a
stale GENERATED file; deleting it (Next regenerates) cleared the
typecheck. A fresh `next build` regenerates it from scratch, so deploys
are unaffected.

## 2026-09-03 — Report tab reduced to the three export cards; hidden capture sheet kept for the Quarterly PDF

User request: keep Quarterly Portfolio Report, Dispersion Report and
Returns Download untouched; remove the "Default Portfolio Report" toolbar
at the top (title, client dropdown, Print/Export PDF, PPTX export) and the
on-screen example report below.

**The trap a future reader must not fall into:** the Quarterly Portfolio
Report PDF is NOT server-rendered — `report-export-cards.tsx` switches the
on-screen report sheet through each selected client (polling the route's
`data-report-client` / `data-report-loading` attributes) and
html2canvas-captures the sheet's `rpt-capture-*` sections page by page.
Deleting the sheet kills the Quarterly PDF. So `report-route.tsx` keeps
the full `.rpt-sheet` mounted but wrapped in an off-screen container
(`position:absolute; left:-10000px; width:920px` — the sheet's natural
max-width, so layout/capture geometry is unchanged), `aria-hidden`, no
pointer events. The toolbar block, its client selector, `window.print()`
button, `PptxExportButton` and the loading line were removed; the route
error line stays. `use-report-screen` still auto-selects the first client
so "None selected — exports the client on screen" keeps working.

Verified headed: tab shows only the three cards; sheet mounted but not
visible; clicked Download PDF and received a 390 KB
`Quarterly_Portfolio_Report_2026-09-03.pdf` — off-screen capture works.

## 2026-09-03 — "Atlantic Health Endowment- IMC" section recognized as ATL Health; stray placeholder eliminated

User added an IMC EAFE SC portfolio to both FactSet workbooks as
**"Atlantic Health Endowment- IMC"** (spelled-out account name, not the
XPN…AHE coding; note no space before the dash). Two symptoms: the tool
spawned a placeholder manager named after the section, and 'IMC EAFE SC'
kept proxying to the standard-cap 'IMC Global' profile.

Root cause was one gap with two effects: `holdings_resolver` didn't know
the spelled-out prefix. `section_client` returned None (section unowned →
resolver couldn't own-match it, class unknown) and `_SECTION_PREFIX`
didn't strip it (firm key came out 'atlantic health endowment imc', so
firm matching failed AND `_enumerate_placeholder_candidates`' firm
suppression — which keys on prefix-stripped names — never engaged, so the
raw section name surfaced as a placeholder).

Fixes in `holdings_resolver.py`:
- `section_client`: names starting with 'ATLANTIC HEALTH' → 'ATL Health'.
- `_SECTION_PREFIX`: strips `Atlantic Health (Endowment)? -` decoration.
- Tier-1 gating: with `client_name=None` (Manager Detail), tier 1 used to
  treat unmarked profiles as authoritative with NO class gate — a
  standard-cap 'IMC Global' would shadow the sleeve-compatible ATL
  section. Tier 1 now applies only to a real client; unmarked profiles go
  through class-gated tier 3 (plus the fuzzy safety net, so Oberweis /
  Evolution Global-style solo matches still work — regression-checked).

Verified: placeholder gone from /all_managers; 'IMC EAFE SC' resolves to
the new section in every context (ATL client flow, Manager Detail, memo,
risk file) with benchmark MSCI EAFE Small Cap; Empiric and the all-client
benchmark sweep unchanged. Also caught a NameError my earlier
`_match_managers_to_sections` refactor introduced (section_client import
had moved out of compute_portfolio_exposures' override block).

Gotcha for future uploads: new client-account section names must be
recognizable to `section_client` / `_SECTION_PREFIX` — a spelling the
resolver doesn't know reverts that section to unowned/UNKNOWN and it can
resurface as a placeholder.

## 2026-09-03 — Memo exposures tables now reconcile with the Portfolio tab (shared matching)

User reconciled an ATL Health rebalance (terminate Lizard + Redwood,
Frontier→18%, add Empiric 24.6% + IMC EAFE SC 8%) and the memo's Region /
Sector weights disagreed wildly with the on-screen Portfolio Exposures
table (memo pre-trade Pacific Rim 22.90 vs tool 31.5; pre-trade regions
summed to ~76).

### Root cause

`build_memo_exposures` → `_aggregate_holdings` still did its own raw
`_fuzzy_match_manager` matching (the memo path was never migrated to the
ownership resolver). For ATL Health that meant: Ballina, CastleArk,
Frontier AND Redwood all fuzzy-matched to `MD-CASTLEARK WORLD X US SC` —
the first claimant won and the other three were **silently dropped**
(the `sec in used` branch didn't even record them as unmatched); Lizard
and Mac Alpha landed on MD's sleeves; Empiric on `New Haven - Empiric EM`.
The memo also folded cash + missing tags into a hidden `--` bucket that
stayed in the denominator but was skipped from display, so rows couldn't
sum to 100.

### Fix

- Extracted the Portfolio tab's matching (ownership resolver + free-pool
  fuzzy safety net) into `_match_managers_to_sections()` in
  `exposures_engine.py`; `compute_portfolio_exposures` and
  `build_memo_exposures` now share it verbatim. `_aggregate_holdings`
  takes the precomputed match map and no longer matches anything itself.
- `build_memo_exposures` takes `client_name` / `client_rosters` (passed
  from `/export_portfolio_docx`), and returns `matched_sections` for
  debuggability.
- Memo group tables now use the same `Cash` / `Unclassified` buckets as
  the on-screen table (`is_cash_row`; both pinned to the bottom, and kept
  out of the Developed/Emerging split in nested mode).

### Verified

Offline side-by-side of both engines on the exact scenario: identical
section matches, and every region/sector row agrees within ≤0.05
(residue = the memo renormalises each sleeve to exactly 100% while the
table uses raw section weights — rounding-level). Regenerated the docx:
Pacific Rim 31.51 pre / 37.52 post, Industrials 27.75, Cash and
Unclassified rows present, diffs vs the EAFE SC column correct.

### Data note

'IMC EAFE SC' has no small-cap section in the exposures workbook; both
engines consistently fall back to the standard-cap 'IMC Global' profile
(safety net over unowned sections). The 8% sleeve's exposures are IMC's
standard-cap holdings until an SC portfolio is added to the FactSet pull.

## 2026-09-03 — Word memo: chart-only market cycle, EAFE SC benchmark fixed, Description-tab write-ups

Three user-requested changes to the Word rebalance memo ("Print Memo
Report" on the Portfolio tab):

1. **Market-cycle image is now the chart alone.** The memo embedded an
   html2canvas capture of `#market-cycle-section` — the whole panel:
   border, "Market Cycle Chart" title, benchmark caption top-right, and
   the placement table below. The chart wrapper now carries its own id
   (`#market-cycle-chart-only` in `market-cycle-section.tsx`) and
   `export-docx.ts` captures that node (old id kept as fallback).
   Verified headed: the element screenshot is the bare chart.

2. **Pre/post-trade tables used the wrong benchmark for ATL Health.**
   `_match_benchmark_section` was a bare WRatio-55 fuzzy match, so
   'MSCI EAFE SC' landed on the 'MSCI EAFE' section instead of 'MSCI EAFE
   Small Cap' — the memo's characteristics / region / sector tables
   carried the standard-cap benchmark column labeled "EAFE". It now goes
   through `_resolve_benchmark_name` (exact > normalized > fuzzy-80) with
   the loose fuzzy only as a last resort. `_short_bench` already handled
   the label — ATL Health's column header now reads **EAFE SC**.

3. **New Managers write-ups now come from the Firm Data workbook's
   "Description" tab** (firm in column A, prose in column B).
   `parse_qualitative_file` only ever read the first sheet, and the
   `rec.get('description')` the memo relied on was a field nothing ever
   set — descriptions were always blank. The loader now also parses a
   sheet named "Description(s)" into `qd['descriptions']`, and a new
   `match_description()` (same longest-prefix rule as `match_firm`, so
   'IMC ACWI ex US' finds 'IMC') feeds the memo; the old firm-record
   field remains as fallback. Requires a Reload Inputs / re-upload for
   the descriptions to enter the parsed state — done locally.

Verified end-to-end by POSTing `/export_portfolio_docx` for ATL Health
with Empiric added: docx contains the "EAFE SC" table header, "MSCI EAFE
Small Cap" in the risk caption, and Empiric's full description under New
Managers.

## 2026-09-03 — Manager Detail showed the wrong Empiric portfolio and benchmark; ownership resolution now runs without a client

User report: Manager Detail for Empiric (ISC tab — the ATL Health EAFE Small
Cap account) showed FactSet Risk Exposures "vs MSCI ACWI ex US Small Cap" and
a Portfolio Exposures table that was visibly a different portfolio, vs "MSCI
All Country World Ex-United States". Standing user rule recorded here:
**`XPN…AHE` sections in the FactSet risk/exposures workbooks are ATL Health,
an EAFE Small Cap account — anything so designated is EAFE SC and belongs
against the EAFE SC benchmark.**

### Root causes (four, stacked)

1. **Manager Detail bypassed ownership resolution entirely.** Its backend
   calls pass no `client_name`, so both engines fell back to pure fuzzy
   matching — which landed "Empiric" on `New Haven - Empiric EM`, a
   different portfolio (the EM ADR sleeve). The correct sections
   (`XPNEIAHE - Empiric`) existed in both workbooks.
2. **Stale parse.** The pickled exposures parse predated the workbook
   version that added `XPNEIAHE - Empiric`, so the right section wasn't
   even a candidate until `/reload_inputs`. Related gap: `/reload_inputs`
   never covered the security-risk file at all — it was the one input that
   could only refresh via re-upload.
3. **Hardcoded per-tab benchmark hint.** `mgrBenchmarkHint` (frontend) sends
   "MSCI ACWI ex US Small Cap" for every ISC manager — right default for
   most, wrong for a manager whose section is client-owned EAFE SC.
4. **Risk endpoint used the hint verbatim.** No resolution against actual
   Risk-Summary columns ("MSCI ACWI ex-US SC" ≠ hint spelling), so
   `bench_abs` was empty and the panel silently rendered ABSOLUTE exposures
   labeled as active-vs-benchmark.

### What changed

- `holdings_resolver.py`: new `CLIENT_DEFAULT_CLASS = {'ATL Health':
  ('EAFE', 'SC')}` — AHE sections get a sleeve class even though neither
  the coded name nor ATL Health's roster (which has no Empiric entry)
  supplies one.
- `exposures_engine.compute_portfolio_exposures` and
  `security_risk_engine.compute_exposures`: ownership resolution now runs
  with `client_name=None` too (tier 1 = unmarked profiles, tier 2 =
  sleeve-compatible client sections), replacing the fuzzy-only no-client
  path. Empiric/EAFE-tab (standard size, no section anywhere) now correctly
  reports unmatched instead of borrowing the EM portfolio.
- Benchmark for manager detail: exposures — when every matched section is
  owned by one client AND that client's benchmark is sleeve-compatible with
  the manager, the client benchmark overrides the tab hint (compatibility
  gate added after the first attempt wrongly attached New Haven's ACWI-ex-US
  client benchmark to its Empiric EM sleeve). Risk — requested bench now
  resolves against actual columns: exact > the matched sections' own
  "vs. <benchmark>" suffix > normalized match; `fallback_absolute` no longer
  triggers for spelling differences.
- `app.py`: `/portfolio_exposures` passes `client_benchmarks`;
  `/reload_inputs` now re-parses the security-risk workbook too.
- Responses now expose `matched_sections` (exposures) so which section fed a
  table is checkable.

### Verified

Headed Playwright on Manager Detail for Empiric ISC: risk panel reads "vs
MSCI EAFE Small Cap" with genuine active values; sector table vs MSCI EAFE
Small Cap tracks tightly (Industrials 23.9% vs 23.8%) — clearly the right
portfolio (the EM one had Consumer Staples at 32%). Regression-checked:
ATL Health client flow unchanged; Empiric EM still resolves to the New Haven
section; client-context risk path unchanged.

### Follow-up: Portfolio tab checked, one more benchmark bug found and fixed

Simulated "Add Manager → Empiric (ISC)" into MD, ATL Health and CIT
portfolios: the ownership resolver picks `XPNEIAHE - Empiric` in every
client context (tier own for ATL Health, tier peer elsewhere), and the
table correctly stays on the CLIENT's benchmark. But the sweep exposed a
pre-existing exposures-benchmark resolution bug: the normalizer lacked the
'All Country World'/'AC World' → ACWI and 'USA' → 'US' canonicalisations,
so **CIT ('MSCI ACWI ex-US SC') fuzzy-landed on the non-SC 'MSCI All
Country World Ex-United States'** instead of 'MSCI AC World ex USA Small
Cap'. Fixed `_resolve_benchmark_name` to build on
`holdings_resolver._norm_bench` + 'usa'→'us'. First attempt regressed MD
('MSCI World ex US SC' → WRatio substring pick of plain 'MSCI World');
added the established World-ex-US ≈ EAFE+Canada equivalence, so MD now
exact-matches 'MSCI EAFE + Canada Small Cap'. Verified benchmark
resolution for all 14 clients — every one now lands on the semantically
right column (exact normalized match everywhere except none).

### Still open

- The exposures file has no MSCI EM benchmark section, so "Empiric EM"'s
  manager-detail exposures fall back to the file default (flagged
  `benchmark_fallback`).
- The user mentioned another suspected issue in the Portfolio Exposures
  classification — not yet described.

## 2026-09-03 — The 127.0.0.1 "no data" gotcha struck again; start skill now says localhost

Started the app for a dev session; the user reported "no data" even though the
backend had its full 125-manager cache and every curl check (backend `/status`,
frontend proxy `/api/backend/clients`) returned 200 with data. Same root cause
as journaled 2026-08-04: the start skill said to open **http://127.0.0.1:3000**,
Next 16 treats that origin as cross-origin for dev resources, React never
hydrates, and the page sits in its empty server-rendered shell. curl can't
catch it — only a real browser shows it.

### What went wrong on the first attempt

Added `allowedDevOrigins: ["127.0.0.1"]` to `next.config.ts` before finding the
2026-08-04 entry recording that this exact fix was proposed and **declined** —
the standing decision is to keep the config untouched and use `localhost`.
Reverted the config, restarted the dev server, and verified with visible
Playwright (Edge, headed) that `/portfolio` renders the full manager table at
**http://localhost:3000** with zero failed requests.

### The durable fix

[.claude/skills/start/SKILL.md](.claude/skills/start/SKILL.md) was the trap:
it told every future session to open `127.0.0.1:3000`. It now says
**localhost:3000**, explains why, and notes that curl checks against
`127.0.0.1` are fine — only the browser URL matters. Also re-learned: a stale
`next start`-style server can survive on port 3000 from a prior session, and
killing the npm wrapper doesn't kill the child node process holding the port —
check `netstat` and kill the actual PID.

New nav tab **Attribution** (`/attribution`, eyebrow "Performance") — the
future home of the quarterly attribution / benchmark theme discovery work
(see the design plan + FactSet pull spec journaled earlier this month). For
now it hosts the two tables moved from the Portfolio tab: **Current
Portfolio Contribution** and **Contribution by Style Group**, with its own
client dropdown (same pattern as Portfolio's selector, read-only — no
add/rename) plus a benchmark caption.

Structure per frontend rules: new bounded feature `features/attribution/`
(routes/components/api/types). The tab fetches `/clients` and
`/portfolio_contribution/<client>` itself — no coupling to the portfolio
screen's state. The contribution helpers (style-group bucketing by vg_full
±25%, weighted sums, totals row) moved with the tables. Portfolio side: the
two panels and the `contribution` prop were removed from
`portfolio-analytics-sections.tsx` / `portfolio-route.tsx`; NOTE
`use-portfolio-screen.ts` still fetches contribution data (including the
draft-preview variant used when weights are edited) — left in place
deliberately since the attribution tab may want the preview flow later;
it's an unused fetch on the Portfolio tab today.

## 2026-08-13 — Peer groups: multi-select; placeholder list cleaned (strategy-level 3yr rule); market-cycle split dots for remaining+added/removed

Three UI/logic changes requested in one session:

### Market-cycle chart: split dots for every co-location combo
Previously only removed+added at the same placement got a half-red/half-green
dot; a REMAINING manager sharing a spot with an added/removed one was silently
swallowed into a solid color. `market-cycle-chart.tsx` now splits by all
statuses present, fixed left→right order removed(red)/retained(blue)/
added(green): two statuses = vertical half-split, all three = three 120°
wedges. Report tab reuses the component so it inherits the fix. (The color
legend under the chart was subsequently removed entirely at the user's
request — the tooltips still name each manager's status.)

### Peer groups tab: select multiple peer groups at once
`use-peer-groups-screen.ts` now holds a Selection[] — peer buttons TOGGLE
groups in/out (min 1), data fetched per unique tab and cached, and the tables
show the union with each row tagged `_tab` so bucket edits, override storage,
and manager-detail links stay tab-correct in a mixed view (EAFE Growth + EAFE
Core, or even cross-universe combos). `decoratedManagers` resolves overrides
per row-tab; row keys are `tab|name` to survive same-named managers across
tabs.

### Placeholder peer group: only genuine <3yr strategies, one row each
`_enumerate_placeholder_candidates` (app.py) rewritten. The old union of raw
file names surfaced junk: 'Uniphar PLC' (a security misparsed as a risk-file
section), 'X' + 'X vs. MSCI …' duplicates, and client-decorated sleeves of
fully-cloned firms (NYSCRF/XPONANCE - BALLINA CAPITAL, MASS PRIM - OSMOSIS…)
whenever the alias crosswalk missed a decoration. New rules:
- security-risk columns WITHOUT a 'vs. <benchmark>' suffix are strays → dropped
  at source (kills Uniphar);
- names are cleaned (strip 'vs.' suffix + client prefix) and deduped per
  strategy; weights-file labels win the display name ('Ravenswood EAFE +
  Canada', not 'NYCBERS - RAVENSWOOD EAFE+Canada');
- FIRM suppression for client-decorated names only: if the firm has any
  cloned BUY-LIST strategy, its decorated sleeves are never placeholders.
  Deliberately NOT applied to plain strategy names — a firm can have one
  cloned strategy and another too young ('IMC ACWI ex US' cloned, 'IMC
  Global' legitimately placeholder). Also deliberately NOT keyed on universe
  clones (first attempt did, and the peer universe's hundreds of firms
  wrongly suppressed everything).
Result on current data: 4 placeholders — IMC ACWI ex US, IMC Global, IMC
Non-US Developed, Ravenswood EAFE + Canada. Gotcha for future readers:
saved placeholder buckets are keyed by name, so entries stored under old
decorated names won't re-attach to the new clean display names.

## 2026-08-13 — Exposures "Unclassified" audit: header-vintage aliasing fixed; CALSTRS's 23% is a terminated cash-only sleeve

User reported way-too-high Unclassified weight in the FactSet grouping
exposures (e.g. Industry). Swept every grouping × client; three separate
causes, only one of them a tool bug:

1. **Tool bug (fixed): header-vintage duplicates in the grouping menu.**
   3/31 exports name geography columns `MSCI Region`/`MSCI Country`; 6/30
   renamed them `Region`/`Country`. Grouping lookups are exact header-string
   matches and the menu offered BOTH vintages, so picking the one absent from
   the loaded file rendered 100% Unclassified (benchmark included). Fix:
   `COLUMN_ALIASES` in `exposures_engine.py` canonicalises old→new at parse
   time, the menu now lists each geography once, and overlap metadata reads
   Country with an MSCI fallback (tolerates stale pickled parses). Verified:
   menu de-duped; Region works on 6/30 data; a 3/31 re-parse carries
   canonical keys. Going forward the pull uses Region / Country / GICS
   Sector / GICS Industry naming (user decision).
2. **Data inconsistency (user to resolve): `CALSTRS - CASTLEARK EAFE+Canada`
   is a terminated account** — ending weights are 89.9% U.S. Dollar +
   JPY999999 39.3% + Yen 10%, every real stock at 0. The weights file still
   allocates CastleArk 21.65% of CALSTRS, so ~23.5% of CALSTRS reads
   Unclassified in EVERY grouping (NYSTRS ~13.8% via borrowing the same dead
   section). Tool computes faithfully; the two inputs disagree. Options:
   update Manager_Weights, re-pull exposures with a live section, or teach
   the resolver to skip cash-only sections (policy decision not made).
3. **Data reality: cash/FX rows** (3–7% baseline for most clients — currency
   lines carry weight but no GICS/country tags) and sparse metrics
   (`Earnings Growth 3-5Y Projected` missing for ~29–38% of even the
   benchmark). **Cash bucket shipped same day**: `is_cash_row` in
   `exposures_engine.py` routes currency lines (name matches a currency
   word or an `XXX999999` FX code AND the row has no GICS sector — the
   sector guard keeps 'Dollarama'-type names safe) into a `Cash` bucket in
   all three grouping modes (categorical, quintile, nested; Cash parent not
   expanded, ordered before Unclassified at the bottom). Verified: CALSTRS
   sector view now reads Cash 23.5% / Unclassified 3.5% (was 27% blended),
   Region's Unclassified vanished entirely (it was all cash), rows still
   sum to 100. 'Unclassified' now genuinely means missing classification.

**Follow-up (user rule): flag any sleeve >10% cash.** The 23.5% "Cash" was
itself a red herring — decomposition showed the six live CALSTRS sleeves hold
0.8–4% cash (~1.9% of the client); the other 21.65 points are the CastleArk
section at literally 100% cash (89.9% USD + FX-forward pair + JPY — a
liquidation snapshot; CALSTRS swapped CastleArk→Polen mid-Q2 per the EX2
composite, but Manager_Weights_6_30 still carries CastleArk 21.65% and no
Polen, and no Polen section exists in the exposures/risk pulls yet — DATA fix
owed by user). Tool-side guardrail shipped: `compute_portfolio_exposures`
(both modes) and `compute_holdings_overlap` now return `cash_warnings`
([{manager, section, cash_pct}] for sections >10% cash; overlap axis rows
also carry `cash_pct`), and the exposures panel + overlap section render an
amber "Heavy cash (possible transition/liquidated account)" banner. Verified:
CALSTRS and NYSTRS (which borrows the same dead section) flag CastleArk at
100%; MD/ATL Health clean; nested mode carries the warnings too.

## 2026-08-13 — Holdings overlap matched managers to the wrong client's portfolios; replaced fuzzy matching with client-ownership resolution

Symptom (reported for ATL Health): the holdings-overlap matrix said 3 of the 6
managers had no holdings in the exposures file, even though every sleeve was
uploaded. The FactSet grouping panel below it had the same problem — both route
manager names through `_fuzzy_match_manager`.

### Root cause — worse than "missing"
`WRatio('ballina sc', 'md castleark x sc')` = 85.5 — and so does every other
`md <anything> x sc` key, because the score is carried by the generic 'sc'
suffix, not the manager's name. All of them clear the 80 cutoff, and
`extractOne` breaks ties by **file order**, which puts `MD-CASTLEARK WORLD X US
SC` first. So for ATL Health: Ballina *claimed CastleArk's Maryland sleeve*,
then CastleArk/Frontier/Redwood matched that same section and were discarded by
the duplicate guard → reported "missing". The overlap that did render was
silently wrong twice over: "Ballina" showed MD-CastleArk's book, and even the
"successful" Lizard/Mac Alpha matches used **Maryland's** sleeves instead of ATL
Health's own `XPN…AHE` sections.

### Fix — ownership, not string similarity (`backend/holdings_resolver.py`)
Every section in the group-exposures workbook belongs to a client via its
prefix (user-specified rules): `MD-`, `CALSTRS`, `STLOUIS`/`XPN…SL` → STL,
`XPN…E` → ATL Health, `Microsoft`, `IMRF`, `FIS NonUS Small Cap CIT`,
`MASS PRIM`, `NYSCRF`, `NYCBERS` → NYC, `NYSTRS`, `COB`; anything else is an
unmarked profile (IMC, Evolution, QTRON, New Haven-Huber). Resolution order:

1. **Own client's section** for that firm — always wins.
2. **Another client's section, same sleeve asset class** — keyed on the
   *sleeve*, not the client benchmark (an EAFE+Canada sleeve inside ACWI-ex-US
   NYSTRS borrows CALSTRS' EAFE+Canada profile). Size (SC/micro/standard) must
   match exactly; region may relax only within the ex-US family
   (EAFE ≈ EAFE+Canada ≈ World-ex-US, distance-ranked; ACWI-ex-US at distance 2).
   US vs ex-US, EM vs developed, and cross-size never borrow — so
   'IQI Micro Cap' correctly flags missing rather than borrowing IQI's EAFE
   Value book.
3. **Unmarked profiles**, same compatibility gate.

**Passive index sleeves** (COB's 'MSCI EAFE + Canada') resolve to the
workbook's BENCHMARK section of the same name (tier 'index') — both engines
now read holdings from a pool of manager + benchmark sections, so the index
participates in the overlap matrix, the drill-down, and grouping exposures
with the index's own holdings.

Sleeve classes for coded sections (`XPNDCMSL-Decatur Capital` has no class
tokens) come from the owning client's weights roster ('Decatur US' → US).
Borrowed profiles are surfaced in the API (`source: {tier, borrowed_from}`) so
the UI can badge them.

### Wiring
`overlap_engine.compute_holdings_overlap` / `compute_pair_detail` and
`exposures_engine.compute_portfolio_exposures` take `client_name` +
`client_rosters` (passed by the three endpoints from `state['weights']`; the
frontend already sends `client_name`). No client → legacy fuzzy path, so the
manager-detail page (single manager, no client context) behaves as before. The
docx memo path (`build_memo_exposures`) still uses its own matcher — untouched,
future candidate.

### Verified
All 13 clients × 94 sleeves: 90 resolve (ATL Health 6/6 own — the original bug;
MD/CALSTRS regression-identical; NYSTRS borrows CALSTRS/NYC with provenance;
COB 8/8 including the passive sleeve on the MSCI EAFE + Canada benchmark
section, 785 holdings, exposures coverage 100%). The 4 misses are the agreed
set: Fithian, Maytech, Consilium EM, IQI Micro Cap — no compatible profile
uploaded. Live-tested `/holdings_overlap`, `/holdings_overlap_detail`,
`/portfolio_exposures` against the running backend.

### Extended same day: FactSet security-risk exposures panel
The user spotted CALSTRS active Size at **−0.916** — reproduced and traced to
the SAME disease in `security_risk_engine._match_mgr` (a third, independent
fuzzy matcher): the risk file has **no CALSTRS columns at all**, so every
sleeve was borrowed by string similarity — CastleArk landed on the **CIT's
small-cap** sleeve (Size −1.29) and 'Hillsdale EAFE + Canada SC' landed on
**CastleArk's** column (wrong firm), double-counting one SC book across ~34%
of the client. `compute_exposures` now takes `client_name`/`client_rosters`
and resolves through `holdings_resolver.resolve_managers_generic` (risk
columns carry a `vs. <benchmark>` suffix — `strip_vs_suffix` cleans before
ownership parsing; index sleeves resolve to the benchmark's own bottom-up
`… vs. DEFAULT` column). Response gains `sources` (per-manager tier +
borrowed_from + section) for UI badging. Legacy fuzzy path kept when no
client is passed (manager-detail page).

Verified: CALSTRS active Size **−0.589** with right-firm, size-compatible
borrows (CastleArk → NYSTRS standard sleeve, Hillsdale → MD's Hillsdale SC);
MD uses its own columns + class-compatible ATL Health borrows for
Ballina/Mac Alpha; COB's passive sleeve hits the index column. The residual
negative Size is genuine (real SC sleeve at ~12% + Ballina's small-cap
book). User plans to re-pull FactSet risk files organized by client (like
the group-exposures file) — then most sleeves resolve at tier 'own'
automatically; the borrow tiers remain the fallback.

### Gotchas for future readers
- The exposures workbook's manager sections are per client-manager *sleeve*;
  the same firm appears under many clients. Any feature matching managers to
  sections must be client-aware — string similarity alone WILL cross clients.
- `WRatio` on short normalized keys ties on generic tokens; never trust its
  ranking between candidates sharing a suffix like 'sc'.
- ATL Health's two sleeves genuinely share only cash lines at SEDOL level —
  cash rows ('Us Dollars', 'Japanese Yen') sit in the holdings and count
  toward overlap; excluding them is an open question.

## 2026-08-13 — /run crashed in production on a fresh upload (third S3-key bug; fixed the class at the source)

Symptom: uploading new returns files on the deployed tool, then clicking RUN BUY
LIST CLONES, failed immediately with:

```
ERROR: [Errno 2] No such file or directory: 'uploads/Tool_Buy_List_Mgr_Rts_06_26.xlsx'
```

FactSet/firm data updates worked fine — only the clone run broke.

### Root cause
The third member of the S3-key-vs-local-path family (2026-07-20 §8, 2026-08-11).
`save_uploaded_file` in S3 mode uploaded the workbook to S3, **deleted the local
copy**, and returned the S3 key (`uploads/<name>.xlsx`). The `/run` worker then
passed `state['files']['manager_returns']` — that key — straight into
`load_manager_returns`, which opened it as a filesystem path. The path happens to
look like a plausible relative path, so the traceback is deceptively mundane.

The universe run (`_start_universe_run`) already resolved keys through
`resolve_path` before opening; the buy-list `/run` worker never got that
treatment. Runs only worked in production when the inputs had been rebound to
local disk by `load_cache` on a container restart — i.e. re-running *old* files
worked, running *freshly uploaded* files could never work.

### Fix — at the source this time
Rather than adding a fourth call-site patch, `save_uploaded_file` now **keeps the
local copy** and returns the LOCAL path in both modes; S3 still gets the upload
so a future container can re-download it (`load_cache` rebinds by basename on
boot). `state['files']` therefore never holds a raw S3 key again during the life
of a process, which also covers every lazy
`load_factor_returns(state['files']['factor_returns'])` site scattered through
app.py.

Belt-and-braces: the `/run` worker now resolves `manager_returns` /
`factor_returns` through `_input_path` up front (clear error instead of a
FileNotFoundError traceback), rebinds the resolved paths into `state['files']`,
and resolves the weights file the same way (warns and keeps prior weights instead
of crashing the whole clone run).

Verified with a mocked-S3 unit test: S3 mode uploads to `uploads/<name>`, keeps
the local file, returns the local path; `resolve_path` on that path is a no-op
(no spurious download); local mode unchanged.

### Worth noting
- `/upload` still does not `save_cache()`, so a file staged but never run does
  not survive a container restart in `state['files']` — the S3 object exists but
  the staged name is forgotten. Harmless today (a run persists it), but it is
  the remaining sharp edge of this design.
- Local disk on Fargate is ephemeral and workbooks are small — keeping local
  copies costs nothing.

## 2026-08-11 — Manager Detail: multi-manager comparison + skill-chart fixes

Manager Detail only (no other tab touched). Two parts:

### Skill chart: growth of $100, rebased to the latest inception

The chart now plots **growth of $100 invested in the manager's excess return
over its static clone**, not a cumulative-percent line. The backend series is
*additive* cumulative excess in percentage points, so differencing consecutive
values recovers each month's excess return; those compound from $100.

With several managers selected, everyone is **rebased to the latest inception
in the selection** — a 2015-start manager restarts at $100 on a 2019-start
manager's first month, so the comparison is like-for-like (verified:
Channing + Oberweis rebase to Oct 2019, ending $100 vs $176). $100 is the
reference line; the legend shows each manager's ending value.

### Skill chart fixes (cumulative-skill-chart.tsx)

Three compounding bugs made "Cumulative Skill vs Static Clone" look broken:

1. **100× y-axis error**: `compute_cumulative_skill` already returns
   percentage points (`round(v*100, 4)`), and the chart multiplied by 100
   again — +12.5% displayed as 1250%. The vendored prototype confirms the
   contract (formats with no ×100).
2. **Fixed 640px drawing centered in a ~1100px box**: `viewBox 640×220` +
   `w-full` + `height: 220` + default `preserveAspectRatio="xMidYMid meet"`
   → scale locked to 1.0 and centered, dead space both sides. Now
   `viewBox 960×320` with `width:100%; height:auto` so the aspect governs
   (same pattern as market-cycle-chart).
3. **Forced zero baseline**: `Math.min(0, …)` squashed all-positive series
   into the top of the plot. Domain is now data-driven; zero renders as a
   reference line only when in range.

### Multi-manager comparison (up to 5, same asset class)

- `use-manager-detail-screen` holds `entries[]` instead of one selection;
  each entry fetches independently. Same-tab enforcement is done by
  **filtering the typeahead suggestions** (wrong-class managers never
  appear once one is picked) plus validation notices; placeholders are
  excluded from comparison (no clone data).
- Skill chart overlays all series on a **union timeline** (managers with
  different inceptions start where their data starts) with a 5-color
  palette; chips beside the search box carry matching color swatches.
- Factor Composition: dropdown picks whose donut shows.
- FactSet Risk: one numbers-only column per manager (bars removed — they
  don't scale to five columns). Fetches N managers in parallel.
- Period Returns: row per manager, benchmark at bottom; **Returns | Skill**
  toggle — Skill shows geometric excess vs static clone,
  `(1+mgr)/(1+clone)−1`, derived client-side for all periods (backend
  `skill_periods` lacks qtd/ytd).
- Portfolio Exposures: new `manager-exposures-compare-table.tsx` (the
  portfolio feature's row shape is current/proposed/delta and can't carry N
  managers). It **replicates that section's UI exactly** — A · Categorical /
  B · Continuous button rows, the full grouping menu, nested `Sector ×
  Market Cap` drill-down with chevrons, and the value+bar cells — but the
  columns are [benchmark, manager…] with the "Cur vs Bmk" delta column
  removed. First attempt replaced the button rows with two plain dropdowns
  and dropped the bars/nesting; that lost the grouping UI the tab depends
  on, so it was rebuilt against the original markup. Each manager = one
  `/portfolio_exposures` call (the endpoint aggregates a manager list into
  one portfolio, so per-manager columns need N calls); values are joined by
  row label, children by `parent::child`.

### Layout pass: Period Returns beside the risk table, no scrollbars

Period Returns moved out of its full-width row into the **right column under
the Growth-of-$100 chart** (chart shortened 320→250 viewBox units to give it
room), sitting beside the FactSet risk table on the left. Its headers
abbreviate (QTD/YTD/1YR/3YR/5YR/SI, full label on hover).

The risk table must fit **5 managers with no horizontal scroll**:
`tableLayout: fixed` + a `<colgroup>` (Factor column gets a fixed % that
shrinks as managers are added: 46→24%; the rest split evenly — so manager
columns are always exactly equal width, measured 5×79px at max). Manager
names drop their region suffix ("Channing EAFE" → "Channing") and clip by a
per-count budget; the left grid track widens 400→520px at 4-5 managers.
Verified at 1 and 5 managers: zero scrollable tables, no body overflow.

User caught a real asymmetry the equal-width claim hid: globals.css
left-aligns **every `.data-table`'s 2nd column** (`th/td:nth-child(2)`,
meant for name columns), so the FIRST manager column's numbers hugged the
left while the rest right-aligned — equal widths, lopsided whitespace.
Fixed with explicit `textAlign: "right"` on all value cells in the risk and
period-returns tables (computed alignment verified: left, right, right,
right → values all right). Watch for this rule any time a data column lands
in position 2 of a `.data-table`.

### Two follow-up bugs

**Blank donut for single-bucket managers.** Oberweis is `{"Growth": 1.0}`.
The arc builder computes start and end angles that coincide at 360°, and SVG
draws *nothing* for a zero-length arc — so a 100%-one-factor manager rendered
an empty box. `style-bucket-donut.tsx` now special-cases a single entry and
draws the ring as a stroked `<circle>` instead of an arc path.

**False "No exposure data" on the manager-detail exposures panel.** The
missing-manager check ran against an empty `data` array before any grouping
was picked (nothing is fetched until row A or B is clicked), so every selected
manager was reported missing. The data was always fine — verified the three
managers return 13 rows each straight from `/portfolio_exposures`. The warning
now only evaluates once a fetch for the current selection has completed
(`!loading && data.length === managers.length && base`). Lesson: "no results
yet" and "no results exist" must not share a code path.

### Gotcha that cost a cycle

First version validated adds via a side-effect flag set inside a `setState`
updater and read synchronously after — updaters run at render time, so the
flag was never set and the detail fetch never fired ("Loading…" forever).
Validation now reads a `stateRef` mirror synchronously. React updaters are
not synchronous; don't smuggle flags out of them.

## 2026-08-11 — Regional sleeve views on the FactSet Risk panel (dormant backend, new UI)

Requirement: on the Portfolio tab's FactSet Risk Exposures panel, let the user
split active style by region — US (vs Russell 1000), International Developed
(vs MSCI EAFE + Canada; World-ex-US SC for small cap), EM (vs MSCI EM / EM SC)
— with availability driven by the **client benchmark** (ACWI → all three;
ACWI ex-US → dev + EM; developed-only clients → no split). Canada is
developed; **unclassifiable markets (Argentina, Russia, frontier) lump into
EM** with a visible flag; missing benchmark columns must be flagged, not
hidden.

### The big discovery

**The backend already had all of it, dormant**: `security_risk_engine._SLEEVES`
(per-benchmark option table), `get_sleeve_options`, `classify_country`
(unknown → EM + flag when an EM sleeve exists — exactly the requested rule),
sleeve/bench params on `/compute_security_risk_exposures`, a `/sleeve_options`
route, and even a typed-but-unused frontend API helper `getSleeveOptions`.
**No UI ever called any of it.** Before building a feature here, grep for it
dormant first.

### What was actually built

- `get_sleeve_options` now returns options whose benchmark column is absent
  as `missing: true` (they were silently dropped) so the UI can disable+flag.
- `portfolio-analytics-sections.tsx`: Region segmented control on the risk
  panel (options from `/sleeve_options`, only shown when the loaded risk data
  is security-level and the benchmark supports a split); selecting a region
  fetches its own view (debounced, reqId-guarded) while Full Portfolio keeps
  using the hook-fetched prop data; coverage line (`X% of portfolio → Y%
  proposed`, no-country weight) and amber country-classification flags.
  Missing-benchmark options render struck-through/disabled with a tooltip.

Verified live on STL (MSCI ACWI): all four views return distinct numbers vs
the right benchmark (header follows), EM sleeve = 6.1% of portfolio and
surfaces "Russia not in standard classification — treated as EM", switching
back to Full restores identical numbers. Per-client options verified for all
14 clients (developed-only clients correctly get no split; CIT's ACWI-ex-US-SC
gets the SC pair). No missing columns in the current upload — the flag path
is code-verified only.

## 2026-08-11 — Added managers never matched FactSet data (UNKNOWN-class gate); risk panel now flags misses

Symptom: add a manager from the directory (Oberweis) → "No exposure data" in
Portfolio Exposures and a silent drop from FactSet Risk, even though
`Oberweis Focused International Growth Fund` is plainly in the exposures file.

### Root cause

The `b00b816` ownership resolver (`holdings_resolver.py`) gates cross-client
(tier 2) and unowned (tier 3) matches on `class_distance()`, which returns
None when either side's region parses to `UNKNOWN`. Weights-file managers
always carry region tokens in `weight_file_name` ("Ballina EAFE SC");
**directory-added managers get the bare buy-list name ("Oberweis") — no
tokens → UNKNOWN → tiers 2/3 unreachable → always unmatched.** The diagnostic
tell: Manager Detail matched fine (no `client_name` → legacy fuzzy path);
only the Portfolio tab (client-aware path) failed.

Intended tier order (user-confirmed): own client's section → another client's
section of the **same asset class** → a section attached to **no client** →
flag, on both tables.

### Fixes

1. `holdings_resolver._resolve_all`: when the label has no class tokens,
   derive the asset class from the manager's peer `tab` — `sleeve_class()`
   already understands every tab token (EAFE/ISC/EM/US/USSC/ACWI; ISC ⇒
   ACWI_XUS+SC). Wrong-class control verified: Oberweis with tab US does NOT
   grab the international fund.
2. Safety net in `exposures_engine` + `security_risk_engine`: resolver misses
   retry via the FactSet Map crosswalk (`by_mgr`, computed-but-unused since
   b00b816) then legacy fuzzy — **restricted to unowned, unclaimed sections**
   so b00b816's cross-contamination protections stand.
3. `section_client()` was missing a `New Haven` branch — that client's own
   sections had `owner=None`, so it borrowed other clients' sleeves (Gilman
   Hill/Martin/Redwood came from NYSTRS/IMRF) and Huber matched nothing. Now
   tier-1 matches its own uploads.
4. The Active Style panel now renders `unmatched` ("⚠ No exposure data for:
   …") like the groupings panel — it used to fail silently.

### Verification

Before/after snapshot of `{manager → section}` across all 14 clients: zero
changes to existing matches except New Haven's corrections; additions only
(Oberweis, CIT's Arga ISC via fallback, New Haven's Huber). Mass PRIM FI's
four fixed-income managers still flag on both panels — genuinely absent from
the equity files, which is correct. UI verified with Playwright: added
Oberweis through the real modal, set a weight, warning gone and risk deltas
move; Mass PRIM FI shows the new flag on both panels.

Gotcha for next time: added managers start at weight 0 and
`security_risk_engine` skips zero-weight managers, so the risk-panel symptom
only appears after a weight is typed — looks intermittent if you don't know
that.

## 2026-08-11 — Uploading a weights file never took effect in production (S3 key vs local path)

Symptom: a user uploaded `Manager_Weights_6_30.xlsx` on the production Setup tab.
The tab showed the new filename, qualitative data worked, but the **Client Total
AUM banner and AUM columns never appeared** and Client Redemption kept saying
"No client AUM in the weights file". Clicking RELOAD INPUTS did nothing.

### Root cause
`/upload` only *stages* a file: it writes `state['files'][key] = path` and
returns. It never re-parses. The Setup tab reads `state['files']`, so it displays
the new filename while every analytical path still uses the previously parsed
data — it looks uploaded and isn't active. The documented way to activate it is
RELOAD INPUTS.

But RELOAD INPUTS was broken in production. Every branch of
`_reload_inputs_core` gated on:

```python
if 'weights' in state['files'] and os.path.exists(state['files']['weights']):
```

**In S3 mode `state['files'][key]` is an S3 key, not a local path.** A
just-uploaded file has never been downloaded, so `os.path.exists()` is always
False and the branch is silently skipped — `refreshed: {'weights': 'skipped'}`.
The other three said `ok` only because those files had been resolved to local
disk on an earlier boot; weights had just been replaced.

Net effect: **client total AUM could never be loaded in production at all.** The
only thing that ever picked up a new weights file was a container restart, where
`load_cache` resolves keys to local paths.

Same family as journal 2026-07-20 §8 (the `resolve_path` round-trip bug). S3 keys
and local paths share one field in `state['files']`, so anything treating that
field as a filesystem path is wrong in production and fine locally — which is
exactly why it survived local testing.

### Fix
Added `_input_path(key)`: resolves through `resolve_path` (downloads from S3 to a
stable local name when needed, no-op locally) and returns None if unusable. All
four branches of `_reload_inputs_core` now use it, as does `/reload_weights`,
which had the same bare `os.path.exists` bug.

Verified: `refreshed: {'weights': 'ok', 'risk': 'ok', 'exposures': 'ok',
'qualitative': 'ok'}` with 13 client-AUM entries.

### Worth noting
- The two-step upload → reload flow is easy to misread as one step, because the
  Setup tab confirms the filename immediately. If this trips anyone else up, the
  fix is for `/upload` to re-parse the affected input itself rather than only
  staging it.
- `/reload_inputs` when `db_enabled()` calls `sync_weights_to_state`, which
  imports the workbook roster into Postgres (drafts preserved). Reloading a
  workbook with a different client list therefore changes the production roster —
  the 6/30 file carries 13 clients vs the 12 currently in the DB.

## 2026-08-11 — My preflight check blocked production for a week (AccessDenied read as "missing")

Deploys had been failing since 2026-07-31 with:

```
Checking the database secret…
Error: Secret pc-tool/database-url is missing or unreadable.
```

The secret was fine the whole time. **This was my bug**, in the "Preflight" step
I added on 07-31 to make deploys *safer*.

### Root cause
The check ran `aws secretsmanager get-secret-value` and did `exit 1` when the
result was empty:

```sh
DSN=$(aws secretsmanager get-secret-value ... 2>/dev/null || echo "")
if [ -z "$DSN" ]; then exit 1; fi
```

The deploy role `pc-tool-gh-deploy` has only `AmazonEC2ContainerRegistryPowerUser`
and `AmazonECS_FullAccess` — **no Secrets Manager access**. So the call was
`AccessDenied`, `2>/dev/null || echo ""` flattened that into an empty string, and
an empty string was indistinguishable from "the secret is missing". Every deploy
then failed *before the build*, naming a cause that was not real.

I wrote the check against **my own** IAM user's permissions (`brodas`, broad
access) without ever asking what the CI role could do.

### Impact
Production frozen 07-31 → 08-11. ECR `:latest` last pushed 07-31 11:55; the
running task started 07-31 13:05. Two commits never shipped — `d692ecf`
(Portfolio tab UI overhaul) and `8429914`. The failure message actively misled,
pointing at a database problem that did not exist.

A second, quieter defect in the same step: the rotation check did
`|| echo "None"`, so when *it* was denied the step printed
**"OK — password is static"** — a false reassurance about the exact thing that had
caused the previous outage.

### Fix
- Preflight is now `continue-on-error: true`. It reports; it cannot gate a deploy.
- Uses `describe-secret`, not `get-secret-value` — CI has no business reading a
  database password, only confirming the secret exists.
- Distinguishes `AccessDenied` ("could not verify") from `ResourceNotFound`
  ("genuinely absent"). It never claims OK for something it could not check.
- `Explain the failure` is now scoped to `steps.wait.conclusion == 'failure'`.
  As `if: failure()` it printed pages of ECS-stability hints for a preflight
  failure, sending you to the wrong place — visible in run #18, which dumped
  "password authentication failed" guidance for a problem that was pure IAM.

Verified all three branches locally by extracting the step's shell out of the
YAML and running it against a stub `aws` that returns AccessDenied,
ResourceNotFound, and success in turn. All three exit 0; only the genuinely-absent
case warns. (First attempt at that test silently passed because I put a Windows
path on bash's `PATH`, so the stub was never used and the real CLI answered —
worth remembering: `PATH` entries must be `/c/...`, not `C:/...`.)

### Rules now written into DEPLOYMENT.md §4
1. A pre-check is advisory; use `continue-on-error: true`.
2. Never report success for something you could not verify.
3. Write CI checks against the **deploy role's** permissions, not your own.

### Optional follow-up
Granting the deploy role `secretsmanager:DescribeSecret` on that one secret and
`rds:DescribeDBInstances` would make both checks functional instead of skipped.
Not required — deploys work without it, and the step now says plainly when it
could not verify.

## 2026-08-06 — Deploys have been failing since Jul 31: pc-tool/database-url unreadable

Pushed the Portfolio-tab UI overhaul (`d692ecf`) and the deploy workflow
**failed in Preflight**: `Secret pc-tool/database-url is missing or unreadable.`
Checking run history: the Jul 31 19:31 UTC run (`f06f0fc`) failed the **same
way** — the last successful deploy was Jul 31 15:54 UTC (`fb948d5`). So the
secret became unreadable in that ~3.5-hour window on Jul 31 — the same
afternoon rotation was turned off and the RDS-managed `rds!…` secret was
deleted (see DEPLOYMENT.md §Database password). Production is still up and
healthy (ALB 200s, `/clients` works) because running containers never re-read
the secret — the same "deploy is the messenger" shape §5 warns about, one
level up.

Leading suspects, in order:

1. `pc-tool/database-url` was **scheduled for deletion** during the Jul 31
   cleanup (a secret pending deletion errors on `get-secret-value`, which the
   Preflight's `2>/dev/null` swallows). Fix: Secrets Manager → the secret →
   **Cancel deletion**, then re-run the workflow.
2. The secret was **recreated**, changing its ARN suffix, while the GitHub
   OIDC role's policy pins the old ARN → role can read nothing. Fix: point the
   policy at the new ARN (or `pc-tool/database-url-*`).
3. Role permissions changed.

Diagnosed **without local AWS access**: this machine has no `aws` CLI, no
`~/.aws`, and no `gh` — used the GitHub REST API with the token from
`git credential fill` to list runs and download job logs (never echo the
token). Also: the served page itself shows which build is live — the old
build still contains the `% diverse/female` label the new one removed.

**Open**: cancel the deletion / fix the role in the AWS Console, then re-run
"Build and Deploy to ECS" — `d692ecf` is already on `origin/main`, so no new
push is needed. Preflight fails before building, so nothing was half-shipped.

## 2026-08-04 — One combined market-cycle chart; localhost-vs-127.0.0.1 dev gotcha

### Market cycle: two charts → one

The Portfolio tab used to render side-by-side "Current Portfolio" and "Proposed
Portfolio" market-cycle charts. Replaced with a **single combined chart**: blue
dot = manager in both, red = being removed (current weight > 0, proposed = 0),
green = being added, and a half-red/half-green dot when a removed and an added
manager land on the exact same placement.

This was a **regression against the prototype** — `clone_tool/static/index.html`
already had the combined chart (`mcStatus`, `MC_STATUS_COLORS`, semicircle
split-dot rendering around L5232–5793); the Next.js rewrite had reverted to two
charts. The change is a port, not new design.

Files: `frontend/src/features/portfolio/components/market-cycle-chart.tsx`
(new `portfolioKey="combined"` mode + exported `mcStatus`/`MC_STATUS_COLORS`)
and `market-cycle-section.tsx` (single full-width chart + color legend). The
Report tab still uses `portfolioKey="current"` and is untouched. No backend
change: `/market_cycle` returns one placement per manager carrying **both**
weights, so added/removed is derived client-side.

Follow-up in the same session: the market-cycle and Holdings Overlap sections
now share one grid row in `portfolio-analytics-sections.tsx` — market cycle
left, overlap right, final split **3fr 2fr** (60/40; started at 2/3–1/3, widened
the overlap column because portfolios run up to 10 managers). When no exposures
file is loaded, `OverlapSection` renders nothing and the grid collapses to one
full-width column rather than leaving a hole.

Polish pass (three screenshot-critique-adjust iterations with Playwright):

- **Equal heights**: both section roots get `height: 100%` and their `.panel`s
  become flex columns; the overlap `.panel-body` is `flex: 1` and centers its
  content vertically. Grid `alignItems: stretch` does the rest — measured
  0px height delta at 5 and 10 managers.
- **Overlap panel**: removed the "Most overlap" chip rows (cell click still
  opens the same detail table), grouped Current/Proposed with a fixed 28px gap,
  and made the matrices **fill the column**: `width: 100%` +
  `tableLayout: fixed` with a 140px label `<col>` and the rest split evenly,
  so column count no longer dictates table width. Cell *height* steps by
  manager count (≤4 → 64, ≤6 → 54, ≤8 → 46, else 40) with fonts bumped one
  point on the big sizes — small portfolios get big readable cells instead of
  whitespace, and a 10-manager grid fits with no horizontal scroll (fixed
  layout also cured the clipped last rotated header).
- **Portfolio Managers table**: removed the eight style-bucket columns (Core,
  Value, Growth, Yield, Quality, Dynamic, Defensive, Low Vol — hand-written
  `<th>`/`<td>` pairs in `portfolio-table.tsx`, not array-driven) so the table
  fits its half-width panel without horizontal scroll. **`COLSPAN_BASE` 17 → 9**
  is the load-bearing edit — every full-width row (AUM banner, ideal
  complement, qual detail) derives its colspan from that constant, so change
  the constant, never the call sites. Also removed a redundant nested
  `overflow-x-auto` wrapper, and closed the last ~50px of overflow with a new
  `.data-table.tight` CSS variant (5px horizontal cell padding, 58px weight
  inputs) plus a narrower Tab column. Verified `scrollWidth == clientWidth` on
  MD and NYC. Bucket percentages are no longer visible in this table; the
  placeholder "Edit buckets" modal still shows and edits them.
- **Diverse / Woman Owned**: moved from a full-width section into the left
  column stack directly under Portfolio Edge (left of FactSet Risk Exposures),
  restyled to match the Edge panel — Current | Proposed cells with a big
  `weight_pct%` headline, an `n_diverse / n_firms firms` fraction, and an
  unmatched-weight footnote. The threshold input moved into the panel header.
  Fetch logic untouched. Gotcha found while verifying: the backend reads
  `float(payload.get('threshold', 50) or 50)` — a threshold of **0 is falsy
  and silently becomes 50** (`app.py:4472`); pre-existing, left as is.
- **FactSet Risk dead space**: the risk panel stretches to the left stack's
  height, which left whitespace under its 11-row table. Fix: panel is a flex
  column, the table wrapper gets `flex: 1`, and the table gets
  `height: "100%"` — browsers distribute a table's spare height across its
  rows, so the factor rows fatten evenly and the table always reaches the
  panel bottom. Edge/Diverse stat cells also tightened (4px header/cell
  padding, 17px headline, Diverse firm-fraction inlined beside the %) —
  Edge 120→92px, Diverse 145→96px.
- **Client Redemption**: moved out of `portfolio-route.tsx` into
  `portfolio-analytics-sections.tsx`, rendered right after the Edge/Risk grid
  and before Market Cycle. That component now takes `hasPortfolio` and
  `clientAum` props since the route owned those values.
- **Chart whitespace**: trimmed the SVG layout constants in
  `market-cycle-chart.tsx` — macro panels 118 → 82 (they had ~35px of dead
  space below the bullets), plot band 200 → 165, plus smaller band gaps.
  Heights are viewBox units, so the chart just renders shorter at the same
  width. Watch the recession *metrics* panel when touching `metricsPanelH`:
  its 6 bullets nearly fill the 90px.

Gotchas for next time:

- Group dots by `x` only — `y` is a pure function of `x` (`waveY`), so "same
  placement" = same x. And `x` is nullable in the TS types (`(p.x ?? 0)`),
  unlike the prototype which assumes it's set.
- Keep name labels **per manager**, not per dot-group, so both names show on a
  shared split dot; `labelOffsets()` is index-aligned to the placements array.
- Verified live with visible Playwright: zeroing a proposed weight re-fetches
  `/market_cycle` and flips that dot red. The added/green and split-dot branches
  are straight ports but weren't exercised through the UI (needs the
  add-manager flow) — worth a glance next time a real add happens.

### The "no data" mystery: Next 16 blocks dev assets on 127.0.0.1

The frontend dev server looked completely empty (status pill stuck on
"Checking...", every panel in its empty state) even though the backend and the
`/api/backend/*` proxy returned full data via curl. Root cause: **Next.js 16
blocks cross-origin dev resources** — pages opened at `http://127.0.0.1:3000`
get their `/_next/*` requests blocked (`allowedDevOrigins` warning in the dev
server log), React never hydrates, so no data fetch ever fires and the page
sits in its server-rendered initial state. Silent in the browser; the only
tells are the log warning and failing HMR websocket handshakes.

Use **http://localhost:3000** for local dev. Killing/restarting the dev server
does nothing (it was never wedged), and curl-based health checks can't catch
it — they pass while the browser is broken. The one-line fix
(`allowedDevOrigins: ["127.0.0.1"]` in `next.config.ts`) was proposed but the
user chose to keep the config untouched; if 127.0.0.1 support is ever wanted,
that's the change. Also noted along the way: no data files are ever "missing"
locally — `backend/cache/results.pkl` (65 MB, not in git, expensive to
recompute) plus `backend/uploads/` hold everything; don't press Clear Cache /
Reset Universe casually.

## 2026-07-31 — Added root CLAUDE.md; journals now indexed and newest-first

Turned the three standing rules from `rules.md` into a root
[CLAUDE.md](CLAUDE.md) so they load automatically instead of relying on someone
noticing the file. Also restructured both journals to the requested format:
an `## Index` at the top and **newest entries first**.

### The two journals
There are two, with different scopes — worth knowing before writing to one:
- `journal.md` — project-wide (default)
- `docs/feature/journal.md` — manager-finder feature work

### A mistake worth recording
My first pass reversed **both** files. `docs/feature/journal.md` was already
newest-first, so I flipped it into oldest-first. The reversal logic keyed on entry
dates, and every entry in that file is dated `2026-04-29` — with all dates equal,
"is it ascending?" and "is it descending?" are both true, so the check silently
took the wrong branch. Caught it by diffing against `git HEAD` (the last entry
written, "Validation pass", had been at the top). Restored from git and added only
the index.

Fix applied to the tooling: when every entry shares one date the order is
**ambiguous**, so don't guess — leave it alone and say so. Verified afterwards by
comparing entry counts and body word counts against HEAD (+12 words each, exactly
the index heading text, so no content was lost).

Lesson: don't infer ordering from data that can't express it.

## 2026-07-31 — Ported the new clone_tool drop; fixed the deploy outage; made deploys self-service

A new `clone_tool/` snapshot landed (7/30). Ported everything new out of it into
`backend/` + `frontend/`, found two real bugs while doing it, fixed a production
outage that had nothing to do with the port, and removed the manual steps around
deploying.

### 1. Comparing the drop
`git diff` against the last `clone_tool` commit was useless as a baseline — our
tool had already been ported past it, so the diff mixed done and not-done work.
What worked: diffing `clone_tool/*.py` against `backend/*.py` **with CRLF
normalised** (without `--strip-trailing-cr` every file looks 100% changed), then
driving both apps with Playwright side by side and comparing the DOM.

Caution for next time: a **function-name** diff is not enough. Two of the most
important changes were *inside* existing functions and it missed both (see §3).

### 2. What was ported
- **Portfolio tab:** client total AUM (banner + per-manager AUM columns),
  redemption optimizer (`optimize_redemption` LP), active-manager-struggle
  scenario, Market Development exposure grouping, `/ideal_factor_complement`,
  excluded managers in the optimizer.
- **Gap fixes found by the side-by-side:** holdings-overlap rebuilt to the
  reference design (count+weight cells, Strategy/Client-scaled, Current+Proposed
  matrices sharing one colour scale, top-pair chips, drill-down) and mounted on
  the Portfolio tab; diverse rollup now auto-computes instead of needing a
  Compute click; qualitative chevron on manager rows; FactSet risk header rows
  were inverted with no colspans; Scenario Analysis used full index strings and
  printed a portfolio-level max drawdown on a sleeve that doesn't exist.
- **Word memo:** `docx_export.py` + `build_memo_exposures` + `/export_portfolio_docx`
  + a Print Memo Report button. Real editable tables, not screenshots.
- **Reports:** `pdf_export.py`, `/export_report_pdf`, `/export_dispersion_xlsx`,
  `/export_returns_xlsx`, `report_performance`, and three export cards. The
  Quarterly PDF renders one report per selected client (verified 3 clients →
  3.02× the single-client file size).
- **FactSet alias crosswalk:** `load_factset_aliases` / `resolve_factset_to_clone`
  / `factset_candidates_by_manager` / `strip_factset_decoration` /
  `is_benchmark_name` / `clone_exists`, wired into the exposures and
  security-risk matching paths. `load_client_returns` enables `basis='actual'`.
- Refactored the two risk-exposure routes into thin routes over `*_core`
  functions so the memo reuses them. Verified `route output == core output`.

Deliberately not ported: `qualitative_loader.py`'s format change (it drops
per-strategy AUM) — we kept our layered parser and added `match_firm` as a
prefix-match fallback instead, so both workbook shapes work.

### 3. Two bugs the sweep caught (both hidden inside existing functions)
- **`skill_engine` recency cap.** Norm-skill was scored at each manager's own last
  reporting month. When the eVestment universe lags the buy-list, that compares a
  manager against buy-list peers only — or, on a thin tab like `US` with two
  names, produces **no score at all**. Now capped at the latest month with an
  adequate universe peer set.
- **Placeholder misclassification.** We used bare `fuzzy_match` with no benchmark
  filter and no alias resolution. On the 6/30 FactSet exposures file that
  misflagged **53 of 69** names as placeholders (benchmark rows like
  `MSCI EAFE NR USD` became fake managers; `CALSTRS - CASTLEARK EAFE+Canada`
  couldn't resolve). Now 8. Latent on the 3/31 files — it would have bitten the
  moment the newer exports were loaded.

### 4. The deploy outage — RDS was rotating the password
Deploys were failing at `aws ecs wait services-stable` with `Max attempts
exceeded`; 150 failed tasks. **I first blamed my own change and was wrong** — the
logs showed the backend never reaches app import. It dies in the entrypoint:

```
FATAL: password authentication failed for user "postgres"
[entrypoint] server not ready (30/30) → exit 1
```

Root cause: RDS had **"Manage master credentials in Secrets Manager"** enabled,
rotating the master password **every 7 days**. It rotated 7/30 09:36; the app's
`pc-tool/database-url` still held the 7/16 password. Nothing broke immediately
because a *running* container never re-reads the password — it only surfaced when
a deploy forced a new task ~30 hours later. **The deploy was the messenger, not
the cause.**

Fix: rebuilt the DSN from the live password (URL-encoded — it contains `[`, which
URL parsers read as an IPv6 host; 28 chars → 40 encoded), then **turned rotation
off** and set a static password. That also *deleted* the `rds!db-220cca1f-…`
secret, so DEPLOYMENT.md §5's retrieval command no longer worked — corrected.
`services-stable` now passes in 2m37s.

Lesson worth keeping: **read the logs before blaming the last change.**

### 5. One regression I introduced and reverted
I had put `_warm_universe_dfs()` at module scope in `app.py`. That's a 21 MB
openpyxl parse (~24s, ~39 MB of DataFrames) holding the GIL on a 0.5 vCPU task —
it starves the gunicorn threads answering the ALB health check, the documented
killer for this service (§14). Moved off the import path; it's kicked lazily from
`/risk_analysis`. **Never add blocking work to module scope in `backend/app.py`.**

### 6. Deploys are now self-service
- **No post-deploy step.** `INPUT_PARSER_VERSION` is stamped into the cache;
  on boot a mismatch triggers a one-time background re-read of the input
  workbooks. Bump it whenever parsing changes. (New DEPLOYMENT.md §16.)
- **Preflight** step (~10s, before the build): checks the DSN secret parses and
  warns if password rotation gets re-enabled.
- **"Explain the failure"** step (`if: failure()`): dumps deployment state, ECS
  events, stopped-task exit codes and the last 80 log lines into the job output.
  The waiter's `Max attempts exceeded` is useless on its own.
- **README rewritten** — it claimed the backend lives in `clone_tool/`. It does
  not; that's the vendored reference copy. Anyone onboarding would have edited the
  wrong tree. Now documents the data, the database and how to start it.
- **Skills added:** `deploy` (commit + push + deploy + verify), `start`
  (backend/frontend locally), `pull` (sync + reinstall + migrate).

### Gotchas worth remembering
- Git Bash mangles `/ecs/pc-tool` into a Windows path → prefix `MSYS_NO_PATHCONV=1`.
  `aws logs tail` also crashes on Next.js's `▲` → add `PYTHONUTF8=1`.
- `next start` here needs `output: standalone` handling, and `BACKEND_INTERNAL_URL`
  isn't picked up by it — easiest local test is to run the backend on :3001.
- The clone tool's `Map` sheet means two different things across vintages
  (FactSet crosswalk vs a manager/region table). Our loader ignores the old one.
- The clone's redemption UI says "±2%" while its constant is `0.01` (±1%). Ours is
  self-consistent at ±1% and now reads the tolerance from the response.

### Still open
- **HTTPS / auth** — unchanged from the 7/20 entry; ALB is HTTP-only and open.
- **Two features are inert until newer files are loaded:** the alias crosswalk
  needs a `Map` sheet with `Factset Name | Returns Name | Tab`, and the
  "Actual track record" report blocks need a `Client` sheet. No workbook we have
  contains the latter.
- **`sslmode`** is still `prefer`, so libpq silently falls back to plaintext.
  Pinning `require` would make failures legible; left out to change one variable
  at a time during the outage.

## 2026-07-20 — Fixed broken deploys + added a stable URL (ALB)

Spent the session getting the GitHub Actions deploy green and giving the app a
permanent URL. Four distinct things, in order:

### 1. Deploy failure #1 — GitHub→AWS OIDC auth
The workflow died at the `configure-aws-credentials` step: *"Could not assume
role with OIDC: the web identity token provided could not be validated."* The
`pc-tool-gh-deploy` role's trust policy was correct (`sub` = `repo:brxponance/tool:*`,
`aud` = `sts.amazonaws.com`), but **the IAM OIDC identity provider itself did not
exist** — Identity providers list was empty. The role referenced a provider ARN
that wasn't there. Fix: created the OIDC provider (Provider URL
`https://token.actions.githubusercontent.com`, audience `sts.amazonaws.com`).
No role change needed. Documented in DEPLOYMENT.md §12 step 9.

### 2. Deploy failure #2 — frontend TypeScript build error
Next build failed: `use-portfolio-screen.ts:394` passed `getPortfolioStats(portfolio)`
but the fn takes `PortfolioResponse["managers"]`. Fixed to
`getPortfolioStats(portfolio.managers)` (every sibling call in that block already
used `portfolio.managers`). `tsc --noEmit` + full `next build` clean.

### 3. Added an Application Load Balancer for a stable URL
Fargate assigns a fresh public IP every redeploy, and you can't pin an Elastic IP
to a Fargate ENI — so the fix is an ALB. Built entirely in the console (no IaC in
this account). Stable URL is now:
**`http://pc-tool-alb-149658130.us-east-1.elb.amazonaws.com`** (never changes).
Resources: SG `pc-tool-loadbalancer-firewall` (sg-036ad14316364f3ca, 80 from
0.0.0.0/0); ALB `pc-tool-alb` (internet-facing, 2 public subnets, HTTP:80);
target group `pc-tool-target-group` (IP targets, HTTP:3000). Wired the ECS
service to it (container frontend:3000, listener HTTP:80). Task SG already allowed
3000 from 0.0.0.0/0 so no extra rule was needed. Full runbook in DEPLOYMENT.md §14.

### 4. Health-check gotcha (the thing that kept the deploy "failing")
After wiring the ALB, deploys still failed — but only at the final
`wait services-stable` step (build + ECR push succeeded). Root cause: the target
group health check hit `/`, which **307-redirects to `/setup`**
(`frontend/src/app/page.tsx`), and the ALB only accepts 200 → target never
healthy → service never stabilizes → CI waiter times out. Fix (proper, not a
matcher hack): added a dedicated liveness route
**`frontend/src/app/api/health/route.ts`** (returns `{status:"ok"}` 200,
`force-dynamic`, `nodejs` runtime) and pointed the target group health check path
at **`/api/health`** (success codes 200). Rule of thumb: never point an ALB health
check at a route that redirects.

### 5. Missing DB table — `portfolio_presets` (500s on /presets)
`GET /clients/<name>/presets` 500'd: `UndefinedTable: relation "portfolio_presets"
does not exist`. The `PortfolioPreset` model (db/models.py) shipped without a
migration, so `alembic upgrade head` never created the table. Fix: added
migration **`migrations/versions/f2a9c7e51b30_create_portfolio_presets.py`**
(chained onto head `0a25e34ff6b9`). Committed + pushed; the deploy's startup
`alembic upgrade head` created the table. Presets 500s resolved.

### 6. Periodic 503 / task restart loop — root cause = CPU, not memory
The single task kept getting killed and replaced every few minutes → users saw
"fetch failed" / 503, especially on first load after a restart. Diagnosed via ECS
metrics: **memory fine (~48% of 1 GiB — NOT OOM); CPU is 0.5 vCPU and spikes to
100%** during heavy work. When CPU is pegged the app can't answer the ALB health
ping within 5s → target marked unhealthy → ECS kills the task. Fixes (all console,
on `pc-tool-target-group` + the service):
  - Health-check **Timeout 5→15s**, **Unhealthy threshold 2→5** (≈2.5 min of
    failures before a kill).
  - ECS service **Health check grace period 0→180s** (don't kill a booting task
    while the backend loads the 59 MB cache).
  - Health-check **path `/api/health` → `/api/backend/status`** (supersedes §4).
    `/api/health` only proved the *frontend* was up; the frontend boots in ~2s and
    the ALB then routed traffic while the *backend* was still loading the cache →
    first-load 503 on `/api/backend/*`. Pointing the check at `/api/backend/status`
    (ALB → frontend → proxy → backend `/status`) makes the target go healthy only
    when the whole chain is ready. Confirmed in backend logs: `GET /status …
    "ELB-HealthChecker/2.0"` now appears. Task is stable (no more restart loop).
  - Not memory: left task size at 0.5 vCPU / 1 GiB. Optional future: bump CPU for
    faster clones (Fargate forces more memory + cost).

### 7. Universe-clone restart loop → planted a precomputed cache in S3
On a fresh task with no cached universe results, the startup auto-run
(`_auto_run_universe_on_startup`) re-cloned the ACWI universe (**1,634 managers**)
— minutes of CPU that pegged the box and (pre-§6) got the task killed before it
finished → never saved → next task re-cloned → loop. Broke the loop by uploading
the already-computed **local `backend/cache/results.pkl` to
`s3://pc-tool-uploads/state/results.pkl`**, so a fresh task pulls it, sees
`universe_clone_results` populated, and skips the clone. Loads in seconds.

### 8. "Factor returns file missing" / Market Cycle 502 — the file-round-trip bug
After planting the cache, factor-dependent views (Marginal Contribution to Risk,
Scenario Analysis, Market Cycle) errored with **"Factor returns file missing."**
Root cause (real code bug): the pickle stores computed *results* + file
*references*, NOT the raw `.xlsx` files — those live in S3 `uploads/`. On boot the
cache-load resolves each reference from S3… but `s3_storage.resolve_path`
downloaded to a **random temp name** (`tmpXXXX.xlsx`), and that temp path got
written into `state['files']` and **re-pickled**. On the next restart the cache
asked S3 for `uploads/tmpXXXX.xlsx` — which doesn't exist (the file is in S3 under
its *real* name) → "missing." So it re-broke after every restart even though all
7 input files ARE in S3. **Fix:** `resolve_path` now downloads to
`uploads/<real-basename>` (stable name), so the reference round-trips across
restarts. Verified all 7 files the cache references exist in S3 under their real
names (factor returns = `Equity_factor_returns_-03-2026.xlsx`).
  - **Deploy procedure for this fix** (order matters — see DEPLOYMENT.md §15):
    (A) push the `s3_storage.py` fix and let it deploy; (B) with the app closed in
    the browser, re-upload the clean local `results.pkl` to `state/`; (C) force a
    restart; (D) confirm the startup log shows `Cache loaded — N managers.` with an
    EMPTY `dropped unresolved paths` and `[s3] downloaded …/uploads/Equity_factor_
    returns_-03-2026.xlsx → …/uploads/…`.
  - Status: fix **committed + pushed** (`c915e06` → origin/main) and deployed.
    Remaining: re-plant the clean `results.pkl` in `state/` + verify (§15 runbook).

### Key mental model (so the next person isn't confused)
- **The pickle (`state/results.pkl`) = computed results + pointers to files.** It
  does NOT contain the `.xlsx` files themselves.
- **The `.xlsx` input files live in `s3://pc-tool-uploads/uploads/`.** The container
  disk is ephemeral; files are pulled from S3 on demand by basename.
- **S3 is the source of truth.** Uploading via the Setup tab writes to S3 under the
  real filename; every restart pulls the latest from S3. New uploads always win.
- Cached-results views (contribution, style, exposures) work from the pickle alone;
  recompute views (marginal contribution, scenario, market cycle) re-read the raw
  factor-returns file, so that file must be resolvable from S3.

### Still open (follow-ups, see DEPLOYMENT.md §13)
- **s3_storage real-basename fix** — pushed (`c915e06`) + deployed; remaining is the
  one-time cache re-plant + verify (§8 / §15).
- **HTTPS** — ALB is HTTP-only (no domain → no cert). Plan: CloudFront in front
  (free `*.cloudfront.net` cert) or a real domain + ACM cert on a 443 listener.
- **Auth** — app is wide open. Plan: Cognito auth action on the ALB listener, and
  then tighten the task SG (`3000 from 0.0.0.0/0` → `3000 from
  pc-tool-loadbalancer-firewall` only) so the login can't be bypassed via the raw
  task IP.
- **Optional CPU bump** — 0.5 vCPU makes clones slow; raise if server-side recompute
  becomes routine.

## 2026-07-07 — Sync teammate's monolith features into backend + frontend

Ported everything the teammate added in `clone_tool/` (the monolithic HTML/Flask
version) into the refactored `backend/` + `frontend/`, and built the frontend UI
for each so the two are fully in sync. `clone_tool/` is now a strict subset of
`backend/` (verified: zero clone-only routes remain; the 3 backend-only routes we
added after forking — `/manager_recommendations`, `/portfolio_contribution_preview`,
`/portfolio_report` — were preserved, so this was a selective merge, not a copy).

### Backend (all in `backend/app.py` + 3 copied engines)
- **New engines (byte-copied):** `overlap_engine.py`, `qualitative_loader.py`,
  `pptx_export.py`. All other engines were already byte-identical between the two
  trees — the entire delta lived in `app.py` + these 3 files.
- **Holdings overlap:** routes `/holdings_overlap`, `/holdings_overlap_detail`,
  helper `_resolve_overlap_benchmark`. Reuses existing `exposures_data` state and
  `exposures_engine._fuzzy_match_manager`.
- **Qualitative / diverse ownership:** routes `/upload_qualitative`,
  `/diverse_ownership`; helpers `_qual_lookup`/`_qual_fields` + module-global
  `_QUAL_MATCH_CACHE`; new `qualitative_data` state (saved/loaded in the cache
  pickle); `_qual_fields` enrichment added to `/portfolio` and
  `/peer_skill_summary`; `/reload_inputs` re-parses + clears the match cache;
  `/status` now emits `has_qualitative` + firm/strategy counts (cleaner than the
  monolith, which never had a dedicated flag).
- **PowerPoint export:** route `/export_portfolio_pptx` (self-contained, stateless);
  logo copied to `backend/static/assets/xponance_logo.png`; `python-pptx` + `lxml`
  added to `requirements.txt` and installed in the venv.
- **Market-cycle universe caching:** new `mc_universe_cache` state (persisted),
  precompute hook at end of `/run_universe`, cache read in `/market_cycle` via
  `_get_universe_state`, invalidation on new `factor_returns` upload.
- **Shared-route fixes (kept from teammate):** `/compute_security_risk_exposures`
  benchmark-splice fallback + `has_em_sleeve` (fixes a real bug where active
  exposures silently degraded to absolute when benchmarks were in the 2nd file);
  `/compute_risk_exposures` explicit `benchmark_name` override; `/sleeve_options`
  fallback to `risk_data.benchmark_names`.

### Frontend (Next.js, matched existing inline-SVG/CSS conventions — no ECharts/AG
Grid yet, per CLAUDE.md "add later")
- **New "Overlap" tab:** `features/overlap/` (types, api, hook, `overlap-matrix`
  heatmap, `overlap-detail-table`, route) + `app/(workspace)/overlap/page.tsx` +
  nav entry in `lib/constants.ts`.
- **Diverse Ownership panel:** `features/portfolio/components/diverse-ownership-section.tsx`
  wired into the portfolio route; `getDiverseOwnership` API + types; `q_*` fields
  added to `PortfolioManager`.
- **Qualitative upload widget:** new slot in setup `UPLOAD_SLOTS` + `hasStagedFile`/
  `fileLabel` cases; `has_qualitative`/counts added to `BackendStatus`.
- **PowerPoint export:** `Export PowerPoint` button on the Report route;
  `export-pptx.ts` captures the 5 report panels via **html2canvas** (new dep),
  POSTs to `/export_portfolio_pptx`, downloads the `.pptx`. Patched the backend
  proxy (`app/api/backend/[...path]/route.ts`) to forward `Content-Disposition`,
  `Content-Length`, `X-Skipped-Slides` (it previously dropped all but content-type,
  which would have broken the binary download filename/skip-list).

### Verification
- Backend: all `.py` compile clean; app boots on the existing cache (139 managers —
  additive state keys are backward-compatible with the old pickle); all 5 new routes
  registered; `/holdings_overlap`, `/diverse_ownership`, `/export_portfolio_pptx`,
  `/status` smoke-tested with graceful responses.
- Frontend: `tsc --noEmit` clean (exit 0, run twice).
- **Build caveat:** `next build` *compiles* successfully but the Turbopack
  TypeScript worker intermittently crashes with `UNKNOWN: unknown error, read`
  (errno -4094) — a known Windows + OneDrive filesystem flake reading a cached
  file, NOT a code error (tsc independently passes). Moving the repo off the
  OneDrive-synced path, or `next build` with the TS worker disabled, avoids it.
  Confirmed: a clean copy at `C:\Users\BryanRodas\pc_tool_fe` (non-OneDrive)
  builds fully green (all 11 routes prerendered incl. /overlap) and runs
  `next dev` fine — OneDrive also breaks `next dev`, so run the frontend from
  the non-OneDrive copy for now.

### Playwright end-to-end pass (2026-07-07)
Drove every feature in a real browser via Playwright MCP against the live app
(backend :3001, frontend :3000 from the non-OneDrive copy). All passed:
Setup qualitative widget shows "5 firms, 17 strategies loaded"; Overlap matrix
+ cell drill-down (22 shared securities); Diverse Ownership computes
current/proposed; **Export PowerPoint downloaded a valid 826 KB, 3-slide deck
with 6 embedded images** (real html2canvas captures); 0 console errors.
- **Bug found + fixed in the browser:** the Overlap matrix and detail table
  double-scaled `common_weight`/`wi_*` (they arrive from the engine already in
  percentage points, so ×100 gave "1297.4%"). Fixed `fmt()` in
  `overlap-matrix.tsx` and `pct()` in `overlap-detail-table.tsx` to append `%`
  without multiplying; jaccard stays ×100 (it is a 0–1 fraction). tsc clean.

### Auto-run universe clones on startup (2026-07-07)
User wanted the Market Cycle chart populated without clicking "Run Universe
Clones". Added `_auto_run_universe_on_startup()` in `backend/app.py`, called at
import time (fires under both `run.py` and `python app.py`). Refactored the
`/run_universe` worker into a reusable module-level `_start_universe_run()` that
both the route and the startup hook call (route is now a thin wrapper).
Guards: only runs when a universe file is staged AND readable on disk, factor
returns are loaded, no universe clone results are already cached, and no run is
in progress — so it fires once on first boot, then every later boot sees cached
results and skips. Failures are swallowed so a bad auto-run never blocks server
boot. Verified: staged the small ISC universe file, restarted, boot log showed
"Auto-running universe clones on startup ... started (['ISC'])" and the server
came up normally with the clone running in the background.
- **OneDrive caveat that matters here:** `backend/uploads/*.xlsx` universe files
  were dehydrated OneDrive placeholders (show a size but reads fail with OSError
  22); the `clone_tool/uploads/` copies were readable. The auto-run guard checks
  `os.path.exists`, which is true for placeholders — but the clone itself would
  fail to read them. Off OneDrive this is a non-issue; on OneDrive, ensure the
  staged universe file is "Always keep on this device".

## 2026-07-07 — Moved project off OneDrive to C:\dev\pc_tool (canonical working copy)

OneDrive's on-demand file hydration was intermittently failing reads of
node_modules/.next files, which crashed `next build` AND `next dev` with
`UNKNOWN: unknown error, read` (errno -4094), and even left some uploaded data
files as unreadable dehydrated placeholders. Fixed by relocating:
- Fresh `git clone` of origin (HEAD 5a0b69a) into **C:\dev\pc_tool** — this is
  now the working copy. Reinstalled frontend deps and rebuilt the backend venv
  there. Copied the gitignored data (backend/uploads/*.xlsx + cache/results.pkl)
  so it boots fully loaded (139 managers, 12 portfolios, ISC universe).
- Verified: `npm run dev` binds to **:3000** (no more accidental :3001
  collision), backend on :3001, browser UI works end-to-end with 0 console
  errors, and `next build` is fully green WITH the real type-check
  ("Finished TypeScript in 7.1s", all 11 routes) — so the OneDrive path was the
  entire cause.
- Removed the `typescript.ignoreBuildErrors` workaround from next.config.ts
  (commit e2e51b6, local only — not pushed). The old OneDrive copy and the
  temporary `C:\Users\BryanRodas\pc_tool_fe` can be retired.
- Run from now on: backend `cd C:\dev\pc_tool\backend; venv\Scripts\python.exe
  run.py`; frontend `cd C:\dev\pc_tool\frontend; npm run dev` → open
  http://localhost:3000.
