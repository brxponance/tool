# Xponance Factor Library v0

Purpose: define custom FactSet factors before building the Deep Value, Quality Value, Quality Growth, and Aggressive Growth indices.

This file is the first working draft. Treat every formula as a prototype to paste into Universal Screening, validate with Formula Lookup, and coverage-test by universe/date before using in Alpha Testing.

## Build Order

1. Prototype formulas in Universal Screening.
2. Validate coverage on Russell 1000 first.
3. Fix missing data with custom fallback logic.
4. Move cleaned factors into Alpha Testing.
5. Build composite scores using Multi-Factor Rank.
6. Repeat for Russell 2000, MSCI EAFE, and MSCI EM.

## Shared Formula Principles

- Use point-in-time relative dates, not absolute dates.
- Do not use `NOW` in backtests.
- Price and shares usually do not need lags.
- Quarterly fundamentals usually use `L45D`.
- Semiannual fundamentals usually use `L60D`.
- Annual fundamentals usually use `L90D`.
- Use `AVAIL(a,b,c)` to choose the first available value.
- Use `ZAV(x)` only when missing should economically behave as zero, such as cash/debt components in enterprise value.
- Prefer fixing formula coverage before using Alpha Testing NA replacement.

## Common Intermediate Fields

Use these as row references in Universal Screening where possible.

| Field | Prototype Formula | Notes |
|---|---|---|
| `PX_M` | `FF_PRICE_CLOSE_CP(MON,0)` | Month-end price; no lag. |
| `SHS_QS` | `AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0))` | Broad fallback for shares. Validate units. |
| `MKT_CAP` | `#P.PX_M * #P.SHS_QS` | If row references are not available, inline price and shares. |
| `EV_QS` | `#P.MKT_CAP + ZAV(AVAIL(FF_PFD_STK(QTR,0 L45D),FF_PFD_STK(SEMI,0 L60D))) + ZAV(AVAIL(FF_DEBT(QTR,0 L45D),FF_DEBT(SEMI,0 L60D))) + ZAV(AVAIL(FF_MIN_INT_ACCUM(QTR,0 L45D),FF_MIN_INT_ACCUM(SEMI,0 L60D))) - ZAV(AVAIL(FF_CASH_ST(QTR,0 L45D),FF_CASH_ST(SEMI,0 L60D)))` | Enterprise value fallback using quarterly/semiannual data. |
| `SECTOR` | Use FactSet/GICS sector formula from Formula Lookup | Needed for sector coverage and layering. |
| `COUNTRY_REGION` | Use FactSet country/region formula from Formula Lookup | Needed for EAFE/EM constraints. |

## Value Factors

Start here. These are the first coverage test candidates.

| Factor ID | Name | Prototype Formula | Direction | Alpha Testing Handling |
|---|---|---|---|---|
| `VAL_BP` | Book to Price | `AVAIL(FF_COM_EQ(QTR,0 L45D),FF_COM_EQ(SEMI,0 L60D),FF_COM_EQ(ANN,0 L90D)) / #P.MKT_CAP` | Higher is cheaper/better | Winsorize, z-score, higher ranks better. |
| `VAL_TBP` | Tangible Book to Price | `(AVAIL(FF_COM_EQ(QTR,0 L45D),FF_COM_EQ(SEMI,0 L60D),FF_COM_EQ(ANN,0 L90D)) - ZAV(AVAIL(FF_INTANG(QTR,0 L45D),FF_INTANG(SEMI,0 L60D),FF_INTANG(ANN,0 L90D)))) / #P.MKT_CAP` | Higher is cheaper/better | Useful fallback/check for financials and intangible-heavy firms. |
| `VAL_EP` | Earnings to Price | `AVAIL(FF_EPS(LTM,0 L45D),FF_EPS(LTM_SEMI,0 L60D),FF_EPS(ANN,0 L90D)) / #P.PX_M` | Higher is cheaper/better | Negative earnings should be retained but winsorized; inspect outliers. |
| `VAL_CFP` | Cash Flow to Price | `(AVAIL(FF_OPER_CF(LTM,0 L45D),FF_OPER_CF(LTM_SEMI,0 L60D)) / #P.SHS_QS) / #P.PX_M` | Higher is cheaper/better | Use operating cash flow; test coverage by sector. |
| `VAL_SP` | Sales to Price | `(AVAIL(FF_SALES(LTM,0 L45D),FF_SALES(LTM_SEMI,0 L60D),FF_SALES(ANN,0 L90D)) / #P.SHS_QS) / #P.PX_M` | Higher is cheaper/better | Often high coverage; useful robust value anchor. |
| `VAL_EBIT_EV` | EBIT to EV | `AVAIL(FF_EBIT_OPER(LTM,0 L45D),FF_EBIT_OPER(LTM_SEMI,0 L60D),FF_EBIT_OPER(ANN,0 L90D)) / #P.EV_QS` | Higher is cheaper/better | May need financial-sector handling. |
| `VAL_EBITDA_EV` | EBITDA to EV | `AVAIL(FF_EBITDA_OPER(LTM,0 L45D),FF_EBITDA_OPER(LTM_SEMI,0 L60D),FF_EBITDA_OPER(ANN,0 L90D)) / #P.EV_QS` | Higher is cheaper/better | Useful for industrial/non-financial comparisons. |

