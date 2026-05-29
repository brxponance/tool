---
created: 2026-05-11T13:07:16 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/optimal_weights_engine.html
author: 
---

# Optimal Weights Engine — FactSet

> ## Excerpt
> The optimal_weights_engine module provides ability to use various frameworks to generate an optimal mix of individual
alpha signals given an investment objective and a set of desirable investment constraints.
The individual signal definitions and performance are sourced form a Backtest class instance.

---
The optimal\_weights\_engine module provides ability to use various frameworks to generate an optimal mix of individual alpha signals given an investment objective and a set of desirable investment constraints. The individual signal definitions and performance are sourced form a Backtest class instance.

Various optimization objectives are supported (Maximum Information Ratio, Maximum Return, Minimum Variance, and Risk Parity), as well as, more sophisticated approaches like calculating the optimal weights based on the risk-adjusted Information Coefficients of the signals. A variety of constraints can be imposed on the optimization:

> -   signal weights constraints for a single or a group of signals
>     
> -   asset weights constraints for a single or a group of asset
>     
> -   signal contribution to risk constraints for a single or a group of signals
>     
> -   minimum expected return target for the optimal mix
>     
> -   maximum expected risk target for the optimal mix
>     
> -   turnover constraint
>     
> -   risk factor exposure constraints
>     

To facilitate a better integration in an investment workflow the module allows calculating of the optimal mix for multiple dates, thus allowing back-testing of the given framework. Additionally, the optimal weights can be calculated on a group level (e.g. an optimal mix of signals for each sector).

The results of the optimization (for a given date/group pair) can be extracted either as weights by signal or as composite signal scores. Integrated with the Optimal Weights Engine output are a multitude of reporting methods for comparing the results form different frameworks, visualizing the changes in the optimal mix over time, analyzing the differences between signal weights in different groups (an example plot below).

  weights\_by\_sector

In \[16\]:

```
result.plot_weights_by_group()
```

## OptimalWeightsEngine[#](https://fpe.factset.com/docs/optimal_weights_engine.html#optimalweightsengine "Link to this heading")

```
from fds.fpe.quant.backtest import Backtest
from fds.fpe.quant.optimal_weights_engine import OptimalWeightsEngine

# Load Backtest object
bt = Backtest.from_hdf('my_backtest.h5')

# Initialize Optimal Weights Engine
owe = OptimalWeightsEngine(backtest=bt)
```

_class_ fds.fpe.quant.optimal\_weights\_engine.OptimalWeightsEngine(_backtest_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine "Link to this definition")

Provide utilities to find optimal mix of a set of signals based on different optimization frameworks.

Parameters:

