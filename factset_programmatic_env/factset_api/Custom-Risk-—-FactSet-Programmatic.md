---
created: 2026-05-11T13:07:07 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/custom_risk.html
author: 
---

# Custom Risk — FactSet Programmatic

> ## Excerpt
> The Custom Risk Module in FPE (runs on kernel 3.11) allows users (from both quant and fundamental firms) to build custom risk models from scratch and control every part of the model creation - from the definition of the raw data universe, through the factors estimation process, to the calculation of the factor returns and covariances. It also provides them with the ability to test and validate the models and use them in our analytical ecosystem for portfolio construction, risk estimation and return attribution.

---
The Custom Risk Module in FPE (runs on kernel 3.11) allows users (from both quant and fundamental firms) to build custom risk models from scratch and control every part of the model creation - from the definition of the raw data universe, through the factors estimation process, to the calculation of the factor returns and covariances. It also provides them with the ability to test and validate the models and use them in our analytical ecosystem for portfolio construction, risk estimation and return attribution.

## Covariance[#](https://fpe.factset.com/docs/custom_risk.html#module-fds.fpe.quant.custom_risk_model.covariance "Link to this heading")

_class_ fds.fpe.quant.custom\_risk\_model.covariance.CovMatrix(_base\_currency\='FX\_USD'_, _annualization\_factor\=None_, _regularize\=True_, _eigen\_cutoff\=2.0_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix "Link to this definition")

Bases: `ABC`

An abstract class outlining the skeleton of a covariance matrix.

Parameters:

-   **base\_currency** (_str_) – The base currency. The covariance of this variable is expected to be 0 and it must be sliced out before regularization.
    
-   **annualization\_factor** (_int defaults to None_) – The factor used to annualize the covariance matrix. For example, if the data is daily, the factor could be 250. For monthly data, the factor could be 12.
    
-   **regularize** (_bool defaults to True_) – Whether to regularize the covariance matrix.
    
-   **eigen\_cutoff** (_float defaults to 2.0_) – The eigenvalue cutoff used for matrix regularization
    

compute(_factor\_returns_, _dates\=None_, _factor\_ids\=\[\]_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix.compute "Link to this definition")

Computes the covariance matrix.

Parameters:

-   **factor\_returns** (_pd.DataFrame_) – The factor returns.
    
-   **dates** (_pd.DatetimeIndex__,_ _optional_) – The dates for which to compute the covariance matrix. If None, then the covariance matrix is computed for all dates.
    
-   **factor\_ids** (_List__\[__str__\]__,_ _optional_) – The factor ids. If None, then the factor ids are inferred from the factor returns.
    

Returns:

The covariance matrix. The index is a MultiIndex with levels representing date and factor in that order.

Return type:

pd.DataFrame

_static_ perform\_cov\_regularization(_cov_, _eigen\_cutoff_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix.perform_cov_regularization "Link to this definition")

Performs covariance matrix regularization.

Parameters:

-   **cov** (_pd.DataFrame_) – The covariance matrix.
    
-   **eigen\_cutoff** (_float_) – The eigenvalue cutoff.
    

Returns:

The regularized covariance matrix.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.covariance.EWMACovMatrix(_base\_currency\='FX\_USD'_, _annualization\_factor\=None_, _regularize\=True_, _min\_periods\=12_, _halflife\=6_, _eigen\_cutoff\=2.0_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.EWMACovMatrix "Link to this definition")

Bases: [`CovMatrix`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix "fds.fpe.quant.custom_risk_model.covariance.CovMatrix")

Exponentially-weighted moving average covariance matrix.

Parameters:

-   **base\_currency** (_str_) – The base currency. The covariance of this variable is expected to be 0 and it must be sliced out before regularization.
    
-   **annualization\_factor** (_int defaults to None_) – The factor used to annualize the covariance matrix. For example, if the data is daily, the factor could be 250. For monthly data, the factor could be 12.
    
-   **regularize** (_bool defaults to True_) – Whether to regularize the covariance matrix.
    
-   **min\_periods** (_int defaults to 12_) – Minimum number of observations to have a value (otherwise result is NA)
    
-   **halflife** (_int defaults to 6_) – The halflife for decaying weights.
    
-   **eigen\_cutoff** (_float defaults to 2.0_) – The eigenvalue cutoff used for matrix regularization
    

compute(_factor\_returns_, _dates\=None_, _factor\_ids\=\[\]_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.EWMACovMatrix.compute "Link to this definition")

Computes the covariance matrix.

Parameters:

-   **factor\_returns** (_pd.DataFrame_) – The factor returns.
    
-   **dates** (_pd.DatetimeIndex__,_ _optional_) – The dates for which to compute the covariance matrix. If None, then the covariance matrix is computed for all dates.
    
-   **factor\_ids** (_List__\[__str__\]__,_ _optional_) – The factor ids. If None, then the factor ids are inferred from the factor returns.
    

Returns:

The covariance matrix. The index is a MultiIndex with levels representing date and factor in that order.

Return type:

pd.DataFrame

compute\_cov\_matrix(_factor\_returns_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.EWMACovMatrix.compute_cov_matrix "Link to this definition")

Computes the covariance matrix.

Parameters:

**factor\_returns** (_pd.DataFrame_) – The factor returns.

Returns:

The covariance matrix.

Return type:

pd.DataFrame

_static_ perform\_cov\_regularization(_cov_, _eigen\_cutoff_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.EWMACovMatrix.perform_cov_regularization "Link to this definition")

Performs covariance matrix regularization.

Parameters:

-   **cov** (_pd.DataFrame_) – The covariance matrix.
    
-   **eigen\_cutoff** (_float_) – The eigenvalue cutoff.
    

Returns:

The regularized covariance matrix.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.covariance.Hybrid2HLCovMatrix(_annualization\_factor\=None_, _regularize\=True_, _base\_currency\='FX\_USD'_, _min\_periods\=12_, _window\=12_, _halflife\_var\=12_, _lags\_var\=0_, _halflife\_corr\=12_, _lags\_corr\=0_, _handle\_nans\=False_, _eigen\_cutoff\=2.0_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.Hybrid2HLCovMatrix "Link to this definition")

Bases: [`CovMatrix`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix "fds.fpe.quant.custom_risk_model.covariance.CovMatrix")

Rolling exponentially-weighted covariance matrix with different half-lives for covariance and correlations and NW corrections Newey and West - A Simple, Positive Semi-Definite, Heteroskedasticity and Autocorrelation Consistent Covariance Matrix (1987) Employs the Barlett window

Parameters:

-   **annualization\_factor** (_int defaults to None_) – The factor used to annualize the covariance matrix. For example, if the data is daily, the factor could be 250. For monthly data, the factor could be 12.
    
-   **regularize** (_bool defaults to True_) – Whether to regularize the covariance matrix.
    
-   **base\_currency** (_str defaults to 'FX\_USD'_) – The base currency. The covariance of this variable is expected to be 0
    
-   **min\_periods** (_int defaults to 12_) – Minimum number of observations to have a value (otherwise result is NA)
    
-   **window** (_int defaults to 12_) – Length of the rolling window
    
-   **halflife\_var** (_int defaults to 12_) – The halflife for decaying weights in the covariance estimation component
    
-   **lags\_var** (_int defaults to 0_) – Number of lags for NW correction in the covariance estimation components
    
-   **halflife\_corr** (_int defaults to 12_) – The halflife for decaying weights in the correlation estimation component
    
-   **lags\_corr** (_int defaults to 0_) – Number of lags for NW correction in the correlation estimation components
    
-   **handle\_nans** (_bool defaults to False_) – When calling production\_cov\_matrix, nans are filled with 0.0 if True; if False, raises ValueError
    
-   **eigen\_cutoff** (_float defaults to 2.0_) – The eigenvalue cutoff used for matrix regularization, which defines the lowest eigenvalue to keep
    

compute(_frets_, _dates\=None_, _factor\_ids\=\[\]_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.Hybrid2HLCovMatrix.compute "Link to this definition")

Computes the covariance matrix.

Parameters:

-   **factor\_returns** (_pd.DataFrame_) – The factor returns.
    
-   **dates** (_pd.DatetimeIndex__,_ _optional_) – The dates for which to compute the covariance matrix. If None, then the covariance matrix is computed for all dates.
    
-   **factor\_ids** (_List__\[__str__\]__,_ _optional_) – The factor ids. If None, then the factor ids are inferred from the factor returns.
    

Returns:

The covariance matrix. The index is a MultiIndex with levels representing date and factor in that order.

Return type:

pd.DataFrame

_static_ perform\_cov\_regularization(_cov_, _eigen\_cutoff_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.Hybrid2HLCovMatrix.perform_cov_regularization "Link to this definition")

Performs covariance matrix regularization.

Parameters:

-   **cov** (_pd.DataFrame_) – The covariance matrix.
    
-   **eigen\_cutoff** (_float_) – The eigenvalue cutoff.
    

Returns:

The regularized covariance matrix.

Return type:

pd.DataFrame

fds.fpe.quant.custom\_risk\_model.covariance.create\_covariance\_matrix(_name_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.create_covariance_matrix "Link to this definition")

A factory function for creating covariance matrices.

Parameters:

-   **name** (_str_) – The name of the covariance matrix.
    
-   **\*\*kwargs** – The keyword arguments to be passed to the covariance matrix.
    

Returns:

The covariance matrix object.

Return type:

[CovMatrix](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix "fds.fpe.quant.custom_risk_model.covariance.CovMatrix")

## Factors[#](https://fpe.factset.com/docs/custom_risk.html#module-fds.fpe.quant.custom_risk_model.factors "Link to this heading")

_class_ fds.fpe.quant.custom\_risk\_model.factors.CrossSectionalStandardize(_standardization\_group\='GLOBAL'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.CrossSectionalStandardize "Link to this definition")

Bases: [`OutlierTreatment`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment "fds.fpe.quant.custom_risk_model.factors.OutlierTreatment")

Outlier treatment that only performs cross-sectional z-score standardization (subtract mean, divide by std) per date. No winsorization or market-cap weighting.

Parameters:

**standardization\_group** (_str__,_ _default 'GLOBAL'_) – The name of the group to be used for standardization.

standardize(_data_, _column_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.CrossSectionalStandardize.standardize "Link to this definition")

Performs equal-weighted cross-sectional z-score standardization per date.

Parameters:

-   **data** (_pd.DataFrame_) – The data to be standardized. Must have a hierarchical index with date as a level.
    
-   **column** (_str_) – The name of the column to be standardized.
    

Returns:

The standardized column with mean 0 and standard deviation 1 per date.

Return type:

pd.Series

treat(_data_, _column_, _winsorize\=False_, _standardize\=True_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.CrossSectionalStandardize.treat "Link to this definition")

Performs cross-sectional standardization on the specified column.

Parameters:

-   **data** (_pd.DataFrame_) – The data to be treated. Must have a hierarchical index with date as a level.
    
-   **column** (_str_) – The name of the column to be standardized.
    
-   **winsorize** (_bool__,_ _default False_) – Ignored. Winsorization is not supported by this class.
    
-   **standardize** (_bool__,_ _default True_) – Whether to standardize the data.
    

Returns:

The standardized column.

Return type:

pd.Series

winsorize(_data_, _column_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.CrossSectionalStandardize.winsorize "Link to this definition")

Not implemented. Raises NotImplementedError.

Raises:

**NotImplementedError** – Always raised. Use MADWinsorizeAndStandardize for winsorization.

Return type:

`Series`