Suggested initial Value composite:

```text
VALUE_SCORE = 20% VAL_BP + 20% VAL_EP + 20% VAL_CFP + 20% VAL_SP + 20% VAL_EBITDA_EV
```

Keep `VAL_TBP` and `VAL_EBIT_EV` as diagnostics or alternates until coverage and performance are validated.

## Quality Factors

Build after Value coverage is working.

| Factor ID | Name | Prototype Formula | Direction | Notes |
|---|---|---|---|---|
| `QUAL_ROE` | Return on Equity | `100 * AVAIL(FF_NET_INC(LTM,0 L45D),FF_NET_INC(LTM_SEMI,0 L60D),FF_NET_INC(ANN,0 L90D)) / AVAIL(AVG(FF_SHLDRS_EQ(QTR,0 L45D),FF_SHLDRS_EQ(QTR,-4 L45D)),AVG(FF_SHLDRS_EQ(SEMI,0 L60D),FF_SHLDRS_EQ(SEMI,-2 L60D)),AVG2(FF_SHLDRS_EQ(ANN,0 L90D)))` | Higher is better | Watch negative equity. |
| `QUAL_ROIC` | Return on Invested Capital | `100 * AVAIL(FF_NET_INC(LTM,0 L45D),FF_NET_INC(LTM_SEMI,0 L60D),FF_NET_INC(ANN,0 L90D)) / AVAIL(AVG(FF_INVEST_CAP(QTR,0 L45D),FF_INVEST_CAP(QTR,-4 L45D)),AVG(FF_INVEST_CAP(SEMI,0 L60D),FF_INVEST_CAP(SEMI,-2 L60D)),AVG2(FF_INVEST_CAP(ANN,0 L90D)))` | Higher is better | Core quality measure. |
| `QUAL_OP_MARGIN` | Operating Margin | `100 * AVAIL(FF_OPER_INC(LTM,0 L45D),FF_OPER_INC(LTM_SEMI,0 L60D),FF_OPER_INC(ANN,0 L90D)) / AVAIL(FF_SALES(LTM,0 L45D),FF_SALES(LTM_SEMI,0 L60D),FF_SALES(ANN,0 L90D))` | Higher is better | Compare within sectors if needed. |
| `QUAL_DEBT_CAP` | Debt to Capital | `AVAIL(FF_DEBT(QTR,0 L45D),FF_DEBT(SEMI,0 L60D),FF_DEBT(ANN,0 L90D)) / AVAIL(FF_TCAP(QTR,0 L45D),FF_TCAP(SEMI,0 L60D),FF_TCAP(ANN,0 L90D))` | Lower is better | Use lower-rank-better or multiply by -1. |
| `QUAL_EARN_VAR` | Earnings Variability | `AVAIL(STD5(FF_EPS(ANN,0 L90D)) / AVG5(FF_EPS(ANN,0 L90D)),STD5(FF_EBIT_OPER(LTM,0 L45D)) / AVG5(FF_EBIT_OPER(LTM,0 L45D)),STD5(FF_EBIT_OPER(LTM_SEMI,0 L60D)) / AVG5(FF_EBIT_OPER(LTM_SEMI,0 L60D)))` | Lower is better | Stability proxy; check negative denominators. |

