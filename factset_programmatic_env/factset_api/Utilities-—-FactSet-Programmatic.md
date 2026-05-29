---
created: 2026-05-11T13:05:54 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/utils.html
author: 
---

# Utilities — FactSet Programmatic

> ## Excerpt
> The following utilities are useful for data visualization and ranking.

---
The following utilities are useful for data visualization and ranking.

## Line Plot[#](https://fpe.factset.com/docs/utils.html#line-plot "Link to this heading")

fds.fpe.quant.utils.lineplot(_series_, _labels\=None_, _figsize\=None_, _xlabel\='Date'_, _ylabel\=None_, _title\=None_, _err\_style\='band'_, _estimator\='mean'_, _ci\=95_, _filename\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/utils.html#fds.fpe.quant.utils.lineplot "Link to this definition")

Plot a series using seaborn.lineplot

Parameters:

-   **series** (_Series_) – The series to plot.
    
-   **labels** (_list__,_ _optional_) – List of series labels, by default None.
    
-   **figsize** (_tuple__(__width__,_ _height__)_ _in inches__,_ _optional_) – Width and height of the figure, by default None.
    
-   **xlabel** (_str__,_ _optional_) – Label for the x axis, by default ‘Date’.
    
-   **ylabel** (_str__,_ _optional_) – Label for the y axis, by default None.
    
-   **title** (_str__,_ _optional_) – Title for the plot, by default None.
    
-   **err\_style** (_'band_ _or_ _'bars'__,_ _optional_) – Whether to draw the confidence intervals with translucent error bands or discrete error bars by default ‘band’
    
-   **estimator** (_name_ _of_ _pandas method_ _or_ _callable_ _or_ _None__,_ _optional_) – Method for aggregating across multiple observations of the y variable at the same x level. If None, all observations will be drawn, by default ‘mean’.
    
-   **ci** (_int_ _or_ _'sd'__,_ _optional_) – Size of the confidence interval to draw when aggregating with an estimator. ‘sd’ means to draw the standard deviation of the data, by default 95.
    
-   **filename** (_str__,_ _optional_) – Name of the file for saving the visualization. For example, ‘lineplot.png’. By default None.
    
-   **kwargs** (_key__,_ _value mappings__,_ _optional_) – Other keyword arguments are passed down to seaborn.lineplot.
    

Returns:

Axes that allow for further customization/manipulation of the plot.

Return type:

Matplotlib Axes

## Quantile[#](https://fpe.factset.com/docs/utils.html#quantile "Link to this heading")

fds.fpe.quant.utils.qcut(_x_, _q\=5_, _ascending\=False_, _duplicates\='raise'_, _quantiling\_type\=None_, _favor\=None_, _tie\_resolution\=None_, _q\_weights\=None_, _layer\_on\=None_)[#](https://fpe.factset.com/docs/utils.html#fds.fpe.quant.utils.qcut "Link to this definition")

Quantile-based discretization function for a Series. Discretize variable into equal-sized buckets based on rank or based on sample quantiles. For example 1000 values for 10 quantiles would produce a Categorical object indicating quantile membership for each data point, with the quantiles labeled 1 through 10.

NOTE: This function assumes that your series is indexed at the highest level by time period, and will quantile each period separately.

Parameters:

-   **x** (_Series_) – The Series to quantile.
    
-   **q** (_int__,_ _optional_) – Number of quantiles. 10 for deciles, 4 for quartiles, etc. Alternately array of quantiles, e.g. \[0, .25, .5, .75, 1\] for quartiles, by default 5.
    
-   **ascending** (_bool__,_ _optional_) – Higher values ranked in the lower quantiles, by default False.
    
-   **duplicates** (_'raise'__,_ _'drop'__,_ _optional_) – If bin edges are not unique, raise ValueError or drop non-uniques when constructing bins. By default, ‘raise’.
    
-   **quantiling\_type** (_str__,_ _default 'inside\_out'_) –
    
    The type of the procedure used to generate the quantiles. Allowed values:
    
    -   ’inside\_out’ : distributes an equal number of securities into each quantile rank and places excess securities into the outside quantile ranks first. Then checks for cross-quantile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’outside\_in’ : distributes an equal number of securities into each quantile rank and places excess securities into the inside quantile ranks first. Then checks for cross-fractile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’histogram’ : Generate quantile assignments based on interval values. Assigns securities to the quantile whose range they fit into. Grouping intervals are determined by: (highest value - lowest value) / number of quantiles (q).
        
    -   ’weighted’ : Assign weights to items in `x`, then distributes equal cumulative weight to each quantile. When ‘weighted’ is selected `q_weights` must be provided.
        
-   **favor** (_str__,_ _default 'worse'_) – Must be on of {‘better’, ‘worse’}. When placing extra securities into fractile ranks, determines which quantile get favored first, only relevant for `'inside_out'` and `'outside_in'` quantiling.
    
-   **tie\_resolution** (_str__,_ _default 'mid\_point'_) – Must be one of {‘mid\_point’, ‘higher’, ‘lower’}. Assigns all the items within a cross-quantile tie group to the quantile that the middle/highest/lowest ranked item in the group belongs to.
    
-   **q\_weights** (_pandas.Series__,_ _default None_) – Required and used only when `quantiling_type='weighted'`. Numerical series assigning weights to each entry when performing weighted quantiling. Index must match that of `x`
    
-   **layer\_on** (_pandas.Series__,_ _default None_) – A categorical pandas.Series with an index matching that of `x`. When this is provided, `x` is split into groups and each group is split into quantiles separately according to the other parameters, then these are combined into the original index. This ensures each group is equally represented in all quantiles.
    

## Quantile (Multiple Factors)[#](https://fpe.factset.com/docs/utils.html#quantile-multiple-factors "Link to this heading")

fds.fpe.quant.utils.qcuts(_df_, _columns\=\[\]_, _q\=5_, _ascending\=False_, _duplicates\='raise'_, _inplace\=False_, _quantiling\_type\=None_, _favor\=None_, _tie\_resolution\=None_)[#](https://fpe.factset.com/docs/utils.html#fds.fpe.quant.utils.qcuts "Link to this definition")

Quantile-based discretization function applied to multiple columns in a DataFrame. Discretize variable into equal-sized buckets based on rank or based on sample quantiles. For example 1000 values for 10 quantiles would produce a Categorical object indicating quantile membership for each data point, with the quantiles labeled 1 through 10.

NOTE: This function assumes that your dataframe is indexed at the highest level by time period, and will quantile each period separately.

Parameters:

-   **df** (_DataFrame_) – The DataFrame containing the columns to be quantiled.
    
-   **columns** (_list__,_ _optional_) – List of columns to quantile, by default \[\].
    
-   **q** (_int__,_ _optional_) – Number of quantiles. 10 for deciles, 4 for quartiles, etc. Alternately array of quantiles, e.g. \[0, .25, .5, .75, 1\] for quartiles, by default 5.
    
-   **ascending** (_bool__,_ _optional_) – Higher values ranked in the lower quantiles, by default False.
    
-   **duplicates** (_'raise'__,_ _'drop'__,_ _optional_) – If bin edges are not unique, raise ValueError or drop non-uniques when constructing bins. By default, ‘raise’.
    
-   **inplace** (_bool__,_ _optional_) – Whether to return a new DataFrame. If True then value of copy is ignored, by default False.
    
-   **quantiling\_type** (_str__,_ _default 'inside\_out'_) –
    
    The type of the procedure used to generate the quantiles. Allowed values:
    
    -   ’inside\_out’ : distributes an equal number of securities into each quantile rank and places excess securities into the outside quantile ranks first. Then checks for cross-quantile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’outside\_in’ : distributes an equal number of securities into each quantile rank and places excess securities into the inside quantile ranks first. Then checks for cross-fractile ties and reassignments are made based on the specified `tie_resolution` policy selected.
        
    -   ’histogram’ : Generate quantile assignments based on interval values. Assigns securities to the quantile whose range they fit into. Grouping intervals are determined by: (highest value - lowest value) / number of quantiles (q).
        
    -   ’weighted’ : Assign weights to items in `series`, then distributes equal cumulative weight to each quantile. When ‘weighted’ is selected `q_weights` must be provided.
        
-   **favor** (_str__,_ _default 'worse'_) – Must be on of {‘better’, ‘worse’}. When placing extra securities into fractile ranks, determines which quantile get favored first, only relevant for `'inside_out'` and `'outside_in'` quantiling.
    
-   **tie\_resolution** (_str__,_ _default 'mid\_point'_) – Must be one of {‘mid\_point’, ‘higher’, ‘lower’}. Assigns all the items within a cross-quantile tie group to the quantile that the middle/highest/lowest ranked item in the group belongs to.
    

Returns:

A copy of the input dataframe is returned only if inplace is False.

Return type:

DataFrame

## Targets[#](https://fpe.factset.com/docs/utils.html#targets "Link to this heading")

fds.fpe.quant.utils.targets(_df_, _columns_, _shifts_, _inplace\=False_)[#](https://fpe.factset.com/docs/utils.html#fds.fpe.quant.utils.targets "Link to this definition")

Target analysis applied to multiple columns in a DataFrame.

Shift target columns forward using the provided number of period shifts. Each target will result in a forward value and a forward cumulative value for each shift.

Parameters:

-   **df** (_DataFrame_) – The DataFrame containing the columns to be used as targets.
    
-   **columns** (_list_) – List of columns for target analysis, by default \[\]
    
-   **shifts** (_list_) – List of int values used to shift targets, by default \[\]
    
-   **inplace** (_bool__,_ _optional_) – Whether to return a new DataFrame. If True then target columns will be added to the input DataFrame. If False, a DataFrame is returned containing the additional target columns.
    

Returns:

A copy of the input dataframe is returned only if inplace is False.

Return type:

DataFrame

Raises:

**ValueError** – If your dataframe’s index is not \[‘date’, ‘symbol’\].

## NA[#](https://fpe.factset.com/docs/utils.html#na "Link to this heading")

fds.fpe.quant.utils.na(_df_, _option\='drop'_, _axis\=0_, _how\='any'_, _thresh\=None_, _subset\=None_, _value\=None_, _method\=None_, _limit\=None_)[#](https://fpe.factset.com/docs/utils.html#fds.fpe.quant.utils.na "Link to this definition")

Helper function to handle NaN values which replicates AT options with some additional methods.

Parameters:

-   **df** (_DataFrame_) – The DataFrame for which to handle NaN values.
    
-   **option** (_str__,_ _{‘drop’__,_ _‘fill’}__,_ _default ‘drop’_) – The way in which you want to handle NaN data.
    
-   **axis** (_int__,_ _{0_ _or_ _‘index’__,_ _1_ _or_ _‘columns’}__,_ _default 0_) – If ‘drop’ is selected as option, determine if rows or columns which contain missing values are removed.
    
-   **how** (_str__,_ _{‘any’__,_ _‘all’}__,_ _default ‘any’_) – If ‘drop’ is selected as option, determines if row or column is removed from DataFrame, when we have at least one NaN or all NaN.
    
-   **thresh** (_int__,_ _optional_) – If ‘drop’ is selected as option, determines how many NaN values must be in a given row to drop it.
    
-   **subset** (_array-like__,_ _optional_) – Labels along other axis to consider, e.g. if you are dropping rows these would be a list of columns to include.
    
-   **value** (_scalar__,_ _dict__,_ _Series__, or_ _DataFrame__,_ _optional_) – Value to use to fill holes (e.g. 0), alternately a dict/Series/DataFrame of values specifying which value to use for each index (for a Series) or column (for a DataFrame). Values not in the dict/Series/DataFrame will not be filled. This value cannot be a list.
    
-   **method** (_str__,_ _{‘bfill’__,_ _‘ffill’__,_ _'zero'__,_ _'period\_average'__,_ _'period\_median'__,_) – ‘period\_min’, ‘period\_max’ None}, default None If ‘fill’ is selected as option, method to use for filling holes in reindexed Series
    
-   **limit** (_int__,_ _default None_) – If ‘fill’ is selected option and method is specified, this is the maximum number of consecutive NaN values to forward/backward fill. If there is a gap with more than this number of consecutive NaNs, it will only be partially filled. If ‘method’ is not specified, this is the maximum number of entries along the entire axis where NaNs will be filled. Must be greater than 0 if not None.
    

Returns:

A pandas DataFrame with NaN values handled as specified in function arguments. By default, will return the data with rows containing any NaN values removed.

Return type:

DataFrame

## Outliers[#](https://fpe.factset.com/docs/utils.html#outliers "Link to this heading")

fds.fpe.quant.utils.outliers(_df_, _minimum\=None_, _maximum\=None_, _replacement\=None_, _limit\='value'_, _subset\=None_, _drop\=False_, _winsorizations\=1_, _q\=5_)[#](https://fpe.factset.com/docs/utils.html#fds.fpe.quant.utils.outliers "Link to this definition")

Helper function to handle outliers which replicates AT options with some additional methods.

Parameters:

-   **df** (_DataFrame_) – The DataFrame for which to handle outliers.
    
-   **minimum** (_float_) – The minimum value to allow in the DataFrame. Note that the limit argument dictates whether this represents an actual value, number of standard deviations, or quantile.
    
-   **maximum** (_float_) – The maximum value to allow in the DataFrame. Note that the limit argument dictates whether this represents an actual value, number of standard deviations, or quantile.
    
-   **replacement** (_float_ _or_ _str {period\_average'__,_ _'period\_median'__,_ _None}__,_ _default None_) – Value to use for replacing outlier data. If float is passed, this will be used as the replacement value.
    
-   **limit** (_str__,_ _{‘value’__,_ _‘std’__,_ _'qcuts'}__,_ _default ‘value’_) – The method by which you want to limit outliers.
    
-   **subset** (_array-like__,_ _optional_) – Labels along other axis to consider, e.g. if you would like to limit outliers only for specific columns.
    
-   **drop** (_bool__,_ _optional_) – If true, drops rows containing outliers.
    
-   **winsorizations** (_int__,_ _default 1_) – If ‘std’ or ‘qcuts’ is selected as limit, this specifies the number of iterations over which to detect and replace outliers.
    
-   **q** (_int__,_ _default 5_) – If ‘qcuts’ is selected as limit, umber of quantiles. 10 for deciles, 4 for quartiles, etc. Alternately array of quantiles, e.g. \[0, .25, .5, .75, 1\] for quartiles, by default 5.
    

Returns:

A pandas DataFrame with outliers handled as specified in function arguments. By default, will return the data unhandled.

Return type:

DataFrame
