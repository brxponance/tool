---
created: 2026-05-11T13:07:31 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/alpha_combiner.html
author: 
---

# AlphaCombiner — FactSet

> ## Excerpt
> AlphaCombiner allows the user to seemlessly generate and test alpha that have been built by FPE’s OptimalWeightsEngine.
The alpha can be saved off for input into a Simulation or generated on the fly for a Backtest.
Alternatively, a user can use the AlphaCombiner with Quant Scheduler to populate OFDB for daily production use.

---
_AlphaCombiner_ allows the user to seemlessly generate and test alpha that have been built by FPE’s _OptimalWeightsEngine_. The alpha can be saved off for input into a _Simulation_ or generated on the fly for a _Backtest_. Alternatively, a user can use the _AlphaCombiner_ with Quant Scheduler to populate _OFDB_ for daily production use.

In addition to supporting the methods from _OptimalWeightsEngine_, _Alph Combiner_ also supports use of customized formulas using customized neutralization and partitioning. Finally, for a user wanting even more customization, Alpha Combiner offers a Pipeline Calculation mechanism that allows the user to define any transformations and apply them in any order for each component.

All four methods will make use of data from a standard fds.fpe screen dataframe format. However, the user can load in data from any source for use.

1.  Linear Alpha
    

> -   This method calculates one or more linear alphas quickly, once the data is loaded.
>     
> -   It applies default winsorization and standardization to all components and then final alphas.
>     
> -   It reads component names, formulas, and coefficients for each alpha from a delimited text file or OFDB.
>     
> -   The other necessary inputs are a universe and time series.
>     

2.  Linear by Category
    

> -   This method supports an alpha formula with different coefficients for each category (such as sector, industry or country).
>     
> -   It applies default winsorization and standardization to all components and then final alphas.
>     
> -   It reads component names, formulas, and coefficients for each category from a delimited text file or OFDB.
>     
> -   The other necessary inputs are a universe and time series and formula for the category.
>     

3.  Flexible Formula
    

> -   This method takes a more involved input that allows for customized transformations and partitioning.
>     
> -   Formulas can be read from a .csv or OFDB.
>     

4.  Pipeline Calculation
    

> -   This method allows the user to define any transformations and apply them in any order for each component.
>     
> -   This requires the user to write some code, facilitated by a modular system of adding components and applying a series of transformations.
>     

## AlphaCombiner[#](https://fpe.factset.com/docs/alpha_combiner.html#id1 "Link to this heading")

_class_ fds.fpe.quant.alpha.AlphaCombiner(_input\_data_, _alpha\='alpha\_combo'_, _columns\=None_, _coefficients\=None_, _targets\=None_, _winsorize\_settings\=None_, _neutralize\_settings\=None_, _score\_settings\=None_, _partition\_settings\=None_, _desc\=None_, _progress\_bar\=True_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner "Link to this definition")

Calculates an alpha (column of floats) from input\_data and argurments. The alpha will be a linear combination of transformed columns of input\_data where the coefficients and transformations are defined by the other arguments.

Parameters:

-   **input\_data** (_DataFrame_) – Input data.
    
-   **alpha** (_str__,_ _default "AlphaCombo"_) – What would you like your combined alpha to be named?
    
-   **columns** (_list__,_ _default_ _\[__\]_) – Names of columns that will be transformed and later used in the alpha combination.
    
-   **coefficients** (_list__,_ _default_ _\[__\]_) – Coefficients used in linear combination of alpha
    
-   **targets** (_list__,_ _default_ _\[__\]_) – Names of transformed columns which will be used in the alpha combination.
    
-   **winsorize\_settings** (_list__,_ _default None_) – List of dicts and/or bools containing winsorization settings for each component. If None, all components will be winsorized with default settings.
    
-   **neutralize\_settings** (_list__,_ _default None_) – List of dicts and/or containing neutralization settings for each component. If None, components will not be neutralized.
    
-   **score\_settings** (_list__,_ _default None_) – List of dicts and/or containing scoring settings for each component. If None, all components will be scored with default settings.
    
