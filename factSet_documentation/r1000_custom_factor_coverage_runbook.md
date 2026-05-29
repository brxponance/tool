# Russell 1000 Custom Factor Coverage Runbook

Goal: build the first custom factor coverage test for the Russell 1000 before constructing the factor indices.

This runbook is designed for FactSet Universal Screening first, then Alpha Testing 4.

## First Deliverable

Create a coverage table for Value factors on Russell 1000:

```text
Universe: Russell 1000
Date: latest month-end first, then historical monthly dates
Factors: VAL_BP, VAL_TBP, VAL_EP, VAL_CFP, VAL_SP, VAL_EBIT_EV, VAL_EBITDA_EV
Output: available count, missing count, coverage %, missing securities, sector concentration of missingness
```

## Step 1: Create The Screening Prototype

Open Universal Screening:

```text
@US
```

Create a new Equity screen.

Use a backtest/month-end date first. For monthly work, use month-end convention carefully:

```text
MM/31/YYYY
```

The docs warn that monthly lagging behaves best when month-end dates are represented this way.

## Step 2: Define Russell 1000 Universe

In Criteria, use a date-sensitive Russell index formula rather than a current-only index picker.

Prototype:

```text
ISON_RUSSELL_IDX(0,1000,CLOSE)
```

The FactSet docs show the Russell 2000 pattern as:

```text
ISON_RUSSELL_IDX(0,2000,CLOSE)
```

So validate the Russell 1000 version in Formula Lookup. If the formula name/argument differs in your FactSet environment, use Formula Lookup and preserve the same principle: date-sensitive index membership with relative date `0`.

## Step 3: Add Identifier And Classification Columns

Add these first:

| Column | Purpose |
|---|---|
| Company Name | Identify missing names. |
| Symbol / FactSet ID | Export key. |
| Sector | Find sector-level missingness. |
| Industry | Optional detail. |
| Country / Region | Needed later for EAFE/EM process. |
| Market Cap | Sanity check and weighting. |

Use Formula Lookup for sector/country fields. Keep the reference names short and clear.

Suggested reference names:

```text
NAME
FSYM
SECTOR
INDUSTRY
COUNTRY
REGION
MKT_CAP
```

## Step 4: Add Intermediate Financial Fields

Add reusable intermediate rows before final factors.

Suggested references:

```text
PX_M
SHS_QS
MKT_CAP
EV_QS
BOOK_QS
TBOOK_QS
EPS_LTM
OCF_LTM
SALES_LTM
EBIT_LTM
EBITDA_LTM
```

Starter formulas are in:

```text
xponance_factor_library_v0.md
```

Why this matters: if `VAL_BP` has missing data, you need to know whether the missingness comes from price, shares, book value, or the row-reference logic.

## Step 5: Add First Value Factors

Start with these seven:

```text
VAL_BP
VAL_TBP
VAL_EP
VAL_CFP
VAL_SP
VAL_EBIT_EV
VAL_EBITDA_EV
```

Do not build the composite yet. First make each raw factor survive coverage testing.

## Step 6: Add Coverage Flags

For each factor, add a missing flag.

Prototype pattern:

```text
IF(ISNA(#P.VAL_BP),1,0)
```

If your Screening function name differs for missing checks, use Function Builder to create an "is not available" condition or equivalent. The goal is simple:

```text
1 = missing
0 = available
```

Suggested reference names:

```text
MISS_VAL_BP
MISS_VAL_TBP
MISS_VAL_EP
MISS_VAL_CFP
MISS_VAL_SP
MISS_VAL_EBIT_EV
MISS_VAL_EBITDA_EV
```

## Step 7: Record Coverage

For each factor:

```text
Coverage % = 1 - (missing count / Russell 1000 count)
```

Record the output in:

```text
factor_coverage_template.csv
```

Important: do not accept `Replace with Median` as the first fix. If a standard-report item is missing, inspect the formula and add a fallback.

## Step 8: Diagnose Missing Data

For each factor with missing values:

1. Sort descending by missing flag.
2. Export missing securities.
3. Check missingness by sector.
4. Check missingness by country/region, even in Russell 1000.
5. Check the intermediate fields.
6. Decide whether the formula needs a fallback or whether the factor should exclude a business type.

Examples:

```text
VAL_BP missing because BOOK_QS missing
VAL_CFP missing because OCF_LTM missing
VAL_EBITDA_EV missing because EBITDA missing for financials
VAL_EBIT_EV missing because EV denominator is missing or not meaningful
```

## Step 9: First Fallback Revision Loop

Use this loop until coverage is acceptable:

```text
Raw formula -> coverage result -> missing source -> fallback formula -> rerun coverage
```

Possible fallback patterns:

```text
AVAIL(Quarterly item, Semiannual item, Annual item)
AVAIL(Diluted shares, Basic shares, Common shares)
AVAIL(LTM quarterly, LTM semiannual, Annual)
ZAV(non-core balance sheet component)
```

## Step 10: Move Cleaned Factors To Alpha Testing

Open Alpha Testing 4:

```text
@AT4
```

Prototype model:

| Setting | Value |
|---|---|
| Universe | Russell 1000 |
| Benchmark | Russell 1000 |
| Time Series | Monthly |
| Return Horizon | 1 month forward return |
| Factor Rebalance | Monthly |
| Factors | Cleaned Value factors only first |
| Factor Transform | Winsorize, then z-score or percentile |

Run raw factor tests before building the MFR.

## Step 11: Create First Value MFR

Only after coverage passes:

```text
VALUE_SCORE = 20% VAL_BP + 20% VAL_EP + 20% VAL_CFP + 20% VAL_SP + 20% VAL_EBITDA_EV
```

Alpha Testing setup:

1. Add each cleaned raw factor.
2. Add New Multi-Factor Rank.
3. Add components.
4. Use Z-Score or Percentile.
5. Set component weights.
6. Normalize component weights.
7. Fractile the composite into deciles or quintiles.

## Step 12: Save The First Result

After running:

Export:

- Constituents
- Raw factor values
- Factor fractiles
- VALUE_SCORE
- Forward returns
- Sector and country fields

This output becomes the baseline for comparing:

```text
Deep Value raw ranking
Quality Value multi-factor rank
Two-step Value then Quality
```

## Definition Of Done For This First Slice

The Russell 1000 Value prototype is complete when:

- All seven raw value factors have coverage results.
- Missing data causes are documented.
- Fallback formulas are documented.
- At least five value factors are approved for `VALUE_SCORE`.
- Alpha Testing can run the raw factors without major NA leakage.
- One initial `VALUE_SCORE` MFR exists and can produce decile/quintile results.

