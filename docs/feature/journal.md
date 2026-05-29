# Manager Finder Journal

> Chronological log of manager-finder-related changes, decisions, and findings.

---

## 2026-04-29 - Validation pass and environment blockers for manager-finder

### Problem
The manager-finder work touched both the Flask backend and the Next.js manager-detail feature, so a narrow syntax-only check was not enough. The goal was to confirm the new route shape, frontend integration, and type safety without widening into unrelated parts of the product.

### Decision
Use the cheapest executable checks that directly validate the touched slice first: backend syntax compilation, focused frontend linting, TypeScript checking, and editor diagnostics. Attempt broader validation afterward, but record any environment blockers explicitly instead of masking them.

### Changes
- Ran `python -m py_compile app.py` in `pc_tool/backend` to validate the new backend helpers and the `/manager_recommendations/<tab>/<mgr_name>` route in `pc_tool/backend/app.py`.
- Ran `npm run lint -- src/features/manager-detail` in `pc_tool/frontend` to validate the changed manager-detail feature files.
- Ran `npx tsc --noEmit` in `pc_tool/frontend` to validate the added recommendation response types and UI integration in:
  - `pc_tool/frontend/src/features/manager-detail/types.ts`
  - `pc_tool/frontend/src/features/manager-detail/api/get-manager-detail-screen-data.ts`
  - `pc_tool/frontend/src/features/manager-detail/routes/manager-detail-route.tsx`
- Checked editor diagnostics on the touched files and confirmed there were no reported errors.
- Attempted `npm run build` in `pc_tool/frontend`, but the command was blocked because another Next build process was already running in the workspace.
- Attempted a Flask test-client smoke test for the new route, but the active Python environment could not import `numpy`, so the backend could not be booted from that shell.

### What was NOT changed
- Did not kill the existing Next build process.
- Did not install or repair Python dependencies in the current shell environment.
- Did not run a full end-to-end browser verification pass.
- Did not change any validation scripts, build config, or package scripts.

### Risk Assessment
Static validation and focused checks passed, which lowers the risk of syntax, type, or wiring errors in the touched slice. The remaining risk is runtime-only behavior: the recommendation route still needs an end-to-end smoke test in a Python environment with the backend dependencies installed, and the full frontend build still needs to be rerun after the existing build lock clears.

## 2026-04-29 - Added manager recommendation panels to manager detail

### Problem
The product already allowed users to search for a manager and inspect the detail view, but it stopped there. A user who wanted alternatives still had to manually search the full manager list and mentally compare style, skill, and risk across separate screens.

### Decision
Add the recommendation UI directly to the existing manager-detail feature instead of spreading the first release across portfolio and peer-group screens. This kept the implementation anchored to one selected manager and one isolated feature module, which reduced surface area and made the behavior easier to understand.

### Changes
- Updated `pc_tool/frontend/src/features/manager-detail/types.ts`:
  - added `ManagerRecommendation`
  - added `ManagerRecommendationsResponse`
  - extended `ManagerDetailScreenData` with a `recommendations` field
- Updated `pc_tool/frontend/src/features/manager-detail/api/get-manager-detail-screen-data.ts`:
  - fetches `manager_recommendations/<tab>/<mgr_name>` in parallel with `manager_detail` and `manager_skill_summary`
  - adds a defensive fallback payload if the new recommendation endpoint is unavailable
- Updated `pc_tool/frontend/src/features/manager-detail/routes/manager-detail-route.tsx`:
  - imports formatting helpers needed for recommendation deltas
  - adds a shared recommendation renderer for reusable list sections
  - adds recommendation click handling so a selected suggestion becomes the active manager in the detail view
  - adds three UI sections:
    - `Closest matches`
    - `Higher skill alternatives`
    - `Lower risk alternatives`

### What was NOT changed
- Did not change `pc_tool/frontend/src/features/manager-detail/components/manager-directory.tsx`.
- Did not change portfolio, setup, or peer-group routes in the Next.js app.
- Did not update the legacy HTML UI in `pc_tool/backend/static/index.html`.
- Did not add portfolio-aware recommendation controls or filters.

