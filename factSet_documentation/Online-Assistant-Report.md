---
created: 2026-05-05T19:04:22 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13718
author: 
---

# Online Assistant : Report

> ## Excerpt
> This page explains calculations for default FactSet statistics that can be added to any period, fractile, or factor grouped report. To create your own custom column, see Custom Formula Definitions.

---
## Report Calculations Page 13718

This page explains calculations for default FactSet statistics that can be [added](https://my.apps.factset.com/oa/pages/pages/13554#add) to any period, fractile, or factor grouped report. To create your own custom column, see [Custom Formula Definitions](https://my.apps.factset.com/oa/pages/pages/13555).

Period statistics refer to calculations performed at the period grouping level, using constituent data for that period.

Summary statistics refer to calculations performed at the summary, fractile, or factor grouping level, usually using the period level results in the calculation. Any [report filtering](https://my.apps.factset.com/oa/pages/pages/13554#factor), [fractile columns](https://my.apps.factset.com/oa/pages/pages/13554#columns), or [fractile grouping](https://my.apps.factset.com/oa/pages/pages/13554#groupings) chosen will change the constituents used in the calucation shown. Specifying a [factor](https://my.apps.factset.com/oa/pages/pages/13554#columns) for a column will change the factor data used to calculate the statistic.

|**Note**|The spreadsheet above shows the calculations for the "Calculation Example Model" in the FactSet directory.
|---|---|
Cells in green are the proofs of the numbers from Alpha Testing. Yellow cells are intermediate calculations.
The weight used for any weighted calculation is determined when you [specify weights and market cap](https://my.apps.factset.com/oa/pages/pages/14026) in the return tab of model inputs.
All statistics are explained for the Equal Weighted return type only.|

Number of Securities

_Summary Statistic_: The number of securities in period 1 plus the number of securities in period 2, etc. The sum of each period's number of securities result over the date range specified for the report.

_

Period Statistic_: The number of constituent securities for the period indicated.

Universe Return

_Summary Statistic_: This [calculation](https://my.apps.factset.com/oa/pages/pages/13555#return) is dependent on the [return type](https://my.apps.factset.com/oa/pages/pages/13599) chosen.

_Period Statistic_: This [calculation](https://my.apps.factset.com/oa/pages/pages/13555#return) is dependent on the [return type](https://my.apps.factset.com/oa/pages/pages/13599) chosen.

Universe Median Return

_Summary Statistic_: The geometric average of each period's median return when the Equal Weighted return type is chosen. The summary calculation will change for each [return type](https://my.apps.factset.com/oa/pages/pages/13599).

_

Period Statistic_: The median return for the specific period when the Equal Weighted return type is chosen. This calculation will change for each [return type](https://my.apps.factset.com/oa/pages/pages/13599), i.e., use a weighted median for Weighted Return types.

Standard Deviation Return

_Summary Statistic_: The standard deviation of each period’s return.

_

Period Statistic_: The standard deviation of returns for constituent companies, for the indicated period. Weighted Return types will use a weighted standard deviation calculation. Standard deviation results are annualized by multiplying the non-annualized result by the square root of the number of periods per year.

Residual Risk

_Summary Statistic_: This value is equal to the square root of the variance of returns for the fractile throughout time minus the square of the beta value times the variance of the benchmark return, or:

> ![](online-assistant/23416.html)

**where:**

r<sub>p</sub> is the return of the portfolio

r<sub>b</sub> is the return of the benchmark

This statistic is NA at the period level.

Sharpe Ratio

_Summary Statistic_: This calculation is equal to (universe return - risk free rate) ÷ standard deviation of return. The summary statistic result for each component item in the calculation is used. The [sharpe ratio](https://my.apps.factset.com/oa/pages/pages/3938#sharpe_ratio) is a risk-adjusted financial measure, used to determine the reward per unit of risk. The higher the Sharpe ratio, the better the “risk-adjusted” performance.

_Period Statistic_: The Period Statistic is the same as the Summary Statistic except the period level results for each component are used.

Information Ratio

This value is the ratio of annualized residual alpha (excess return over the benchmark) the manager can achieve for every level of annualized residual risk (standard deviation of excess return over the benchmark). For more information on the information ratio, click [Difference Between IC and IR](https://my.apps.factset.com/oa/pages/pages/13740).

This statistic is NA at the period level.

% > Bench

_Summary Statistic_: The percentage of periods where the universe return is greater than the benchmark return.

The result will change for each return type.

_Period Statistic_: The percentage of constituents with returns greater than the benchmark, as of the end of the indicated period. % Bench is equal to:

\[(Number of Companies with returns > Bmark Return) ÷ (Number of Companies)\] \* 100

|**Note**|The number of benchmark constituents in a period always stays the same and therefore is never affected by [filters](https://my.apps.factset.com/oa/pages/pages/13554#filtersection). This means that the benchmark component of any statistic is also not affected by filters. If you have chosen "[Same as Universe](https://my.apps.factset.com/oa/pages/pages/13552#bench)" as your benchmark option, a filter which excludes fractile groups from your report (e.g., all but one sector), and want the % > Bench statistic to be calculated versus a "filtered" benchmark, then you really want to add the % > Universe Return statistic (which is the same calculation as % > Bench but uses the universe return instead) to your report.
|---|---|
To [add](https://my.apps.factset.com/oa/pages/pages/13554#add) this column, expand the Other > Security Statistics list in the Column Selection dialog box.|

% > Up Bench

_Summary Statistic_: This calculation is the percentage of periods in an up market (benchmark return greater than zero) that the universe return is greater than the benchmark return. The result will change for each return type.

_Period Statistic_: The period result for the % > Bench statistic is shown only for those periods where the benchmark return is greater than zero (for other periods, the result is NA).

% > Down Bench

_Summary Statistic_: This calculation is the percentage of periods in a down market (benchmark return less than zero) that the universe return is greater than the benchmark return. The result will change for each return type.

_Period Statistic_: The period result for the % > Bench statistic is shown only for those periods where the benchmark return is less than zero (for other periods, the result is NA).

% New Securities

_Summary Statistic_: The arithmetic average of each period’s % New Securities.

_

Period Statistic_: The percentage of new securities for that period. The % New Securities is equal to:

100 \* (the number of securities that are in the current period but not in the immediately previous period)/ (total number of securities in the current period).

If a security dropped out in a previous period and then comes back, it is counted as a new security.

% Old Securities

_Summary Statistic_: The arithmetic average of each period’s % Old Securities.

_

Period Statistic_: The percentage of old securities not reappearing in the period. The % Old Securities is equal to:

100 \* (the number of securities that are in the immediately previous period but not the current period)/ (total number of securities in the immediately previous period).

% Total Turnover

_Summary Statistic_: The arithmetic average of each period’s % Total Turnover.

_

Period Statistic_: This calculation is equal to

((# of securities that exited the old universe) + (# of new securities that entered)) ÷ (total # of securities in the old universe). The values in each fractile row display fractile-specific turnover. The value in the summary row displays the average turnover for the entire duration of the test.

% Weighted Turnover

_Summary Statistic_: This calculation takes the arithmetic average of each period's % Weighted Turnover.

_Period Statistic_: This calculation takes the:

\[(((sum of the weights of the old stocks that exited the old universe) + (sum of the weights of the new stocks that entered the new universe)) ÷ sum of the total weights in the old universe) \* 100\], for a specific period.

![](online-assistant/23416.1.html)

Average Mcap

_Summary Statistic_: Arithmetic average of each period’s average market value.

_

Period Statistic_: The arithmetic average market capitalization value for each security in your universe for the particular period. The market cap for each security is determined when you [specify weights and market cap](https://my.apps.factset.com/oa/pages/pages/14026) in the return tab of model inputs.

Excess vs. Universe

_Summary Statistic_: This is the geometric average of the differences in period returns for a given fractile.

_Period Statistic_: The universe return for the period, which can be fractiled minus the unfractiled universe return. The value of this column will be 0 unless you have fractile groupings or columns applied to the statistic.

The explanation above is for Equal Weighted return type. The result will change for each return type.

Std. Dev. Excess vs. Universe

_Summary Statistic_: This calculation is the standard deviation of the excess vs. the universe return period results.

_Period Statistic_: This statistic is NA at the period level.

Excess vs. Bench

_Summary Statistic_: The geometric average of each period’s excess returns from the benchmark returns. This value is equal to:

100 \* (geometric average of (1 + each period’s average return ÷ 100) - 1)

_

Period Statistic_: The universe return of the period minus the benchmark return.

The explanation above is for Equal Weighted return type. The result will change for each return type.

|**Note**|If you have selected "Same as Universe" for your benchmark specification, then normally the results of the Excess vs. Universe and Excess vs. Bench statistics will be the same. However, they can be different for [filtered universes](https://my.apps.factset.com/oa/pages/pages/13554#factor) because filters only apply to the universe, not to the benchmark (i.e. benchmark return always stays the same, but the universe return changes with the filter).|
|---|---|

Std. Dev. Excess vs. Bench

_Summary Statistic_: This calculation is the standard deviation of the excess vs. the benchmark return period results.

_Period Statistic_: This statistic is NA at the period level.

Alpha

_Summary Statistic_: The alpha value is the intercept of the regression line drawn for the benchmark’s returns versus the universe return. To see a detailed breakdown of how this number is calculated, view the  [![](online-assistant/23416.2.html) Alpha and Beta Excel spreadsheet](https://my.apps.factset.com/oa/pages/cms/oaAttachment/ab20db65-dad5-41fb-b89e-b21218efe69f/23416).

_Period Statistic_: This statistic is NA at the period level.

T-Stat Alpha

_Summary Statistic_: This calculation is the alpha value ÷ by the standard error of alpha, where n is the number of periods in the model.

(alpha \* square root of (n - 2)) ÷ (the standard deviation of (return - (benchmark \* beta)))

_Period Statistic_: This statistic is NA at the period level.

Beta

_Summary Statistic_: This calculation is the beta value for each fractile’s constituents. Beta is the slope of the regression line of the benchmark returns versus the universe returns.

_Period Statistic_: This statistic is NA at the period level.

T-Stat Beta

_Summary Statistic_: This calculation hypothesizes that the population beta = 0.

![](online-assistant/23416.3.html)**

where:**

The R<sup>2</sup> value is the R squared for the regression line (beta). The result will take the same sign as beta.

_Period Statistic_: This statistic is NA at the period level.

R Squared for Beta

_Summary Statistic_: This calculation regresses the R<sup>2</sup> for the universe return. We regress the return value for the universe return against the return of the benchmark for the duration of the model.

![](online-assistant/23416.4.html)

**where:**

r<sub>b</sub> is the return for the benchmark

r<sub>p</sub> is the return for the universe

_Period Statistic_: This statistic is NA at the period level.

Information Coefficient (Spearman)

_Summary Statistic_: Arithmetic average of each period’s IC value.

_

Period Statistic_: The Information Coefficient (IC) is a Spearman ranked correlation. The IC is computed by assigning a rank to all the formula values and a rank to all the returns, and then calculating the correlation coefficient between these two series. As with any correlation coefficient, this value will lie between -1 and +1, where a high positive value indicates that companies with high factor values tend to yield high returns. Negative IC values indicate that high factor values tend to yield low returns. A company must have both a ranking factor value and a subsequent return available to be included in the IC universe for a particular period. Any security that has an NA result for either the factor or return value is excluded from the IC calculation before calculating the rankings of each data set. Securities with NA data for other factors (besides the factor selected for the IC calculation) are not excluded from the calculation unless those factors have [NA data excluded](https://my.apps.factset.com/oa/pages/pages/13573#na) and those factors have been [selected](https://my.apps.factset.com/oa/pages/pages/13554#factor) for the report.

|**Notes**|1) The Information Coefficient (IC) calculation is a correlation between forward return data and current factor values.
|---|---|
2) The IC calculation uses factor values. An IC for a report universe is not dependent on your model's fractiling or layering selections. Thus,
\* the overall IC for a layered factor is equal to the IC for a non-layered factor that uses the same factor formula
\* the IC for a deciled factor is equal to the IC for a quintiled factor.
However, you will see differences for ICs calculated within fractiles for these factors.
3) Changing the return horizon for your report changes the IC calculation. For example, if you change your return horizon from a one month to a three month forward return, the IC calculation will also change to use three month return data.
The same is true when you make changes to selected factors in a report, the factor data used in the IC calculation is changed automatically.
4) For Spearman IC, if there are tied values, then both securities are put in the lowest rank before calculating the correlation (i.e. if two securities tied for 3rd highest factor value, both securities are given a rank of 4).
5) There is a Pearson correlation version of the IC column that you can [select](https://my.apps.factset.com/oa/pages/pages/13554#add) for your reports that performs an unranked correlation.|

IC T-Stat (Spearman)

_Summary Statistic_: The arithmetic average of each period’s IC T-stat value.

_

Period Statistic_: This value indicates if the found IC is significant based on the number of companies that went into the computation. A significant IC t-stat means that you can reject the null hypothesis that the IC equals 0 for a particular confidence level (a two-tailed/sided test). Significant t-scores must be looked up in a t-table.

This value is equal to:

the square root of \[(the number of companies in the universe - 2) ÷ (1 - IC \* IC)\] \* IC. The t-stat result, and thus the confidence in IC being statistically significantly different than 0, will increase as either the universe size or IC value increases.

The number of companies excludes companies that do not have either a factor or a subsequent return value. There is a Pearson correlation version of the IC column that you can [select](https://my.apps.factset.com/oa/pages/pages/13554#add) for your reports that performs an unranked correlation.

Factor Average

_Summary Statistic_: The arithmetic average of each period’s average factor value.

_

Period Statistic_: The arithmetic average of constituent factor values for the period.

Factor Low

_Summary Statistic_: The lowest of all the factor values for all periods.

_

Period Statistic_: The lowest value of constituent factor values for the period.

Factor High

_Summary Statistic_: The highest of all the factor values for all periods.

_

Period Statistic_: The highest value of constituent factor values for the period.

Factor Median

_Summary Statistic_: The median of the period factor median results.

_

Period Statistic_: The median of constituent factor values for the period.

Factor Std Dev.

_Summary Statistic_: The standard deviation of all the period factor average results.

_

Period Statistic_: The standard deviation of the constituent factor values for the period.

Factor Skewness

_Summary Statistic_: The arithmetic average of each period’s skewness value.

_Period Statistic_: Skewness is a measure of asymmetry. A negative value indicates skewness to the left, and a positive value indicates skewness to the right. A zero value does not necessarily indicate symmetry. The equation for skewness is: ![](online-assistant/23416.5.html) where

_n_ is the number of security factor values, _Xj_ is each security j's factor value X, _t_ is the average of all security factor values, and _s_ is the standard deviation of all security factor values. If there are fewer than three data points, or the sample standard deviation is zero, then the Factor Skewness will be NA.

Factor Kurtosis

_Summary Statistic_: The arithmetic average of each period’s kurtosis value.

_Period Statistic_: Kurtosis is one measure of how different a distribution is from the normal distribution. A positive value typically indicates that the distribution has a sharper peak, thinner shoulders, and thicker tails than the normal distribution. A negative value means that a distribution has a flatter peak, thicker shoulders, and thinner tails than the normal distribution. The equation for Kurtosis is: ![](online-assistant/23416.6.html) where

_n_ is the number of security factor values, _Xj_ is each security j's factor value X, _t_ is the average of all security factor values, and _s_ is the standard deviation of all security factor values. If there are fewer than four data points, or the sample standard deviation is zero, then the Factor Kurtosis will be NA.

Factor Data Correlation (F1 vs. F2)

_Summary Statistic_: Arithmetic average of each period’s Factor Data Correlation value.

_Period Statistic_: A Spearman ranked correlation between the Factor 1 and Factor 2 Values. It is computed by assigning a rank to all the factor 1 and 2 formula values, and then calculating the correlation coefficient between these two series. As with any correlation coefficient, this value will lie between -1 and +1, where a high positive or negative value indicates that your two factors are similar. A company must have values available for both ranking factors to be included in the factor correlation universe for a particular period. Any security that has an NA result for either their Factor 1 or Factor 2 value is excluded from the Factor Data Correlation calculation before calculating the rankings of each data set. Securities with NA data for other factors (besides the factors selected as Factor 1 and Factor 2) are not excluded from the calculation unless those factors have [NA data excluded](https://my.apps.factset.com/oa/pages/pages/13573#na) and those factors have been [selected](https://my.apps.factset.com/oa/pages/pages/13554#factor) for the report.

For Spearman Ranked Correlations, if there are tied values, then both securities are put in the lowest rank before calculating the correlation (i.e. if two securities tied for 3rd highest factor value, both securities are given a rank of 4).

There is a Pearson correlation version of this column that you can [select](https://my.apps.factset.com/oa/pages/pages/13554#add) for your reports that performs an unranked correlation.

Factor Data Correlation T-Stat

_Summary Statistic_: The arithmetic average of each period’s Factor Data Correlation T-Stat value.

_Period Statistic_: This value indicates if the found Factor Data Correlation is significant based on the number of companies that went into the computation (significant t-scores must be looked up in a t-table). This value is equal to:

![](online-assistant/23416.7.html) The number of companies excludes companies that do not have either a factor 1 or factor 2 value.

For Spearman Ranked Correlations, if there are tied values, then both securities are put in the lowest rank before calculating the correlation (i.e. if two securities tied for 3rd highest factor value, both securities are given a rank of 4).

There is a Pearson correlation version of this column that you can [select](https://my.apps.factset.com/oa/pages/pages/13554#add) for your reports that performs an unranked correlation.

F1 - FN Return

_Summary Statistic_: The geometric mean of the period F1 - FN results.

_

Period Statistic_: The difference in return between your first fractile and your nth fractile for a specific period.

This calculation will change for each [return type](https://my.apps.factset.com/oa/pages/pages/13599).

|**Note**|The F1-FN summary return in a Fractiles or Factors report will be NA if any of the individual period F1-FN returns is less than or equal to -100. If you want to use a different summary statistic for this calculation, you can use an [average summary statistic](https://my.apps.factset.com/oa/pages/pages/13599#ew_note) or a difference using a [column reference](https://my.apps.factset.com/oa/pages/pages/14513#fifteen).|
|---|---|

F1 - FN Return Correlation (Spearman)

_Summary Statistic_: A Spearman ranked correlation between F1 - FN returns of a factor and F1 - FN returns of another factor. It is computed by assigning a rank to the period level F1 - FN returns of a factor and the period level F1 - FN returns of another factor, and then calculating the correlation coefficient between these two series. As with any correlation coefficient, this value will lie between -1 and +1, where a high positive value indicates that high F1 - FN returns tend to coincide with high F1 - FN returns of another factor. Negative F1 - FN return correlation values indicate that high F1 - FN returns tend to coincide with low F1 - FN returns of another factor. If there are tied values, then both returns are put in the lowest rank before calculating the correlation (i.e., if two returns tied for 3rd highest return value, then both returns are given a rank of 4).

There is a Pearson correlation version of the F1 - FN Return Correlation column that you can [select](https://my.apps.factset.com/oa/pages/pages/13554#add) for your reports that performs an unranked correlation.

_Period Statistic_: F1 - FN Return

Rets F11 - FNN

_Summary Statistic_: The geometric mean of the period results.

_Period Statistic_: The difference in return between securities in both Factor 1's first fractile and Factor 2's first fractile and securities in Factor 1's n<sup>th</sup> fractile and Factor 2's n<sup>th</sup> fractile.

![](online-assistant/23416.8.html)

This calculation will change for each [return type](https://my.apps.factset.com/oa/pages/pages/13599).

Benchmark Return

_Summary Statistic_: The geometric average of each period’s benchmark returns. This value is equal to:

100 \* (geometric average of (1 + each period’s average return ÷ 100) - 1).

_

Period Statistic_: If you have selected an identifier as your [benchmark definition](https://my.apps.factset.com/oa/pages/pages/13552#bench), that ID's return is used. If not, Alpha Testing will perform the same calculation on the universe of benchmark securities that is performed for the universe return.

This calculation will change for each [return type](https://my.apps.factset.com/oa/pages/pages/13599).

Risk Free Rate

_Summary Statistic_: The geometric average of each period’s risk free rate. This value is equal to:

100 \* (geometric average of (1 + each period’s average return ÷ 100) - 1).

_Period Statistic_: Alpha Testing uses the discount rate on new issues for the 91-Day Treasury Bills from the BCI database as the default risk free rate return series. You can [change](https://my.apps.factset.com/oa/pages/pages/13596#risk) or create your own custom [risk free rate](https://my.apps.factset.com/oa/pages/pages/13603#riskfree).

This calculation will change for each [return type](https://my.apps.factset.com/oa/pages/pages/13599).

The economic data provided by BCI, measures, on a bank discount basis, the average rate of interest as set in the weekly auction of new 91-day Treasury bills. In the auction, each potential buyer specifies the price he or she is willing to pay and the amount of bills he or she wishes to buy, and awards are made to the highest bidders. For each week's issue, the average rate of interest is based on the average of the prices at which the various portions of the issue are sold. The monthly series is the average of the four or five weekly rates for each month. (These auction rates are not the same market rates, although they are similar; the latter rates are on outstanding bills, based on daily trading quotations.)

The auction average rate for each week is dated as of the date of issue of the bills, normally a Thursday, even though the auction (the time that the price decisions are made) normally occurs on the Monday of that week (or, at times, on Friday of the preceding week). Therefore, the monthly average of the weekly rates sometimes includes the results of an auction that occurred late in the preceding month. Information on individual issues may be found in the Treasury Bulletin. Data, which are measured in terms of percent, are available beginning with 1945 and are not seasonally adjusted.

In BCD, the auction average rate, series 114, appears under the economic process "money and credit." It is classified by cyclical timing as a coincider at peaks, lagger at troughs and a lagger overall.

Source: 

_Handbook of Cyclical Indicators (1984), U.S. Department of Commerce._

Number of NA Returns (Number of Companies with Not Available Data)

_Summary Statistic_: The sum of each period's Number of NA returns divided by the date range specified for the report.

_

Period Statistic_: The number of companies with NA return data for that period.

[Top of Page](https://my.apps.factset.com/oa/pages/13718#top)
