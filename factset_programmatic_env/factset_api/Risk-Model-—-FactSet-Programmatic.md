---
created: 2026-05-11T13:07:01 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/risk_model.html
author: 
---

# Risk Model — FactSet Programmatic

> ## Excerpt
> Provides utilities to load parametric equity risk model data such as specific risk, risk factor
exposures, and risk factor covariance. Also, provides methods to calculate analytics derived
from the above data such as asset covariance, portfolio risk factor exposures, portfolio
variance, and portfolio covariance.

---
## Risk Model[#](https://fpe.factset.com/docs/risk_model.html#id1 "Link to this heading")

_class_ fds.fpe.quant.risk\_model.RiskModel(_univ_, _model\_id\='FDS:GLOBAL\_EQUITY\_M\_V1'_, _progress\_bars\=True_, _dtype\='float64'_, _batch\_size\=50000000.0_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel "Link to this definition")

Provides utilities to load parametric equity risk model data such as specific risk, risk factor exposures, and risk factor covariance. Also, provides methods to calculate analytics derived from the above data such as asset covariance, portfolio risk factor exposures, portfolio variance, and portfolio covariance.

Parameters:

-   **univ** (_Universe_) – The universe for which to fetch data. This can be any type of universe. For example: IdentifierUniverse, OFDBUniverse, ScreeningExpressionUniverse, ScreeningDocumentUniverse
    
-   **model\_id** (_str_) – Risk model ID specifying the source model for risk factor exposures, covariances and specific risk. Use RiskModel.search() to find the desired model ID.
    
-   **progress\_bars** (_bool__,_ _default True_) – Whether to show the progress bars when fetching different data components.
    
-   **dtype** (_dtype__,_ _default 'float64'_) – Data type to force on all numeric attributes.
    
-   **batch\_size** (_int_ _or_ _float__,_ _default 5e7_) – The maximum number of datapoints fetched in a single batch.
    

load\_data(_dates\=None_, _factors\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.load_data "Link to this definition")

A helper method that initializes specific\_risk, risk\_factor\_exposures, and risk\_factor\_covariance

Parameters:

-   **dates** (_Timestamp_ _or_ _datetime_ _or_ _str_ _or_ _list_ _of_ _Timestamp_ _or_ _list_ _of_ _datetime_ _or_ _list_ _of_ _str__,_ _default None_) – Dates for which the risk model data are loaded. If `None` all dates in the universe are used.
    
-   **factors** (_a single_ _or_ _a list_ _of_ _factor name str__,_ _default None_) – Risk factors for which the risk model data are loaded. If `None` all risk factors from the model are used.
    

risk\_factors(_as\_list\=False_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.risk_factors "Link to this definition")

Get a series of risk factors indexed by factor group.

If risk factor data is not loaded, will load them first based on the risk model specified by self.model\_id and the groups according to self.groups.

Parameters:

**as\_list** (_bool__,_ _default False_) – If True the factors ar returned as a list. If False, the factors ar returned as a pandas Series.

Returns:

Series Series of risk factor names with groups as index if `self.groups` is not `None`, numeric index otherwise.

Return type:

risk\_factors

specific\_risk(_dates\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.specific_risk "Link to this definition")

Get specific risk data for the assets in the universe each of the specified dates.

If specific risk data is not loaded, will load them first based on the risk model specified by self.model\_id.

Parameters:

**dates** (_Timestamp_ _or_ _datetime_ _or_ _str_ _or_ _list_ _of_ _Timestamp_ _or_ _list_ _of_ _datetime_ _or_ _list_ _of_ _str__,_ _default None_) – Dates for which specific risk data are loaded and returned. If `None` all dates in the universe are used.

Returns:

multiindex (date, symbol) data series

Return type:

specific\_risk

risk\_factor\_exposures(_dates\=None_, _factors\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.risk_factor_exposures "Link to this definition")

Get the asset exposures to the risk factors.

If risk factor exposure data is not loaded for given dates or risk factors, will load them first based on the risk mode specified by self.model\_id.

Parameters:

-   **dates** (_Timestamp_ _or_ _datetime_ _or_ _str_ _or_ _list_ _of_ _Timestamp_ _or_ _list_ _of_ _datetime_ _or_ _list_ _of_ _str__,_ _default None_) – Dates for which risk factor exposures are loaded and returned. If `None` all dates in the universe are used.
    