### Risk Assessment
The frontend is intentionally dependent on the backend response shape for the new route. A fallback object was added so the screen does not hard-fail if the endpoint is unavailable, but recommendation quality still depends entirely on the backend heuristic. The UI is also same-tab only, which is safer for v1 but may feel narrower than users expect.

## 2026-04-29 - Added manager recommendation backend route and scoring helpers

### Problem
There was no backend route that could take one manager as a reference and rank substitutes using the analytics already computed by the clone engine. The existing backend only exposed manager lookup, peer summaries, portfolio stats, and other analytics, but not substitute ranking.

### Decision
Implement the first recommendation pass inside `pc_tool/backend/app.py` near the existing manager lookup routes. This avoided introducing a brand-new subsystem and kept the first implementation close to the existing cached clone results. The scoring uses current clone outputs and normalized-skill data instead of inventing a separate quantitative model.

### Changes
- Updated `pc_tool/backend/app.py`:
  - added `_resolve_manager_record()` to normalize manager lookup behavior across recommendation and detail endpoints
  - added `_safe_metric()` for finite-number coercion
  - added `_filled_manager_returns()` to back-fill missing manager returns with static clone returns for recent risk calculations
  - added `_annualized_volatility()` and `_annualized_downside_dev()`
  - added `_manager_recommender_features()` to build a comparable feature bundle from existing clone outputs
  - added `_bounded_similarity()` and `_relative_similarity()` for similarity scoring
  - added `_manager_recommendation_payload()` to compute ranked comparison output
  - added `/manager_recommendations/<tab>/<mgr_name>` route returning:
    - `reference`
    - `closest_matches`
    - `skill_upgrades`
    - `lower_risk_matches`
    - `scope`
  - updated `/manager_detail/<tab>/<mgr_name>` to reuse `_resolve_manager_record()` for consistent lookup behavior
- The recommendation scoring uses existing values already present in clone results and normalized-skill data:
  - `style_buckets`
  - `vg_full`
  - `pct_small`
  - `pct_em`
  - `r2_full`
  - `ns_z`
  - trailing volatility from recent returns
  - trailing downside deviation from recent returns

### What was NOT changed
- Did not modify `pc_tool/backend/clone_engine.py`.
- Did not modify `pc_tool/backend/skill_engine.py`.
- Did not modify `pc_tool/backend/risk_engine.py`, `pc_tool/backend/exposures_engine.py`, or `pc_tool/backend/market_cycle.py`.
- Did not add a new cache file, database table, or persisted recommendation store.

### Risk Assessment
The scoring is heuristic and intentionally simple. It is not calibrated against historical replacement decisions, and the weights are opinionated. Risk statistics are derived from recent return series with static clone fallback, which is practical for the first release but not the same as a dedicated risk model. Same-tab-only scope improves comparability but excludes potentially valid cross-tab substitutes.

## 2026-04-29 - Scoped the first manager-finder release to same-tab manager detail

### Problem
The platform already had manager search and detail lookup, but it was not obvious where a recommendation feature should live first. A broader rollout across portfolio, peer groups, add-manager flows, and legacy HTML would have introduced too many moving parts for the initial implementation.

### Decision
Start inside the manager-detail feature and keep the first recommendation release constrained to the selected manager's peer tab. This was chosen because:
- manager detail already has a contained data-loading flow
- same-tab comparisons preserve style and benchmark context better
- recommendation quality is easier to explain when the comparison universe is smaller and more coherent

Alternatives considered but deferred:
- adding recommendations to the portfolio add-manager modal
- adding recommendations to the peer-groups screen first
- allowing cross-tab search in the first release