**backtest** ([_fds.fpe.quant.backtest.Backtest_](https://fpe.factset.com/docs/backtest.html#fds.fpe.quant.backtest.Backtest "fds.fpe.quant.backtest.Backtest")) – Instance of the Backtest class used to source the signals that will be used in the optimization. All the data that is needed for the optimal weights calculation is fetched using the Backtest class functionalities.

calculate\_raic\_based(_signals\=None_, _risk\_factors\=None_, _constraints\=None_, _initial\_weights\=None_, _eval\_date\=None_, _time\_window\=None_, _half\_life\=None_, _exp\_smoothing\_factor\=None_, _grouping\=None_, _rolling\_calc\=False_, _rolling\_start\_date\=None_, _ignore\_first\_date\_turnover\=True_, _reweight\_every\=1_, _expanding\_window\=False_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.calculate_raic_based "Link to this definition")

Calculate optimal mix signals using a risk-adjusted Information Coefficient objective. Based on Sorensen et.al. - \[2004\] - Multiple Alpha Sources and Active Management. Grouping-level calculations not available yet.

Parameters:

-   **signals** (`List` | `Dict` | [`SignalSelectorOutput`](https://fpe.factset.com/docs/signal_selector.html#fds.fpe.quant.signal_selector.SignalSelectorOutput "fds.fpe.quant.signal_selector._signal_selector_output.SignalSelectorOutput") | `None`) –
    
    When `None`, all signals from the `Backtest` instance are used. When list-like (not dict), it’s a list of signals to be eval dates and groups. A dict input is accepted for more customizable runs with a separate list of signals to be considered for each date and/or group to be analysed, the dict must follow the structure:
    
    ```
    signal_ids={
        <date>: {  # datetime.datetime, pandas.Timestamp, or str in 'YYYY-MM-DD' format
            <group>: [<list of signal ids>],
            ...  # more groups
        },
        ...  # more dates
    }
    ```
    
    First layer of keys is for dates, the second for groupings of assets. It can also accept a dict with only one of the layers-assumed to be the same across the other. Dates must be `datetime.datetime` parsable: e.g. `'YYYY-MM-DD'` format. When calculation is performed on an evaluation date not explicitly in the dict it takes the entry from most recent preceeding date, or the chronologically first one if all dates in the dict are after the eval date.
    
    Groups other than `'universe'` must match names of groups coming from grouping parameters (grouping, custom\_grouping\_series). When `SignalSelectorOutput` is used, it must be from a method that explicitly selects signals (e.g. `vif_select(), lasso_select()`) and the selected signals (dict) will be used as the `signal_ids`. The following list of parameters are overridden with their equivalents used in the SS method:
    
    ```
    [signal_ids, lag, eval_date, time_window, rolling_calc,
    reweight_every(rolling_every), grouping, custom_grouping_series, keep_universe,
    risk_adjust_scores, adjust_by_groups, rolling_start_date, expanding_window]
    ```
    
    With the exception that if the SS selection is performed for one date but multiple dates are defined with the input parameters (e.g. `rolling_calculation=True`) this ‘extention’ will be allowed. Similarly, if SS calculation is not grouped, but grouping parameters are passed, this ‘extention’ will also not be overridden.
    
-   **risk\_factors** (`List` | `None`) – List of risk factor names to be used in the custom multivariate regression specific for this framework. These should be valid names of factors in `Backtest.risk_model` or valid columns names in `Backtest.data`.
    
-   **constraints** ([`Constraints`](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints "fds.fpe.quant.optimal_weights_engine._optimizer.Constraints") | `None`) –
    
    `Constraints` instance that defines the constraints to be used in the optimization. Currently, only the following types of constraints are supported:
    
    ```
    [signal_weights, short_sale_max_leverage, turnover_limit]
    ```
    
-   **initial\_weights** (`ndarray` | `Series` | [`OptimalWeightsEngineOutput`](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "fds.fpe.quant.optimal_weights_engine._engine_output.OptimalWeightsEngineOutput") | `Dict` | `None`) – Initial signal mix weights for the optimization. If `None`, equal weights will be used. If using grouping, a `dict` can be passed with keys each group label - specifying initial weights for each group- length of list-likes must match number of signals for the respective group, `pd.Series` index must also match signal names. If a group uses the same signals as the `'universe'` group and no weights are provided for that group it will infer the same initial weights as `'universe'`. If entry for a group is invalid or missing, and there also isn’t a valid entry from `'universe'` to substitute for that group - equal weights will be used A `pandas.Series` will be interpreted as relative weights for the signals used across all groups. For each group take the relevant signals respectively and use initial weights normalized to sum of 1. If a signals used in a group is not in the series, will fallback to equal weights. A list-likes (not `pd.Series`) are interpreted as initial weights only for the `'universe` group and groups that use exactly the same signals (length must match number of signals). Groups where this input is invalid will use equal-weights. Use\`\`OptimalWeightsEngineOutput\`\` to treat the resulting weights from a previous optimization as the initial weights. Set of signals must match (for each group). If a group is not part of the result groups - will attempt to infer weights from the `'universe'` group if signals match. All other invalid inputs fall back to equal initial weights.
    
-   **eval\_date** (`str` | `datetime` | `Timestamp` | `List` | `None`) – The evaluation date. When `None` will take the latest available date in Backtest. `str` must be `'YYYY-MM-DD'` format. For rolling calculations, this is the last date and `rolling_start_date` is also required.
    
-   **time\_window** (`int` | `None`) – The number of periods (`Backtest`’s frequency) that will be used for the Risk Adjusted Information Coefficient covariance and mean estimation. If `None`, use the maximum available time window - from `bt.start` to (first) evaluation date.
    
-   **half\_life** (`float` | `None`) – If specified, exponential smoothing with this half-life is used in estimating the expected ICs and their covariance that are used in the optimization. The value should be greater than 0. If provided, exp\_smoothing\_factor is ignored.
    
-   **exp\_smoothing\_factor** (`float` | `None`) –
    
    If specified, exponential smoothing with this smoothing factor is used in estimating the expected ICs and their covariance that are used in the optimization. The value should be greater than 0 and less than or equal to 1. Can be derived from the half-life by the following formula:
    
    > , for .
    
-   **grouping** (`str` | `None`) – Placeholder argument. This functionality will be available soon. Specifies grouping criteria by which the optimal combination of signal will be calculated.
    
-   **rolling\_calc** (`bool`) – If True will perform a rolling calculation - starging at `rolling_start_date` (required) and ending at `eval_date`. Use `reweight_every, expanding_window` for further customisation.
    
-   **rolling\_start\_date** (`str` | `datetime` | `Timestamp` | `None`) – Required if `rolling_calc` is `True`. This will be the first evaluation date, rolling up to `eval_date` (may not be included depending on aligning of `rolling_every`)
    
-   **ignore\_first\_date\_turnover** (`bool`) – If True the turnover constraint component of constraints is ignored for the first date in the rolling optimal weights calculations. Applicable only if `rolling_calc==True`.
    
-   **reweight\_every** (`int`) –
    
    When performing a rilling calculation (`rolling_calc=True`), this can be specified to calculate weights on every n-th date (`rolling_every=n`) only. Example: Say you have 10 years of monthly data (2010-2020) and want to optimize weights with a rolling 5-year time-window once a year, say December, then specify:
    
    ```
    eval_date=None  # Goes as far as possible (Dec 2020)
    time_window=60,
    rolling_calc=True,
    rolling_start_date=datetime.datetime(2015, 12, 31),
    reweight_every=12,
    ```
    
-   **expanding\_window** (`bool`) – Only for rolling calculations. If `True` use an expanding time-window, starting with `time_window` at `rolling_start_date`.
    

Returns:

Object containing the optimal weights and associated statistics as well as reporting functionality.

Return type:

[OptimalWeightsEngineOutput](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput")

calculate\_cross\_sectional\_regression(_signals\=None_, _model\='ols+'_, _model\_params\=None_, _target\='asset\_returns'_, _eval\_date\=None_, _time\_window\=None_, _grouping\=None_, _custom\_grouping\_series\=None_, _specific\_groups\_only\=None_, _rolling\_calc\=False_, _rolling\_start\_date\=None_, _retrain\_every\=1_, _expanding\_window\=False_, _risk\_adjust\_scores\=False_, _adjust\_by\_groups\=False_, _knn\_smoothing\=False_, _report\_feature\_importance\=False_, _drop\_coverage\_threshold\=0.5_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.calculate_cross_sectional_regression "Link to this definition")

Run rolling / expanding cross-sectional regressions to generate asset-level scores.

This method trains cross-sectional models on historical data to predict a target variable (e.g. asset returns or excess returns) using a set of input signals. Models are trained separately per group (e.g. sector, industry, or universe) and optionally re-trained on a rolling or expanding window schedule.

The method supports multiple linear, regularized, neural-network, and tree-based models, including cross-validated variants (e.g. RidgeCV, ElasticNetCV), as well as custom user-supplied estimators. Predictions may optionally be smoothed using a k-nearest-neighbors post-processing step.

Parameters:

-   **signals** (_{None__,_ _list__,__dict__,_ _SignalSelectorOutput}__,_ _default None_) –
    
    When `None`, all signals from the `Backtest` instance are used.
    
    When list-like (not dict), it’s a list of signals to be eval dates and groups.
    
    A dict input is accepted for more customizable runs with a separate list of signals to be considered for each date and/or group to be analysed, the dict must follow the structure:
    
    ```
    signal_ids={
        <date>: {  # datetime.datetime, pandas.Timestamp, or str in 'YYYY-MM-DD' format
            <group>: [<list of signal ids>],
            ...  # more groups
        },
        ...  # more dates
    }
    ```
    
    First layer of keys is for dates, the second for groupings of assets. It can also accept a dict with only one of the layers-assumed to be the same across the other.
    
    Dates must be `datetime.datetime` parsable: e.g. `'YYYY-MM-DD'` format. When calculation is performed on an evaluation date not explicitly in the dict it takes the entry from most recent preceeding date, or the chronologically first one if all dates in the dict are after the eval date./n Groups other than `'universe'` must match names of groups coming from grouping parameters (grouping, custom\_grouping\_series).
    
    When `SignalSelectorOutput` is used, it must be from a method that explicitly selects signals (e.g. `vif_select(), lasso_select()`) and the selected signals (dict) will be used as the `signal_ids`. The following list of parameters are overridden with their equivalents used in the SS method:
    
    ```
    [signal_ids, lag, eval_date, time_window, rolling_calc,
    reweight_every(rolling_every), grouping, custom_grouping_series, keep_universe,
    risk_adjust_scores, adjust_by_groups, rolling_start_date, expanding_window]
    ```
    
    With the exception that if the SS selection is performed for one date but multiple dates are defined with the input parameters (e.g. `rolling_calculation=True`) this ‘extention’ will be allowed. Similarly, if SS calculation is not grouped, but grouping parameters are passed, this ‘extention’ will also not be overridden.
    
-   **model** (_str_ _or_ _object__,_ _default 'ols+'_) –
    
    1) Built-in model by name (string) Model identifier (case-insensitive). Supported values include:
    
    -   Linear models:
        
        -   `'ols'` : Ordinary least squares; defaults to LinearRegression(fit\_intercept=True, positive=False)
            
        -   `'ols+'` : OLS with non-negative coefficients; defaults to LinearRegression(fit\_intercept=True, positive=True)
            
        -   `'ridge'` : Ridge regression; defaults to Ridge(alpha=1.0, fit\_intercept=True) OR RidgeCV if alpha not provided
            
        -   `'ridge+'` : Ridge regression (positivity enforced when alpha is given); defaults to Ridge(positive=True) when alpha is provided; RidgeCV otherwise (positivity ignored)
            
        -   `'lasso'` : Lasso regression; defaults to Lasso(alpha=1.0, fit\_intercept=True)
            
        -   `'lasso+'` : Lasso regression with non-negative coefficients; defaults to Lasso(alpha=1.0, fit\_intercept=True, positive=True)
            
        -   `'enet'` : Elastic Net (CV used if alpha not provided); defaults to ElasticNet(alpha, l1\_ratio) if alpha is provided, else ElasticNetCV with default grids: .. code-block:: python
            
            > alphas=np.logspace(-8, -2, 10), l1\_ratio\_grid=\[0.01, 0.1, …, 0.99\], cv=5, max\_iter=1000
            
    -   Neural networks:
        
        -   `'nn1'` : MLP with 1 hidden layer (32,)
            
        -   `'nn2'` : MLP with 2 hidden layers (32, 16)
            
        -   `'nn3'` : MLP with 3 hidden layers (32, 16, 8)
            
        -   `'nn4'` : MLP with 4 hidden layers (32, 16, 8, 4)
            
        -   `'nn5'` : MLP with 5 hidden layers (32, 16, 8, 4, 2)
            
        -   `'nn_custom'` : builds a custom NN using `model_params['hidden_layer_sizes']` (default (100,)) plus optional `model_params['activation']`, `model_params['max_iter']`, `model_params['seed']`
            
        
        All NN models use sklearn’s MLPRegressor with following default values:
        
        -   tanh activation
            
        -   max\_iter = 1000
            
        -   fixed random\_state = 42
            
    -   Tree-based:
        
        -   `'gb'` or `'grad_boosting'` : Histogram-based gradient boosting (sklearn.ensemble.HistGradientBoostingRegressor)
            
            Default configuration (can be overwritten by model\_params):
            
            -   max\_iter = 100
                
            -   learning\_rate = 0.1
                
            -   max\_depth = 5
                
            -   random\_state fixed to 42
                
    
    2) External estimator instance Pass a pre-instantiated sklearn-compatible estimator in model (recommended), e.g. model=RandomForestRegressor(…). The estimator must implement:
    
    -   fit(X, y)
        
    -   predict(X)
        
-   **model\_params** (_dict__,_ _default None_) –
    
    Dictionary of hyperparameters passed to the underlying estimator. Special handling includes:
    
    -   `'alpha'` / `'l1_ratio'` for ridge, lasso, elastic net
        
    -   `'alphas'` for ridge/ridge+ triggers cross-validation (RidgeCV) with the provided alphas
        
    -   `'n_signals'` (lasso/lasso+) triggers cardinality-style alpha search that finds the smallest alpha producing at most ‘n\_signals’ non-zero coefficients
        
    -   `'seed'` sets random\_state for stochastic models
        
    -   `'fit_intercept'` can override default fit\_intercept behavior being True
        
-   **target** (_str__,_ _default 'asset\_returns'_) –
    
    Dependent variable to predict. Supported values include:
    
    -   `'asset_returns'` (same as `'raw_returns'` and `'returns'`)
        
    -   `'excess_returns_bmk'` for raw\_return - bmk\_return
        
    -   `'excess_returns_univ'` for raw\_return - universe\_return (equally-weighted universe)
        
-   **eval\_date** (_{None__,_ _str__,_ _datetime.datetime pandas.Timestamp}__,_ _default None_) –
    
    The evaluation date. When `None` will take the latest available date in Backtest. `str` must be `'YYYY-MM-DD'` format.
    
    For rolling calculations, this is the last date and `rolling_start_date` is also required.
    
-   **time\_window** (_int__,_ _default None_) –
    
    Length of the historical lookback window (in periods) used to train each cross-sectional model.
    
    When provided, the training sample for a given evaluation date consists of the most recent time\_window observations ending at that date (subject to rolling or expanding window logic).
    
    Behavior depends on other flags:
    
    -   If `rolling_calc=True` and `expanding_window=False`, a fixed-length rolling window of size `time_window` is used.
        
    -   If `expanding_window=True`, `time_window` defines the minimum number of initial periods before training begins; the window then expands over time.
        
    -   If `rolling_calc=False`, `time_window` is applied once for the evaluation date only.
        
-   **grouping** (_{None__,_ _'sector'__,_ _'backtest\_grouping'__,_ _'custom'} default None_) –
    
    If not `None`, determines the asset grouping criteria.
    
    `'sector'`: use `Backtest.sectors` grouping and `Backtest`’s sector level signal calculations.
    
    `'backtest_grouping'` : use `Backtest.grouping` grouping and `Backtest`’s group level signal calculations. If `Backtest.grouping` is not pre-defined it can be supplied and set with the `custom_grouping_series` parameter. (same as doing `bt.grouping = custom_grouping_series` separately)
    
-   **custom\_grouping\_series** (_{None__,_ _pandas.Series__,_ _str}__,_ _default None_) – If `grouping == 'backtest_grouping'` this can be used to set `Backtest.grouping` if it’s not already set; will raise an error if is already set and this is different. If `str` - must match the name of a categorical datafield in `Backtest.data`. If `pd.Series` must be categorical series assigning groups to assets with index matching `Backtest`’s universe - (date, symbol) multiindex.
    
-   **specific\_groups\_only** (_list__,_ _default None_) – List of specific group names to process. If None, processes all groups.
    
-   **rolling\_calc** (_bool__,_ _default False_) – If `True` the optimal weight mix is calculated for multiple dates on a rolling basis - starging at `rolling_start_date` (required) and ending at `eval_date`. Use `reweight_every, expanding_window` for further customisation.
    
-   **rolling\_start\_date** (_{None__,_ _str__,_ _datetime.datetime__,_ _pandas.Timestamp}__,_ _default None_) – Required if `rolling_calc` is `True`. This will be the first evaluation date, rolling up to `eval_date` (may not be included depending on aligning of `reweight_every`)
    
-   **retrain\_every** (_int__,_ _default 1_) – Frequency (in periods) to retrain the model.
    
-   **expanding\_window** (_bool__,_ _default False_) – Only for rolling calculations. If `True` use an expanding time-window, starting with `time_window` at `rolling_start_date`.
    
-   **risk\_adjust\_scores** (_bool__,_ _default False_) – Whether to risk-adjust the input signal scores before main regression.
    
-   **adjust\_by\_groups** (_bool__,_ _default False_) – Whether to standardize signals within groups.
    
-   **knn\_smoothing** (_dict_ _or_ _bool__,_ _default False_) – Configuration for KNN smoothing of predictions (uses KNeighborsRegressor from sklearn). Keys: ‘n\_neighbors’ (int), ‘weights’ (‘uniform’, ‘distance’ or callable); see KNeighborsRegressor documentation.
    
-   **report\_feature\_importance** (_bool__,_ _default False_) –
    
    If True, computes and returns global feature importance calculated at each model training (retraining) date for every processed group.
    
    The importance computation method depends on the model family:
    
    -   External models (my\_ML\_instance): use native sklearn metrics when available (feature\_importances\_ or coef\_), otherwise use sklearn permutation importance.
        
    -   Built-in neural networks (`'nn1'`\-`'nn5'`): permutation importance.
        
    
    Other built-in models:
    
    -   Tree models (`'gb'`/`'grad_boosting'`): Shapley TreeExplainer (from shap).
        
    -   Linear models (`'ols'`, `'ols+'`, `'ridge'`, `'ridge+'`, `'lasso'`, `'lasso+'`, `'enet'`, `'elasticnet'`): Shapley LinearExplainer (from shap).
        
-   **drop\_coverage\_threshold** (_float_ _\[__0__,__1__\] or_ _None_) – if provided, is used as a threshold for coverage check to drop regressors due to insufficient data
    

Returns:

If report\_feature\_importance=False (default), returns a pandas Series of composite signal scores with a MultiIndex (Date, Symbol), calculated as the model-predicted scores.

If report\_feature\_importance=True, returns a tuple (scores, feature\_importance) where scores is the same pandas Series as above and feature\_importance is a nested dictionary mapping feature\_importance\[date\]\[group\] to a pandas Series of relative feature importance coefficients (summing to 1.0) computed at each training date.

Return type:

pandas.Series or tuple

Examples

**Running Cross-Sectional Regression with a Built-in Model**

Compute a rolling cross-sectional composite score using a sparse, non-negative Lasso model and append it to a backtest:

```
>>> composite_score = owe.calculate_cross_sectional_regression(
...     model='lasso+',
...     model_params={'n_signals': 3},
...     signals=['AssetTurnover', 'STreversal', 'Investment', 'Idio_vol', 'BidAskSpread'],
...     target='asset_returns',
...     eval_date='2024-12-31',
...     time_window=12,
...     grouping='sector',
...     rolling_calc=True,
...     rolling_start_date='2016-12-30',
...     retrain_every=3,
...     expanding_window=False,
... )
```

In this example:

-   Separate cross-sectional models are trained **per sector**.
    
-   A cross-sectional regression is run using the most recent 12 periods of data at each retraining date.
    
-   Models are retrained every 3 periods using a rolling window.
    
-   A non-negative Lasso regression (‘lasso+’) is used to select up to 3 signals per training window.
    
-   Sector-specific models are applied to generate asset-level scores, which are then combined into a single cross-sectional signal.
    

The resulting time series of asset-level scores can then be added to a backtest and evaluated:

```
>>> bt.append_signal(
...     signal=composite_score,
...     signal_id='ML_composite',
...     mode='univariate'
... )
>>> bt.run_backtest()
```

**Running Cross-Sectional Regression with a Custom Tree-Based Model (using an Expanding Window)**

Use a custom Random Forest regressor with an expanding training window for nonlinear, tree-based cross-sectional modeling:

```
>>> from sklearn.ensemble import RandomForestRegressor
```

```
>>> my_rf = RandomForestRegressor(
...     n_estimators=300,
...     max_depth=6,
...     min_samples_leaf=5,
...     random_state=42,
...     n_jobs=-1
... )
```

```
>>> composite_score, feat_importance_dict = owe.calculate_cross_sectional_regression(
...     model=my_rf,
...     signals=signals,
...     target='asset_returns',
...     eval_date='2024-12-31',
...     time_window=24,
...     grouping=None,
...     rolling_calc=True,
...     rolling_start_date='2016-12-30',
...     retrain_every=6,
...     expanding_window=True,
...     report_feature_importance=True
... )
```

In this example:

-   A custom RandomForestRegressor is supplied via model, bypassing the built-in model factory.
    
-   An expanding training window is used: models are initially trained on 24 periods of data and then retrained on all available data as time progresses.
    
-   Separate random forest models are trained per sector.
    
-   Models are retrained every 6 periods.
    
-   Tree depth and minimum leaf size are constrained to mitigate overfitting as the sample size grows.
    
-   The resulting asset-level predictions are returned as a single cross-sectional signal suitable for backtesting.
    
-   Feature importance results are also calculated (using permutation importance)
    

calculate\_time\_series\_regression(_signals\=None_, _model\='ols+'_, _model\_params\=None_, _eval\_date\=None_, _time\_window\=None_, _grouping\=None_, _custom\_grouping\_series\=None_, _specific\_groups\_only\=None_, _rolling\_calc\=False_, _rolling\_start\_date\=None_, _retrain\_every\=1_, _expanding\_window\=False_, _drop\_coverage\_threshold\=0.5_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.calculate_time_series_regression "Link to this definition")

Run rolling / expanding time-series regression (per group) to estimate signal mix weights.

Specifically, the regression fits a constant target (1) using historical signal returns as regressors, without intercept. The resulting coefficients define a linear combination of signals whose realized returns best replicate a constant payoff in a least-squares sense. Under standard assumptions, this is equivalent to estimating:

-   a stochastic discount factor proxy in the span of the provided signals, or
    
-   a maximum Sharpe / maximum information ratio portfolio of signals (up to scale and normalization).
    

Regularization (ridge or lasso) stabilizes the estimation in finite samples and controls overfitting, while coefficient normalization maps the solution into interpretable percentage weights.

The resulting coefficients are normalized into percentage weights and returned in an [`OptimalWeightsEngineOutput`](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput") container, including per-date / per-group weight tables.

The model is retrained on a periodic schedule (`'retrain_every'`) using either a rolling lookback window (`'time_window'`) or an expanding window.

Parameters:

-   **signals** (_{None__,_ _list__,__dict__,_ _SignalSelectorOutput}__,_ _default None_) –
    
    When `None`, all signals from the `Backtest` instance are used.
    
    When list-like (not dict), it’s a list of signals to be eval dates and groups.
    
    A dict input is accepted for more customizable runs with a separate list of signals to be considered for each date and/or group to be analysed, the dict must follow the structure:
    
    ```
    signal_ids={
        <date>: {  # datetime.datetime, pandas.Timestamp, or str in 'YYYY-MM-DD' format
            <group>: [<list of signal ids>],
            ...  # more groups
        },
        ...  # more dates
    }
    ```
    
    First layer of keys is for dates, the second for groupings of assets. It can also accept a dict with only one of the layers-assumed to be the same across the other.
    
    Dates must be `datetime.datetime` parsable: e.g. `'YYYY-MM-DD'` format. When calculation is performed on an evaluation date not explicitly in the dict it takes the entry from most recent preceeding date, or the chronologically first one if all dates in the dict are after the eval date./n Groups other than `'universe'` must match names of groups coming from grouping parameters (grouping, custom\_grouping\_series).
    
    When `SignalSelectorOutput` is used, it must be from a method that explicitly selects signals (e.g. `vif_select(), lasso_select()`) and the selected signals (dict) will be used as the `signal_ids`. The following list of parameters are overridden with their equivalents used in the SS method:
    
    ```
    [signal_ids, lag, eval_date, time_window, rolling_calc,
    reweight_every(rolling_every), grouping, custom_grouping_series, keep_universe,
    risk_adjust_scores, adjust_by_groups, rolling_start_date, expanding_window]
    ```
    
    With the exception that if the SS selection is performed for one date but multiple dates are defined with the input parameters (e.g. `rolling_calculation=True`) this ‘extention’ will be allowed. Similarly, if SS calculation is not grouped, but grouping parameters are passed, this ‘extention’ will also not be overridden.
    
-   **model** (_str__,_ _default 'ols+'_) –
    
    Model identifier (case-insensitive). Supported values include:
    
    -   `'ols'` : Ordinary least squares (no intercept)
        
    -   `'ols+'` : OLS with non-negative coefficients (no intercept)
        
    -   `'ridge'` : Ridge regression (no intercept); uses RidgeCV if alpha not provided
        
    -   `'ridge+'` : Ridge with non-negative coefficients if alpha provided; positivity is not enforced when RidgeCV is used
        
    -   `'lasso'` : Lasso regression (no intercept)
        
    -   `'lasso+'` : Lasso with non-negative coefficients (no intercept)
        
-   **model\_params** (_dict__,_ _optional_) –
    
    Hyperparameters passed to the underlying sklearn estimator. Special keys:
    
    -   `'alpha'` : regularization strength for ridge / lasso
        
    -   `'alphas'` : alpha grid for RidgeCV (if alpha not provided)
        
    -   `'n_signals'` : (lasso/lasso+) triggers cardinality-style alpha search that finds the smallest alpha producing at most ‘n\_signals’ non-zero coefficients
        
    -   `'seed'` sets random\_state for stochastic models
        
-   **eval\_date** (_{None__,_ _str__,_ _datetime.datetime pandas.Timestamp}__,_ _default None_) –
    
    The evaluation date. When `None` will take the latest available date in Backtest. `str` must be `'YYYY-MM-DD'` format.
    
    For rolling calculations, this is the last date and `rolling_start_date` is also required.
    
-   **time\_window** (_int__,_ _default None_) –
    
    Length of the historical lookback window (in periods) used to train each cross-sectional model.
    
    When provided, the training sample for a given evaluation date consists of the most recent time\_window observations ending at that date (subject to rolling or expanding window logic).
    
    Behavior depends on other flags:
    
    -   If `rolling_calc=True` and `expanding_window=False`, a fixed-length rolling window of size `time_window` is used.
        
    -   If `expanding_window=True`, `time_window` defines the minimum number of initial periods before training begins; the window then expands over time.
        
    -   If `rolling_calc=False`, `time_window` is applied once for the evaluation date only.
        
-   **grouping** (_{None__,_ _'sector'__,_ _'backtest\_grouping'__,_ _'custom'} default None_) –
    
    If not `None`, determines the asset grouping criteria.
    
    `'sector'`: use `Backtest.sectors` grouping and `Backtest`’s sector level signal calculations.
    
    `'backtest_grouping'` : use `Backtest.grouping` grouping and `Backtest`’s group level signal calculations. If `Backtest.grouping` is not pre-defined it can be supplied and set with the `custom_grouping_series` parameter. (same as doing `bt.grouping = custom_grouping_series` separately)
    
-   **custom\_grouping\_series** (_{None__,_ _pandas.Series__,_ _str}__,_ _default None_) – If `grouping == 'backtest_grouping'` this can be used to set `Backtest.grouping` if it’s not already set; will raise an error if is already set and this is different. If `str` - must match the name of a categorical datafield in `Backtest.data`. If `pd.Series` must be categorical series assigning groups to assets with index matching `Backtest`’s universe - (date, symbol) multiindex.
    
-   **specific\_groups\_only** (_list__,_ _default None_) – Subset of group names to process. If None, all available groups are used.
    
-   **rolling\_calc** (_bool__,_ _default False_) – If `True` the optimal weight mix is calculated for multiple dates on a rolling basis - starging at `rolling_start_date` (required) and ending at `eval_date`. Use `reweight_every, expanding_window` for further customisation.
    
-   **rolling\_start\_date** (_{None__,_ _str__,_ _datetime.datetime__,_ _pandas.Timestamp}__,_ _default None_) – Required if `rolling_calc` is `True`. This will be the first evaluation date, rolling up to `eval_date` (may not be included depending on aligning of `reweight_every`)
    
-   **retrain\_every** (_int__,_ _default 1_) – Frequency (in periods) to retrain the model.
    
-   **expanding\_window** (_bool__,_ _default False_) – Only for rolling calculations. If `True` use an expanding time-window, starting with `time_window` at `rolling_start_date`.
    
-   **drop\_coverage\_threshold** (_float_ _\[__0__,__1__\] or_ _None_) – if provided, is used as a threshold for coverage check to drop regressors due to insufficient data
    

Returns:

Container with per-date / per-group optimized weights (as DataFrames) and additional metadata needed by the engine/backtest.

Return type:

[OptimalWeightsEngineOutput](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput")

Notes

-   The dependent variable is a constant (1), and models are fit with fit\_intercept=False. This encourages the regression to express the constant using factor returns via coefficients. In practice, this problem can be noisy and ill-conditioned; regularization (ridge/lasso) and feature scaling may be needed.
    
-   Coefficients are normalized into percentage weights. If the sum of coefficients is zero, positive and negative coefficients are separately scaled to +100 and -100.
    

Examples

**Running Time-Series Regression with a built-in Lasso+ model**

Estimate a sparse, non-negative signal mix per sector using a rolling window:

```
>>> ts_result = owe.calculate_time_series_regression(
...     model='lasso+',
...     model_params={'n_signals': 5},
...     signals=signals,
...     eval_date='2024-12-31',
...     time_window=12,
...     grouping='sector',
...     rolling_calc=True,
...     rolling_start_date='2016-12-30',
...     retrain_every=3,
...     expanding_window=True,
... )
```

In this example:

-   A built-in Lasso+ model (L1-regularized regression with non-negative coefficients and no intercept) is used.
    
-   The regression estimates a **sparse SDF / maximum-IR signal mix** by fitting a constant target to historical signal returns.
    
-   The L1 penalty encourages sparsity, while the `'n_signals'` constraint further limits the number of active signals to at most 5, yielding a parsimonious representation of the SDF.
    
-   Positivity enforces a long-only signal mix.
    
-   Models are trained separately per sector using a 12-period rolling window and retrained every 3 periods.
    
-   Resulting coefficients are normalized into percentage weights and returned as sector-specific signal mixes.
    

**Running Time-Series Regression with a built-in OLS+ model**

Provide a custom ridge estimator (no intercept) and let the engine retrain it on an expanding window:

```
>>> ts_result = owe.calculate_time_series_regression(
...     model='ols+',
...     signals=signals,
...     eval_date='2024-12-31',
...     time_window=24,
...     grouping=None,
...     rolling_calc=True,
...     rolling_start_date='2016-12-30',
...     retrain_every=6,
...     expanding_window=True,
... )
```

In this example:

-   A built-in OLS+ model (ordinary least squares with non-negative coefficients and no intercept) is used.
    
-   The regression estimates a long-only SDF / maximum information-ratio signal mix within each sector.
    
-   An expanding window is used: models are initially trained on 24 periods of data and then retrained on all available history.
    
-   Models are retrained every 6 periods.
    
-   Resulting coefficients are normalized into percentage weights.
    
-   The result should be comparable to `'Max IR'` signal mix resulting from calculate() with risk and return estimation methods set to `'Historical'`.
    

calculate(_signals\=None_, _objective\='Max IR'_, _constraints\=None_, _initial\_weights\=None_, _eval\_date\=None_, _risk\_estimation\_method\='Historical'_, _return\_estimation\_method\='Historical'_, _time\_window\=None_, _half\_life\=None_, _exp\_smoothing\_factor\=None_, _grouping\=None_, _rolling\_calc\=False_, _rolling\_start\_date\=None_, _ignore\_first\_date\_turnover\=True_, _calculate\_risk\_contribution\=False_, _reweight\_every\=1_, _expanding\_window\=False_, _custom\_grouping\_series\=None_, _keep\_universe\=True_, _specific\_groups\_only\=None_, _custom\_returns\_estimates\=None_, _custom\_signal\_covariance\=None_, _regimes\=None_, _require\_full\_regime\_time\_window\=False_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.calculate "Link to this definition")

Calculate optimal mix of a set of signals based on the signal returns.

Parameters:

-   **signals** (`List` | `Dict` | [`SignalSelectorOutput`](https://fpe.factset.com/docs/signal_selector.html#fds.fpe.quant.signal_selector.SignalSelectorOutput "fds.fpe.quant.signal_selector._signal_selector_output.SignalSelectorOutput") | `None`) –
    
    When `None`, all signals from the `Backtest` instance are used. When list-like (not dict), it’s a list of signals to be eval dates and groups. A dict input is accepted for more customizable runs with a separate list of signals to be considered for each date and/or group to be analysed, the dict must follow the structure:
    
    ```
    signal_ids={
        <date>: {  # datetime.datetime, pandas.Timestamp, or str in 'YYYY-MM-DD' format
            <group>: [<list of signal ids>],
            ...  # more groups
        },
        ...  # more dates
    }
    ```
    
    First layer of keys is for dates, the second for groupings of assets. It can also accept a dict with only one of the layers-assumed to be the same across the other. Dates must be `datetime.datetime` parsable: e.g. `'YYYY-MM-DD'` format. When calculation is performed on an evaluation date not explicitly in the dict it takes the entry from most recent preceeding date, or the chronologically first one if all dates in the dict are after the eval date.
    
    Groups other than `'universe'` must match names of groups coming from grouping parameters (grouping, custom\_grouping\_series). When `SignalSelectorOutput` is used, it must be from a method that explicitly selects signals (e.g. `vif_select(), lasso_select()`) and the selected signals (dict) will be used as the `signal_ids`. The following list of parameters are overridden with their equivalents used in the SS method:
    
    ```
    [signal_ids, lag, eval_date, time_window, rolling_calc,
    reweight_every(rolling_every), grouping, custom_grouping_series, keep_universe,
    risk_adjust_scores, adjust_by_groups, rolling_start_date, expanding_window]
    ```
    
    With the exception that if the SS selection is performed for one date but multiple dates are defined with the input parameters (e.g. `rolling_calculation=True`) this ‘extention’ will be allowed. Similarly, if SS calculation is not grouped, but grouping parameters are passed, this ‘extention’ will also not be overridden.
    
-   **objective** (`str`) –
    
    Determines the objective function that will be optimized:
    
    -   ’Max IR’: The objective is to maximize the Information Ratio of the Multi-Signal portfolio.
        
    -   ’Max Return’: The objective is to maximize the expected return of the Multi-Signal portfolio.
        
    -   ’Min Variance’: The objective is to minimize the variance of the Multi-Signal portfolio.
        
    -   ’Risk Parity’: The objective is to obtain portfolio where each signal portfolio has equal risk contribution to the total portfolio risk. Any constraints will be ignored.
        
-   **constraints** ([`Constraints`](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints "fds.fpe.quant.optimal_weights_engine._optimizer.Constraints") | `None`) – Constraints instance that defines the constraints to be used in the optimization.
    
-   **initial\_weights** (`ndarray` | `List` | `Series` | `Dict` | [`OptimalWeightsEngineOutput`](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "fds.fpe.quant.optimal_weights_engine._engine_output.OptimalWeightsEngineOutput") | `None`) – Initial signal mix weights for the optimization. If `None`, equal weights will be used. If using grouping, a `dict` can be passed with keys each group label - specifying initial weights for each group- length of list-likes must match number of signals for the respective group, `pd.Series` index must also match signal names. If a group uses the same signals as the `'universe'` group and no weights are provided for that group it will infer the same initial weights as `'universe'`. If entry for a group is invalid or missing, and there also isn’t a valid entry from `'universe'` to substitute for that group - equal weights will be used A `pandas.Series` will be interpreted as relative weights for the signals used across all groups. For each group take the relevant signals respectively and use initial weights normalized to sum of 1. If a signals used in a group is not in the series, will fallback to equal weights. A list-likes (not `pd.Series`) are interpreted as initial weights only for the `'universe` group and groups that use exactly the same signals (length must match number of signals). Groups where this input is invalid will use equal-weights. Use\`\`OptimalWeightsEngineOutput\`\` to treat the resulting weights from a previous optimization as the initial weights. Set of signals must match (for each group). If a group is not part of the result groups - will attempt to infer weights from the `'universe'` group if signals match. All other invalid inputs fall back to equal initial weights.
    
-   **eval\_date** (`str` | `datetime` | `Timestamp` | `List` | `None`) – The evaluation date. When `None` will take the latest available date in Backtest. `str` must be `'YYYY-MM-DD'` format. For rolling calculations, this is the last date and `rolling_start_date` is also required.
    
-   **risk\_estimation\_method** (`str`) –
    
    Determines method for estimating the alpha signal covariance matrix used in the optimization.
    
    -   `'Historical'`: The signal covariance matrix will be estimated using historical signal return data.
        
    -   `'Ex-Ante'`: The signal covariance matrix will be estimated based on the signal portfolios and asset level data form the associated risk signal model.
        
    -   `'Ex-Ante Basic'`: Similar to ‘Ex-Ante’ but the risk aggregation on signal level is performed outside the optimizer engine, i.e. the full set of risk model data on asset level is not sent and leading to certain constraints that require asset level data not being supported (e.g. signal exposure, asset level weight constraints, etc.). Since a smaller amount data is sent to the optimizer engine the calculation could be faster.
        
    -   `'Custom'`: Provide your worn pandas.DataFrame with covariance data to the `custom_signal_covariance` parameter. Must contain cov data for all relevant signals for all relevant dates / groups (sectors) - see `custom_signal_covariance` for details
        
-   **return\_estimation\_method** (`str`) –
    
    Determines method for estimating the alpha signal expected returns used in the optimization.
    
    -   `'Historical'`: The alpha signal expected returns will be estimated using historical alpha signal returns.
        
    -   `'IR Based'`: The alpha signal expected returns will be estimated by multiplying the historical Information Ratio (IR) of each alpha signal by the Ex-Ante risk estimate for that signal. The historical Information Ratios are based on the returns of the alpha signals over a past period of size specified by the time\_window argument. The Ex-Ante risk estimates are calculated based on the alpha signal portfolios and asset level data form the associated risk factor model.
        
    -   `'Custom'`: Provide your worn pandas.DataFrame with expected returns to the `custom_returns_estimates` parameter. Must contain expected returns for all relevant signals on all relevant dates / groups (sectors) - see `custom_returns_estimates` for details
        
-   **time\_window** (`int` | `None`) – The number of periods (`Backtest`’s frequency) that will be used for the signal covariance and mean estimation. If `None`, use the maximum available time window - from `bt.start` to (first) evaluation date. Not applicable for risk estimation methods `['Ex-Ante', 'Ex-Ante Basic']`.
    
-   **half\_life** (`float` | `None`) – If not `None`, used for exponential weighting of historical signal returns in calculating the risk and return estimates. Not used for risk estimates when `risk_estimation_method` is `'Ex-Ante'` or `'Ex-Ante Basic'`. The value should be greater than 0. If provided, exp\_smoothing\_factor is ignored.
    
-   **exp\_smoothing\_factor** (`float` | `None`) –
    
    If not `None`, used for exponential weighting of historical signal returns in calculating the risk and return estimates. Not used for risk estimates when `risk_estimation_method` is `'Ex-Ante'` or `'Ex-Ante Basic'`. The value should be greater than 0 and smaller or equal to 1. Can be derived from the half-life by the following formula:
    
    > , for .
    
-   **grouping** (`str` | `None`) – If not `None`, determines the asset grouping criteria. `'sector'`: use `Backtest.sectors` grouping and `Backtest`’s sector level signal calculations. `'backtest_grouping'` : use `Backtest.grouping` grouping and `Backtest`’s group level signal calculations. If `Backtest.grouping` is not pre-defined it can be supplied and set with the `custom_grouping_series` parameter. (same as doing `bt.grouping = custom_grouping_series` separately)
    
-   **custom\_grouping\_series** (`str` | `Series` | `None`) – If `grouping == 'backtest_grouping'` this can be used to set `Backtest.grouping` if it’s not already set; will raise an error if is already set and this is different. If `str` - must match the name of a categorical datafield in `Backtest.data`. If `pd.Series` must be categorical series assigning groups to assets with index matching `Backtest`’s universe - (date, symbol) multiindex.
    
-   **keep\_universe** (`bool`) – Only valid if `grouping` is not `None`. If False the ‘universe’ group will be dropped and analysis will only be performed on the grouping level (e.g. sectors).
    
-   **specific\_groups\_only** (`List` | `None`) – specify a sublist of groups to analyse. E.g. if you don’t want to analyse all s ectors but just a subset
    
-   **rolling\_calc** (`bool`) – If `True` the optimal weight mix is calculated for multiple dates on a rolling basis - starging at `rolling_start_date` (required) and ending at `eval_date`. Use `reweight_every, expanding_window` for further customisation.
    
-   **rolling\_start\_date** (`str` | `datetime` | `Timestamp` | `None`) – Required if `rolling_calc` is `True`. This will be the first evaluation date, rolling up to `eval_date` (may not be included depending on aligning of `reweight_every`)
    
-   **reweight\_every** (`int`) –
    
    When performing a rilling calculation (`rolling_calc=True`), this can be specified to calculate weights on every n-th date (`rolling_every=n`) only. Example: Say you have 10 years of monthly data (2010-2020) and want to optimize weights with a rolling 5-year time-window once a year, say December, then specify:
    
    ```
    eval_date=None  # Goes as far as possible (Dec 2020)
    time_window=60,
    rolling_calc=True,
    rolling_start_date=datetime.datetime(2015, 12, 31),
    reweight_every=12,
    ```
    
-   **expanding\_window** (`bool`) – Only for rolling calculations. If `True` use an expanding time-window, starting with `time_window` at `rolling_start_date`.
    
-   **ignore\_first\_date\_turnover** (`bool`) – If `True` the turnover constraint component of `constraints` is ignored for the first date in the rolling optimal weights calculations. Applicable only if `rolling_calc==True`. The turnover for the first date will be reported as 0 when this option is used.
    
-   **calculate\_risk\_contribution** (`bool`) – If `True` risk contribution will be calculated and added to the optimization report
    
-   **custom\_returns\_estimates** (`DataFrame` | `None`) – External expected returns dataframe, required IFF `return_estimation_method=='Custom'` Multiindex - (date, group); Columns - signal IDs. Must contain valid values (numbers) for each signal used on each date / group, as defined by other parameters
    
-   **custom\_signal\_covariance** (`DataFrame` | `None`) – External signal covariance matrix, required IFF `risk_estimation_method=='Custom'` Multiindex - (date, group, signal IDs); Columns - signal IDs. For each date, group must contain a full covariance matrix of relevant signals - all values must be valid (numbers), values on the ‘diagonals’ (variances) must be positive and the cov matrix must be positive semi-definite.
    
-   **regimes** (`DataFrame` | `None`) – If provided, must be a dataframe containing two categorical time-series columns: \[‘realized’, ‘prediction\_next’\]. This will cause historical return and cov estimates to be calculated using only data from dates that have a ‘realized’ regime matching the ‘prediction\_next’ regime on the evaluation date. This can and should also cover dates covered by Backtest’s backperiods (at least the ‘realized’ column). Uses `time_window` previous observations (relatively, i.e. not absolute calendar number of periods) to calculate estimates (may use less than `time_window`, see `require_full_regime_time_window`). For rolling calculations with expanding window, the time-window start date is determined ‘relatively’ the first time the regime is needed (‘prediction\_next’ at eval date) and used as a fixed window start thereafter for subsequent calculations in the same regime.
    
-   **require\_full\_regime\_time\_window** (`bool`) – If True, for each evaluation date, `time_window` `'realized'` previous observations (data points) must be available in the `Backtest`. Otherwise, at least N previous observations of the `'prediction_next'` regime must be available, where N is the number of signals used on that date (the largest among all groups if grouping is used with different signals per group). Only applies to first use of each regime when `expanding_window=True`, then it fixes its ‘relative start’ and it’s ensured that number of observatons only grows.
    

Returns:

OptimalWeightsEngineOutput Object containing the optimal weights and associated statistics as well as reporting functionality.

Return type:

optimal\_signal\_mix

widget()[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.widget "Link to this definition")

Launches a widget for calculating optimal weights based on user inputs. Provides low code access to the OptimalWeightsEngine functionality.

The user can define constraints choose the objective, initial weights, risk and return estimation method, etc.

The results are displayed in multiple tabs, including the progress status, optimal weights, initial versus optimal comparisons, objective value, statistics, constraints, and logs.

The optimal weights tab allows comparing the result to the previous run, as well as saving it to CSV or OFDB.

Return type:

`None`

widget\_result()[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.widget_result "Link to this definition")

Returns:

OptimalWeightsEngineOutput The latest optimization result from the OptimalWeightsEngine widget.

Return type:

result

_property_ asset\_returns_: Series_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.asset_returns "Link to this definition")

Get the Series of asset returns (from `Backtest`)

Return type:

Series of asset returns

_property_ dates_: List\[datetime\]_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.dates "Link to this definition")

Get a list of dates with available data from the `Backtest` object (`Backtest.time_series.dates`). Includes backperiods.

Return type:

The full list of dates in Backtest, including backperiods

_property_ ison\_screen_: Series_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.ison_screen "Link to this definition")

Get the universe screen boolean series. Multiindexed by (date, symbol).

Return type:

A boolean series, multiindexed by (date, symbol) showing universe belonging of assets

risk\_adjusted\_signal\_scores(_signal\_ids\=None_, _adjust\_by\_groups\=False_, _group\_data\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.risk_adjusted_signal_scores "Link to this definition")

Get the risk adjusted signal scores for the selected signal\_ids - regress out variation explained by the risk factors associated with each signal.

Parameters:

-   **signal\_ids** (`str` | `List`\[`str`\] | `None`) – List of valid signal\_ids (i.e. that are in `SignalSelector.signals.keys()`). When not specified or empty, all available signals will be returned, optional
    
-   **adjust\_by\_groups** (`bool`) – When `True`, the adjustment is instead performed on the group level, meaning separate/more granular regressions are performed for each asset group rather than over the whole universe, and then the adjusted scores for the groups are re-concatenated into a complete universe-covering score. `group_data` must be provided when using this option, default False
    
-   **group\_data** (`Series` | `None`) – Required when `adjust_by_group=True`. Series of categorical data separating the assets of the universe into groups (e.g. sectors). Index must match the dates-assets index of the universe, optional, default None
    

Return type:

Dataframe of risk-adjusted signal scores indexed by date and symbol with signal IDs as columns

_property_ signal\_ids_: List\[str\]_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.signal_ids "Link to this definition")