-   **factors** (_a single_ _or_ _a list_ _of_ _factor name str__,_ _default None_) – Risk factors for which exposures are loaded and returned. If `None` all risk factors from the model are used.
    

Returns:

DataFrame with (date, symbol) index and risk factor columns Exposures to the risk factors based on the risk mode specified by self.model\_id.

Return type:

risk\_factor\_exposures

risk\_factor\_covariance(_dates\=None_, _factors\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.risk_factor_covariance "Link to this definition")

Get the covariance matrix of the risk factors in the risk model for each of the specified dates.

If the covariance data is not loaded, will load them first based on the dates requested and the risk model specified by self.model\_id.

Parameters:

-   **dates** (_Timestamp_ _or_ _datetime_ _or_ _str_ _or_ _list_ _of_ _Timestamp_ _or_ _list_ _of_ _datetime_ _or_ _list_ _of_ _str__,_ _default None_) – Dates for which risk factor covariance matrices are loaded and returned. If `None` all dates in the universe are used.
    
-   **factors** (_a single_ _or_ _a list_ _of_ _factor name str__,_ _default None_) – Risk factors for which covariance matrices are loaded and returned. If `None` all risk factors from the model are used.
    

Returns:

multiindex (date, risk\_factor) DataFrame, risk factor columns

Return type:

risk\_factor\_covariance

asset\_covariance(_asset\_data\=None_, _dates\=None_, _symbols\=None_, _match\_ison\_index\=False_, _progress\_bar\=True_, _inverse\=False_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.asset_covariance "Link to this definition")

Calculate the asset covariance matrix for specified dates and symbols. Inverse of asset covariance matrix also available - this uses an optimized algorithm for faster calculation.

Parameters:

-   **asset\_data** (_(__date__,_ _symbol__)_ _MultiIndex_ _or_ _DataFrame_ _or_ _Series with_ _(__date__,_ _symbol__)_ _MultiIndex_ _or_ _None_) – The MultiIndex is used to specify the dates and symbols for which asset covariance is returned. If None dates and symbols arguments are used.
    
-   **dates** (_list_ _of_ _dates_ _or_ _a single date_ _or_ _None_) – Dates for which asset covariance is returned. Used only if asset\_data is `None`. If `None` all dates in the universe are used.
    
-   **symbols** (_list_ _of_ _symbols_ _or_ _None_) – Symbols for which asset covariance is returned. Used if asset\_data is None. If `None` all symbols part of the universe for the included dates are used.
    
-   **match\_ison\_index** (_bool__,_ _default False_) – If True the asset covariance DataFrame index and columns are expanded to contain all symbols from universe.ison\_univ for the requested dates. If False only symbols that are part of the universe for a given date are included.
    
-   **progress\_bar** (_bool__,_ _default True_) – Whether to show the progress bar.
    
-   **inverse** (_bool__,_ _default False_) – When True, will return the inverse of the asset covariance matrix instead
    

Returns:

multiindex (date, symbol) dataframe, columns (symbol)

Return type:

asset\_covariance

portfolio\_risk\_factor\_exposures(_weights_, _dates\=None_, _risk\_factors\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.portfolio_risk_factor_exposures "Link to this definition")

Calculates the risk factor exposures of a portfolio by date based on the provided weights and risk factor model parameters.

Parameters:

-   **weights** (_Series_ _or_ _DataFrame indexed by symbol_ _or_ _by_ _(__date__,_ _symbol__)_ _MultiIndex_) – Portfolio weights used to calculate the variance for each date. If indexed by just symbol, dates argument must be provided.
    
-   **dates** (_list_ _of_ _dates_ _or_ _a single date_ _or_ _None_) – Dates for the variance calculations. If None, weights should have (date, symbol) MultiIndex.
    
-   **risk\_factors** (_list_ _or_ _None_) – List of risk factors for which to return exposures. Must be a subset of self.risk\_factors. If None exposures for all factors in self.risk\_factors are returned.
    

Returns:

Series or DataFrame (‘date’, ‘risk\_factor’ Multiindex) Type and columns match the type and columns of weights.

Return type:

portfolio\_factor\_exposures

portfolio\_covariance(_weights_, _dates\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.portfolio_covariance "Link to this definition")

