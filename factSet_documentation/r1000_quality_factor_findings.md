# R1000 Quality Factor Construction - Findings

**Project:** Aapryl Factor Indices  
**Universe:** Russell 1000 screen export, `1,003` securities  
**Current file reviewed:** `R1000_QUALITY_COMPOSITE.csv`  
**Status:** Quality factor coverage audit started; custom quality formulas not built yet  
**Date:** 2026-05-07

## Purpose

This document records what we have tested so far for the Russell 1000 quality sleeve, why each candidate factor was chosen, what failed, what looks usable, and what should happen next in FactSet.

The key rule from the manager is:

> Any factor that uses information from a standard company report must have 100% data coverage.

That means we cannot jump directly into a quality composite. We first need to prove each raw quality factor has full coverage or can be repaired with custom fallback logic.

## Where We Are

The value factor work is mostly settled:

| Value factor | Result |
|---|---:|
| `CUSTOM_BP` Book/Price | `1003 / 1003` |
| `CUSTOM_EP` Earnings/Price | `1003 / 1003` |
| `CUSTOM_SP` Sales/Price | `1003 / 1003` |
| `CUSTOM_CFP` Cash Flow/Price | `1003 / 1003` |
| `CUSTOM_EBITDA_EV` EBITDA/EV | `915 / 1003`, excluded from broad value composite |

Decision from value work: use the 4-factor universal value composite:

```text
Book/Price
Earnings/Price
Sales/Price
Cash Flow/Price
```

Do not force EBITDA/EV into the broad composite because it structurally fails for Financials and insurance-like businesses.

Now we are starting the same process for Quality.

## Quality Factors We Tried

The current quality screen contains these candidate quality columns:

| Screen column | Intended concept | Available | Missing | Initial view |
|---|---|---:|---:|---|
| Return on Avg Total Equity | ROE / profitability on equity | `953 / 1003` | `50` | Important but problematic |
| Return on Avg Total Assets | ROA / profitability on assets | `1001 / 1003` | `2` | Strong candidate |
| Total Debt% Equity | Debt/Equity leverage | `950 / 1003` | `53` | Problematic denominator |
| Total L T & S T Debt | Appears to be Debt/Assets | `1002 / 1003` | `1` | Strong candidate, rename needed |
| EBIT Margin | Operating profitability margin | `909 / 1003` | `94` | Bad broad coverage |
| Gross Income Margin | Gross margin | `903 / 1003` | `100` | Bad broad coverage |
| Net Cash Flow -Oper | Appears to be Cash Flow Margin | `994 / 1003` | `9` | Good candidate, custom fallback needed |
| Return on Avg Invest Capital | ROIC | `1000 / 1003` | `3` | Strong candidate |

Important column cleanup:

| Current header | Better header |
|---|---|
| `Total L T & S T Debt` | `Debt / Assets` |
| `Net Cash Flow -Oper` | `Cash Flow Margin` |

The export also has duplicates:

| Duplicate column | Result |
|---|---|
| Return on Avg Invest Capital | duplicate values match |
| Net Cash Flow -Oper | duplicate values match |
| Gross Income Margin | duplicate values match |

The duplicate copies can be deleted from the screen to reduce confusion.

## Missingness by Sector

Adding `GICS Sector Name` and `GICS Ind Name` was the right move. It showed that missingness is not random.

### EBIT Margin

Missing `94` companies:

| Sector | Missing |
|---|---:|
| Financials | `79` |
| Health Care | `9` |
| Missing sector tag | `3` |
| Communication Services | `2` |
| Consumer Discretionary | `1` |

Examples:

```text
AFL, ALL, ALLY, AFG, AIG, ACGL, AIZ, AGO, AXS, BAC
```

Interpretation: EBIT Margin is mostly breaking in Financials and insurance-style businesses. This is not just a formula issue. EBIT-style operating metrics are often not meaningful for banks, insurers, and some financial companies.

### Gross Income Margin

Missing `100` companies:

| Sector | Missing |
|---|---:|
| Financials | `84` |
| Health Care | `9` |
| Missing sector tag | `3` |
| Communication Services | `2` |
| Real Estate | `1` |
| Consumer Discretionary | `1` |