_class_ fds.fpe.quant.custom\_risk\_model.factors.Factor(_column_, _name\=None_, _outlier\_treatment\=None_, _missing\_value\_treatment\=None_, _factor\_type\='Style'_, _was\_dropped\_during\_fit\=False_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "Link to this definition")

Bases: `object`

A class outlining the configuration of a factor exposure.

Parameters:

-   **column** (_str_) – The name of the column in the data.
    
-   **name** (_str__,_ _default None_) – The name of the factor. If None, the name of the column will be used.
    
-   **outlier\_treatment** ([_OutlierTreatment_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment "fds.fpe.quant.custom_risk_model.factors.OutlierTreatment")_,_ _default None_) – The outlier treatment to be used.
    
-   **factor\_type** (_str__,_ _default 'Style'_) – The name of the group used for display purposes. For instance, if the book-to-price factor is used, the factor group could be ‘VALUE’ or ‘STYLE’.
    
-   **was\_dropped\_during\_fit** (_bool__,_ _default False_) – Whether the factor was dropped during the fitting process.
    

treat\_missing\_exposures(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor.treat_missing_exposures "Link to this definition")

Fill missing factor exposures.

Parameters:

**data** (_pd.DataFrame_) – The data to be treated.

Returns:

The treated data.

Return type:

pd.DataFrame

treat\_outliers(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor.treat_outliers "Link to this definition")

Treats the outliers of the factor exposures.

Parameters:

**data** (_pd.DataFrame_) – The data to be treated.

Returns:

The treated data.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.factors.FactorList(_factors\=\[\]_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList "Link to this definition")

Bases: `list`

A class to store a list of factors. Among other things, it ensures that the factors are unique.

append(_value_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.append "Link to this definition")

Append object to the end of the list.

Return type:

`None`

clear()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.clear "Link to this definition")

Remove all items from list.

copy()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.copy "Link to this definition")

Return a shallow copy of the list.

count(_value_, _/_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.count "Link to this definition")

Return number of occurrences of value.

extend(_values_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.extend "Link to this definition")

Extend list by appending elements from the iterable.

Return type:

`None`

index(_item_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.index "Link to this definition")

Return first index of value.

Raises ValueError if the value is not present.

Return type:

`int`

insert(_index_, _object_, _/_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.insert "Link to this definition")

Insert object before index.

pop(_index\=\-1_, _/_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.pop "Link to this definition")

Remove and return item at index (default last).

Raises IndexError if list is empty or index is out of range.

remove(_value_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.remove "Link to this definition")

Remove first occurrence of value.

Raises ValueError if the value is not present.

Return type:

`None`

reverse()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.reverse "Link to this definition")

Reverse _IN PLACE_.

sort(_factor\_type\_order\=\[\]_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FactorList.sort "Link to this definition")

Sort the list in ascending order and return None.

The sort is in-place (i.e. the list itself is modified) and stable (i.e. the order of two equal elements is maintained).

If a key function is given, apply it once to each list item and sort them, ascending or descending, according to their function values.

The reverse flag can be set to sort in descending order.

Return type:

`None`

_class_ fds.fpe.quant.custom\_risk\_model.factors.FillMissingExposures[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillMissingExposures "Link to this definition")

Bases: `object`

A class outlining the skeleton of a missing factor exposure treatment

_class_ fds.fpe.quant.custom\_risk\_model.factors.FillWithGroupValue(_group_, _transformation\_type_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithGroupValue "Link to this definition")

Bases: [`FillMissingExposures`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillMissingExposures "fds.fpe.quant.custom_risk_model.factors.FillMissingExposures")

Class representing filling missing exposures using a group value, for example, a group mean.

Parameters:

-   **group** (_Union__\[__str__,_ _List__\[__str__\]__\]_) – Group over which data is grouped by for the transformation Could be ‘INDUSTRY’ or combined groups \[‘INDUSTRY’, ‘date’\].
    
-   **transformation\_type** (_Union__\[__str__,_ _Callable__\]_) – Function to use for transforming the data that is passed to pandas.core.groupby.DataFrameGroupBy.transform(). For example, ‘mean’, ‘min’, ‘max’ or np.exp, etc…
    

treat(_data_, _factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithGroupValue.treat "Link to this definition")

Fill NA values in column ‘factor’ using the calculated group value

Return type:

`DataFrame`

_class_ fds.fpe.quant.custom\_risk\_model.factors.FillWithPeriodValue(_transformation\_type_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithPeriodValue "Link to this definition")

Bases: [`FillMissingExposures`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillMissingExposures "fds.fpe.quant.custom_risk_model.factors.FillMissingExposures")

Class representing filling missing exposures using a period value, for example, a period mean.

Parameters:

**transformation\_type** (_Union__\[__str__,_ _Callable__\]_) – Function to use for transforming the data that is passed to pandas.core.groupby.DataFrameGroupBy.transform(). For example, ‘mean’, ‘min’, ‘max’ or np.exp, etc…

treat(_data_, _factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithPeriodValue.treat "Link to this definition")

Fill NA values in column ‘factor’ using the calculated period value

Return type:

`DataFrame`

_class_ fds.fpe.quant.custom\_risk\_model.factors.FillWithProxy(_proxy_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithProxy "Link to this definition")

Bases: [`FillMissingExposures`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillMissingExposures "fds.fpe.quant.custom_risk_model.factors.FillMissingExposures")

Class representing filling missing exposures using a linear regression based model.

Parameters:

**proxy** (ProxyBase class instance) – Proxying model to be used for the specific factor

treat(_data_, _factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithProxy.treat "Link to this definition")

Fill NA values in column ‘factor’ using the provided proxy class instance

Return type:

`DataFrame`

_class_ fds.fpe.quant.custom\_risk\_model.factors.FillWithZeros[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithZeros "Link to this definition")