Calculates the covariance between a set of portfolios by date based on the provided weights and risk factor model parameters.

Parameters:

-   **weights** (_DataFrame indexed by symbol_ _or_ _by_ _(__date__,_ _symbol__)_ _MultiIndex_) – Each column should contain portfolio weights used to calculate the covariances for each date. If indexed by just symbol, dates argument must be provided.
    
-   **dates** (_list_ _of_ _dates_ _or_ _a single date_ _or_ _None_) – Dates for the covariance calculations. If None, weights should have (date, symbol) MultiIndex.
    

Returns:

DataFrame with (date, portfolio) MultiIndex Each date contains a square covariance matrix with portfolio index and columns

Return type:

portfolio\_covariance

portfolio\_variance(_weights_, _dates\=None_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.portfolio_variance "Link to this definition")

Calculates the variance of a portfolio by date based on the provided weights and risk factor model parameters.

Parameters:

-   **weights** (_DataFrame_ _or_ _Series indexed by symbol_ _or_ _by_ _(__date__,_ _symbol__)_ _MultiIndex_) – Portfolio weights used to calculate the variance for each date. If indexed by just symbol, dates argument must be provided.
    
-   **dates** (_list_ _of_ _dates_ _or_ _a single date_ _or_ _None_) – Dates for the variance calculations. If None, weights should have (date, symbol) MultiIndex.
    

Returns:

Series or DataFrame (‘date’) index Type and columns match the type and columns of weights.

Return type:

portfolio\_variance

coverage(_scope\='all'_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.coverage "Link to this definition")

Calculates the percentage of non-NA values by date for the initialized components of the risk factor model (specific\_risk, risk\_factor\_exposures, risk\_factor\_covariance, asset\_covariance).

If a component is not initialized, the respective column shows NAs. For risk\_factor\_exposures and asset\_covariance only symbols for which ison\_univ is True are considered for the coverage calculation.

Parameters:

**scope** (_str__,_ _either_ _of_ _{'all'__,_ _'exposures'}__,_ _default 'all'_) – If ‘all’, coverage summary DataFrame contains a column for each risk model data item. If ‘exposures’, a coverage summary for risk\_factor\_exposures is returned with coverage by risk factor in each column.

Returns:

DataFrame

Return type:

coverage

_classmethod_ custom(_univ_, _specific\_risk_, _risk\_factor\_exposures_, _risk\_factor\_covariance_, _model\_id\='custom'_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.custom "Link to this definition")

Initialize a risk model instance from custom data.

Parameters:

-   **univ** (`ScreeningExpressionUniverse` or `IdentifierUniverse`) – A universe defining a time range, data frequency, and set of symbols for the risk model.
    
-   **specific\_risk** (_multiindex_ _(__date__,_ _symbol__)_ _series_) – Specific risk data series. Index should match univ.ison\_univ.index.
    
-   **risk\_factor\_exposures** (_multiindex_ _(__date__,_ _symbol__)_ _dataframe_) – Factor exposure data frame. Index should match univ.ison\_univ.index.
    
-   **risk\_factor\_covariance** (_multiindex_ _(__date__,_ _risk\_factor__)_ _dataframe_) – Factor covariance data frame. Index level 1 (risk\_factor) for each date should match the risk factors in the dataframe columns.
    
-   **model\_id** (_str__,_ _optional__,_ _default 'custom'_) – A string identifying the risk model. When custom data is provided, this is used for labeling purposes only.
    

Returns:

RiskModel

Return type:

instance

to\_hdf(_filename_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.to_hdf "Link to this definition")

Serialize a risk model instance to HDF5.

Parameters:

**filename** (_str_) – A path to an HDF5 file (existing files will be overwritten).

_classmethod_ from\_hdf(_h5filename_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.from_hdf "Link to this definition")

Initialize a risk model instance from HDF5.

Parameters:

**h5filename** (_str_) – The path to the HDF5 file to use

Returns:

RiskModel

Return type:

instance

_static_ supported\_risk\_models()[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.supported_risk_models "Link to this definition")

Returns a DataFrame of supported risk with Model ID, Model Name, and Base Currency columns.

_static_ search()[#](https://fpe.factset.com/docs/risk_model.html#fds.fpe.quant.risk_model.RiskModel.search "Link to this definition")

Starts a widget for searching supported risk models by Model ID, Model Name, and Base Currency.
