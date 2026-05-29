---
created: 2026-05-11T13:07:36 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/stats.html
author: 
---

# Stats — FactSet Programmatic

> ## Excerpt
> The fds.fpe.quant.stats module provides a variety of statistical tools to help you analyze securities based on past performance. The module also allows you to evaluate your portfolio against a benchmark, as well as calculate returns correlations against custom factors.

---
The _fds.fpe.quant.stats_ module provides a variety of statistical tools to help you analyze securities based on past performance. The module also allows you to evaluate your portfolio against a benchmark, as well as calculate returns correlations against custom factors.

_fds.fpe.quant.stats_ is one of the major underlying modules to the [Backtest class](https://fpe.factset.com/docs/backtest.html).

## Stats[#](https://fpe.factset.com/docs/stats.html#id1 "Link to this heading")

fds.fpe.quant.stats.adjust(_df_, _apply\_to\=None_, _criteria\_field\=None_, _criteria\_threshold\=None_, _comparison\='<='_, _substitute\='median'_, _additional\_levels\=None_, _proportional\_to\_threshold\=False_, _across\='assets'_, _ret\_only\_adjusted\_cols\=True_, _consider\_ison\=True_, _ison\_column\='ison\_univ'_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.adjust "Link to this definition")

Adjusts the values in specified columns of the dataframe with the substitute metric (mean or median) of the values in that field across time or assets (if additional grouping levels are specified, the substitute metric is calculated at that level). The adjustment is done only if the corresponding value in the criteria field matches the criteria threshold according to the specified comparison. If proportional\_to\_threshold is True the adjustment is done as follows (only for ‘<’ and ‘<=’):

(criteria value/threshold) \* data field value + (1 - criteria value/threshold) \* substitute metric

If proportional\_to\_threshold is False, data field value is set to the substitute metric. Adjustment of missing values (setting them to the mean/median) is available by setting comparison=’isnan’ and leaving an empty criteria field (or providing the same field as apply\_to)

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. The dataframe containing columns to be adjusted, optionally also criteria, grouping and ison\_universe columns
    
-   **apply\_to** (`str` | `list` | `None`) – the name(s) of the column(s) containing the data to be adjusted, if None all columns are adjusted
    
-   **criteria\_field** (`str` | `Series` | `list` | `None`) – the name of a column in df or a pandas Series containing the criteria data, when adjusting multiple columns can use a list of matching length to apply\_to to specify different criteria for each, otherwise same will be used for all, list can be a mix of column names from df and external pandas Series, e.g.: \[‘name1’, Series2\]. If None, the field itself will be used.
    
-   **criteria\_threshold** (`float` | `int` | `list` | `None`) – the value used for numerical comparison with criteria\_field (ignored if comparison=’isnan’) when adjusting multiple columns can use a list of matching length to apply to to specify different threshold for each, otherwise same will be used for all, take care to have an entry (None, or anything really) even for columns which use comparison=’isnan’; MUST be specified when using comparison other than ‘isnan’
    
-   **comparison** (`str` | `list` | `Literal`\[`'<'`, `'<='`, `'=='`, `'>='`, `'>'`, `'isnan'`\]) – determines the comparison operator used to determine which values are to be adjusted; must be one of \[‘<’, ‘<=’, ‘==’, ‘>=’, ‘>’, ‘isnan’\], or a list-like of such values
    
-   **substitute** (`str` | `list` | `Literal`\[`'median'`, `'mean'`\]) – determines the metric which is to be used in the substitution must be either of \[‘median’, ‘mean’\]
    
-   **across** (`Literal`\[`'assets'`, `'time'`\]) – determines if substitutes are to be calculated across time or across assets, must be either of \[‘assets’, ‘time’\]
    
-   **additional\_levels** (`str` | `Series` | `list` | `None`) – specify either a column from df (by heading) or a separate pandas Series, or a list of containing either of these (can be mixed, e.g. \[‘col\_1\_name’, series\_2\]) that specify additional levels of grouping when calculating the substitutes, e.g. group by sector or subindustry instead of across the whole universe of assets
    
-   **ret\_only\_adjusted\_cols** (`bool`) – when True, a dataframe containing only the adjusted columns specified in apply\_to is returned (or a Series if it’s a single column for backwards compatibility with deprecated functionality) when False return a dataframe with same columns as df but with the relevant ones adjusted
    
-   **consider\_ison** (`bool`) – when True, rows corresponding to assets not on the universe will be dropped
    
-   **ison\_column** (`str` | `Series`) – either the name of the column containing the ison\_universe data (dtype=bool) in df or a pandas Series containing the ison\_universe data (dtype=bool)
    
-   **proportional\_to\_threshold** (`bool` | `list`) – if True the substitute values contain information from the substituting value proportional to the relative closeness of the criterion value to the threshold; only applicable when comparison is ‘<’ or ‘<=’, and criteria and threshold must be positive new value = substitute\*(1-crit/thresh) + original\*(crit/thresh) the ‘<=’ must NOT be used if the criteria field is continuous (real) numbers - it’s meant for integers, and it adds +1 to threshold in the new value calculation above
    

Return type:

the original dataframe (df) with the appropriate columns adjusted

fds.fpe.quant.stats.adjust\_outliers\_gmedian(_df_, _data\_field_, _grouping\_field_, _criteria\_field_, _criteria\_threshold_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.adjust_outliers_gmedian "Link to this definition")

Adjusts the values in the specified data field with the median of the values in the same grouping (determined by the grouping\_field). The adjustment is done only if the value in the criteria field is smaller or equal than the criteria threhold. The adjustment is done as follows: (criteria field value /(criteria threshold + 1)) \* data field value + (1 - criteria field value /(criteria threshold + 1)) \* median of the corresponding group

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Containing the data field, grouping field and criteria field.
    
-   **data\_field** (`str`) – The name of the colunm containing the data to be adjusted.
    
-   **grouping\_field** (`str`) – The name of the colunm containing the category labels by which the medians are calculated.
    
-   **criteria\_field** (`str`) – The name of the colunm containing the values that determine if an adjustment is required.
    
-   **criteria\_threshold** (`float` | `int`) – The value of the criteria field at or below which adjustment is required.
    

Return type:

adjusted data from the data\_field

fds.fpe.quant.stats.alpha(_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.alpha "Link to this definition")

Computes alpha (the intercept) of a simple linear regression model.

Parameters:

-   **returns** (`Series`) – Dependent variable
    
-   **benchmark** (`Series`) – Independent variable
    

Return type:

alpha

fds.fpe.quant.stats.alpha\_tstat(_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.alpha_tstat "Link to this definition")

Computes alpha t-stat of a simple linear regression model.

(alpha \* square root of (n - 2)) ÷ (the standard deviation of (return - (benchmark \* beta)))

where n is the number of periods in the model, alpha is the intercept, and beta is the slope of the regression.

See: [https://my.apps.factset.com/oa/pages/13718](https://my.apps.factset.com/oa/pages/13718)

Parameters:

-   **returns** (`Series`) – Dependent variable
    
-   **benchmark** (`Series`) – Independent variable
    

Returns:

NaN is returned if:

-   the length of `returns` is less than 2;
    
-   `benchmark` is the same as `returns`.
    

Return type:

alpha t-stat or NaN

fds.fpe.quant.stats.beta(_period\_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.beta "Link to this definition")

Computes beta of period\_returns with respect to benchmark:

Parameters:

-   **returns** – Asset returns.
    
-   **benchmark** (`Series`) – Benchmark returns.
    

Returns:

float or nan Returns NaN in case benchmark is constant.

Return type:

beta

fds.fpe.quant.stats.beta\_r2(_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.beta_r2 "Link to this definition")

Computes the square of the correlation coefficient R of from a linear regression of returns vs. benchmark.

Parameters:

-   **returns** (`Series`) – Dependent variable
    
-   **benchmark** (`Series`) – Independent variable
    

Return type:

r-squared

fds.fpe.quant.stats.coverage\_matrix(_df_, _apply\_to\=None_, _across\='assets'_, _additional\_levels\=None_, _consider\_ison\=True_, _ison\_column\='ison\_univ'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.coverage_matrix "Link to this definition")

Calculates and return coverage matrix of a (date, symbol multi-indexed) dataset across assets or time, with option for additional grouping. Can calculate coverage over whole data set or only over the assets that are on the active universe at each date (ison column must be provided either as part of dataset or additional series). Heatmap style visualisation also available by using the `plot_coverage_matrix()` function from `plots`

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. The dataframe for which to show coverage, must be multiindexed by date, symbol. Can contain the columns specifying ison\_belonging or extra grouping (e.g. by sector) - they must be specified in the respective parameters
    
-   **apply\_to** (`list` | `None`) – List of columns of df for which to calculate coverage. If `None`, will assume all available columns.
    
-   **across** (`Literal`\[`'assets'`, `'time'`\]) – specify whether to calculate coverage across time(dates) or assets(cross-section)
    
-   **additional\_levels** (`str` | `Series` | `list` | `None`) – Additional grouping to calculate coverage over when `across='assets'` (e.g. by sectors). Either specify the name of a column from df or pass a separate Series with the categorical data.
    
-   **consider\_ison** (`bool`) – Whether to calculate coverage over whole dataset or only assets belonging to a specific universe.
    
-   **ison\_column** (`str` | `Series`) – Must be specified when `consider_ison=True`. Either specify the name of a column from df or pass a separate Series with the universe belonging boolean data. Most commonly (when data comes form Screen) this is the ‘ison\_univ’ column in df.
    

Return type:

the coverage matrix

fds.fpe.quant.stats.custom\_transform\_wrapper(_func_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.custom_transform_wrapper "Link to this definition")

Wrap a simple function that transforms a series in a format similar to other data transformation functions such as score() and winsorize() so it can handle inputs formatted in the same way - a dataframe input with potentially multiple columns to be transformed and additional columns for grouping/filtering.

Parameters:

**func** (`Callable`) – Function to be wrapped. Must be a function that takes a simple series input and returns a series with the same index

Returns:

The returned function has the following signature:

Return type:

callable

fds.fpe.quant.stats.degrees\_of\_freedom(_signal\_scores_, _forward\_returns_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.degrees_of_freedom "Link to this definition")

Calculates the degrees of freedom (the number of instruments for which there is both a non-NaN signal score and a non-NaN forward returns value) over time.

Parameters:

-   **forward\_returns** (`Series`) – Multiindex (date, symbol) series. Forward returns data
    
-   **signal\_scores** (`Series`) – Multiindex (date, symbol) series. Signal data
    

Return type:

Degrees of freedom over time

fds.fpe.quant.stats.downside\_volatility(_period\_returns_, _freq\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.downside_volatility "Link to this definition")

Calculates downside volatility (square root of the semi-variance) from a returns time series.

Parameters:

-   **period\_returns** (`Series`) – Returns time-series
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – The frequency of the data. If not None will annualize the result by multiplying by where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.) annual \[‘A’, ‘Y’, ‘annual’, ‘yearly’\] quarterly \[‘Q’, ‘quarterly’\] monthly \[‘M’, ‘monthly’\] daily \[‘D’, ‘daily’\]
    

Returns:

float

Return type:

downside\_volatility

fds.fpe.quant.stats.drawdown(_cumul\_returns_, _is\_price\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.drawdown "Link to this definition")

Gets current drawdown in percent from a cumulative returns time series or a price time series.

Parameters:

-   **cumul\_returns** (`Series`) – Cumulative returns time-series or a price time-series
    
-   **is\_price** (`bool`) – If False will convert the cumulative returns series to a price-like time-series before calculating drawdown. If True, will calculate drawdown directly without any operations on the time-series. The original cumul\_returns object remains unchanged in either case.
    

Returns:

pandas series Drawdown in percent over time

Return type:

drawdown

fds.fpe.quant.stats.exp\_smooth(_s_, _halflife\=250_, _level\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.exp_smooth "Link to this definition")

Calculate exponentially weighted moving average of a multi-index Series with a specified halflife at a specified level from the multi-index.

Parameters:

-   **s** (`Series`) – Multiindex (date, symbol) series. Containing the data to be exponentially smoothed.
    
-   **halflife** (`int`) – Specify decay in terms of half-life in number of periods. (e.g. 250 for a half-life of 1 year given daily data)
    
-   **level** (`str` | `None`) – Specify the level from the multi-index on which the smoothing is done. Using ‘symbol’ will exponentially smooth the time series of each symbol.
    

Return type:

exponentially smoothed data.

fds.fpe.quant.stats.expected\_tail\_loss(_period\_returns_, _epsilon_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.expected_tail_loss "Link to this definition")

Calculates expected tail loss (ETL) a.k.a. expected shortfall, conditional VaR (cVaR), and average VaR (aVaR).

Parameters:

-   **period\_returns** (`Series`) – Returns time-series
    
-   **epsilon** (`float`) – Probability (0 <= epsilon <= 1) used for the confidence level, (1 - epsilon)%
    

Returns:

float

Return type:

Expected tail loss

fds.fpe.quant.stats.filter\_low\_coverage\_items(_df_, _min\_column\_coverage\=0.0_, _min\_row\_coverage\=0.0_, _apply\_to\=None_, _apply\_to\_columns\_first\=True_, _consider\_ison\=True_, _ison\_column\='ison\_univ'_, _verbose\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.filter_low_coverage_items "Link to this definition")

Remove columns and rows of a dataframe with fraction of NA values larger than the specified minimum coverage. Row coverage is calculated only across the columns specified in apply\_to

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. The data to be cleaned of NA-rich rows and columns
    
-   **min\_column\_coverage** (`float`) – columns with NA values fraction above min coverage will be dropped must be in range \[0.0; 1.0\]
    
-   **min\_row\_coverage** (`float`) – rows with NA values fraction above min coverage will be dropped must be in range \[0.0; 1.0\]
    
-   **apply\_to** (`str` | `list` | `None`) – the procedure will only be applied to the columns with headings specified here, when None it’s applied to all columns
    
-   **apply\_to\_columns\_first** (`bool`) – when True columns that don’t satisfy min column coverage will be dropped before row coverage is calculated and rows below min row coverage are dropped afterwards. When False this is the other way around
    
-   **consider\_ison** (`bool`) – when True, rows corresponding to assets not on the universe will be dropped
    
-   **ison\_column** (`str` | `Series`) – either the name of the column containing the ison\_universe data (dtype=bool) in df or a pandas Series containing the ison\_universe data
    
-   **verbose** (`bool`) – when True the headings of dropped columns and indices of dropped rows are printed out
    

Return type:

data with rows/columns below minimum specified coverage dropped

fds.fpe.quant.stats.hit\_rate(_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.hit_rate "Link to this definition")

Calculates the percentage of periods where returns exceeds benchmark.

Parameters:

-   **returns** (`Series`) – returns time-series
    
-   **benchmark** (`Series`) – benchmark returns time-series
    

Return type:

float

fds.fpe.quant.stats.hit\_rate\_down(_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.hit_rate_down "Link to this definition")

Calculates the percentage of periods in a down market (benchmark return less than zero) when the returns are greater than the benchmark returns

Parameters:

-   **returns** (`Series`) – returns time-series
    
-   **benchmark** (`Series`) – benchmark returns time-series
    

Return type:

float

fds.fpe.quant.stats.hit\_rate\_up(_returns_, _benchmark_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.hit_rate_up "Link to this definition")

Calculates the percentage of periods in an up market (benchmark return greater than zero) when the returns are greater than the benchmark returns

Parameters:

-   **returns** (`Series`) – returns time-series
    
-   **benchmark** (`Series`) – benchmark returns time-series
    

Return type:

float

fds.fpe.quant.stats.ic(_signal\_scores_, _forward\_returns_, _method_, _mean\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.ic "Link to this definition")

Compute signal IC over time.

Parameters:

-   **forward\_returns** (`Series`) – Multiindex (date, symbol) series. Forward returns data
    
-   **signal\_scores** (`Series`) – Multiindex (date, symbol) series. Signal data
    
-   **method** (`Literal`\[`'spearman'`, `'pearson'`, `'kendall'`\]) – The type of correlation coefficient to compute; either of \[‘spearman’, ‘pearson’, ‘kendall’\]
    
-   **mean** (`bool`) – Whether or not to return the mean ic value over the time series
    

Returns:

series The information coefficient over time

Return type:

ic\_ts

fds.fpe.quant.stats.ic\_tstat(_ic\_values_, _n_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.ic_tstat "Link to this definition")

Obtains the information coefficient (IC) t-statistic given the IC and sample size n.

Parameters:

-   **ic\_values** (`Series`) – IC values for a number of signals or dates
    
-   **n** (`int` | `Series`) – Sample size (effective universe size for each signal or date)
    

Returns:

pandas series The t-statistic

Return type:

tstat

fds.fpe.quant.stats.information\_ratio(_returns_, _benchmark_, _freq\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.information_ratio "Link to this definition")

Calculates the Information Ratio:

(mean return - benchmark return)/tracking error

Parameters:

-   **returns** (`Series`) – returns for each period as fraction of previous value (i.e. not in percent)
    
-   **benchmark** (`Series`) – benchmark returns for each period as fraction of previous value (i.e. not in percent)
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – the frequency of the data. If not None will annualize the result by multiplying by :math: sqrt{N} where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.)
    

