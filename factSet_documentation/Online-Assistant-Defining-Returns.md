---
created: 2026-05-05T19:02:51 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21526
author: 
---

# Online Assistant : Defining Returns

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Defining Returns Options Page 21526

Launch it with FactSet Search: @AT4

Specify advanced return options. To access the Returns options, click the **Model Options** button in the application toolbar and then select "Returns" from the left pane of the Edit Model Options page.

![](online-assistant/26961.html)

Topics covered:

-   [Currency](https://my.apps.factset.com/oa/pages/21526#currency)
-   [Include Dividends](https://my.apps.factset.com/oa/pages/21526#include_dividends)
-   [NA Returns Data](https://my.apps.factset.com/oa/pages/21526#na_returns)
-   [Maximum/Minimum % Returns](https://my.apps.factset.com/oa/pages/21526#max_min_%_returns)
-   [FactSet Prices and MSCI Return Source Options](https://my.apps.factset.com/oa/pages/21526#fs_msci)

-   [Partial Period Returns for NAs (Limited History)](https://my.apps.factset.com/oa/pages/21526#pp_nas)
-   [Partial Period Returns for Future Dates](https://my.apps.factset.com/oa/pages/21526#pp_future)

-   [Return Horizons](https://my.apps.factset.com/oa/pages/21526#return_horizons)

-   [Subperiods](https://my.apps.factset.com/oa/pages/21526#subperiods)

___

## Currency

Select a currency from the Currency drop-down menu in the Returns section. 

Returns for all custom formula return sources and most default returns sources are converted to the currency you select using the FactSet Prices database. There are exceptions for some default return source return calculations depending on the currency selected.

When converting returns to the currency you selected, Alpha Testing assumes that all return formulas are in local currency for each security. Therefore, use local currency when creating custom return formulas. For example, use PRET(0 #F) instead of PRET(USD 0 #F). Returns fetched from an underlying screen via ROWn references are also assumed to be in local currency and are subsequently converted to the model currency.

The “Include Local Currency” option, when selected, will fetch the local return. 

[Top of Page](https://my.apps.factset.com/oa/pages/21526#top)

___

## Include Dividends

By default, Alpha Testing includes dividends to calculate returns.

To exclude dividends in return calculations (e.g., price change), deselect the "Include Dividends" check box.

The dividend option affects the underlying [return calculations](https://my.apps.factset.com/oa/pages/pages/14025) Alpha Testing uses.

Dividends come from the database source you specify.

[Top of Page](https://my.apps.factset.com/oa/pages/21526#top)

___

## NA Returns Data

Alpha Testing allows you to decide how to address securities that do not have return data available. The default is to include NA data. Choose from the following NA Returns Data options:

|**Include**|(Default) Select to assign companies with unavailable returns data into an NA fractile. When selected, securities are included in fractile groupings even though they don't have returns.|
|---|---|
|**Exclude**|Select to exclude securities with unavailable returns data from ALL fractile groupings.|
|**Replace with Zero**|Select to assign a zero value to companies with unavailable return data.|
|**Replace with Period Average**|Select to assign the period average of the returns data to companies with unavailable return data.|
|**Replace with Period Median**|Select to assign the period median of the returns data to companies with unavailable return data.|

[Top of Page](https://my.apps.factset.com/oa/pages/21526#top)

___

## Maximum/Minimum % Returns

Control outlier returns by placing caps on minimum and maximum returns. Choose from the following outlier options: 

### Limit

|**None**|(Default) Select if you do not want to control maximum/minimum return values.|
|---|---|
|**Percent Returns**|Select to apply a maximum or minimum percent return cap. Enter a percent value in the text box and then select from the [Replace With](https://my.apps.factset.com/oa/pages/21526#replace_with) options.|
|**Number of Standard Deviations**|Select to control maximum or minimum percent return outliers using a number of standard deviations away from the universe average for each period (i.e., normal distribution). Enter the number of standard deviations (using a positive value) you want to use to limit the minimum or maximum percent return value allowed, and then select from the [Replace With](https://my.apps.factset.com/oa/pages/21526#replace_with) options.|
|**Fractile**|To replace outliers based on fractiles (i.e., uniform distribution), select the "Fractile" option. The first number you must enter is the cut-off fractile for outliers and the second number you must enter is the number of fractiles for the evaluation. Next, select from the "Replace With" options.
For example, if you set the maximum limit to 2 of 100, the return data is fractiled into 100 groups, where the data points in the first fractile are considered outliers and are replaced with the highest value in the second fractile (if the Maximum "Replace With" option is selected). The symmetrical entry for minimum fractile replacement would be 99 of 100, where return data in the 100th fractile is replaced by the lowest value in the 99th fractile.
When using this option, you can click on the **Configure ![](online-assistant/26961.1.html)**  button to specify additional fractiling options for your outlier fractiles, such as tie resolution. 
![](online-assistant/26961.2.html)|

### \# of Winsorizations

(Optional) To determine the number of iterations applied for replacing outlier data either using the "# of Standard Deviations" or "Fractile" options, select the "# of Winsorizations" option and enter a number in the text box. The default value is 1, which only calculates and replaces outliers once. To do multiple iterations, replace "1" with a greater integer value. 

For example, if you enter "2" for the # of Winsorizations and enter "1" standard deviation and replace with "Maximum," Alpha Testing begins a series of calculations. First, it calculates the average and standard deviation for the factor data and replaces the outliers that are greater than one standard deviation over the average with the result of one standard deviation over the average. Then Alpha Testing calculates a new average and standard deviation and replaces any values that are one standard deviation over the average with the result of one standard deviation over the average. (If you entered "3," then Alpha Testing would repeat this process a third time, four times if you entered "4," etc.). 

Launch the spreadsheet below to view how factor values are replaced for several different winsorization entries. 

![](online-assistant/26962.html) [FactSet\_AT3\_Winsorization](https://my.apps.factset.com/oa/pages/cms/oaAttachment/7ac890e8-f7a2-4cee-aa79-7c02483d70dc/26962)

Typically, when you enter a # of Winsorizations greater than 1, this is selected with the number of standard deviations and maximum/minimum "Replace With" options.

You can have a # of Winsorizations greater than 1 with the Fractile option, but then you must select average, median, or NA options as the "Replace With" option (as a "Replace With Maximum/Minimum" selection would repeat the same replacement on subsequent iterations).

Alpha Testing evaluates each winsorization iteration one at a time, replacing values for both the minimum and maximum side and then using the new population of factor values to evaluate the next winsorization iteration. Typically, you enter similar inputs for the maximum and minimum factor values, but if you did enter a different number of winsorizations, then Alpha Testing would only do replacements for the one side with the greater number of winsorizations on each iteration above the lower number entered.

### **Available "Replace With" Options**

You can replace minimum and maximum outliers with either the Period Average, the Period Median, the Period Minimum or Maximum, or NA.

[Top of Page](https://my.apps.factset.com/oa/pages/21526#top)

___

## FactSet Prices and MSCI Return Source Options

### Partial Period Returns for NAs (Limited History)

Select the "Partial Period Returns for NAs (Limited History)" check box to have Alpha Testing use Portfolio Analysis as the return calculation engine. When this option is selected, Alpha Testing fetches intra-period returns for securities that stop trading in the forward-return period. This option is only applicable to the FactSet Prices and MSCI return sources. When this option is selected, compounded returns will be used for FactSet Prices forward returns on all dates and for MSCI forward returns starting on 12/31/2000. 

The "Partial Period Returns for NAs (Limited History)" option contains five years of current rolling history for FactSet Prices. If your model goes back more than five years, you have FactSet Prices as your return source, and you select this option, then your initial periods will not have intra-period returns for dead companies, whereas your later periods will. If your model goes back more than five years, you can [create a custom returns source](https://my.apps.factset.com/oa/pages/pages/21416#custom_return_source) to get partial period returns. For example, if you are using the Pricing database, enter the following when creating the custom return source:

IF(RANGE(PDNC(LAST),PDNC(0),PDNC(#F)),100\*(((P(LAST)+PCUMDIVX\_ORIG(#F)-PCUMDIVX\_ORIG(0))\*EXRATE(PISO,"#CU",PDNC(LAST)))/P(#CU 0)-1),PRETC(#CU 0 #F))

where you substitute the actual [ISO currency code](https://my.apps.factset.com/oa/pages/pages/1470) (e.g., GBP for British Pounds) for #CU. If you do not want a compounded return, you can replace PRETC with PRET in the example custom code.

|**Notes**|If all the securities in your universe trade in the same market then this formula can be simplified to: IF(RANGE(PDNC(LAST),PDNC(0),PDNC(#F)),100\*(((P(LAST)+PCUMDIVX\_ORIG(#F)-PCUMDIVX\_ORIG(0)))/P(0)-1),PRETC(0 #F))
|---|---|
The MSCI database does not have a Last Trading Day formula equivalent to the Prices database. For this reason it is difficult to approximate Portfolio Analysis's return methodology in Alpha Testing when using the MSCI database.
Use the following custom return formula:
IF(RANGE(PDNC(LAST),PDNC(0),PDNC(#F)),100\*(((P(LAST)+PCUMDIVX\_ORIG(#F)-PCUMDIVX\_ORIG(0))\*EXRATE(PISO,"#CU",PDNC(LAST)))/P(#CU 0)-1),MSCI\_RETC(#F,0,#CU))
where you substitute the actual ISO currency code for #CU
and enter the following weight formula:
MSCI\_MCAP\_FIF\_CO(0)|

Selecting "Partial Period Returns for NAs (Limited History)" will not cause Alpha Testing to calculate partial period returns for return horizons that extend past the date that you are running in the model. This option only calculates partial period returns for forward-return horizon end dates that exist. If you want to calculate partial period returns for future return horizons, select the "Partial Period Returns for Future Dates" check box.

Alpha Testing will not calculate a forward return at all for securities that have stopped trading if the report date (beginning date of return) is the last day that they traded. An exception is for securities that have stopped trading recently: the pricing database will continue to repeat the same price for securities for 30 trading days to ensure that a security has stopped trading and make sure that there are no final corporate actions.

For example, on 15-Mar-2006, the prices database still had repeated prices listed up to the present for only those securities that stopped trading after 31-Jan-2006. 

### Partial Period Returns for Future Dates

By selecting the "Partial Period Returns for Future Dates" check box, Alpha Testing will calculate partial returns when your model's forward return date is a future date (e.g., if today is 7-Jul-2006, then a one month return is calculated from 30-Jun-2006 to 7-Jul-2006 for your report date of 30-Jun-2006).

With this added functionality, "Today's" date is considered a future date since closing prices are not yet available.

For partial monthly and weekly returns, the Partial Period Returns for Future Dates option will only work for databases that have daily returns (e.g., FactSet, MSCI, and Russell). For monthly databases (e.g., Compustat and Refinitiv Worldscope Fundamentals), NA is returned.

In addition, when using FactSet Prices as the return source, this option returns an intraday return (e.g., if today is 7-Jul-2006, then a one month return calculated for your report date of 30-Jun-2006 will use the intraday price of 7-Jul-2006 for the ending value in the return calculation). Other daily return databases (e.g., MSCI, Russell) will not include today's price in partial period returns for future dates.

[Top of Page](https://my.apps.factset.com/oa/pages/21526#top)

___

## Return Horizons

By default, a return horizon is automatically entered for you that matches your [Return Rebalancing Frequency](https://my.apps.factset.com/oa/pages/pages/21243#universe_frequency).

To specify additional forward return horizons:

1.  Enter a number in the Return Horizon text box or choose a number from the drop-down menu.
    
    ![](online-assistant/26961.3.html)
2.  Select a return frequency from the next drop-down menu. For example, if you enter "2" for step 1 and select "Weekly" as the frequency, you are specifying a two-week return horizon.
3.  Click the **Add** button to include the return horizon in your model.

|**Note**|By default, Alpha Testing returns NAs for any return horizons on dates where that return horizon goes past today's date.
|---|---|
For example, if you run an Alpha Testing model on 15-Mar-2006 that had return horizons of one month and three months, then on the report date 31-Jan-2006, you would get results for the one-month return horizon and NAs for your three-month return horizon. Alpha Testing will not calculate a partial period return (from 31-Jan-2006 to 14-Mar-2006) in this case.
To calculate partial period returns for future return horizons, you must select the "[Partial Period Returns for Future Dates](https://my.apps.factset.com/oa/pages/21526#pp_future)" check box.|

### Add Subperiods

Alpha Testing lets you break apart your return horizons into smaller subperiods. These subperiods are evenly divisible segments of your return horizon that you can analyze individually. For example, if your return horizon is three months, you can analyze results from each of the three months separately rather than as a single unit of time.

You can divide your return horizons into any number of evenly divisible subperiods. If you have a 10 month return horizon, you can divide it into one-month, two-month, or five-month subperiods. Similarly, you can only divide your return horizon into subperiods using the same frequency (days, weeks, or months) as the original return horizon. This means that return horizons measured in months can only be broken up into months; days into days; and so on. You must have at least two intervals (e.g., two months) to insert subperiods.

To create subperiods:

1.  Select any of your return horizons. If your return horizon can be broken up into equal subperiods, the **Add Subperiod ![](online-assistant/26961.4.html)**  button will activate.  
2.  Click the **Add Subperiod ![](online-assistant/26961.5.html)**  button. In the drop-down, select the number of subperiods to use for your return horizon. Your options will be limited to those that evenly divide into the return horizon.
    
    ![](online-assistant/26961.4.html)
3.  Click the **Add** button to add the subperiods to your report. Alpha Testing will fetch returns for the universe, benchmark, and risk-free rate.
    
    ![](online-assistant/26961.6.html) 
    
    |**Note**|You can add multiple subperiods to the same return horizon.|
    |---|---|
    

[Top of Page](https://my.apps.factset.com/oa/pages/21526#top)
