---
created: 2026-05-05T19:05:10 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13741
author: 
---

# Online Assistant : Quant Model

> ## Excerpt
> This page lists what you must consider when building an Alpha Testing, Backtesting, Northfield, or Portfolio Simulation model.

---
## Quantitative Model Building Tips Page 13741

This page lists what you must consider when building an Alpha Testing, Backtesting, Northfield, or Portfolio Simulation model.

Topics covered:

-   [Including Dead Companies](https://my.apps.factset.com/oa/pages/13741#dead)
-   [Minimizing Look-ahead Bias by Lagging Data](https://my.apps.factset.com/oa/pages/13741#lookahead)
-   [Using Estimates Data](https://my.apps.factset.com/oa/pages/13741#estimates)
-   [Building Sound Universal Screens Referenced in Quantitative Models](https://my.apps.factset.com/oa/pages/13741#screens)

___

## **Including Dead Companies**

To see information on dead companies for North America on FactSet, a subscription to a database that provides data for dead companies is necessary (e.g., Compustat, Refinitiv Financials). By default, Refinitiv Worldscope Fundamentals and I/B/E/S include dead companies in their database; however, the Compustat Research (Inactive) database supersedes both the Refinitiv Worldscope Fundamentals and I/B/E/S databases.

In Universal Screening, dead companies are automatically included in your universe when backtesting. You can change this setting by selecting Universe > Exclude Inactive Securities.

Alpha Testing, Northfield, Backtesting, and Portfolio Simulation do not change the "Exclude Inactive Securities" option when a screen is referenced. You must make sure that "Exclude Inactive Securities" is deselected to include dead companies.

**S&P Citigroup Database**

S&P Citigroup assigns their own unique identifiers to dead companies. Their identifiers for dead companies begin with "SB". As a result, these identifiers must be mapped to their actual SEDOL or CUSIP so that they can be used with other databases on FactSet (e.g., Refinitiv Worldscope Fundamentals, I/B/E/S, and Prices).

Use the [VALUEX](https://my.apps.factset.com/oa/pages/pages/1067) function coupled with S&P Citigroup codes to include dead companies. For example, use the following code to increase coverage and evaluate sales from Refinitiv Worldscope Fundamentals for the S&P Citigroup BMI World:

AVAIL((@T1:=WS\_SALES(0)),VALUEX(SBE\_ID\_HIST(0),@T1)).

[Top of Page](https://my.apps.factset.com/oa/pages/13741#top)

___

## Minimizing Look-ahead Bias by Lagging Data

Compustat, Reuters, and Refinitiv Worldscope Fundamentals data items can be lagged to limit the impact of [look-ahead bias](https://my.apps.factset.com/oa/pages/pages/3931#lb) in historical simulations. Look-ahead bias is always an issue in Alpha Testing, Backtesting, and Portfolio Simulation models using data whose database update frequency is lower than the model's iteration frequency. For example, you may want to consider lagging your data when your Portfolio Simulation model uses annual data with a monthly iteration frequency.

Look-ahead bias is a more critical issue with non-U.S. Fundamental data because non-U.S. data tends to be reported on an annual basis versus quarterly. Non-U.S. companies have longer time periods than U.S. companies to report their financials (filing requirements vary from country to country).

You should lag data in Alpha Testing, Backtesting, and Portfolio Simulation models which use database update frequencies smaller than the model's iteration frequency. Also, use longer lag periods (60 days versus 30 days) when using the Refinitiv Worldscope Fundamentals database (compared to Compustat and Reuters databases).

|**Tip**|To see a list of databases you must lag to avoid look-ahead bias, see [Lagging Data](https://my.apps.factset.com/oa/pages/pages/13736).|
|---|---|

### Lags in Universal Screening Versus Portfolio Simulation

If you run a screen with formulas that lag data and do not in Universal Screening, Universal Screening ignores the lags. However, if you run the same screen in Portfolio Simulation, the lags are applied. See for more details.

[Top of Page](https://my.apps.factset.com/oa/pages/13741#top)

___

## Using Estimates Data

This section describes fiscal year and quarter determination for estimate databases used in FactSet's quantitative applications.

### I/B/E/S:

-   **I/B/E/S Consensus**
    
    IC\_ formulas in the [consolidated library](https://my.apps.factset.com/oa/pages/pages/16005) all switch to the next period after the report date. See [Rolling versus Non-Rolling](https://my.apps.factset.com/oa/pages/pages/13742) to learn when to use and when not to use I/B/E/S rolling estimate data.
    
    |**!**|As of 28-August-2008, the older database was retired and the Screening (^%) and FQL (^=) "IH" formulas were redefined to refer to the newer IC database. IH formulas are documented here for reference purposes for existing reports. Access the newer version of the I/B/E/S Consensus database via formulas with an IC prefix.|
    |---|---|
    
-   **I/B/E/S Detail**
    
    Rolling and non-rolling formulas switch to the next period after the period (year or quarter) ends.

### First Call

Formulas switch to the next period right after the period (year or quarter) ends. For example, for a December company, FY1 shifts on January 1st.

### Reuters Consensus and Detail

Formulas switch to the next period right after the period (year or quarter) ends. For example, for a December company, FY1 shifts on January 1st.

### FactSet Estimates

By default, FactSet Estimates formulas roll after the publication date. Therefore, FactSet Estimates data does not need to be lagged.

To avoid any differences that arise between Alpha Testing and Backtesting, you should add separate context arguments to reduce any changes.

-   ESTDATE=INPUT uses the date that the data was added to the database, in the rare case it is different from the data that the analyst made the estimate
-   RT=N disables any changes to the data that occur throughout the day. Most of the time, this is new data being added to the database, but on occasion there are historical corrections which can impact Alpha Testing

To account for Backtesting's differences, use the CONTEXT arguments as follows: FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,',ESTDATE=INPUT,RT=N,')

Backtesting's differences can be attributed to:

-   Corporate actions
-   The broker being flagged as inactive as of a past date
-   Changes due to a data correction

|**Note**|When using FactSet Estimates in a backtesting environment, there are two options for the CONTEXT argument: [Research Date and Input Date](https://my.apps.factset.com/oa/pages/pages/16075). When you use Research Date, broker estimates will be included in a consensus estimate as of the date the broker report was issued. When you use Input Date, broker estimates will be included in a consensus estimate as of the date that estimate was added to the FactSet Estimates database.
|---|---|
If you do not specify a
CONTEXT argument, Alpha Testing will use the Research Date by default.|

[Top of Page](https://my.apps.factset.com/oa/pages/13741#top)

___

## Building Sound Universal Screens Referenced in Quantitative Models

-   Do not use the default options in the Criteria pane in Universal Screening to limit your universe for quantitative models. The default items are not sensitive to the backtest date. For example, if you want to limit your universe to the Russell 2000, do not choose the index under Limit Button > Index > Russell > 2000. This will give you the current Russell 2000 constituents for any backtest date that you set. Instead, enter the formula ISON\_RUSSELL\_IDX(0,2000,CLOSE)as a parameter to limit your universe to this index. Request codes that accept date arguments will be sensitive to the backtest date when a relative date is used.
    
    Instead, choose the Custom tab after clicking the Limit button and enter a code with a relative date argument (e.g.,
    
    ISON\_RUSSELL\_IDX(0,2000,CLOSE)). This will limit the screen to the same companies for each backtest date as it would by entering it as a parameter.
-   Use the Compustat Unrestated Quarterly database.
-   Set the Universal Screening calendar to apply the calendar (Options > Calendar > Seven Day). The seven-day calendar shows all days (Monday through Sunday) and carries prices forward over non-trading days. This is especially important if your model uses an OFDB file. If your OFDB file was last updated on the last calendar day, for example Saturday, Universal Screening will only display data for Saturday if the seven-day calendar option is selected. A five-day calendar does not recognize Saturdays and Sundays.
-   Always use universe limiting functions in any Universal Screen you plan to use in Alpha Testing, Backtesting, Portfolio Simulation, or Northfield Portfolio Optimizer. For example, the [DECILE](https://my.apps.factset.com/oa/pages/pages/1719) function derives the security's decile rank from FactSet's entire universe, not the securities defined by your Universal Screen. Instead, use the [UDECILE](https://my.apps.factset.com/oa/pages/pages/1736) or the [UDECILEX](https://my.apps.factset.com/oa/pages/pages/1752) in your Universal Screen and define the universe explicitly within the function.
-   Always use [relative dates](https://my.apps.factset.com/oa/pages/pages/2852#dates) in your universe codes.
-   Avoid using [@G](https://my.apps.factset.com/oa/pages/pages/6381) variables in your screens or custom formulas created in [Formula Library Editor](https://my.apps.factset.com/oa/pages/pages/339). Universal Screening does not consider these variables when determining the order in which parameters are calculated. Therefore, if you must use an @G variable in your screen, ensure that any formula that references that variable(s) is calculated after the parameter which defines the @G variable is calculated.
-   Understand the difference between the [UPERCENTILE versus the UPERCENTILEX](https://my.apps.factset.com/oa/pages/pages/13753) functions.
-   Do not use report statistical functions. For example, when calculating an asset weight constraint in a Universal Screen for a Portfolio Simulation model, do not use [RPCTOFTOTAL](https://my.apps.factset.com/oa/pages/pages/1923) as this will calculate a weight for any security that has a result for your data item, whether or not it passes the screen. Instead use [UPCTOFTOTAL](https://my.apps.factset.com/oa/pages/pages/1924) as this will only calculate a result for securities that are in the specified universe.

[Top of Page](https://my.apps.factset.com/oa/pages/13741#top)