Return type:

information ratio

fds.fpe.quant.stats.long\_short\_count(_weights_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.long_short_count "Link to this definition")

Get number of long and short positions at each date.

Parameters:

**weights** (`Series`) – Multiindex (date, symbol) series. Position weights for each date and symbol

Returns:

Dataframe with number of longs, shorts, zeros, NaNs, non-NaNs, and total count

Return type:

DataFrame

fds.fpe.quant.stats.longest\_drawdown(_cumul\_returns_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.longest_drawdown "Link to this definition")

Calculates longest drawdown from a cumulative returns time series.

Parameters:

**cumul\_returns** (`Series`) – Cumulative returns time-series or a price time-series

Returns:

Length of the longest drawdown in number of periods

Return type:

int

fds.fpe.quant.stats.max\_drawdown(_cumul\_returns_, _is\_price\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.max_drawdown "Link to this definition")

Calculates maximum drawdown.

Parameters:

-   **cumul\_returns** (`Series`) – Cumulative returns time-series or a price time-series
    
-   **is\_price** (`bool`) – If False will convert the cumulative returns series to a price-like time-series before calculating drawdown. If True, will calculate drawdown directly without any operations on the time-series. The original cumul\_returns object remains unchanged in either case.
    

Returns:

float Maximum drawdown for the entire period