Suggested initial Quality composite:

```text
QUALITY_SCORE = 25% QUAL_ROE + 25% QUAL_ROIC + 20% QUAL_OP_MARGIN + 15% inverse(QUAL_DEBT_CAP) + 15% inverse(QUAL_EARN_VAR)
```

## Growth Factors

| Factor ID | Name | Prototype Formula | Direction | Notes |
|---|---|---|---|---|
| `GROW_SALES_5Y` | Sales Growth 5Y | `EXPSMOOTH5(0.8,FF_SALES_GR(ANN,0 L90D))` | Higher is better | From FactSet backtesting library pattern. |
| `GROW_EPS_5Y` | EPS Growth 5Y | `RATE5(FF_EPS(ANN,0 L90D))` | Higher is better | Watch negative/low base effects. |
| `GROW_EBIT_5Y` | EBIT Growth 5Y | `RATE5(FF_EBIT_OPER(ANN,0 L90D))` | Higher is better | Alternative to EPS. |
| `GROW_FWD_EPS` | Forward EPS Growth | `100 * (FE_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / FE_ACTUAL(ACTUAL,EPS,ANNUAL,0,0,'CURRENCY=LOCAL,FIXEDRATE=NO,RT=N') - 1)` | Higher is better | Estimate-based; coverage may vary. |
| `GROW_LTG` | Long-Term EPS Growth | `FE_ESTIMATE(EPS_LTG,MEAN,ANNUAL,1,0,'CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N')` | Higher is better | Useful for growth style; test coverage. |

## Aggressive Growth Add-Ons

| Factor ID | Name | Prototype Formula | Direction | Notes |
|---|---|---|---|---|
| `AG_EPS_REV` | EPS Estimate Revision | `FE_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / AVG(FE_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'),FE_ESTIMATE(EPS,MEAN,ANNUAL,+1,-1/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'),FE_ESTIMATE(EPS,MEAN,ANNUAL,+1,-2/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'))` | Higher is better | From FactSet backtesting library pattern. |
| `AG_UPDOWN_REV` | Up minus Down EPS Revisions | `100 * (FE_ESTIMATE(EPS,UP,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,AWIN=30') - FE_ESTIMATE(EPS,DOWN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,AWIN=30')) / FE_ESTIMATE(EPS,NEST,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,WIN=30')` | Higher is better | Analyst revision breadth. |
| `AG_MOM_12_1` | 12-1 Price Momentum | Use price total return formula from FactSet Price/Return source, excluding most recent month | Higher is better | Fill after confirming preferred price-return function. |

## First Alpha Testing Composite Map

| Index | First Draft Composite |
|---|---|
| Deep Value | `100% VALUE_SCORE`, with possible quality/liquidity guardrails. |
| Quality Value | `50% VALUE_SCORE + 50% QUALITY_SCORE`. Also test Value-first two-step. |
| Quality Growth | `50% GROWTH_SCORE + 50% QUALITY_SCORE`. Also test Growth-first two-step. |
| Aggressive Growth | `50% GROWTH_SCORE + 25% REVISION_SCORE + 25% MOMENTUM_SCORE`, with weaker quality guardrails. |

## First Coverage Decision Rules

Use this before approving any factor:

| Status | Rule |
|---|---|
| Keep | Coverage is near 100%, formula economics are clear, outliers are manageable. |
| Revise | Missing data is above tolerance or concentrated in sectors/regions. |
| Conditional | Works for US but fails in EAFE/EM, or works outside financials only. |
| Reject | Missingness cannot be solved or factor is not economically comparable. |