Bases: [`FillMissingExposures`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillMissingExposures "fds.fpe.quant.custom_risk_model.factors.FillMissingExposures")

Class representing filling missing exposures with zeros.

treat(_data_, _factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.FillWithZeros.treat "Link to this definition")

Fill NA values in column ‘factor’ with zeros.

Return type:

`DataFrame`

_class_ fds.fpe.quant.custom\_risk\_model.factors.MADWinsorizeAndStandardize(_standardization\_group\='GLOBAL'_, _market\_cap\_column\='mcap'_, _wins\_lower\_abs\_limit\=3_, _wins\_upper\_abs\_limit\=5_, _left\_trim\=True_, _right\_trim\=True_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.MADWinsorizeAndStandardize "Link to this definition")

Bases: [`OutlierTreatment`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment "fds.fpe.quant.custom_risk_model.factors.OutlierTreatment")

standardize(_data_, _column_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.MADWinsorizeAndStandardize.standardize "Link to this definition")

Performs the standardization.

Parameters:

**data** (_pd.DataFrame_) – The data to be standardized.

Returns:

The standardized data.

Return type:

pd.DataFrame

treat(_data_, _column_, _winsorize\=True_, _standardize\=True_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.MADWinsorizeAndStandardize.treat "Link to this definition")

Performs the outlier .

Parameters:

-   **data** (_pd.DataFrame_) – The data to be treated.
    
-   **column** (_str_) – The name of the column to be treated.
    
-   **winsorize** (_bool defaults to True_) – Whether to winsorize the data.
    
-   **standardize** (_bool defaults to True_) – Whether to standardize the data.
    

Returns:

The treated data.

Return type:

pd.DataFrame

winsorize(_data_, _column_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.MADWinsorizeAndStandardize.winsorize "Link to this definition")

Performs winsorization.

Parameters:

-   **data** (_pd.DataFrame_) – The data to be treated.
    
-   **column** (_str_) – The name of the column to be treated.
    

Returns:

The treated data.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.factors.OutlierTreatment(_name_, _standardization\_group\='GLOBAL'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment "Link to this definition")

Bases: `ABC`

A class outlining the skeleton of an outlier treatment of factor exposures

Parameters:

**standardization\_group** (_str defaults to 'GLOBAL'_) – The name of the group to be used for standardization. The name of the group should be one of the columns of the data. Defaults to ‘GLOBAL’ - standardization is performed on the whole data.

_abstract_ standardize(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment.standardize "Link to this definition")

Performs the standardization.

Parameters:

-   **data** (_pd.DataFrame_) – The data to be standardized.
    
-   **column** (_str_) – The name of the column to be standardized.
    

Returns:

The standardized data.

Return type:

pd.DataFrame

treat(_data_, _column_, _winsorize\=True_, _standardize\=True_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment.treat "Link to this definition")

Performs the outlier .

Parameters:

-   **data** (_pd.DataFrame_) – The data to be treated.
    
-   **column** (_str_) – The name of the column to be treated.
    
-   **winsorize** (_bool defaults to True_) – Whether to winsorize the data.
    
-   **standardize** (_bool defaults to True_) – Whether to standardize the data.
    

Returns:

The treated data.

Return type:

pd.DataFrame

_abstract_ winsorize(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment.winsorize "Link to this definition")

Performs winsorization.

Parameters:

-   **data** (_pd.DataFrame_) – The data to be treated.
    
-   **column** (_str_) – The name of the column to be treated.
    

Returns:

The treated data.

Return type:

pd.DataFrame

## Fitter[#](https://fpe.factset.com/docs/custom_risk.html#module-fds.fpe.quant.custom_risk_model.fitter "Link to this heading")

_class_ fds.fpe.quant.custom\_risk\_model.fitter.ConstrWeightedCrossSectionalFitter(_dependent\_column\_name_, _dummy\_column\_names\=\[\]_, _regression\_weights\_column\_name\=None_, _dummy\_column\_names\_constrained\=\[\]_, _weight\_constrained\_column\_name\=None_, _independent\_column\_names\=\[\]_, _store\_fitting\_stats\=False_, _name\_of\_fitter\_method\=None_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter "Link to this definition")

Bases: [`Fitter`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter "fds.fpe.quant.custom_risk_model.fitter.Fitter")

A fitter that performs a constrained weighted cross-sectional least squares fit. The constraint is that the sum of the weights (weighted by the weight\_constrained\_column\_name) for each date should be 1.

Parameters:

-   **dependent\_column\_name** (_str_) – The name of the column containing the dependent variable.
    
-   **dummy\_column\_names** (_List__\[__str__\]_) – The names of the columns containing the dummy variables.
    
-   **dummy\_column\_names\_constrained** (_List__\[__str__\]_) – The names of the columns containing the dummy variables that should be constrained. The constrained forces the sum of the weights for each date to be 1.
    
-   **weight\_constrained\_column\_name** (_str_) – The name of the column containing the weights for the constrained dummy variables.
    
-   **regression\_weights\_column\_name** (_str_) – The name of the column containing the regression weights.
    