Return type:

max\_drawdown

fds.fpe.quant.stats.mean\_excess\_returns(_returns_, _benchmark_, _freq\=None_, _geometric\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.mean_excess_returns "Link to this definition")

Calculates mean excess returns over benchmark.

Parameters:

-   **returns** (`Series`) – returns time series as a fraction of the previous value (i.e. not in percent)
    
-   **benchmark** (`Series`) – benchmark returns time series as a fraction of the previous value (i.e. not in percent)
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – the frequency of the data. If not None will annualize the result by multiplying by (if geometric = False) or by compounding (if geometric = True) where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.), and is the raw geometric mean return.
    
-   **geometric** (`bool`) – if True will calculate geometric mean return; if False will return arithmetic mean
    

Return type:

mean excess return

fds.fpe.quant.stats.mean\_returns(_period\_returns_, _freq\=None_, _geometric\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.mean_returns "Link to this definition")

Calculates mean returns from a returns time series.

Parameters:

-   **period\_returns** (`Series`) – Returns time series as a fraction of the previous value (i.e. not in percent)
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – The frequency of the data. If not None will annualize the result by multiplying by (if geometric = False) or by compounding (if geometric = True) where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.), and is the raw geometric mean return.
    
-   **geometric** (`bool`) – If True will calculate geometric mean return; if False will return arithmetic mean
    

Returns:

float

Return type:

mean return

fds.fpe.quant.stats.metrics\_over\_time(_period\_returns_, _metrics_, _window\_size_, _window\_type\='rolling'_, _epsilon\=0.01_, _benchmark\=None_, _freq\=None_, _weights\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.metrics_over_time "Link to this definition")

Calculates various performance metrics for rolling or expanding time windows.

Parameters:

-   **period\_returns** (`Series`) – Series indexed by date with returns (relative, i.e. not %) for each period.
    
-   **metrics** (`list`) – List of performance metric labels. For a list of available metrics, see `fds.fpe.quant.metrics.Metrics`.
    
-   **window\_size** (`int`) – If window\_type==’rolling’, determines the number of periods for the rolling calculations. If window\_type==’expanding’, determines the size of the initial window.
    
-   **window\_type** (`Literal`\[`'rolling'`, `'expanding'`\]) – If ‘rolling’, the metrics are calculated over a period of size determined by window shifted by one period each frame. If ‘expanding’, the metrics are calculated over an initial period of size determined by window expanded by one period each frame.
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **benchmark** (`Series` | `None`) – Series indexed by date with benchmark returns (relative, i.e. not %) for each period
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – Frequency of the data. If not None will annualize quantities where applicable.
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Weights for each instrument and point in time; necessary for turnover calculation
    

Return type:

A dict with the selected rolling performance metrics

fds.fpe.quant.stats.multivariate\_regression\_series(_df_, _dependent\_var_, _independent\_vars_, _weight\_col\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.multivariate_regression_series "Link to this definition")

Regress dependent\_var on independent\_vars, with an added intercept, and return a dataframe with coefficients of each date, independent in df.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Containing the dependent\_var, independent\_vars, weight\_col is columns
    
-   **dependent\_var** (`str`) – Name of the dependent variable column
    
-   **independent\_vars** (`list`) – Names of independent variable columns to be regressed upon The regression gives more robust results if these columns are winsorized.
    
-   **weight\_col** (`str` | `None`) – Name of column with company weights to use in the regression, if None regression is equal-weighted.
    

Return type:

Regression coefficients for each of the dependent variables

fds.fpe.quant.stats.neutralize(_df_, _apply\_to_, _industry\_col\=None_, _country\_col\=None_, _weight\_col\=None_, _numeric\_cols\=\[\]_, _ret\_only\_neutralized\_cols\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.neutralize "Link to this definition")

Calculate the industry and/or country neutralized versions of selected columns of a DataFrame. Neutralization is done by regressing on industry and/or country dummies and returning residual. We replace any NaNs in the columns in ‘apply\_to’ with means.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Containing the data to be neutralized
    
-   **apply\_to** (`list` | `dict` | `str`) – Names of the columns to be neutralized, cannot be None
    
-   **industry\_col** (`str` | `None`) – name of column with the industry (or sector) names (or ids) to neutralize by
    
-   **country\_col** (`str` | `None`) – name of column with the country (or currency) names (or ids) to neutralize by
    
-   **weight\_col** (`str` | `None`) – name of column with company weights to use in the neutralization regression, if None regression is equal-weighted
    
-   **numeric\_cols** (`list`) – names of columns with numeric independent variables to be regressed upon
    
-   **ret\_only\_neutralized\_cols** (`bool`) – Determines whether only the modified columns are returned or the entire DataFrame
    

Return type:

Data neutralized by industry and/or country in the chosen columns

fds.fpe.quant.stats.nwinsorize(_df_, _stdev\_limit_, _n\_passes_, _apply\_to\=None_, _across\='assets'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.nwinsorize "Link to this definition")

Winsorize the data in the selected columns of the DataFrame, using standard deviation and n passes.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Data to be winsorised
    
-   **stdev\_limit** (`float`) – standard deviations away from the mean of each data series, used to set the upper and lower limit for the winsorization
    
-   **n\_passes** (`int`) – number of consecutively applied winsorizations
    
-   **apply\_to** (`list` | `dict` | `None`) – determines the columns which are to be winsorized, if None all columns are winsorized
    
-   **across** (`Literal`\[`'assets'`, `'time'`\]) – determines if the winsorization is applied across time or across assets, either of \[‘assets’, ‘time’\]
    

Return type:

winsorized data in the chosen columns

fds.fpe.quant.stats.pct\_win(_period\_returns_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.pct_win "Link to this definition")

Calculate percentage of trading periods that are profitable.

Parameters:

**period\_returns** (`Series`) – Period returns data

Returns:

float The percentage of days with positive returns.

Return type:

pct\_win

fds.fpe.quant.stats.performance(_period\_returns_, _benchmark\=None_, _weights\=None_, _freq\=None_, _epsilon\=0.01_, _metrics\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.performance "Link to this definition")

Calculates various performance metrics as specified.

Parameters:

-   **period\_returns** (`Series`) – Series indexed by date with returns (relative, i.e. not %) for each period
    
-   **benchmark** (`Series` | `None`) – Series indexed by date with benchmark returns (relative, i.e. not %) for each period
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Weights for each instrument and point in time; necessary for turnover calculation
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – Frequency of the data. If not None will annualise quantities where applicable.
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **metrics** (`list` | `None`) – List of performance metric labels. See `fds.fpe.quant.metrics.Metrics` for a list of supported metrics. If None, will default to all supported metrics.
    

