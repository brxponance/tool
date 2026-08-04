# Journal

## Index

_Newest first. Add new entries directly below this index._

- [2026-08-04 — One combined market-cycle chart; localhost-vs-127.0.0.1 dev gotcha](#2026-08-04--one-combined-market-cycle-chart-localhost-vs-127001-dev-gotcha)
- [2026-07-31 — Added root CLAUDE.md; journals now indexed and newest-first](#2026-07-31--added-root-claudemd-journals-now-indexed-and-newest-first)
- [2026-07-31 — Ported the new clone_tool drop; fixed the deploy outage; made deploys self-service](#2026-07-31-ported-the-new-clone_tool-drop-fixed-the-deploy-outage-made-deploys-self-service)
- [2026-07-20 — Fixed broken deploys + added a stable URL (ALB)](#2026-07-20-fixed-broken-deploys-added-a-stable-url-alb)
- [2026-07-07 — Sync teammate's monolith features into backend + frontend](#2026-07-07-sync-teammates-monolith-features-into-backend-frontend)
- [2026-07-07 — Moved project off OneDrive to C:\dev\pc_tool (canonical working copy)](#2026-07-07-moved-project-off-onedrive-to-cdevpc_tool-canonical-working-copy)

---

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