-   **partition\_settings** (_list__,_ _default None_) – List of dicts and/or containing partition settings for each component. If None, components will not be partitioned.
    

add\_component(_column_, _coefficient_, _target_, _winsorize\=True_, _neutralize\=False_, _score\=True_, _partition\=False_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.add_component "Link to this definition")

Add components to alpha combiner.

Parameters:

-   **column** (_str_) – Name of column that will be transformed and later used in the alpha combination.
    
-   **coefficient** (_str_) – Coefficient used in linear combination of alpha
    
-   **target** (_str_) – Name of transformed column which will be used in the alpha combination.
    
-   **winsorize** (_dict_ _or_ _bool__,_ _default True_) – If a dict, contains winsorization settings. If True, the winsorization is done with default settings. If False, the winsorization is not performed.
    
-   **neutralize** (_dict_ _or_ _bool__,_ _default False._) – If a dict, contains neutralization settings. If False, the neutralization is not performed.
    
-   **score** (_dict_ _or_ _bool__,_ _default True_) – If a dict, contains scoring settings. If True, the scoring is done with default settings. If False, the scoring is not performed.
    
-   **partition** (_dict_ _or_ _bool__,_ _default False_) – If a dict, contains partition settings. If False, the partitioning is not performed.
    

add\_components(_columns_, _coefficients_, _targets_, _winsorize\_settings\=None_, _neutralize\_settings\=None_, _score\_settings\=None_, _partition\_settings\=None_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.add_components "Link to this definition")

Add components to alpha combiner. Component is a transformed column of input\_data which will be added to other components to construct the final alpha.

Parameters:

-   **columns** (_list_) – Names of columns that will be transformed and later used in the alpha combination.
    
-   **coefficients** (_list_) – Coefficients used in linear combination of alpha
    
-   **targets** (_list_) – Names of transformed columns which will be used in the alpha combination.
    
-   **winsorize\_settings** (_list__,_ _default None_) – List of dicts and/or bools containing winsorization settings for each component. If None, all components will be winsorized with default settings.
    
-   **neutralize\_settings** (_list__,_ _default None_) – List of dicts and/or containing neutralization settings for each component. If None, components will not be neutralized.
    
-   **score\_settings** (_list__,_ _default None_) – List of dicts and/or containing scoring settings for each component. If None, all components will be scored with default settings.
    
-   **partition\_settings** (_list__,_ _default None_) – List of dicts and/or containing partitioning settings for each component. If None, components will not be partitioned.
    

calculate(_\*\*kwargs_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.calculate "Link to this definition")

Perform transformations and calculate alpha.

category\_weighting(_weights_, _column_, _index\='column'_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.category_weighting "Link to this definition")

Enable category weighting to be implemented during calculation.

Parameters:

-   **weights** (_DataFrame_) – Category weighting data frame. Columns are categories. Values are weights.
    
-   **column** (_str_) – Column in AlphaCombiner’s data DataFrame that corresponds to the category.
    
-   **index** (_{'column'__,_ _'target'}__,_ _default 'column'_) – Is weights DataFrame indexed by a component’s column or target?
    

_property_ column\_pipelines[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.column_pipelines "Link to this definition")

Get a list of ColumnPipelines.

_property_ data[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.data "Link to this definition")

Get the transformed DataFrame.

_property_ desc_: str_[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.desc "Link to this definition")

Description used in the representation of the object.

_property_ is\_calculated_: bool_[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.is_calculated "Link to this definition")

Has the data been calculated?

_property_ timestamp_: datetime_[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.timestamp "Link to this definition")

Execution timestamp.

_property_ wall\_time_: float_[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.wall_time "Link to this definition")

Calculation wall time.

_property_ warnings_: list\[Any\] | None_[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.AlphaCombiner.warnings "Link to this definition")

If there has been some warnings during the calculation, they will be stored here as a list.

## Category Alpha from Data[#](https://fpe.factset.com/docs/alpha_combiner.html#category-alpha-from-data "Link to this heading")

fds.fpe.quant.alpha.category\_alpha\_from\_data(_df\_raw\_data_, _df\_alpha\_formulas_, _alpha\_name_, _category\_name_, _final\_standardize\=True_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.category_alpha_from_data "Link to this definition")