Get a list of available signal ids (from the `Backtest` object)

Return type:

A list of the available signal ids from the `Backtest` object

signal\_portfolio\_weights(_signal\_ids\=None_, _lag\=0_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.signal_portfolio_weights "Link to this definition")

Get a dataframe of asset weights for characteristic signal portfolios for specified lag. Multiindexed by (date, symbol)

Parameters:

-   **signal\_ids** (`List`\[`str`\] | `None`) – List of signal ids, optional
    
-   **lag** (`int`) – Number of periods of lag used for signal portfolios
    

Return type:

Dataframe with (date, symbol) multiindex, containing the asset weights of signal portfolios

signal\_returns(_signal\_ids\=None_, _lag\=0_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.signal_returns "Link to this definition")

Get a dataframe of signal returns (time-series for each signal) with specified lag.

Parameters:

-   **signal\_ids** (`List`\[`str`\] | `None`) – List of signal ids, optional
    
-   **lag** (`int`) – Number of periods of lag used for signal returns
    

Return type:

Dataframe with time-series index, containing the signal returns

signal\_scores(_signal\_ids\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.signal_scores "Link to this definition")

Get a dataframe of signal scores. Multiindexed by (date, symbol)

Parameters:

**signal\_ids** (`str` | `List`\[`str`\] | `None`) – List of signal ids, optional

