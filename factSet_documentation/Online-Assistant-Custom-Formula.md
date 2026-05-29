---
created: 2026-05-05T19:04:12 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13555
author: 
---

# Online Assistant : Custom Formula

> ## Excerpt
> This page lists the custom formulas available in Alpha Testing. Use custom formulas to add custom statistics to your Alpha Testing reports. You can add custom formulas to your reports by using the Custom Formula Lookup utility in the Columns tab of the Report Settings dialog box.

---
## Custom Formula Definitions Page 13555

This page lists the custom formulas available in Alpha Testing. Use custom formulas to add custom statistics to your Alpha Testing reports. You can add [custom formulas](https://my.apps.factset.com/oa/pages/pages/13554#new) to your reports by using the Custom Formula Lookup utility in the [Columns tab](https://my.apps.factset.com/oa/pages/pages/13554#columns) of the Report Settings dialog box.

Formulas covered:

-   [Alpha Testing Formulas](https://my.apps.factset.com/oa/pages/13555#new)
-   [Fixed References](https://my.apps.factset.com/oa/pages/13555#fixed)
-   [Reference Modifiers](https://my.apps.factset.com/oa/pages/13555#refmod)
-   [Pound Variables](https://my.apps.factset.com/oa/pages/13555#var)
-   [Return Types](https://my.apps.factset.com/oa/pages/13555#return)
-   [Default Report Formulas](https://my.apps.factset.com/oa/pages/13555#formulas)

___

## Alpha Testing Formulas

These formulas are used to apply statistics to your report universe. At the period level, the statistic is calculated on the universe constituents for each period. At the summary level, the statistic is calculated using the period's results. These formulas use [fixed references](https://my.apps.factset.com/oa/pages/13555#fixed) as their arguments.

AT\_AVG

Average

AT\_CORREL

Correlation (Pearson's Correlation)

AT\_COUNT

Count

AT\_GEO\_MEAN

Geometric Mean (Return values used in this formula must be in decimal form.)

AT\_HAVG

Harmonic Average

AT\_INTERCEPT

Simple Regression Intercept

AT\_MAX

Maximum

AT\_MEDIAN

Median

AT\_MIN

Minimum

AT\_RANK

Ranks each item in the data set. You must use this formula within another AT\_ formula. For example, AT\_AVG(AT\_RANK(#RET)) calculates the average of each return's ranking.

AT\_RANKHIGH

Ranks each item in the data set with any ties all assigned to the highest rank. You must use this formula within another AT\_ formula. For example, AT\_AVG(AT\_RANKHIGH(#RET)) calculates the average of each return's ranking.

AT\_RANKLOW

Ranks each item in the data set with any ties all assigned to the lowest rank. You must use this formula within another AT\_ formula. For example, AT\_AVG(AT\_RANKLOW(#RET)) calculates the average of each return's ranking.

AT\_RANKMEAN

Ranks each item in the data set with any ties all assigned to the mean rank. You must use this formula within another AT\_ formula. For example, AT\_AVG(AT\_RANKMEAN(#RET)) calculates the average of each return's ranking.

AT\_RCORREL

Spearman Ranked Correlation (used in IC and FC calculations)

AT\_RETURN\_SUMMARY\_CALC

This formula does not accept any arguments. The result is the summary-level return. For example, if your return type is set to "Weighted," the result is the geometric mean of the period-level returns. However, if your return type is set to "Cumulative," the result is the last period return.

AT\_SLOPE

Simple Regression Slope

AT\_STD

Standard Deviation of a Sample

AT\_STDP

Standard Deviation of a Population

AT\_SUM

Sum

AT\_WAVG

Weighted Average

AT\_WHAVG

Weighted Harmonic Average

AT\_WMEDIAN

Weighted Median

AT\_WSTD

Weighted Standard Deviation of a Sample

AT\_WSTDP

Weighted Standard Deviation of a Population

AT\_ZSCORE

Calculates a z-score for each item in the data set. You must use this formula within another AT\_ formula. For example, AT\_AVG(AT\_ZSCORE(#RET)) calculates the average of each return's z-score.

|**Notes**|**Formulas With Two Arguments**
|---|---|
This section explains which AT\_ formulas require two arguments:
-   All the weighted formulas listed above (e.g., AT\_WAVG, AT\_WHAVG, AT\_WMEDIAN, AT\_WSTD, and AT\_WSTDP). The first argument is weight (e.g., #WGT) and the second argument is the data item (e.g., #RET).
-   AT\_INTERCEPT and AT\_SLOPE accept two arguments: the first argument is the X dataset (e.g., #BMK:P) and the second argument is the Y data set (e.g., #RET:P).
-   AT\_CORREL and AT\_RCORREL accept any two datasets as arguments.
**Using Data Sets as Custom Formula Arguments**
Alpha Testing's custom formulas only accept a single set of data in their arguments. A set of data is either security-level data for one period or a set of period-level results.
**Examples:**
The period formula
AT\_AVG(#RET)
calculates the average return for each security in the universe for the one period.
The summary formula
AT\_AVG(COL5:P)
calculates the average of each period's result for Column 5.
The column reference period formula
AT\_AVG(COL1,COL2,COL3)
returns the result for Column 1. It does not calculate the average for Columns 1 to 3.
To calculate statistics across data sets, use [FactSet Statistical Functions](https://my.apps.factset.com/oa/pages/pages/1492), such as
AVG(COL1,COL2,COL3)
,
which calculates the average for Columns 1 through 3.
Alpha Testing formulas use screening's [Universe Statistical functions](https://my.apps.factset.com/oa/pages/pages/1851) to do their calculations. The universe definition used for these functions is "1", which represents all the securities that pass the Alpha Testing universe for the period. For example, AT\_AVG(#CFT) will give the same result as [UAVG](https://my.apps.factset.com/oa/pages/pages/1670)(1,#CFT) in an Alpha Testing report. You can use any Universe Statistical function or [Universe/Group statistical function](https://my.apps.factset.com/oa/pages/pages/5838) in Alpha Testing's custom formula language with a universe defined as "1".|

[Top of Page](https://my.apps.factset.com/oa/pages/13555#top)

___

## Fixed References

Unless noted, you should not specify any [Reference Modifier](https://my.apps.factset.com/oa/pages/13555#refmod) with any of the Fixed References listed below so that your [Alpha Testing formula](https://my.apps.factset.com/oa/pages/13555#new) uses data for all securities at the period or summary-level.

Use Fixed References as arguments when creating your custom [Alpha Testing formulas](https://my.apps.factset.com/oa/pages/13555#new). Fixed References generate a universe of data that are then used by your custom formulas.

|**Note**|If the universe of data generated by the fixed reference contains zero securities, then the result of any formula using the fixed reference will be NA and cannot be changed. To change this NA result, you can add an additional # sign in front of the fixed reference. For example, if #RET contains no security returns (an NA result would still be considered a return. Zero securities constitutes no return), then ZAV(AT\_SUM(#RET)) will be NA, but ZAV(AT\_SUM(##RET)) will be 0.|
|---|---|

#AFTn - Available Factor n Value

You must use the n argument to specify the factor number. This number is based on the factor order you entered in the Factors tab in the Model Inputs dialog box.

#BMC - Benchmark Market Capitalization

#BMKn - Benchmark Return

Use n to specify a benchmark return horizon (e.g., #BMK2) based on the order they appear in Model Inputs dialog. If you do not use the n argument (#BMK), the default return horizon is used.

#BWT - Benchmark Weight

#CFN - Current Factor's Fractile Values

If a formula contains this argument, then the [Factor Columns](https://my.apps.factset.com/oa/pages/pages/13554#columns) option is enabled.

#CFT - Current Factor Values

If a formula contains this argument, then the [Factor Columns](https://my.apps.factset.com/oa/pages/pages/13554#columns) option is enabled.

COLn - References a Particular Column Number n.

COLn can only be used as a fixed reference at the summary level and requires a [reference modifier](https://my.apps.factset.com/oa/pages/13555#refmod). For example, AT\_AVG(COL1:P) calculates an average of all the period results for column 1 at the summary level.

#FRMn - Universe Formula n Value

You must use the n argument to specify the universe formula number. This number is based on the [universe formula](https://my.apps.factset.com/oa/pages/pages/13573#tip) order you entered in the [Factors tab](https://my.apps.factset.com/oa/pages/pages/13573) in the Model Inputs dialog box.

#FRNn - Factor n's Fractile Value

You must use the n argument to specify the factor number. This number is based on the factor order you entered in the [Factors tab](https://my.apps.factset.com/oa/pages/pages/13554#factor) in the Report Settings dialog box.

#FTRn - Factor n Value

You must use the n argument to specify the factor number. This number is based on the factor order you selected in the [Factors tab](https://my.apps.factset.com/oa/pages/pages/13554#factor) in the Report Settings dialog box.

#FTWn - Factor n Weight

The values used to fill each fractile with the same total weight. You must use the n argument to specify the factor number. This number is based on the factor order you entered in the [Factors tab](https://my.apps.factset.com/oa/pages/pages/13554#factor) in the Report Settings dialog box.

#GFT - Group Factor Value

This fixed reference variable returns the factor value for the factor in the grouping row. You can use it when your report is [grouped](https://my.apps.factset.com/oa/pages/pages/13554#groupings) by factor or fractile.

|**Tip**|To create matrices for each period using security-level data in the Factors report, you must combine #GFT with #CFT.
|---|---|
1.  Click the Report **Settings** button.
2.  Choose the Columns tab.
3.  Click the **Data** button.
4.  Click the **Reference** button.
5.  Enter AT\_RCORREL(#GFT,#CFT)\*#GFO\*#CFO as the period formula.
6.  Enter (AT\_AVG(#THIS:P) as the summary formula.
7.  Enter Factor Correlation Matrix in the Column Name text box.
8.  Click **OK** to save your column edits.
9.  Click **OK** to save your column selection, then select the "Factor Correlation Matrix" column.
10.  Select "All" under the Factor Columns to generate a matrix of factor correlations.
11.  Click **OK**. Alpha Testing will display your factor correlation matrix as a report setting.|

#GRN - Group Fractile Number

This fixed reference variable returns the fractile number for the factor in the grouping row. You can use it when your report is [grouped](https://my.apps.factset.com/oa/pages/pages/13554#groupings) by factor or fractile. For example, to create a matrix of F11-FNN return values between each factor pair in a report grouped by factor, create a [custom column](https://my.apps.factset.com/oa/pages/pages/13554#new) and enter your period formula as AT\_AVG(IF((#CFN=1 AND #GRN=1)=1,#RET,NA))-AT\_AVG(IF((#CFN=#CNF AND #GRN=#GNF)=1,#RET,NA)) and your summary formula as AT\_RETURN\_SUMMARY\_CALC. Once you've added the column to the report, select "All" under the [Factor Columns](https://my.apps.factset.com/oa/pages/pages/13554#factcol) selection.

#ISONB - Is on Benchmark

Returns a 1 if the security is in the benchmark, 0 if the security is not in the benchmark. This fixed reference only fetches data for securities in the universe only. For example, the period formula AT\_SUM(#ISONB) calculates the number of securities that are in both the universe and the benchmark.

#ISONU - Is on Universe

Returns a 1 if the security is in the universe, 0 if the security is not in the universe. For example, the period formula AT\_SUM(#ISONU) calculates the number of securities in the universe for the current period.

#MCP - Universe Market Capitalization

#RETn - Universe Returns

Use n to specify a return horizon (e.g., #RET2) based on the order they appear in Model Inputs dialog. If you do not use the n argument (#RET), the default return horizon is used.

|**Note**|To build formulas using hedged returns, use the :CHR modifier with the #RET variable. For example, you can calculate the equal weighted hedged return for a universe using AT\_AVG(#RET:CHR) at the period level.|
|---|---|

#RMRn - Currency Returns

Returns the factor returns for your [Currency factor](https://my.apps.factset.com/oa/pages/pages/15678#CU). Use n to specify the available factor number for the Currency factor. The available factor number is based on the order that the factors are listed in the Factors tab in the Model Inputs dialog box so if there are 10 non-currency factors listed in the Factors tab before the currency factor, you would enter this variable as #RMR11.

#THIS - References the Current Column

#THIS can only be used as a fixed reference at the summary level and requires a [reference modifier](https://my.apps.factset.com/oa/pages/13555#refmod). For example, AT\_AVG(#THIS:P) calculates an average of all the period results of the current column at the summary level.

#WGT - Universe Weight

[Top of Page](https://my.apps.factset.com/oa/pages/13555#top)

___

## Reference Modifiers

To define the data used in your custom formulas, use reference modifiers with [fixed references](https://my.apps.factset.com/oa/pages/13555#fixed) or [pound variables](https://my.apps.factset.com/oa/pages/13555#var).

When you use a reference modifier, the referenced pound variable or fixed reference usually returns one result per period, whether it is used as a stand-alone formula (e.g., COL1:-1) or it is used within a [FactSet Statistical Function](https://my.apps.factset.com/oa/pages/pages/1492) (e.g., IF(COL1:-1>10,1,0)).

Reference modifiers should only be used within [Alpha Testing formulas](https://my.apps.factset.com/oa/pages/13555#new) at the summary level, where they return a time series of period results. For example, use the summary formula AT\_AVG(COL1:P) to get an average of column 1's period results.

Reference modifiers include: [level](https://my.apps.factset.com/oa/pages/13555#level) modifiers, [negative period report](https://my.apps.factset.com/oa/pages/13555#neg) modifiers, and [fractile](https://my.apps.factset.com/oa/pages/13555#fractile) modifiers.

|**Note**|When choosing your level modifier, consider how the level modifier will work with your Current Column. Do not be concerned with the [formatting](https://my.apps.factset.com/oa/pages/pages/13554#COLUMNS) of the column you are referencing.
|---|---|
For example, to create a % of Total Securities column in a Period grouped report, you can:
1.  Add Column One:
    
    [Add](https://my.apps.factset.com/oa/pages/pages/13554#add) the Number of Securities column from the FactSet > Security Statistics > Counts category in the Column Selection dialog.
2.  Add Column Two:
    
    Create a new column by referencing to Column One's data. You must enter
    
    100\*COL1/COL1:T
3.  For Column Two:
    
    Set the Fractile Columns selection to "Current Factor." When you click **OK** to run your report, Alpha Testing generates a column for each fractile displaying each fractile's % of securities (out of the total universe). The fractile column selection affects the COL1 argument, but has no affect on the COL1:T argument. This is because :T always returns the result for the [total level](https://my.apps.factset.com/oa/pages/13555#total).
What you select for the "Fractile Column" option for the column you are referencing (i.e., Column One in the above example) has no affect on your new column's calculation (i.e., Column Two in the above example).|

### Level Modifiers

Use level modifiers to control the level of the report used for the references in your Alpha Testing formulas.

|**Note**|If you do not specify a level modifier, all the data for a level is used. For example, the period formula AT\_AVG(#RET) takes the average of each security's return for each period; whereas, the summary formula AT\_AVG(#RET) takes the average of the returns for all the securities for all the periods.|
|---|---|

:P - Period Level of the Report

:R - Report Level

Use :R with return pound variables (#RET, #BMK, #RFR). If you split a statistic that uses this modifier into fractile columns or rows, the securities in the report universe are used to calculate the fractile column/fractile row results, not the securities in the specific fractile. The report universe is always the entire universe of securities that are included in the report for that period. Using :R on a return pound variable at the summary level will use the entire report universe and the column's return type. The report universe can only be narrowed down by [using filters](https://my.apps.factset.com/oa/pages/pages/13554#factor).

:S - Summary Level of the Report

:T - Total Level

Use :T with return pound variables (#RET, #BMK, #RFR). If you split a statistic that uses this modifier into fractile columns or rows, the securities in the total universe are used to calculate the fractile column/fractile row results, not the securities in the specific fractile. The total universe equals all the securities that are included in the report for a period. You can narrow down the total universe by [selecting fractile columns](https://my.apps.factset.com/oa/pages/pages/13554#columns) of other factors besides the current factor. The current factor is Factor 1 in the period and fractile-grouped reports or each factor row for a factor-grouped report).

|**Note**|The :P and :S level modifiers are separate from the :R and :T modifiers and you can use one of each on the same reference modifier. If you use one of each, then the :R/:T modifier must come before the :P/:S modifier. If you use a :R/:T modifier by itself, then the same period/summary level is assumed as the calculation. For example, to perform a % > Universe calculation as a summary level formula, the formula would be 100\*AT\_SUM(IF(#RET:P>#RET:R:P,1,0))/AT\_COUNT(#RET:P) where #RET:R:P specifies the report universe return for each period.
|---|---|
Only use :R and :T with return pound variables (#RET, #BMK, #RFR). Using :R or :T with other pound variables will return NA results.
The #RET [fixed reference](https://my.apps.factset.com/oa/pages/pages/13555#FIXED) can act as a stand alone formula that returns one result for the period when used with a level modifier. For example, you can use
#RET:P to get a period return, #RET:P:F1 to get a period return for fractile 1, or #RET:S to get a summary return for the chosen [return type](https://my.apps.factset.com/oa/pages/pages/13554#return). You can also get the average of each period's return by using the summary formula AT\_AVG(#RET:P).
If you do not use a level modifier, you cannot use
#RET as a formula by itself. You can only use it within an [Alpha Testing formula](https://my.apps.factset.com/oa/pages/13555#new), e.g., AT\_AVG(#RET) gives the average of each security's return for the period. Also, you cannot use other modifiers with #RET without using a level modifier (e.g., incorrect: #RET:F1; correct: #RET:P:F1).|

### Period Modifiers

:n - The value for period n in the report

:-n - The value n periods ago in the report

:+n - The value n periods forward in the report

:-N - The value of the last period in the report

The :-N modifier only applies to Summary Report formulas.

:N - The value for the last period in the report

|**Note**|**Examples:**
|---|---|
The period formula
COL1
returns the result for column 1 for the current period in the report.
The period formula
COL1:-2
returns the result for column 1 for two periods prior to the current period.
The period formula
#RET:P:+1
returns the universe return for the next period.
The period formula
COL1:-1
returns the result for column 1 for the previous period.
The Summary formula
COL1:P:-N
returns the result for column 1 for the last period.
The Summary formula
COL1:P:-1
returns the results for column 1 for the first period.
The Summary formula
COL1:P:+2
returns the results for column 1 for the second-to-last period.
The period or summary formula
#RET:P:N
returns the universe return for the last period in the report.
The period or summary formula
COL:P:1
returns the results for column 1 for period 1 in the report.|

|**!**|To avoid having a number that you want added or subtracted from a fixed reference interpreted as a period reference modifier, place the fixed reference after the added/subtracted amount, e.g., AT\_GEO\_MEAN(-1+#THIS:P)\*100.|
|---|---|

### Subperiod Modifier

:SUBn

You can reference specific [subperiod](https://my.apps.factset.com/oa/pages/pages/15529) returns from a return horizon. For example, you have three return horizons: 1-Month, 3-Month, and 6-Month. If your 6-Month return horizon is divided into monthly subperiods (0M-1M, 1M-2M, etc.), you can calculate the equal-weighted 1M-2M subperiods return at the period level using the formula AT\_AVG(#RET3:SUB2). This formula will reference the second subperiod (:SUB2 = 1M-2M) of the third return horizon (#RET3 = 6-Month return).

In the screenshot below, the 6-7M return is the seventh subperiod of the third return horizon (

#RET3:P:SUB7). The 12-Month return horizon is just the third return horizon with no subperiods (#RET3:P).

![](online-assistant/23414.html)

### Fractile and Factor Modifiers

Fractile reference modifiers can be used with [fixed references](https://my.apps.factset.com/oa/pages/pages/13555#fixed) within [Alpha Testing formulas](https://my.apps.factset.com/oa/pages/pages/13555#new) to narrow the universe of data returned by the fixed reference to just the fractile or factor specified.

|**Note**|Factor and fractile modifiers operate independently of each other, so you can use both in the same formula. For example, COL2:FTR2:F1 references the result of fractile 1 of factor 2 from column 2 using data from factor 2, regardless of the current factor chosen for the column.
|---|---|
Or, to calculate the average of each factor 1 fractile return within fractiles of factor 2 for a report grouped by period then fractile, and a column fractiled by factor 2, the formula is
AVG(AT\_LOOP($X,ALL,#RET:P:FTR1:F$X)).|

:Fn - The Value for the n<sup>th</sup> Fractile

|**Note**|You can combine the :Fn and :FTRn modifiers to create a factor/fractile intersection modifier using the format :(FTRn, Fn, FTRn, Fn,...). This allows you to access a fractile from one factor and intersect it with a fractile from another factor. For example, COL2:P:(FTR1, F1, FTR2, F2) will give the period-level result of column 2 for fractile 1 of factor 1 intersected with fractile 2 of factor 2. The intersection of two factor's fractiles can be seen in a fractiles report when a column is fractiled by factor 2.|
|---|---|

:FN - Last Fractile Value

Specifies the value for the last fractile.

For example, to calculate the average of each fractile's result for a column with "All" selected for [Fractile Columns](https://my.apps.factset.com/oa/pages/pages/13554#Columns), specify each fractile using a fractile modifier on a column reference within an average function (e.g., for quintiles enter AVG(COL2:F1,COL2:F2,COL2:F3,COL2:F4,COL2:F5)).

:FNA - NA Fractile Value

Specifies the value for the NA fractile. For example #RET:P:FNA calculates the current period's return for the NA fractile.

:FFF - First Fractiles - All Factors

Specifies the value for the first fractiles of all factors.

:FNN - Last Fractiles - All Factors

Specifies the value for the last fractiles of all factors.

:FNC

Ignores column fractiling. For example, if a column is fractiled, #RET:P:(FTR1,F1):FNC will show the return for fractile 1 of factor 1 in each fractile column in the report.

:FNG

Ignores group fractiling.

:FTRn

Specifies the selected Factor Number's values used for the column that you are referencing in your calculation.

For example, if column one is factor average and Factor 2 in your selected factor list is price to book, then the reference

formula COL1:FTR2 returns the average price to book value.

|**Note**|You can combine the :Fn and :FTRn modifiers to create a factor/fractile intersection modifier using the format :(FTRn, Fn, FTRn, Fn,...). This allows you to access a fractile from one factor and intersect it with a fractile from another factor. For example, COL2:P:(FTR1, F1, FTR2, F2) will give the period-level result of column 2 for fractile 1 of factor 1 intersected with fractile 2 of factor 2. The intersection of two factor's fractiles can be seen in a fractiles report when a column is fractiled by factor 2.|
|---|---|

:FTRG

Changes the existing factor selected for the column to the grouping row factor within your calculation.

|**Tip**|To create matrices in factor-grouped reports that use period-level results in the summary-level calculations, you must use :FTRG.
|---|---|
For example, to create a matrix of correlations for each factor's period IC (IC = Column 1 in a factor-grouped report):
1.  Click the **Settings** button.
2.  Choose the Columns tab.
3.  Click the **Data** button.
4.  Click the **Reference** button.
5.  Enter NA as the Period formula and enter AT\_CORREL(COL1:P, COL1:P:FTRG) as the Custom Summary formula.
6.  Enter a column name.
7.  Click **OK** twice to return to the Columns tab.
8.  Select the new column you created and select "All" under Factor Columns.
9.  Click **OK** to view a matrix of correlations for each factor's period IC.|

:FTR\_LOOP\_NUMBERn - factor trailing stats

References multiple factors. Use with [screening statistical functions](https://my.apps.factset.com/oa/pages/pages/1492) that take an N argument.

For example: STD4(COL21:S:FTR\_LOOP\_NUMBER) returns the standard deviation of the summary results for the first four factors in the report for Column 21

:F\_LOOP\_NUMBERn - fractile trailing stats

References multiple fractiles. The NA fractile is considered the N+1 fractile (where N is the number of fractiles selected for the factor). Use with [screening statistical functions](https://my.apps.factset.com/oa/pages/pages/1492) that take an N argument.

For example: MEDIAN5(COL10:P:F\_LOOP\_NUMBER) returns the median period result for the first five fractiles of the current factor for Column 10

### Trailing Statistics

:-LOOP\_NUMBERn - prior period trailing stats

Starts with period n (1, or the previous period, is the default if nothing specified). Use with [screening statistical functions](https://my.apps.factset.com/oa/pages/pages/1492) that take an N argument.

For example:

AVG5(#RET:P:-LOOP\_NUMBER2) returns the five period trailing average of returns, starting two periods prior

:+LOOP\_NUMBERn - forward period trailing stats

Start with period n (1, or the next period, is the default if nothing specified). Use with [screening statistical functions](https://my.apps.factset.com/oa/pages/pages/1492) that take an N argument.

For example:

MAX10(COL1:P:+LOOP\_NUMBER0) returns the 10 forward-period trailing maximum of the results of Column 1, starting with the current period

|**Note**|If there are not enough periods, then the results for trailing stats will be NA. In the prior period trailing stats example above, there would be no results until period seven and the first six period results will be NA.|
|---|---|

### Loop Syntax

Looping syntax lets you loop through period/factor/fractile references in one formula.  A common use case would be to use AT\_LOOP to create trailing period statistics or ranks among factor fractiles.  AT\_LOOP functions are meant to be used inside of iterative Screening functions such as SUMn, AVGn, STDn, etc.  When you execute an AT\_LOOP in an Alpha Testing report, you are creating an array of data.  Therefore, you must pass that array of data into a function (e.g., a Screening iterative function) to produce a meaningful result.

AT\_LOOP($X, N , reference)

Where:

**$X** = set argument. This can be any letter and does not have to be X.  If you perform two loops inside of the same function, then you must use different variables for each loop such as $X and $Y.  This argument is subsequently used to tell AT\_LOOP which reference to loop through.

**N** = the number of times to execute the loop.  You can enter either a dynamic option below or an integer.  When using an iterative function (SUMn, AVGn, STDn, etc.), you can view this argument as the iterative function's "n" argument.  The following is a list of dynamic options:

-   ALL - Loops through all periods, factors, or fractiles. When used for looping with periods, this does not include the current period. It uses all previous or future periods, depending upon the reference. If used with fractiles, it will not include the NA fractile.
-   ALLN - Loops through fractiles including the NA fractile.
-   xN - Can be used when looping through periods. This is an integer, x, followed by the letter N. This tells the loop to use x prior or future periods including the current period.
-   ALL0 - Can be used when looping through periods. This tells AT\_LOOP to use all previous or future periods including the current period.

**reference** = The formula you want to loop through plus the data to be looped.

**Examples:**

-   AVG(AT\_LOOP($X,5,COL4:FTR$X)) returns the average of the results of Column 4 for the first five factors
-   AVG(AT\_LOOP($X,ALL,COL4:F$X)) returns the average of the results of Column 4 for all fractiles of the current factor

You can use loops with:

-   :-$X for prior periods
-   :+$X for forward periods
-   :FTR$X for factors
-   :F$X for fractiles
-   :SUB$X for sub-periods. For example, the Period formula AVG(AT\_LOOP($X,ALL,#RET2:P:SUB$X)) will return the average sub-period return for the second return horizon. If the second return horizon is a 3-Month return broken into monthly sub-periods, this formula is the average of the 0M-1M, 1M-2M, 2M-3M period-level returns.
-   Screening functions. For example, for a factor with five fractiles, the formula SUM(AT\_LOOP($X,ALL,IF(#RET:P > #RET:P:F$X,1,0))) is equivalent to the formula SUM(IF(#RET:P > #RET:P:F1,1,0),IF(#RET:P > #RET:P:F2,1,0),IF(#RET:P > #RET:P:F3,1,0),IF(#RET:P > #RET:P:F4,1,0),IF(#RET:P > #RET:P:F5,1,0)).

### Aligning Data Between Different Periods

To create functions that compare [security level data](https://my.apps.factset.com/oa/pages/pages/13555#fixed) for different periods, the data must be aligned using the :ALIGN reference modifier.

For period-level formulas:

-   :ALIGNn and :ALIGN(n) will align the data to period n (where the first period is period 1)
-   :ALIGN(-n) will align the data to n prior periods
-   :ALIGN(+n) will align the data to n forward periods
-   :ALIGN(0) will align the data to the current period

For summary-level formulas:

-   :ALIGNn,:ALIGN(n), and :ALIGN(-n) will align the data to period n (where the first period is period 1)
-   :ALIGN(+n) will align data to n periods from the last period

For example, to calculate the correlation between fractiles in the current and previous period for securities that are in the universe during both periods, enter the period formula as: AT\_CORREL(#CFN,#CFN:-1:ALIGN(0))

To calculate the number of securities that were in the universe and have a non-NA weight value during both the current and previous periods, enter the period formula: IF(#PRD=0,NA,AT\_SUM(IF(ISAV(#WGT)=1 AND ISAV(#WGT:-1:ALIGN(0))=1,1,0)))

|**Note**|When creating custom turnover statistics in Alpha Testing reports, you must use the :ALIGN reference modifier.|
|---|---|

### Custom Formula: Variables with multiple securities vs single security

There appears to be a limitation with the way custom formulas are handled by Alpha Testing 3 when the formula has several variables that involve a different number of securities and one of the variables involves only 1 security.

For example, when evaluating a custom formula like AT\_COUNT(#CFT)/AT\_COUNT(CFT:FNC), there is often the need to align the data vectors of different sizes if the numerator’s value comes out to be 1. In that case numerator’s vector size would be increased to be the same as the size of the denominator’s, as the # variables need to return vectors of the same size for screening calculations.

Hence, the problem lies in how the resizing happens. When resizing a vector that contains 1 value, AT3 just copies that value to all elements in the vector. AT3 essentially has to figure how a # variable containing a single value should be treated depending on where that variable is used. A fix for such a situation would be to use an explicit modifier like SGL.

The formula AT\_COUNT(#CFT:SGL)/AT\_COUNT(CFT:FNC)\*100, would return the correct values.

[Top of Page](https://my.apps.factset.com/oa/pages/13555#top)

___

## Pound Variables

Pound variables can act as stand-alone formulas, (e.g., #PRD - returns the period report index and the value is different for each period in the report) or can be used as part of a longer formula within [FactSet Statistical Functions](https://my.apps.factset.com/oa/pages/pages/1492) (e.g., IF(#PRD>9,#PFM1,#PFM2) returns the result of your first period formula for the first 10 periods in your report and returns the result of your 2nd period formula for periods thereafter.). A pound variable returns one value per period, unlike [Fixed References](https://my.apps.factset.com/oa/pages/13555#fixed) which return a universe of data.

Do not use a Pound Variable as the only argument inside an [Alpha Testing formula](https://my.apps.factset.com/oa/pages/13555#new) without also using a [Fixed Reference](https://my.apps.factset.com/oa/pages/13555#fixed) to bring in a universe of data.

#AFN - Current Factor's Available Factor Number

The #AFN variable will return the available factor number for the current selected [factor](https://my.apps.factset.com/oa/pages/pages/13554#factcol) for a column in a report. You can use it to specify a different calculation for a column depending on the available factor number. You can use the #AFN variable to specify a different [weight calculation](https://my.apps.factset.com/oa/pages/pages/13934#col) for each component factor in a Multi-Factor Rank (#AFN and [#FNC](https://my.apps.factset.com/oa/pages/13555#fnc) will return the same result when used in Multi-Factor Rank weighting formulas).

#ARWn - Component Factor Ranking Weight for Available Multi-Factor Ranking n

Returns the [weight](https://my.apps.factset.com/oa/pages/pages/13934#custom3) of each factor included in a specific multi-factor rank calculation. You must use the n argument to specify the number corresponding to the multi-factor rank as found in the Factors tab of the Model Inputs dialog box. This number is based on the order in which the multi-factor rankings were added to the model. For example, to find the weights for each factor used in the second multi-factor rank added to your model, use #ARW2.

#CFO - Current Factor Order

If the Current Factor is "Lower Values Rank Better," then -1 else 1.

#CNF - Current Factor's Number of Non-N/A Fractiles

#CNL - Current Factor's Number of [Layering Levels](https://my.apps.factset.com/oa/pages/pages/13573#layer)

COLn - Reference a Value from a Particular Column Number n

#CRT - Current Return Type

#CRW - Component Factor Ranking Weight for Current Factor (if the current factor is a Multi-Factor Ranking)

Returns the [weight](https://my.apps.factset.com/oa/pages/pages/13934#custom3) of each factor included in a current factor's multi-factor rank calculation (if the current factor is a Multi-Factor Rank). The current factor is Factor 1 in all reports for this pound variable.

#FTOn - Factor Order

If the selected factor n is "Lower Values Rank Better," then -1, else 1.

#FNC - Current Factor's Selected Factor Number

The #FNC variable will return the selected factor number for the current selected [factor](https://my.apps.factset.com/oa/pages/pages/13554#factcol) for a column in a report. You can use it to specify a different calculation for a column depending on the available factor number. ([#AFN](https://my.apps.factset.com/oa/pages/13555#afn) and #FNC will return the same result when used in Multi-Factor Rank weighting formulas).

#GAN - Current Group's Available Factor Number

The #GAN variable will return the available factor number for the grouping row's current factor.

#GFN - Current Group's Selected Factor Number

The #GFN variable will return the selected factor number for the grouping row's current factor.

#GFO - Group Factor Order

If the grouped factor's order is "Lower Values Rank Better" the result is -1, else 1. This pound variable only works in reports [grouped](https://my.apps.factset.com/oa/pages/pages/13554#groupings) by factor.

#GNF - Group Factor Number of non-na fractiles

#IFC - Current Iterated Fractile Column Number

If you split a statistic into [fractile columns](https://my.apps.factset.com/oa/pages/pages/13554#columns), then the value returned by this pound variable will be the current fractile number. If you do not split the statistic into fractile columns, then this pound variable returns a -1. If your factor is grouped and not fractiled, then the first group returns 1, the second group returns 2, etc.

#LYRn - Selected Factor n Number of [Layering Levels](https://my.apps.factset.com/oa/pages/pages/13573#layer)

#MRWn - Component Factor Ranking Weight for Selected Multi-Factor Ranking n

Returns the [weight](https://my.apps.factset.com/oa/pages/pages/13934#custom3) of each factor included in a specific multi-factor rank calculation. You must use the n argument to specify the number corresponding to the multi-factor rank as found in the Factors tab of the Report Settings dialog box. This number is based on the order in which the multi-factor rankings were added to the report. For example, to find the weights for each factor used in the second multi-factor rank added to your report, use #MRW2.

For example, if you selected four factors to be included in your report and only selected Factors 2 and 4 are multi-factor ranks, then Factors 2 and 4 will be used for the multi-factor ranking numbers 1 and 2.

|**Tip**|**To view the individual factor weights for the first multi-factor rank created in your model
|---|---|
(e.g., "MFR Factor 1"):**
\* [Create a new column](https://my.apps.factset.com/oa/pages/pages/13554#columns) using
#MRW1
as your Period Formula and
AT\_AVG(#THIS:P)
as your Summary Formula.
\* In the Groupings tab in the Report Settings dialog box, select "Factor" first then "Period."
\* In the Factors tab, select both the multi-factor rank and each of its factor components to be included as factors in the report.
The report will display the average ranking weight for each factor component at its factor grouping row.
For example, if your multi-factor ranking consists of two factors Price to Earnings and Price to Book, the average factor weights are displayed next to these factor names in your report. You can then expand the group to display the individual period ranking weights for each factor component at the period-grouping level. Also, you can alternatively group the report by Period Only, but first you must select "All" for the column in the [Factor Columns option](https://my.apps.factset.com/oa/pages/pages/13554#columns).|

#NFCn - Selected Factor n Number of Non-N/A Fractiles

#PFMn - Period Formula n Value

You must use the n argument to specify the period formula number. This number is based on the period order you entered in the Factors tab in the Model Inputs dialog box.

#PRD - Period Report Index

This value will be different for each period in the report. The value for the first period = 0, the second period = 1, the third period = 2, etc.

#RFRn - Risk Free Rate Return

Use n to specify a specific risk free rate return horizon (e.g., #RFR2) based on the order they appear in Model Inputs dialog. If you do not use the n argument (#RFR), the default return horizon is used.

#RPYn - Return Horizons Per Year

Where n represents the available return horizon. If n is not specified, then the default return horizon is used. For example, if your return horizon is three months, the result is 4.

|**Note**|#RPY is used to calculate annualized returns. When you use the seven-day calendar, #RPY is determined for daily returns using 365 days. For all other calendars, 250 days are used in the calculation.
|---|---|
The seven-day calendar shows all days all days (Monday through Sunday) and carries prices forward over non-trading days.|

#THIS - References a Value from the Current Column

#THIS can only be used as a pound variable when it is used with a [Negative Period Report Modifier](https://my.apps.factset.com/oa/pages/13555#neg) to specify a different period than the current period.

For example, the period formula IF(#PRD=0,1,10\*#THIS:-1) multiplies each previous period's result by 10 to get the current period result. If #THIS is used by itself, it is a circular reference that will return NA.

[Top of Page](https://my.apps.factset.com/oa/pages/13555#top)

___

## Return Types

These formulas are used to calculate the Universe Return column for different [return types](https://my.apps.factset.com/oa/pages/pages/13599) available in your [Alpha Testing reports](https://my.apps.factset.com/oa/pages/pages/13554#RETURN). The formulas listed below can be modified for the Benchmark Return column by replacing the [Fixed References](https://my.apps.factset.com/oa/pages/pages/13555#FIXED) #RET with #BMK and #WGT with #BWT.

**Equal Weighted**

Period report: AT\_AVG(#RET)

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Weighted**

Period report: AT\_WAVG(#WGT,#RET)

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Relative**

Period report: ((1.0+(AT\_AVG(#RET)/100.0))/(1.0+(AT\_AVG(#BMK)/100.0))-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100)\*100.0

**Weighted Relative**

Period report: ((1.0+AT\_WAVG(#WGT,#RET)/100.0)/ (1.0+(AT\_WAVG(#BWT,#BMK)/100.0))-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100

**Annualized**

Period report: (((1.0+(AT\_AVG(#RET)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Annualized Sum, Cumulative Per**

Period report: IF(#PRD=0,100.0+(@T1:=AT\_AVG(#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: ((((#THIS:P:-N)/100)\*\*(#RPY/AT\_COUNT(#RET:P)))-1)\*100

**Weighted Annualized**

Period report: (((1.0+(AT\_WAVG(#WGT,#RET)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Weighted Annualized Sum, Weighted Cumulative Per**

Period report: IF(#PRD=0,100.0+(@T1:=AT\_WAVG(#WGT,#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: ((((#THIS:P:-N)/100)\*\*(#RPY/AT\_COUNT(#RET:P)))-1)\*100

**Cumulative**

Period report: IF(#PRD=0,100.0+(@T1:=AT\_AVG(#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

**Weighted Cumulative**

Period report: IF(#PRD=0,100.0+(@T1:=AT\_WAVG(#WGT,#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

**Cumulative b0**

Period report: IF(#PRD=0,(@T1:=AT\_AVG(#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,100+@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0))-100)

Summary report: #THIS:P:-N

**Weighted Cumulative b0**

Period report: IF(#PRD=0,(@T1:=AT\_WAVG(#WGT,#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,100+@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0))-100)

Summary report: #THIS:P:-N

**Annualized Relative**

Period report: (((1.0+((((1.0+(AT\_AVG(#RET)/100.0))/(1.0+(AT\_AVG(#BMK)/100.0))-1.0)\*100.0)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Annualized Weighted Relative**

Period report: (((1.0+((((1.0+AT\_WAVG(#WGT,#RET)/100.0)/(1.0+(AT\_WAVG(#BWT,#BMK)/100.0))-1.0)\*100.0)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Cumulative Relative**

Period report: IF(#PRD=0,100.0+(@T1:=(((1.0+(AT\_AVG(#RET)/100.0))/(1.0+(AT\_AVG(#BMK)/100.0))-1.0)\*100.0)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

**Cumulative Weighted Relative**

Period report: IF(#PRD=0,100.0+(@T1:=(((1.0+AT\_WAVG(#WGT,#RET)/100.0)/(1.0+(AT\_WAVG(#BWT,#BMK)/100.0))-1.0)\*100.0)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

**Median**

Period report: AT\_MEDIAN(#RET)

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Weighted Median**

Period report: AT\_WMEDIAN(#WGT,#RET)

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Relative Median**

Period report: ((1.0+(AT\_MEDIAN(#RET)/100.0))/(1.0+(AT\_MEDIAN(#BMK)/100.0))-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Weighted Relative Median**

Period report: ((1.0+AT\_WMEDIAN(#WGT,#RET)/100.0)/(1.0+(AT\_WMEDIAN(#BWT,#BMK)/100.0))-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Cumulative Median**

Period report: IF(#PRD=0,100.0+(@T1:=AT\_MEDIAN(#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0)))

Summary report: #THIS:P:-N

**Weighted Cumulative Median**

Period report: IF(#PRD=0,100.0+(@T1:=AT\_WMEDIAN(#WGT,#RET)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

**Annualized Median**

Period report: (((1.0+(AT\_MEDIAN(#RET)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Annualized Weighted Median**

Period report: (((1.0+(AT\_WMEDIAN(#WGT,#RET)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Annualized Relative Median**

Period report: (((1.0+((((1.0+(AT\_MEDIAN(#RET)/100.0))/(1.0+(AT\_MEDIAN(#BMK)/100.0))-1.0)\*100.0)/100.0))\*\*#RPY)-1.0)\*100.0

Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Annualized Weighted Relative Median**

Period report: (((1.0+((((1.0+AT\_WMEDIAN(#WGT,#RET)/100.0)/(1.0+(AT\_WMEDIAN(#BWT,#BMK)/100.0))-1.0)\*100.0)/100.0))\*\*#RPY)-1.0)\*100.0 Summary report: AT\_GEO\_MEAN(#THIS:P/100.0)\*100.0

**Cumulative Relative Median**

Period report: IF(#PRD=0,100.0+(@T1:=(((1.0+(AT\_MEDIAN(#RET)/100.0))/(1.0+(AT\_MEDIAN(#BMK)/100.0))-1.0)\*100.0)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

**Cumulative Weighted Relative Median**

Period report: IF(#PRD=0,100.0+(@T1:=(((1.0+AT\_WMEDIAN(#WGT,#RET)/100.0)/(1.0+(AT\_WMEDIAN(#BWT,#BMK)/100.0))-1.0)\*100.0)),IF(ISNA(@T2:=(#THIS:P:-1))=1,100,@T2)\*(1.0+(IF(ISNA(@T2)=1,@T1,ZAV(@T1))/100.0)))

Summary report: #THIS:P:-N

|**Note**|For an explanation of the basic mathematical operators used in these formulas, like \*\* for raising one value to the power of another, see Online Assistant page [10600](https://my.apps.factset.com/oa/pages/pages/10600).|
|---|---|

### Return Type Modifiers

You can use return type modifiers to specify a particular return type that is independent of the current return type. For example, a custom column with a period formula of #RET:P:RTW will return the weighted period returns even if you selected "Equal-Weighted Returns" as the current return type.

#/:RTEW

Equal Weighted

#/:RTW

Weighted

#/:RTR

Relative

#/:RTWR

Relative Weighted

#/:RTA

Annualized

#/:RTWA

Weighted Annualized

#/:RTC

Cumulative

#/:RTWC

Weighted Cumulative

#/:RTCB

Cumulative b0

#/:RTWCB

Weighted Cumulative b0

#/:RTAR

Annualized Relative

#/:RTAWR

Annualized Weighted Relative

#/:RTCR

Cumulative Relative

#/:RTCWR

Cumulative Weighted Relative

#/:RTM

Median

#/:RTWM

Weighted Median

#/:RTRM

Relative Median

#/:RTWRM

Weighted Relative Median

#/:RTCM

Cumulative Median

#/:RTWCM

Weighed Cumulative Media

#/:RTAM

Annualized Median

#/:RTAWM

Annualized Weighted Median

#/:RTARM

Annualized Relative Median

#/:RTAWRM

Annualized Weighted Relative Median

#/:RTCRM

Cumulative Relative Median

#/:RTCWRM

Cumulative Weighted Relative Median

#/:RTASCP

Annualized Sum, Cumulative Per

#/:RTWASWCP

Weighted Annualized Sum, Weighted Cumulative Per

[Top of Page](https://my.apps.factset.com/oa/pages/13555#top)

___

## Default Report Formulas

This section lists the formulas used to calculate some of the default column statistics in your Alpha Testing reports.

In many cases, the formulas listed here do not exactly replicate what happens in Alpha Testing because different calculations are performed to handle [different return types](https://my.apps.factset.com/oa/pages/pages/13554#return).

To learn how Alpha Testing's default column statistics are calculated, see the [Report Calculations](https://my.apps.factset.com/oa/pages/pages/13718) page.

|**Notes**|When you [select a column](https://my.apps.factset.com/oa/pages/pages/13554#add) to add to your report, a tool-tip appears showing you the custom formula used for that column. If you wish to edit the formula shown in the tool-tip into your own custom column, click the **Copy** button.
|---|---|
The columns below with an asterisk (**\***) perform different calculations when you select different return types, so these columns cannot be exactly replicated with a custom formula and a formula is not displayed in the tool-tip. Most of the columns listed below with the asterisk have a simplified version in the "Other" columns category that doesn't change it's calculation for different return types and will show the formulas listed below in the tool-tip.
Any column available for selection that displays "pooled" indicates that the calculation performed at the period level is also performed at the summary level on all data for all periods. This is due to the [fixed references](https://my.apps.factset.com/oa/pages/13555#fixed) in the summary formula not having [level modifiers](https://my.apps.factset.com/oa/pages/13555#level).
For example, the Pooled Information Coefficient column uses the regular Information Coefficient column's period formula:
AT\_RCORREL(#RET, #CFT)\*#CFO )
for both its period and summary-level formulas, so that the summary ranked correlation is calculated for all securities over all periods of your test.|

**Universe Return** **\***

For the calculation of the Universe Return, different formulas are used when different [return types](https://my.apps.factset.com/oa/pages/13555#return) are selected for the column.

**Universe Median Return** **\***

The same formulas that are used for the Universe Return are used for the Universe Median Return when different [return types](https://my.apps.factset.com/oa/pages/13555#return) are selected for the column. The exception is that "AVG" will be replaced with "MEDIAN" in each of the formulas.

**Standard Deviation Return** **\***

Period report: AT\_STD(#RET)

Summary report: AT\_STD(#RET:P)

Returns weighted standard deviation for weighted return types. The equal weighted/weighted return type's standard deviation result is multiplied by the square root of the number of return period reports per year to get the annualized/weighted annualized return type's standard deviation result.

**Sharpe Ratio** **\***

Period report: (#RET:P-#RFR)/AT\_STD(#RET)

Summary report: (#RET:S-#RFR:S)/AT\_STD(#RET:P)

Specialized for annualized return types.

**Average Market Capitalization** (Mcap)

Period report: AT\_AVG(#MCP)

Summary report: AT\_AVG(#THIS:P)

**Excess Returns Versus Benchmark Returns** **\***

Period report: #RET:P-#BMK:P

Summary report: AT\_RETURN\_SUMMARY\_CALC

Specialized for annualized return types.

**Standard Deviation Excess Returns Versus Benchmark Returns** **\***

Period report: N/A

Summary report: AT\_STD(#RET:P-#BMK:P)

Specialized for annualized return types.

**Excess Return Versus Total Universe Return \***

Period report: #RET:P-#RET:T

Summary report: #RET:S-#RET:T

Specialized for annualized return types.

**Standard Deviation Excess Returns Versus Total Universe Returns** **\***

Period report: N/A

Summary report: AT\_STD(#RET:P-#RET:T)

Specialized for annualized return types.

**Information Coefficient**

Period report: AT\_RCORREL(#RET, #CFT)\*#CFO

Summary report: AT\_AVG(#THIS:P)

**Information Coefficient T-Stat** (IC T-Stat)

Period report: SQRT(((AT\_COUNT(#RET+#CFT)-2)/(1.0-((@T1:=AT\_RCORREL(#RET,#CFT)\*#CFO)\*@T1))))\*@T1

Summary report: AT\_AVG(#THIS:P)

**Factor Average**

Period report: AT\_AVG(#CFT)

Summary report: AT\_AVG(#THIS:P)

**Factor Standard Deviation** \* (Factor Std Dev.)

Period report: AT\_STD(#CFT)

**Factor Low**

Period report: AT\_MIN(#CFT)

Summary report: AT\_MIN(#THIS:P)

**Factor High**

Period report: AT\_MAX(#CFT)

Summary report: AT\_MAX(#THIS:P)

**Factor Median**

Period report: AT\_MEDIAN(#CFT)

Summary report: AT\_MEDIAN(#THIS:P)

**F1-FN** **\***

Period report: #RET:P:F1-#RET:P:FN

Summary report: AT\_RETURN\_SUMMARY\_CALC

Specialized for annualized return types.

**F11-FNN** **\***

Period report: #RET:P:FFF-#RET:P:FNN

Summary report: AT\_RETURN\_SUMMARY\_CALC

Specialized for annualized return types.

**Percent Greater Than Benchmark** **\*** (% > Bench)

Period report: (AT\_SUM(IF(#RET>AT\_AVG(#BMK),1,0))/AT\_COUNT(#RET))\*100

Summary report: (AT\_SUM(IF(#RET:P>#BMK:P,1,0))/AT\_COUNT(#RET:P))\*100

Specialized for weighted return types and relative return types.

**Percent Greater than Up Benchmark** **\*** (% > Up Bench)

Period report: IF(AT\_AVG(#BMK)>0,(AT\_SUM(IF(#RET>AT\_AVG(#BMK),1,0))/AT\_COUNT(#RET))\*100,NA)

Summary report: (AT\_SUM(IF(#BMK:P>0,IF(#RET:P>#BMK:P,1,0),0))/AT\_COUNT(IF(#BMK:P>0,1,NA)))\*100

Specialized for weighted return types and relative return types.

**Percent Greater than Down Benchmark \*** (% > Down Bench)

Period report: `IF(AT_AVG(#BMK)<0,(AT_SUM(IF(#RET>AT_AVG(#BMK),1,0))/AT_COUNT(#RET))*100,NA)`

Summary report: `(AT_SUM(IF(#BMK:P<0,IF(#RET:P>#BMK:P,1,0),0))/AT_COUNT(IF(#BMK:P<0,1,NA)))*100`

Specialized for weighted return types and relative return types.

**Factor Correlation** (F1 vs. F2)

Period report: AT\_RCORREL(#FTR1,#FTR2)\*#FTO1\*#FTO2

Summary report: AT\_AVG(#THIS:P)

**Factor Correlation T-Stat** (FC T-Stat)

Period report: POWER(((AT\_COUNT(#FTR1+#FTR2)-2)/(1.0-((@T1:=AT\_RCORREL(#FTR1,#FTR2)\*#FTO1\*#FTO2)\*@T1))),0.5)\*@T1

Summary report: AT\_AVG(#THIS:P)

**Alpha**

Period report: NA

Summary report: AT\_INTERCEPT(#BMK:P,#RET:P)

**T-Stat Alpha**

Period report: NA

Summary report: AT\_INTERCEPT(#BMK:P,#RET:P)\*SQRT(AT\_COUNT(#BMK:P+#RET:P)-2)/AT\_STD(#RET:P-(#BMK:P\*AT\_SLOPE(#BMK:P,#RET:P)))

**Beta**

Period report: NA

Summary report: AT\_SLOPE(#BMK:P,#RET:P)

**T-Stat Beta**

Period report: NA

Summary report: ((SQRT((@T1:=((@T2:=AT\_SLOPE(#BMK:P,#RET:P))\*\*2.0)\*((AT\_STD(#BMK:P)\*\*2.0)/(AT\_STD(#RET:P)\*\*2.0))))\*SQRT(AT\_COUNT(#BMK:P+#RET:P)-2))/(SQRT(1-@T1)))\*(@T2/ABS(@T2))

**R Square for Beta** (R^2 for Beta)

Period report: NA

Summary report: (AT\_SLOPE(#BMK:P,#RET:P)\*\*2.0)\*((AT\_STD(#BMK:P)\*\*2.0)/(AT\_STD(#RET:P)\*\*2.0))

**Residual Risk**

Period report: NA

Summary report: SQRT((AT\_STD(#RET:P)\*\*2.0)-((AT\_SLOPE(#BMK:P,#RET:P)\*\*2.0)\*(AT\_STD(#BMK:P)\*\*2.0)))

**Information Ratio**:

Period report: NA

Summary report: 100\*AT\_GEO\_MEAN(100\*((((1+(#RET:P-#BMK:P)/100))\*\*#RPY)-1)/100)/(AT\_STD(#RET:P-#BMK:P)\*SQRT(#RPY))

[Top of Page](https://my.apps.factset.com/oa/pages/13555#top)
