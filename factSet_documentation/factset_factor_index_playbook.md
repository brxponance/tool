# FactSet Factor Index Playbook

This is the working map for building the Xponance/Aapryl factor indices from the FactSet Alpha Testing and Universal Screening documentation.

## Objective

Build monthly updated factor indices for:

- Deep Value
- Quality Value
- Quality Growth
- Aggressive Growth

Reference universes/benchmarks:

- Russell 1000
- Russell 2000
- MSCI EAFE
- MSCI EM

The first milestone is not index construction. The first milestone is a clean custom factor library with high data coverage.

## Docs That Matter

Alpha Testing:

- `Online-Assistant-Building-an.md`
- `Online-Assistant-Defining-the.md`
- `Online-Assistant-Specifying-the.md`
- `Online-Assistant-Adding-Factors.md`
- `Online-Assistant-Multi.md`
- `Online-Assistant-Selecting.md`
- `Online-Assistant-Configuring.md`
- `Online-Assistant-Alpha-Testing.md`

Universal Screening:

- `Online-Assistant-Universal.md`
- `Online-Assistant-Viewing-Screen.md`
- `Online-Assistant-Viewing.md`
- `Online-Assistant-Using-Row.md`
- `Online-Assistant-Ranking-and.md`
- `Online-Assistant-Statistics.md`
- `Online-Assistant-Applying-Logic.md`
- `Online-Assistant-Setting-Global.md`
- `Online-Assistant-Using-Screen.md`

Formula/data hygiene:

- `Online-Assistant-Quant-Model.md`
- `Online-Assistant-Lagging-Data.md`
- `Online-Assistant-Using-Restated.md`
- `Online-Assistant-Using-the.md`
- `Online-Assistant-UPERCENTILE-vs..md`

## Core Workflow

1. Build one prototype model first, probably Russell 1000.
2. Define the investable universe and benchmark in Alpha Testing.
3. Build custom raw factors in Screening or directly in Alpha Testing.
4. Test coverage for each raw factor by universe and date.
5. Add fallback logic until financial-statement factors have near 100% coverage.
6. Build composite Value, Quality, Growth, and Aggressive Growth scores.
7. Compare multi-factor rank construction against two-step construction.
8. Add sector/region constraints based on active manager exposures.
9. Export constituents/weights monthly for Aapryl and internal tools.

## Factor Library First

Build raw factors before building indices.

Suggested starting factor groups:

- Value: book/price, earnings/price, cash flow/price, sales/price, EBIT/EV, EBITDA/EV
- Quality: ROE, ROIC, operating margin, gross margin, debt/capital, interest coverage, accruals, earnings variability
- Growth: sales growth, EPS growth, operating income growth, forward EPS growth, long-term expected growth
- Aggressive Growth: growth plus revisions, momentum, estimate upgrades, earnings surprise, high reinvestment or margin expansion

Use FactSet Backtesting Factor Library formulas as prototypes, then customize them. Do not blindly trust the standard factor definitions if they leave 5-10% missing data.

## Formula Rules

Use relative dates for backtests. Avoid `NOW` in backtested factor formulas.

Use lags for fundamental data:

- Annual fundamentals: usually `L90D`
- Quarterly fundamentals: usually `L45D`
- Semiannual fundamentals: usually `L60D`
- Price, shares, benchmark constituents: usually no lag
- Estimates: usually use appropriate point-in-time context such as input date / no real-time revision drift when available

Use fallback logic:

- `AVAIL(a,b,c)` to use the first available item
- `ZAV(x)` where unavailable additive fields should behave like zero
- `IF(condition, value_if_true, value_if_false)` for explicit logic
- Row references like `#P.FIELD_NAME` in Screening to reuse intermediate calculations
- Global variables like `#V.M` or `#V.Y` to control dates consistently

Coverage rule from the project note:

- Any factor based on standard financial statements should target 100% data coverage.
- If coverage fails, do not immediately replace NA with average/median. First improve the formula logic.
- Use Alpha Testing NA replacement only after deciding the missing value is economically acceptable.

## Screening Use

Use Universal Screening to prototype and debug formulas.

Useful tasks in Screening:

- Add raw formula columns.
- Rename references clearly, e.g. `BP_RAW`, `EP_RAW`, `ROE_RAW`.
- Use Parameter View to inspect formulas and counts.
- Use row references for intermediate values.
- Use logic to define investable universe filters.
- Use Screen Iterator when a screen needs to be run across monthly dates.
- Export/archive to OFDB if historical screen outputs need to feed Alpha Testing or automation.

Important distinction:

- `#P` references the parameter result.
- `#UP` references the parameter plus the active screen universe.

## Alpha Testing Use

Use Alpha Testing 4 for portfolio/factor testing.

Prototype setup:

- Universe: Russell 1000
- Benchmark: Russell 1000
- Time series: monthly rebalance
- Calendar: choose consistently; use month-end convention carefully
- Returns: use reliable total return source
- Factors: add raw custom factors first
- MFR: combine factors after raw coverage is validated

For individual factors:

- Choose correct direction, e.g. lower values rank better for P/E or EV/EBITDA, higher values rank better for B/P or E/P.
- Winsorize outliers before z-scoring.
- Use sector/country layering when testing neutralized factors.
- Review raw factor values and factor fractiles.

For Multi-Factor Rank:

- Create raw factors first.
- Add a New Multi-Factor Rank.
- Use z-score or percentile ranking.
- Set component weights.
- Normalize component weights unless there is a reason not to.
- Optionally layer component scores or composite scores by sector/country.

## Construction Tests

Test both construction styles.

Multi-factor rank:

```text
Quality Value Score = 50% Value Score + 50% Quality Score
```

Two-step:

```text
Step 1: select cheapest third by Value Score.
Step 2: rank/select by Quality Score inside that subset.
```

Run the same comparison for:

- Quality Value: Value first, then Quality; also Quality first, then Value
- Quality Growth: Growth first, then Quality; also Quality first, then Growth
- Deep Value: Value only versus Value plus risk/quality guardrails
- Aggressive Growth: Growth first, then revisions/momentum/quality filters

Measure differences:

- Return
- Tracking error
- Hit rate
- Turnover
- Sector/region active weights
- Factor exposure
- Concentration
- Drawdown
- Capacity/liquidity

## Active Manager Exposure Constraints

Use actual active manager holdings to set realistic sector and region limits.

For each manager group:

```text
Active sector weight = manager sector weight - benchmark sector weight
Active region weight = manager region weight - benchmark region weight
```

Then compute the normal exposure range for managers that actually use that style.

Example use:

- If Quality Growth managers are usually overweight Technology, do not force full sector neutrality.
- If Deep Value managers are commonly overweight Financials/Energy, allow controlled active exposure.
- Constraints should reflect real active-manager behavior, not generic benchmark neutrality.

## Immediate Next Step

Build the first coverage workbook/model:

```text
Universe: Russell 1000
Frequency: monthly
Factors: 5-8 value factors first
Output: raw factor value, missing flag, coverage percentage, fallback formula note
```

Deliverable table:

```text
Factor | Formula | Source | Lag | Coverage | Missing Names | Fallback Logic | Keep/Revise
```

After the Russell 1000 value factors work, repeat the same framework for Quality and Growth, then expand to Russell 2000, MSCI EAFE, and MSCI EM.
