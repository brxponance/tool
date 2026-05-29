---
created: 2026-05-05T19:05:20 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13753
author: 
---

# Online Assistant : UPERCENTILE vs.

> ## Excerpt
> This page explains how the UPERCENTILE and UPERCENTILEX functions differ in behavior when using in quantitative models, such as Alpha Testing.

---
## UPERCENTILE vs. UPERCENTILEX Page 13753

This page explains how the UPERCENTILE and UPERCENTILEX functions differ in behavior when using in quantitative models, such as Alpha Testing.

Topics covered:

-   [Understanding How UPERCENTILE and UPERCENTILEX Differ](https://my.apps.factset.com/oa/pages/13753#understand)
-   [Using UPERCENTILE as a Factor Formula](https://my.apps.factset.com/oa/pages/13753#upercentile)
-   [Using UPERCENTILEX as a Factor Formula](https://my.apps.factset.com/oa/pages/13753#functionwithx)

|**Note**|For the following examples, assume that the universe is "MYCOMPANYLIST", which is specified in the [Universe tab](https://my.apps.factset.com/oa/pages/pages/13552) in FactSet's Alpha Testing 3.0 application.
|---|---|
![](online-assistant/23453.html)|

___

## Understanding How UPERCENTILE and UPERCENTILEX Differ

There can be a significant difference in the Alpha Testing result when you use [UPERCENTILE](https://my.apps.factset.com/oa/pages/pages/1737) versus [UPERCENTILEX](https://my.apps.factset.com/oa/pages/pages/1755) as the factor formula within the [Factors tab](https://my.apps.factset.com/oa/pages/pages/13573). The same applies to similar functions, such as [UFTILE](https://my.apps.factset.com/oa/pages/pages/13773) versus [UFTILEX](https://my.apps.factset.com/oa/pages/pages/13774).

Differences between UPERCENTILE and UPERCENTILEX:

-   UPERCENTILE is a percentile ranking that is relative to a universe.
-   UPERCENTILEX is a percentile ranking that is relative to an exclusive universe.

[Top of Page](https://my.apps.factset.com/oa/pages/13753#)

___

## Using UPERCENTILE as a Factor Formula

The UPERCENTILE function returns the percentile (1-100) position of a company against a specified universe when both the company and the universe are evaluated for the same formula. The number 1 is the highest rank and is assigned to the companies in your report that fall within the top percentile of the specified universe.

### Example

If you use MYCOMPANYLIST as your Alpha Test universe and UPERCENTILE(CM\_P \* CM\_SHS>=100L, CM\_ADR/CM\_P) as your factor formula, then _all the companies_ in MYCOMPANYLIST are:

-   Assigned a percentile (1-100) position
-   Ranked by dividend yield (CM\_ADR/CM\_P)
-   Assigned a percentile rank based upon the percentile ranges of the top 100 largest companies (100L)
    
    ![](online-assistant/23453.1.html)
    

When you rank the 100 largest companies using MP \* MSHS>=100L:

-   A first percentile position is given to securities with a dividend yield (CM\_ADR/CM\_P) of 7.32
-   A second percentile position is given to securities with a dividend yield (CM\_ADR/CM\_P) of 7.18
-   A third percentile position is given to securities with a dividend yield (CM\_ADR/CM\_P) of 6.67

When you rank companies using the UPERCENTILE:

-   A first percentile position is given to securities with a dividend yield greater than or equal to 7.18
-   A second percentile position is given to securities with a dividend yield is less than or equal to 7.18 but greater than 6.67
-   A third percentile position is given to securities with a dividend yield less than or equal to 6.67 but greater than the maximum dividend yield in the fourth percentile of CM\_P \* CM\_SHS>=100L

[Top of Page](https://my.apps.factset.com/oa/pages/13753#)

___

## Using UPERCENTILEX as a Factor Formula

The UPERCENTILEX function returns the percentile (1-100) position of a company in your report against the exclusive universe when both the company and the universe are evaluated for the same formula.

If a company in your report is outside the exclusive universe, but included in the Alpha Test universe for that period, an NA is returned. The universe is put in percentile bins based on all companies specified in the exclusive universe, regardless whether they are in the Alpha Test universe for that period. The number 1 is the highest rank and is assigned to the companies in your report that fall within the top percentile of the specified universe.

|**Note**|UPERCENTILEX does not normalize. It returns the absolute rank if there are fewer than 100 companies in your universe.|
|---|---|

**Example**

If you use the universe MYCOMPANYLIST and UPERCENTILEX(CM\_P \* CM\_SHS>=100L, CM\_ADR/CM\_P) as your factor formula, then:

-   Only the top 100 largest companies (the exclusive universe) for an iteration period are percentile ranked.
-   Companies that are in the MYCOMPANYLIST universe but are _not_ one of the 100 largest companies based on market value (CM\_P \* CM\_SHS) are given an NA value.

|**Notes**|If the top 100 companies from CM\_P \* CM\_SHS>=100L are a subset of MYCOMPANYLIST, then you will see all positions (1-100).
|---|---|
If MYCOMPANYLIST does not include all of the top 100 companies, then you will have some positions (1-100), but not necessarily all.|

[Top of Page](https://my.apps.factset.com/oa/pages/13753#)
