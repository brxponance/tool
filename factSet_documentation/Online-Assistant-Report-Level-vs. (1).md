---
created: 2026-05-05T19:04:31 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/14077
author: 
---

# Online Assistant : Report Level vs.

> ## Excerpt
> This page explains the difference between the Report Level modifier (:R) and Total Level modifier (:T) and explains when you should use :R versus :T.

---
This page explains the difference between the [Report Level modifier (:R) and Total Level modifier (:T)](https://my.apps.factset.com/oa/pages/pages/13555#level) and explains when you should use :R versus :T.

Topics covered:

-   [Understanding How the Report Level Modifier (:R) and the Total Level Modifier (:T) Work](https://my.apps.factset.com/oa/pages/14077#how)
-   [Knowing When to Use the Report Level Modifier (:R) vs. the Total Level Modifier (:T)](https://my.apps.factset.com/oa/pages/14077#when)

___

## Understanding How the Report Level Modifier (:R) and the Total Level Modifier (:T) Work

There are cases in which the Report Level modifier (:R) and Total Level modifier (:T) return the same results, and other times in which they return different results. This section explains when each scenario would occur. 

Assume you have an Alpha Testing model that contains at least two factors, is grouped by period, and has columns defined such that:

-   Column 1 is the universe return
-   Column 2 is a [Reference Column](https://my.apps.factset.com/oa/pages/pages/13554#REF) using the Period formula COL1-COL1:T
-   Column 3 is a [Reference Column](https://my.apps.factset.com/oa/pages/pages/13554#REF) using the Period formula COL1-COL1:R

### The Same Results Are Returned When:

You select "Factor 1" for Fractile Columns for Columns 2 and 3. The result is the difference between each fractile for Factor 1's return and the Overall Universe's Return.

### Different Results Are Returned When:

You select "Factor 2" for Fractile Columns for Columns 2 and 3.

-   Column 2 (COL1-COL1:T) returns
    
    (Factor 2 fractile n's return - Total Universe return)
    
    The Total Universe Return is calculated using a narrowed-down set of securities for only the fractiles of Factor 2 (the non-current factor). This equals the Factor 2 fractile n return, so the result is zero.
-   Column 3 (COL1-COL1:R) returns
    
    (Factor 2 fractile n's return - Report Universe return)
    
    The Report Universe Return is calculated using all the securities included in the current report for the period. The result is the difference between each fractile of Factor 2's Return and the Overall Universe's Return (or an excess versus universe return for each fractile).

|**Note**|In the Column Selection dialog box, FactSet Columns with "Group" in their name (e.g., Excess Versus Group FN Return) use the Total Level modifier (:T). The FactSet Columns without "Group" in the name (e.g., Excess Versus FN Return) use the Report Level modifier (:R).
|---|---|
![](online-assistant/23417.html)
To see the difference between the FactSet Column types (group versus non-group), add both to a report and group first by factor, then by fractile. Select Factor 1 within the Fractile Columns dialog for each column.|

[Top of Page](https://my.apps.factset.com/oa/pages/14077#top)

___

## Knowing When to Use the Report Level Modifier (:R) vs. the Total Level Modifier (:T)

When using a [reference variable](https://my.apps.factset.com/oa/pages/pages/13555#refmod), such as :R or :T, you substitute the Report Level Modifier (:R) or the Total Level Modifier (:T) with the variable you are modifying.

For example, the Period formula AT\_AVG(#RET:R) retrieves the Report Level Return for the period, then takes the average for the one number. It does not retrieve security-level data within the function and then take the average.

Therefore, AT\_AVG(#RET:R) returns the same result as #RET:R. 

#RET:R is also sensitive to the return type selected. For example, if you change the return type in the Returns drop-down menu to Weighted or Annualized,

#RET:R

results in a new value corresponding to the new return type used for the report.

![](online-assistant/23417.1.html)

You cannot specify the universe of securities internally using a security-level function. For example, using #RET:F1 in the function AT\_AVG(#RET:F1) does not limit the universe to only the securities in Fractile 1. This is because Alpha Testing puts the Period-Level Return for Fractile 1 into the function, thus taking the average for one number.

You can modify the universe of securities used in a function only by applying [filters](https://my.apps.factset.com/oa/pages/pages/13554#factor) to the column. When you use the Filters option in the Factors tab of the Report Settings dialog box, the universe is modified for all functions in your custom formula directory. If you need to apply a filter to some of the functions in your custom formula directory, you must use a Column Reference. A Column Reference lets you specify filtering options using reference variables (e.g., COL1:R or CO1:F1). See the example below.

For a given period, if you want to calculate the % of companies for a certain fractile that outperforms the Universe Median Return, you must include the following two columns in your period-grouped report:

-   First Column:
    
    AT\_MEDIAN(#RET)
-   Second Column:
    
    (AT\_SUM(IF(#RET>COL1:R,1,0))/AT\_COUNT(#RET))\*100 and select "Current Factor" in the Fractile Columns selection for the second column

You cannot calculate the % of companies for a certain fractile that outperforms the Universe Median Return for that period using the following column:

(AT\_SUM(IF(#RET>AT\_MEDIAN(#RET:R),1,0))/AT\_COUNT(#RET))\*100 because #RET:R will bring in the return calculation for the Whole Report Universe based on the return type selected from the Returns drop-down menu.

[Top of Page](https://my.apps.factset.com/oa/pages/14077#top)