### Changes
- Reviewed and used the existing manager lookup surfaces as the implementation anchor:
  - `pc_tool/backend/app.py` routes `/all_managers` and `/manager_detail/<tab>/<mgr_name>`
  - `pc_tool/frontend/src/features/manager-detail/components/manager-directory.tsx`
  - `pc_tool/frontend/src/features/manager-detail/hooks/use-manager-detail-screen.ts`
  - `pc_tool/frontend/src/features/manager-detail/routes/manager-detail-route.tsx`
- Defined the first recommendation lenses used by the implementation:
  - closest match
  - higher skill alternative
  - lower risk alternative

### What was NOT changed
- Did not build a generic AI chat assistant.
- Did not add recommendations to the portfolio rebalance flow.
- Did not add peer-group-level recommendation filters or compare-across-tabs behavior.
- Did not modify the manager search behavior itself.

### Risk Assessment
This scope choice reduces implementation risk, but it also narrows discovery. Users may reasonably expect cross-tab recommendations or portfolio-aware substitutes later. That work is not blocked by this design, but it is also not solved by it.

## 2026-04-29 - Reviewed platform analytics and chose an augmentation strategy

### Problem
Before implementing any AI or recommendation capability, it was necessary to determine whether the right move was to replace the existing mathematical models or to build product layers on top of them. Without that decision, the implementation risked duplicating or conflicting with the current analytics engine.

### Decision
Treat the current backend analytics as the source of truth and build augmentation layers above them. The practical recommendation was to use the existing clone, skill, risk, exposure, and market-cycle outputs as inputs to user-facing decision tools rather than introducing a separate model to replace them.

The concrete opportunities identified were:
- a data-checking assistant
- a rebalance copilot
- an explanation layer
- a manager-finder capability

The manager-finder path was selected as the first concrete implementation target.

### Changes
- Reviewed the current backend analytics surfaces in:
  - `pc_tool/backend/app.py`
  - `pc_tool/backend/data_loader.py`
  - `pc_tool/backend/clone_engine.py`
  - `pc_tool/backend/skill_engine.py`
  - `pc_tool/backend/risk_engine.py`
  - `pc_tool/backend/exposures_engine.py`
  - `pc_tool/backend/security_risk_engine.py`
  - `pc_tool/backend/market_cycle.py`
- Reviewed the current manager lookup and selection flows in:
  - `pc_tool/backend/static/index.html`
  - `pc_tool/frontend/src/features/manager-detail/`

### What was NOT changed
- Did not integrate an LLM or AI service.
- Did not add any new infrastructure, secrets, or model configuration.
- Did not alter existing clone, risk, exposure, or market-cycle mathematics.
- Did not create a new product surface outside the manager-finder implementation path.

### Risk Assessment
This entry records an architectural and product decision, not a code change by itself. The risk is mainly strategic: recommendation quality is bounded by the current analytics and by how well the product explains the ranking logic. That risk was accepted because replacing the core math would have been far riskier and less auditable.


## 2026-04-29 - Wired legacy portfolio analytics fan-out into the Next portfolio feature

### Problem
The Next.js Portfolio page had reached a partial visual match with the legacy HTML, but it still did not behave like the old page. Selecting a client only loaded the top-level portfolio payload and summary stats, while the lower sections stayed placeholder-only. The legacy `loadPortfolio()` path in `backend/static/index.html` triggered a much wider client-change fan-out, including risk exposures, risk analysis, market cycle, contribution tables, and portfolio exposures. Without that fan-out, the new screen looked closer to the old one but still failed the user's main requirement: it did not work like the original portfolio workflow.

### Decision
Keep the new feature-first frontend structure and move the missing orchestration into the portfolio feature itself. The portfolio hook was the right place to mirror the legacy `loadPortfolio()` behavior because it already owned client selection and base portfolio loading. That approach preserved the architecture boundary while avoiding hardcoded business values or route-level orchestration sprawl.

### Changes
- Updated `frontend/src/features/portfolio/types.ts` to add response models for:
  - active style risk exposures
  - scenario analysis
  - marginal contribution
  - regime analysis
  - contribution tables
  - market-cycle placements
  - portfolio exposures menu and row payloads