-   **independent\_column\_names** (_Union__\[__List__\[__str__\]__,_ _List__\[_[_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")_\]__\]__,_ _default_ _\[__\]_) – A list of strings or a list of Factor objects outlining the factors in the model.
    
-   **store\_fitting\_stats** (_bool defaults to False_) – Whether to store the fitting statistics.
    

add\_factor(_new\_factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter.add_factor "Link to this definition")

Adds new independent column name to the existing ones.

Parameters:

**new\_factor** (_str_ _or_ [_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")) – The new independent column names to be added.

Return type:

`None`

drop\_factor(_factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter.drop_factor "Link to this definition")

Drops an independent column name.

Parameters:

**factor** (_str_ _or_ [_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")) – The independent column name to be dropped.

Return type:

`None`

fit(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter.fit "Link to this definition")

Performs the fitting.

Return type:

`DataFrame`

sort\_factor\_columns\_and\_add\_type(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter.sort_factor_columns_and_add_type "Link to this definition")

Sorts the columns of a DataFrame according to the order of the factor types.

Parameters:

**data** (_pd.DataFrame_) – The DataFrame to be sorted.

Returns:

The sorted DataFrame.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.fitter.Fitter(_dependent\_column\_name_, _independent\_column\_names_, _name\_of\_fitter\_method_, _store\_fitting\_stats\=False_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter "Link to this definition")

Bases: `ABC`

An abstract class outlining the skeleton of a fitter.

Parameters:

-   **name\_of\_fitter\_method** (_str_) – The name of the fitter method to be used. Should be one of the names defined in the \_fitter\_methods.py file.
    
-   **data** (_pd.DataFrame_) – The data to be used for the fitting. It should have the dependent and independent variables defined as columns. The row index should be a hierarchical index with the first level representing the date and the second the instrument (using some type of instrument identifier).
    
-   **dependent\_column\_name** (_str_) – The name of the column containing the dependent variable.
    
-   **independent\_column\_names** (_Union__\[__List__\[__str__\]__,_ _List__\[_[_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")_\]__\]_) – A list of Factor objects or str containing the independent variables.
    
-   **name\_of\_fitter\_method** – The name of the fitter method to be used.
    
-   **store\_fitting\_stats** (_bool defaults to False_) – Whether to store the fitting statistics.
    

add\_factor(_new\_factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter.add_factor "Link to this definition")

Adds new independent column name to the existing ones.

Parameters:

**new\_factor** (_str_ _or_ [_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")) – The new independent column names to be added.

Return type:

`None`

drop\_factor(_factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter.drop_factor "Link to this definition")

Drops an independent column name.

Parameters:

**factor** (_str_ _or_ [_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")) – The independent column name to be dropped.

Return type:

`None`

_abstract_ fit(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter.fit "Link to this definition")

Performs the fitting.

Return type:

`DataFrame`

sort\_factor\_columns\_and\_add\_type(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter.sort_factor_columns_and_add_type "Link to this definition")

Sorts the columns of a DataFrame according to the order of the factor types.

Parameters:

**data** (_pd.DataFrame_) – The DataFrame to be sorted.

Returns:

The sorted DataFrame.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.fitter.GLMCrossSectionaFitter(_dependent\_column\_name_, _dummy\_column\_names\=\[\]_, _regression\_weights\_column\_name\=None_, _dummy\_column\_names\_constrained\=\[\]_, _weight\_constrained\_column\_name\=None_, _independent\_column\_names\=\[\]_, _store\_fitting\_stats\=False_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.GLMCrossSectionaFitter "Link to this definition")

Bases: [`ConstrWeightedCrossSectionalFitter`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter "fds.fpe.quant.custom_risk_model.fitter.ConstrWeightedCrossSectionalFitter"), [`Fitter`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter "fds.fpe.quant.custom_risk_model.fitter.Fitter")

A fitter that performs a cross-sectional generalized linear model fit. The constrained can be passed as a tuple of 2 elements, the former being the constraint matrix and the latter the constraint value.

Parameters:

-   **dependent\_column\_name** (_str_) – The name of the column containing the dependent variable.
    
-   **dummy\_column\_names** (_List__\[__str__\]_) – The names of the columns containing the dummy variables.
    
-   **dummy\_column\_names\_constrained** (_List__\[__str__\]_) – The names of the columns containing the dummy variables that should be constrained. The constrained forces the sum of the weights for each date to be 1.
    
-   **weight\_constrained\_column\_name** (_str_) – The name of the column containing the weights for the constrained dummy variables.
    
-   **regression\_weights\_column\_name** (_str_) – The name of the column containing the regression weights.
    
-   **independent\_column\_names** (_Union__\[__List__\[__str__\]__,_ _List__\[_[_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")_\]__\]__,_ _default_ _\[__\]_) – A list of strings or a list of Factor objects outlining the factors in the model.
    
-   **store\_fitting\_stats** (_bool defaults to False_) – Whether to store the fitting statistics.
    

add\_factor(_new\_factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.GLMCrossSectionaFitter.add_factor "Link to this definition")

Adds new independent column name to the existing ones.

Parameters:

**new\_factor** (_str_ _or_ [_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")) – The new independent column names to be added.

Return type:

`None`

drop\_factor(_factor_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.GLMCrossSectionaFitter.drop_factor "Link to this definition")

Drops an independent column name.

Parameters:

**factor** (_str_ _or_ [_Factor_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.Factor "fds.fpe.quant.custom_risk_model.factors.Factor")) – The independent column name to be dropped.

Return type:

`None`

fit(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.GLMCrossSectionaFitter.fit "Link to this definition")

Performs the fitting.

Return type:

`DataFrame`

sort\_factor\_columns\_and\_add\_type(_data_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.GLMCrossSectionaFitter.sort_factor_columns_and_add_type "Link to this definition")

Sorts the columns of a DataFrame according to the order of the factor types.

Parameters:

**data** (_pd.DataFrame_) – The DataFrame to be sorted.

Returns:

The sorted DataFrame.

Return type:

pd.DataFrame

_exception_ fds.fpe.quant.custom\_risk\_model.fitter.MissingFactorExposuresError[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.MissingFactorExposuresError "Link to this definition")

Bases: `ValueError`

add\_note()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.MissingFactorExposuresError.add_note "Link to this definition")

Exception.add\_note(note) – add a note to the exception

with\_traceback()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.MissingFactorExposuresError.with_traceback "Link to this definition")

Exception.with\_traceback(tb) – set self.\_\_traceback\_\_ to tb and return self.

fds.fpe.quant.custom\_risk\_model.fitter.create\_fitter(_name_, _dependent\_column\_name_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.create_fitter "Link to this definition")

Creates a fitter by name.

Parameters:

-   **name** (_str_) – The name of the fitter.
    
-   **dependent\_column\_name** (_str_) – The name of the column containing the dependent variable.
    
-   **store\_fitting\_stats** (_bool_) – Whether to store the fitting statistics.
    
-   **kwargs** (_dict_) – The keyword arguments to be passed to the fitter.
    

Return type:

[`Fitter`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter "fds.fpe.quant.custom_risk_model.fitter.Fitter")

## Model[#](https://fpe.factset.com/docs/custom_risk.html#module-fds.fpe.quant.custom_risk_model.model "Link to this heading")

_class_ fds.fpe.quant.custom\_risk\_model.model.CrossSectionalModel(_data_, _fitter\_config_, _cov\_matrix\_config_, _ssr\_config_, _ssr\_proxy\_config\=None_, _base\_currency\='USD'_, _fitter\_config\_kwargs\={}_, _cov\_matrix\_config\_kwargs\={}_, _ssr\_config\_kwargs\={}_, _ssr\_proxy\_kwargs\={}_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel "Link to this definition")

Bases: [`Model`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model "fds.fpe.quant.custom_risk_model.model.Model")

add\_currency\_factor\_returns(_currency\_returns_, _exposure\_column_, _factor\_type\='CURRENCY'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.add_currency_factor_returns "Link to this definition")

Adds currency factor returns to the model.

Parameters:

-   **currency\_returns** (_pd.DataFrame_) – The currency factor returns. The row index should be a date index and the columns should represent the factor returns.
    
-   **exposure\_column** (_str_) – The name of the column in self.data to be used as a factor.
    
-   **factor\_type** (_str__,_ _default 'CURRENCY'_) – The type of the factor. If None, the factor will be considered as a CURRENCY factor.
    

Return type:

`None`

add\_external\_factor\_returns(_external\_returns_, _exposure\_column_, _exposure\_is\_dummy\=False_, _factor\_type\=None_, _missing\_value\_treatment\=None_, _exposures\=None_, _standardize\_exposures\=False_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.add_external_factor_returns "Link to this definition")

Adds external factor returns to the model. It can be used to pass factor returns that are required to compute the covariance matrix, e.g. currency returns or PCA factor returns.

Parameters:

-   **external\_returns** (_Union__\[__pd.DataFrame__,_ _pd.Series__\]_) – The external factor returns. The row index should be a date index and the columns should represent the factor returns. If exposure\_is\_dummy is False, this should be a pd.Series.
    
-   **exposure\_column** (_str_) – The name of the column in self.data to be used as a factor. If exposures is provided, this is also used as the column name when merging into self.data.
    
-   **exposure\_is\_dummy** (_bool__,_ _default False_) – Whether the exposure is a dummy variable. If so the factor exposure will be expanded to a dummy variable. Cannot be used together with exposures.
    
-   **factor\_type** (_str__,_ _default = None_) – The type of the factor. If None, the factor will be considered as an EXTERNAL factor.
    
-   **missing\_value\_treatment** (_list__,_ _default = None_) – Missing exposure value treatment. Only used for non-dummy factors, if None, will not be applied.
    
-   **exposures** (_pd.Series__,_ _default = None_) – Used fpr PCA factors. Factor exposure values to merge into self.data before adding the factor. If the index is a MultiIndex (date, symbol), time-varying exposures are joined on both date and symbol. Otherwise, static exposures are merged on symbol only.
    
-   **standardize\_exposures** (_bool__,_ _default = False_) – If True, cross-sectionally standardize (z-score) the exposures per date after merging into self.data. Only applies to non-dummy factors with exposures provided.
    

Return type:

`None`

add\_factor(_column_, _name\=None_, _outlier\_treatment\=None_, _missing\_value\_treatment\=None_, _factor\_type\='DEFAULT'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.add_factor "Link to this definition")

Adds a new factor to the model.

Parameters:

-   **column** (_str_) – The name of the column in the data to be used as a factor.
    
-   **name** (_str__,_ _default None_) – The name of the factor. If None, the name of the column will be used.
    
-   **outlier\_treatment** ([_OutlierTreatment_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment "fds.fpe.quant.custom_risk_model.factors.OutlierTreatment")_,_ _default None_) – The outlier treatment to be used for the factor. If None, no outlier treatment will be applied.
    
-   **factor\_type** (_str__,_ _default None_) – The type of the factor. If None, the factor will be considered as a DEFAULT factor.
    

Return type:

`None`

compute\_cov\_matrix()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.compute_cov_matrix "Link to this definition")

Computes the covariance matrix of factor returns.

Return type:

`None`

compute\_factor\_returns()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.compute_factor_returns "Link to this definition")

Computes the factor returns.

Return type:

`None`

compute\_residual\_returns()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.compute_residual_returns "Link to this definition")

Computes the residual returns.

Return type:

`None`

compute\_residual\_risk()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.compute_residual_risk "Link to this definition")

Computes the residual risk.

Return type:

`None`

fill\_missing\_exposures()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.fill_missing_exposures "Link to this definition")

Performs the missing expsosure value filling, using the treament that is specified when adding the factor.

Return type:

`None`

fit()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.fit "Link to this definition")

Performs full pipeline of the model fitting.

Return type:

`None`

This includes:

-   outlier treatment of the exposures (for factors which require it)
    
-   factor returns computation
    
-   covariance matrix computation
    
-   residual returns computation
    
-   residual risk computation
    

proxy\_ssr()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.proxy_ssr "Link to this definition")

Proxies missing ssr values.

Return type:

`None`

treat\_exposures()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.CrossSectionalModel.treat_exposures "Link to this definition")

Performs the outlier treatment of the exposures.

Return type:

`None`

_class_ fds.fpe.quant.custom\_risk\_model.model.Model(_data_, _fitter\_config_, _cov\_matrix\_config_, _ssr\_config_, _ssr\_proxy\_config\=None_, _base\_currency\='FX\_USD'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model "Link to this definition")

Bases: `ABC`

An abstract class outlining the skeleton of a model.

Parameters:

-   **data** (_pd.DataFrame_) – The data to be used for the fitting. It should have the dependent and independent variables defined as columns. The row index should be a hierarchical index with the first level representing the date and the second level represeting the instrument.
    
-   **fitter\_config** ([_Fitter_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.fitter.Fitter "fds.fpe.quant.custom_risk_model.fitter.Fitter")) – The fitter to be used for the fitting.
    
-   **conv\_matrix\_config** ([_CovMatrix_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.covariance.CovMatrix "fds.fpe.quant.custom_risk_model.covariance.CovMatrix")) – The covariance matrix to be used for factor returns covariance computation.
    
-   **ssr\_config** ([_ResidualRiskModel_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.residuals.ResidualRiskModel "fds.fpe.quant.custom_risk_model.residuals.ResidualRiskModel")) – The residual risk model to be used for residual risk estimation.
    
-   **base\_currency** (_str__,_ _default 'USD'_) – The base currency of the model. This is valid only for multi-currency models.
    

add\_currency\_factor\_returns(_currency\_returns_, _exposure\_column_, _factor\_type\='CURRENCY'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.add_currency_factor_returns "Link to this definition")

Adds currency factor returns to the model.

Parameters:

-   **currency\_returns** (_pd.DataFrame_) – The currency factor returns. The row index should be a date index and the columns should represent the factor returns.
    
-   **exposure\_column** (_str_) – The name of the column in self.data to be used as a factor.
    
-   **factor\_type** (_str__,_ _default 'CURRENCY'_) – The type of the factor. If None, the factor will be considered as a CURRENCY factor.
    

Return type:

`None`

add\_external\_factor\_returns(_external\_returns_, _exposure\_column_, _exposure\_is\_dummy\=False_, _factor\_type\=None_, _missing\_value\_treatment\=None_, _exposures\=None_, _standardize\_exposures\=False_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.add_external_factor_returns "Link to this definition")

Adds external factor returns to the model. It can be used to pass factor returns that are required to compute the covariance matrix, e.g. currency returns or PCA factor returns.

Parameters:

-   **external\_returns** (_Union__\[__pd.DataFrame__,_ _pd.Series__\]_) – The external factor returns. The row index should be a date index and the columns should represent the factor returns. If exposure\_is\_dummy is False, this should be a pd.Series.
    
-   **exposure\_column** (_str_) – The name of the column in self.data to be used as a factor. If exposures is provided, this is also used as the column name when merging into self.data.
    
-   **exposure\_is\_dummy** (_bool__,_ _default False_) – Whether the exposure is a dummy variable. If so the factor exposure will be expanded to a dummy variable. Cannot be used together with exposures.
    
-   **factor\_type** (_str__,_ _default = None_) – The type of the factor. If None, the factor will be considered as an EXTERNAL factor.
    
-   **missing\_value\_treatment** (_list__,_ _default = None_) – Missing exposure value treatment. Only used for non-dummy factors, if None, will not be applied.
    
-   **exposures** (_pd.Series__,_ _default = None_) – Used fpr PCA factors. Factor exposure values to merge into self.data before adding the factor. If the index is a MultiIndex (date, symbol), time-varying exposures are joined on both date and symbol. Otherwise, static exposures are merged on symbol only.
    
-   **standardize\_exposures** (_bool__,_ _default = False_) – If True, cross-sectionally standardize (z-score) the exposures per date after merging into self.data. Only applies to non-dummy factors with exposures provided.
    

Return type:

`None`

add\_factor(_column_, _name\=None_, _outlier\_treatment\=None_, _missing\_value\_treatment\=None_, _factor\_type\='DEFAULT'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.add_factor "Link to this definition")

Adds a new factor to the model.

Parameters:

-   **column** (_str_) – The name of the column in the data to be used as a factor.
    
-   **name** (_str__,_ _default None_) – The name of the factor. If None, the name of the column will be used.
    
-   **outlier\_treatment** ([_OutlierTreatment_](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.factors.OutlierTreatment "fds.fpe.quant.custom_risk_model.factors.OutlierTreatment")_,_ _default None_) – The outlier treatment to be used for the factor. If None, no outlier treatment will be applied.
    
-   **factor\_type** (_str__,_ _default None_) – The type of the factor. If None, the factor will be considered as a DEFAULT factor.
    

Return type:

`None`

compute\_cov\_matrix()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.compute_cov_matrix "Link to this definition")

Computes the covariance matrix of factor returns.

Return type:

`None`

compute\_factor\_returns()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.compute_factor_returns "Link to this definition")

Computes the factor returns.

Return type:

`None`

compute\_residual\_returns()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.compute_residual_returns "Link to this definition")

Computes the residual returns.

Return type:

`None`

compute\_residual\_risk()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.compute_residual_risk "Link to this definition")

Computes the residual risk.

Return type:

`None`

fill\_missing\_exposures()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.fill_missing_exposures "Link to this definition")

Performs the missing expsosure value filling, using the treament that is specified when adding the factor.

Return type:

`None`

fit()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.fit "Link to this definition")

Performs full pipeline of the model fitting.

Return type:

`None`

This includes:

-   outlier treatment of the exposures (for factors which require it)
    
-   factor returns computation
    
-   covariance matrix computation
    
-   residual returns computation
    
-   residual risk computation
    

proxy\_ssr()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.proxy_ssr "Link to this definition")

Proxies missing ssr values.

Return type:

`None`

treat\_exposures()[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.model.Model.treat_exposures "Link to this definition")

Performs the outlier treatment of the exposures.

Return type:

`None`

## Proxy[#](https://fpe.factset.com/docs/custom_risk.html#module-fds.fpe.quant.custom_risk_model.proxy "Link to this heading")

_class_ fds.fpe.quant.custom\_risk\_model.proxy.LinearRegressionProxyModel(_proxied\_value\='ssr'_, _columns\_to\_proxy\_on\=\[\]_, _grouping\='Industries'_, _transform\_func\=None_, _transform\_inverse\_func\=None_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.proxy.LinearRegressionProxyModel "Link to this definition")

Bases: [`ProxyBase`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.proxy.ProxyBase "fds.fpe.quant.custom_risk_model.proxy.ProxyBase")

Proxy model class that proxies missing values based on OLS linear regression of specified column(residual risk, …) and security grouping, for example, country or industry groups. Then column name and grouping name should be provided the same as they are defined in the data provided to the model. The model is defined as .

Parameters:

-   **proxied\_value** (_str__,_ _default=ssr_) – The name of the column that contains the value to proxy.
    
-   **columns\_to\_proxy\_on** (_List__\[__str__\]__,_ _default=__\[__\]_) – The name of the factors in dataframe to proxy the value on by means on linear regression. For example, SIZE
    
-   **grouping** (_str__,_ _default=Industries_) – The name of grouping in dataframe that each security belongs to. Note: missing grouping values will results in NA values even in the proxied dataframe.
    
-   **transform\_func** (_Callable__(__float__)__,_ _default=None_) – Transformation function that can be applied to the proxied value so the equation become . In case the proxied value can only be negative, for example, logarithm(value) is regressed thus achieving only positive proxy values, useful for residual risk proxying. By default, it is not used.
    
-   **transform\_inverse\_func** (_Callable__(__float__)__,_ _default=None_) – Inverse of transformation function to obtain back from by means of .
    

impute\_values(_data_, _df\_to\_proxy_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.proxy.LinearRegressionProxyModel.impute_values "Link to this definition")

Method gets regression coefficients and calculates proxied values, puts them into NA values in original dataframe. Note: securities with missing grouping values will result in NA values even in proxied dataframe.

Parameters:

-   **data** (_pd.Dataframe_) – Dataframe that contains columns\_name and grouping columns for linear regression with treated exposures. Can be both wide and long format. In long format, index is date and symbol. In wide, index is date, columns index is symbol.
    
-   **df\_to\_proxy** (_pd.DataFrame_) – Dataframe that contains the value to proxy.
    

Returns:

df\_to\_proxy dataframe supplemented with proxied values in place of NAs, which could be proxied.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.proxy.ProxyBase(_proxied\_value\='ssr'_, _columns\_to\_proxy\_on\=\[\]_, _grouping\='Industries'_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.proxy.ProxyBase "Link to this definition")

Bases: `ABC`

An abstract class outlining the skeleton of proxying

fds.fpe.quant.custom\_risk\_model.proxy.create\_proxy(_name_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.proxy.create_proxy "Link to this definition")

Creates a proxy instance by name.

Parameters:

-   **name** (_str_) – The name of the proxy class.
    
-   **dependent\_column\_name** (_str_) – The name of the column containing the dependent variable.
    
-   **kwargs** (_dict_) – The keyword arguments to be passed to the proxy class.
    

Return type:

[`ProxyBase`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.proxy.ProxyBase "fds.fpe.quant.custom_risk_model.proxy.ProxyBase")

## Residuals[#](https://fpe.factset.com/docs/custom_risk.html#module-fds.fpe.quant.custom_risk_model.residuals "Link to this heading")

_class_ fds.fpe.quant.custom\_risk\_model.residuals.EWMResidualRiskModel(_window\=10_, _halflife\=1_, _min\_periods\=2_, _lags\=0_, _annualization\_factor\=None_, _unbiased\=False_, _is\_wide\=False_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.residuals.EWMResidualRiskModel "Link to this definition")

Bases: [`ResidualRiskModel`](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.residuals.ResidualRiskModel "fds.fpe.quant.custom_risk_model.residuals.ResidualRiskModel")

Exponentially weighted moving average residual risk model.

Parameters:

-   **window** (_int_) – The size of the moving window.
    
-   **halflife** (_int_) – The halflife for decaying weights.
    
-   **min\_periods** (_int defaults to 2_) – Minimum number of observations to have a value (otherwise result is NA)
    
-   **lags** (_int defaults to 0_) – The number of lags for the Newey-West estimator. If 0, the estimator is not applied.
    
-   **annualization\_factor** (_Union__\[__int__,_ _None__\]__,_ _default = None_) – Annualization factor of residual risk, should be the same as for covariance matrix.
    
-   **unbiased** (_bool defaults to False_) – Whether to calculate the unbiased estimator.
    
-   **is\_wide** (_bool defaults to True_) – Whether the input is a wide or long dataframe.
    

compute(_residuals_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.residuals.EWMResidualRiskModel.compute "Link to this definition")

A function to compute the exponentially weighted moving standard deviation of the residuals.

Parameters:

**residuals** (_pd.DataFrame_) – A wide dataframe with residuals. The row index is the date and the columns represent each instrument.

Returns:

The residual risk estimates.

Return type:

pd.DataFrame

_class_ fds.fpe.quant.custom\_risk\_model.residuals.ResidualRiskModel[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.residuals.ResidualRiskModel "Link to this definition")

Bases: `ABC`

_abstract_ compute(_residuals_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/custom_risk.html#fds.fpe.quant.custom_risk_model.residuals.ResidualRiskModel.compute "Link to this definition")

Computes the residual risk model.

Parameters:

-   **residuals** (_pd.DataFrame_) – A wide dataframe with residuals. The row index is the date and the columns represent each instrument.
    
-   **\*\*kwargs** – Additional keyword arguments.
    

Returns:

The residual risk model.

Return type:

pd.DataFrame
