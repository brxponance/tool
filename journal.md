# Journal

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