Return type:

Dataframe of signal scores, multiindexed by (date, symbol)

_property_ signals_: Dict_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngine.signals "Link to this definition")

Get the `signals` dictionary (`Backtest.signals`), containing all signal parameters and signal data

Return type:

The dictionary with all signal data form the `Backtest` object

**Running OWE with Risk Adjusted IC Based Model**

```
from fds.fpe.quant.backtest import Backtest
from fds.fpe.quant.optimal_weights_engine import Constraints, OptimalWeightsEngine

# Define signal weight constraints
constraints = Constraints(
    signal_weight={
        'Sentiment_Stdzd_Analyst_PT': [0, 18],
        'Technical_Down_Beta_R2': [5, 40],
        'Value': {
            'group': [
                'Value_Book_Yield',
                'Value_Earnings_Yield',
                'Value_Sales_Yield',
                'Value_CFO_Yield',
            ],
            'bounds': [5, 15],
            'apply_to': 'Cumulative',
        },
    }
)

# Load Backtest object and initialize OWE
bt = Backtest.from_hdf('my_backtest.h5')
owe = OptimalWeightsEngine(backtest=bt)

# Calculate optimal weights using RAIC-based method
result = owe.calculate_raic_based(
    constraints=constraints,
    eval_date='2020-12-31',
    time_window=20,
)

# Display the summary of weights
result.weights_summary()
```

