---
created: 2026-05-05T19:02:01 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21243
author: 
---

# Online Assistant : Specifying the

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Specifying the Time Series in Alpha Testing 4 Page 21243

Launch it with FactSet Search: @AT4

The Time Series options let you specify your model's start and end dates, rebalance frequencies, calendar, and production date. You can also see a preview of your rebalance settings in order to determine the dates for your test. 

To access the Time Series options, click the **Edit** ![](online-assistant/26583.html) button next to the Time Series section of Model Options and select "Time Series" from the left pane. Alternatively, click the **Model Options** button located in the application toolbar. 

![](online-assistant/26583.1.html)

|![](online-assistant/26583.2.html)|
|---|

Topics covered:

-   [Defining Time Series Options](https://my.apps.factset.com/oa/pages/21243#time_series)
-   [Specifying Universe Frequency and Rebalance Settings](https://my.apps.factset.com/oa/pages/21243#universe_frequency)
-   [Including a Production Date](https://my.apps.factset.com/oa/pages/21243#production_date)
-   [Previewing Dates](https://my.apps.factset.com/oa/pages/21243#preview_dates)
-   [Understanding the Dates](https://my.apps.factset.com/oa/pages/21243#understand)

___

## Defining Time Series Options

After [launching the Time Series tab in Edit Model Options](https://my.apps.factset.com/oa/pages/21243#launch), use the Time Series section to define the calendar and dates used in the model.

### Calendar

To specify which trading calendar you want applied to your model, select a calendar option. The default calendar is the United States trading calendar. 

-   **Five Day
    
    **The five-day calendar uses all week days (Monday through Friday), and carries prices forward over trading holidays. A five-day calendar does not recognize Saturdays and Sundays.
-   **Seven Day**
    
    The seven-day calendar displays all days (Monday through Sunday) and carries prices forward over non-trading days. This is especially important if your [model uses an OFDB file](https://my.apps.factset.com/oa/pages/pages/20848#universe). If your OFDB file was last updated on the last calendar day (e.g., Saturday), you need to select the seven-day calendar option to display data for that Saturday.
-   **Country Specific**
    
    Select a calendar for a specific exchange.

|**Note**|Make sure that the calendar you select works with the codes you are using to define your universe, factors, and returns. For example, use the five-day calendar and not a country calendar for the MSCI database. To check the calendar, add your universe definition and factors to a Universal Screen, and set the back-test date to a date that will be run by your model and is also a holiday for one of the calendars you are considering. If constituents pass your screen and you have non-NA results for your factor codes, then you used the appropriate calendar option.
|---|---|
If your test uses month-end dates, then you must set your back-test date to MM/31/YYYY regardless of whether that is an actual or trading day.|

### Start Date and End Date

You can designate your model's start and end dates using [absolute](https://my.apps.factset.com/oa/pages/pages/3923#abs) dates, such as 1/31/2018 or 3/2017 or [relative](https://my.apps.factset.com/oa/pages/pages/3923#rel) dates where you can incorporate [date math](https://my.apps.factset.com/oa/pages/pages/1964#math) (e.g., two days before end of quarter).

A relative date is evaluated as of the current date and uses the selected iteration frequency. For example, a -1 relative date with a monthly iteration frequency is evaluated as of the previous month-end date. If the relative date is entered as -1M, then the date is evaluated as of the previous month-end even if you selected a daily iteration frequency.

To combine relative and fixed dates, use date math. For example, a start date of 12/31/2002-6Q and an end date of 12/31/2002+3M are evaluated as six quarter-ends prior to 12/31/2002 (6/30/2001) to three month-ends after 12/31/2002 (3/31/2003). The [date preview](https://my.apps.factset.com/oa/pages/21243#preview_dates) displays how dates using date math are interpreted.

Date format rules:

-   Enter absolute dates using the MM/DD/YYYY or MM/YYYY date formats. The DD/MM/YYYY date format is currently not supported.
-   Enter a start date that is an earlier date from the end date.

|**Note**|Alpha Testing uses MM/31/YYYY as its default backtest date for all month end dates in monthly models. This happens whenever you select the advanced date option "Use last day of the period" for [generating dates](https://my.apps.factset.com/oa/pages/pages/14354#generating). This is done so that data will be [lagged correctly](https://my.apps.factset.com/oa/pages/pages/13736#test).|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21243#top)

___

## Specifying Universe Frequency and Rebalance Settings

Set rebalancing frequencies for your Universe, Returns, Factors, and Weights.

### Universe Frequency 

You must use positive integers for your return and rebalancing inputs. You can choose either standard rebalancing or set a custom frequency.

**Standard**

Use the first line to select a regular frequency, and use the second line to select a specific rebalance date. The default is set to every month on the last calendar day of the period.

**Custom** 

Set a custom rebalance frequency using an FQL formula, or upload dates from a .txt file.

-   **FQL Formula**: Enter an [FQL formula](https://my.apps.factset.com/oa/pages/pages/3925#fql) to generate dates. To search for a formula, click the **Lookup** ![](online-assistant/26583.3.html) button to build the formula using [Formula Lookup](https://my.apps.factset.com/oa/pages/pages/14929). After entering the formula, the [Preview](https://my.apps.factset.com/oa/pages/21243#preview_dates) section will update to show the dates generated by the FQL formula.
    
    |**Tip**|If the formula is specific to a particular identifier, then use the [VALUE](https://my.apps.factset.com/oa/pages/pages/1501) function around the formula.
    |---|---|
    ![](online-assistant/26583.4.html)
    For the date arguments in the formula, you can enter #SD, #ED, and #FREQ as variables for the start and end dates and frequency; if you change your start or end date, the dates will automatically update in the formula. If you enter absolute dates and frequencies, then the dates generated will only be within the [start and end dates that were specified in the Time Series section](https://my.apps.factset.com/oa/pages/21243#dates).|
    
    |**Note**|If you enter a formula to generate dates, the [Rebalance Settings](https://my.apps.factset.com/oa/pages/21243#rebalance_settings) will be greyed out.|
    |---|---|
    
-   **User Defined**: Upload a set of custom dates. Click the **Lookup** ![](online-assistant/26583.5.html) button to find the file containing the custom dates. The file must be a text (.txt) file that contains only dates. The dates must be identically formatted (i.e., all 31-Jan-1999, 19990131, 01/31/1999, or 31/01/1999) and spaced using the same delimiter. You will get an error message if the inputs have mistakes or inconsistencies.
    
    Use the drop-down menus to define the format and delimiter used in the file. If the file is uploaded successfully, the [Preview](https://my.apps.factset.com/oa/pages/21243#preview_dates) section will update to show your new rebalancing dates.
    
    ![](online-assistant/26583.3.html)
    
    |**Note**|If you import dates, the following options will be grayed out:
    |---|---|
    -   Start Date
    -   End Date
    -   Standard Frequency
    -   Factors
    -   Security Weights 
    These options are no longer valid once you use import custom dates. You can change the Returns rebalance option to a regular interval, which will override the custom dates only for the Returns rebalance.|
    

### Rebalance Settings

Set rebalancing frequencies for your Returns, Factors, and Weights. You must use positive integers for your return and rebalancing inputs. 

![](online-assistant/26583.6.html)

### Understanding Universe Frequency and Returns Rebalancing Settings

The Universe rebalancing is what normally generates the report dates. However, if Return rebalancing is less than the Universe rebalancing (and is evenly divisible), then the Return rebalancing controls the report dates generated.

The Universe rebalancing also usually controls how frequently your universe and benchmark constituents, return, weight, market cap, and return data is fetched for your model. The Return rebalancing usually only controls the forward dates for your main return horizon. But if return rebalance is evenly divisible within the Universe rebalance, then the Return rebalance will also control how frequently return and market cap data is fetched.

For example, if both your Universe and Return rebalance frequency is 3 months, then your report dates and all data will be fetched every 3 months. But if your Universe rebalancing is three months and your Return rebalancing is one month, your report dates will be monthly, your return and market cap data will be fetched monthly, your main return horizon for each report date will be one month, but your universe will only be fetched every 3 months.

### Understanding Factor and Weights Rebalancing Settings

Factor and Weights rebalancing controls how frequently your factor and weight data is fetched, but these settings are only valid and controlled when the Return rebalancing is less then the Universe rebalancing (if the return rebalance is greater than or equal to the universe rebalance, then the data is fetched at the same frequency as the universe). Factor and Weight frequencies must be set between the Universe and Returns rebalancing frequencies.

For example, if your Universe rebalancing is 12 months and your Return rebalancing is one month, you can specify a 1, 2, 3, 4, 6, or 12 month Weight and/or Factor rebalancing. However, you cannot specify 5 as a Weight and/or Factor rebalancing because it cannot be evenly divided into the Universe rebalancing. You also cannot specify 13 as a Weight and/or Factor rebalancing because 13 is greater than 12.

**Example**

-   If the rebalancing frequency is set to quarterly (3), and the return frequency is set to one month (1), the Alpha Test will show the return for each month between quarterly rebalances.

[Top of Page](https://my.apps.factset.com/oa/pages/21243#top)

___

## Including a Production Date

The Production Date setting lets you use the most current data available in addition to backtested factor data.

The production date differs from standard backtesting in that Alpha Testing will ignore any lag period and will use the latest data available. By using the Production Date, you are effectively seeing how backtested research proves out in a current environment. In a standard backtest, Alpha Testing will correctly lag data based on a factor's inputs, and will not feel back for the most recently reported data. 

The production date will mimic Universal Screening's setting. Alpha Testing will ignore all [lags](https://my.apps.factset.com/oa/pages/pages/13743) in factor formulas and will use the latest data available in screening. It will feel back over previous periods to find the most recently available data. 

To run a model as a Production Run, use the Production Date drop-down menu to select either "Previous Close" (0) or "Latest" (NOW). The "Previous Close" option will run a model date of previous close in addition to any dates initiated by a standard model.

![](online-assistant/26583.7.html)

|**Note**|Production date conflicts can occur when the last backtest date either matches or exceeds the date you use.
|---|---|
-   When a backtest date and a production date are the same, a production date will take precedence over a backtest date. This is to ensure that any archival of the production date does not contain backtested data, which can be found using a non-production model.
-   When a backtest date exceeds a production date, Alpha Testing will display an error message.|

### Modifying a Model for Production Runs

If using the zero date, 0, in your formula, the zero will act as it does in Universal Screening when you have the Backtest Date set to "No Backtest Date."  This behavior is the same regardless if you choose Previous Close (0) or Latest (NOW).  However, if you want to toggle between Previous Close and and Latest production dates in your formula without having to edit the formula each time, you can use #PROD as the date argument.

The variable will behave according to the date type:

1.  For non-production dates, #PROD will behave as the relative, 0 date.
2.  For the production date, #PROD will be set as either 0 or NOW, depending on the setup in Model Inputs.
3.  For Factors defined in a Screen, #PROD must be defined in [Global Variables](https://oa.apps.factset.com/pages/293). When using a Row Reference with #PROD in a formula, it will be overwritten for the production date only. It will use the Global Variable definition for backtested dates.

For example, if using the "Latest" production date, the formula FF\_EPS(ANN,#PROD L90D) will default to FF\_EPS(ANN,0 L90D), the annual EPS with a 90 day lag for backtested data, and FF\_EPS(ANN,NOW) with no lag for the production date.

### Analyzing Production Model Data

The Workspace report will display the production date with its specified value, either Previous Close (0) or Latest (NOW).

The other reports that use the production date (Constituents, Benchmark, Periods, Fractiles, Factors) do not show the production date by default. To enable it, select the "Include Production Date" check box in Tile Options. You must enable this option in each report that you want the production date to appear. 

![](online-assistant/26583.8.html) 

|**Note**|The production date is not available for Custom Risk Models.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21243#top)

___

## Previewing Dates

As you are setting your dates, the Preview section will update to show the new dates that have been generated. The table shows all model dates which will be generated by the chosen time series settings, and shows check marks for each rebalance.

![](online-assistant/26583.9.html) 

[Top of Page](https://my.apps.factset.com/oa/pages/21243#top)

___

## Understanding the Dates

Alpha Testing will only generate dates between the start and end dates provided. For example, if you enter 31-Aug-2018 as the start date, then the first date for the "Last _day_ of the Period" is 31-Aug-2018. If you select "First _day_ of the Period," then first date option becomes 1-Sep-2018, not 1-Aug-2018 because 1-Aug is before the start date.

### Return Statistics and Advanced Date Generation

By default, the forward return dates will be the next report date generated in the series. However, if your [return rebalance](https://my.apps.factset.com/oa/pages/21243#rebalance_settings) frequency is different from the [universe rebalance](https://my.apps.factset.com/oa/pages/21243#universe_frequency) you specified, then the default forward return horizon will not equal the next report date (except when the return rebalance frequency (e.g., one month) is evenly divisible within the universe rebalance frequency (e.g., two months)). You can enter additional return horizons if you want a consistent return horizon length.

The forward return date for the last date in the series is determined by continuing the specialized date rule entered as if the end date was extended by one period.

-   If you are using [FQL dates](https://oa.apps.factset.com/#fql) you must use the #SD, #ED, and #FREQ variables. Not using these variables causes the forward return date to be one frequency period after the last report date (e.g., one month after the last report date)
-   If you are using [user-defined import dates](https://oa.apps.factset.com/#import), the last date in the file will be used as the last forward return horizon date. This last date entered will not be a rebalance date, so you must enter one more date into your file than you want to see in your Alpha Testing reports.

[Top of Page](https://my.apps.factset.com/oa/pages/21243#top)
