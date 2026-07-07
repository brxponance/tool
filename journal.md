# Journal

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