## Constraints[#](https://fpe.factset.com/docs/optimal_weights_engine.html#constraints "Link to this heading")

**Constraints Definition**

Creating a `Constraints` object to be used in the optimization:

```
from fds.fpe.quant.optimal_weights_engine import Constraints

# Signal weight constraints
value_group = ['Value_Book_Yield', 'Value_Earnings_Yield', 'Value_Sales_Yield', 'Value_CFO_Yield']
sentiment_group = [
    'Sentiment_Stdzd_Analyst_PT',
    'Sentiment_PT_Revisions',
    'Sentiment_Earnings_Est_Revisions',
    'Sentiment_Earnings_Est_Stability',
]

signal_weight_constraints = {
    'Sentiment_Stdzd_Analyst_PT': [0, 18],
    'Technical_Down_Beta_R2': [5, 40],
    'Value': {
        'group': value_group,
        'bounds': [5, 15],
        'apply_to': 'Cumulative',
    },
    'All': {'group': signals, 'bounds': [0, 30], 'apply_to': 'Individual'},
}

# Asset weight constraints
stocks_group = ['00105510', 'N5374510', 'V7780T10']

asset_weight_constraints = {
    '00105510': [-0.08, 0.08],
    'Group of Stocks': {
        'group': stocks_group,
        'bounds': [-0.1, 0.1],
        'apply_to': 'Individual',
    },
    'Industrials': {
        'group': sector_industrials_group,
        'bounds': [-0.25, 0.25],
        'apply_to': 'Cumulative',
    },
}

# Signal Risk Contribution Constraints
quality_group = [
    'Quality_FCF_Mgn',
    'Quality_FCF_Mgn_Stability',
    'Quality_Interest_Coverage',
    'Quality_Piotroski_FScore',
]

signal_pctr_constraints = {
    'Quality': {'group': quality_group, 'bounds': [0, 20], 'apply_to': 'Cumulative'},
    'Sentiment': {'group': sentiment_group, 'bounds': [0, 15], 'apply_to': 'Individual'},
}

# Risk Factor Exposure Limits
risk_factor_exposure_constraints = {
    'S_DIVIDEND_YIELD': [-0.07, 0.07],
    'Style Factors': {
        'group': ['S_BOOK_TO_PRICE', 'S_GROWTH'],
        'bounds': [-0.05, 0.05],
    },
}

# Total Portfolio Return and Risk Limits
total_portfolio_return_limit = 0.1  # lower bound of the expected return
total_portfolio_risk_limit = {
    'value': 0.85,  # upper bound on portfolio risk
    'type': 'volatility',
}

# Define Full Set of Constraints
constraints = Constraints(
    signal_weight=signal_weight_constraints,
    asset_weight=asset_weight_constraints,
    return_limit=total_portfolio_return_limit,
    risk_limit=total_portfolio_risk_limit,
    risk_factor_exposure=risk_factor_exposure_constraints,
    signal_pctr=signal_pctr_constraints,
)
```

