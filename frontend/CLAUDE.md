

Critical frontend rule:

Build the frontend as bounded feature modules, not as a giant shared component tree
Each feature should own its own screens, feature-specific components, data hooks, forms, and client-side orchestration
Shared UI should contain only true primitives, layout building blocks, and reusable utilities with stable APIs
Do not hide feature logic inside generic shared components; keep business behavior close to the feature that owns it
The goal is bounded blast radius, not zero coupling; deleting, disabling, or rebuilding one feature should only affect its explicit routes, consumers, and composed flows
Unrelated screens must continue to render and function when an optional feature is unavailable
Prefer composition, explicit props, narrow stores, and lazy loading over global state sprawl, god components, and hidden cross-feature imports
Organize the frontend as feature-first and route-aware: frontend/src/features/{feature}/routes, components, hooks, api, and types
Prefer organizing by business feature, not by file type; avoid splitting one feature across top-level pages, components, hooks, services, and types folders
Route files are page entry points, but they should live inside the feature that owns them rather than acting as the primary top-level structure
If you are working on a feature like chat, clients, estimates, or templates, most of the code for that feature should be findable under one feature folder
Keep frontend/src/components/ui for shadcn/ui primitives only
Keep frontend/src/components/layout for app shell and layout building blocks only
Keep frontend/src/lib for infrastructure such as API clients, auth wiring, i18n, shared utilities, and constants
Do not use top-level dumping-ground folders for business logic; move code to shared only when multiple features reuse the same stable API

You must use these charts and graphs combinationsDO NOT USE OTHER ONES unless i approve it : ECharts + Framer Motion + AG Grid
Best premium custom layer: add Visx only where you want a signature visual (We will add these after to giv ethat last spice do not start right away)





Backend structure:

backend/src/agents/ - AI-only logic
backend/src/domains/ - business logic grouped by feature
backend/src/routes/ - route registration
backend/src/middleware/ - auth, rate limiting, subscription gates
backend/src/utils/ - shared clients and helpers
Core rule:

Agents call Anthropic only
Services handle external APIs or pure business logic
Controllers stay thin and orchestrate calls
Critical backend rule:

Build the backend as a modular monolith composed of bounded domains
Each domain must own its own routes, use cases, persistence access, and external integrations
Other parts of the system may depend only on a domain's public contract, never on its internal implementation details
The goal is bounded blast radius, not zero coupling; deleting, disabling, or rebuilding one domain should only affect its explicit consumers
Unrelated domains must continue to boot and operate when an optional domain is unavailable
Prefer graceful degradation, lazy loading, and orchestration layers over deep cross-domain imports and eager startup coupling