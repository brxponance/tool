---
created: 2026-05-11T13:06:48 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/backtest_from_at.html
author: 
---

# Importing an AT Model into FPE

> ## Excerpt
> Note

---
Note

Beta feature. See [below](https://fpe.factset.com/docs/backtest_from_at.html#id1) for a list of limitations.

[Backtest’s](https://fpe.factset.com/docs/backtest.html) `.from_at()` allows importing AT models into FPE Backtest.

## Basic Usage[#](https://fpe.factset.com/docs/backtest_from_at.html#basic-usage "Link to this heading")

### Copy AT Constituents into `Backtest.data`[#](https://fpe.factset.com/docs/backtest_from_at.html#copy-at-constituents-into-backtest-data "Link to this heading")

Passing just a model path to `Backtest.from_at()` will create a Backtest instance without appending any signals. The contents of the AT Constituents report will be copied to `bt.data`.

```
>>> model = 'FactSet:US Small Cap Model - QFL' # an AT model path
>>> bt = Backtest.from_at(
...     model,
... )
```

Then `bt.data` should be populated:

```
>>> bt.data.columns
Index(['ison_univ', 'Company Name', 'Ticker', 'Universe Returns',
       'Universe Returns Additional Return 2',
       'Universe Returns Additional Return 3',
       ...
```

#### Filter columns from AT Constituents[#](https://fpe.factset.com/docs/backtest_from_at.html#filter-columns-from-at-constituents "Link to this heading")

To avoid clutter in `bt.data`, use a skip list.

Columns of AT Constituents that match (in the [regex sense](https://docs.python.org/3/library/re.html)) any of the elements of the skip list will be skipped.

```
# patterns in skip_fields specify which columns from AT's Constituents Report will be skipped
>>> skip_fields = ['.*Fractile.*', '.*Universe Returns.*', '.*Universe  Returns.*']
>>> bt = Backtest.from_at(
...     model,
...     skip_fields = skip_fields,
... )
```

The matching columns are now filtered out:

```
>>> bt.data.columns
Index(['ison_univ', 'Company Name', 'Ticker', 'Weight',
       'Market Capitalization', 'Value-- Book Yield', 'Value-- Earnings Yield',
       'Value-- Sales Yield', 'Value-- CFO Yield',
       ...
```

### Append Factors[#](https://fpe.factset.com/docs/backtest_from_at.html#append-factors "Link to this heading")

In the above cases, data from the AT Constituents report is copied to `bt.data`, but factors (signals) are not appended. Use `.from_at()` with `append_factors = True` to have factors appended to the Backtest instance (some factors can be skipped by passing a `skip_factors` list, which works in a way similar to `skip_fields` described above).

```
>>> bt = Backtest.from_at(
...     model,
...     append_factors=True,
... )
```

We can check that the factors have been properly appended:

```
>>> bt.signal_parameters() # displays the imported signals' (factors') parameters
                                          mode weighting_schema custom_asset_weights  ... lower_values_rank_better q_weights layer_quantiling_on
Value-- Book Yield                   quantiles             None                 None  ...                    False      None              Sector
Value-- Earnings Yield               quantiles             None                 None  ...                    False      None              Sector
Value-- Sales Yield                  quantiles             None                 None  ...                    False      None              Sector
...
```

If `.from_at()` is called with `append_factors=False`, factors can still be appended with `bt.append_signal()` at a later point. Once there are some appended factors, calculate factor returns and performance in the usual way (by calling a report or with an explicit call to `bt.run_backtest()`).

### Setting the Benchmark[#](https://fpe.factset.com/docs/backtest_from_at.html#setting-the-benchmark "Link to this heading")

To set the benchmark (which is not imported from AT) use any one of the options accepted by Backtest:

```
>>> bt = Backtest.from_at(
...     model,
...     skip_fields = skip_fields,
...     append_factors = True,
...     benchmark = 'universe', # see Backtest docs for a list of allowed options
... )
```

To check that the benchmark has been properly set:

```
>>> bt.benchmark_id
'universe'
>>> bt.benchmark # benchmark returns in decimal
date
2020-12-31    0.000000
2021-01-29    0.054953
2021-02-26    0.057802
2021-03-31    0.004197
...
```

## Using `reload_model_data=True`[#](https://fpe.factset.com/docs/backtest_from_at.html#using-reload-model-data-true "Link to this heading")

When `reload_model_data=True` data is not sourced from the AT Constituents reports but is re-fetched from FactSet’s databases via FPE. This means that:

-   factors/universe formulas whose definitions include #-expressions (#ISONU, #D, #DT, etc.) are skipped as #-expressions are not currently handled in FPE
    
-   re-fetched data may differ from the data in AT Constituents due to updates in FactSet’s database (many users incrementially update their AT model data using append runs as a way to create a point-in-time dataset). In general re-fetched data in FPE should match AT Constituents data after a full rerun of the AT model.
    
-   instead of sourcing asset-level returns and market capitalization data from AT Constituents Backtest’s default returns and market capitalization sources are used (these can be overriden, see below).
    

## Overriding AT/Backtest Parameters[#](https://fpe.factset.com/docs/backtest_from_at.html#overriding-at-backtest-parameters "Link to this heading")

### `reload_model_data=False`[#](https://fpe.factset.com/docs/backtest_from_at.html#reload-model-data-false "Link to this heading")

When `reload_model_data=False` (the default), market capitalizations and returns data are sourced from the AT Constituents report. In this case overrides for `returns_source` or `mcaps_source` that are passed to `.from_at()` are ignored. The same applies to `start` and `stop`.

The following keyword arguments can still be passed to `.from_at()` to override the Backtest defaults:

-   `risk_model_id`
    
-   `sectors_source`
    
-   `volatility_source`
    
-   `beta_source`
    
-   `name`
    

### `reload_model_data=True`[#](https://fpe.factset.com/docs/backtest_from_at.html#reload-model-data-true "Link to this heading")

When `reload_model_data=True` the limitations mentioned above do not apply and `start`, `stop`, `returns_source`, and `mcaps_source` can be overriden by passing the respective keywords to `.from_at()`.

If no values are passed, the Backtest defaults are used.

## Limitations[#](https://fpe.factset.com/docs/backtest_from_at.html#limitations "Link to this heading")

Not all AT features have a corresponding match in FPE Backtest.

`Backtest.from_at()` imports the following model parameters from AT and uses them to set up the Backtest instance:

-   start, stop, frequency, calendar
    
-   universe/universe definition
    
-   simple factors
    
    -   factor IDs and formulas
        
    
-   composite factors (MFRs)
    
    -   factor IDs and constituents (with some caveats re: conditional MFRs, see below)
        
    
-   universe formulas
    

### Unsupported features[#](https://fpe.factset.com/docs/backtest_from_at.html#unsupported-features "Link to this heading")

Some AT model parameters and features are currently not imported into FPE Backtest:

-   return sources (returns formula, mcap formula, and weights formula)
    
    -   in case `reload_model_data=False`, asset-level returns and market capitalizations are imported from AT’s Constituents report
        
    -   when `reload_model_data=True`, Backtest’s default `returns_source` and `mcap_source` are used (can be overriden)
        
    
-   currency
    
-   benchmark
    
    -   a benchmark can be specified by passing a keyword to `.from_at()` (see [Backtest’s documentation](https://fpe.factset.com/docs/backtest.html) for details).
        
    
-   conditional MFRs
    
    -   not supported with `reload_model_data=True` (conditional MFRs are skipped)
        
    -   when `reload_model_data=False` scores are imported from AT Constituents; the conditions and components are not
        
    
-   factors and universe formulas containing #-expressions (formulas such as #F, #ISONU, etc.) are skipped when `.from_at()` is used with `reload_model_data=True`
    
-   NA handling options
    
-   risk factors
    
-   period formulas
