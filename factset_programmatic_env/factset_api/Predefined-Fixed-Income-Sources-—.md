---
created: 2026-05-11T13:08:36 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/fixed_income_sources.html
author: 
---

# Predefined Fixed Income Sources —

> ## Excerpt
> An Enum for fixed income mcap sources.

---
## FiMcapSources[#](https://fpe.factset.com/docs/fixed_income_sources.html#fimcapsources "Link to this heading")

_enum_ fds.fpe.quant.fi\_sources.FiMcapSources(_value_)[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources "Link to this definition")

An Enum for fixed income mcap sources.

Valid values are as follows:

ML\_EXRET _\= ML\_EXRET : ML\_MKT\_VAL(0,USD)_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.ML_EXRET "Link to this definition")

ICE-BofA sourced market value to match ICE-BofA excess-return-over-government calculation.

ML\_TRET _\= ML\_TRET : ML\_MKT\_VAL(0,USD)_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.ML_TRET "Link to this definition")

ICE-BofA sourced market value to match ICE-BofA total return.

BB\_EXRET _\= BB\_EXRET : LBC\_MKTVAL(0)\*EXRATE(LBC\_CURRENCY\_ISO(0,ISSUER),"USD",ABS\_DATE(0))/1000_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.BB_EXRET "Link to this definition")

Bloomberg-Barclays sourced market value to match the excess-return-over-government calculation based on Bloomberg-Barclays source.

BB\_TRET _\= BB\_TRET : LBC\_MKTVAL(0)\*EXRATE(LBC\_CURRENCY\_ISO(0,ISSUER),"USD",ABS\_DATE(0))/1000_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.BB_TRET "Link to this definition")

Bloomberg-Barclays sourced market value to match Bloomberg-Barclays total return.

ICE\_EXRET _\= ICE\_EXRET : FI\_AMOUNT\_OUT(AMT,0)\*EXRATE(FI\_CURR(DENOM,CODE),"USD",ABS\_DATE(0))\*(FTID\_PRICE(0,MID) + FTID\_AI(0))/100_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.ICE_EXRET "Link to this definition")

FactSet FI sourced market value to match the excess-return-over-government calculation based on FactSet analytics.

PA\_EXRET _\= PA\_EXRET : FI\_AMOUNT\_OUT(AMT,0)\*EXRATE(FI\_CURR(DENOM,CODE),"USD",ABS\_DATE(0))\*(FTID\_PRICE(0,MID) + FTID\_AI(0))/100_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.PA_EXRET "Link to this definition")

FactSet FI sourced market value to match the excess-return-over-government calculation based on FactSet analytics.

PA\_TRET _\= PA\_TRET : FI\_AMOUNT\_OUT(AMT,0)\*EXRATE(FI\_CURR(DENOM,CODE),"USD",ABS\_DATE(0))\*(FTID\_PRICE(0,MID) + FTID\_AI(0))/100_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiMcapSources.PA_TRET "Link to this definition")

FactSet FI sourced market value to match the FactSet analytics total return calculation.

## FiReturnsSources[#](https://fpe.factset.com/docs/fixed_income_sources.html#fireturnssources "Link to this heading")

_enum_ fds.fpe.quant.fi\_sources.FiReturnsSources(_value_)[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources "Link to this definition")

An Enum for fixed income returns sources.

Valid values are as follows:

ML\_EXRET _\= ML\_EXRET : {'D': 'IF(PDNC(-1)=PDNC(0M),ML\_EXC\_RET\_PCT(0,SOVEREIGN)/100,((1+ML\_EXC\_RET\_PCT(0,SOVEREIGN)/100)/(1+ML\_EXC\_RET\_PCT(-1,SOVEREIGN)/100)-1))\*100', 'M': 'ML\_EXC\_RET\_PCT(0,SOVEREIGN)'}_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources.ML_EXRET "Link to this definition")

ICE-BofA calculated excess return over government.

ML\_TRET _\= ML\_TRET : {'D': '(ML\_TOT\_RET(0,USD,UNHEDGED)/ML\_TOT\_RET(ABS\_DATE(-1D),USD,UNHEDGED)-1)\*100', 'M': '(ML\_TOT\_RET(0,USD,UNHEDGED)/ML\_TOT\_RET(ABS\_DATE(-1M),USD,UNHEDGED)-1)\*100'}_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources.ML_TRET "Link to this definition")

ICE-BofA calculated total return.

BB\_EXRET _\= BB\_EXRET : {'D': '(LBC\_OAS(ABS\_DATE(-1D))/260-LBC\_DUR\_SPREAD(ABS\_DATE(-1D))\*(LBC\_OAS(0)-LBC\_OAS(ABS\_DATE(-1D))))', 'M': '(LBC\_OAS(ABS\_DATE(-1M))/12-LBC\_DUR\_SPREAD(ABS\_DATE(-1M))\*(LBC\_OAS(0)-LBC\_OAS(ABS\_DATE(-1M))))'}_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources.BB_EXRET "Link to this definition")

Excess return over government approximation based on Bloomberg-Barclays analytics.

BB\_TRET _\= BB\_TRET : {'D': 'IF(PDNC(-1)=PDNC(0M),((1+LBC\_TOTAL\_RET\_MTD(0)/100)\*(EXRATE(LBC\_CURRENCY\_ISO(0,PRODUCT),"USD",ABS\_DATE(0))/EXRATE(LBC\_CURRENCY\_ISO(0,PRODUCT),"USD",ABS\_DATE(-1D)))-1),(((1+LBC\_TOTAL\_RET\_MTD(0)/100)/(1+LBC\_TOTAL\_RET\_MTD(ABS\_DATE(-1D))/100))\*(EXRATE(LBC\_CURRENCY\_ISO(0,PRODUCT),"USD",ABS\_DATE(0))/EXRATE(LBC\_CURRENCY\_ISO(0,PRODUCT),"USD",ABS\_DATE(-1D)))-1))\*100', 'M': '((1+LBC\_TOTAL\_RET\_MTD(0)/100)\*(EXRATE(LBC\_CURRENCY\_ISO(0,PRODUCT),"USD",ABS\_DATE(0))/EXRATE(LBC\_CURRENCY\_ISO(0,PRODUCT),"USD",ABS\_DATE(-1M)))-1)\*100'}_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources.BB_TRET "Link to this definition")

Bloomberg-Barclays calculated total return.

ICE\_EXRET _\= ICE\_EXRET : {'D': '(FTID\_SPREAD(ABS\_DATE(-1D),OAS,BP,TSY)/260-FTID\_DURATION(ABS\_DATE(-1D),SPRD)\*(FTID\_SPREAD(0,OAS,BP,TSY)-FTID\_SPREAD(ABS\_DATE(-1D),OAS,BP,TSY)))/100', 'M': '(FTID\_SPREAD(ABS\_DATE(-1M),OAS,BP,TSY)/12-FTID\_DURATION(ABS\_DATE(-1M),SPRD)\*(FTID\_SPREAD(0,OAS,BP,TSY)-FTID\_SPREAD(ABS\_DATE(-1M),OAS,BP,TSY)))/100'}_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources.ICE_EXRET "Link to this definition")

Excess return over government approximation based on FactSet analytics.

FDS\_TRET _\= FDS\_TRET : {'D': 'FactSet fixed income source.', 'M': 'FactSet fixed income source.'}_[#](https://fpe.factset.com/docs/fixed_income_sources.html#fds.fpe.quant.fi_sources.FiReturnsSources.FDS_TRET "Link to this definition")

Total return formula based on FactSet analytics.
