# Custom Value Fallback Formulas v1

Use these in Universal Screening as custom formula columns after the standard FactSet factor coverage test.

Purpose: improve coverage versus standard FactSet ratios:

| Standard factor | Current R1000 available | Current R1000 coverage |
|---|---:|---:|
| Price / Book Value | 950 / 1003 | 94.7% |
| Price / Earnings Ratio | 870 / 1003 | 86.7% |
| Price / Sales CFY | 995 / 1003 | 99.2% |
| Price / Cash Flow | 954 / 1003 | 95.1% |

These custom formulas invert most ratios into "higher is cheaper/better" style:

- Book to Price, not Price to Book
- Earnings to Price, not Price to Earnings
- Sales to Price, not Price to Sales
- Cash Flow to Price, not Price to Cash Flow
- EBITDA to Enterprise Value, not Enterprise Value to EBITDA

This makes later z-scoring easier because higher values are generally better for value.

## Notes

- These are v1 prototypes. Paste one at a time, validate in Formula Lookup, and add `Number Available` statistics.
- `AVAIL(a,b,c)` uses the first available field.
- `ZAV(x)` treats missing additive EV components as zero.
- Fundamental data is lagged to avoid look-ahead bias:
  - quarterly: `L45D`
  - semiannual: `L60D`
  - annual: `L90D`
- Price and shares are not lagged in these formulas, following the FactSet examples.

## Shared Denominator: Market Cap

If Universal Screening lets you use row references, create this as `CUSTOM_MKT_CAP` first:

```text
FF_PRICE_CLOSE_CP(MON,0) * AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_DIL(ANN,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(ANN,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0),FF_COM_SHS_OUT(ANN,0))
```

If row references are annoying, use the full formulas below directly.

## 1. Custom Book to Price

Suggested heading/reference:

```text
CUSTOM_BP
```

Formula:

```text
AVAIL(FF_COM_EQ(QTR,0 L45D),FF_COM_EQ(SEMI,0 L60D),FF_COM_EQ(ANN,0 L90D)) // (FF_PRICE_CLOSE_CP(MON,0) * AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_DIL(ANN,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(ANN,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0),FF_COM_SHS_OUT(ANN,0)))
```

Compare against:

```text
FF_PBK(ANN_R,0)
```

Expected: should improve over 950 available if missingness comes from annual/restated-only logic.

## 2. Custom Tangible Book to Price

Suggested heading/reference:

```text
CUSTOM_TBP
```

Formula:

```text
(AVAIL(FF_COM_EQ(QTR,0 L45D),FF_COM_EQ(SEMI,0 L60D),FF_COM_EQ(ANN,0 L90D)) - ZAV(AVAIL(FF_INTANG(QTR,0 L45D),FF_INTANG(SEMI,0 L60D),FF_INTANG(ANN,0 L90D)))) // (FF_PRICE_CLOSE_CP(MON,0) * AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_DIL(ANN,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(ANN,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0),FF_COM_SHS_OUT(ANN,0)))
```

Use as an alternate/diagnostic for Book to Price.

## 3. Custom Earnings to Price

Suggested heading/reference:

```text
CUSTOM_EP
```

Formula:

```text
AVAIL(FF_EPS_DIL(LTM,0 L45D),FF_EPS_DIL(LTM_SEMI,0 L60D),FF_EPS(LTM,0 L45D),FF_EPS(LTM_SEMI,0 L60D),FF_EPS_DIL(ANN,0 L90D),FF_EPS_BASIC(ANN,0 L90D),FF_EPS(ANN,0 L90D)) // FF_PRICE_CLOSE_CP(MON,0)
```

Compare against:

```text
FF_PE(ANN_R,0)
```

Important: this should return negative earnings yield for loss-making companies instead of dropping them as missing. That is usually better for coverage; later we can winsorize or rank negative values appropriately.

## 4. Custom Sales to Price

Suggested heading/reference:

```text
CUSTOM_SP
```

Formula:

```text
(AVAIL(FF_SALES(LTM,0 L45D),FF_SALES(LTM_SEMI,0 L60D),FF_SALES(ANN,0 L90D)) // AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_DIL(ANN,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(ANN,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0),FF_COM_SHS_OUT(ANN,0))) // FF_PRICE_CLOSE_CP(MON,0)
```

Compare against:

```text
FF_PSALES(ANN_R,0)
```

Expected: this may get close to 100% but still fail for companies with unusual/no sales.

## 5. Custom Cash Flow to Price

Suggested heading/reference:

```text
CUSTOM_CFP
```

Formula:

```text
(AVAIL(FF_OPER_CF(LTM,0 L45D),FF_OPER_CF(LTM_SEMI,0 L60D),FF_OPER_CF(ANN,0 L90D)) // AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_DIL(ANN,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(ANN,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0),FF_COM_SHS_OUT(ANN,0))) // FF_PRICE_CLOSE_CP(MON,0)
```

Compare against:

```text
FF_PCF(ANN_R,0)
```

## 6. Custom EBITDA to Enterprise Value

Suggested heading/reference:

```text
CUSTOM_EBITDA_EV
```

Formula:

```text
AVAIL(FF_EBITDA_OPER(LTM,0 L45D),FF_EBITDA_OPER(LTM_SEMI,0 L60D),FF_EBITDA_OPER(QTR,0 L45D),FF_EBITDA_OPER(SEMI,0 L60D),FF_EBITDA_OPER(ANN,0 L90D)) // ((FF_PRICE_CLOSE_CP(MON,0) * AVAIL(FF_COM_SHS_OUT_EPS_DIL(QTR,0),FF_COM_SHS_OUT_EPS_DIL(SEMI,0),FF_COM_SHS_OUT_EPS_DIL(ANN,0),FF_COM_SHS_OUT_EPS_BASIC(QTR,0),FF_COM_SHS_OUT_EPS_BASIC(SEMI,0),FF_COM_SHS_OUT_EPS_BASIC(ANN,0),FF_COM_SHS_OUT(QTR,0),FF_COM_SHS_OUT(SEMI,0),FF_COM_SHS_OUT(ANN,0))) + ZAV(AVAIL(FF_PFD_STK(QTR,0 L45D),FF_PFD_STK(SEMI,0 L60D),FF_PFD_STK(ANN,0 L90D))) + ZAV(AVAIL(FF_DEBT(QTR,0 L45D),FF_DEBT(SEMI,0 L60D),FF_DEBT(ANN,0 L90D))) + ZAV(AVAIL(FF_MIN_INT_ACCUM(QTR,0 L45D),FF_MIN_INT_ACCUM(SEMI,0 L60D),FF_MIN_INT_ACCUM(ANN,0 L90D))) - ZAV(AVAIL(FF_CASH_ST(QTR,0 L45D),FF_CASH_ST(SEMI,0 L60D),FF_CASH_ST(ANN,0 L90D))))
```

Compare against:

```text
FF_ENTRPR_VAL_EBITDA_OPER(ANN_R,0)
```

This one may still be sector-sensitive, especially for Financials and REITs. If coverage is poor or economics are weird, we may exclude it from the broad composite or use it only outside Financials/Real Estate.

## Coverage Test Template

After adding each custom formula, apply:

```text
Statistics -> Number Available
```

Then record:

```text
Missing Count = 1003 - Number Available
Coverage % = Number Available / 1003
```

Use this table:

| Factor | Standard available | Custom available | Improvement | Keep/Revise |
|---|---:|---:|---:|---|
| Price/Book vs CUSTOM_BP | 950 |  |  |  |
| Price/Earnings vs CUSTOM_EP | 870 |  |  |  |
| Price/Sales vs CUSTOM_SP | 995 |  |  |  |
| Price/Cash Flow vs CUSTOM_CFP | 954 |  |  |  |
| EV/EBITDA vs CUSTOM_EBITDA_EV |  |  |  |  |

