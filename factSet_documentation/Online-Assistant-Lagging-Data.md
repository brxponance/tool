---
created: 2026-05-05T19:05:07 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13736
author: 
---

# Online Assistant : Lagging Data

> ## Excerpt
> This page explains when you should add a lag argument to your formulas used in quantitative applications.

---
## Lagging Data Page 13736

This page explains when you should add a lag argument to your formulas used in quantitative applications.

Topics covered:

-   [Adding a Lag](https://my.apps.factset.com/oa/pages/13736#addlag)
-   [Knowing Which Databases Do or Don't Require Lags](https://my.apps.factset.com/oa/pages/13736#dodont)
-   [Testing That Your Lag Works](https://my.apps.factset.com/oa/pages/13736#test)

___

## Adding a Lag

Use a lag argument in your formulas to avoid having [look-ahead bias](https://my.apps.factset.com/oa/pages/pages/3931#lb) in your model. When you use a lag argument (lag options: specified number of days, weeks, months, quarters, or years), FactSet retrieves data _as it was known_ at the time of the rebalance date.

For example, if returns are calculated for the universe rebalanced in December 1990, you can create a custom P/E formula using the price in December 1990, then lag the date of the earnings (to the most-recently reported quarter at that point in time), for example, to September. By lagging EPS, you will use the P/E that was known to the public in December 1990.

You do not need to add a lag to pricing and shares formulas (e.g., MSHS(0)) to avoid look-ahead bias, because these are bits of information that you would have known at the time of the backtest date.

To specify a lag period:

-   Add an L to the date arguments in the Ranking Formula tab of the Model Inputs dialog box, followed by the number of periods to lag and the frequency
    
    (D - daily, W - weekly, M - monthly, Q - quarterly, or Y - yearly).
    
    The lag period is not dependent on the frequency of the database you are using.
    
    ![](online-assistant/23450.html)
    

[Top of Page](https://my.apps.factset.com/oa/pages/13736#top)

___

## Knowing Which Databases Do or Don't Require Lags

This section lists the databases on FactSet that require you use lag arguments in your quantitative applications and those that do not.

|**Note**|Most fundamental data on FactSet needs to be lagged because this data type is stored as of the fiscal period date, not on the date it was reported or known to the public. However, most estimate data does not need to be lagged. Pricing and benchmark constituent data never need to be lagged. 
|---|---|
The lag time for fundamental data items should reflect the length of time that companies have to report their financials.|

|**Database**|**Database Details**|**Example**|
|---|---|---|
|Compustat|Lag all monthly, quarterly, and annual data items, except price.|Lags Compustat Annual ESP data by one quarter:
`CA_EPS(0 L1Q)`|
|Compustat Point-in-Time|Do not lag.|n/a|
|FactSet Fundamentals|Lag all monthly, quarterly, semi-annual, and annual data items, except price.|Lags FactSet Fundamentals Monthly Price to Book data by 45 days:
`FF_PRICE_CLOSE_CP(MON,0)/FF_BPS(MON,0 L45D)`|
|Lionshares Summary Statistic|The LSS\_\*\_AGG formulas return historical ownership data on a calendar quarterly basis.
Lag ownership data by 45 days because institutions have 45 days after each quarter-end to report their 13F ownership data to the SEC.|Lags Lionshares aggregate institutional holders by 45 days:
`LSS_HLDRS_AGG(0 L45D)`|
|Markit Securities|Lag all data by two days.|Lags Markit Stock Loan Data by two days:
`DX_SHORT_INTEREST(0 L2D,LOCAL,VALUE)`|
|MSCI|Do not lag.|n/a|
|Prices|Do not lag.|n/a|
|Reuters Global|Lag all quarterly, semi-annual, and annual data items, except price.|Lags Reuters Global Earning Per Share – Before Extraordinary Items - Basic/Primary data by 2 months:
`RGA_EPS(0 L2M,RP,USD)`|
|Short Interest Database (U.S. Only)|For month-end backtest dates prior to 31-Aug-2007, do not lag data. For backtest dates that are between the 15<sup>th</sup> and the month-end prior to 01-Sep-2007, lag data by 1 month. 
For backtest dates after 01-Sep-2007, lag all data by 9-15 days.|Lags Short Interest from the U.S. Short Interest database by 9 days:
`FSI_SI_ANY_EXCHG(0 L9D,"SPLIT")`|
|Toyo Keizai Financial|Lag all quarterly, semi-annual, and annual data items.|Lags Toyo Keizai Financial Annual Earnings Per Share data by 45 days:
`TKF_EPS(ANN,0 L45D,2,CSCJNC)`|
|Refinitiv Worldscope Fundamentals|Lag all monthly and annual data items, except price.|Lags Refinitiv Worldscope Fundamentals Monthly Price to Book data (USD) by 3 months:
`WS_MP(USD 0)//WS_MBK(USD 0 L3M)`|

[Top of Page](https://my.apps.factset.com/oa/pages/13736#top)

___

## Testing That Your Lag Works

When verifying lagged data for a monthly model in , you must set the to the 31st of the month regardless of the last trading day or actual month-end date. If you enter a backtest date earlier than the 31st day (e.g., 2/29/2001), screening may lag back to a date before the specified month's last trading day, resulting in a larger lag than what you wanted.

For example, if you use a three-month lag and enter 2/28/2001 as the backtest date, the lag functionality in Universal Screening will use 11/28/2000 as the backtest date in your request code(s). With 11/28/2000 as the backtest date, Universal Screening will feel back and return monthly data as of 10/31/2000 instead of 11/30/2000.

Alpha Testing automatically accounts for differing month-end dates (when you enter your start date for a monthly model as either a monthly date in MM/YYYY format or the last trading day of the month or later in MM/DD/YYYY format) by setting the backtest date as MM/31/YYYY when it fetches data for each month.

[Top of Page](https://my.apps.factset.com/oa/pages/13736#top)
