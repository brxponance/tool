# Quarterly Review — report design

Status: proposal + working example on the Report tab (2026-09-09).
Owner: JB. Example content lives in
`frontend/src/features/report/lib/quarterly-review-content.ts`.

## Purpose

One document, produced each quarter, that answers four questions in order:

1. **What are our rules and our views?** Internal guidelines and the
   two-year macro view, stated once at the front so every later page can be
   read against them.
2. **Is our money behind our best managers?** The manager universe by peer
   group, ranked by normalized skill, with the dollars we have in each and a
   written justification wherever skill and assets disagree.
3. **How do the client portfolios look, and what could hurt them?** The
   existing client report plus a risk page: guideline compliance, the five
   largest active bets stress-tested, worst historical quarters, and whether
   the portfolio is positioned with or against our own views.
4. **What are we changing?** Pending proposed-weight changes and the
   watchlist (not built yet — see "Next").

## Structure

| # | Section | Source | Built? |
|---|---|---|---|
| 1 | Cover | date, client count | yes |
| 2 | Internal guidelines table | authored, `INTERNAL_GUIDELINES` | yes (example limits) |
| 3 | Macro views: thesis bullets + house view vector | authored, `MACRO_THEMES`, `MACRO_VIEWS` | yes (example views) |
| 4 | Peer group tables (skill, AUM, notes, flags) | live | yes; notes are empty |
| 5 | Dispersion summary | `/export_dispersion_xlsx` maths | no (Excel only today) |
| 6 | Per client: cover, restrictions/preferences, holdings, V-G, skill + DWBE, FactSet risk | live | yes |
| 7 | Per client: exposures, performance, calendar, quarterly excess, complements | live | yes |
| 8 | Per client: guideline compliance with driving managers | live | yes |
| 9 | Per client: five largest active risks with illustrative stress | live | yes |
| 10 | Per client: worst quarters vs benchmark | live (backtested series) | yes |
| 11 | Per client: positioning vs house views | live × authored views | yes |
| 12 | Per client: pending changes (proposed vs current), watchlist | live | no |
| 13 | Per client: this quarter's attribution (Attribution tab) | live | no |

## Macro views: bullets or vectors?

Both, with different jobs.

- **Bullets (3–5)** carry the reasoning. They are what a reader remembers and
  what we will be judged on in two years.
- **The view vector** (dimension · bucket · OW/UW/N · conviction 1–3 ·
  one-line rationale) is what the tool can *test*. Every client page reports
  whether its active weight in each bucket agrees with the view. That turns
  "we like Japan" into "MD is +3.1 pp Japan, aligned; CALSTRS is −2.0 pp,
  against".

Recommendation: keep the vector short (≤ 10 rows) and make bucket names
match the exposure labels exactly (Region / Country / Sector / Industry /
FactSet factor) so the alignment check stays automatic. Record the date each
view was set so we can score them later.

Alternative considered: "top 3 overweights / underweights" only. Compact,
but it describes the portfolio rather than the view — it is already on the
exposures page. The vector describes intent; the exposures page describes
outcome. Both belong.

## Stress testing: what "five biggest risks" means here

The report ranks every active bet on **one illustrative scale** so country,
industry and factor bets can be compared:

- weight bets: `|active pp| × 10 % relative move` → bps of relative return
- FactSet factor bets: `|active exposure| × 3 % per unit` (≈ one sigma)

It is a ranking device, not a risk model, and the caption says so. The
"driven by" column is `manager weight × the manager's own exposure`, computed
by fetching each manager's exposures alone. That is what lets the page say
"European software overweight is Bayard and Osmosis".

Better, when we want it:

- **Historical scenarios** on the backtested series: GFC (Q4 2008), Euro
  crisis (Q3 2011), COVID (Q1 2020), rate shock (2022). We have the monthly
  portfolio and benchmark series, so this is a backend addition, not new
  data. The "worst quarters" table is the first step.
- **Factor stress from actual factor returns.** The factor-returns workbook
  gives realised factor volatility; replace the flat 3 % with each factor's
  trailing one-sigma.
- **Correlated shocks.** A "Japan −10 %, yen +10 %" style scenario that hits
  several buckets at once. Needs scenario definitions authored per quarter.

## Guidelines: where they live and how they flag

- Firm-wide limits (single country, sector, industry, manager) and client
  preferences (share of product AUM, DWBE minimum) are one table at the front.
- Each client page runs every guideline and shows value, limit, status
  (OK / Near limit / Breach) and the managers driving it. "Near limit" is a
  separate threshold so the report warns before a breach.
- Client-specific restrictions (the bulleted "Client Restrictions" block) are
  still text. Next step: encode them like the firm guidelines so they can be
  checked too — for example "new manager must be < $5 bn AUM" is a check on
  `q_firm_aum` for any manager added this quarter.

## Other vectors worth adding

Ordered by how much they would change a decision, given data we already have:

1. **Share of product AUM per manager** (client $ ÷ strategy AUM). Already
   computed for the guideline; show it in the holdings table so capacity
   risk is visible on every client, not only when it breaches.
2. **Quarter's attribution.** The Attribution tab decomposes excess return
   into themes; one line per client ("this quarter's +0.6 % came from Japan
   OW and the Profitability tilt") closes the loop on the macro views.
3. **Pending changes.** Proposed vs current weights per client, with the
   guideline checks re-run on the proposed book. This is the "what are we
   changing" page.
4. **Manager skill trend.** Normalized skill Z now vs. one and four quarters
   ago. Needs quarterly snapshots of the skill table — start storing them.
5. **Concentration.** Effective number of managers (1 / Σw²) and top-3
   weight, per client. Cheap and a good early warning.
6. **Overlap between managers** (holdings overlap already exists on the
   Portfolio tab): the pairs above 30 % overlap, per client.
7. **Universe changes.** Managers entering / leaving peer groups, and skill
   rank movers, since last quarter. Also needs snapshots.
8. **Dispersion summary.** One chart: cross-client excess-return dispersion
   by quarter, with the best and worst client named. The Excel export has
   the numbers.
9. **Fees / net-of-fee excess.** Not in the tool today; would need a fee
   column in the qualitative workbook.

## Open decisions

- Where authored content (guidelines, views, notes) is stored per quarter:
  a `review_quarters` table in Postgres is the natural home; the weights
  workbook is the fallback.
- Whether the Peer Group notes are per manager (one note reused across
  quarters) or per manager-quarter.
- Whether "near limit" thresholds are a fixed offset (limit − 5 pp) or set
  per guideline as now.

## Next

1. Agree the example layout (this build) and the guideline limits.
2. Notes: editable text per manager on the Peer Group tables, persisted.
3. Pending-changes page and attribution line per client.
4. Store quarterly snapshots (skill table, weights) to enable trend views.
5. PDF for the front matter and Peer Group report; then the single combined
   PDF (front matter → peer groups → every client).
