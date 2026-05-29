---
created: 2026-05-05T19:02:05 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21240
author: 
---

# Online Assistant : Adding Factors

> ## Excerpt
> Alpha Testing uses your specified factors to divide your model's universe into fractiles. For each factor, you specify a formula and choose different fractiling and data handling options. Alpha Testing then uses these options to rank the securities in the universe and places each into a fractile.

---
## Adding Factors in Alpha Testing 4 Page 21240

Alpha Testing uses your specified factors to divide your model's universe into fractiles. For each factor, you specify a formula and choose different fractiling and data handling options. Alpha Testing then uses these options to rank the securities in the universe and places each into a fractile.

This page outlines the basic process and options available when adding factors to your model and will link to additional information wherever more detail is required.

Topics covered:

-   [Adding a New Factor](https://my.apps.factset.com/oa/pages/21240#new_factor)
-   [Defining General Factor Options](https://my.apps.factset.com/oa/pages/21240#general)
-   [Adding Screening Parameters as Factors](https://my.apps.factset.com/oa/pages/21240#screen)
-   [Layering on a Factor](https://my.apps.factset.com/oa/pages/21240#layer)
-   [Using Independent Multiple Factors](https://my.apps.factset.com/oa/pages/21240#imf)

___

## Adding a New Factor

This page focuses on the general process of adding a new factor to your model and importing parameters from screens as factors. To learn more about the other types of factors you can add, see [New Multi-Factor Rank](https://my.apps.factset.com/oa/pages/pages/21261), New Period Formula, New Risk Factor.

To add a new factor:

1.  Click the **Model Options** button in the application toolbar.
2.  Choose the Factors section in the left pane of the Edit Model Options page.
3.  Click the **Add** button ![](online-assistant/26580.html) and select "New Factor" or select "Import Screen" if you have a Universal Screen specified as your universe and want to import a parameter from your screen as a factor.  For more information on adding screening parameters as factors, see the [section below](https://my.apps.factset.com/oa/pages/21240#screen).  The rest of the options remain the same. 
    
    ![](online-assistant/26580.1.html)
4.  Define the factor options in the right pane of the Edit Model Options page. Click the links below for details on the options in each section:
    
    -   [General](https://my.apps.factset.com/oa/pages/21240#general) 
    -   [Data Management](https://my.apps.factset.com/oa/pages/pages/21351#data_mgmt)
    -   [Fractiling Options](https://my.apps.factset.com/oa/pages/pages/21351#fractiling_options)
5.  Click **Done** in the top right corner to save the factor and exit the Edit Model Options page.

[Top of Page](https://my.apps.factset.com/oa/pages/21240#top)

___

## Defining General Factor Options

This section describes the options in the General section of Factor settings. You can find these options within Edit Model Options > Factors > Options section for a selected/new factor.

![](online-assistant/26580.2.html)

### Name

Enter a name for the new factor.  The name cannot contain special characters.  

### Formula

Enter a formula in the Formula text box or click the **Edit Formula** button ![](online-assistant/26580.3.html) to launch [Formula Lookup](https://my.apps.factset.com/oa/pages/pages/20929).  

|**Tip**|You can enhance the factors in a Production Model to read the [production date](https://my.apps.factset.com/oa/pages/pages/21243#production_date) by using the #PROD variable. For non-production dates, #PROD will behave as the relative 0 date. For the Production date, #PROD will be set as either 0 or NOW, depending on how you set the production run.|
|---|---|

|**Tips**|**Building Successful Formulas**
|---|---|
Select your formula from a database library (e.g., Russell), not a combination library (e.g., FactSet or Refinitiv Worldscope Fundamentals). Formulas from combination libraries do not return historical data.
To ensure that your formulas iterate properly over time, use [relative dates](https://my.apps.factset.com/oa/pages/pages/1964#rel) (e.g., 0M), instead of absolute dates (e.g., 4/15/2003). For example, a relative date of 0 will ensure that as of each , the most recent data is fetched for your code when your model is run. Similarly, a relative date of -1 will return the previous period's data as of the backtest date. You should avoid the
NOW argument in factor formulas since that will retrieve the data as of the date you are running your test.
To avoid your model having [look-ahead bias](https://my.apps.factset.com/oa/pages/pages/3931#lb), you may need to add [lags](https://my.apps.factset.com/oa/pages/pages/13736) to your dates formulas.
For example, enter
CM\_BK(0 L45D)/CM\_P(0) to calculate Book Value with a 45-day lag divided by the most-recent Market Closing Price. You must lag Compustat's Book Value data to avoid look-ahead bias. You do not need to lag pricing data.
For more tips on building successful formulas, see [Building Sound Universal Screens Referenced in Quantitative Models](https://my.apps.factset.com/oa/pages/pages/13741#screens).|

|**Note**|You can use [Custom Return Variables](https://my.apps.factset.com/oa/pages/pages/13697) when creating your factor and universe formulas. You should only use custom return variables in the Factors tab to fetch additional security-level data items. For example, you can use the [#F variable](https://my.apps.factset.com/oa/pages/pages/13697#F) to create a forward relative return formula so that you can view the results for each security next to the actual return in the Constituents report.
|---|---|
When you select the "Group" option for fractiles and your formula returns numeric data (e.g., Sector Number), you might see the resulting fractiles displayed in your reports with two decimal places (e.g. 10.00). To show an integer in your reports (e.g. 10), you first must [transform the data to text](https://my.apps.factset.com/oa/pages/pages/1911). For example, if you are grouping by FactSet Sector, you must enter
TEXT(FSN,"%D") instead of simply FSN to ensure that your fractile results display without decimal places.
Universal Screening functions such as [Rank](https://my.apps.factset.com/oa/pages/pages/1715) will behave differently in Universal Screening than they will in Alpha Testing. In Screening, a function such as
RANK(P(0)) will return each company's rank against all companies in the available universe that have a value for P(0) (e.g., N out of ~71000). In Alpha Testing, this code will give the rank against only the companies that pass the model's universe definition (e.g., N out of 500 for the S&P 500).|

|**Note**|Alpha Testing uses two methods of fetching screening data, depending on the functions used or the method of entry. For formulas that you enter directly rather than [reference](https://my.apps.factset.com/oa/pages/21240#enternum), Alpha Testing fetches data only for companies passing the universe definition, instead of every available company before limiting the universe. This reduces the calculation time needed to run the model. If you [reference a screen](https://my.apps.factset.com/oa/pages/21240#enternum), or use functions that have the potential to reference securities outside the local universe (e.g., [VALUE](https://my.apps.factset.com/oa/pages/pages/1501) and [RSLOPE](https://my.apps.factset.com/oa/pages/pages/1811) ), Alpha Testing will not use the "local universe" mode, and instead retrieves data against the entire available universe, similar to Universal Screening.|
|---|---|

|**Note**|Do not use [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790) or [RUNIVERSE](https://my.apps.factset.com/oa/pages/pages/10914) in any function that you enter as a factor directly into quantitative applications like Alpha Testing. Instead, enter the function into a Universal Screen and then add the factor as a row reference in Alpha Testing.|
|---|---|

### Fractiles

Specify if you want to fractile the factor by selecting/deselecting the "Fractile This Formula" option.  Each factor's assigned fractiles are independent and are not affected by the fractiling of other factors (e.g., if you choose to exclude [NA factor data](https://my.apps.factset.com/oa/pages/pages/13573#NA), then securities that are excluded for one factor and will not necessarily be excluded from others).  Fractiles are assigned to each security when you run the model and therefore cannot be changed by report options such as [filters](https://my.apps.factset.com/oa/pages/pages/13554#filtersection).

If you've selected the fractile option, you can select from the following options:

-   Select "Custom" to create custom fractile bins.  To learn more about the different options available when selecting this option, see [Managing Custom Fractile Bins](https://my.apps.factset.com/oa/pages/pages/21350)**.** 
-   Select the "Group" option to have each unique result of your formula placed in a fractile group.
    
    ![](online-assistant/26580.4.html)
-   Select the number of fractiles in which to divide the universe of companies from the Fractiles drop-down menu.

[Be sure to use the correct fractile type](https://my.apps.factset.com/oa/pages/pages/21351#fractiling_type) for your selected factor.

|**Tip**|You can use a formula (e.g., Average Return on Equity) for fetching data for custom statistics instead of adding the formula as a factor. To do so, you must deselect the "Fractile This Formula" check box. This creates a Universe Formula instead of a factor. However, in most cases you will want to add your formula as a factor by leaving this option selected.|
|---|---|

### Lower Values Rank Better

If you've selected to fractile data, you can select the "Lower Values Rank Better" check box to assign securities with the lowest factor values to the first fractile. Use this option with valuation ratios, such as P/E or Price to Book, where lower values are generally assumed to be more favorable. For example, if you specify Price to Book as your ranking formula, by default securities with the largest Price to Book are assigned to the first fractile. However, if you select "Low Values Rank Better", securities with the smallest Price to Book are assigned to the first fractile. 

This setting will affect the Fractile option for [Outlier Handling](https://my.apps.factset.com/oa/pages/pages/21351#data_mgmt).

|**Note**|You cannot use the "Low Values Rank Better" option with grouped factors as grouped factors have no concept of "best" and "worst" fractile. A grouped factor only takes the result of a formula for each company and creates a group for each result.|
|---|---|

 

### Layer On

Select a factor you want to layer on (e.g., GICS Sector) from the drop-down menu, if desired.  See the [Layering on a Factor](https://my.apps.factset.com/oa/pages/21240#layer) section for additional details.

[Top of Page](https://my.apps.factset.com/oa/pages/21240#top)

___

## Adding Screening Parameters as Factors

As referenced in the main steps to [add a new factor](https://my.apps.factset.com/oa/pages/21240#new_factor), you can add screening parameters as factors in your model if you have [specified a Universal Screen as your universe](https://my.apps.factset.com/oa/pages/pages/20848#universe).

In Edit Model Options, select "Import Screen" from the **Add** button ![](online-assistant/26580.html) drop-down menu to launch the Import From Screen dialog box.

![](online-assistant/26580.5.html)

Use the check boxes to select the desired parameters from the source screen that you want to add as factors.  Hover over a parameter to see the full formula referenced.

Select the "Import As Parameters" option to import your factor as a parameter reference. When adding a reference this way, the factor will be brought in as #P.<_name>._ If you're referencing a legacy screen, you will see the legacy ROW_n_ syntax for row referenced instead.  For more information on references in Universal Screening, see [Using Row References](https://my.apps.factset.com/oa/pages/pages/21087).

If you prefer to import the underlying formula used in the referenced screening parameter, select the "Import As Formulas" option. 

[Top of Page](https://my.apps.factset.com/oa/pages/21240#top)

___

## Layering on a Factor

By applying layers, you can divide your model's universe into a specified number of fractiles based within the fractiles of another factor. Layering is often used to create a sector- or industry-neutral test for a specified factor. You can also layer a factor on other, already layered factors (e.g., a book to price factor layered within country-sector intersections).

You are not required to layer a factor's fractile assignments. However, if you want to layer on a factor, you must first add that specific factor. For example, to layer Price to Book within sectors, you first must enter Sector as a factor. Then you can add Price to Book as a factor and select to layer within the Sector factor.

|**Note**|If you want to layer a factor, you normally would not group a [factor's fractiles selection](https://my.apps.factset.com/oa/pages/21240#six). When a factor is grouped, all unique values are placed in their own fractile, thus making your report appear as if you had not applied any layering at all. 
|---|---|
Layering on a grouped factor only affects subsequent layered factors. Only choose to group layered factors if you are [creating multiple layered factors](https://my.apps.factset.com/oa/pages/pages/13792#multiple).
There are also [three options](https://my.apps.factset.com/oa/pages/pages/13934#apply) for layering an MFR.|

### Applying One Level Layering

The layering functionality lets you divide your model's universe into a specified number of fractiles based within the fractiles of another factor (e.g., Factor 1).

Layering is often used to create a sector or industry neutral test for a factor (e.g., Factor 2). First, each Factor 1 group is further divided by Factor 2 values. Then, the companies in the first Factor 2 fractile of each Factor 1 group are combined to create the first Factor 2 fractile.

**Example**

If Factor 1 is grouped by GICS sectors and Factor 2 is quartiled based on dividend yield, layered fractiles will:

1.  Divide the universe into groups based on the GICS sector number.
2.  Divide each sector into dividend yield quartiles.
3.  Take the top quartile within each GICS sector and combine them to generate the first Dividend Yield quartile.
4.  Take the second quartile within each GICS sector and combine them to generate the second Dividend Yield quartile.
5.  Repeat step 4 for the third and fourth quartiles within each sector group to create the third and fourth Dividend Yield quartiles.

![](online-assistant/26580.6.html)

The following shows how this example would appear when set up in Alpha Testing:

![](online-assistant/26580.7.html)

[Top of Page](https://my.apps.factset.com/oa/pages/21240#top)

___

## Using Independent Multiple Factors

You can create fractiles for each factor based on the total universe for each period. Because they are independent of each other, fractile ranks assigned based on the first ranking factor have no bearing on fractile ranks assigned based on the second ranking factor.

### Example

If Factor 1 is quintiled based on P/E, and Factor 2 is quartiled based on dividend yield, independent fractiles will:

1.  Divide the universe into P/E quintiles.
2.  Shuffle the entire universe and divide into dividend yield quartiles.

![](online-assistant/26580.8.html)

[Top of Page](https://my.apps.factset.com/oa/pages/21240#top)
