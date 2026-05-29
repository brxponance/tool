---
created: 2026-05-05T19:01:55 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21239
author: 
---

# Online Assistant : Defining the

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
Launch it with FactSet Search: @AT4

Use the Universe tile within Model Options to specify your model's universe and benchmark.

Topics covered:

-   [Defining the Universe and Benchmark](https://my.apps.factset.com/oa/pages/21239#define)
-   [Specifying the Universe](https://my.apps.factset.com/oa/pages/21239#universe)
-   [Specifying the Benchmark](https://my.apps.factset.com/oa/pages/21239#benchmark)

___

## Defining the Universe and Benchmark

To make changes to the model's universe, click the **Edit** icon ![](online-assistant/26067.html) next to the Universe header in the Workspace report to select or change your universe and benchmark.  You can also click the **Model Options** button in the application toolbar and select "Universe" from the left pane.

![](online-assistant/26067.1.html)

The following sections detail how to specify your [Universe](https://my.apps.factset.com/oa/pages/21239#universe) and [Benchmark](https://my.apps.factset.com/oa/pages/21239#benchmark) options within Edit Model Options.

[Top of Page](https://my.apps.factset.com/oa/pages/21239#top)

___

## Specifying the Universe

After launching the Universe tab in Edit Model Options, use the top half of the tab to define the companies that you want to use as your model's universe. You can use a formula, a portfolio, or a screen to define your universe.

### Formula

To use a FactSet formula to define your universe, select the "Formula" option from the Universe Type drop-down menu. Click the **Edit** button ![](online-assistant/26067.html) to launch [Formula Lookup](https://my.apps.factset.com/oa/pages/pages/20929) and begin creating your formula.

Only the companies that pass your formula arguments are included in the universe.

|**Note**|To learn how to create basic FactSet request codes, see [Writing Formulas](https://my.apps.factset.com/oa/pages/pages/1966).
|---|---|
To ensure that your universe of companies can be recreated (i.e., iterated) back in time, use relative dates and [lag data](https://my.apps.factset.com/oa/pages/pages/13736) with your formulas. The lag specification is used to avoid [look-ahead bias](https://my.apps.factset.com/oa/pages/pages/3931#lb).|

|**!**|Do **not** use [OFDBU](https://my.apps.factset.com/oa/pages/pages/16482) formulas as your universe limitation. If you use an OFDBU formula, every company that was ever in the OFDB file for each period will be included. Instead, you need to pick a field in the OFDB file that is available for each period.
|---|---|
To reference an OFDB file:
-   Use the [ISAV](https://my.apps.factset.com/oa/pages/pages/1523) and [OFDB](https://my.apps.factset.com/oa/pages/pages/11674) functions with the following general syntax:
    
    ISAV(OFDB(ofdb\_name,field\_name,0))=1 
-   If your OFDB file has a shares field and all values are positive, use: 
    
    OFDB(ofdb\_name,shares,0)>0 
    
    This will limit your universe to include companies that were in the OFDB file for each rebalancing period.
To use calendar month-end dates:
1.  Use calendar month-end dates in your OFDB file.
2.  Set your calendar in Alpha Testing to Seven Day.
3.  Set your calendar in Universal Screening to Seven Day.
4.  Use 0M for the date argument in all your request codes in your Alpha Test model.
To use month-end dates:
1.  Use the last trading day of each month in the OFDB file.
2.  Set your calendar in Alpha Testing to Five Day.
3.  Set your calendar in Universal Screening to Five Day.
4.  Use 0 for the date argument in all your request codes in Alpha Testing.|

### Portfolio

To specify a portfolio as your universe, select the "Portfolio" option from the Universe Type drop-down menu. Then, click the **Portfolio Lookup** button ![](online-assistant/26067.2.html) to select either Account Lookup or Portfolio Lookup.

|**Note**|When specifying your universe using Portfolio Lookup, constituents will be fetched for any backtest date prior to this first available holdings date. When you specify your universe using a formula or screen, you will normally get zero constituents for any backtest date prior to when holdings are available to you.|
|---|---|

### Screen

To specify a screen as your universe, select the "Screen" option from the Universe Type drop-down menu. Click the **Lookup** button ![](online-assistant/26067.3.html) to browse for and select a screen.

|**Note**|In the Universe Screen lookup dialog, screens created in the [new version](https://my.apps.factset.com/oa/pages/pages/20593) of Universal Screening are labeled "Screen 2.0".|
|---|---|

Double check that your screen returns constituents before assigning it as your Alpha Testing universe. To do this, go to Universal Screening (@US), open the screen you selected for your universe, and then set the as the start date for your Alpha Testing model.

**Screen Settings**

To specify screen settings, click on the **Settings** drop-down menu ![](online-assistant/26067.2.html).

-   **Exclusions**: Choose to [exclude Inactive Securities, Secondary Listings, and/or Non-Equity Securities](https://my.apps.factset.com/oa/pages/pages/20606#Understanding) from your universe.
-   **Databases**: Choose the Compustat database source options:

-   Compustat N.A. Restated Quarterly: Select this database option to use restated data. This will use data from the [Compustat Industrials](https://my.apps.factset.com/oa/pages/pages/274) database, which provides financial and market information, including annual and quarterly income statement, balance sheet, cash flow, per share, and supplemental data items.
-   Compustat Unrestated Quarterly: Select this database option to use non-restated data. The [Compustat Unrestated Quarterly](https://my.apps.factset.com/oa/pages/pages/4639) database is a library of financial information using company 10-Qs as they were reported at the time of filing. The coverage includes Compustat Research/Backtest (inactive) companies that have been deleted from the Compustat Annual and Quarterly databases due to a merger/acquisition, bankruptcy, liquidation, privatization, or leveraged buyout.

|**Notes**|When you select a screen as a model input, the options saved for that screen are automatically imported into the Screen Options drop-down. However, if you decide to change the screen later, the new options will not automatically update in Alpha Testing; you will have to update them manually.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21239#top)

___

## Specifying the Benchmark

The benchmark specification lets you define a benchmark to test your model against. You can use a formula, portfolio, screen, or identifier to define your benchmark.

To use the same universe specifications as your benchmark specification, select the "Same as Universe" option.

|**Note**|The return for your universe and benchmark will always be the same when you choose the "Same as Universe" option, unless you specify a different return source for your benchmark, or apply a fractile filter to your report (because the benchmark constituents are never filtered where the main universe is filtered).|
|---|---|

The options available include:

-   [Formula](https://my.apps.factset.com/oa/pages/21239#formula)
-   [Portfolio](https://my.apps.factset.com/oa/pages/21239#portfolio)
-   [Screen](https://my.apps.factset.com/oa/pages/21239#screen)
-   Identifier: Use a benchmark identifier that has a published return (e.g., MSCI EAFE) as the benchmark. Click the **Lookup** button to browse for an identifier or enter the identifier in the text box.

[Top of Page](https://my.apps.factset.com/oa/pages/21239#top)
