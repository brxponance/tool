---
created: 2026-05-11T13:07:52 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/global_macro_predictor.html
author: 
---

# Regime Predictor and Backtesting —

> ## Excerpt
> Tools for regime classification and forecasting in a global-macro or
multi-asset setting. The module provides:

---
## RegimePredictorBuilder and RegimePredictor classes[#](https://fpe.factset.com/docs/global_macro_predictor.html#regimepredictorbuilder-and-regimepredictor-classes "Link to this heading")

Tools for **regime classification** and **forecasting** in a global-macro or multi-asset setting. The module provides:

-   Dataset loading and alignment utilities.
    
-   Helpers to construct feature matrices (X) and shifted targets (y) for forecast horizons.
    
-   A [`RegimePredictor`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor") container that wraps realized vs. predicted regimes, probabilities, metadata, and convenience methods.
    
-   A [`RegimePredictorBuilder`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder "fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder") orchestrator to prepare data, train models (rolling or expanding), produce forecasts, evaluate accuracy, build ensembles, and optionally visualize simple 0/1 strategies.
    

The design emphasizes:

1.  **Time alignment** with explicit forecast horizons,
    
2.  **Model-agnostic** training loops (supports partial\_fit when available),
    
3.  **Interoperability** (inputs as CSV/HDF5/DataFrame).
    

Examples

Basic usage (simplified):

```
>>> builder = RegimePredictorBuilder(
...     regimes_data="regimes.csv",
...     predictors_data="predictors.csv",
...     returns_data="returns.csv",
...     asset_classes=["SPX", "AGG"],
...     regime_indicators=["YieldCurveSlope", "InflationRegime"]
... )
>>> builder.models(names_only=True)
['GB_Hist', 'RF', 'SGD_Log']
>>> rp = builder.train_and_forecast_regimes(
...     forecast_start_date="2000-01-31",
...     forecast_end_date="2019-12-31",
...     model_name="RF",
...     window_size=36,
...     retrain_frequency=3,
...     forecasting_horizon=1,
...     expanding=True,
...     verbose=False
... )
Prediction accuracy for RF with horizon = 1: 73.12 %
```

### Module Contents[#](https://fpe.factset.com/docs/global_macro_predictor.html#module-contents "Link to this heading")

-   [`RegimePredictor`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")
    
-   [`RegimePredictorBuilder`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder "fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder")
    

_class_ fds.fpe.quant.global\_macro.predictor.RegimePredictor(_predictor\_realization\_pair_, _forecast\_horizon_, _trained\_model_, _model\_name_, _train\_start\_date_, _forecast\_start\_date_, _forecast\_end\_date_, _window\_size_, _retrain\_frequency_, _expanding_, _probabilities\=None_, _evaluation\_metrics\=None_, _required\_columns\=None_, _hist\_regimes\=None_, _\_regimes\_map\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "Link to this definition")

Container for regime predictions, probabilities, metadata, and utilities.

The object wraps the realized vs. predicted series and cross-cuts metadata such as forecast horizon, train/forecast windows, model name, and evaluation metrics. It also exposes a unified [`predict()`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.predict "fds.fpe.quant.global_macro.predictor.RegimePredictor.predict") API for inference from dates (lookup) or feature matrices (model inference).

Parameters:

-   **predictor\_realization\_pair** (_pandas.DataFrame_) –
    
    Indexed by date, with at columns `'Predicted Regime'` (forward-looking regime)
    
    and `'Actual Regime'` (realized regime).
    
-   **forecast\_horizon** (_int_) – Number of steps ahead that predictions refer to.
    
-   **trained\_model** (_object_ _or_ _None_) – Fitted estimator that supports .predict(X) and optionally .predict\_proba(X). May be `None` for baselines (e.g. lagged predictor).
    
-   **model\_name** (_str_) – Human-readable model identifier.
    
-   **train\_start\_date** (_str_ _or_ _pandas.Timestamp_) – Start date for the initial training pool.
    
-   **forecast\_start\_date** (_str_ _or_ _pandas.Timestamp_) – First date for which a forecast was produced.
    
-   **forecast\_end\_date** (_str_ _or_ _pandas.Timestamp_) – Last date for which a forecast was produced.
    
-   **window\_size** (_int_) – Size (in observations) of the rolling window if not expanding.
    
-   **retrain\_frequency** (_int_) – How often to refit / partially update the model (0 means train once).
    
-   **expanding** (_bool_) – If `True`, use expanding windows; otherwise rolling windows.
    
-   **probabilities** (_pandas.DataFrame__,_ _optional_) – Optional per-class probabilities aligned to the forecast index.
    
-   **evaluation\_metrics** (_dict__,_ _optional_) – Dictionary of evaluation metrics (e.g., `{'accuracy': 0.74}`).
    
-   **required\_columns** (_list_ _of_ _str__,_ _optional_) – Required predictor column names for feature-mode inference.
    
-   **hist\_regimes** (_pandas.Series_ _or_ _pandas.DataFrame__,_ _optional_) – Historical regime series for context.
    
-   **\_regimes\_map** (_dict__,_ _optional_) – Mapping from string labels to integer codes used internally.
    

_property_ forecast\_horizon_: int_[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.forecast_horizon "Link to this definition")

Forecast horizon (read-only).

Returns:

Number of steps ahead that predictions refer to.

Return type:

int

get\_hist\_regimes()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.get_hist_regimes "Link to this definition")

Get the historical regime series.

Returns:

Historical regimes indexed by date, or `None` if not available.

Return type:

pandas.Series or pandas.DataFrame or None

get\_predictor\_realization\_pair()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.get_predictor_realization_pair "Link to this definition")

