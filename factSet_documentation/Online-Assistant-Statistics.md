---
created: 2026-05-05T19:19:55 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20664
author: 
---

# Online Assistant : Statistics

> ## Excerpt
> Apply statistics with Function Builder to view totals, averages, and more for your report columns.

---
## Applying Statistical Functions Page 20664

Apply statistics with [Function Builder](https://my.apps.factset.com/oa/pages/pages/20695) to view totals, averages, and more for your report columns. 

**Topics covered:**

-   [Creating Group, Weight, and Universe Statistics](https://my.apps.factset.com/oa/pages/20664#GroupWeightUniverse)
-   [Understanding a Date Range](https://my.apps.factset.com/oa/pages/20664#DatetoDate)
-   [Specifying a Time Series](https://my.apps.factset.com/oa/pages/20664#Standard)
-   [Setting an N/A Threshold](https://my.apps.factset.com/oa/pages/20664#Threshold)
-   [Using Multiple Parameters](https://my.apps.factset.com/oa/pages/20664#Multiple)

___

## **Creating Group, Weight, and Universe Statistics**

You can specify and adjust up to four different inputs when calculating a statistic at a single point in time. Each applied input affects the way in which your function is calculated. The first input, Parameter, is always required. The three others – Group, Weight, and Universe – are optional. 

These statistics can be used to perform many types of calculations, both simple and complex. Each has a default that lets you easily replicate simple functions, which normally require one or two arguments (i.e., UAVG or UWAVG). They also let you replicate complex functions that generally require more specificity.

-   **Weight** determines how much impact a security has on the statistical calculation. The search box is type-ahead compatible; it accepts any formulas. The default is "Not Weighted" (i.e., 1). 
-   **Group** adjusts the aggregation over which your function calculates. The Group search box is also type-ahead compatible. It accepts formulas or report groups, which are referenced using #P.GRLVL_n_. The default is "No Groups" (i.e., 1). 
-   **Universe** determines which securities are used to calculate your function. This input provides a list of commonly used universe options. The default universe is [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790), which is comprised of securities that have passed all of your universe limitations. These are identified in the application's Criteria pane.
    
    Other universe inputs are as follows:
    
    -   Securities in Report: Uses the [RUNIVERSE](https://my.apps.factset.com/oa/pages/pages/10914) function to collect and calculate all of your passing securities; this option cannot be used as a parameter or a parameter reference
    -   Securities in OFDB: Allows you to input your own OFDB formula
    -   Securities in Index: Allows you to select any index or ETF
    -   Securities in Custom Universe: Allows you to input your own Universe formula; if set to "1", it lets you replicate the behavior of statistical formulas that do not calculate over a defined universe (e.g., GAVG)
    
    |**Note**|The RUNIVERSE function works similarly to the [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790) function; however, the SCREENUNIVERSE function does not consider the parameter limitation when calculating the universe. Therefore, the number of companies considered by RUNIVERSE will always be less than or equal to the number evaluated by SCREENUNIVERSE.
    |---|---|
    You can limit your screen with SCREENUNIVERSE, but not RUNIVERSE. For example, `UAVG(**@SCREENUNIVERSE**,FF_SALES(ANN,0,RP,USD))>2000` is completely valid, while `UAVG(**@RUNIVERSE**,FF_SALES(ANN,0,RP,USD))>2000` is not.
    To work around RUNIVERSE and limit your screen, move all of your desired limits to the [Criteria](https://my.apps.factset.com/oa/pages/pages/20802) pane, and then apply @SCREENUNIVERSE to each.|
    

The [Running Total – Group Universe](https://my.apps.factset.com/oa/pages/pages/20664#RunningTotal) function requires two other inputs: Sort Parameter and Sort Order. These are used together to determine the order of sum items, which is used to arrive at the sequential sum. 

Once you have selected a function, enter text into the Parameter search box and select a formula or parameter reference from the list of matching results. Then, manipulate your group, weight, and universe inputs as needed. The Function section in the right pane of Function Builder will update to reflect your changes. Click **Done** to start interacting with your complete statistical function.

### **Function and Calculation**

The majority of group, weight, and universe statistics are calculated as follows:

`MGW<function>_GNA(<GroupInput>,<WeightInput>,IF((<UniverseInput>)=1,<ParamInput>,@NA))`

|**Note**|Certain functions (i.e., MAX, MIN, or SUM) only accept group and universe inputs; they do not accept a weight. Weight is included when available. The "W" and "<WeightInput>" metrics are excluded when it is not.|
|---|---|

However, there are few exceptions. The Running Total – Group Universe function calculates the running total of the formula for all of the companies in the group which are also in the specified universe. This is calculation is performed as follows: 

`UGRUNNINGTOTAL((<UniverseInput>),<GroupInput>,<ParamInput>,SortParameter>,<SortOrder>)` 

The Value for Identifier function can be viewed as having an identifier input for a universe. The function calculates the value of the given formula, which is evaluated for the specified identifier. It then returns the result of that identifier for every security in the screen. The Value for Identifier from Formula function is similar; however, its universe can simply be a _formula_ that returns an identifier.  It calculates the specified parameter for the identifier returned, and then returns that result for every security in the screen. 

For more information on the statistical functions available, see [Group, Weight, and Universe Statistics](https://my.apps.factset.com/oa/pages/pages/20665#GroupWeightUniverse).  

[Top of Page](https://my.apps.factset.com/oa/pages/20664#top)

___

## **Understanding a Date Range** 

You can specify and adjust the following inputs when calculating a statistic over a custom iteration (i.e., calculation) period: 

-   **Parameter** is the data item you want to iterate. It must have a date input. It cannot reference a parameter or global variable.
    
    |**Note**|Date-to-date iterations are only supported when they are used with items that have a natural daily frequency (e.g., prices, estimates).|
    |---|---|
    
-   **Start Date** is the date from which you would like to begin your iterations. The default is "0" (i.e., the most recent day).
-   **End Date** is the date on which you wish to end your iterations. The default is "5 Days" (i.e., five days ago).
-   **Frequency** denotes how often you want the function to calculate. The default frequency is "Days," meaning the function is calculated each day.

Once you have selected a function, enter text into the Parameter search box and select a formula that you want to iterate. Then, manipulate your start and end dates to adjust your function's calculation period. The frequency will allow you to change the data points in between the start date and end date. To access data for the last five days, set the start date to "0 Days" and the end date to "4 Days." 

### **Function and Calculation**

Date-range statistics are calculated as follows:

`<Function>(<ParameterInput>,<StartDateInput>,<EndDateInput>,<FrequencyInput>)`

When a valid parameter is selected, the [#DT](https://my.apps.factset.com/oa/pages/pages/17017) variable is automatically inserted into the date argument slot. This functionality is currently only available for parameters that accept a single date in Screening syntax. Parameters that take two dates (i.e., Price Change) are currently unsupported.

For more information on the statistical functions available, see [Date-to-Date and Time-Series Statistics](https://my.apps.factset.com/oa/pages/pages/20665#DatetoDateStandard).

[Top of Page](https://my.apps.factset.com/oa/pages/20664#top)

___

## **Specifying a Time Series**

Time-series statistics calculate over a function's natural frequency\*, which is determined by the way data is stored. You can specify and adjust the following inputs when calculating time-series statistics:

-   **Parameter** is the data item you want to iterate. It must have a date input. It cannot be a parameter reference.
-   **Over** is the number of periods you want your function to calculate. This must be an integer greater than or equal to 1. The default is "5."

Once you have selected a function, enter text into the Parameter search box and select a formula that you want to iterate. Then, manipulate the Over argument to specify the number of calculations you want.

### **Function and Calculation**

Time-series statistics are calculated as follows:

`<Function><# of Periods>(<ParameterInput>)`

\* A parameter is calculated in accordance with the formula's frequency when it is used with a valid number of iterations. For fiscal databases such as [FactSet Fundamentals](https://my.apps.factset.com/oa/pages/pages/15087), the periodicity will indicate the natural frequency of its iterations. For example, FF\_SALES(**ANN**,0) will iterate **yearly**, while FF\_SALES(**QTR**,0) will iterate **quarterly**. Data will iterate daily for non-fiscal databases such as [Prices](https://my.apps.factset.com/oa/pages/pages/458).

To learn more, see [Using Iterated Screening Functions](https://my.apps.factset.com/oa/pages/pages/17017). For more information on the statistical functions available, see [Date-to-Date and Time-Series Statistics](https://my.apps.factset.com/oa/pages/pages/20665#DatetoDateStandard).

[Top of Page](https://my.apps.factset.com/oa/pages/20664#top)

___

## Setting an N/A Threshold

Time-series statistics calculate across all available data points. If your screen's data count is greater than its threshold, you can use time-series statistics to specify how many _available_ data points are required in order for the function to return data. The statistic returns "N/A" if your function does not have enough data points to calculate. For example, setting the threshold to "5" tells the function that you do not want a value returned unless at least five data points are available in your calculation range. 

### Function and Calculation 

Statistics with an N/A threshold are calculated\* as follows: 

`IF(COUNT<# of Periods>(<Parameter>)>=<Required # of Data Points>,><Statistic><Same # of Periods>(<Same Parameter>),@NA)`

\* A parameter is calculated in accordance with the formula's frequency when it is used with a valid number of iterations. For fiscal databases such as [FactSet Fundamentals](https://my.apps.factset.com/oa/pages/pages/15087), the periodicity will indicate the natural frequency of its iterations. For example, FF\_SALES(**ANN**,0) will iterate **yearly**, while FF\_SALES(**QTR**,0) will iterate **quarterly**. Data will iterate daily for non-fiscal databases such as [Prices](https://my.apps.factset.com/oa/pages/pages/458).

This function works by first counting the number of data points over the specified number of calculation periods. If the required number of available data points is not met (e.g., there are only four available when six are requested), this function will return "N/A." If the required number of data points _are_ available, the statistic will calculate and return an exact value. 

[Top of Page](https://my.apps.factset.com/oa/pages/20664#top)

___

## **Using Multiple Parameters**

You can apply a statistic to multiple parameters for two reasons: to create a point-in-time average of various price return factors, or to view the maximum value across several different report columns. 

The only argument for these functions is a list of all parameters or parameter references that you want to use in your calculation. You can enter a specific formula in the Parameter search box or select an item from the Add Columns type-ahead results. Click the **Add Param** button to add another parameter. 

![](online-assistant/25795.html)

Statistics for multiple parameters are calculated as follows:

`<Statistic>(<Parameter1>,<Parameter2>,<Parameter3>,…<Parameter_n_>)`

A point-in-time statistic is returned for each security in your report.

[Top of Page](https://my.apps.factset.com/oa/pages/20664#top)