- Updated `frontend/src/features/portfolio/api/get-portfolio-screen-data.ts` to add wrappers for:
  - `status`
  - `compute_risk_exposures`
  - `compute_security_risk_exposures`
  - `risk_analysis`
  - `portfolio_contribution/<client>`
  - `market_cycle`
  - `portfolio_exposures`
- Updated `frontend/src/features/portfolio/hooks/use-portfolio-screen.ts` so the selected-client flow now:
  - loads backend status together with the client roster
  - loads the base portfolio payload and ancillary analytics in parallel
  - keeps separate loading state for the portfolio core payload, ancillary analytics, and exposure regrouping
  - loads the exposures menu first, then hydrates the first available grouping
  - uses `useEffectEvent` to keep the selected-client effect stable under React 19 lint rules
- Added `frontend/src/features/portfolio/components/portfolio-analytics-sections.tsx` to render real data-backed lower sections for:
  - value-growth positioning
  - portfolio edge
  - active style risk exposures
  - market-cycle placements
  - portfolio exposures
  - marginal contribution to risk
  - scenario analysis
  - value-vs-growth regime analysis
  - manager contribution and grouped contribution tables
  - style summary
- Updated `frontend/src/features/portfolio/routes/portfolio-route.tsx` to replace placeholder lower panels with the new analytics section component.
- Validation completed after the wiring pass:
  - `npm run lint`
  - `npm run build`

### What was NOT changed
- Did not enable live editing of proposed weights in the Next portfolio table.
- Did not implement the add-manager flow.
- Did not convert the current market-cycle, risk, or contribution tables to the approved chart stack (`ECharts + Framer Motion + AG Grid`).
- Did not add nested-row expansion for portfolio-exposure responses that include `children`.

### Risk Assessment
The Portfolio screen now depends on a wider set of backend endpoints and uploaded optional files, so degraded states are more visible than before. That is the correct tradeoff, but parity is still incomplete. Proposed-weight edits do not yet recompute the downstream analytics, and exposure responses that contain nested children are typed but not fully visualized. Runtime behavior also still depends on the Flask backend being reachable through the Next proxy.

## 2026-04-29 - Rebuilt the Next portfolio page around the legacy HTML structure

### Problem
The first Portfolio implementation in the Next frontend diverged too far from the legacy HTML. The user was explicit that the new app should use the new internal structure, but the rendered screen still needed to match the old one closely enough to serve as a parity baseline. Without that baseline, later data wiring work would have been hard to judge because layout differences and behavioral differences were mixed together.

### Decision
Port the legacy Portfolio layout in two passes. First, match the section order, table shape, and visual scaffolding from the old HTML without hardcoding live business data. Second, layer the real backend fan-out behind that surface. This made it possible to compare the new page to the legacy page screen-by-screen while still preserving the new feature boundary.

### Changes
- Added `frontend/src/app/(workspace)/portfolio/page.tsx` as the route entry point for the portfolio feature.
- Added `frontend/src/features/portfolio/routes/portfolio-route.tsx` to match the legacy section order and control row, including:
  - portfolio selector
  - proposed-total summary
  - unmatched-manager alert
  - portfolio managers panel
- Added `frontend/src/features/portfolio/components/portfolio-table.tsx` with the legacy-style column set for:
  - tab
  - manager name
  - current and proposed weights
  - value-growth columns
  - normalized skill
  - style buckets
  - full-model `R²` with inline bar treatment
- Extended `frontend/src/app/globals.css` with the portfolio-specific classes used by the parity rebuild, including:
  - `.data-table`
  - `.summary-box`
  - `.summary-row`
  - `.r2-bar`
  - `.r2-fill`
  - `.val-pos`
  - `.val-neg`
  - contribution-table helpers
- Added the initial portfolio feature response and stats types in `frontend/src/features/portfolio/types.ts` so the new route could stay typed from the start.