Returns:

dict A dict with the selected performance metrics.

Return type:

perf

fds.fpe.quant.stats.performance\_by\_risk(_period\_returns_, _risk\_level_, _upper\=37.5_, _lower\=25_, _freq\=None_, _benchmark\=None_, _weights\=None_, _epsilon\=0.01_, _metrics\=None_, _auto\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.performance_by_risk "Link to this definition")

Calculates performance in low-, medium-, and high-risk market conditions for the specified metrics.

Parameters:

-   **period\_returns** (`Series`) – Series indexed by date with returns (relative, i.e. not %) for each period
    
-   **risk\_level** (`Series`) – A risk level indicator, e.g. VIX.
    
-   **upper** (`float`) – Dates when the risk level is above `upper` will be considered high risk. Dates when the risk level is above `lower` and equal to or below `upper` will be considered medium risk.
    
-   **lower** (`float`) – Dates when the risk level is equal to or below `lower` will be considered low risk.
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – Frequency of the data.
    
-   **benchmark** (`Series` | `None`) – Series indexed by date with benchmark returns (relative, i.e. not %) for each period
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Weights for each instrument and point in time; necessary for turnover calculation
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **metrics** (`list` | `None`) – List of performance metric labels. See `fds.fpe.quant.metrics.Metrics` for a list of supported metrics. If None, will default to all supported metrics.
    
-   **auto** (`bool`) – If `True`, `upper` and `lower` are ignored and low- and high-risk periods are determined by quantiling `risk_level` into three bins.
    

Returns:

dataframe A dataframe with the selected performance metrics

Return type:

perf

fds.fpe.quant.stats.performance\_by\_year(_period\_returns_, _benchmark\=None_, _weights\=None_, _freq\=None_, _epsilon\=0.01_, _metrics\=None_, _include\_full\_period\=True_, _omit\_by\_year\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.performance_by_year "Link to this definition")

Calculates various performance metrics, broken down by year.

Parameters:

-   **period\_returns** (`Series`) – Series indexed by date with returns (relative, i.e. not %) for each period.
    
-   **benchmark** (`Series` | `None`) – Series indexed by date with benchmark returns (relative, i.e. not %) for each period.
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Weights for each instrument and point in time; necessary for turnover calculation.
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – Frequency of the data. If not None will annualized quantities where applicable.
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **metrics** (`list` | `None`) – List of performance metric labels. See `fds.fpe.quant.metrics.Metrics` for a list of supported metrics. If None, will default to all supported metrics.
    
-   **include\_full\_period** (`bool`) – If `True` will append a row with the full period statistics to the DataFrame
    
-   **omit\_by\_year** (`bool`) – If `True` will not actually analyze the returns by year. This allows analysis of only the full period. (It also creates the opportunity to analyze nothing at all and return a completely empty dict, so proceed cautiously.)
    

Returns:

dataframe A dataframe with the selected performance metrics

Return type:

perf

fds.fpe.quant.stats.performance\_last\_n(_period\_returns_, _freq_, _last\=\[1, 2, 5\]_, _benchmark\=None_, _weights\=None_, _epsilon\=0.01_, _metrics\=None_, _include\_full\_period\=True_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.performance_last_n "Link to this definition")

Calculates performance metrics over the last N years as specified.

Parameters:

-   **period\_returns** (`Series`) – Series indexed by date with returns (relative, i.e. not %) for each period
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\]) – Frequency of the data.
    
-   **last** (`list`) – Will calculate performance over the last N years for N in last.
    
-   **benchmark** (`Series` | `None`) – Series indexed by date with benchmark returns (relative, i.e. not %) for each period
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Weights for each instrument and point in time; necessary for turnover calculation
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **metrics** (`list` | `None`) – List of performance metric labels. See `fds.fpe.quant.metrics.Metrics` for a list of supported metrics. If None, will default to all supported metrics.
    
-   **include\_full\_period** (`bool`) – If True will append a row with the full period statistics to the DataFrame
    

Returns:

dataframe A dataframe with the selected performance metrics (rows) vs last N years (columns)

Return type:

last\_n

fds.fpe.quant.stats.performance\_regime(_period\_returns_, _start_, _stop_, _freq\=None_, _benchmark\=None_, _weights\=None_, _epsilon\=0.01_, _metrics\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.performance_regime "Link to this definition")

Calculates pre-, post-crisis, and full period performance for the specified metrics.

Parameters:

-   **period\_returns** (`Series`) – Series indexed by date with returns (relative, i.e. not %) for each period
    
-   **start** (`str`) – A crisis start date in YYYYMMDD format
    
-   **stop** (`str`) – A crisis end date in YYYYMMDD format
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – Frequency of the data.
    
-   **benchmark** (`Series` | `None`) – Series indexed by date with benchmark returns (relative, i.e. not %) for each period
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Weights for each instrument and point in time; necessary for turnover calculation
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **metrics** (`list` | `None`) – List of performance metric labels. See `fds.fpe.quant.metrics.Metrics` for a list of supported metrics. If None, will default to all supported metrics.
    

Returns:

dataframe A dataframe with the selected performance metrics

Return type:

perf

fds.fpe.quant.stats.period\_matrix(_period\_returns_, _scaled\=True_, _freq\='M'_, _orient\='rows'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.period_matrix "Link to this definition")

Produces a period matrix report.

Parameters:

-   **period\_returns** (`Series`) – Period returns data, indexed by date.
    
-   **scaled** (`bool`) – If true, will scale return values by dividing the monthly return by the annualized return volatility for the full period.
    
-   **freq** (`Literal`\[`'M'`\]) – The frequency of the data. Frequencies other than monthly currently not implemented.
    
-   **orient** (`Literal`\[`'columns'`, `'rows'`\]) – When ‘columns’ is selected years will label columns, rows otherwise.
    

Return type:

A styled dataframe with return data by month (columns) for each year (rows).

fds.fpe.quant.stats.qcount(_quantiles_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.qcount "Link to this definition")

Calculates the number of assets per quantile and date.

Parameters:

**quantiles** (`Series`) – Multiindex (date, symbol) series. Quantile labels (int) for each date and symbol.

Return type:

Number of instruments in each quantile per date

fds.fpe.quant.stats.quantile\_performance\_by\_year(_qreturns\=None_, _benchmark\=None_, _qweights\=None_, _freq\=None_, _epsilon\=0.01_, _metrics\=None_, _include\_full\_period\=True_, _omit\_by\_year\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.quantile_performance_by_year "Link to this definition")

Calculates performance metrics, broken down by year and quantile.

Parameters:

-   **qreturns** (`DataFrame` | `None`) – Dataframe indexed by date with returns (relative, i.e. not %) for each period and quantile. Column labels are quantiles.
    
-   **qweights** (`DataFrame` | `None`) – Quantile weights of each instrument at each point in time; necessary for turnover calculation.
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – Frequency of the data. If not None will annualized quantities where applicable.
    
-   **epsilon** (`float`) – Confidence level for VaR and Expected Tail Loss calculation. Should be in \[0., 1.\].
    
-   **metrics** (`list` | `None`) – List of performance metric labels. See `fds.fpe.quant.metrics.Metrics` for a list of supported metrics. If None, will default to all supported metrics.
    
-   **include\_full\_period** (`bool`) – If `True` will append a row with the full period statistics to the DataFrame
    
-   **omit\_by\_year** (`bool`) – If `True` will not actually analyze the returns by year. This allows analysis of only the full period. (It also creates the opportunity to analyze nothing at all and return a completely empty dict, so proceed cautiously.)
    

Returns:

**A nested dict {year**

Return type:

{quantile : {metric : value}}} with the selected performance metrics.

fds.fpe.quant.stats.quantile\_returns(_returns_, _signal\_scores_, _q\=5_, _duplicates\='raise'_, _ascending\=True_, _lowest\=0_, _relative\_weights\=None_, _quantiling\_type\=None_, _favor\=None_, _tie\_resolution\=None_, _q\_weights\=None_, _layer\_on\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.quantile_returns "Link to this definition")

Calculates the returns per quantile. The weights in each quantile are determined by the relative\_weights or are equally weighted if relative\_weights are not provided. Weights are normalized to 1 by quantile.

Parameters:

-   **returns** (`Series`) – Multiindex (date, symbol) series. Returns data for each date and symbol
    
-   **signal\_scores** (`Series`) – Multiindex (date, symbol) series. A pandas series indexed by date and symbol containing signal score data
    
-   **q** (`int`) – Number of quantiles
    
