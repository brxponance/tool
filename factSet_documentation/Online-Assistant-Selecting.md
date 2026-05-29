---
created: 2026-05-05T19:02:10 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21351
author: 
---

# Online Assistant : Selecting

> ## Excerpt
> The following page details the various Data Management and Fractiling Options available when adding a factor.

---
The following page details the various Data Management and Fractiling Options available when [adding a factor](https://my.apps.factset.com/oa/pages/pages/21240).  

Topics covered:

-   [Data Management Options](https://my.apps.factset.com/oa/pages/21351#data_mgmt)

-   [Handling NA Factor Data](https://my.apps.factset.com/oa/pages/21351#na)
-   [Controlling for Factor Data Outliers](https://my.apps.factset.com/oa/pages/21351#control)

-   [Fractiling Options](https://my.apps.factset.com/oa/pages/21351#fractiling_options)

-   [Using the Histogram Option](https://my.apps.factset.com/oa/pages/21351#histogram)
-   [Fractiling Across Periods](https://my.apps.factset.com/oa/pages/21351#fractile_periods)
-   [Defining Tie Resolutions](https://my.apps.factset.com/oa/pages/21351#ties)
-   [Setting Fractiling Type](https://my.apps.factset.com/oa/pages/21351#fractiling_type)

-   [Understanding How Alpha Testing Calculates Fractiles](https://my.apps.factset.com/oa/pages/21351#calculate_fractile)

___

## Data Management Options

Data Management options are available when adding/editing factors.  You can find the options within Edit Model Options > Factors > Options section for a selected factor.

![](online-assistant/26713.html)

### Handling NA Factor Data

Alpha Testing lets you decide how to address securities that do not have available factor data. Choose from the following NA factor data options:

|**Include**|(Default) Select to assign companies with unavailable factor data into an NA fractile.  When "Include" is selected under NA Factor Data, securities with factors expressing NA will be included in the MFR Audit Report, but will not contribute to the calculation of the period-level MFR score. See [Auditing MFR Scores](https://my.apps.factset.com/oa/pages/pages/14100#audit) for more information.|
|---|---|
|**Exclude**|Select to exclude securities with unavailable factor data from a fractile. Only companies with factor data will be placed into fractiles.|
|**Replace with Zero**|Select to assign a zero value to companies with unavailable factor data.|
|**Replace with Period Average**|Select to assign the period average of the factor data to companies with unavailable factor data.|
|**Replace with Period Median**|Select to assign the period median of the factor data to companies with unavailable factor data.|
|**Replace with Period Max**|Select to assign the maximum value for the period to companies with unavailable factor data.|
|**Replace with Period Min**|Select to assign the minimum value for the period to companies with unavailable factor data.|

|**Note**|Normally, when you select a "Replace with" option for a factor, you will not get NA values, so an NA fractile will not be available in your reports or available as a [filter](https://my.apps.factset.com/oa/pages/pages/13554#filtersection) for that factor. The only exception is if all of your securities' factor values are NA for a single period. In that case, they are all represented as NAs and there will be an NA fractile for that factor in your reports.|
|---|---|

### Controlling for Factor Data Outliers

Alpha Testing lets you control your factors' outlier data  Choose from the following outlier options:

|**None**|(Default) Select if you do not want to control maximum/minimum factor values.|
|---|---|
|**Factor Value**|Select to specify an actual value to control maximum/minimum factor values.  Enter an actual factor value in the text box that you want to use as your minimum/maximum value, and then select from the Replace With options.|
|**Number of Standard Deviations**|Select to control maximum/minimum factor outliers using a number of standard deviations away from the universe average for each period (i.e., normal distribution).  Enter the number of standard deviations that you want to use to limit the minimum or maximum factor value allowed, and then select from the Replace With options.|
|**Fractile**|Select to replace outliers based on fractiles (i.e., uniform distribution). Enter the fractile range: the first number represents the cut-off fractile for outliers and the second number determines the total number of fractiles for evaluation.  Then, select from the "Replace With" options.
For example, if you set the maximum limit to 2 of 100, the factor data is fractiled into 100 groups, where the data points in the first fractile are considered outliers and are replaced with the highest value in the second fractile (if the Maximum "Replace With" option is selected). 
The symmetrical entry for minimum fractile replacement would be 99 of 100, where data in the 100th fractile is replaced by the lowest value in the 99th fractile.|

**\# of Winsorizations**

(Optional) To determine the number of iterations applied for replacing outlier data either using the "# of Standard Deviations" or "Fractile" options, select the "# of Winsorizations" option and enter a number in the text box. The default value is 1, which only calculates and replaces outliers once. To do multiple iterations, replace "1" with a greater integer value. 

For example, if you enter "2" for the # of Winsorizations and enter "1" standard deviation and replace with "Maximum," Alpha Testing begins a series of calculations. First, it calculates the average and standard deviation for the factor data and replaces the outliers that are greater than one standard deviation over the average with the result of one standard deviation over the average. Then Alpha Testing calculates a new average and standard deviation and replaces any values that are one standard deviation over the average with the result of one standard deviation over the average. (If you entered "3," then Alpha Testing would repeat this process a third time, four times if you entered "4," etc.). 

Launch the spreadsheet below to view how factor values are replaced for several different winsorization entries. 

![](online-assistant/26962.html) [FactSet\_AT3\_Winsorization](https://my.apps.factset.com/oa/pages/cms/oaAttachment/7ac890e8-f7a2-4cee-aa79-7c02483d70dc/26962)

Typically, when you enter a # of Winsorizations greater than 1, this is selected with the number of standard deviations and maximum/minimum "Replace With" options.

You can have a # of Winsorizations greater than 1 with the Fractile option, but then you must select average, median, or NA options as the "Replace With" option (as a "Replace With Maximum/Minimum" selection would repeat the same replacement on subsequent iterations).

Alpha Testing evaluates each winsorization iteration one at a time, replacing values for both the minimum and maximum side and then using the new population of factor values to evaluate the next winsorization iteration. Typically, you enter similar inputs for the maximum and minimum factor values, but if you did enter a different number of winsorizations, then Alpha Testing would only do replacements for the one side with the greater number of winsorizations on each iteration above the lower number entered.

**Available "Replace With" Options**

You can replace minimum and maximum outliers with either the Period Average, the Period Median, the Period Minimum or Maximum, or NA.

[Top of Page](https://my.apps.factset.com/oa/pages/21351#top)

___

## Fractiling Options

Fractiling Options are available when adding/editing factors.  You can find the options within Edit Model Options > Factors > Options section for a selected factor.  Fractiling options are only available for non-grouped factors.

![](online-assistant/26713.1.html)

See [Understanding How Alpha Testing Calculates Fractiles](https://my.apps.factset.com/oa/pages/21351#calculate_fractile) for additional context on how fractiles are calculated.

### Using the Histogram Option

Select the "Histogram" check box within Fractiling Options to generate fractile assignments based on interval values.  When you select this option, Alpha Testing assigns securities to the fractile whose range they fit into. Thus, the first fractile may have 20 securities, while the third fractile may have only three securities.  

Grouping intervals are determined by: (highest value - lowest value) divided by the number of desired fractiles.

### Fractiling Across Periods

Select this option to calculate fractiles or ranks on formula data for results for all periods. By default, fractiles and ranks are generated for individual periods and not across all periods.

|**Tips**|After your model's data is fractiled or ranked for all periods, you can sort the Constituents report for a factor over all periods. With this option selected, the highest values for a factor for any period are placed in Fractile 1. Thus, some periods may have no securities in the first fractile. 
|---|---|
Also, you can generate histogram buckets calculated on the range of values for all periods by using the [Histogram](https://my.apps.factset.com/oa/pages/21351#histogram) option and the Fractile Across All Periods option.|

### Defining Tie Resolutions

Within Fractiling Options, you can specify how you want Alpha Testing to handle ties.

At each factor rebalancing date, Alpha Testing first sorts the universe constituents based on the factor's value. Then those sorted companies are assigned to initial fractile rankings based on the number of fractiles you selected from the Fractiles drop-down menu. Next, Alpha Testing checks for cross-fractile ties and makes reassignments based on your tie specification.  Choose from the following tie options:

|**Move to Lower Fractile (LF)**|Assigns all the companies within a cross-fractile tie group to the lowest possible fractile number. For example, if the last value given an initial fractile ranking of 1 is the same as the first value given an initial fractile ranking of 2, then all the companies within this cross-fractile tie group will be assigned to the first fractile.|
|---|---|
|**Move to Higher Fractile (HF)**|Assigns all the companies within a cross-fractile tie group to the highest possible fractile number. For example, if the last value given an initial fractile ranking of 1 is the same as the first value given an initial fractile ranking of 2, then all the companies within this cross-fractile tie group will be assigned to the second fractile.|
|**Midpoint**|(Default) Assigns all the companies within a cross-fractile tie group to the midpoint's initial fractile rank. For example, if the midpoint company has a fractile rank of 1, then the companies with tied values will be assigned to the first fractile. 
![](online-assistant/26713.2.html)|
|**Other**|Select this option to enter a tie resolution number between 0 and 1, which is the argument used in the [UFTILEX](https://my.apps.factset.com/oa/pages/pages/13774) and [UWFTILEX](https://my.apps.factset.com/oa/pages/pages/1798) functions.|

### Setting Fractiling Type

Within Fractiling Options, you can specify how you want securities to be placed into your fractile ranks.

|**Fractiling Type**|
|---|
|Equal Weighted, Outside-In|Distributes an equal number of securities into each fractile rank and places excess securities into the outside fractile ranks first.|
|Equal Weighted, Inside-Out|(Default) Distributes an equal number of securities into each fractile rank and places excess securities into the inside fractile ranks first.|
|Weighted|Distributes a specified weighted number of securities into each fractile. You cannot control where excess securities are placed. When you select this option the default weight value is "1," which distributes an equal number of securities into each fractile rank.
Additionally, if you select "Weighted" as a your Fractiling Type, you cannot select a Favor option.|
|**Favor Options**|
|Better Fractiles|When placing extra securities into fractile ranks, better or lower numbered fractiles are favored.|
|Worse Fractiles|(Default) When placing extra securities into fractile ranks, worse or higher numbered fractiles are favored.|

**Example**

If you have a universe of five securities, and specify four fractiles, then one fractile will get an extra security. Below illustrates what happens to your extra securities based on the fractiling and favor options you select:

-   If you select "Outside-In" and "Favor Better Fractiles," extra securities are put into Fractile 1
-   If you select "Outside-In" and "Favor Worse Fractiles," extra securities are put into Fractile 4
-   If you select "Inside-Out" and "Favor Better Fractiles," extra securities are put into Fractile 2
-   If you select "Inside-Out" and "Favor Worse Fractiles," extra securities are put into Fractile 3

[Top of Page](https://my.apps.factset.com/oa/pages/21351#top)

___

## Understanding How Alpha Testing Calculates Fractiles

Fractile assignments for securities are created using either the [UFTILEX](https://my.apps.factset.com/oa/pages/pages/13774) or the [UWFTILEX](https://my.apps.factset.com/oa/pages/pages/1798) function.

-   When you select the "Weighted" fractiling type option, the UWFTILEX formula is used.
-   When you select the "Equal Weighted" fractiling type option, the UFTILEX formula is used.

The inputs you enter in the Model Inputs dialog are used in the above two codes.

The following values are applied as your formula arguments:

-   Your Alpha Testing universe is used as the universe argument.
-   The number of fractiles you selected is used for the number of fractile arguments.
-   The tie resolution you specified is used as the tie resolution argument.
-   Your factor formula is used for the formula argument.
-   If you selected the "Weighted" fractiling type option, the weight formula you entered is used as the weight argument in the UWFTILEX function (UFTILEX does not accept a weight argument).
-   If you selected the "Equal-weighted" fractiling type option, the Outside-In vs. Inside-Out and the Better vs. Worse favor options are used as the last two arguments in the UFTILEX function.

The UFTILEX function lets you control how excess securities are placed into fractiles, whereas the UWFTILEX function does not.

[Top of Page](https://my.apps.factset.com/oa/pages/21351#top)