Get the predicted vs. actual regimes table.

Returns:

DataFrame with columns `'Predicted Regime'` and `'Actual Regime'` (labels as strings).

Return type:

pandas.DataFrame

get\_probabilities()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.get_probabilities "Link to this definition")

Return the stored prediction probabilities, if available.

The probabilities DataFrame has: - index = forecast dates, - columns = regime labels, - values = probability assigned to each regime on that date.

Returns:

Probability distribution per forecast date. Returns `None` if no probability information is stored for this predictor.

Return type:

pandas.DataFrame or None

get\_required\_columns()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.get_required_columns "Link to this definition")

Get the required predictor columns for feature-mode inference.

Returns:

Required feature names, or `None` if unknown.

Return type:

list of str

predict(_arg_, _return\_probabilities\=False_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.predict "Link to this definition")

Predict regimes from a date lookup or an explicit feature matrix.

Behavior depends on the type of arg:

-   **Date mode** (str or pandas.Timestamp): returns the stored prediction for the most recent date ≤ the query date.
    
-   **Feature mode** (pandas.DataFrame): runs the attached model on the given features and returns predictions (and optionally probabilities).
    

Parameters:

-   **arg** (_{str__,_ _pandas.Timestamp__,_ _pandas.DataFrame}_) – Date string/timestamp for lookup **or** a feature matrix with columns including [`required_columns`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.required_columns "fds.fpe.quant.global_macro.predictor.RegimePredictor.required_columns").
    
-   **return\_probabilities** (_bool__,_ _default False_) – If `True`, return probabilities when available.
    

Returns:

-   Date mode, return\_probabilities=False → scalar predicted label or `None`.
    
-   Date mode, return\_probabilities=True → `(label, Series|None)`.
    
-   Feature mode, return\_probabilities=False → `pandas.Series` of labels.
    
-   Feature mode, return\_probabilities=True → `(Series, DataFrame|None)`.
    

Return type:

object

Notes

In feature mode, NaNs in inputs are filled with 0 prior to inference. Probability output requires the estimator to implement `predict_proba`.

_property_ required\_columns_: list_[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.required_columns "Link to this definition")

Required feature names for method predict in feature mode (read-only).

Returns:

Predictor column names.

Return type:

list of str

summary()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor.summary "Link to this definition")

Summarize key configuration, windows, and evaluation metrics.

Returns:

Keys: `'Model'`, `'Forecast Horizon'`, `'Train Start'`, `'Forecast Start'`, `'Forecast End'`, `'Window Size'`, `'Retrain Frequency'`, `'Expanding'`, `'Accuracy'`.

Return type:

dict

_class_ fds.fpe.quant.global\_macro.predictor.RegimePredictorBuilder(_regimes\_data_, _predictors\_data\=None_, _returns\_data\=None_, _asset\_classes\=None_, _regime\_indicators\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder "Link to this definition")

Orchestrator for preparing data, training classifiers, and forecasting regimes.

The builder:

-   Loads regimes/predictors/returns,
    
-   Aligns datasets on time,
    
-   Constructs X\_full and y\_full,
    
-   Trains built-in (or user-provided) classifiers over rolling/expanding windows,
    
-   Produces forecasts and accuracy metrics,
    
-   Builds ensembles and optional interactive widgets.
    

Parameters:

-   **regimes\_data** (_str_ _or_ _pandas.DataFrame_) – Path to regimes (CSV/HDF5) or a DataFrame containing at least `['Date', 'Regime']`.
    
-   **predictors\_data** (_str_ _or_ _pandas.DataFrame__,_ _optional_) – Path or DataFrame of predictor time series. Must include a `'Date'` column and one or more numeric predictor columns.
    
-   **returns\_data** (_str_ _or_ _pandas.DataFrame__,_ _optional_) – Optional returns with `'Date'` plus asset columns; used for plotting.
    
-   **asset\_classes** (_list_ _of_ _str__,_ _optional_) – Asset names present in returns\_data for the simple 0/1 strategy widget.
    
-   **regime\_indicators** (_list_ _of_ _str__,_ _optional_) – Subset of columns from regimes/predictors to include in features. If omitted, all non `{'Date','Regime'}` columns from regimes\_data are used.
    

X\_full[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.X_full "Link to this definition")

Full feature matrix aligned across regimes and predictors, indexed by date.

Type:

pandas.DataFrame

y\_full[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.y_full "Link to this definition")

Target table with a single column `'Regime'` (integer codes), indexed by date.

Type:

pandas.DataFrame

Notes

-   Missing values in X\_full are replaced with 0 and a warning is emitted with per-column NaN counts.
    