Interpretation: Gross Margin has the same structural sector problem as EBIT Margin. It is probably not a good broad-universe quality factor unless used only in sectors where it is economically meaningful.

### ROE and Debt/Equity

ROE missing `50`; Debt/Equity missing `53`.

These are not concentrated only in Financials. They mostly occur when common equity is negative, tiny, or otherwise not a stable denominator.

Examples:

```text
MO, AAL, AZO, CAR, BBWI, BRBR, BKNG, CAH, CCI, DVA
```

Interpretation: ROE and Debt/Equity are important in provider methodologies, but they are risky for a 100% coverage rule because equity can be negative or distorted by buybacks, losses, or accounting structure.

## References and Why These Factors Were Chosen

### MSCI: ROE, Debt/Equity, Earnings Variability

Reference file:

```text
C:\Users\BryanRodas\OneDrive - Xponance\Desktop\project\xponance_research\docs\referenes\msci_important_formulas.md
```

Relevant text:

```text
MSCI believes quality is best captured by a combination of:
- high ROE
- low Debt to Equity
- low Earnings Variability
```

MSCI formula:

```text
ROE = Trailing 12 Month Earnings Per Share / Latest Book Value Per Share
D/E = Total Debt / Book Value
```

MSCI interpretation:

```text
Higher ROE is better for quality.
Lower D/E is better for quality.
Lower Earnings Variability is better for quality.
```

How this affects us:

- ROE is a real quality factor, not something we invented.
- Debt/Equity is also a real quality factor.
- However, in our R1000 test, both fail the 100% coverage requirement because equity is a fragile denominator.
- We may still test ROE later, but it should not be the first broad custom factor unless we can solve the denominator problem.

### Morningstar: ROA plus inverse leverage

Reference file:

```text
C:\Users\BryanRodas\OneDrive - Xponance\Desktop\project\xponance_research\docs\referenes\morningstar_important_formulas.md
```

Relevant formula:

```text
Quality = 1/2 [ ROA_z + (1 - Total Debt / Total Invested Capital)_z ]
```

Relevant text:

```text
Morningstar quality is just two things:
- profitability
- lower leverage
and they are equally weighted.
```

Interpretation:

```text
Higher ROA improves quality.
Lower debt relative to invested capital improves quality.
The quality factor is sector neutralized.
```

How this affects us:

- ROA is strongly supported and has excellent coverage in our file: `1001 / 1003`.
- Leverage belongs in the quality model, but Debt/Assets or Debt/Invested Capital is more stable than Debt/Equity for our coverage requirement.
- This supports using a broad candidate pair like:

```text
ROA
Inverse Debt / Assets
```

### FTSE: profitability, leverage, accruals; margins are not central

Reference file:

```text
C:\Users\BryanRodas\OneDrive - Xponance\Desktop\project\xponance_research\docs\referenes\important_formulas.md
```

Relevant text:

```text
One of its main conclusions is that profitability + leverage is a stronger final definition of quality than profitability + growth.
```

ROA support:

```text
FTSE wants a profitability measure that reflects the economics of the whole firm, not just the equity slice.
ROE can be flattered by leverage, capital structure changes, or buybacks.
ROA is harder to manipulate in that way because it measures earnings against the full asset base.
```

Margin caution:

```text
The paper does not elevate profit margin into the final quality composite because raw margins can vary widely across sectors.
```

Accrual / cash-quality support:

```text
Lower accruals are generally better in this framework.
Higher accruals may indicate less durable earnings quality.
```

How this affects us:

- FTSE supports ROA as a strong first quality factor.
- FTSE supports leverage as a quality/safety component.
- FTSE makes us cautious about EBIT Margin and Gross Margin because raw margins vary too much by sector.
- FTSE supports a cash-quality idea, but a full accruals formula may be too complex for the first pass. Cash Flow Margin is a simpler proxy to test.

### Fidelity: Cash Flow Margin, ROIC, FCF stability; banks handled separately

Reference files:

```text
C:\Users\BryanRodas\OneDrive - Xponance\Desktop\project\xponance_research\docs\referenes\fidelity_important_formulas.md
C:\Users\BryanRodas\OneDrive - Xponance\Desktop\project\xponance_research\docs\referenes\fidelity_global_quality_value_methodology.md
```

Relevant non-bank quality factors:

```text
Cash Flow Margin
Return on Invested Capital
Free Cash Flow Stability
```

Cash Flow Margin formula:

```text
Cash Flow Margin = Operating Cash Flow / Revenue
```

ROIC formula:

```text
ROIC = EBIT / Total Capital
```

Important sector-specific text:

```text
Banks have different accounting structures, leverage norms, and business models.
Fidelity is explicitly recognizing that the same quality framework should not be imposed mechanically on all sectors.
```

Missing-data treatment:

```text
If a quality or value metric is missing for a security, Fidelity assigns that metric a z-score of 0 instead of automatically excluding the stock.
```

How this affects us:

- Fidelity supports Cash Flow Margin and ROIC as real quality factors.
- Fidelity also supports special treatment for banks.
- But our manager gave a stricter rule than Fidelity: report-based factors should have 100% coverage. So we should not immediately copy Fidelity's "missing = 0" treatment without testing and approval.

## Current Factor Assessment

### Strong candidates for custom fallback formulas

| Factor | Why it is attractive |
|---|---|
| ROA | Strong literature support; `1001 / 1003` standard coverage |
| Debt / Assets | Stable leverage denominator; `1002 / 1003` standard coverage |
| ROIC | Fidelity-supported; `1000 / 1003` standard coverage |
| Cash Flow Margin | Fidelity-supported cash-quality proxy; `994 / 1003` standard coverage |

### Factors to delay or sector-limit

| Factor | Issue |
|---|---|
| ROE | Good concept, but equity denominator causes missing values and extreme outliers |
| Debt/Equity | Same equity-denominator problem as ROE |
| EBIT Margin | Mostly missing in Financials; sector-sensitive |
| Gross Margin | Mostly missing in Financials; sector-sensitive |

## Important Design Decision

Do not build the quality composite yet.

The current screen is a coverage audit, not the final model.

The next step is to build custom fallback formulas for the strongest candidates and see if they reach `1003 / 1003`.

Recommended order:

```text
1. CUSTOM_ROA
2. CUSTOM_DEBT_ASSETS
3. CUSTOM_ROIC
4. CUSTOM_CASH_FLOW_MARGIN
```

After those are tested, decide whether to add:

```text
5. Earnings Stability
6. Accruals / Cash Conversion
7. Sector-specific bank quality model
```

## Recommended First Custom Quality Formula to Build

Start with ROA because it has the cleanest cross-provider support and almost full standard coverage already.

Concept:

```text
ROA = Net Income / Average Total Assets
```

Plain English:

```text
How much profit the company generates for each dollar of assets.
```

Why it is better than ROE for our first pass:

```text
ROA uses assets as the denominator.
Assets are rarely negative.
ROE uses equity as the denominator.
Equity can be negative, tiny, or distorted by buybacks.
```

Validation target:

```text
CUSTOM_ROA should be close to Return on Avg Total Assets when both exist.
The custom formula should improve from 1001 / 1003 to 1003 / 1003 if missingness is fixable.
```

## What To Do Next In FactSet

1. Delete duplicate columns:

```text
Return on Avg Invest Capital duplicate
Net Cash Flow -Oper duplicate
Gross Income Margin duplicate
```

2. Rename misleading headers:

```text
Total L T & S T Debt -> Debt / Assets
Net Cash Flow -Oper  -> Cash Flow Margin
```

3. Keep `GICS Sector Name` and `GICS Ind Name`.

4. Add `CUSTOM_ROA` as the first custom quality fallback formula.

5. Add `Statistics -> Number Available`.

6. Export again only after `CUSTOM_ROA` is visible with the statistic row.

## Current Working Conclusion

The quality screen is doing its job. It shows that:

- ROA, Debt/Assets, ROIC, and Cash Flow Margin are the best first candidates.
- ROE and Debt/Equity are important academically/provider-wise but fragile under a 100% coverage rule.
- EBIT Margin and Gross Margin are not good broad-universe factors because they break mostly in Financials.
- The final quality model may need sector-aware logic, especially for banks and insurance-like companies.

This is consistent with the provider references: Morningstar uses ROA and inverse leverage, FTSE emphasizes ROA/profitability plus leverage and warns against raw margins, and Fidelity explicitly handles banks separately.