### What was NOT changed
- Did not make proposed weights editable in the first parity pass.
- Did not implement add, remove, or reorder manager actions.
- Did not wire the lower analytics sections in this first portfolio-layout pass.
- Did not copy or hardcode live portfolio values from the legacy HTML.

### Risk Assessment
This pass intentionally favored layout parity over full behavior parity. That was necessary to get to a reliable visual base, but it carried a risk: the screen could appear closer to the legacy page than it actually was functionally. That risk was acceptable only because the next pass explicitly targeted the missing client-change fan-out and replaced the placeholder analytics sections with real backend data.

## 2026-04-29 - Ported the setup workflow and legacy shell into the Next app

### Problem
The initial Next.js frontend had a completely different visual language and navigation model from the legacy HTML. Users could not treat it as a direct replacement because the top navigation, backend-status cues, upload grid, cached-state warnings, run controls, and progress log all differed. That made even successful technical work feel wrong at the UI level.

### Decision
Use the legacy HTML as the UI source of truth for the shell and Setup screen, but rebuild it inside the new feature-first Next app. The new app would keep route-level feature ownership and typed API helpers, while the rendered experience would move back toward the legacy structure and wording.

### Changes
- Updated `frontend/src/app/layout.tsx` to switch the app to IBM Plex Sans and IBM Plex Mono and to use Clone Tool-specific metadata.
- Updated `frontend/src/app/page.tsx` to redirect the root path to `/setup`.
- Added `frontend/src/app/(workspace)/layout.tsx` so feature routes share a common shell.
- Added route entry points for:
  - `frontend/src/app/(workspace)/setup/page.tsx`
  - `frontend/src/app/(workspace)/portfolio/page.tsx`
  - `frontend/src/app/(workspace)/peer-groups/page.tsx`
  - `frontend/src/app/(workspace)/manager-detail/page.tsx`
- Added `frontend/src/components/layout/app-shell.tsx` to recreate the legacy top navigation and backend status indicator.
- Added `frontend/src/app/api/backend/[...path]/route.ts` so the browser talks to Flask through a Next.js proxy.
- Rewrote `frontend/src/app/globals.css` around the legacy shell, panel, button, table, progress, badge, and summary tokens instead of the default `create-next-app` styles.
- Added the Setup feature data layer:
  - `frontend/src/features/setup/api/get-setup-snapshot.ts`
  - `frontend/src/features/setup/hooks/use-setup-snapshot.ts`
  - `frontend/src/features/setup/types.ts`
- Added `frontend/src/features/setup/routes/setup-route.tsx` to own the Setup workflow, including:
  - upload orchestration for manager returns, factor returns, weights, risk, security risk, exposures, and universe files
  - buy-list and universe clone run controls
  - polling against `/progress`
  - stale-cache banners and reset/reload actions
  - results summary loading from `/all_managers`
- Updated `frontend/README.md` to document how to start the frontend, how it depends on the Flask backend, and which screens exist.

### What was NOT changed
- Did not add a custom modern redesign on top of the parity rebuild.
- Did not replace the legacy HTML file in `backend/static/index.html`.
- Did not move backend analytics into the Next.js app.
- Did not implement full peer-groups or manager-detail parity in this setup-and-shell pass.

### Risk Assessment
This pass improved usability and trust by restoring the old interaction model, but it also increased the number of frontend surfaces tied directly to backend status and progress endpoints. The shell now polls the backend regularly, and the Setup route assumes those helper endpoints remain stable. The UI is much closer to the legacy page, but the migration still depends on keeping CSS parity and endpoint behavior aligned as the new screens expand.

## 2026-04-29 - Stabilized Flask startup and frontend proxy handoff for the new app

### Problem
The new frontend could not be trusted until the backend exposed routes predictably and bound its port quickly. Startup was slowed by eager normalized-skill recomputation, and the Flask app needed a clearer runtime contract for the new Next frontend while still preserving legacy compatibility for the old HTML route. If the backend stayed slow to bind or inconsistent about routes, the new UI would keep failing with avoidable connection and registration issues.

