# Factor Index Build Plan

Purpose: build defensible custom factor inputs for Aapryl factor indices, starting with Russell 1000 value and quality factors, then repeat the process across Russell 2000, MSCI EAFE, and MSCI EM.

## Goal

Create custom factors with strong coverage, clear formula logic, and validation evidence before using them in Alpha Testing or portfolio construction.

Target indices:

- Deep Value
- Quality Value
- Quality Growth
- Aggressive Growth

## Current Status

Russell 1000 value factor engineering is complete enough for first-pass composite work:

| Value factor | Status |
|---|---:|
| `CUSTOM_BP` Book/Price | `1003 / 1003` |
| `CUSTOM_EP` Earnings/Price | `1003 / 1003` |
| `CUSTOM_SP` Sales/Price | `1003 / 1003` |
| `CUSTOM_CFP` Cash Flow/Price | `1003 / 1003` |
| `CUSTOM_EBITDA_EV` EBITDA/EV | `915 / 1003`; exclude from broad composite |

Russell 1000 quality factor engineering has started. The current audit is documented in:

```text
r1000_quality_factor_findings.md
```

Best first quality candidates from the current R1000 export:

| Quality factor | Standard coverage | Initial decision |
|---|---:|---|
| ROA | `1001 / 1003` | Build custom fallback first |
| Debt / Assets | `1002 / 1003` | Strong leverage candidate |
| ROIC | `1000 / 1003` | Strong profitability/capital efficiency candidate |
| Cash Flow Margin | `994 / 1003` | Good cash-quality candidate |

Factors to delay or sector-limit:

```text
ROE
Debt/Equity
EBIT Margin
Gross Margin
```

Reason: ROE and Debt/Equity break when equity is negative or tiny. EBIT Margin and Gross Margin are mostly missing in Financials.

## Phase 1: Russell 1000 Raw Value Coverage

Do this in Universal Screening first.

| Factor | Custom Field | Status |
|---|---|---|
| Book to Price | `CUSTOM_BP` | `1003 / 1003`, validated |
| Earnings to Price | `CUSTOM_EP` | `1003 / 1003` |
| Sales to Price | `CUSTOM_SP` | `1003 / 1003` |
| Cash Flow to Price | `CUSTOM_CFP` | `1003 / 1003` |
| EBITDA to Enterprise Value | `CUSTOM_EBITDA_EV` | `915 / 1003`, excluded from broad composite |

For each factor, record:

- Number Available
- Missing Count
- Coverage %
- Standard FactSet comparison ratio
- Notes on differences and edge cases

## Phase 2: Validate Each Formula

Each formula must pass three checks.

### 1. Coverage Check

Use:

```text
Statistics -> Number Available
```

Goal:

```text
Number Available = total universe count
```

For Russell 1000 current test:

```text
Total universe = 1003
```

### 2. Math Check

Compare custom yield-style factors to the inverse of standard FactSet ratios:

```text
CUSTOM_BP        ~= 1 / FF_PBK(ANN_R,0)
CUSTOM_EP        ~= 1 / FF_PE(ANN_R,0)
CUSTOM_SP        ~= 1 / FF_PSALES(ANN_R,0)
CUSTOM_CFP       ~= 1 / FF_PCF(ANN_R,0)
CUSTOM_EBITDA_EV ~= 1 / FF_ENTRPR_VAL_EBITDA_OPER(ANN_R,0)
```

Exact matches are not expected because custom formulas use more current fallback data.

### 3. Economic Sanity Check

Confirm the values make economic sense:

- Higher value = cheaper / more attractive for value.
- Expensive growth companies should usually have low value yields.
- Cheap cyclical, financial, industrial, or distressed companies should usually have higher value yields.
- Negative values should be explainable, not automatically treated as errors.
- Sector-specific problems should be flagged instead of forced into the composite.

## Phase 3: Document Formula Logic

Update `formula_created.md` as formulas are validated.

For each custom formula, document:

- Full formula
- Plain-English meaning
- Numerator logic
- Denominator logic
- Why the direction is correct
- Rulebook or FactSet documentation support
- Validation result
- Caveats

This creates an audit trail for why each factor exists and how it was tested.

## Phase 4: Repeat Across Universes

After Russell 1000 is clean, repeat the same process for:

```text
Russell 2000
MSCI EAFE
MSCI EM
```

Do not assume one formula works everywhere. International universes may need:

- Different lag assumptions
- More semiannual or annual fallbacks
- Different treatment for missing data
- More sector-specific exclusions

## Phase 5: Move Clean Factors To Alpha Testing

Only move factors after raw coverage and validation pass.

Alpha Testing should answer:

- Does the factor predict future returns?
- Does it work by quintile or decile?
- Does it have positive IC / rank correlation?
- Is performance concentrated in one sector?
- Is the factor stable over time?

Test raw factors before testing composites.

## Phase 6: Build Composite Scores

After raw factors are validated, build candidate composite scores.

Initial Deep Value prototype:

```text
VALUE_SCORE = average(
  CUSTOM_BP,
  CUSTOM_EP,
  CUSTOM_SP,
  CUSTOM_CFP,
  CUSTOM_EBITDA_EV
)
```

Use winsorized and standardized values before averaging.

Test at least two construction methods:

```text
Multi-factor ranking = weighted average of standardized factor scores
Two-step approach = first screen on one factor family, then rank on another
```

Examples:

- Cheapest third first, then quality rank
- Quality threshold first, then value rank

## Decision Rules

Keep a factor if:

- Coverage is high
- Values are economically sensible
- Validation against the standard ratio is directionally correct
- Alpha Testing shows useful return behavior

Revise a factor if:

- Missingness comes from fixable formula logic
- Values are distorted by a bad denominator
- A fallback field improves coverage without changing the economic meaning

Exclude or sector-limit a factor if:

- It is mathematically computable but economically invalid for a sector
- It creates misleading values for Financials, REITs, or other special business models
- The signal is unstable or dominated by accounting quirks

## Immediate Next Steps

1. In the quality screen, delete duplicate columns for ROIC, Cash Flow Margin, and Gross Margin.
2. Rename misleading headers:

```text
Total L T & S T Debt -> Debt / Assets
Net Cash Flow -Oper  -> Cash Flow Margin
```

3. Keep `GICS Sector Name` and `GICS Ind Name`.
4. Build and test `CUSTOM_ROA`.
5. Add `Statistics -> Number Available`.
6. Export again and validate whether `CUSTOM_ROA` reaches `1003 / 1003`.
7. Then build `CUSTOM_DEBT_ASSETS`, `CUSTOM_ROIC`, and `CUSTOM_CASH_FLOW_MARGIN`.
