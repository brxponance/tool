---
created: 2026-05-05T19:05:13 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13742
author: 
---

# Online Assistant : Rolling Versus

> ## Excerpt
> In FactSet's quantitative applications, I/B/E/S Consensus data is presented 
  on an "as-was" basis that provides a snapshot of data as it appeared as of the 
  specified backtest date. This behavior is similar to that of I/B/E/S Consensus 
  rolling formulas with 
  _FY1R
  and 
  _FQ1R
  suffixes.

---
## Rolling Versus Non-Rolling in Quantitative Applications Page 13742

In FactSet's quantitative applications, I/B/E/S Consensus data is presented on an "as-was" basis that provides a snapshot of data as it appeared as of the specified backtest date. This behavior is similar to that of I/B/E/S Consensus rolling formulas with [\_FY1R](https://my.apps.factset.com/oa/pages/pages/5865) and [\_FQ1R](https://my.apps.factset.com/oa/pages/pages/5833) suffixes.

### Achieving a Rolling Effect

When using FactSet's Quantitative applications, do not use rolling formulas to achieve a rolling effect. In most situations it is better to use the regular non-rolling versions of the request codes to ensure that all data you are requesting is for the same time period.

|**Note**|In backtesting it is recommended that you use non-rolling formulas for estimates, and rolling formulas for actuals. Rolling formulas roll on the report date, while non-rolling actual and surprise formulas roll on the period-end.|
|---|---|

### Example

With a backtest date of December 31, 1997, both sets of the formulas below will return the same value, which is the mean estimate for the year that was unreported as of December 31, 1997. Both IH and IC codes are given to demonstrate equivalence.

|**Note**|IH formulas are no longer available in Formula Lookup, but are documented here for reference purposes for existing reports. IH formulas have been redirected to refer to the newer I/B/E/S Consensus (IC) database. For more information, see: [IH Screening & FQL Equivalents](https://my.apps.factset.com/oa/pages/pages/15413).|
|---|---|

-   **Non-rolling**:

-   IH\_MEAN\_FY1(0)
-   ICA\_MEAN\_EPS(1,0)

-   **Rolling**:

-   IH\_MEAN\_FY1R(0)
-   ICA\_MEAN\_EPS\_R(1,0)

However, the following formulas may return different values:

-   **Non-rolling** (The non-rolling formula returns the mean estimate as of October 1997 for the year that was unreported as of December 1997):

-   IH\_MEAN\_FY1(-2)
-   ICA\_MEAN\_EPS(1,-2)

-   **Rolling** (The rolling formula returns the mean estimate as of October 1997 for the year that was unreported as of October 1997):

-   IH\_MEAN\_FY1R(-2)
-   ICA\_MEAN\_EPS\_R(1,-2)

If the company in this example reported between October 1997 and December 1997, these two sets of formulas return values for two different fiscal years.
