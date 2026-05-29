---
created: 2026-05-05T19:04:58 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13740
author: 
---

# Online Assistant : Difference

> ## Excerpt
> When using the Alpha Testing application, it is important to understand the 
  difference between the Information Coefficient (IC) and Information Ratio (IR) 
  calculations.

---
## Difference between IC and IR Page 13740

When using the Alpha Testing application, it is important to understand the difference between the Information Coefficient (IC) and Information Ratio (IR) calculations.

Topics covered:

-   [Information Coefficient (IC)](https://my.apps.factset.com/oa/pages/13740#ic)
-   [Information Ratio (IR)](https://my.apps.factset.com/oa/pages/13740#ir)

___

## Information Coefficient

The information coefficient (IC) is a very concise measure of how well a factor is correlated with (subsequent) returns. It is the correlation coefficient between the factor rank and the return rank for all companies in the universe for a specific period.

A correlation coefficient always lies between -1 and +1. This is true for the IC as well. A high positive IC means that companies with high factor values tend to yield high returns, whereas a negative IC means that high factor values tend to yield low returns. A company must have both a ranking factor value and a subsequent return available to be included in the IC universe for a particular period.

The IC has one drawback - its value depends very much on the size of the universe. For example, assume an IC of 0.303. This IC is not significant for just five companies, but with a universe of 500 companies such a value would be extraordinary. One way to take into account the size of the universe is to compute the T-Score. This lets you test if any given IC is significant based on the number of companies that went into the computation.

|**Note**|See a T-table for significant T-Scores. When doing a lookup, calculate the degrees of freedom as n-2 where n = the number of companies in the universe for the report period that has data available for returns and the selected factor.|
|---|---|

**IC T-Stat = sqrt \[(n-2)/(1-r × r)\] × r**

**Where:

**n = the number of companies in the universe for the report period that has data available for returns and the selected factor

r = the correlation coefficient between the two arrays (the IC)

[Top of Page](https://my.apps.factset.com/oa/pages/13740#top)

___

## Information Ratio

The Information Ratio (IR) is the ratio of alpha (residual return) the manager can achieve for every level of residual risk assumed. The Information Ratio acts as a budget constraint on the manager, limiting the maximum possible value added. Every investor, regardless of risk aversion, will want an Information Ratio as high as possible. The Information Ratio measures how efficiently information is being used by the manager. The "fundamental law of active management" relates the Information Ratio to skill, the correlation of forecast and realized return (IC), and breadth (the number of independent bets per year).

**IR = Skill \[IC\] \* sqrt {Breadth}**

Typical Information Ratios are (based on Barra studies):

|**Percentile**|**IR**|
|---|---|
|90|1.0|
|75|0.5|
|50|0.0|
|25|\-0.5|
|10|\-1.0|

Examples:

-   Stock picker whose IC = 0.035 BR (Breadth) = 200 stocks/quarter
    
    IR = 0.035 × (200 x 4)^1/2 = .99 (top decile)
-   Market timer whose IC is even higher: .05 BR (Breadth) = once per quarter
    
    IR = 0.05 × (4)^1/2 = 0.10 (barely above average)

[Top of Page](https://my.apps.factset.com/oa/pages/13740#top)