-   **duplicates** (`Literal`\[`'raise'`, `'drop'`\]) – If quantile bin edges are not unique, raise ValueError or drop non-uniques.
    
-   **ascending** (`bool`) – Higher values ranked in the lower quantiles, by default True.
    
-   **lowest** (`int`) – Lowest quantile label. Quantile labels will run from lowest through lowest + q - 1.
    
-   **relative\_weights** (`Series` | `None`) – Multiindex (date, symbol) series. A series to be used to weight the assets in the top and bottom quantiles when ‘quantiles’ mode is selected. If None, asset have equal weight in the given quantiles.
    
-   **quantiling\_type** (`Literal`\[`'inside_out'`, `'outside_in'`, `'histogram'`, `'weighted'`\] | `None`) –
    
    The type of the procedure used to generate the quantiles. Allowed values:
    
    -   ’inside\_out’ : distributes an equal number of securities into each quantile rank and places excess securities into the outside quantile ranks first. Then checks for cross-quantile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’outside\_in’ : distributes an equal number of securities into each quantile rank and places excess securities into the inside quantile ranks first. Then checks for cross-fractile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’histogram’ : Generate quantile assignments based on interval values. Assigns securities to the quantile whose range they fit into. Grouping intervals are determined by: (highest value - lowest value) / number of quantiles (q).
        
    -   ’weighted’ : Assign weights to assets, then distributes equal cumulative weight to each quantile. When ‘weighted’ is selected `q_weights` must be provided.
        
-   **favor** (`Literal`\[`'better'`, `'worse'`\] | `None`) – Must be on of {‘better’, ‘worse’}. When placing extra securities into fractile ranks, determines which quantile get favored first, only relevant for `'inside_out'` and `'outside_in'` quantiling.
    
-   **tie\_resolution** (`Literal`\[`'mid_point'`, `'higher'`, `'lower'`\] | `None`) – Must be one of {‘mid\_point’, ‘higher’, ‘lower’}. Assigns all the items within a cross-quantile tie group to the quantile that the middle/highest/lowest ranked item in the group belongs to.
    
-   **q\_weights** (`Series` | `None`) – Multiindex (date, symbol) series. Required and used only when `quantiling_type='weighted'`. Numerical series assigning weights to each entry when performing weighted quantiling. Index must match that of `signal_scores, returns`
    
-   **layer\_on** (`Series` | `None`) – Multiindex (date, symbol) series. A categorical pandas.Series with an index matching that of `signal_scores, returns`. When this is provided, the assets are split into groups and each group is split into quantiles separately according to the other parameters, then these are combined into the original index. This ensures each group is equally represented in all quantiles.
    

Return type:

A dataframe with quantile returns (columns) indexed by date.

fds.fpe.quant.stats.quantile\_turnover(_qweights\=None_, _quantiles\=None_, _relative\_weights\=None_, _q\=None_, _lowest\=0_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.quantile_turnover "Link to this definition")

Calculates the quantile turnover over time defined as

where is the weight change of instrument _i_ at time _d_ and the sum is over assets a single quantile.

Parameters:

-   **qweights** (`DataFrame` | `None`) – Multiindex (date, symbol) dataframe with quantile weights
    
-   **quantiles** (`Series` | `None`) – Multiindex (date, symbol) series with quantile designation of each stock
    
-   **relative\_weights** (`Series` | `None`) – Multiindex (date, symbol) series. A series to be used to weight the assets in the top and bottom quantiles when ‘quantiles’ mode is selected. If None, asset have equal weight in the given quantiles.
    
-   **q** (`int` | `None`) – Number of quantiles. If `None`, will set the number of quantiles from `quantiles` as q = quantiles.max() + 1
    
-   **lowest** (`int`) – Lowest quantile label. Quantile labels will run from lowest through lowest + q - 1.
    

Returns:

quantile is 1.

Return type:

a dataframe with quantile turnover (columns) indexed by date. The sum of all weights in a

Raises:

**ValueError** – If q is None and the number of quantiles cannot be inferred from quantiles (if e.g. all values in quantiles are NaN)..

fds.fpe.quant.stats.quantiles\_to\_weights(_quantiles_, _relative\_weights\=None_, _q\=None_, _lowest\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.quantiles_to_weights "Link to this definition")

Calculates weights given quantile designations.

Weights within each quantile are normalized to 1 at each point in time so that

Parameters:

-   **quantiles** (`Series`) – Multiindex (date, symbol) series. Quantile designations of each asset at each point in time.
    
-   **relative\_weights** (`Series` | `None`) – Multiindex (date, symbol) series. A series to be used to weight the assets in the top and bottom quantiles when ‘quantiles’ mode is selected. If None, asset have equal weight in the given quantiles.
    
-   **q** (`int` | `None`) – Number of quantiles. If `None`, will infer the number of quantiles from `quantiles` as q = quantiles.max() + 1
    
-   **lowest** (`int` | `None`) – Lowest quantile label. Quantile labels will run from lowest through lowest + q - 1.
    

Return type:

weights of each symbol per date and quantile

Raises:

-   **ValueError** – If q is None and the number of quantiles cannot be inferred from quantiles (if e.g. all values in quantiles are NaN).
    
-   **ValueError** – If q (whether passed explicitly or as inferred) is less than 1.
    

fds.fpe.quant.stats.regression\_statistics(_y_, _X_, _reg\_stats\=None_, _add\_intercept\=True_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.regression_statistics "Link to this definition")

Performs multiple linear regression, with a range of available regression statistics.

Parameters:

-   **y** (`Series`) – Dependent variable / response (asset returns). Index must match that of X.
    
-   **X** (`DataFrame`) – Independent variables / regressors (signal scores). Must not include an intercept (constant column). Index must match that of y.
    
-   **reg\_stats** (`str` | `list` | `None`) –
    
    A list of str, specifying the regression metrics to be returned. Available metrics:
    
    -   `'coefficients'` - the regression coefficients
        
    -   `'se'` - standard error of the regression coefficients
        
    -   `'t_stat'` - T-statistics for regression coefficient
        
    -   `'p_value'` - p-values derived from regression coefficients T-statistics
        
    -   `'cv'` - coefficients of variation (CV) of independent variables / regressors
        
    -   `'r_squared'` - R-squared of the regression
        
    -   `'r_squared_adj'` - adjusted R-squared of the regression
        
    -   `'f_stat'` - F-statistic of the regression, null-hypothesis assumes 0 regression coefficients for all independent variables
        
    -   `'f_p_value'` - p-value derived from the F-statistic of the regression
        
    -   `'aic'` - Akaike Information Criterion (AIC)
        
    -   `'bic'` - Bayesian Information Criterion (BIC)
        
    -   `'reg_dof'` - Regression degrees of freedom
        
    -   `'msr'` - Mean Square Regression (MSR)
        
    -   `'sse'` - Sum of Square Errors/Residuals (SSE)
        
    -   `'resid_dof'` - residual degrees of freedom
        
    -   `'mse'` - Mean Square Error (MSE)
        
    -   `'resid_se'` - residuals standard error
        
    -   `'sst'` - Total Sum of Squares (SST)
        
    -   `'total_dof'` - total degrees of freedom
        
    -   `'mean_response'` - mean of the response When left as `None`, the following stats will be returned: `['coefficients', 'se', 't_stat', 'p_value', 'r_squared', 'r_squared_adj', 'f_stat']`
        
-   **add\_intercept** (`bool`) – Whether to add an intercept to the regression model
    

Return type:

a single row dataframe containing the specified regression stats

fds.fpe.quant.stats.returns\_tstat(_returns_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.returns_tstat "Link to this definition")

Calculates the t-statistic of a returns time-series.

mean(returns)/std(returns)\*sqrt(n-1)

where n is the length of the returns time-series.

Parameters:

**returns** (`Series`) – returns time-series

Return type:

float

fds.fpe.quant.stats.rolling\_beta(_period\_returns_, _benchmark_, _window\_length_, _min\_periods\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.rolling_beta "Link to this definition")

Get rolling beta time-series.

Parameters:

-   **period\_returns** (`Series`) – Dependent variable
    
-   **benchmark** (`Series`) – Independent variable
    
-   **window\_length** (`int`) – Size of the rolling window, i.e. number of observations used for calculating the beta
    
-   **min\_periods** (`int` | `None`) – Minimum number of observations needed to calculate a value, min\_periods <= window\_length
    

Returns:

each value is the beta calculated over a subset Number of observations between window\_length and min\_periods

