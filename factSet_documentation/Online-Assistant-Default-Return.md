---
created: 2026-05-05T19:04:15 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13599
author: 
---

# Online Assistant : Default Return

> ## Excerpt
> By default, Alpha Testing uses equal weight returns. 
  To specify the return type you want applied to your model, click the Returns 
  button and select a return type from the drop-down menu. You can also replicate each of these return types with a custom formula.

---
## Default Return Options Page 13599

By default, Alpha Testing uses [equal weight](https://my.apps.factset.com/oa/pages/13599#ew) returns. To specify the return type you want applied to your model, click the **Returns** button and select a return type from the drop-down menu. You can also replicate each of these return types with a [custom formula](https://my.apps.factset.com/oa/pages/pages/13555#RETURN).

If you do not see the return type you need, you will have to create the return as a [custom column](https://my.apps.factset.com/oa/pages/pages/13554#new). See [Custom Formula Definitions](https://my.apps.factset.com/oa/pages/pages/13555) to view a list of custom formulas available in Alpha Testing.

Alpha Testing offers the following return options:

-   [Annualized](https://my.apps.factset.com/oa/pages/13599#an)
-   [Annualized Median](https://my.apps.factset.com/oa/pages/13599#am)
-   [Annualized Relative](https://my.apps.factset.com/oa/pages/13599#ann_rel)
-   [Annualized Relative Median](https://my.apps.factset.com/oa/pages/13599#arm)
-   [Annualized Weighted Median](https://my.apps.factset.com/oa/pages/13599#awm)
-   [Annualized Weighted Relative](https://my.apps.factset.com/oa/pages/13599#annwr)
-   [Annualized Weighted Relative Median](https://my.apps.factset.com/oa/pages/13599#awrm)
-   [Cumulative](https://my.apps.factset.com/oa/pages/13599#cuml)
-   [Cumulative b0](https://my.apps.factset.com/oa/pages/13599#cbo)
-   [Cumulative Median](https://my.apps.factset.com/oa/pages/13599#cm)
-   [Cumulative Relative](https://my.apps.factset.com/oa/pages/13599#cr)
-   [Cumulative Relative Median](https://my.apps.factset.com/oa/pages/13599#crm)
-   [Cumulative Weighted Relative](https://my.apps.factset.com/oa/pages/13599#cwr)
-   [Cumulative Weighted Relative Median](https://my.apps.factset.com/oa/pages/13599#cwrm)
-   [Equal Weight](https://my.apps.factset.com/oa/pages/13599#ew)
-   [Median](https://my.apps.factset.com/oa/pages/13599#med)
-   [Relative](https://my.apps.factset.com/oa/pages/13599#rr)
-   [Relative Median](https://my.apps.factset.com/oa/pages/13599#rmed)
-   [Weighted](https://my.apps.factset.com/oa/pages/13599#w)
-   [Weighted Annualized](https://my.apps.factset.com/oa/pages/13599#wa)
-   [Weighted Cumulative](https://my.apps.factset.com/oa/pages/13599#wcuml)
-   [Weighted Cumulative b0](https://my.apps.factset.com/oa/pages/13599#wcbo)
-   [Weighted Cumulative Median](https://my.apps.factset.com/oa/pages/13599#wcm)
-   [Weighted Median](https://my.apps.factset.com/oa/pages/13599#wmed)
-   [Weighted Relative](https://my.apps.factset.com/oa/pages/13599#wr)
-   [Weighted Relative Median](https://my.apps.factset.com/oa/pages/13599#wrm)
    

___

## Annualized

Period Statistic: The annualized return ![](online-assistant/23415.html)

where:

-   ![](online-assistant/23415.1.html)is the percent return for the period.
-   n is the number of periods in one year. This number is dependent on the iteration frequency specified in the model (n = 12 for Monthly, n = 52 for Weekly, n = 250 for Daily for all calendars not including the seven-day calendar, and n= 365 for Daily when using the seven-day calendar).
-   R is the return frequency number chosen (i.e. if monthly iteration frequency, with 3 month returns: n=12 and r=3).

Summary Statistic: The annualized geometric mean of the period annualized returns, 100 \* ((n<sup>th</sup> of (multiplicative of (1 + x/100)) )- 1).

where:

-   ![](online-assistant/23415.2.html) is the annualized return for the period.
-   ![](online-assistant/23415.3.html) Is the number of periods.

|**Note**|If one of the individual period annualized returns are -100% then the summary statistic will be NA. To calculate a summary return in this case, use the [Annualized Sum, Cumulative Per](https://my.apps.factset.com/oa/pages/pages/13555#as) return type, which calculates an annualized return from the final period's cumulative return. However, a cumulative return is shown at the period level for this return type.|
|---|---|

[](https://my.apps.factset.com/oa/pages/13599#top)[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Annualized Median

Period Statistic: Calculates the annualized return using the same function as the [annualized](https://my.apps.factset.com/oa/pages/13599#an) return type; however, it uses a median instead of an average for the universe return.

Summary Statistic: The geometric mean of the period annualized median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Annualized Relative

Period Statistic: The annualized relative return for each period.

Summary Statistic: The geometric mean of the period annualized relative returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Annualized Relative Median

Period Statistic: Calculates the annualized relative median using the same function as the [annualized relative](https://my.apps.factset.com/oa/pages/13599#ann_rel) return type; however, it uses a median instead of an average for the universe and benchmark returns.

Summary Statistic: The geometric mean of the period annualized relative median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Annualized Weighted Median

Period Statistic: Calculates a weighted annualized return using the same function as the [weighted annualized](https://my.apps.factset.com/oa/pages/13599#wa) return type; however, it uses a weighted median instead of a weighted average for the universe return.

Summary Statistic: The geometric mean of the period annualized weighted median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Annualized Weighted Relative

Period Statistic: The annualized weighted relative return for each period.

Summary Statistic: The geometric mean of the period annualized weighted relative returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Annualized Weighted Relative Median

Period Statistic: Calculates the annualized weighted relative median as the [annualized weighted relative](https://my.apps.factset.com/oa/pages/13599#annwr) return type; however, it uses a weighted median instead of a weighted average for the universe and benchmark returns.

Summary Statistic: The geometric mean of the period annualized weighted relative median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative

Period Statistic: The cumulative return ![](online-assistant/23415.4.html)

where:

-   ![](online-assistant/23415.5.html) is the initial value (100 or the value of the cumulative return from the prior period).
-   ![](online-assistant/23415.6.html) is the average return for a period.

Summary Statistic: The value of the cumulative return for the final period (Pn).

### Example:

### ![](online-assistant/23415.7.html)

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative b0

Period Statistic: The [cumulative](https://my.apps.factset.com/oa/pages/13599#cuml) return minus 100.

Summary Statistic: The geometric mean of the period cumulative b0 relative returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative Median

Period Statistic: Calculates a cumulative return using the same function as the [cumulative](https://my.apps.factset.com/oa/pages/13599#cuml) return type; however, it uses a median instead of an average for the universe return in the calculation.

Summary Statistic: The value of the cumulative median return for the final period (Pn).

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative Relative

Period Statistic: Converts the relative return for each period into a cumulative return.

Summary Statistic: The geometric mean of the period cumulative relative returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative Relative Median

Period Statistic: Calculates the cumulative relative median using the same function as the [cumulative relative](https://my.apps.factset.com/oa/pages/13599#cr) return type; however, it uses a median instead of an average for the universe return.

Summary Statistic: The geometric mean of the period cumulative relative median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative Weighted Relative

Period Statistic: Converts the weighted relative return for each period into a cumulative return.

Summary Statistic: The geometric mean of the period cumulative weighted relative returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Cumulative Weighted Relative Median

Period Statistic: Calculates cumulative weighted relative median as the [cumulative weighted relative](https://my.apps.factset.com/oa/pages/13599#cwr) return type; however, it uses a weighted median instead of a weighted average for the universe return.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Equal Weight

Period Statistic: The average return for a period ![](online-assistant/23415.8.html)

where:

-   ![](online-assistant/23415.9.html) is the security return.
-   ![](online-assistant/23415.10.html) is the number of companies.

Summary Statistic: The geometric mean of the period equal weight returns, 100 \* ((n<sup>th</sup> of (multiplicative of (1 + x/100)) )- 1).

where:

-   x is the average return for a period.
-   ![](online-assistant/23415.3.html) Is the number of periods.
    

|**Note**|A geometric mean can be NA if an period value is less than -100 (this can happen for difference statistics like F1-FN or excess vs. benchmark). An average summary stat will not have a NA when this occurs (you can [add columns](https://my.apps.factset.com/oa/pages/pages/13554#add) to your report that use an average summary statistic by selecting from the column sub-category called "Average Summary Stat" under the "Returns" and "Returns Type" categories.)|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Median

Period Statistic: The [median](https://my.apps.factset.com/oa/pages/pages/1684) return of the universe for a period.

Summary Statistic: The geometric mean of the period median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Relative

Period Statistic: The average relative return ![](online-assistant/23415.10.html)

where:

-   ![](online-assistant/23415.11.html) is the percent average return for the period.
-   ![](online-assistant/23415.1.html) Is the benchmark's return for the period.

Summary Statistic: The relative geometric mean of the period relative returns, 100 \* ((n<sup>th</sup> of (multiplicative of (1 + x/100)) )- 1).

where:

-   ![](online-assistant/23415.12.html) is the average relative return for the period.
-   ![](online-assistant/23415.13.html) Is the number of periods.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Relative Median

Period Statistic: Calculates a relative return using the as [relative](https://my.apps.factset.com/oa/pages/13599#rr) return type; however, it uses a median instead of an average for the universe and benchmark return.

Summary Statistic: The geometric mean of the period relative median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted

Period Statistic: The weighted return for the period ![](online-assistant/23415.3.html)

where:

-   ![](online-assistant/23415.14.html) is the security return.
-   ![](online-assistant/23415.9.html) Is the security weight.

Summary Statistic: The geometric mean of the period weighted returns, 100 \* ((n<sup>th</sup> of (multiplicative of (1 + x/100)) )- 1).

where:

-   ![](online-assistant/23415.15.html) is the weighted return for the period.
-   ![](online-assistant/23415.16.html) Is the number of periods.

|**Note**|A geometric mean can be NA if an period value is less than -100 (this can happen for difference statistics like F1-FN or excess vs. benchmark). An average summary stat will not have a NA when this occurs (you can add [columns](https://my.apps.factset.com/oa/pages/pages/13554#columns) to your report that use an average summary statistic by selecting from the column sub-category called "Average Summary Stat" under the "Returns" and "Returns Type" categories.)|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Annualized

Period Statistic: The weighted annualized average return ![](online-assistant/23415.13.html)

where:

-   ![](online-assistant/23415.17.html)is the percent weighted average return for the period.
-   n is the number of periods in one year. n is the number of periods in one year. This number is dependent on the iteration frequency specified in the model (n = 12 for Monthly, n = 52 for Weekly, n = 250 for Daily for all calendars not including the seven-day calendar, and n= 365 for Daily when using the seven-day calendar).
-   R is the return frequency number chosen (i.e. if monthly iteration frequency, with 3 month returns: n=12 and r=3).

Summary Statistic: The geometric mean of the period weighted annualized returns, 100 \* ((n<sup>th</sup> of (multiplicative of (1 + x/100)) )- 1).

where:

-   ![](online-assistant/23415.11.html) is the weighted annualized return for the period.
-   ![](online-assistant/23415.18.idunno) Is the number of periods.

|**Note**|If one of the individual period weighted annualized returns are -100% then the summary statistic will be NA. To calculate a summary return in this case, use the [Weighted Annualized Sum, Weighted Cumulative Per](https://my.apps.factset.com/oa/pages/pages/13555#was) return type, which calculates a weighted annualized return from the final period's weighted cumulative return. However, a weighted cumulative return is shown at the period level for this return type.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Cumulative

Period Statistic: The weighted cumulative return ![](online-assistant/23415.16.html)

where:

-   ![](online-assistant/23415.19.html) is the initial value (100 or the value of the cumulative return from the prior period).
-   ![](online-assistant/23415.5.html) is the weighted return for the period.

Summary Statistic: The value of the cumulative weighted return for the final period (Pn).

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Cumulative b0

Period Statistic: The [weighted cumulative](https://my.apps.factset.com/oa/pages/13599#wcuml) minus 100.

Summary Statistic: The value of the weighted cumulative b0 return for the final period (Pn).

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Cumulative Median

Period Statistic: Calculates a weighted cumulative return using the same function as the [weighted cumulative](https://my.apps.factset.com/oa/pages/13599#wcuml) return type; however, it uses a weighted median instead of a weighted average for the universe return.

Summary Statistic: The value of the weighted cumulative median return for the final period (Pn).

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Median

Period Statistic: The [weighted median](https://my.apps.factset.com/oa/pages/pages/7970) return of the universe for a period.

Summary Statistic: The geometric mean of the period weighted median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Relative

Period Statistic: The weighted average relative return ![](online-assistant/23415.15.html)

where:

-   ![](online-assistant/23415.20.html)is the percent weighted average return for the period.
-   ![](online-assistant/23415.17.html)Is the benchmark's return for the period.

Summary Statistic: The geometric mean of the period weighted relative returns, 100 \* ((n<sup>th</sup> of (multiplicative of (1 + x/100))) - 1).

where:

-   ![](online-assistant/23415.1.html)is the average weighted relative return for the period.
-   ![](online-assistant/23415.21.html) Is the number of periods.

[](https://my.apps.factset.com/oa/pages/13599#top)[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)

___

## Weighted Relative Median

Period Statistic: Calculates the weighted relative return using the same function as the [weighted relative](https://my.apps.factset.com/oa/pages/13599#wr) return type; however, it uses a weighted median instead of a weighted average for the universe and benchmark return in the calculation.

Summary Statistic: The geometric mean of the period weighted relative median returns.

[Top of Page](https://my.apps.factset.com/oa/pages/13599#top)
