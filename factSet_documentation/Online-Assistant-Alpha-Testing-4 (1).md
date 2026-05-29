---
created: 2026-05-05T19:04:43 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21417
author: 
---

# Online Assistant : Alpha Testing 4

> ## Excerpt
> This page addresses some of the most frequently asked questions about Alpha Testing.

---
## Alpha Testing 4 - Frequently Asked Questions Page 21417

This page addresses some of the most frequently asked questions about Alpha Testing.

Creating Models:

-   [How do I know if I can backtest a code in my model?](https://my.apps.factset.com/oa/pages/21417#one)
-   [Does my backtest code have a look-ahead bias?](https://my.apps.factset.com/oa/pages/21417#two)
-   [Does my model have a survivorship bias?](https://my.apps.factset.com/oa/pages/21417#three)
-   [How do I evenly weight each fractile?](https://my.apps.factset.com/oa/pages/21417#five)
-   [Can I analyze a small-cap and large-cap universe in the same Alpha Testing model?](https://my.apps.factset.com/oa/pages/21417#six)

Creating and Analyzing Reports:

-   [How do I get a specific factor to appear in a chart?](https://my.apps.factset.com/oa/pages/21417#seven)
-   [How can I correlate Fractile 1 period returns of all the factors in my model?](https://my.apps.factset.com/oa/pages/21417#eight)
-   [How do I group an Alpha Testing report by month or year?](https://my.apps.factset.com/oa/pages/21417#nine)
-   [I have a Multi-Factor Ranking (MFR) in my model that uses the trailing period results of a report column to weight the individual factors. Is there anything special I should do when viewing my reports?](https://my.apps.factset.com/oa/pages/21417#ten)
-   [How can I see the returns for all securities that are in Fractile 1 for either of my first two factors?](https://my.apps.factset.com/oa/pages/21417#eleven)
-   [How can I see statistics for the top 10 ranked securities in my factor each period?](https://my.apps.factset.com/oa/pages/21417#twelve)

More Detailed Information:

-   [What is the difference between returns selected in Model Inputs vs. Report Settings?](https://my.apps.factset.com/oa/pages/21417#thirteen)
-   [Why doesn't an annualized one day return equal the return from my 12 month return horizon?](https://my.apps.factset.com/oa/pages/21417#fourteen)
-   [Why doesn't my F1-FN return equal the F1 return minus the FN return?](https://my.apps.factset.com/oa/pages/21417#fifteen)
-   [Why doesn't my report's benchmark return match the benchmark's published return?](https://my.apps.factset.com/oa/pages/21417#sixteen)
-   [Why doesn't my universe's one period cumulative return for a two month horizon match a the two period cumulative return for a one month horizon?](https://my.apps.factset.com/oa/pages/21417#seventeen)
-   [Why do I get the same IC result for my layered and non-layered factors?](https://my.apps.factset.com/oa/pages/21417#eighteen)
-   [Is there a way to determine an optimal weight for my Multi-Factor Ranking factor?](https://my.apps.factset.com/oa/pages/21417#nineteen)
-   [Why don't my constituent lists in Portfolio Simulation and Alpha Testing match when they are defined exactly the same way?](https://my.apps.factset.com/oa/pages/21417#twenty)

___

## How do I know if I can backtest a code in my model?

You can backtest a code if it accepts a relative date argument, namely the zero date argument.

To test if you can backtest a code, go into [Universal Screening](https://my.apps.factset.com/oa/pages/pages/20593) and look up your formula using the type-ahead search in the Add Columns workspace or by clicking ![](online-assistant/26812.html) to browse for formulas. When you select the formula, you will get the option to select a relative zero date if it is backtestable:

![](online-assistant/26812.1.html)

If you do not have an option to select a relative date, such as "Latest Completed Period," the code cannot be backtested. After you add the code with the zero date argument, download the results for your securities. [Set your backtest date](https://my.apps.factset.com/oa/pages/pages/20610#Exploring) by clicking the ![](online-assistant/26812.2.html) button for the **Screen and Application Settings** menu. When the report recalculates, look at the results and you will see that they have changed (for securities that are still in the universe for the new backtest date). The results will be the same as if you entered the code with the date argument equal to the backtest date. By using the zero date in your code, the backtest date is substituted automatically for the zero date in the code.

|**Note**|FactSet does not recommend using the "Latest Available" argument for your date selection in Alpha Testing. Selecting "Latest Available" will use the NOW date argument, which ignores the backtest date.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Does my backtest code have a look-ahead bias?

A model is subject to [look-ahead bias](https://my.apps.factset.com/oa/pages/pages/3931#lb) if it uses information that was not available on the test day, such as financial statement data. Fiscal quarter-end and year-end accounting data such as earnings and sales may not become publicly available until the following quarter when the 10-Q or 10-K is reported.  To account for this reporting delay, you should [lag](https://my.apps.factset.com/oa/pages/pages/13736) fundamental data. For example, to lag a P/E formula from the FactSet Fundamentals database, you would use

FF\_PRICE\_CLOSE\_CP(MON,0)//FF\_EPS(MON,0 L45D)

to account for the 45-day reporting lag.  These lags are only approximations, as some companies release their numbers before or after the reporting deadline.

For a list of databases and data items that do and do not need to be lagged, see [Knowing Which Databases Do or Don't Require Lags](https://my.apps.factset.com/oa/pages/pages/13736#DODONT).

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Does my model have a survivorship bias?

More than 150 constituents that appeared on the S&P 500 a decade ago no longer exist today. If you run models back in time and exclude companies that existed historically but no longer trade today (due to bankruptcy, LBO, or acquisition), this is called survivorship bias. You should always include these inactive securities in your historical universe of companies at appropriate times. Not including them in historical tests can severely impact your results because you will not be testing the complete universe of securities that existed at that time.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## How do I evenly weight each fractile?

You can create custom fractiles in Alpha Testing by constructing them to contain equal amounts of any variable such as market cap, sales, or total assets.

To weight your fractiles:

1.  Click the **Model Options** button, and then choose the Factors section in the left pane of the Edit Model Options page.
2.  [Add a new factor](https://my.apps.factset.com/oa/pages/pages/21240#new_factor) by clicking the **Add** button ![](online-assistant/26812.3.html) or select an existing factor that you want to adjust.
3.  Within the Options section in the right pane, expand Fractiling Options.
4.  Select "Weighted" from the [Fractiling Type](https://my.apps.factset.com/oa/pages/pages/21351#fractiling_type) drop-down menu and enter your desired fractile formula in the Formula field. The weighted option will assign an equal amount of the weight formula to each fractile.
    
    You can also combine this feature with the [Layer On](https://my.apps.factset.com/oa/pages/pages/21240#layer) option to get an equal amount of weight from each layering group into each fractile. For example, if you choose to layer on Sector and choose Market Cap to weight the factor, then in addition to layering the fractiles, this will put an equal amount of weight from each sector into each fractile. However, if one security dominates the weight of a sector (e.g., Exxon Mobil), Alpha Testing will not be able to distribute the weight evenly.
    

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Can I analyze a small-cap and large-cap universe in the same Alpha Testing model?

To analyze different cap ranges within your main [universe](https://my.apps.factset.com/oa/pages/pages/20848), add a [factor](https://my.apps.factset.com/oa/pages/pages/21240) formula such as IF(FF\_MKT\_VAL(MON,0)<5000,"SMALL CAP","LARGE CAP"), and select "Group" from the Fractiles drop-down menu.

![](online-assistant/26812.4.html)

For subsequent factors, e.g.

FF\_PBK(QTR,0 L45D)

, select the cap grouping factor from the "[Layer On](https://my.apps.factset.com/oa/pages/pages/21240#layer)" drop-down menu in addition to selecting the number of fractiles you want.

![](online-assistant/26812.5.html)

This will fractile your companies within each capitalization grouping. To analyze the different cap ranges in your Alpha Testing reports, click the **Tile Options** button ![](online-assistant/26812.6.html) and select "Tile Options" from the drop-down menu. Choose "[Filters](https://my.apps.factset.com/oa/pages/pages/21348#filters)" from the left pane of Tile Options. Select the Large/Small Cap factor that you created, and then specify the desired cap groups that you want to see in the report.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## How do I get a specific factor to appear in a chart?

To chart a specific factor, you must first select that factor for the report statistic.

To assign a factor to a report statistic, click the **Tile Options** button ![](online-assistant/26812.7.html) and select "Tile Options" from the drop-down menu. Choose "[Columns](https://my.apps.factset.com/oa/pages/pages/21348#columns)" from the left pane of Tile Options. Select the column, and then choose the desired factor.

Now when you chart that statistic, it will be of your desired factor. One way to [chart](https://my.apps.factset.com/oa/pages/pages/21157) the column result is to right-click on the column and select "Chart Column."

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## How can I correlate Fractile 1 period returns of all the factors in my model?

To correlate Fractile 1 period returns, you must first add a column that calculates the period-level Fractile 1 returns for each factor and then add a column to calculate correlations between each factor's Fractile 1 return.

To begin correlating Fractile 1 period returns for all factors:

1.  Click the **Add/Remove Report** button ![](online-assistant/26812.6.html), and double-click or drag and drop to add a new Factors report**.**
2.  Click the **Tile Options** button ![](online-assistant/26812.8.idunno) and select "Tile Options" from the drop-down menu. Choose "[Columns](https://my.apps.factset.com/oa/pages/pages/21348#columns)" from the left pane of Tile Options.
3.  Click the **New/Reference** button next to the Available column list.
4.  Within the Columns dialog box, select "Reference" as the type of column.
5.  Enter the Period Formula as #RET:P:F1 and the Summary Formula as AT\_RETURN\_SUMMARY\_CALC. Enter a name in the Column Name section.
    
    ![](online-assistant/26812.7.html)
6.  Click **Save**.
7.  Click the **New/Reference** button again, and enter the Period Formula as NA and the Summary Formula as AT\_CORREL(COL1:P:FTRG, #RET:P:F1). Enter a name in the Column Name section, click **Save** to return to the Column Selection dialog box, and then click **OK** to return to the Report Settings dialog box.
    
    |**Note**|A two-step formula method is the only way to apply Fractile 1 filters for two different factors independently of each other.|
    |---|---|
    
8.  Select from the column list the second column you created and then select "All" under Factor Columns.
9.  Choose [Groupings](https://my.apps.factset.com/oa/pages/pages/21348#groupings) within Tile Options and select the factor grouping.
10.  Choose [Factors](https://my.apps.factset.com/oa/pages/pages/21348#factors) and view the Selected Factors section to make sure you have all the factors selected that you want to see in the correlation matrix.
11.  To accept the report settings, click **Done**. The report will now display the Fractile 1 summary return for each factor in the first column and the correlation between each factor's Fractile 1 period returns in the next set of columns.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## How do I group an Alpha Testing report by month or year?

To group by month:

1.  Click the **Model Options** button and choose [Factors](https://my.apps.factset.com/oa/pages/pages/21240) in the left pane to create a new factor.
2.  [Add a new factor](https://my.apps.factset.com/oa/pages/pages/21240#new_factor) by clicking the Add button ![](online-assistant/26812.9.html).
3.  Enter MOD(FF\_FP\_END\_DATE\_NUM(MON,0)/100,100) in the Formula bar and select Group from the fractiles drop-down menu. (The [MOD](https://my.apps.factset.com/oa/pages/pages/1805) function returns the remainder of two divided numbers which, in this case, represents the numeric form of the current month.)
4.  Choose [Time Series](https://my.apps.factset.com/oa/pages/pages/21243) and set your universe and return rebalance frequencies to one month.
5.  Click **OK** and then click **Run** to run your model.
6.  When your model is finished running, select the Fractiles report.
7.  Click the **Tile Options** button ![](online-assistant/26812.3.html) and select "Tile Options" from the drop-down menu. Choose "[Factors](https://my.apps.factset.com/oa/pages/pages/21348#factors)" from the left pane of Tile Options.  Make sure the month factor you entered is selected as the first factor on the list. Click **OK**. The Fractiles report will be grouped from 1 through 12 representing the months of the year with 1 corresponding to the returns for January, 2 for February, 3 for March, and so on. By doing this, you can evaluate all the data for each month at once without having to run separate filters for each month.

To group by year, follow the steps above, but change the formula slightly. Use MOD(FF\_FP\_END\_DATE\_NUM(MON,0)/10000,1000000) for FactSet Fundamentals or INT(MOD(CM\_DNC(0)/100,10000)) for Compustat.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## I have a Multi-Factor Ranking (MFR) in my model that uses the trailing period results of a report column to weight the individual factors. Is there anything special I should do when viewing my reports?

When you have an [MFR](https://my.apps.factset.com/oa/pages/pages/13934) that uses results from trailing period X for weights, you should not look at the results for this MFR until period X+1. Previous periods will either have NA results for the MFR, or only use a partial set of period results.

To only see results for periods where the MFR could be fully calculated, click the **Tile Options** button ![](online-assistant/26812.8.idunno) and select "Tile Options" from the drop-down menu. Choose "[Filters](https://my.apps.factset.com/oa/pages/pages/21348#filters)" from the left pane of Tile Options, and then select the Periods. Deselect the "Include All" check box, deselect the first X periods, and click **OK** to re-run the report.

|**Tip**|Consider starting your model X periods earlier so that you can look at the same number of periods for your model after filtering out the first X periods.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## How can I see the returns for all securities that are in Fractile 1 for either of my first two factors?

Since using [filters](https://my.apps.factset.com/oa/pages/pages/21348#filters) excludes the fractiles that you do not select, filtering down to these two fractiles will show you an average return for securities in Fractile 1 of both factors. To see a return for securities in either factor, you need to create a [custom formula](https://my.apps.factset.com/oa/pages/pages/21348#columns) within Tile Options > Columns. Enter the period formula AT\_AVG(IF((#FRN1=1 OR #FRN2=1)=1,#RET,NA)) and the summary formula AT\_RETURN\_SUMMARY\_CALC.

![](online-assistant/26812.3.html)

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## How can I see statistics for the top 10 ranked securities in my factor?

Use a URANK function within an [AT formula](https://my.apps.factset.com/oa/pages/pages/13555#new) to return results for only the top 10 ranked securities and NA for all other securities. Specify 1 as the universe, indicating that you are including all securities in your model's universe for that period in the calculation.

For example, the following are examples of period formulas for the top 10 ranked companies:

-   Equal Weighted Return: `AT_AVG(IF(URANK(1,#CFT*#CFO)<=10,#RET,NA))`
-   Spearman Ranked Information Coefficient (IC): `AT_RCORREL(IF(URANK(1,#CFT*#CFO)<=10,#RET,NA),IF(URANK(1,#CFT*#CFO)<=10,#CFT,NA))*#CFO`
-   Spearman IC T-Stat: `SQRT(((AT_COUNT(IF(URANK(1,#CFT*#CFO)<=10,#RET+#CFT,NA))-2)/(1.0-((@T1:=AT_RCORREL(IF(URANK(1,#CFT*#CFO)<=10,# RET,NA),IF(URANK(1,#CFT*#CFO)<=10,#CFT,NA))*#CFO)*@T1))))*@T1`

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## What is the difference between returns selected in Model Inputs vs. Report Settings?

When you select a return source from the [Returns section](https://my.apps.factset.com/oa/pages/pages/21416) in Edit Model Inputs, you are telling Alpha Testing what forward return to fetch for all the securities in your universe, with the length of the return horizon(s) specified in the Returns section.

In contrast, when you select a return type in the [Return section](https://my.apps.factset.com/oa/pages/pages/21348#returns) of Tile Options, you are telling Alpha Testing how to aggregate all of the individual security returns into a single universe return for the period.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Why doesn't an annualized one day return equal the return from my 12 month return horizon?

The one day return is an average of all the one day returns for all the securities in your universe. This one day return is then [annualized](https://my.apps.factset.com/oa/pages/pages/13599#an).

An annual return from a 12 month return horizon simply takes the average of all the one year returns for all the securities in your universe. Since the one day and one year returns of a security will most likely be different, then these two results are different.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Why doesn't my F1-FN return equal the F1 return minus the FN return?

Alpha Testing calculates the summary F1-FN return by taking a geometric mean of each period's F1-FN return. The F1 and FN summary returns are geometric means of each period's F1 and FN return. The difference of two geometric means does not equal the geometric mean of a difference of two numbers, (i.e. ((5-2) \* (7-3)) does not equal ((5\*7) - (2\*3)).

For more information on the difference between averages and geometric means, read [this article](http://www.investopedia.com/articles/06/compoundingdarkside.asp).

If you want the summary F1-FN return to equal the summary F1 return minus the summary FN return, you must create a custom column for your report. First, add the First Fractile and Last Fractile Return columns to your report (Tile Options > Columns), then click the **New/Reference** button and enter the following for both the period and summary formula: COL1-COL2. Click **Save** to create the new column and then **OK** twice to see the result of your new report statistic.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Why doesn't my report's benchmark return match the benchmark's published return?

To have the benchmark return match the published return, you must choose the [Identifier](https://my.apps.factset.com/oa/pages/pages/20848#benchmark) option when specifying your benchmark. In addition, when you select the return source for your [benchmark](https://my.apps.factset.com/oa/pages/pages/13596#different), you must choose the right [source](https://my.apps.factset.com/oa/pages/pages/14025) for the identifier you choose. For example, to get the published return for the S&P 500, you must either define your benchmark identifier as SP50 and choose the Compustat return source or define your benchmark identifier as SP50.R and choose the FactSet Prices return source. For the Russell 3000, you would either choose the identifier R.3000 and the Russell return source or choose the identifier IYBKK and the FactSet Prices return source. For the MSCI EAFE index, you would choose the identifier 990300 and either the MSCI-Gross or MSCI-Net return source.

You will not be able to match an index's published return if you define your benchmark using the Formula, Portfolio, or Screen options. You may be able to approximate by choosing the proper market cap formula to [weight](https://my.apps.factset.com/oa/pages/pages/14026) your returns and then choosing a [weighted return type](https://my.apps.factset.com/oa/pages/pages/21348#returns) for your report.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Why doesn't my universe's one period cumulative return for a two month horizon match the two period cumulative return for a one month horizon?

A single, two month cumulative return will not match the cumulative return for two, one month returns because each has a different order of operations.

For the two month return horizon, the calculation is the [average](https://my.apps.factset.com/oa/pages/pages/13555#atavg) of each security's two month return, but the one month return horizon is calculated by averaging all securities for each period and compounding the two period returns. This difference in the order of operations gives a different result (i.e.,

100\*(1+Average Return period 1/100)\*(1+Average Return Period 2/100)

does not equal

(100\*(1+Average of 2 Period Returns/100))

.

However, if each period's return was a [geometric mean](https://my.apps.factset.com/oa/pages/pages/13555#atgeo), then these two operations would be equal (i.e.,

100\*(1+Geometric Mean Return Period 1 Returns/100)\*(1+Geometric Mean Return Period 2 Returns/100)

is equal to

100\*(1+Geometric Mean of 2 Period Returns/100)

.

You can also make the two operations equal by taking a weighted average for each period, where the weights for the second period reflect the performance from the first period. For example, if your model starts on 31-Dec-2005, enter the following [custom weight formula](https://my.apps.factset.com/oa/pages/pages/14026) in the Returns tab in the Model Inputs dialog box:

IF(PDNC(0)=20051230,1,100\*(1+PRET(0M,12/31/2005)/100))

. In your report, select the weighted cumulative return type. The one period cumulative return for the two month horizon will now match the two period cumulative return for the one month horizon. This operation is closer to how a portfolio's return over two periods is calculated since the weights of securities will fluctuate with market value.

A second reason that your results do not match could be that your universe changes in Period 2. If there are different securities for the second period, then the two month return horizon universe no longer matches the second period universe for the one month return horizon. This will cause the results for any of the operations discussed previously to be unequal.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Why do I get the same IC result for my layered and non-layered factors?

Layering your factors only affects the placement of each security into fractiles (i.e., layering will fractile securities within each group while not layering will consider the whole universe when fractiling). The security data fetched for a layered and non-layered factor is the same. The information coefficient calculation is a correlation between factor data and forward return data. Since the factor data is the same for both types of factors, then the results are the same. To get a different result for the layered factor, you would need to calculate correlations within each layering group.

To add a column that does this type of calculation, click the **Tile Options** button ![](online-assistant/26812.10.html) and select "Tile Options" from the drop-down menu. Choose "[Columns](https://my.apps.factset.com/oa/pages/pages/21348#columns)" from the left pane of Tile Options. From the Available columns list, expand the Other category > Factor Statistics, and then select "Layered Factor Spearman IC." The period formula for this column is:

AT\_CORREL(URANK(1,#RET)/(AT\_COUNT(#RET)+1),UGRANK(1,@T1:=FLOAT(#AFT1),@T2:=FLOAT(#CFT))/(1+UGCOUNT(1,@T1,@T2)))\*#CFO

.

This formula ranks securities' factor data and returns within each group. The ranks are divided by n+1 to make sure that they can be compared properly (otherwise there would be a larger influence from the groups with more members). For this column to work correctly, you need to make the grouping factor your first available factor (first factor entered in model inputs). Otherwise you must change

[#AFT1](https://my.apps.factset.com/oa/pages/pages/13555#fixed)

to reflect the factor that is the grouping factor.

Using

#CFT

means that this column will work for multiple columns if you select "All" for the [Factor Columns](https://my.apps.factset.com/oa/pages/pages/21348#factcol).

You do not need to [select the grouping factor](https://my.apps.factset.com/oa/pages/pages/21348#groupings) as a factor for the report and you do not need to [layer](https://my.apps.factset.com/oa/pages/pages/21240#layer) your factors for this calculation to work.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Is there a way to determine an optimal weight for my Multi-Factor Ranking factor?

The correlation adjusted IC statistic, which you can find in the [Multiple Factor Regression report](https://my.apps.factset.com/oa/pages/pages/13802#report), would give you the weightings for a Multi-Factor Ranking that would produce the best possible IC for that period (e.g., the combined IC column result for the period), if you knew ahead of time what each factor's IC and correlation to every other factor was going to be. Since you cannot know these results for each individual factor ahead of time (you can know the factor data, but not the forward returns), you will not be able to weight by correlation adjusted IC when creating a multi-factor rank on current data to use for investing today.

To remove look-ahead bias, you should test the consistency of the correlation adjusted IC for use in Multi-Factor Ranking weights, i.e. use a previous period's correlation adjusted IC result (either a one period result, a multi-period trailing average, or a multi-period pooled result) to weight a current period's [Multi-Factor Ranking](https://my.apps.factset.com/oa/pages/pages/21261).

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)

___

## Why don't my constituent lists in Portfolio Simulation and Alpha Testing match when they are defined exactly the same way?

The reason [Portfolio Simulation](https://my.apps.factset.com/oa/pages/pages/21221) and Alpha Testing constituent lists don't match is because in Portfolio Simulation, you have portfolios created for each of your simulations. If a security remains held in one of your simulation's portfolios but no longer passes the universe definition, then it remains included as a universe constituent because [parameter values](https://my.apps.factset.com/oa/pages/pages/14752#param) still have to be fetched for the security to determine list inclusion and ranking. This concept does not exist in Alpha Testing. Only the securities passing the universe definition for that period are in the universe constituents list.

Another reason could be due to running the two models on different dates. Constituents that passed the universe definition for one backtest date may have changed in the time between the two tests and therefore may not have passed the subsequent test.

[Top of Page](https://my.apps.factset.com/oa/pages/21417#top)