Calculate category (eg sector) alpha from screen data and category formulas.

Parameters:

-   **df\_raw\_data** (_DataFrame_) – Formatted like screen.data from screens. Needs to contain columns of all alpha components and also the category\_name should also be a column.
    
-   **df\_alpha\_formulas** (_DataFrame_) – Specifies the alpha formula. Must contain the column ‘Name’. ‘Name’ column must contain unique strings which are columns in df\_raw\_data. ‘Formula’ (not used here) column contains screening formulas, liked used to create df\_raw\_data ‘Winsorize’ (optional) column contains optional arguments for the function stats.winsorize. If there is no ‘Winsorize’ column, all components are winsorized with default settings. ‘Neutralize’ (optional) column contains optional arguments for the function stats.neutralize. If there is no ‘Neutralize’ column, no components are neutralized. ‘Score’ (optional) column contains optional arguments for the function stats.score. If there is no ‘Score’ column, all components are scored with default settings. Should contain a column for each value in the category\_name column in raw\_data.
    
-   **alpha\_name** (_str_) – Name of the alpha (name of the column in the output dataframe that alpha will go in)
    
-   **category\_name** (_str_) – Column in df\_raw\_data that corresponds to the category. Should be a category variable like economic sector or country.
    
-   **final\_standardize** (_bool__,_ _default True_) – If True, we standardize (winsorize and score) the alpha as a final step. If False, we do not.
    

## Linear Alphas from Data[#](https://fpe.factset.com/docs/alpha_combiner.html#linear-alphas-from-data "Link to this heading")

fds.fpe.quant.alpha.linear\_alphas\_from\_data(_df\_raw\_data_, _df\_alpha\_formulas_, _final\_standardize\=True_)[#](https://fpe.factset.com/docs/alpha_combiner.html#fds.fpe.quant.alpha.linear_alphas_from_data "Link to this definition")

Given a dataframe (formatted like results from a screen) and a dataframe with an alpha formuala, return a dataframe with transformed alpha components and alphas. The df\_alpha\_formulas dataframe may contain arguments for winsorize, neutralize, and score (from FPE’s stats library). The component transformations are applied in the order : winsorize, neutralize, and then score. If winsorize or score columns are missing, these transformtions are applied by default with default settings from stats library. To turn these off, set the respective column to contain False. The stats function ‘neutralize’ is not called by default. Any columns with names not in \[‘Name’, ‘Formula’, ‘Winsorize’, ‘Score’, ‘Neutralize’\] are treated as alpha coefficients and must only contain numbers, which are used to calculate the alphas are a linear combination of the transformed components. The process for calculating the alphas is: winsorize (trim outliers) component columns, (optional) neutralize component columns, score (standardize to be mean 0, standard deviation 1) component columns. For each column in df\_alpha\_formulas which is not in \[‘Name’, ‘Formula’, ‘Winsorize’, ‘Score’, ‘Neutralize’, ‘Partition’\], we compute the linear combination of components specified by its coefficients. Finally, we can (if ‘final\_standardize’) call the stats functions winsorize and score on each alpha to standardize.

Parameters:

-   **df\_raw\_data** (_DataFrame_) – Formatted like screen.data from screens.
    
-   **df\_alpha\_formulas** (_DataFrame_) – Specifies the alpha formula. Must contain the column ‘Name’. ‘Name’ column must contain unique strings which are columns in df\_raw\_data. ‘Formula’ (not used here) column contains screening formulas, liked used to create df\_raw\_data ‘Winsorize’ (optional) column contains optional arguments for the function stats.winsorize. If there is no ‘Winsorize’ column, all components are winsorized with default settings. ‘Neutralize’ (optional) column contains optional arguments for the function stats.neutralize. If there is no ‘Neutralize’ column, no components are neutralized. ‘Score’ (optional) column contains optional arguments for the function stats.score. If there is no ‘Score’ column, all components are scored with default settings.
    
-   **final\_standardize** (_bool__,_ _default True_) – If True, we standardize (winsorize and score) the alpha as a final step. If False, we do not.