_class_ fds.fpe.quant.optimal\_weights\_engine.Constraints(_signal\_weight\=None_, _asset\_weight\=None_, _signal\_pctr\=None_, _short\_sale\_max\_leverage\=None_, _return\_limit\=None_, _risk\_limit\=None_, _turnover\_limit\=None_, _risk\_factor\_exposure\=None_, _asset\_turnover\_limit\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints "Link to this definition")

Provides the functionality to systematize and manage the constraint set used in OptimalWeightsEngine calculations.

Parameters:

-   **signal\_weight** (_dict_ _or_ _list_) –
    
    A dictionary with the names of the signals as keys and lists of lower and upper bounds in percent on the weights as values:
    
    ```
    Structure:
    {
        str: list[lower_bound(%), upper_bound(%)]
    }
    Example:
    signal_weight = {
        signal_id: [5, 20]
    }
    ```
    
    Or names of groups of signals as keys and another dictionary as values, in turn having ‘group’, ‘bounds’, and ‘apply\_to’ as keys:
    
    ```
    Structure:
    {
        str: {
            'group': list,
            'bounds': list[lower_bound(%), lower_bound(%)],
            'apply_to': string
        }
    }
    Example:
    signal_weight = {
        'group_name': {
            'group': ['signal_id_1', 'signal_id_5', ...],
            'bounds': [0, 25],
            'apply_to': 'Cumulative' or 'Individual'
        }
    }
    ```
    
    Keys should have the following values:
    
    -   ’group’: list of the names of member signals
        
    -   ’bounds’: list of lower and upper bound in percent.
        
    -   ’apply\_to’: str; If ‘Cumulative’ bounds are applicable to the sum of the weights of each member signal. If absent or ‘Individual’ bounds are applicable to each member signal individually. Alternatively, a list of lower and upper bounds in percent can be provided. These bounds will be applied to all signals individually.:
        
        ```
        Structure:
        [lower_bound(%), upper_bound(%)]
        Example:
        signal_weight = [5, 20]
        ```
        
-   **asset\_weight** (_dict_) –
    
    A dictionary with the symbols of the assets as keys and lists of lower and upper bounds in percent on the weights as values:
    
    ```
    Structure:
    {
        str: list[lower_bound(%), upper_bound(%)]
    }
    Example:
    asset_weight = {
        symbol: [0, 7.5]
    }
    ```
    
    Or names of groups of assets as keys and another dictionary as values, in turn having ‘group’, ‘bounds’, and ‘apply\_to’ as keys:
    
    ```
    Structure:
    {
        str: {
            'group': list,
            'bounds': list[lower_bound(%), lower_bound(%)],
            'apply_to': string
        }
    }
    Example:
    asset_weight = {
        'group_name': {
            'group': ['assets_1', 'assets_5', ...],
            'bounds': [0, 25],
            'apply_to': 'Cumulative' or 'Individual'
        }
    }
    ```
    
    Keys should have the following values:
    
    -   ’group’: list of the names of member assets.
        
    -   ’bounds’: list of lower and upper bound in percent.
        
    -   ’apply\_to’: str; If ‘Cumulative’ bounds are applicable to the sum of the weights of each member asset. If absent or ‘Individual’ bounds are applicable to each member asset individually.
        
-   **signal\_pctr** (_dict_ _or_ _list_) –
    
    A dictionary with the names of the signals as keys and the values being a lists of lower and upper bounds for the percentage contribution to total risk (PCTR):
    
    ```
    Structure:
    {
        str: list[lower_bound(%), upper_bound(%)]
    }
    Example:
    signal_pctr = {
        signal_id: [-15, 30]
    }
    ```
    
    Or names of groups of signals as keys and another dictionary as values, in turn having ‘group’, ‘bounds’, and ‘apply\_to’ as keys:
    
    ```
    Structure:
    {
        str: {
            'group': list,
            'bounds': list[lower_bound(%), lower_bound(%)],
            'apply_to': string
        }
    }
    Example:
    signal_pctr = {
        'group_name': {
            'group': ['signal_id_1', 'signal_id_5', ...],
            'bounds': [-25, 25],
            'apply_to': 'Cumulative' or 'Individual'
        }
    }
    ```
    
    Keys should have the following values:
    
    -   ’group’: list of the names of member signals
        
    -   ’bounds’: list of lower and upper bound in percent.
        
    -   ’apply\_to’: str; If ‘Cumulative’ bounds are applicable to the sum of the PCTRs of each member signal. If absent or ‘Individual’ bounds are applicable to each member signal individually. Alternatively, a list of lower and upper bounds in percent can be provided. These bounds will be applied to all signals individually.:
        
        ```
        Structure:
        [lower_bound(%), upper_bound(%)]
        Example:
        signal_pctr = [-20, 25]
        ```
        
-   **short\_sale\_max\_leverage** (_float_) – The maximum leverage for short selling in percent.
    
-   **return\_limit** (_float_) – The minimum total portfolio expected return in percent.
    
-   **risk\_limit** (_dict_) –
    
    A dictionary specifying the maximum total portfolio risk under the ‘value’ key, and the type of risk measure (either of \[‘volatility’, ‘variance’\]) under the ‘type’ key:
    
    ```
    Example:
    risk_limit = {
        'value': 5.0,
        'type': 'volatility'
    }
    ```
    