### Decision
Keep Flask as the analytics source of truth, but make startup cache-first and lazy for normalized skill. Use `backend/run.py` as the dedicated entry point for the Next frontend on port `3001`, keep `backend/app.py` runnable on port `5050` for legacy HTML compatibility, and let the Next proxy try `3001` first and `5050` second during the transition.

### Changes
- Updated `backend/app.py` so startup now reuses cached normalized-skill values when available instead of forcing a full recomputation during module import.
- Added `_ensure_norm_skill_for_tab()` in `backend/app.py` so missing normalized-skill data can be recomputed lazily one tab at a time.
- Kept `_norm_skill_for()` in `backend/app.py` as the centralized helper that triggers lazy recompute and normalizes manager-name lookup.
- Preserved explicit UI-support routes in `backend/app.py`, including `/status` and `/progress`, so the Next shell and setup screen can reflect backend state.
- Ensured `if __name__ == '__main__': app.run(...)` sits at the bottom of `backend/app.py`, after route registration.
- Kept `backend/run.py` as the dedicated launcher that checks/install dependencies and starts Flask on `http://localhost:3001` for the new frontend.
- Added `frontend/src/app/api/backend/[...path]/route.ts` to proxy frontend requests and fall back from `http://127.0.0.1:3001` to `http://127.0.0.1:5050` when needed.

### What was NOT changed
- Did not rewrite the Flask backend into a new modular backend structure.
- Did not remove legacy `5050` compatibility.
- Did not add a websocket or server-sent-event layer for progress updates.
- Did not change clone, risk, exposure, or market-cycle mathematics.

### Risk Assessment
The startup path is materially safer than eager recomputation, but it still depends on cache quality and uploaded file consistency. The proxy fallback keeps the migration flexible, but it can also hide local port mismatches if developers forget which backend instance is serving requests. Lazy normalized-skill recompute is the right startup tradeoff, but it still moves some work to first-request time when a tab is missing from cache.

## 2026-04-29 - Chose Flask plus Next.js with parity-first feature boundaries

### Problem
The product started as a Flask app serving a single legacy HTML page, but the UI needed a better long-term structure and better user experience without replacing the analytics already trusted in the Python backend. The unresolved question was whether to keep everything in Python, move everything to Next.js, or split the system into a Python backend and a modern frontend.

### Decision
Use Flask as the analytics and file-processing backend, and use Next.js as the UI layer. Keep the Next app organized by feature boundaries (`setup`, `portfolio`, `peer-groups`, `manager-detail`) and treat the legacy HTML as the behavioral and visual source of truth during migration. This preserved the existing math while making room for a cleaner frontend architecture.

### Changes
- Locked the high-level responsibility split:
  - Flask owns uploads, clone runs, cached analytics, portfolio analytics, risk, market cycle, exposures, and manager-detail endpoints.
  - Next.js owns navigation, route segmentation, loading states, screen composition, and parity rebuilds.
- Standardized the frontend structure around:
  - `frontend/src/features/{feature}/routes`
  - `frontend/src/features/{feature}/components`
  - `frontend/src/features/{feature}/hooks`
  - `frontend/src/features/{feature}/api`
  - `frontend/src/features/{feature}/types`
- Kept layout-only code in `frontend/src/components/layout` and infrastructure helpers in `frontend/src/lib`.
- Updated `frontend/README.md` so local startup instructions match the Flask-plus-Next split.

### What was NOT changed
- Did not move analytics out of Python.
- Did not add a separate BFF, GraphQL layer, or database-backed service layer.
- Did not replace the legacy HTML with a brand-new product design language.
- Did not remove the old file from `backend/static/index.html`.

### Risk Assessment
This architecture reduces rewrite risk, but it creates a strict contract between two apps that now have to stay in sync. The frontend is only as stable as the backend routes and response shapes behind it. The parity-first migration also means some screens will feel transitional for a while: they are intentionally closer to the legacy UI than a greenfield redesign would be, and that tradeoff has to stay deliberate rather than accidental.