Return type:

pandas Series

fds.fpe.quant.stats.rolling\_ir(_period\_returns_, _benchmark_, _window\_length_, _min\_periods\=None_, _freq\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.rolling_ir "Link to this definition")

Get rolling IR time-series.

Parameters:

-   **period\_returns** (`Series`) – Returns data
    
-   **benchmark** (`Series`) – Benchmark returns data
    
-   **window\_length** (`int`) – Size of the rolling window, i.e. number of observations used for calculating the IR
    
-   **min\_periods** (`int` | `None`) – Minimum number of observations needed to calculate a value, min\_periods <= window\_length
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – The frequency of the data. If not `None` will annualize the result.
    

Returns:

pandas Series rolling IR

Return type:

ir

fds.fpe.quant.stats.rolling\_sharpe(_period\_returns_, _window\_length_, _freq\=None_, _rfr\=0.0_, _min\_periods\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.rolling_sharpe "Link to this definition")

Get rolling Sharpe ratio time-series.

Parameters:

-   **period\_returns** (`Series`) – pandas series indexed by date with returns for each period as fraction of previous value (i.e. not in percent)
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – The frequency of the data. If not None will annualize the result by multiplying by where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.)
    
-   **rfr** (`float` | `Series`) – Risk free rate, scaled to match returns data frequency (i.e. annual if annual returns are provided, etc.)
    
-   **window\_length** (`int`) – Size of the rolling window, i.e. number of observations used for calculating the Sharpe ratio
    
-   **min\_periods** (`int` | `None`) – Minimum number of observations needed to calculate a value, min\_periods <= window\_length
    

Returns:

Each value is the Sharpe ratio calculated over a subset Number of observations between window\_length and min\_periods

Return type:

pandas Series

fds.fpe.quant.stats.rolling\_volatility(_period\_returns_, _window\_length_, _freq\=None_, _min\_periods\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.rolling_volatility "Link to this definition")

Get rolling volatility (standard deviation) time-series.

Parameters:

-   **period\_returns** (`Series`) – Returns time-series
    
-   **freq** (`str` | `None`) – The frequency of the data annual \[‘A’, ‘Y’, ‘annual’, ‘yearly’\] quarterly \[‘Q’, ‘quarterly’\] monthly \[‘M’, ‘monthly’\] daily \[‘D’, ‘daily’\]
    
-   **window\_length** (`int`) – Size of the rolling window, i.e. number of observations used for calculating the volatility
    
-   **min\_periods** (`int` | `None`) – minimum number of observations needed to calculate a value, min\_periods <= window\_length
    

Returns:

Each value is the volatility calculated over a subset Number of observations between window\_length and min\_periods

Return type:

pandas Series

fds.fpe.quant.stats.score(_df_, _apply\_to\=None_, _additional\_levels\=None_, _central\_measure\='mean'_, _dispersion\_measure\='stdev'_, _across\='assets'_, _ret\_only\_score\_cols\=False_, _consider\_ison\=True_, _ison\_column\='ison\_univ'_, _weights\=None_, _w\_median\_type\='lower'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.score "Link to this definition")

Calculate the standardized score for selected columns of a DataFrame

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Containing the data to be scored, optionally also grouping and ison\_universe columns
    
-   **apply\_to** (`str` | `list` | `None`) – determines the columns for which are to be converted to scores, if None all columns are scored
    
-   **additional\_levels** (`str` | `Series` | `list` | `None`) – specify either a column from df (by heading) or a separate pandas Series, or a list of containing either of these (can be mixed, e.g. \[‘col\_1\_name’, series\_2\]) that specify additional levels of grouping when scoring, e.g. group by sector or subindustry instead of across the whole universe of assets when calculating the central and dispersion measures to normalise to
    
-   **central\_measure** (`Literal`\[`'mean'`, `'median'`\]) – determines the central measure used when scoring, either of \[‘mean’, ‘median’\]
    
-   **dispersion\_measure** (`Literal`\[`'stdev'`, `'median_abs_deviation'`\]) – determines if the scores are to be calculated by using the standard deviation or the median absolute deviation, either of \[‘stdev’, ‘median\_abs\_deviation’\]
    
-   **across** (`Literal`\[`'assets'`, `'time'`\]) – determines if scores are to be calculated across time or across assets, either of \[‘assets’, ‘time’\]
    
-   **ret\_only\_score\_cols** (`bool`) – determines whether only the modified columns are returned or the entire DataFrame.
    
-   **consider\_ison** (`bool`) – when True, rows corresponding to assets not on the universe will be dropped
    
-   **ison\_column** (`str` | `Series`) – either the name of the column containing the ison\_universe data (dtype=bool) in df or a pandas Series containing the ison\_universe data
    
-   **weights** (`Series` | `None`) – Multiindex (date, symbol) series. Pandas series containing the weights of the assets for the different periods.
    
-   **w\_median\_type** (`Literal`\[`'lower'`, `'upper'`, `'average'`\]) – Applicable only if weighted median or median absolute deviation are used. Determines which type of weighted median is calculated. One of \[‘lower’, ‘upper’, ‘average’\].
    

Return type:

dataframe with the chosen columns converted to scores

fds.fpe.quant.stats.scores\_to\_quantiles(_signal\_scores_, _q\=5_, _duplicates\='raise'_, _ascending\=True_, _lowest\=0_, _quantiling\_type\=None_, _favor\=None_, _tie\_resolution\=None_, _q\_weights\=None_, _layer\_on\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.scores_to_quantiles "Link to this definition")

Determines stock quantiles based on signal\_scores and the selected number of quantiles q.

Parameters:

-   **signal\_scores** (`Series`) – Multiindex (date, symbol) series. A pandas series containing signal score data
    
-   **q** (`int`) – number of quantiles
    
-   **duplicates** (`Literal`\[`'raise'`, `'drop'`\]) – if quantile bin edges are not unique, raise ValueError or drop non-uniques.
    
-   **ascending** (`bool`) – Higher values ranked in the lower quantiles, by default True.
    
-   **lowest** (`int`) – Lowest quantile label. Quantile labels will run from lowest through lowest + q - 1.
    
-   **quantiling\_type** (`Literal`\[`'inside_out'`, `'outside_in'`, `'histogram'`, `'weighted'`\] | `None`) –
    
    The type of the procedure used to generate the quantiles. Allowed values:
    
    -   ’inside\_out’ : distributes an equal number of securities into each quantile rank and places excess securities into the outside quantile ranks first. Then checks for cross-quantile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’outside\_in’ : distributes an equal number of securities into each quantile rank and places excess securities into the inside quantile ranks first. Then checks for cross-fractile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’histogram’ : Generate quantile assignments based on interval values. Assigns securities to the quantile whose range they fit into. Grouping intervals are determined by: (highest value - lowest value) / number of quantiles (q).
        
    -   ’weighted’ : Assign weights to assets, then distributes equal cumulative weight to each quantile. When ‘weighted’ is selected `q_weights` must be provided.
        
-   **favor** (`Literal`\[`'better'`, `'worse'`\] | `None`) – Must be on of {‘better’, ‘worse’}. When placing extra securities into fractile ranks, determines which quantile get favored first, only relevant for `'inside_out'` and `'outside_in'` quantiling.
    
-   **tie\_resolution** (`Literal`\[`'mid_point'`, `'higher'`, `'lower'`\] | `None`) – Must be one of {‘mid\_point’, ‘higher’, ‘lower’}. Assigns all the items within a cross-quantile tie group to the quantile that the middle/highest/lowest ranked item in the group belongs to.
    
-   **q\_weights** (`Series` | `None`) – Multiindex (date, symbol) series. Required and used only when `quantiling_type='weighted'`. Numerical series assigning weights to each entry when performing weighted quantiling. Index must match that of `signal_scores`
    
-   **layer\_on** (`Series` | `None`) – Multiindex (date, symbol) series. A categorical pandas.Series with an index matching that of `signal_scores`. When this is provided, the assets are split into groups and each group is split into quantiles separately according to the other parameters, then these are combined into the original index. This ensures each group is equally represented in all quantiles.
    

Return type:

(date, symbol) multiindex dataframe with quantile designation of each stock

fds.fpe.quant.stats.sharpe(_period\_returns_, _freq\=None_, _rfr\=0.0_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.sharpe "Link to this definition")

Calculates the Sharpe ratio from a returns time series and the risk-free rate.

Parameters:

