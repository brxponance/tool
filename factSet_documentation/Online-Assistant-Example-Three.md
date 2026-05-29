---
created: 2026-05-05T19:05:01 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/14371
author: 
---

# Online Assistant : Example Three

> ## Excerpt
> This page explains how to build a model with three factors, combine the factors into one multi-factor score, and analyze the results.

---
## Example Three Factor Model Page 14371

This page explains how to build a model with three factors, combine the factors into one multi-factor score, and analyze the results.

The Three-Factor model looks at three factors:

-   P/E
-   Three-year sales growth rate
-   Earnings growth rate estimate

The object of this model is to determine:

-   if better three-factor scores result in higher returns
-   if the first quintile has greater returns than the fifth quintile
-   if individual factors perform better or worse than the three-factor score

Companies will be quintiled based on their three-factor score.

The Three-Factor model uses a Universal Screen to define its Alpha Test universe. It also uses parameters from the Universal Screen as ranking formulas.

Topics covered:

-   [Build a Universal Screen that defines your universe and factors](https://my.apps.factset.com/oa/pages/14371#screen)
-   [Build the three-factor Alpha Testing model](https://my.apps.factset.com/oa/pages/14371#buildatmodel)
-   [Determine if the first quintile outperformed the fifth quintile](https://my.apps.factset.com/oa/pages/14371#determine)

___

## Build a Universal Screen that defines your universe and factors

Before running the Alpha Testing model, create a screen in [Universal Screening](https://my.apps.factset.com/oa/pages/pages/20593) to evaluate companies based on the three identified factors. This Universal Screen will later be used in the Alpha Testing application in the Universe and Factor tabs.

The Universal Screen below accomplishes the following:

-   Limits the universe to the 500 largest companies in the Compustat database based on market capitalization
-   Calculates P/E, three-year sales growth rate, and the long-term growth rate estimate for each company in the report
    
    Enter the following Parameter Details:
    
    ![](online-assistant/23448.html)
    
    When you are finished, go to File > Save Screen As, enter the Screen Name as "3\_FACTOR\_AT" and click the **Save** button.
    

|**Notes**|Select the following options for your screen:
|---|---|
-   Universe > Use Research (Inactive) Companies. This will prevent your passing screening universe from having survivorship bias.
-   Options > Global Options > Use U.S. Identifiers Only or Use Canadian Identifiers Only. Do not select "Use Both Identifiers" because you will have pairs of identifiers for the same company in your passing screening universe.
-   Options > Set Backtest Date and set the date to "12/31/2003."
After making each of these changes, select File > Save Screen.|

Each parameter is explained in detail below:

Parameter 1

Limits the universe to the 500 largest companies in the Compustat database based on market capitalization.

Parameter 2

Displays the most recent month-end P/E. This formula uses a double divide (//) so companies with a negative EPS will return "NA." The EPS formula MEPS(0 L45D) uses a 45-day [lag](https://my.apps.factset.com/oa/pages/pages/13736) period to simulate the same EPS data that would have been available to the public at that time. Lag your data to prevent look-ahead bias.

Parameter 3

Displays a three-year sales growth rate. The formula RATE3(C12(0 L90D) uses a 90-day [lag](https://my.apps.factset.com/oa/pages/pages/13736) period to simulate the same sales data that would have been available to the public at that time. Lag your data to prevent look-ahead bias.

Parameter 4

Displays the most recent I/B/E/S mean long-term growth rate estimate.

[Top of Page](https://my.apps.factset.com/oa/pages/14371#top)

___

## Build the Three-Factor Alpha Testing Model

To build the Three-Factor Alpha Testing model, open Alpha Testing 3.0 and click the **Model Inputs** button. You will enter inputs in the following tabs:

-   [Universe tab](https://my.apps.factset.com/oa/pages/14371#universe)
-   [Time Series tab](https://my.apps.factset.com/oa/pages/14371#time)
-   [Factors tab](https://my.apps.factset.com/oa/pages/14371#factors)
-   [Returns tab](https://my.apps.factset.com/oa/pages/14371#returns)

### Universe tab

1.  Choose the [Universe tab](https://my.apps.factset.com/oa/pages/pages/13552).
2.  Select the Screen option and click the **Lookup** button ![](online-assistant/23448.1.html) to browse for and open your Universal Screen named "3\_FACTOR\_AT."
3.  Enter the identifier SP50 to use the S&P 500 as the selected benchmark.
    
    ![](online-assistant/23448.2.html)
    

|**Note**|To run this Alpha Test, create the screen shown in the [Build a Universal Screen that Ranks Companies by Three Factors](https://my.apps.factset.com/oa/pages/14371#screen) section and save it as "3\_FACTOR\_AT" in your personal directory.|
|---|---|

### Time Series tab

1.  Choose the [Time Series](https://my.apps.factset.com/oa/pages/pages/13553) tab.
2.  Enter "12/31/1995" as your start date and "12/31/2005" as your end date so that your model analyzes results for this ten-year period.
3.  Enter "3 Months" for both the Universe and Returns options in the Rebalance Settings section to rebalance your universe quarterly and calculate quarterly returns.
    
    ![](online-assistant/23448.3.html)
    

### Factors Tab

Choose the [Factors](https://my.apps.factset.com/oa/pages/pages/13573) tab. For this model, reference the three factor parameters created in the universal screen to create individual factors and then create a multi-factor rank that combines the three factors.

To create Factor 1 (P/E):

1.  Click the **New** button.
2.  Enter "ROW2" (references Parameter 2 in your Universal Screen) as the formula for the factor.
3.  Enter "Price to Earnings" as the name of the factor.
4.  Select "5" from the Fractiles drop-down menu to group companies into quintiles.
5.  Select the "Lower Values Rank Better" checkbox to place companies with lower price to earnings values in the first quintile and companies with higher price to earnings values in the fifth quintile. (You select this option because the hypothesis being tested is that low P/E companies will out perform high P/E companies.)
    
    ![](online-assistant/23448.4.html)
    
6.  Click **OK** to create the factor.
    
    Repeat steps 1-6 to add factors named "Three-year sales growth rate" (enter "ROW3" in the formula bar) and "Long-term growth rate estimate" (enter "ROW4" in the formula bar). Do not select "Lower Values Rank Better" (the hypothesis is that higher values will outperform lower values for these factors).
    

Create the [Multi-Factor Rank](https://my.apps.factset.com/oa/pages/pages/13934):

1.  Click the **MFR** button and select "MFR" from the drop-down menu.
2.  Change the name to "3 Factor MFR".
3.  Select all three factors to be the Component Formulas for the Multi-Factor Rank (MFR). Leave the Relative Ranking Weight with a value of "1" to equally weight all three factors.
    
    ![](online-assistant/23448.5.html)
    
4.  Choose the MFR Settings tab.
5.  Select "Percentile" from the Formula Ranking Type drop-down menu. This will create a percentile ranking for all three of your individual factor formulas (with low P/E values ranked better for the first formula and high values ranked better for the other two formulas). The three percentile rankings will be summed for each security to create its multi-factor score.
    
    Keep the default settings for Fractiling of Multi-Factor Ranking scores. This means that the multi-factor scores will be quintiled and lower values will be ranked better and placed in the first quintile (to reflect the fact that the lower numbered percentile ranks are better).
    
    ![](online-assistant/23448.6.html)
    
6.  Click **OK** to create the Multi-Factor Rank.
    
    This is what you should see in the Factors tab after you have entered all of your factors:
    
    ![](online-assistant/23448.7.html)
    

### Returns tab

1.  Choose the [Returns](https://my.apps.factset.com/oa/pages/pages/13596) tab.
2.  Select the Compustat return source from the FactSet default list of return sources and click the **Add** button (since you used a Compustat formula in Parameter 1 of your Universal Screen to define the universe of companies, you should continue to use Compustat as the return source database).
3.  Leave the default selections of "Include Dividends" and "U.S. Dollar" as the Currency to get test returns in USD.
    
    ![](online-assistant/23448.8.html)
    

Click **OK** to accept the model inputs and complete your model. Now you can run your model to get results.

Click the **Run** button. Alpha Testing will first fetch the constituents and factor data from your screen over the time period you entered, then it will calculate the returns, weights, and market caps for your universe securities and benchmark. It will then fractile the factors that you entered.

When your model has finished its run, select File > Save Model, enter a Model Name of "3 Factor Model", and click **Save**. You are now ready to examine the results of your model.

|**Note**|Your results might not exactly match those shown in the next section. This can happen due to updates to databases, like Compustat in our example.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/14371#top)

___

## Determine if the First Quintile Outperformed the Fifth Quintile

After running the Alpha Testing model, select the Periods report from the left pane to determine if the first quintile outperformed the fifth quintile.

### The Periods Report

By looking at the Periods report, you can see on the summary line that the first quintile for the P/E factor performed the best with a geometric mean return for the entire period of 4.28, while the fifth quintile performed the worst with a geometric mean return of 1.65 for the entire period. The first quintile also beat the benchmark's return of 2.24.

![](online-assistant/23448.9.html)

To see a chart of the cumulative returns of Quintile 1 vs. Quintile 5, click the **Add Chart** button ![](online-assistant/23448.10.html) and select "First vs. Last Fractile Cumulative Return."

![](online-assistant/23448.11.html)

To close the chart and return to the Periods report, click the **Close Chart** button ![](online-assistant/23448.12.html) in the upper right corner. To learn more about how to chart your results, see [Charting Model Results](https://my.apps.factset.com/oa/pages/pages/14198).

To look at each quintile’s performance for another of your model’s factors, you can change Factor 1's definition in this report. Click the Quick Link that is labeled Factor 1.

![](online-assistant/23448.13.html)

Select "3 Factor MFR" from the Selected Factors section and move it to the top of the list by clicking the **Move Up** button. Click **OK** to re-generate the report.

You will see that the return for Quintile 1 still performed the best with a return of 3.04 and Quintile 5 still performed the worst with a return of 2.17. However, the absolute return of Quintile 1 and the out performance compared to Quintile 5 for the MFR was not as great as the P/E factor, so in this case the MFR does not perform as well as the individual P/E factor.

You can compare how the first and the last fractile performed across multiple factors by looking at the "F1-FN Return" column statistic. This shows you the geometric mean of each period’s difference between the first and last fractile for a specific fractile. To show this statistic for multiple factors, right-click on the "F1-FN Return" column, select "Format Column," select "All" under the Factor Columns section, and click **OK**.

![](online-assistant/23448.14.html)

When the report regenerates, you will see that the P/E factor has a geometric mean return of 1.77 and the 3 Factor MFR has a mean return difference of 1.12, whereas the mean return differences for the Three Year Sales Growth Rate and Long-Term Growth Rate factors are -0.59 and -1.40, respectively.

You can also look at the Information Coefficient for each factor, which tells you the Spearman ranked correlation between your factor data and forward returns for your universe.

To find the IC column statistic, scroll to the right. Right-click the column, select "Format Column," select "All" under Factor Columns section, and click **OK**.

You will see that the P/E factor has positive correlation of 0.07, the correlation for the 3 Factor MFR is 0.03, the 3 Yr Sales Growth Rate has a correlation of -0.01, and the Long-Term Growth Rate has a negative correlation of -0.02. From this analysis, you see that the P/E factor performed well and the 3 Yr Sales Growth Rate and the Long Term Growth Rate factors did not perform well. To offset the poor performance, you can change the weights of your multi-factor rank with the option to [weight by a column result](https://my.apps.factset.com/oa/pages/pages/13934#COL) like IC, or find other factors to include in your test.

To save any changes to the reports in your model, select File > Save.

For further analysis, see other [default column statistics](https://my.apps.factset.com/oa/pages/pages/13718) on periods, fractiles, factors, or [multiple factor regression reports](https://my.apps.factset.com/oa/pages/pages/13802). To learn how to customize your reports further, see [Specifying Report Settings](https://my.apps.factset.com/oa/pages/pages/13554) and [Interactive Report Settings](https://my.apps.factset.com/oa/pages/pages/14305).

[Top of Page](https://my.apps.factset.com/oa/pages/14371#top)
