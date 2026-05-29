---
created: 2026-05-11T13:07:40 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/metrics.html
author: 
---

# Performance Metrics — FactSet

> ## Excerpt
> fds.fpe.quant.metrics.Metrics lists the predefined performance metrics that can be used with the fds.fpe.quant.Backtest module and with the performance family of functions in fds.fpe.quant.stats. The members of the performance family of functions are as follows:

---
_fds.fpe.quant.metrics.Metrics_ lists the predefined performance metrics that can be used with the [fds.fpe.quant.Backtest](https://fpe.factset.com/docs/backtest.html) module and with the performance family of functions in [fds.fpe.quant.stats](https://fpe.factset.com/docs/stats.html). The members of the performance family of functions are as follows:

-   _stats.performance_
    
-   _stats.performance\_by\_year_
    
-   _stats.performance\_last\_n_
    
-   _stats.performance\_regime_
    
-   _stats.performance\_by\_risk_
    

## List of Supported Metrics[#](https://fpe.factset.com/docs/metrics.html#list-of-supported-metrics "Link to this heading")

_enum_ fds.fpe.quant.metrics.Metrics(_value_)[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics "Link to this definition")

An Enum representing supported performance metrics.

Valid values are as follows:

Sharpe _\= Sharpe_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.Sharpe "Link to this definition")

The ratio between the mean return and the standard deviation of returns

Turnover _\= Turnover_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.Turnover "Link to this definition")

Turnover is the sum of all weight deltas

AMR _\= AMR_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.AMR "Link to this definition")

Arithmetic mean return

GMR _\= GMR_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.GMR "Link to this definition")

Geometric mean return

AAMR _\= AAMR_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.AAMR "Link to this definition")

Annualized arithmetic mean return

AGMR _\= AGMR_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.AGMR "Link to this definition")

Annualized geometric mean return

ArithmeticMeanReturn _\= ArithmeticMeanReturn_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.ArithmeticMeanReturn "Link to this definition")

Arithmetic mean return

GeometricMeanReturn _\= GeometricMeanReturn_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.GeometricMeanReturn "Link to this definition")

Geometric mean return

AnnualizedArithmeticMeanReturn _\= AnnualizedArithmeticMeanReturn_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.AnnualizedArithmeticMeanReturn "Link to this definition")

Annualized arithmetic mean return

AnnualizedGeometricMeanReturn _\= AnnualizedGeometricMeanReturn_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.AnnualizedGeometricMeanReturn "Link to this definition")

Annualized geometric mean return

MaxDrawdown _\= MaxDrawdown_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.MaxDrawdown "Link to this definition")

The maximal drawdown of the compounded returns

LongestDrawdown _\= LongestDrawdown_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.LongestDrawdown "Link to this definition")

The longest drawdown of the compounded returns

NonCompoundedMaxDD _\= NonCompoundedMaxDD_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.NonCompoundedMaxDD "Link to this definition")

The maximal drawdown calculated using the cumulative sum of returns

NonCompoundedLongestDD _\= NonCompoundedLongestDD_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.NonCompoundedLongestDD "Link to this definition")

The longest drawdown calculated using the cumulative sum of returns

pctWin _\= pctWin_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.pctWin "Link to this definition")

% of periods with positive return

VaR _\= VaR_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.VaR "Link to this definition")

Value at risk at 1% confidence level

ETL _\= ETL_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.ETL "Link to this definition")

Expected tail loss at 1% confidence level

dsVol _\= dsVol_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.dsVol "Link to this definition")

The volatility of negative returns

vol _\= vol_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.vol "Link to this definition")

The volatility of returns

ReturnsTStat _\= ReturnsTStat_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.ReturnsTStat "Link to this definition")

Returns t-stat

ExcessReturns _\= ExcessReturns_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.ExcessReturns "Link to this definition")

Excess returns over benchmark

TrackingError _\= TrackingError_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.TrackingError "Link to this definition")

Tracking error with respect to benchmark

IR _\= IR_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.IR "Link to this definition")

Information ratio: mean returns divided by the standard deviation of returns

Alpha _\= Alpha_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.Alpha "Link to this definition")

The intercept of a linear regression of returns vs. benchmark returns

AlphaTStat _\= AlphaTStat_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.AlphaTStat "Link to this definition")

The t-stat of a linear regression of returns vs. benchmark returns

Beta _\= Beta_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.Beta "Link to this definition")

Covariance of returns with respect to benchmark (a.k.a. market sensitivity)

BetaRSquared _\= BetaRSquared_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.BetaRSquared "Link to this definition")

The square of the correlation coefficient R of a linear regression of returns vs. benchmark

HitRate _\= HitRate_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.HitRate "Link to this definition")

Percentage of periods where returns exceed benchmark

HitRateUp _\= HitRateUp_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.HitRateUp "Link to this definition")

Percentage of periods where returns exceed benchmark in an up market (benchmark > 0)

HitRateDown _\= HitRateDown_[#](https://fpe.factset.com/docs/metrics.html#fds.fpe.quant.metrics.Metrics.HitRateDown "Link to this definition")

Percentage of periods where returns exceed benchmark in a down market (benchmark < 0)