-   **period\_returns** (`Series`) – pandas series indexed by date with returns for each period as fraction of previous value (i.e. not in percent)
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – The frequency of the data. If not None will annualize the result by multiplying by where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.)
    
-   **rfr** (`float` | `Series`) – Risk free rate, scaled to match returns data frequency (i.e. annual if annual returns are provided, etc.)
    

Returns:

float

Return type:

Sharpe ratio

fds.fpe.quant.stats.signal\_autocorrelation(_scores_, _shift_, _method\='spearman'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.signal_autocorrelation "Link to this definition")

Calculates signal autocorrelation over time.

R(t) = corr(scores(t), scores(t-shift))

Parameters:

-   **scores** (`Series`) – Multiindex (date, symbol) series. Signal scores.
    
-   **shift** (`int`) – At each date will calculate the correlation to scores at date - `shift` periods.
    
-   **method** (`Literal`\[`'spearman'`, `'pearson'`, `'kendall'`\]) – The method used to calculate the correlation.
    

Return type:

Autocorrelation by date.

fds.fpe.quant.stats.signal\_correlation(_scores1_, _scores2_, _method\='spearman'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.signal_correlation "Link to this definition")

Calculates the cross-sectional correlation between `scores1` and `scores2` over time.

Parameters:

-   **scores1** (`Series`) – Multiindex (date, symbol) series. Signal scores indexed by date and symbol.
    
-   **scores2** (`Series`) – Multiindex (date, symbol) series. Signal scores indexed by date and symbol.
    
-   **method** (`Literal`\[`'spearman'`, `'pearson'`, `'kendall'`\]) – The method used to calculate the correlation.
    

Return type:

Correlation by indexed by date.

fds.fpe.quant.stats.sma(_s_, _window_, _min\_periods\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.sma "Link to this definition")

Calculates a simple moving average over window periods.

Parameters:

-   **s** (`Series`) – Multiindex (date, symbol) series. Data
    
-   **window** (`int`) – Number of periods for the rolling average
    
-   **min\_periods** (`int` | `None`) – Minimum number of observations in window required to have a value (otherwise result is NA). If `None`, min\_periods will default to the size of the window.
    

Return type:

window\-period moving average

fds.fpe.quant.stats.smooth(_df_, _apply\_to\=None_, _method\='simple'_, _window\=None_, _min\_periods\=None_, _halflife\=None_, _ret\_only\_smoothed\_cols\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.smooth "Link to this definition")

Smooth the values in selected columns of a DataFrame.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Containing the data to be smoothed, optionally also grouping and ison\_universe columns
    
-   **apply\_to** (`str` | `list` | `None`) – determines the columns for which are to be converted to be smoothed, if None all columns are smoothed
    
-   **method** (`Literal`\[`'simple'`, `'exponential'`\]) – If ‘simple’, calculate a simple moving average with a specified window. If ‘exponential’, calculate an exponentially weighted moving average with a specified halflife.
    
-   **window** (`int` | `None`) – Must be provided if method is ‘simple’. Number of periods for the rolling average.
    
-   **min\_periods** (`int` | `None`) – Applicable only if method is ‘simple’. Minimum number of observations in window required to have a value (otherwise result is NA). If `None`, min\_periods will default to the size of the window.
    
-   **halflife** (`int` | `None`) – Must be provided if method is ‘exponential’. Specifies the decay in terms of half-life in number of periods. (e.g. 250 for a half-life of 1 year given daily data)
    
-   **ret\_only\_smoothed\_cols** (`bool`) – determines whether only the modified columns are returned or the entire DataFrame.
    

Return type:

dataframe with smoothed columns

fds.fpe.quant.stats.spread\_returns(_quantile\_returns_, _ascending\=True_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.spread_returns "Link to this definition")

Computes the top-bottom quantile spread returns time-series from quantile returns time-series data.

Parameters:

-   **quantile\_returns** (`DataFrame`) – Quantile returns time-series data for a single signal. Column labels (int) correspond to quantiles. Indexed by date.
    
-   **ascending** (`bool`) – If True, assumes that top-ranked assets are in the quantile with the lowest label and returns the difference quantile\_returns\[q\_min\] - quantile\_returns\[q\_max\]. Otherwise the sign is fipped: (quantile\_returns\[q\_max\] - quantile\_returns\[q\_min\]).
    

Return type:

spread returns over time

fds.fpe.quant.stats.tracking\_error(_returns_, _benchmark_, _freq\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.tracking_error "Link to this definition")

Calculates the volatility (standard deviation) of the difference between returns and benchmark.

Parameters:

-   **returns** (`Series`) – returns time-series
    
-   **benchmark** (`Series`) – benchmark returns time-series
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – the frequency of the data. If not None will annualize the result by multiplying by :math: sqrt{N} where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.) annual \[‘A’, ‘Y’, ‘annual’, ‘yearly’\] quarterly \[‘Q’, ‘quarterly’\] monthly \[‘M’, ‘monthly’\] daily \[‘D’, ‘daily’\]
    

Return type:

volatility

fds.fpe.quant.stats.trim\_outliers\_by\_percentile(_df_, _lower\_percentile_, _upper\_percentile_, _apply\_to\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.trim_outliers_by_percentile "Link to this definition")

Trim the upper and lower outlier values by percentile. Set the lower\_percentile of the values to the largest of them, and set the upper\_percentile of the values to the smallest of them.

This has a similar effect as ‘nwinsorize’, but uses fractions, rather than by standard deviation. For example, ‘nwinsorize’ with 2 stdevs will have a similar effect as ‘trim\_outliers\_by\_percentile’ with 2, 98.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Data to be trimmed
    
-   **lower\_percentile** (`float`) – percentile of the data series (between 0 and 50), that will be trimmed (set of their largest value)
    
-   **upper\_percentile** (`float`) – percentile of the data series (between 50 and 100), that will be trimmed (set of their smallest value)
    
-   **apply\_to** (`list` | `dict` | `None`) – determines the columns which are to be trimmed, (all columns trimmed must be numeric data) if None all columns are trimmed
    

Return type:

trimmed data in the chosen columns

fds.fpe.quant.stats.turnover(_weights_, _norm\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.turnover "Link to this definition")

Calculates turnover vs. time as:

where is the weight change of instrument _i_ at time _d_.

Parameters:

-   **weights** (`Series`) – Multiindex (date, symbol) series. Weights data by date and symbol.
    
-   **norm** (`bool` | `float`) – If not False will normalize the sum of the absolute values of the weights to norm before calculating turnover. The normalization will be such that at each date . norm=True is equivalent to norm=1.
    

Returns:

pandas series Amount traded at each rebalance. Note: the artifical zero on the first date is truncated. This means that the number of dates in the returned series is one less than in the original weights series.

Return type:

daily\_trade

fds.fpe.quant.stats.var(_period\_returns_, _epsilon_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.var "Link to this definition")

Get Value-at-Risk (VaR).

Parameters:

-   **period\_returns** (`Series`) – Returns time-series
    
-   **epsilon** (`float`) – Probability (0 <= epsilon <= 1) used for the confidence level, (1 - epsilon)%
    

Returns:

float

Return type:

Value at risk

fds.fpe.quant.stats.volatility(_period\_returns_, _freq\=None_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.volatility "Link to this definition")

Calculates volatility (standard deviation) from a returns time series.

Parameters:

-   **period\_returns** (`Series`) – Returns time-series
    
-   **freq** (`Literal`\[`'A'`, `'Q'`, `'M'`, `'D'`\] | `None`) – The frequency of the data. If not None will annualize the result by multiplying by where is the number of periods per year for the respective frequency (e.g. 252 for daily, 12 for monthly, etc.) annual \[‘A’, ‘Y’, ‘annual’, ‘yearly’\] quarterly \[‘Q’, ‘quarterly’\] monthly \[‘M’, ‘monthly’\] daily \[‘D’, ‘daily’\]
    

Returns:

float

Return type:

volatility

fds.fpe.quant.stats.weighted\_mean(_data_, _weights_, _axis\=0_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.weighted_mean "Link to this definition")

Return the mean of the values weighted by the specified weights.

Parameters:

-   **data** (`Series` | `DataFrame`) – Data for which the mean is calculated.
    
-   **weights** (`Series`) – Weights related to the data.
    
-   **axis** (`int`) – Axis for the function to be applied on. For Series this parameter is unused.
    

Return type:

Weighted mean of the values weighted by the specified weights.