-   The builder does not train models itself at construction time; it simply prepares consistent datasets and offers helper methods to train and evaluate classifiers in a regime prediction context.
    
-   Incrementally updates models when supported (e.g., partial\_fit on SGD). For models that do not support partial training, retrains the model from scratch on each training date
    

build\_lagged\_predictor(_forecast\_horizon_, _forecast\_start\_date\=None_, _forecast\_end\_date\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.build_lagged_predictor "Link to this definition")

Build a baseline that predicts the regime observed h steps **before** the target date.

Parameters:

-   **forecast\_horizon** (_int_) – Lag in periods (how far ahead to predict).
    
-   **forecast\_start\_date** (_str_ _or_ _pandas.Timestamp__,_ _optional_) – First forecast date; defaults to earliest available.
    
-   **forecast\_end\_date** (_str_ _or_ _pandas.Timestamp__,_ _optional_) – Last forecast date; defaults to latest available.
    

Returns:

Wrapper containing the lagged predictions, realized regimes, a one-hot probability table (1.0 on the predicted class), and accuracy.

Return type:

[RegimePredictor](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")

Notes

This is a strong baseline when regimes are persistent.

ensemble\_predictors(_predictors_, _method\='proba\_mean'_, _weights\=None_, _combine\_index\='intersection'_, _tie\_break\='lower\_label'_, _name\='Ensemble'_, _forecast\_horizon\=None_, _return\_probabilities\=True_, _enforce\_same\_horizon\=True_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.ensemble_predictors "Link to this definition")

Combine multiple [`RegimePredictor`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor") objects into an ensemble.

Parameters:

-   **predictors** (_list__\[_[_RegimePredictor_](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")_\] or_ _dict__\[__str__,_ [_RegimePredictor_](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")_\]_) – Base predictors to combine. Dict keys (names) are used for weighting.
    
-   **method** (_{'majority'__,_ _'weighted'__,_ _'proba\_mean'}__,_ _default 'proba\_mean'_) –
    
    -   `'majority'` : Unweighted majority vote.
        
    -   `'weighted'` : Weighted vote using weights.
        
    -   `'proba_mean'` : Average per-class probabilities (fallback to vote if none).
        
-   **weights** (_list__\[__float__\] or_ _dict__\[__str__,_ _float__\]__,_ _optional_) – Weights for the `'weighted'` method.
    
-   **combine\_index** (_{'intersection'__,_ _'union'}__,_ _default 'intersection'_) – Alignment rule across base predictors’ date indices.
    
-   **tie\_break** (_{'lower\_label'__,_ _'first'__,_ _'random'}__,_ _default 'lower\_label'_) – Tie-breaking rule for votes.
    
-   **name** (_str__,_ _default 'Ensemble'_) – Name of the ensemble predictor.
    
-   **forecast\_horizon** (_int__,_ _optional_) – If provided, all base predictors must share this horizon unless enforce\_same\_horizon=False.
    
-   **return\_probabilities** (_bool__,_ _default True_) – If `True` and `method='proba_mean'`, include the averaged probability table in the result’s `probabilities` attribute.
    
-   **enforce\_same\_horizon** (_bool__,_ _default True_) – Enforce horizon consistency across base predictors.
    

Returns:

A predictor whose `predictor_realization_pair` contains `'Predicted Regime'` (and `'Actual Regime'` when available) over ensemble dates. `evaluation_metrics['accuracy']` is included if actuals exist for those dates. `probabilities` is included when `method='proba_mean'` and `return_probabilities=True`.

Return type:

[RegimePredictor](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")

Raises:

**ValueError** – For empty inputs, inconsistent horizons (when enforced), or invalid combine\_index/method/weights settings.

Notes

The ensemble index can be the intersection or union of base predictors’ indices.

models(_names\_only\=True_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.models "Link to this definition")

List available built-in classifier models.

Parameters:

**names\_only** (_bool__,_ _default True_) – If True, return a list of model names. If False, return the {name: estimator with params} dict.

Returns:

Model identifiers or full registry.

Return type:

list\[str\] or dict

predictors\_widget(_predictors_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.predictors_widget "Link to this definition")

Build an interactive ipywidgets UI for comparing predictors and a simple 0/1 strategy.

The widget creates two tabs:

1\. **Regime Comparison** - plots Predicted vs. Actual regimes over a selectable date range for a chosen predictor.

2\. **0/1 Strategy** - if returns\_data and asset\_classes are supplied, shows a naive invest-when-in-regimes strategy and cumulative return.

Parameters:

**predictors** (_dict__\[__str__,_ [_RegimePredictor_](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")_\]_) – Mapping of predictor names to [`RegimePredictor`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor") instances.

train\_and\_forecast\_regimes(_forecast\_start\_date_, _forecast\_end\_date_, _model\_name_, _train\_start\_date\=None_, _window\_size\=36_, _retrain\_frequency\=3_, _seed\=42_, _expanding\=True_, _forecasting\_horizon\=1_, _verbose\=False_, _my\_model\_instance\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictorBuilder.train_and_forecast_regimes "Link to this definition")

Train a classifier over rolling/expanding windows and produce forecasts.

Parameters:

-   **forecast\_start\_date** (_str_) – First date for which to produce a forecast.
    
-   **forecast\_end\_date** (_str_) – Last date for which to produce a forecast.
    
-   **model\_name** (_str_) – Name in the built-in registry (see method models()) unless a custom my\_model\_instance is supplied.
    
-   **train\_start\_date** (_str_ _or_ _None__,_ _optional_) – If provided, restrict the training pool to dates on/after this.
    
-   **window\_size** (_int__,_ _default=36_) – Rolling window size when `expanding=False`.
    
-   **retrain\_frequency** (_int__,_ _default=3_) – How often to refit/partially-update; `0` = fit only once then reuse.
    
-   **seed** (_int__,_ _default=42_) – Random seed for models created from the registry.
    
-   **expanding** (_bool__,_ _default=True_) – If `True`, use expanding windows; else use fixed-size rolling windows.
    
-   **forecasting\_horizon** (_int__,_ _default=1_) – Number of steps ahead to forecast.
    
-   **verbose** (_bool__,_ _default=False_) – Emit debug/progress messages.
    
-   **my\_model\_instance** (_object__,_ _optional_) – A pre-instantiated estimator **with at least \`.fit(X, y)\` and \`.predict(X)\` methods**. If it also implements .partial\_fit(X, y), the loop will call it on scheduled. If None, a model is created internally based on `model_name`.
    

Returns:

A wrapper containing the realized/forecasted series, the fitted model, and evaluation metrics (e.g., accuracy).

Return type:

[RegimePredictor](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.RegimePredictor "fds.fpe.quant.global_macro.predictor.RegimePredictor")

fds.fpe.quant.global\_macro.predictor.merge\_dataframes\_on\_datetime(_df1_, _df2_, _how\='inner'_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.predictor.merge_dataframes_on_datetime "Link to this definition")

Merge two DataFrames with DatetimeIndex along time axis.

Parameters:

-   **df1** (_pd.DataFrame_) – First DataFrame with DatetimeIndex.
    
-   **df2** (_pd.DataFrame_) – Second DataFrame with DatetimeIndex.
    
-   **how** (_str__,_ _optional_) – Merge method: - ‘inner’: keep only common indices - ‘outer’: union of indices with NaNs filled where missing
    

Returns:

Merged DataFrame along index (time), columns from both frames.

Return type:

pd.DataFrame

## RegimeBacktester and SimulationResult classes[#](https://fpe.factset.com/docs/global_macro_predictor.html#regimebacktester-and-simulationresult-classes "Link to this heading")

Backtesting utilities for regime-aware portfolio research.

This module provides:

-   [`SimulationResult`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult "fds.fpe.quant.global_macro.regime_backtester.SimulationResult") — a results container that stores portfolio value series and weights for one or multiple strategies, computes KPIs, and offers plotting utilities (performance curves, weights, wealth paths, and multi-horizon plots).
    
-   [`RegimeBacktester`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester "fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester") — a rolling/expanding backtester that interfaces with a regime predictor to compute conditional means/variances (CMAs), apply objectives (e.g., “Max Sharpe”), respect bounds/turnover controls, and produce [`SimulationResult`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult "fds.fpe.quant.global_macro.regime_backtester.SimulationResult") objects.
    

### Design goals[#](https://fpe.factset.com/docs/global_macro_predictor.html#design-goals "Link to this heading")

-   **Time alignment**: careful handling of rolling/expanding windows and evaluation spans.
    
-   **Model agnosticism**: the backtester consumes a generic regime predictor that exposes predicted/realized regimes and (optionally) probabilities.
    
-   **Reusability**: utilities are decomposed into helpers for CMAs, bounds, and initialization so downstream code can extend/replace parts easily.
    

Examples

A typical flow (pseudo-code):

```
>>> rb = RegimeBacktester(returns_data=returns_df,
...                       regime_predictor=rp,
...                       asset_classes=["SPX","AGG","GOLD"])
>>> res = rb.run_multi_strategy_backtest(
...     window_size=120,
...     objectives=["Max Sharpe", "Max Return", "Risk Parity"],
...     max_turnover=25,
...     fit_start_date="1990-01-31",
...     backtest_start_date="2015-01-31",
...     backtest_end_date="2024-12-31",
...     expanding_window=True
... )
>>> res.plot_weights()
>>> res.plot_performance()
>>> res.get_performance_metrics()
>>> res.multihorizon_plot(objective = 'Max Sharpe', relative=True, measure='sharpe', min_len=12)
```

_class_ fds.fpe.quant.global\_macro.regime\_backtester.RegimeBacktester(_returns\_data_, _regime\_predictor_, _asset\_classes_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester "Link to this definition")

Regime-aware portfolio backtester.

This class builds **conditional means/variances (CMAs)** under regime filters, optimizes portfolios under a user objective (e.g., Max Sharpe), applies optional **turnover constraints**, and returns a [`SimulationResult`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult "fds.fpe.quant.global_macro.regime_backtester.SimulationResult") object.

Parameters:

-   **returns\_data** (_str_ _|_ _pandas.DataFrame_) – Returns table (index = Date, columns = asset classes). Strings are treated as file paths and loaded; DataFrames are used directly.
    
-   **regime\_predictor** (`RegimePredictor` object) – A `RegimePredictor` object that exposes realized/predicted regimes; used for filtering observations into CMAs.
    
-   **asset\_classes** (_list__\[__str__\]_) – Asset column names in returns\_data to consider in the backtest.
    

Notes

-   Windowing: both **expanding** and **rolling** windows are supported.
    
-   Objective normalization accepts human-friendly strings like `"Max Sharpe"` or `"Risk Parity"`.
    
-   Bounds/initial weights helpers centralize constraints for reuse.
    

coverage()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester.coverage "Link to this definition")

Show coverage of asset classes over time, including start/end date and % coverage.

Returns:

A dictionary with basic coverage stats (date range, observation counts).

Return type:

dict

optimize\_for\_date(_eval\_date_, _objective\='Max Sharpe'_, _initial\_weights\=None_, _bound\_constraints\=None_, _max\_turnover\=None_, _apply\_regimes\=True_, _regime\=None_, _window\_size\=60_, _fit\_start\_date\=None_, _fit\_end\_date\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester.optimize_for_date "Link to this definition")

Run a single-period portfolio optimization at a specified evaluation date.

This method mirrors the logic of `run_single_backtest` but for a single point in time. The optimization can be performed in either regime-aware or regime-agnostic mode.

Parameters:

-   **eval\_date** (_str_) – Date at which the optimization is evaluated.
    
-   **objective** (_{"Max Sharpe"__,_ _"Max Return"__,_ _"Min Var"__,_ _"Risk Parity"__,_ _...__}__,_ _default="Max Sharpe"_)
    
-   **initial\_weights** (_dict__\[__str__,_ _float__\]__,_ _optional_) – Starting portfolio weights. If None, defaults to equal weights
    
-   **bound\_constraints** (_dict_ _or_ _list__,_ _optional_) – Asset-level or group-level allocation constraints, in the same format accepted by `run_single_backtest`.
    
-   **max\_turnover** (_float__,_ _optional_) – Maximum turnover allowed in the optimization step. If None, no turnover constraint is enforced.
    
-   **apply\_regimes** (_bool__,_ _default=True_) – Whether to optimize conditionally on a specific regime (True) or in a regime-agnostic fashion (False).
    
-   **regime** (_str__,_ _optional_) – Explicit regime label to use if `apply_regimes=True`.
    
-   **window\_size** (_int__,_ _default=60_) – Lookback window length (in months) used only when `apply_regimes=False` and `fit_start_date` is not provided.
    
-   **fit\_start\_date** (_str__,_ _optional_) – Start date for CMA estimation. If None with `apply_regimes=True`, defaults to the earliest available returns date; If None with `apply_regimes=False`, defaults to a rolling `window_size` months before the latest date for which returns data is available (or `eval_date` is earlier).
    
-   **fit\_end\_date** (_str__,_ _optional_) – End date for CMA estimation. If provided, caps the CMA window; otherwise defaults to `eval_date` (capped by last available return date).
    

Returns:

**result\_fpo** –

Optimization result from the FPO Engine. Contains:

-   `weights`: DataFrame containing initial and optimal portfolio allocation as well as Lower and Upper Bounds on asset classes
    
-   `objective`: initial and optimal objective value
    
-   `statistics`: KPIs for Initial and Optimal portfolio allocations any additional metrics exposed by `FPOEngine`
    
-   `aggregated_constraints`: information about aggregated weight constraints for the Initial and Optimal portfolio allocations
    

Return type:

dict

Notes

-   In regime-aware mode, CMAs are taken from the specified regime block.
    
-   In regime-agnostic mode, CMAs are taken from the first block in the container.
    
-   Only exact `regime` labels currently supported.
    

run\_multi\_strategy\_backtest(_window\_size\=60_, _max\_turnover\=None_, _objectives\=None_, _bound\_constraints\=None_, _initial\_weights\=None_, _constrain\_first\_turnover\=True_, _fit\_start\_date\=None_, _fit\_end\_date\=None_, _backtest\_start\_date\=None_, _backtest\_end\_date\=None_, _expanding\_window\=False_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester.run_multi_strategy_backtest "Link to this definition")

Run a batch of rolling backtests across multiple optimization objectives, **with and without** regime information, and return all results in a single [`SimulationResult`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult "fds.fpe.quant.global_macro.regime_backtester.SimulationResult") object.

For each objective in objectives, this method runs two simulations by delegating to run\_single\_backtest:

1.  **With regimes** (apply\_regimes=True)
    
2.  **Without regimes** (apply\_regimes=False)
    

The outputs (portfolio value series, weight histories, and the parameter snapshot used) are collected in dictionaries keyed by a readable label (e.g., “Max Sharpe with regimes”, “Max Sharpe w/o regimes”), then packaged into a SimulationResult.

Parameters:

-   **window\_size** (_int__,_ _default 60_) – Rolling window length (in periods) passed to run\_single\_backtest for CMA fitting and data preparation. See that method’s docstring for the exact fit logic under rolling vs. expanding windows.
    
-   **max\_turnover** (_float__,_ _optional_) – Two-way turnover limit (in %) between adjacent rebalance dates, passed through to run\_single\_backtest. If None, no turnover constraint.
    
-   **objectives** (_list_ _of_ _str__,_ _optional_) –
    
    Optimization objectives to evaluate. If None, defaults to: \[“Max Sharpe”, “Max Return”, “Min Variance”, “Risk Parity”\].
    
    Accepted forms:
    
    **Strings** (case/alias tolerant):
    
    > -   ”Max Sharpe” (aliases: “m sharpe”)
    >     
    > -   ”Max Return”
    >     
    > -   ”Min Variance” (aliases: “min var”, “min vol”, “min volatility”)
    >     
    > -   ”Risk Parity” (alias: “risk par”)
    >     
    
-   **bound\_constraints** (_dict_ _or_ _list__,_ _optional_) –
    
    Per-asset and/or grouped weight bounds passed through to run\_single\_backtest. See that method for accepted structures:
    
    -   List \[lo%, hi%\] to apply to all assets, or
        
    -   Dict with per-asset entries and/or group specs with ‘group’, ‘bounds’, and ‘apply\_to’.
        
-   **initial\_weights** (_dict__,_ _optional_) – Starting weights by asset name. If None, starts from equal weights.
    
-   **constrain\_first\_turnover** (_bool__,_ _default True_) – Whether to apply the turnover constraint on the first optimization date.
    
-   **fit\_start\_date** (_str__,_ _optional_) – CMA fitting period bounds passed to run\_single\_backtest. Their effect depends on expanding\_window, window\_size, and apply\_regimes as documented in run\_single\_backtest.
    
-   **fit\_end\_date** (_str__,_ _optional_) – CMA fitting period bounds passed to run\_single\_backtest. Their effect depends on expanding\_window, window\_size, and apply\_regimes as documented in run\_single\_backtest.
    
-   **backtest\_start\_date** (_str__,_ _optional_) – Start/end dates for the trading/backtest period. If omitted, sensible defaults are derived from the data and window\_size.
    
-   **backtest\_end\_date** (_str__,_ _optional_) – Start/end dates for the trading/backtest period. If omitted, sensible defaults are derived from the data and window\_size.
    
-   **expanding\_window** (_bool__,_ _default False_) – If True, uses an expanding estimation window for CMA fitting; if False, uses rolling or fixed training per window\_size. See run\_single\_backtest for details.
    

Returns:

**SimulationResult**

Return type:

containing portfolio values, weights, and parameters.

Notes

-   Internally iterates run\_single\_backtest() for each objective and merges outputs.
    

run\_single\_backtest(_objective_, _bound\_constraints\=None_, _window\_size\=60_, _max\_turnover\=None_, _apply\_regimes\=True_, _initial\_weights\=None_, _constrain\_first\_turnover\=False_, _fit\_start\_date\=None_, _fit\_end\_date\=None_, _backtest\_start\_date\=None_, _backtest\_end\_date\=None_, _expanding\_window\=False_, _\_internal\_call\=False_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester.run_single_backtest "Link to this definition")

Run a rolling backtest with regime-aware or regime-agnostic CMAs using specified objective.

The method dynamically determines fit periods for CMA estimation based on the combination of parameters, following this logic:

**Fit Date Logic:**

1.  **Expanding Window (expanding\_window=True):**
    
    -   fit\_start\_date: Fixed at method parameter or data start
        
    -   fit\_end\_date: Dynamically updated to current\_date on each iteration
        
    -   CMAs are re-fitted each period using all data from fit\_start\_date to current\_date
        
    
2.  **Rolling Window (expanding\_window=False, apply\_regimes=False, window\_size > 0):**
    
    -   fit\_start\_date: Dynamically updated to current\_date - window\_size on each iteration
        
    -   fit\_end\_date: Dynamically updated to current\_date on each iteration
        
    -   CMAs are re-fitted each period using rolling window\_size periods ending at current\_date
        
    
3.  **Fixed Training Period (expanding\_window=False, window\_size=0 or apply\_regimes=False):**
    
    -   fit\_start\_date: Fixed at method parameter or data start
        
    -   fit\_end\_date: Fixed at method parameter or backtest\_start\_period
        
    -   CMAs are fitted only once in the first iteration, then reused
        
    
4.  **Regime-Based (apply\_regimes=True):**
    
    -   Uses initial fit\_start\_date and the logic for expanding or fixed training period
        
    -   CMAs fitted conditional on regime for the entire training data
        
    -   Regime selection happens at prediction time
        
    

Parameters:

-   **objective** (_str_) – Optimization objective. Either “Max Sharpe”, “Max Return”, “Min Variance” or “Risk Parity”
    
-   **bound\_constraints** (_dict_ _or_ _list__,_ _optional_) –
    
    A dictionary with the names of the assets as keys and lists of lower and upper bounds in percent on the weights as values:
    
    ```
    Structure:
        {
            str: list[lower_bound(%), upper_bound(%)]
        }
    
    Example:
        asset_weight = {
            asset_1: [5, 20]
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
        asset_weight = {
            'group_name': {
                'group': ['asset_id_1', 'asset_id_5', ...],
                'bounds': [0, 25],
                'apply_to': 'Cumulative' or 'Individual'
            }
        }
    ```
    
    Keys should have the following values:
    
    -   **group**: list of the names of member assets
        
    -   **bounds**: list of lower and upper bound in percent.
        
    -   **apply\_to**: str; If ‘Cumulative’ bounds are applicable to the sum of the weights of each member asset. If absent or ‘Individual’ bounds are applicable to each member asset individually.
        
    
    Alternatively, a list of lower and upper bounds in percent can be provided. These bounds will be applied to all signals individually.:
    
    ```
    Structure:
        [lower_bound(%), upper_bound(%)]
    
    Example:
        asset_weight = [5, 20]
    ```
    
-   **window\_size** (_int__,_ _default=60_) –
    
    Rolling window size in periods for CMA estimation. Used for:
    
    -   Rolling window: number of periods to look back for CMA fitting
        
    -   Data preparation: number of periods before backtest\_start\_date to include
        
    -   When 0: depending on expanding\_window, uses either fixed training period or expanding window between fit\_start\_date and fit\_end\_date determined as explained below
        
    
-   **max\_turnover** (_float__,_ _optional_) –
    
    Maximum portfolio turnover constraint between periods (in %) If None, no turnover constraint is applied
    
    Examples
    
    ```
    >>> max_turnover = 60   # For 60% two-way turnover bound between two consecutive periods
    ```
    
-   **apply\_regimes** (_bool__,_ _default=True_) – If True: Use regime-based CMAs If False: Use regime-agnostic CMAs
    
-   **initial\_weights** (_Dict__\[__str__,_ _float__\]__,_ _optional_) – Starting portfolio weights (in percent). If None, uses equal weights
    
-   **constrain\_first\_turnover** (_bool__,_ _default=False_) – Whether to apply turnover constraint in the first optimization period
    
-   **fit\_start\_date** (_str__,_ _optional_) –
    
    Start date for CMA estimation period. Behavior depends on other parameters:
    
    -   Expanding window: Fixed throughout backtest
        
    -   Rolling window: Overridden dynamically (current\_date - window\_size)
        
    -   Fixed period (window\_size = 0): Fixed throughout backtest
        
    
-   **fit\_end\_date** (_str__,_ _optional_) –
    
    End date for CMA estimation period. Behavior depends on other parameters:
    
    -   Expanding window: Overridden dynamically (current\_date)
        
    -   Rolling window: Overridden dynamically (current\_date)
        
    -   Fixed period (window\_size = 0): Fixed throughout backtest
        
    
-   **backtest\_start\_date** (_str__,_ _optional_) – Start date for portfolio optimization and trading. Default: data\_start + window\_size periods
    
-   **backtest\_end\_date** (_str__,_ _optional_) – End date for portfolio optimization and trading. Default: last available data date
    
-   **expanding\_window** (_bool__,_ _default=False_) – If True: Use expanding window for CMA fitting (overrides window\_size for fitting) If False: Use rolling window (window\_size > 0) or fixed period (window\_size = 0)
    

Return type:

[`SimulationResult`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult "fds.fpe.quant.global_macro.regime_backtester.SimulationResult") object containing portfolio values, weights, parameters, and KPIs.

visualize\_CMAs\_widget()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.RegimeBacktester.visualize_CMAs_widget "Link to this definition")

Creates an interactive widget for visualizing Conditional Mean-Variance statistics (CMAs) across different economic regimes and time windows.

Notes

-   Toggle regime conditioning (Condition on Regime / Ignore Regime).
    
-   Choose a regime (only used when conditioning).
    
-   Pick a single date range using a slider (two handles).
    
-   Displays:
    
    -   Bar chart of expected returns (with std devs).
        
    -   Heatmap of the correlation matrix.
        
    -   Count of data points used in CMA estimation for the chosen range / regime.
        
    

_class_ fds.fpe.quant.global\_macro.regime\_backtester.SimulationResult(_portfolios\_values_, _weights_, _parameters_, _regime\_predictor_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult "Link to this definition")

Container for one or multiple portfolio strategy runs. It results from running RegimeBacktester methods.

This class stores time-aligned **portfolio values**, **weights**, and **parameters** per strategy key, plus an optional link back to the regime predictor used in the backtest. It exposes:

-   KPI computation (return, volatility, Sharpe, max drawdown, Calmar, hit ratio, etc.).
    
-   Plotting helpers: performance curves, stacked weights, wealth evolution, and multi-horizon (triangle) visualizations.
    

Parameters:

-   **portfolios\_values** (_dict__\[__str__,_ _pandas.Series__\]_ _|_ _pandas.DataFrame_) – Per-strategy portfolio value series (all indexed by date), or a single DataFrame with columns = strategy keys.
    
-   **weights** (_dict__\[__str__,_ _pandas.DataFrame__\]_) – Per-strategy weights matrices (index = date; columns = asset classes).
    
-   **parameters** (_dict__\[__str__,_ _dict__\]_) – Arbitrary per-strategy metadata (e.g., objective, window size, bounds).
    
-   **regime\_predictor** (_object__,_ _optional_) – A reference to the predictor used to generate regimes, if applicable.
    

portfolio\_values[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.portfolio_values "Link to this definition")

All strategies’ portfolio values concatenated along columns.

Type:

pandas.DataFrame

weights[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.weights "Link to this definition")

Mapping from strategy key to weight matrix.

Type:

dict\[str, pandas.DataFrame\]

parameters[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.parameters "Link to this definition")

Mapping from strategy key to parameter dictionary.

Type:

dict\[str, dict\]

KPIs[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.KPIs "Link to this definition")

Computed KPI table (one row per strategy).

Type:

pandas.DataFrame

regime\_predictor[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.regime_predictor "Link to this definition")

Optional reference used for traceability.

Type:

object or None

get\_performance\_metrics(_round\_digits\=2_, _start\_date\=None_, _end\_date\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.get_performance_metrics "Link to this definition")

Return the KPI DataFrame for all strategies, rounded, optionally calculated for a specific date range.

Parameters:

-   **round\_digits** (_int__,_ _default 2_) – Number of decimal places to round to
    
-   **start\_date** (_str_ _or_ _pd.Timestamp__,_ _optional_) – Start date for KPI calculation (format: ‘YYYY-MM-DD’)
    
-   **end\_date** (_str_ _or_ _pd.Timestamp__,_ _optional_) – End date for KPI calculation (format: ‘YYYY-MM-DD’)
    

Returns:

KPI table over the requested period.

Return type:

pd.DataFrame

multihorizon\_plot(_objective\='Max Sharpe'_, _relative\=True_, _regimes\_on\=True_, _measure\='sharpe'_, _min\_len\=12_, _annualize\_period\=12_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.multihorizon_plot "Link to this definition")

Produce a multi-horizon heatmap of portfolio performance.

This method generates a “triangle” plot where each pixel corresponds to a start–end date combination, and the color encodes the magnitude of the chosen performance measure. It can display either absolute results (with or without regimes) or relative results (with regimes vs. without regimes).

Parameters:

-   **objective** (_str__,_ _default="Max Sharpe"_) – Name of the strategy/objective to visualize.
    
-   **relative** (_bool__,_ _default=True_) –
    
    -   If True, plot **relative performance** of the strategy with regimes versus the same strategy without regimes.
        
    -   If False, plot absolute performance determined by `regimes_on`.
        
-   **regimes\_on** (_bool__,_ _default=True_) – Only used when `relative=False`. - If True, plot absolute performance of the **with regimes** portfolio. - If False, plot absolute performance of the **w/o regimes** portfolio.
    
-   **measure** (_{"return"__,_ _"sharpe"}__,_ _default="sharpe"_) – Performance measure to display in the triangle: - “return”: cumulative return - “sharpe”: Sharpe ratio (annualized).
    
-   **min\_len** (_int__,_ _default=12_) – Minimum number of periods between start and end dates required for a horizon to be included in the plot.
    
-   **annualize\_period** (_int__,_ _default=12_) – Number of periods per year used for annualization (e.g. 12 for monthly data, 252 for daily data).
    

plot\_performance()[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.plot_performance "Link to this definition")

Plot cumulative performance of all strategies on a shared axis.

Notes

-   Cumulative performance is computed from the portfolio values or linked returns. Labels are taken from strategy keys.
    

plot\_wealth\_evolution(_initial\_wealth\=1.0_, _show\_regimes\=False_, _regime\_color\_map\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.plot_wealth_evolution "Link to this definition")

Plot the evolution of investment wealth across multiple portfolios with an animated start-date slider, and (optionally) shaded regimes in the background.

Parameters:

-   **initial\_wealth** (_float__,_ _default=1.0_) – Wealth invested at the selected start date (rebasing for each slider step).
    
-   **show\_regimes** (_bool__,_ _default=False_) – If True, overlay shaded vertical spans indicating macro regimes over time.
    
-   **regime\_color\_map** (_dict_ _or_ _None__,_ _default=None_) – Optional mapping {regime\_label: “rgba(r,g,b,a)”} to control the overlay colors. If omitted, distinct translucent colors are generated automatically.
    

Notes

-   Interactive Plotly figure with an **animation slider** for the investment start date.
    
-   For each slider position (investment date), curves show the evolution of initial\_wealth compounded from that date for each portfolio.
    
-   When show\_regimes=True, the chart renders **shaded spans** for each contiguous regime interval (arbitrary number of regimes supported), and shows a legend of regime labels.
    

plot\_weights(_objective\=None_)[#](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.plot_weights "Link to this definition")

Plot stacked asset weights for strategies (optionally filtered by objective).

Parameters:

**objective** (_str_ _or_ _float_ _or_ _None__,_ _default None_) – If provided, filter strategies by an identifier in their key: - `"Max Sharpe"` to keep only Max-Sharpe runs.

Notes

-   Weight frames must be present in [`weights`](https://fpe.factset.com/docs/global_macro_predictor.html#fds.fpe.quant.global_macro.regime_backtester.SimulationResult.weights "fds.fpe.quant.global_macro.regime_backtester.SimulationResult.weights"). Strategies without weights are silently skipped.