-   **turnover\_limit** (_float_) – The maximum total turnover on a signal level for a given optimization. This two-sided turnover limits the sum of the total increases and decreases in weight made during re-balancing of the optimal mix on signal level. It is expressed as a percent.
    
-   **risk\_factor\_exposure** (_dict_) –
    
    A dictionary with the names of risk factors as keys and lists of lower and upper bounds to the optimal mix’s aggregate exposure to the given risk factor as values:
    
    ```
    Structure:
    {
        str: list[lower_bound, upper_bound]
    }
    Example:
    risk_factor_exposure = {
        'risk_factor_id': [0.05, 0.20]
    }
    ```
    
    Or names of groups of risk factors as keys and another dictionary as values, in turn having ‘group’, ‘bounds’, and ‘apply\_to’ as keys:
    
    ```
    Structure:
    {
        str: {
            'group': list,
            'bounds': list[lower_bound, lower_bound],
            'apply_to': string
        }
    }
    Example:
    risk_factor_exposure = {
        'group_name': {
            'group': ['risk_factor_id_1', 'risk_factor_id_5', ...],
            'bounds': [0.01, 0.50],
            'apply_to': 'Cumulative' or 'Individual'
        }
    }
    ```
    
    Keys should have the following values:
    
    -   ’group’: list of the names of member risk factors.
        
    -   ’bounds’: list of lower and upper bound of the risk factor exposures.
        
    -   ’apply\_to’: str; If ‘Cumulative’ bounds are applicable to the sum of the exposures of each member risk factor. If absent or ‘Individual’ bounds are applicable to each member risk factor individually.
        
-   **asset\_turnover\_limit** (_dict_) –
    
    A dictionary specifying the two-sided turnover limit (in percentage format) that is imposed in a single optimization. This two-sided turnover limits the sum of the total increases and decreases in weight made during re-balancing of the optimal signal mix on asset level. The asset turnover resulting from each signal directly depends on the cross-sectional autocorrelation of the weights of its portfolio representation. Reducing asset turnover is effectively transformed into a problem about increasing the mixed signal autocorrelation:
    
    ```
    Structure:
    {
        'value': upper_bound(%),
        'gross_leverage': float (decimal),
        'aversion': string,
        'method': string
    }
    Example:
    asset_turnover_limit = {
        'value': 30,
        'gross_leverage': 2.0,
        'aversion': 'low' or 'medium' or 'high',
        'method': 'Reduced' or 'Full'
    }
    ```
    
    Keys should have the following values:
    
    -   ’value’: upper bound on asset turnover limit (in percent)
        
    -   ’gross\_leverage’: specifies the gross leverage of signal portfolio representations. Asset turnover increases linearly in the gross leverage, so when specifying a limit on the turnover, it is important to fix leverage. If not provided, defaults to 1.0.
        
    -   ’aversion’: sets on of three available modes of aversion to turnover (‘low’, ‘medium’, ‘high’); this is translated to a penalty parameter in the objective function of any violation of the constraint
        
    -   ’method’: specifies the mode of autocorrelation structure used to proxy the asset turnover. If ‘Reduced’, only individual-factors autocorrelations are used; if ‘Full’, also cross-factors autocorrelations are used.
        

is\_empty()[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints.is_empty "Link to this definition")

A helper method to check if a constraints object is empty.

_property_ factor\_weight[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints.factor_weight "Link to this definition")

Wrap the decorated function with a deprecation warning.

Parameters:

**func** (_callable_) – The deprecated function to wrap.

Returns:

The wrapped function that emits a deprecation warning before calling the original.

Return type:

callable

add\_factor\_weight\_limit()[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints.add_factor_weight_limit "Link to this definition")

Wrap the decorated function with a deprecation warning.

Parameters:

**func** (_callable_) – The deprecated function to wrap.

Returns:

The wrapped function that emits a deprecation warning before calling the original.

Return type:

callable

_property_ factor\_pctr[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints.factor_pctr "Link to this definition")

Wrap the decorated function with a deprecation warning.

Parameters:

**func** (_callable_) – The deprecated function to wrap.

Returns:

The wrapped function that emits a deprecation warning before calling the original.

Return type:

callable

add\_factor\_pctr\_limits()[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.Constraints.add_factor_pctr_limits "Link to this definition")

Wrap the decorated function with a deprecation warning.

Parameters:

**func** (_callable_) – The deprecated function to wrap.

Returns:

The wrapped function that emits a deprecation warning before calling the original.

Return type:

callable

## OptimalWeightsEngineOutput[#](https://fpe.factset.com/docs/optimal_weights_engine.html#optimalweightsengineoutput "Link to this heading")

_class_ fds.fpe.quant.optimal\_weights\_engine.OptimalWeightsEngineOutput(_inputs\_dict_, _owe\_result\_dict_, _backtest_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "Link to this definition")

Contains the optimal weights calculated by the methods of the OptimalWeightsEngine class, as well as, associated statistics and provides reporting functionality.

_property_ dates_: List\[datetime\]_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.dates "Link to this definition")

Returns the list of evaluation dates for which the optimisation was performed.

Returns:

List of dates for which optimisation was performed.

Return type:

list of datetime.datetime

_property_ groups_: List\[str\]_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.groups "Link to this definition")

Returns the list of groups for which the optimisation was performed. (e.g. `['universe', <all the sectors>]`)

Returns:

List of group labels for which optimisation was performed.

Return type:

list of str

