---
created: 2026-05-05T19:03:02 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13697
author: 
---

# Online Assistant : Custom Return

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Custom Return Variables Page 13697

Launch it with FactSet Search: @AT4

This page reviews the variables than can be used with [custom return formulas](https://my.apps.factset.com/oa/pages/pages/21416).

|**Note**|You can use the custom return variables listed on this page when creating weight, market capitalization, [factor](https://my.apps.factset.com/oa/pages/pages/21240), and universe formulas.|
|---|---|

Topics covered:

-   [Using the Forward Return Date Variable (#F)](https://my.apps.factset.com/oa/pages/13697#f)
-   [Using the Return Frequency Number Variable (#FREQ)](https://my.apps.factset.com/oa/pages/13697#freq)
-   [Using the Currency Variable (#CU)](https://my.apps.factset.com/oa/pages/13697#convert)
-   [Using the Return Periods Per Year Variable (#PY)](https://my.apps.factset.com/oa/pages/13697#py)
-   [Using the Monthly Forward Date Variable (#MF)](https://my.apps.factset.com/oa/pages/13697#mf)
-   [Using the Forward Date Variable (#FD)](https://my.apps.factset.com/oa/pages/13697#fd)
-   [Using the Model Universe Variable (#ISONU)](https://my.apps.factset.com/oa/pages/13697#isonu)
-   [Using Current Date Variables](https://my.apps.factset.com/oa/pages/13697#current)
-   [Using Frequency Variables (#FR)](https://my.apps.factset.com/oa/pages/13697#fr)
-   [Using Universe Rebalance Date Variables](https://my.apps.factset.com/oa/pages/13697#univ)
-   [Specifying the Return Horizon for Your Custom Return Variable](https://my.apps.factset.com/oa/pages/13697#specify)
-   [Saving Custom Returns](https://my.apps.factset.com/oa/pages/13697#saving)

___

## Using the Forward Return Date Variable (#F)

This section explains how the Forward Return Date (#F) variable works when used in custom return formulas. When you use the #F variable properly and add Additional Return Horizons, #F changes to the correct forward return date for each additional Return Horizon you specify.

-   **#F**: Retrieves forward return dates in absolute date format into your custom return formulas.
-   **+#F**: Retrieves the Return Horizon in relative date format based on the [return horizon you entered](https://my.apps.factset.com/oa/pages/pages/21526#return_horizons) in the Returns section.
    
    |**!**|Do not use a relative +#F if your database frequency differs from your Return Horizon frequency.|
    |---|---|
    

Relative dates represent a date relative to the most recently updated period. For example, 0 (zero) represents the most recently updated period; +1 represents the time period subsequent to the most recent period. The "zero date" is determined by the default time period or the natural frequency of the data being requested. Zero (0), when used with monthly data, indicates the most recent month-end. Plus one (+1), when used with annual data, indicates one fiscal year subsequent to the most recently updated fiscal year

### Example One

If your model's start date is 31 December 2002, and you selected a monthly [return rebalance frequency](https://my.apps.factset.com/oa/pages/pages/21243#universe_frequency):

-   MRETS(0 #F)
    
    #F is replaced with 1/31/2003
-   MRETS(0 0+#F)
    
    +#F is replaced with 1 and is evaluated as 31-Jan-2003 because Compustat is a monthly database.

### Example Two

If you select "Monthly" for your returns rebalance setting in the Time Series tab and enter 1, CM\_RET(0 0+#F) returns a one-month return (CM\_RET(0 0+1)).

If you select "Monthly" for your returns rebalance setting in the Time Series tab and enter 1, PRET(0 0+#F) returns a one-day return (not a one-month return). This is because 1 is substituted for #F and the natural frequency of the Prices database is daily. (The PRET formula fetches data from the Pricing database.)

If you select "Monthly" for your returns rebalance setting in the Time Series tab and enter 10, PRET(0 0+#F) returns a ten-day return (PRET(0 0+10)).

|**Note**|The number you enter in the "Returns" Rebalance Settings text box is used to calculate your custom returns when using the #F variable.|
|---|---|

To get a monthly return using the Pricing database:

1.  In the Returns section, enter "1" in the Return Horizon text box.
2.  Select "Monthly" for your return rebalance frequency.
3.  Enter PRET(0 #F) as your [custom return formula](https://my.apps.factset.com/oa/pages/pages/21416#custom_return_source).

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using the Return Frequency Variable (#FREQ)

To automatically enter the number of forward return periods for each Return Horizon entered, use the return frequency variable (#FREQ).

### Example

For example, if your return rebalance is three months and you are using SUM#FREQ(WSMQDIV(#F)) within your custom return formula,

#FREQ is replaced by 3 to return the sum of the last three month's dividends from the forward return date.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using the Currency Variable (#CU)

To apply the currency you specified for your model as the currency ISO code, use the currency variable (#CU).

Use the currency variable (#CU) with market capitalization and weight formulas. Do not use the currency variable (#CU) when specifying the currency used to calculate returns.

|**Note**|MSCI codes do not accept the ISO code argument.|
|---|---|

### Example

WS\_MP(0,#CU) \* AVAIL(WS840(0),WS287(0)) returns market capitalization using the currency you specified in the Returns tab.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using the Return Periods Per Year Variable (#PY)

To automatically enter the number of return periods that would equal a year for each Return Horizon entered, use the Return Periods Per Year variable (#PY).

For daily returns, if you selected the Seven Day [calendar](https://my.apps.factset.com/oa/pages/pages/21243#time_series) in the Time Series section, then 365 days is used to determine #PY, but for all other calendars 250 days is used to determine #PY.

## Example

For example, if your return rebalance is set to three months, then the results for #PY is 4. This is because there are four three month returns in one year. If your return rebalance is 1 day and your selected calendar is Five Day, then the result for #PY is 250.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using the Monthly Forward Date Variable (#MF)

To automatically enter the forward monthly date for your Return Horizon in the MM/YYYY date format, use the Monthly Forward Date variable (#MF).

Use the #MF variable (not #F) when you are using a monthly database request code, such as WSMP (Refinitiv Worldscope Fundamentals Monthly price).

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using the Forward Date Variable (#FD)

To automatically enter the forward date as your Return Horizon, use the Forward Date variable (#FD).

This variable works the same as the [#F variable](https://my.apps.factset.com/oa/pages/pages/13697#F) for absolute dates.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using the Model Universe Variable (#ISONU)

To reference a model's universe within Model Inputs, use #ISONU=1. For example, UAVG(#ISONU=1, P(USD 0)) will return the model universe's average price in USD. You can use #ISONU within a factor, universe formula, or returns formula.

#ISONU references the model universe for the date being calculated.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using Current Date Variables

Use Current Date variables to enter in a current date into your return code.

Current date variables include:

-   **#D**: Current Day (e.g., 31 for 31-Mar-2001)
-   **#M**: Current Month (e.g., 3 for 31-Mar-2001)
-   **#Y**: Current Year (e.g., 2001 for 31-Mar-2001)
-   **#SD or #RD**: Current date using the MM/DD/YYYY date format

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using Frequency Variables (#FR)

Use the Frequency variable (#FR) to enter in the frequency you selected in the Time Series tab into your return code.

The frequency variable can return the following results:

-   **D**: Daily Frequency
-   **W**: Weekly Frequency
-   **M**: Monthly Frequency

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Using Universe Rebalance Date Variables

You can reference the most recent Universe Rebalance Date using #RBD or #RBDM.

-   #RBD will return the date in MM/DD/YYYY format
-   #RBDM will return the date in MM/YYYY format

You can use these variables to float weights between rebalance dates for models where the Return rebalance is more frequent than the Universe rebalance. For example, using 1+(PRET(#RBD 0)/100) as the weighting formula will equal weight your constituents on the rebalance date and float the weight in between rebalance dates based on performance.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Specifying the Return Horizon for Your Custom Return Variable

You can specify a specific Return Horizon for your Return variable by adding a number after your custom return variable. The default Return Horizon associated with your return rebalance is always Return Horizon number 1.

-   If you you do not specify a number with your custom return variable, then the custom return variable is evaluated differently for each Return Horizon.
-   If you specify a number, then the custom return variable returns the result for the specific Return Horizon n when every Return Horizon is evaluated.

### Example

If your your Return Horizon in the [Returns section](https://my.apps.factset.com/oa/pages/pages/21526#return_horizons) is set to one month and you've added two Additional Return Horizons (three months and six months), then P(#F2) inserts the three-month forward return date into the calculation for each Return Horizon; whereas, P(#F) inserts the one, three, and six-month forward dates into the Price code for each respective Return Horizon.

The following custom return variables accept an argument n when specifying the Return Horizon:

-   #Fn
-   #FREQn
-   #PYn
-   #MFn
-   #FDn
-   #FRn

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)

___

## Saving Custom Returns

You can save your custom returns to either a specific directory ([Personal](https://my.apps.factset.com/oa/pages/pages/3935#personal_library) or [Client](https://my.apps.factset.com/oa/pages/pages/3922#client_library)) or to the Document directory.

-   To save your custom returns for only the current model, you must save to the document directory. If your custom return formulas reference a specific Universal Screening row for return, weight, or a market capitalization formula, you must save to the Document directory.
-   To save your custom returns to be used for all your models, you must save to the Client or Personal directory.

[Top of Page](https://my.apps.factset.com/oa/pages/13697#top)