fds.fpe.quant.stats.weighted\_median(_data_, _weights_, _w\_median\_type\='lower'_, _axis\=0_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.weighted_median "Link to this definition")

Return the median of the values weighted by the specified weights.

Parameters:

-   **data** (`Series` | `DataFrame`) – Data for which the median is calculated.
    
-   **weights** (`Series`) – Weights related to the data.
    
-   **w\_median\_type** (`Literal`\[`'lower'`, `'upper'`, `'average'`\]) – Determines which type of weighted median is calculated. Either of \[‘lower’, ‘upper’, ‘average’\].
    
-   **axis** (`int`) – Axis for the function to be applied on. For Series this parameter is unused.
    

Return type:

Weighted median of the values weighted by the specified weights.

fds.fpe.quant.stats.weighted\_median\_abs\_deviation(_data_, _weights_, _w\_median\_type\='lower'_, _axis\=0_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.weighted_median_abs_deviation "Link to this definition")

Return the median absolute deviation of the values weighted by the specified weights.

Parameters:

-   **data** (`Series` | `DataFrame`) – Data for which the median absolute deviation is calculated.
    
-   **weights** (`Series`) – Weights related to the data.
    
-   **w\_median\_type** (`Literal`\[`'lower'`, `'upper'`, `'average'`\]) – Determines which type of weighted median is calculated. Either of \[‘lower’, ‘upper’, ‘average’\].
    
-   **axis** (`int`) – Axis for the function to be applied on. For Series this parameter is unused.
    

Return type:

median absolute deviation of the values weighted by the specified weights.

fds.fpe.quant.stats.weighted\_std(_data_, _weights_, _axis\=0_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.weighted_std "Link to this definition")

Return the standard deviation of the values weighted by the specified weights.

Parameters:

-   **data** (`Series` | `DataFrame`) – Data for which the standard deviation is calculated.
    
-   **weights** (`Series`) – Weights related to the data.
    
-   **axis** (`int`) – Axis for the function to be applied on. For Series this parameter is unused.
    

Return type:

Weighted standard deviation of the values weighted by the specified weights.

fds.fpe.quant.stats.winsorize(_df_, _apply\_to\=None_, _method\='percentile'_, _percentile\_limits\=(0.01, 0.01)_, _iqr\_percentiles\=(25.0, 75.0)_, _iqr\_multiples\=(1.5, 1.5)_, _gauss\_stdev\_limits\=(3.0, 3.0)_, _mad\_limits\=(3.0, 3.0)_, _n\_passes\=1_, _across\='assets'_, _additional\_levels\=None_, _ret\_only\_wins\_cols\=False_, _consider\_ison\=True_, _ison\_column\='ison\_univ'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.winsorize "Link to this definition")

Winsorize the data in the selected columns of the DataFrame.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Data to be winsorized
    
-   **apply\_to** (`str` | `list` | `None`) – determines the columns which are to be winsorized, if None all columns are winsorized
    
-   **method** (`Literal`\[`'percentile'`, `'interquartile'`, `'gaussian'`, `'median_abs_deviation'`\]) – the method to use for winsorization. Options: ‘interquartile’, ‘gaussian’, ‘percentile’, ‘median\_abs\_deviation’. interquartile: Interquartile range winsorization with lower bound equal to the lower percentile specified in iqr\_percentiles minus the first multiple specified in iqr\_multiples multiplied by the interquartile range and upper bound equal to the upper percentile specified in iqr\_percentiles plus the second multiple specified in iqr\_multiples multiplied by the interquartile range. gaussian: Gaussian winsorization with lower bound equal to the mean minus the first value of gauss\_stdev\_limits times the standard deviation and upper bound equal to the mean plus the second value of gauss\_stdev\_limits times the standard deviation. percentile: The lower and upper bounds are taken from the percentile\_limits parameter. median\_abs\_deviation: Median Absolute Deviation winsorization with lower bound equal to the median minus the first value of mad\_limits times the median absolute deviation and upper bound equal to the median plus the second value of mad\_limits times the median absolute deviation.
    
-   **percentile\_limits** (`tuple`) – applicable if method=’percentile’ determines the lower and upper bounds for the percentile winsorization method
    
-   **iqr\_percentiles** (`tuple`) – applicable if method=’interquartile’ determines the percentiles used to calculate the interquartile ranges
    
-   **iqr\_multiples** (`tuple`) – applicable if method=’interquartile’ determines the multiples that scale the interquartile range values and are used as lower and upper values in the winsorization
    
-   **gauss\_stdev\_limits** (`tuple`) – applicable if method=’gaussian’ determines the distance from the mean in terms of standard deviations beyond which the values are winsorized
    
-   **mad\_limits** (`tuple`) – applicable if method=’median\_abs\_deviation’ determines the distance from the median in terms of median absolute deviations beyond which the values are winsorized
    
-   **n\_passes** (`int`) – number of consecutively applied winsorizations
    
-   **across** (`Literal`\[`'assets'`, `'time'`\]) – determines if the winsorization is applied across time or across assets, either of \[‘assets’, ‘time’\]
    
-   **additional\_levels** (`str` | `Series` | `list` | `None`) – specify either a column from df (by heading) or a separate pandas Series, or a list of containing either of these (can be mixed, i.e. \[‘col\_1\_name’, series\_2\]) that specify additional levels of grouping when winsorizing, e.g. group by sector or subindustry instead of across the whole universe of assets
    
-   **ret\_only\_wins\_cols** (`bool`) – when True, a dataframe containing only the winsorized columns specified in apply\_to is returned
    
-   **consider\_ison** (`bool`) – when True, rows corresponding to assets not on the universe will be dropped
    
-   **ison\_column** (`str` | `Series`) – either the name of the column containing the ison\_universe data (dtype=bool) in df or a pandas Series containing the ison\_universe data
    

Return type:

data with the chosen columns winsorized

fds.fpe.quant.stats.winsorize\_by(_df_, _stdev\_limit_, _n\_passes_, _columns\=None_, _by\='symbol'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.winsorize_by "Link to this definition")

Performs either time-series or cross-sectional winsorization on selected columns from DataFrame.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Data to be winsorised
    
-   **stdev\_limit** (`float`) – Standard deviations away from the mean of each data series, used to set the upper and lower limit for the winsorization
    
-   **n\_passes** (`int`) – Number of consecutively applied winsorizations
    
-   **columns** (`list` | `None`) – Determines the columns which are to be winsorized, if None all columns are winsorized
    
-   **by** (`Literal`\[`'symbol'`, `'date'`\]) – Determines how data is grouped before the winsorization is applied. either of \[‘symbol’, ‘date’\]
    

Return type:

Winsorized data in the chosen columns

fds.fpe.quant.stats.zscore(_df_, _apply\_to\=None_, _across\='assets'_, _additional\_levels\=None_, _centered\_at\='median'_, _ret\_only\_zscore\_cols\=False_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.zscore "Link to this definition")

Calculate the z-score for selected columns of a DataFrame

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Containing the data to be scored
    
-   **apply\_to** (`list` | `dict` | `None`) – determines the columns for which are to be converted to z-score, if None all columns are scored
    
-   **across** (`Literal`\[`'assets'`, `'time'`\]) – determines if z-scores are to be calculated across time or across assets, either of \[‘assets’, ‘time’\]
    
-   **additional\_levels** (`list` | `None`) – determines additional columns to be used as grouping criteria in determining the z-scores
    
-   **centered\_at** (`Literal`\[`'median'`, `'mean'`\]) – determines if z-scores are to be calculated by using the mean or median either of \[‘median’, ‘mean’\]
    
-   **ret\_only\_zscore\_cols** (`bool`) – Determines whether only the modified columns are returned or the entire DataFrame.
    

Return type:

Data converted to z-scores in the chosen columns.

fds.fpe.quant.stats.zscore\_by(_df_, _columns\=None_, _by\='symbol'_)[#](https://fpe.factset.com/docs/stats.html#fds.fpe.quant.stats.zscore_by "Link to this definition")

Takes data in DataFrame and returns the corresponding z-scores.

Parameters:

-   **df** (`DataFrame`) – Multiindex (date, symbol) dataframe. Data to be winsorised
    
-   **columns** (`list` | `dict` | `None`) – Determines the columns for which are to be converted to z-score, if None all columns are winsorized
    
-   **by** (`Literal`\[`'symbol'`, `'date'`\]) – Determines how data is grouped before the winsorization is applied. either of \[‘symbol’, ‘date’\]
    

Return type:

Data converted to z-scores in the chosen columns