weights\_summary(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.weights_summary "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the weight summary is returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the weight summary is returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

DataFrame containing initial and optimal signal weights and the corresponding upper and lower bounds (if applicable) for a given date and group.

Return type:

pandas.DataFrame

initial\_weights(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.initial_weights "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the initial weights are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the initial weights are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

Series of the initial signal weights for the optimization for given date and group.

Return type:

pandas.Series

optimal\_weights(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.optimal_weights "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the optimal weights are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the optimal weights are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

Series of the optimal signal weights from the optimization for a given date and group.

Return type:

pandas.Series

lower\_bounds(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.lower_bounds "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the lower bounds are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the lower bounds are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

Series of the lower bounds for the optimization for a given date and group.

Return type:

pandas.Series

upper\_bounds(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.upper_bounds "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the upper bounds are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the upper bounds are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

Series of the upper bounds for the optimization for a given date and group.

Return type:

pandas.Series

statistics(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.statistics "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the statistics are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the statistics are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

DataFrame containing statistics (e.g. Expected Return, Total Risk, Turnover, etc.) for the optimization results for a given date and group.

Return type:

pandas.DataFrame

aggregated\_constraints(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.aggregated_constraints "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the aggregated constraints are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the aggregated constraints are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

DataFrame containing aggregated constraints values for the optimization results for a given date and group.

Return type:

pandas.DataFrame

factor\_exposures(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.factor_exposures "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the factor exposures are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the factor exposures are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

DataFrame containing factor exposures values for the optimization results for a given date and group.

Return type:

pandas.DataFrame

risk\_contribution(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.risk_contribution "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the risk contribution is returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the risk contribution is returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

DataFrame containing initial total, final total, initial active and final active risk contribution values for the optimization results for a given date and group.

Return type:

pandas.DataFrame

objective(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.objective "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the objective is returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the objective is returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

DataFrame containing values of the objective function of the initial and optimal signal mixes for a given date and group. The objective is the label in the DataFrame index.

Return type:

pandas.DataFrame

logs(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.logs "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the logs are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the logs are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

Detailed optimization logs for a given date and group.

Return type:

str

has\_solution(_date\=None_, _group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.has_solution "Link to this definition")

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the solution is checked. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the solution is checked. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    

Returns:

`True` if the optimization problem for a given date and group has a solution, `False` otherwise.

Return type:

bool

_property_ input\_parameters_: Dict_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.input_parameters "Link to this definition")

returns: Dictionary of the input parameters passed to the method that produced the output. :rtype: dict

_property_ method_: str_[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.method "Link to this definition")

returns: The objective/method used to calculate the optimal weights. :rtype: str

weights\_by\_date(_group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.weights_by_date "Link to this definition")

Returns the optimal weights for all calculated dates for a given group.

Parameters:

**group** (`str` | `None`) – The group label for which the weights are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present

Returns:

DataFrame containing the optimal weights for all calculated dates for a given group.

Return type:

pandas.DataFrame

plot\_weights\_by\_date(_group\=None_, _transpose\=False_, _color\_by\='rows'_, _title\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.plot_weights_by_date "Link to this definition")

Plots the optimal weights for all calculated dates for a given group.

Parameters:

-   **group** (`str` | `None`) – The group label for which the weighs plotted. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    
-   **transpose** (`bool`) – If `False`, signals are plotted on the vertical axis and dates on the horizontal, if `True`, vice versa.
    
-   **color\_by** (`str`) – If `'rows'` each row of the plot has the same color. If `'columns'`, each column has the same color.
    
-   **title** (`str` | `None`) – Specifies the title of the plot. If `None` a default title will be used.
    

Return type:

`None`

weights\_by\_group(_date\=None_, _include\_universe\=True_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.weights_by_group "Link to this definition")

Returns the optimal weights for all calculated groups for a given date.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the group weights are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **include\_universe** (`bool`) – If `True` the optimal weights at the universe level are included.
    

Returns:

DataFrame containing the optimal weights for all calculated groups for a given date.

Return type:

pandas.DataFrame

plot\_weights\_by\_group(_date\=None_, _include\_universe\=True_, _transpose\=False_, _color\_by\='rows'_, _title\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.plot_weights_by_group "Link to this definition")

Plots the optimal weights for all calculated groups for a given date.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the group weights are plotted. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **include\_universe** (`bool`) – If True the optimal weights at the universe level are included.
    
-   **transpose** (`bool`) – If False, signals are plotted on the vertical axis and groups on the horizontal, if True, vice versa.
    
-   **color\_by** (`str`) – If `'rows'` each row of the plot has the same color. If `'columns'`, each column has the same color.
    
-   **title** (`str` | `None`) – Specifies the title of the plot. If `None` a default title will be used.
    

Return type:

`None`

risk\_contributions\_by\_date(_group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.risk_contributions_by_date "Link to this definition")

Returns the optimal risk contributions for all calculated dates for a given group.

Parameters:

**group** (`str` | `None`) – The group label for which the risk contributions are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present

Returns:

DataFrame containing the optimal risk contributions for all calculated dates for a given group.

Return type:

pandas.DataFrame

plot\_risk\_contributions\_by\_date(_group\=None_, _transpose\=False_, _color\_by\='rows'_, _title\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.plot_risk_contributions_by_date "Link to this definition")

Plots the optimal risk contributions for all calculated dates for a given group.

Parameters:

-   **group** (`str` | `None`) – The group label for which the weighs plotted. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    
-   **transpose** (`bool`) – If `False`, signals are plotted on the vertical axis and dates on the horizontal, if `True`, vice versa.
    
-   **color\_by** (`str`) – If `'rows'` each row of the plot has the same color. If `'columns'`, each column has the same color.
    
-   **title** (`str` | `None`) – Specifies the title of the plot. If `None` a default title will be used.
    

Return type:

`None`

risk\_contributions\_by\_group(_date\=None_, _include\_universe\=True_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.risk_contributions_by_group "Link to this definition")

Returns the optimal risk contributions for all calculated groups for a given date.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the group risk contributions are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **include\_universe** (`bool`) – If `True` the optimal risk contributions at the universe level are included.
    

Returns:

DataFrame containing the optimal risk contributions for all calculated groups for a given date.

Return type:

pandas.DataFrame

plot\_risk\_contributions\_by\_group(_date\=None_, _include\_universe\=True_, _transpose\=False_, _color\_by\='rows'_, _title\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.plot_risk_contributions_by_group "Link to this definition")

Plots the optimal risk contributions for all calculated groups for a given date.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the group risk contributions are plotted. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **include\_universe** (`bool`) – If `True` the optimal risk contributions at the universe level are included.
    
-   **transpose** (`bool`) – If `False`, signals are plotted on the vertical axis and groups on the horizontal, if `True`, vice versa.
    
-   **color\_by** (`str`) – If `'rows'` each row of the plot has the same color. If `'columns'`, each column has the same color.
    
-   **title** (`str` | `None`) – Specifies the title of the plot. If `None` a default title will be used.
    

Return type:

`None`

factor\_exposures\_by\_date(_group\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.factor_exposures_by_date "Link to this definition")

Returns the optimal factor exposures for all calculated dates for a given group.

Parameters:

**group** (`str` | `None`) – The group label for which the factor exposures are returned. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present

Returns:

DataFrame containing the optimal factor exposures for all calculated dates for a given group.

Return type:

pandas.DataFrame

plot\_factor\_exposures\_by\_date(_group\=None_, _transpose\=False_, _color\_by\='rows'_, _title\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.plot_factor_exposures_by_date "Link to this definition")

Plots the optimal factor exposures for all calculated dates for a given group.

Parameters:

-   **group** (`str` | `None`) – The group label for which the weighs plotted. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    
-   **transpose** (`bool`) – If `False`, signals are plotted on the vertical axis and dates on the horizontal, if `True`, vice versa.
    
-   **color\_by** (`str`) – If `'rows'` each row of the plot has the same color. If `'columns'`, each column has the same color.
    
-   **title** (`str` | `None`) – Specifies the title of the plot. If `None` a default title will be used.
    

Return type:

`None`

factor\_exposures\_by\_group(_date\=None_, _include\_universe\=True_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.factor_exposures_by_group "Link to this definition")

Returns the optimal factor exposures for all calculated groups for a given date.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the group factor exposures are returned. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **include\_universe** (`bool`) – If `True` the optimal factor exposures at the universe level are included.
    

Returns:

DataFrame containing the optimal factor exposures for all calculated groups for a given date.

Return type:

pandas.DataFrame

plot\_factor\_exposures\_by\_group(_date\=None_, _include\_universe\=True_, _transpose\=False_, _color\_by\='rows'_, _title\=None_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.plot_factor_exposures_by_group "Link to this definition")

Plots the optimal factor exposures for all calculated groups for a given date.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the group factor exposures are plotted. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **include\_universe** (`bool`) – If `True` the optimal factor exposures at the universe level are included.
    
-   **transpose** (`bool`) – If `False`, signals are plotted on the vertical axis and groups on the horizontal, if `True`, vice versa.
    
-   **color\_by** (`str`) – If `'rows'` each row of the plot has the same color. If `'columns'`, each column has the same color.
    
-   **title** (`str` | `None`) – Specifies the title of the plot. If `None` a default title will be used.
    

Return type:

`None`

initial\_vs\_optimal(_date\=None_, _group\=None_, _width\=1200_, _height\=500_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.initial_vs_optimal "Link to this definition")

Plots pie charts representing the initial and optimal weights from an optimization for a given date and group.

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – The date for which the weights are plotted. When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **group** (`str` | `None`) – The group label for which the weights plotted. Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    
-   **width** (`int`) – width of plot in pixels
    
-   **height** (`int`) – height of plot in pixels
    

Return type:

`None`

composite\_score(_group\=None_, _fill\_index\=False_, _aggregate\_groups\=True_, _date\=None_, _aggregate\_dates\=True_, _extend\_to\_all\_dates\=False_, _extend\_to\_universe\=False_, _on\_missing\='raise'_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput.composite_score "Link to this definition")

Calculate and return the composite score - weighted average of the individual signal scores, weighted by the optimal weights. Options to compose over multiple evaluation dates (rolling calculations) and groups (on the grouping level) separately and aggregating (concatenating) to full index. Or picking a specific date and/or group result extending the optimal weights to all other dates / groups respectively (This may even use different signals on l).

Parameters:

-   **date** (`str` | `datetime` | `Timestamp` | `int` | `None`) – Specifies the only evaluation date from which weights are taken when calculating the composite. Ignored if `aggregate_dates` is `True` (default value) When `None`, uses the last date. When `int`, it’s treated as index, returning `OptimalWeightsEngineOutput.dates[date]`. Otherwise, treated as a parsable to `datetime.datetime` and must be (equivalent to) one of `OptimalWeightsEngineOutput.dates`.
    
-   **aggregate\_dates** (`bool`) – If `True`, will take all available weights from the evaluation dates and composite score is calculated by applying the weights to the respective date and the dates following it up to the next date with new weights. Otherwise, follow logic from `date, extrnd_to_all_dates` parameters.
    
-   **extend\_to\_all\_dates** (`bool`) – Only valid when not aggregating dates - If `True`, will extend the weights of the specified date to all available dates of `Backtest` object. Otherwise, return the composite score for the single date.
    
-   **group** (`str` | `None`) – Specifies the group label for which the weights are taken when calculating the composite. Ignored if `aggregate_grous` is `True` (default value). Must be one of `OptimalWeightsEngineOutput.groups`. Defaults to ‘universe’ or the first available group if ‘universe’ not present
    
-   **aggregate\_groups** (`bool`) – If `True` will take weights for all groups (`'universe'` is excluded) separately and calculate composite separately on the grouping level, and then concatenate back to he whole universe index. Otherwise, follow logic from `group, extend_to_universe` parameters
    
-   **extend\_to\_universe** (`bool`) – Only valid when not aggregating groups - If `True`, will extend the weights of the specified group to the whole universe of assets. Otherwise, return composite score only for the assets in the group (obviously `'universe'` will cover the whole universe).
    
-   **fill\_index** (`bool`) – If `True`, regardless of all other parameters will pad the index of the final composite score to match that of `Backtest.ison_screen` - filled with NaN
    
-   **on\_missing** (`str`) –
    
    What to do if the result for a particular date/group is invalid (e.g. optimization failed by infeasibility). If using a single date/group an error is raised regardless.
    
    -   ’raise’: raises errors specifying which date/group is invalid. Trying to use a single date/group will always raise an error
        
    -   ’propagate’: if there is no result for a date/group it will propagate weights from the previous available date for the same group - will use equal weights if it’s the first date or signals set is different on previous date. Will only use equal weights when not aggregating dates.
        
    -   ’skip’: assets from invalid group/date are not included in the composite score (or NA if `fill_index=True`).
        

Returns:

Composite signal score Series. Calculated as the weighted average of the component signal scores weighted by the optimal weights.

Return type:

pandas.Series

## compare\_results[#](https://fpe.factset.com/docs/optimal_weights_engine.html#compare-results "Link to this heading")

fds.fpe.quant.optimal\_weights\_engine.compare\_results(_results_, _date\=None_, _group\=None_, _titles\=None_, _show\_table\=True_, _show\_circle\_plot\=True_, _show\_bar\_plot\=False_, _transpose\=False_, _color\_by\='rows'_, _width\=1000_, _height\=800_)[#](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.compare_results "Link to this definition")

Displays and/or plots the optimal weights form different OptimalWeightsEngineOutput instances for a given date and group.

Parameters:

-   **results** (`List`\[[`OptimalWeightsEngineOutput`](https://fpe.factset.com/docs/optimal_weights_engine.html#fds.fpe.quant.optimal_weights_engine.OptimalWeightsEngineOutput "fds.fpe.quant.optimal_weights_engine._engine_output.OptimalWeightsEngineOutput")\]) – A list of OptimalWeightsEngineOutput instances which are to be compared.
    
-   **date** (`str` | `datetime` | `Timestamp` | `None`) – Date string in ‘YYYY-MM-DD’ or ‘YYYYMMDD’ format, or datetime.datetime, or pandas.Timestamp. The date for which the optimal weights are compared. If None the last date for which weights are available will be used.
    
-   **titles** (`List`\[`str`\] | `None`) – A list of titles to be used as labels in the output. Must be tha same length as results. If `None`, the OptimalWeightsEngineOutput.method of each item in result will be used.
    
-   **show\_table** (`bool`) – If True, a summary table is displayed.
    
-   **show\_circle\_plot** (`bool`) – If True, a weight circles plot is displayed.
    
-   **show\_bar\_plot** (`bool`) – If True, a bar of the weights plot is displayed.
    
-   **transpose** (`bool`) – If False, signals are displayed/plotted on the vertical axis and dates on the horizontal, if True, vice versa.
    
-   **color\_by** (`Literal`\[`'rows'`, `'columns'`\]) – Applicable if show\_circle\_plot==True. If ‘rows’ each row of the circle plot has the same color. If ‘columns’, each column has the same color.
    
-   **width** (`int`) – define the width of the output
    
-   **height** (`int`) – defines the height of the output
    

Return type:

`None`
