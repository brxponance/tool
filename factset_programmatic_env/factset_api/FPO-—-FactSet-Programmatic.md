---
created: 2026-05-11T13:07:20 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/fpo.html
author: 
---

# FPO — FactSet Programmatic

> ## Excerpt
> FactSet Portfolio Optimizer (FPO) is a powerful, production optimizer, with a sophisticated FPO GUI
FPO can be used for a single optimization, an efficient frontier of optimizations (created by varying an input parameter), or a portfolio simulation.
Both optimizations and simulations create detailed results objects containing stats, exposures, and holdings.
Simulation writes to an OFDB, which can be analyzed using Portfolio Analysis.

---
_FactSet Portfolio Optimizer (FPO)_ is a powerful, production optimizer, with a sophisticated [FPO GUI](https://my.apps.factset.com/fpo) FPO can be used for a single optimization, an efficient frontier of optimizations (created by varying an input parameter), or a portfolio simulation. Both optimizations and simulations create detailed results objects containing stats, exposures, and holdings. Simulation writes to an OFDB, which can be analyzed using Portfolio Analysis.

Below are a summary of steps for optimization and portfolio simulation.

## Optimization[#](https://fpe.factset.com/docs/fpo.html#optimization "Link to this heading")

> -   Create FPO Strategy in _FPO GUI_.
>     
> -   Create PA Document (with Account) in _PA GUI_.
>     
> -   Create Optimizer object using _FPO_ function.
>     
> -   Run Optimzation(s) using _optimize_ function.
>     
> -   Examine results object(s).
>     

## Portfolio Simulation[#](https://fpe.factset.com/docs/fpo.html#portfolio-simulation "Link to this heading")

> -   Create FPO Strategy in _FPO GUI_.
>     
> -   Create PA Document in _PA GUI_.
>     
> -   Create Optimizer object using _FPO_ function.
>     
> -   Run Simulation using _portfolio\_simulation_ function.
>     
> -   Examine results object(s).
>     
> -   Analyze simulation results using Portfolio Analysis (in _PA GUI_ or FPE).
>     

[Online Assistant documentation for FPO GUI](https://my.apps.factset.com/oa/pages/21542)

## Efficient Frontier[#](https://fpe.factset.com/docs/fpo.html#efficient-frontier "Link to this heading")

> -   Create FPO Strategy in _FPO GUI_.
>     
> -   Create PA Document in _PA GUI_.
>     
> -   Create Optimizer object using _FPO_ function.
>     
> -   Construct the efficient frontier based on your setup
>     

## Data Preload[#](https://fpe.factset.com/docs/fpo.html#data-preload "Link to this heading")

> -   Create PA Document in _PA GUI_.
>     
> -   Preload the data for the selected universe and reuse it for faster simulation
>     
> -   Store the preloaded data to a file for future access
>     

## FPO[#](https://fpe.factset.com/docs/fpo.html#id1 "Link to this heading")

**Define an FPO object and run an optimization**

```
import pandas as pd
from fds.fpe.quant.fpo import FPO, optimize
from fds.fpe.ofdb import OFDB

# Create a portfolio containing $10MM USD to use as the initial portfolio
data = pd.DataFrame(
    {
        'date': ['20230630'],
        'symbol': ['CASH_USD'],
        'shares': [10000000],
        'price': [1],
        'company_name': ['U.S. Dollar'],
    }
).set_index(['date', 'symbol'])

my_ofdb = OFDB(
    ofdb_path='PERSONAL:CASH_PORT_FDS_123.OFDB',
    data=data,
    create_acct=True,
    acct_desc='Cash Portfolio',
    split_direction='normal',
    progress_bar=False,
)

# Create FPO object
optimizer = FPO(
    acct='PERSONAL:CASH_PORT_FDS_123.ACCT',
    strategy='BT_DOCUMENTS:US Large Cap',
    backtest_date='20230630',
    risk_model_date='20230630',
    risk_model_id_override='FDS:GLOBAL_EQUITY_M_V1',
)

# Run optimization
result = optimize(fpo=optimizer)
```

_class_ fds.fpe.quant.fpo.FPO(_strategy\=None_, _pa\_document\='AT\_DEMO:FPO TEMPLATE PA DOC'_, _output\_types\=None_, _backtest\_date\=None_, _risk\_model\_date\=None_, _acct\=None_, _var\_days\=None_, _var\_days\_yr\=None_, _cash\_flow\=None_, _currency\_override\=None_, _buy\_list\=None_, _alpha\_formula\=''_, _strategy\_name\=None_, _global\_variables\=None_, _portfolio\_override\=None_, _benchmark\_override\=None_, _risk\_model\_id\_override\=None_, _ofdb\_path\=None_, _strategy\_overrides\=None_, _portfolio\_composite\_level\=None_, _if\_exists\=None_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "Link to this definition")

An object containing your optimization settings.

Parameters:

-   **strategy** (_str__,_ _optional_) – The FPO strategy document to use in the optimization. This is created/saved using the FPO UI app, and contains all the optimization strategy settings. Required unless building a strategy programmatically with buy\_list + alpha\_formula.
    
-   **pa\_document** (_str__,_ _optional_) – The PA document to reference in the optimization. By default, AT\_DEMO:FPO TEMPLATE PA DOC.
    
-   **output\_types** (_FPOOutput object__,_ _optional_) – An FPOOutput object.
    
-   **backtest\_date** (_str_ _or_ [_RelativeDate_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates.RelativeDate")_,_ _required_) – The date used to fetch holdings, prices, and fixed income analytics. It is also used as the “0” date when resolving formulas.
    
-   **risk\_model\_date** (_str_ _or_ [_RelativeDate_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates.RelativeDate")_,_ _required_) – The date used to fetch the risk model.
    
-   **acct** (_str__,_ _optional_) – Allows you to override the .ACCT used as the initial portfolio. Provide the full path to the account, including all folders. The path may be specified with or without the “.ACCT” extension; for example: “PERSONAL:/OPTIMIZATION/STARTING\_ACCOUNT” or “PERSONAL:/OPTIMIZATION/STARTING\_ACCOUNT.ACCT”. Any metadata contained in this .ACCT will be applied to the current optimization. If this key is not defined, the .ACCT saved in the PA document will be used as the initial portfolio.
    
-   **var\_days** (_str__,_ _required only with Monte Carlo risk models_ _(__00FPO caccess__)_) – Used in conjunction with “varDaysYr”. The number of VaR days to use when optimizing with a Monte Carlo risk model. This input would be required whether the Monte Carlo risk model is specified using the initial .ACCT or using the “risk\_model\_id\_override”.
    
-   **var\_days\_yr** (_str__,_ _required only with Monte Carlo risk models_ _(__00FPO caccess__)_) – Used in conjunction with “varDays”, this key indicates whether the “varDays” value should be interpreted as trading days or calendar days. If trading days, specify “250”, if calendar days, specify “365”. This input would be required whether the Monte Carlo risk model is specified using the initial .ACCT or using the “risk\_model\_id\_override”.
    
-   **cash\_flow** (_str__,_ _optional_) – Provides a cash inflow/outflow currency amount to include in the optimization. If a cashflow amount is saved in the FPO strategy document, this key will override that value.
    
-   **currency\_override** (_str__,_ _optional_) – An ISO3 code defining the currency to use for your base cash position. This will be used instead of the currency defined in your PA document, which defaults to USD.
    
-   **buy\_list** (_str_ _or_ _dict__,_ _optional_) – Allows you to override the buy list used in the optimization. When building a strategy from scratch (without strategy parameter), this defines the investable universe. The behavior of this parameter depends on its type. **String input** When `buy_list` is provided as a string, it is passed through unchanged and interpreted by the optimizer. **For example** - `"PERSONAL:/OPTIMIZATION/BUY_LIST.ACCT"` - `"PERSONAL:/OPTIMIZATION/BUY_LIST.OFDB"` - `"BENCH:SP50"` - `"LION:SPY-US"` **Dictionary input (explicit screening override)** When `buy_list` is provided as a dictionary, it is interpreted as an explicit screening override. The dictionary must conform to the following schema: - `buy_list_type` : int Indicates the type of override: - `0` : Saved screen - `1` : Screening formula - `buy_list` : str or dict - For **Saved screen** (`buy_list_type = 0`), this is the path to the saved screening document. - For **Screening formula** (`buy_list_type = 1`), this is a dictionary containing screening expressions for one or more universes. Supported keys for screening formulas: - `equity` : str, optional - `debt` : str, optional At least one of `equity` or `debt` must be provided. **Examples** **Saved screen override** .. code-block:: python { “buy\_list\_type”: 0, “buy\_list”: “client:/path/to/saved\_screen” } **Equity screening formula** .. code-block:: python { “buy\_list\_type”: 1, “buy\_list”: { “equity”: “FG\_CONSTITUENTS(SP50,0,CLOSE)=1” } } **Debt screening formula** .. code-block:: python { “buy\_list\_type”: 1, “buy\_list”: { “debt”: “FI\_CLASSIFICATION(ISSR,CODE)=’CORP’” } } **Equity and debt screening formulas** .. code-block:: python { “buy\_list\_type”: 1, “buy\_list”: { “equity”: “FG\_CONSTITUENTS(SP50,0,CLOSE)=1”, “debt”: “FI\_CLASSIFICATION(ISSR,CODE)=’CORP’” } }
    
-   **alpha\_formula** (_str__,_ _optional_) – Formula defining expected returns (alpha) for securities. Required when building a strategy from scratch (without strategy parameter). Can reference OFDB data, screening formulas, or other FactSet data sources. Example: “FG\_EPS\_NTM / P\_PRICE” for an earnings yield signal.
    
-   **strategy\_name** (_str__,_ _optional_) – Name for storing the built or modified strategy. Required when building from scratch. When modifying an existing strategy, if not provided, the original strategy will be overwritten. Example: “Personal:/MyStrategy”.
    
-   **global\_variables** (_dict__,_ _optional_) – Allows you to override the default value of any global variables used in the optimization. This does not allow the creation of new global variables; the variable must be created using the UI app first. Variables must be specified in all caps. Example: .. code-block:: json { “MAXTRADES”: “10”, “MINWEIGHT”: “MIN(5,6)” }
    
-   **portfolio\_override** (_str__,_ _optional_) – Allows you to override just the holdings of the initial portfolio (the metadata contained in the .ACCT defined in the PA document, or defined using the “acct” key, if available, will still be used in the optimization).
    
-   **benchmark\_override** (_str__,_ _optional_) – Allows you to override the benchmark used in the optimization. By default, the benchmark saved in the referenced PA document will be used. Example: .. code-block:: json { “benchmark”: “BENCH:SP50” }
    
-   **risk\_model\_id\_override** (_str_ _or_ _RiskModel object__,_ _optional_) – Allows you to override the default risk model that is saved in the .ACCT being used as the initial portfolio. Define the risk model using the risk model ID. For example, to define the “FactSet Equity Model - Global ( Monthly)” model, enter: “FDS:GLOBAL\_EQUITY\_M\_V1”. For custom risk model use your RiskModel object.
    
-   **ofdb\_path** (_str__,_ _optional_) – Allows you to store the optimal portfolio to an acct. Provide the full path to the destination account, including all folders. The path may be given with or without the “.ACCT” extension; for example: “PERSONAL:/OPTIMIZATION/OPTIMIZATION\_RESULT” or “PERSONAL:/OPTIMIZATION/OPTIMIZATION\_RESULT.ACCT”. If the specified account does not exist, the account and corresponding OFDB will be created. If the OFDB already exists, the optimization result will be saved to that OFDB.
    
-   **strategy\_overrides** (_dict__,_ _optional_) – This can contain any of the following optional overrides tha can be applied to the FPO document settings. These overrides allow you to edit the settings used in the optimization; these values will not alter what is saved in the FPO document. - objective: dict, optional Allows you to adjust the objective of the strategy using either of the following keys: - active: str, optional Define the ID for the objective component you would like to make active. Example: .. code-block:: json { “active”: “/c/fds\_demo\_us/max\_return\_min\_ar.fpo\_objective” } - terms: dict, optional Enable/disable individual terms within the active objective using the term ID(s). Example: .. code-block:: json { “17237a429ec-10b247258f76”: “enable”, “17237a429ec-10b247258f77”: “disable” } - constraints: dict, optional Allows you to enable/disable existing document or shared constraints. Does not allow the ability to create brand new constraints. Define using key/value pairs, key=constraint ID, value=enable or disable. Example: .. code-block:: json { “185e5df0bdb-ea2078a34fdc6”: “disable” } This override also supports enabling constraint hierarchy evaluation, which allows constraint bounds to be softened by assigning them priority levels during the optimization. To enable constraint hierarchy, set `enableHierarchy` to `True` and optionally define a `hierarchy` mapping. The `hierarchy` mapping uses key/value pairs where: - key = constraint ID - value = integer hierarchy level Example: .. code-block:: json { “constraints”: { “19be2147d0a-8b025049d0992”: “enable”, “19bdebe0fcd-4e57477e26f8c”: “enable” }, “enableHierarchy”: true, “hierarchy”: { “19bdebe0fcd-4e57477e26f8c”: 1 } } - alpha: str, optional This value will override the expected return formula defined in the FPO strategy document. The units setting defined in the FPO document will remain unchanged. Example: .. code-block:: json { “alpha”: “OFDB(Client:/NewEstimates.OFDB, ‘ALPHA’, 0)” } - transactionCost: str, optional Allows you to change the transaction cost component used in the optimization. Define using the transaction cost component ID. Example: .. code-block:: json { “transactionCost”: “/c/fds\_demo\_us/medtranscost.fpo\_transcost” }
    
-   **portfolio\_composite\_level** (_int__,_ _optional_) – Allows you to set the ACTM traiding level for the optimization.
    

References

-   FPO OA: [https://my.apps.factset.com/oa/pages/21541](https://my.apps.factset.com/oa/pages/21541)
    
-   FPO API documentation: [https://developer.factset.com/api-catalog/factset-portfolio-optimizer-api](https://developer.factset.com/api-catalog/factset-portfolio-optimizer-api)
    
-   PA3 OA: [https://my.apps.factset.com/oa/pages/17520](https://my.apps.factset.com/oa/pages/17520)
    

get\_strategy\_names()[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.get_strategy_names "Link to this definition")

Extract the id to name mapping for the strategy components (objectives, constraints)

Return type:

`Tuple`\[`dict`\[`str`, `str`\], `dict`\[`str`, `dict`\[`str`, `str`\]\], `dict`\[`str`, `str`\]\]

Returns:

-   _A tuple, containing 3 dictionaries - one for the id to name mapping for the objective functions,_
    
-   _one for the id to name mapping for the terms in the objective functions and one for the id to name_
    
-   _mapping for the constraints. The mappings contain all defined items, not only the selected ones._
    

set\_tax\_settings(_name\='Tax Settings'_, _\*_, _short\_term\_tax\_rate\='35'_, _long\_term\_tax\_rate\='15'_, _short\_long\_threshold\='365'_, _accounting\_method\=0_, _realized\_short\_term\_gain\='0'_, _realized\_short\_term\_loss\='0'_, _realized\_long\_term\_gain\='0'_, _realized\_long\_term\_loss\='0'_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.set_tax_settings "Link to this definition")

Configure tax settings for the optimization strategy.

This method must be called before adding any tax-related constraints or objectives.

Parameters:

-   **name** (_str__,_ _default "Tax Settings"_) – Descriptive name for this tax configuration.
    
-   **short\_term\_tax\_rate** (_NumericValue__,_ _default "35"_) – Tax rate applied to short-term capital gains (in percent).
    
-   **long\_term\_tax\_rate** (_NumericValue__,_ _default "15"_) – Tax rate applied to long-term capital gains (in percent).
    
-   **short\_long\_threshold** (_NumericValue__,_ _default "365"_) – Number of days a position must be held to qualify for long-term treatment.
    
-   **accounting\_method** (_int__,_ _default 0_) – Method for identifying which tax lots are sold (0=FIFO, 1=LIFO, 2=Highest Cost, 3=Lowest Cost).
    
-   **realized\_short\_term\_gain** (_NumericValue__,_ _default "0"_) – Pre-existing realized short-term capital gains for the tax year.
    
-   **realized\_short\_term\_loss** (_NumericValue__,_ _default "0"_) – Pre-existing realized short-term capital losses for the tax year.
    
-   **realized\_long\_term\_gain** (_NumericValue__,_ _default "0"_) – Pre-existing realized long-term capital gains for the tax year.
    
-   **realized\_long\_term\_loss** (_NumericValue__,_ _default "0"_) – Pre-existing realized long-term capital losses for the tax year.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

enable\_hierarchy()[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.enable_hierarchy "Link to this definition")

Enable constraint hierarchy

Return type:

[`FPO`](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo._fpo.FPO")

Returns:

Returns self for method chaining.

disable\_hierarchy()[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.disable_hierarchy "Link to this definition")

Disable constraint hierarchy

Return type:

[`FPO`](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo._fpo.FPO")

Returns:

Returns self for method chaining.

add\_diversification\_constraint(_name_, _\*_, _assets\=''_, _max\_percent\=''_, _level\=0_, _unit\=1_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_diversification_constraint "Link to this definition")

Add a Diversification constraint to limit concentration in the top N holdings.

This constraint enforces an upper bound on the cumulative weight of the N largest positions in the portfolio:

> w\_{(1)} + w\_{(2)} + … + w\_{(N)} ≤ max\_percent

where w\_{(1)} ≥ w\_{(2)} ≥ … ≥ w\_{(N)} are portfolio weights sorted in descending order and N is controlled by the `assets` parameter. By capping the combined weight of the biggest holdings, the constraint prevents the optimizer from concentrating the portfolio in just a few names, complementing per-position limits (see [`add_limit_position_constraint()`](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_limit_position_constraint "fds.fpe.quant.fpo.FPO.add_limit_position_constraint")).

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **assets** (_NumericValue__,_ _default ""_) – Number of top holdings (N) included in the concentration sum. E.g., `"5"` restricts the combined weight of the 5 largest positions.
    
-   **max\_percent** (_NumericValue__,_ _default ""_) – Maximum allowed cumulative weight for those N holdings, expressed in the unit selected by `unit`. E.g., `"40"` means at most 40 % of the portfolio may be held in the top N names.
    
-   **level** (_int__,_ _default 0_) –
    
    Granularity at which the constraint is applied:
    
    -   0 — Portfolio: the constraint is evaluated across the entire portfolio.
        
    -   1 — Group: the constraint is applied within each group independently (requires `groupings`).
        
    -   2 — Asset: applied at the individual security level.
        
-   **unit** (_int__,_ _default 1_) –
    
    Unit in which `max_percent` is expressed:
    
    -   1 — Percent of portfolio (default). E.g., `asset="40"` means 40 % of assets satisfying max\_percent.
        
    -   2 — Number of positions.
        
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, treat as a soft constraint: violations are penalised rather than strictly forbidden. Useful when a hard constraint would make the problem infeasible.
    
-   **penalty\_type** (_int__,_ _default 0_) – Shape of the penalty function applied when `penalty_enabled=True`: - 0 — Linear penalty (cost proportional to violation size). - 1 — Quadratic penalty (cost proportional to violation size squared).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Cost per unit of constraint violation (penalty coefficient). Only relevant when `penalty_enabled=True`.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum tolerated violation of the constraint when `penalty_enabled=True`. Acts as a hard cap on how far the soft constraint can be breached.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Restrict the constraint to a specific asset class:
    
    -   0 — All assets (default).
        
    -   1 — Equity only.
        
    -   2 — Debt (fixed income) only.
        
    -   3 — Cash only.
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration used when `level=1` (Group). Specifies how assets are partitioned into groups for independent constraint evaluation.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite look-through depth for fund-of-funds or ETF positions. `-2` uses the strategy-level setting.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Limit the top 5 holdings to a maximum cumulative weight of 40 %:

```
>>> optimizer.add_diversification_constraint(
...     name="Top-5 cap",
...     assets="5",
...     unit=2,
...     max_percent="40",
... )
```

Soft version — penalise breaches instead of forbidding them:

```
>>> optimizer.add_diversification_constraint(
...     name="Top-5 soft cap",
...     assets="5",
...     max_percent="40",
...     unit=2,
...     penalty_enabled=True,
...     penalty_type=1,
...     penalty_value="0.5",
...     max_violation="5",
... )
```

add\_expected\_return\_constraint(_name_, _\*_, _min\_value\=''_, _max\_value\=''_, _level\=0_, _custom\_returns\=None_, _relative\_to\_benchmark\=False_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_expected_return_constraint "Link to this definition")

Add an Expected Return constraint to bound portfolio expected returns.

This constraint places lower and/or upper bounds on the portfolio’s expected return (or active expected return if `relative_to_benchmark=True`). It is typically used to enforce minimum return targets, cap overly aggressive return assumptions, or ensure sufficient active return versus a benchmark.

Expected return is computed using either:

-   the strategy’s configured expected return / alpha model (default), or
    
-   a custom returns value supplied via `custom_returns`.
    

Note: `min_value` and `max_value` use percent semantics (5 means 5%, not 0.05).

Parameters:

-   **name** (_str_) – Descriptive name for this constraint (shown in the UI).
    
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum allowed expected return (in percent terms). At least one of `min_value` or `max_value` should be provided.
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum allowed expected return (in percent terms). At least one of `min_value` or `max_value` should be provided.
    
-   **level** (_int__,_ _default 0_) –
    
    Constraint application level:
    
    -   0 = Portfolio
        
    -   1 = Group (requires `groupings`)
        
    -   2 = Asset
        
-   **custom\_returns** (_NumericValue__,_ _optional_) – Custom expected return value for the this term in percentage terms (e.g., 95 for 95%).
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – If True, the bounds apply to active expected return relative to the benchmark (E\[R\_portfolio\] − E\[R\_benchmark\]). If False, the bounds apply to total expected return. Requires a benchmark to be defined in the strategy setup.
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, enables a soft constraint: the optimizer may violate the bound(s) in exchange for a penalty applied against the objective function.
    
-   **penalty\_type** (_int__,_ _default 0_) –
    
    Penalty function type:
    
    -   0 = linear
        
    -   1 = quadratic
        
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Penalty multiplier applied per unit of violation.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Optional cap on allowed violation when `penalty_enabled=True`.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Universe limitation:
    
    -   0 = All
        
    -   1 = Equity
        
    -   2 = Debt (fixed income)
        
    -   3 = Cash (numeraire / riskless)
        
-   **groupings** (_dict__,_ _optional_) – Group configuration used only when `level=1` (Group).
    
-   **composite\_lookthrough** (_int__,_ _default -2_) –
    
    Lookthrough depth for composite / fund-of-fund assets:
    
    -   \-2 = inherit from strategy settings
        
    -   0 = no lookthrough
        
    -   1+ = decompose N levels deep
        
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Enforce a minimum total expected return of 5%:

```
>>> optimizer.add_expected_return_constraint(
...     name="Min Expected Return",
...     min_value=5,
... )
```

Cap total expected return at 12%:

```
>>> optimizer.add_expected_return_constraint(
...     name="Max Expected Return",
...     max_value=12,
... )
```

Bound expected return to a range (between 4% and 10%):

```
>>> optimizer.add_expected_return_constraint(
...     name="Expected Return Range",
...     min_value=4,
...     max_value=10,
... )
```

Cap active expected return at 2% vs benchmark:

```
>>> optimizer.add_expected_return_constraint(
...     name="Max Active Return",
...     max_value=2,
...     relative_to_benchmark=True,
... )
```

Cap active expected return at 2% vs benchmark using a 5% expected return values for all assets:

```
>>> optimizer.add_expected_return_constraint(
...     name="Max Active Return",
...     max_value=2,
...     relative_to_benchmark=True,
...     custom_returns="5",
... )
```

Soft constraint: target at least 6% expected return, allow up to 1% violation with a linear penalty:

```
>>> optimizer.add_expected_return_constraint(
...     name="Soft Min Return",
...     min_value=6,
...     penalty_enabled=True,
...     penalty_type=0,
...     penalty_value="1.5",
...     max_violation="1",
... )
```

add\_factor\_exposure\_constraint(_name_, _\*_, _factors_, _risk\_model\_id\=''_, _level\=0_, _relative\_to\_benchmark\=False_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _variable\_type\=0_, _model\_grouping\_id\='none'_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_factor_exposure_constraint "Link to this definition")

Add a Factor Exposure constraint to control risk factor exposures.

Bounds the portfolio’s (or active) exposure to one or more risk model factors:

```
min_f ≤ Σ (w_i × β_if) ≤ max_f   for each factor f
```

where w\_i is the weight of asset i and β\_if is asset i’s loading on factor f. When `relative_to_benchmark=True` the constraint applies to _active_ exposures (portfolio minus benchmark).

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **factors** (_dict__\[__str__,_ _FactorBounds__\]_) – Dictionary mapping factor IDs to their bounds (use `FactorBounds`). Factor IDs are risk-model specific. For `FDS:GLOBAL_EQUITY_M_V1` they carry an `S_` prefix, e.g. `"S_BETA"`, `"S_SIZE"`, `"S_MOMENTUM"`, `"S_VOLATILITY"`, `"S_LEVERAGE"`, `"S_EARNINGS_YIELD"`. One-sided constraints are supported by omitting `min_value` or `max_value`.
    
-   **risk\_model\_id** (_str__,_ _default ""_) – Risk model ID to use. If empty, uses the account’s default risk model. Explicitly passing the value (e.g. `"FDS:GLOBAL_EQUITY_M_V1"`) is recommended to avoid ambiguity.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – If `True`, bounds are relative to the benchmark’s factor exposures (active exposure). Use `False` for absolute portfolio-level factor control (e.g. market-neutral portfolios where beta must be near zero in absolute terms).
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, allow soft constraint violation with a penalty cost.
    
-   **penalty\_type** (_int__,_ _default 0_) – Type of penalty function (0=linear, 1=quadratic).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Cost per unit of constraint violation.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum allowed violation when penalty is enabled.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **variable\_type** (_int__,_ _default 0_) – Limit type (shown as **Limit Type** in the UI). Controls how min/max apply to long, short, or net holdings. - 0 : **Net** – use net positions - 1 : **Long** – use only long positions - 2 : **Short** – use only short positions - 3 : **Absolute** – absolute values
    
-   **model\_grouping\_id** (_str__,_ _default "none"_) – Grouping ID for factor grouping.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

**Neutralize beta and size relative to benchmark (2-factor):**

```
>>> fpo.add_factor_exposure_constraint(
...     name="Factor Neutral",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors={
...         "S_BETA": FactorBounds(min_value="-0.1", max_value="0.1"),
...         "S_SIZE": FactorBounds(min_value="-0.2", max_value="0.2"),
...     },
...     relative_to_benchmark=True,
... )
```

**Five-factor neutral (active factor exposures tightly bounded):**

```
>>> fpo.add_factor_exposure_constraint(
...     name="5-Factor Neutral",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors={
...         "S_BETA":       FactorBounds(min_value="-0.05", max_value="0.05"),
...         "S_SIZE":       FactorBounds(min_value="-0.15", max_value="0.15"),
...         "S_MOMENTUM":   FactorBounds(min_value="-0.15", max_value="0.15"),
...         "S_VOLATILITY": FactorBounds(min_value="-0.10", max_value="0.10"),
...     },
...     relative_to_benchmark=True,
... )
```

**Quality tilt — one-sided bounds (require underweight relative to benchmark):**

```
>>> fpo.add_factor_exposure_constraint(
...     name="Quality Tilt",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors={
...         "S_LEVERAGE":       FactorBounds(max_value="0.0"),
...         "S_EARNINGS_YIELD": FactorBounds(max_value="0.0"),
...     },
...     relative_to_benchmark=True,
... )
```

**Absolute beta control — for market-neutral portfolios (no benchmark reference):**

```
>>> fpo.add_factor_exposure_constraint(
...     name="Near-Zero Beta",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors={"S_BETA": FactorBounds(min_value="-0.05", max_value="0.05")},
... )
```

add\_general\_linear\_constraint(_name_, _\*_, _security\_attribute_, _min\_value\=''_, _max\_value\=''_, _level\=0_, _weighting\_method\=0_, _relative\_to\_benchmark\=False_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _variable\_type\=0_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_general_linear_constraint "Link to this definition")

Add a General Linear constraint to bound a custom security attribute.

The General Linear constraint allows you to control your portfolio’s exposure to a particular attribute, based on a linear combination of the asset values. It is the most flexible constraint type.

When `weighting_method=0` (Weights, the default) the constraint enforces:

> min\_value <= sum\_i(w\_i \* a\_i) <= max\_value

where _w\_i_ is the portfolio weight of asset _i_ and _a\_i_ is its attribute value. When `weighting_method=1` (Shares) portfolio shares are used instead of weights.

At least one of `min_value` or `max_value` must be provided.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint (shown as **Name** in the UI).
    
-   **security\_attribute** (_NumericValue_) –
    
    **Required.** A formula defining the per-security attribute values to constrain (shown as **Security Attribute** in the UI). This can be any FactSet formula, screening expression, or OFDB reference. .. rubric:: Examples
    
    -   `"FF_EARN_YLD(ANN_R,0)"` – earnings yield
        
    -   `"FF_DIV_YLD(ANN,0)"` – dividend yield
        
    -   `"FF_ROE(ANN_R,0)"` – return on equity
        
    -   `"OFDB(Client:/ESG.OFDB, 'ESG_SCORE', 0)"` – custom OFDB field
        
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum bound (shown as **Minimum** in the UI).
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum bound (shown as **Maximum** in the UI).
    
-   **level** (_int__,_ _default 0_) –
    
    The level at which the constraint is applied (shown as **Level** in the UI):
    
    -   0 : **Portfolio** – applies to the optimal portfolio as a whole
        
    -   1 : **Group** – applies to certain group(s) of securities. When using group level, configure the `groupings` parameter.
        
-   **weighting\_method** (_int__,_ _default 0_) –
    
    How the security attribute is aggregated across holdings (shown as **Weighting Method** in the UI):
    
    -   0 : **Weights** – weighted by portfolio weights (default)
        
    -   1 : **Shares** – weighted by portfolio shares
        
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – When `False` (Absolute), bounds apply to the portfolio value alone. When `True` (Relative), bounds apply to the _active_ value (portfolio minus benchmark). Shown as the **Absolute / Relative** toggle in the UI.
    
-   **penalty\_enabled** (_bool__,_ _default False_) – Allow the constraint to be softened (shown as **Enable Penalty** in the UI). When enabled, the engine may violate the bound in exchange for a penalty applied against the objective function.
    
-   **penalty\_type** (_int__,_ _default 0_) –
    
    Penalty function type:
    
    -   0 : **Linear** (default)
        
    -   1 : **Quadratic**
        
-   **penalty\_value** (_NumericValue__,_ _default ""_) – The multiplier applied to the violation to determine the penalty cost (shown as **Penalty Value** in the UI).
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum amount by which the constraint may be violated (shown as **Max Violation** in the UI). Optional.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    The asset class to which the constraint applies (shown as **Universe** in the UI):
    
    -   0 : **All** – all assets in the investable universe (default)
        
    -   1 : **Equity** – equity securities only
        
    -   2 : **Debt** – fixed income securities only
        
    -   3 : **Cash** – numeraire (riskless) cash position only
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level (-2 = use strategy setting).
    
-   **variable\_type** (_int__,_ _default 0_) – Limit type (shown as **Limit Type** in the UI). Controls how min/max apply to long, short, or net holdings. - 0 : **Net** – use net positions - 1 : **Long** – use only long positions - 2 : **Short** – use only short positions - 3 : **Absolute** – absolute values
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimisation (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Require portfolio earnings yield >= 2% (absolute, by weight):

```
>>> fpo.add_general_linear_constraint(
...     name="Earnings Yield >= 2%",
...     security_attribute="FF_EARN_YLD(ANN_R,0)",
...     min_value="2",
... )
```

Bound dividend yield between 1% and 4% relative to benchmark:

```
>>> fpo.add_general_linear_constraint(
...     name="Div Yield 1-4% (Active)",
...     security_attribute="FF_DIV_YLD(ANN,0)",
...     min_value="1",
...     max_value="4",
...     relative_to_benchmark=True,
... )
```

Soft constraint on ROE with linear penalty:

```
>>> fpo.add_general_linear_constraint(
...     name="Soft ROE >= 10%",
...     security_attribute="FF_ROE(ANN_R,0)",
...     min_value="10",
...     penalty_enabled=True,
...     penalty_type=0,
...     penalty_value="50",
...     max_violation="5",
... )
```

add\_leverage\_constraint(_name_, _\*_, _leverage\_type_, _value\=''_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_leverage_constraint "Link to this definition")

Add a Leverage constraint to control short exposure in the portfolio.

In this optimization framework, **leverage is defined as the total short exposure of the portfolio**, i.e. the sum of negative portfolio weights.

> leverage = Σ max(-w\_i, 0)

where w\_i are the portfolio weights.

This corresponds to the **magnitude of short positions** in the portfolio, expressed as a percentage of total portfolio value.

For example

Long-only portfolio

weights = \[100%, 0%, 0%\] leverage = 0

130/30 portfolio

longs = 130%, shorts = 30% leverage = 30

160/60 portfolio

longs = 160%, shorts = 60% leverage = 60

Market neutral 100/100

longs = 100%, shorts = 100% leverage = 100

### Constraint Types[#](https://fpe.factset.com/docs/fpo.html#constraint-types "Link to this heading")

The leverage constraint can be applied in two main ways:

Fixed Value

Forces the optimizer to use an exact level of short exposure.

> leverage = value

Maximum Value

Caps the maximum short exposure allowed in the portfolio.

> leverage ≤ value

(Some configurations may also support a minimum bound.)

type name:

`str`

param name:

Descriptive name for this constraint.

type name:

str

type leverage\_type:

`int`

param leverage\_type:

Type of leverage bound: - 0 : Fixed Value (leverage = value) - 1 : Maximum Value (leverage ≤ value) - 2 : Minimum Value (leverage ≥ value)

type leverage\_type:

int

type value:

`str` | `int` | `float`

param value:

Target or bound for short exposure.

Values are entered as **percent of portfolio value** using UI-style percent format:

> 30 means 30% short exposure 60 means 60% short exposure 100 means 100% short exposure

type value:

NumericValue, default “”

type hierarchy:

`int`

param hierarchy:

Constraint hierarchy/priority used in hierarchical optimization (if enabled).

type hierarchy:

int, default 0

returns:

Returns self for method chaining.

rtype:

FPO

Examples

Cap short exposure at 30% (typical 130/30 strategy):

```
>>> optimizer.add_leverage_constraint(
...     name="Max Short Exposure",
...     leverage_type=1,
...     value="30"
... )
```

Force exactly 60% short exposure (e.g., 160/60 strategy):

```
>>> optimizer.add_leverage_constraint(
...     name="Fixed Short Exposure",
...     leverage_type=0,
...     value="60"
... )
```

Require at least 20% short exposure:

```
>>> optimizer.add_leverage_constraint(
...     name="Minimum Short Exposure",
...     leverage_type=2,
...     value="20"
... )
```

add\_number\_of\_assets\_constraint(_name_, _\*_, _min\_value\=''_, _max\_value\=''_, _level\=0_, _names\_selection\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_number_of_assets_constraint "Link to this definition")

Add a Number of Assets constraint to control portfolio concentration.

This constraint bounds the count of securities held in the portfolio:

> min\_value ≤ count(w\_i ≠ 0) ≤ max\_value

where count(w\_i > 0) is the number of securities with non-zero weight.

Depending on the `names_selection` parameter, the count may consider:

-   all positions,
    
-   long positions only, or
    
-   short positions only.
    

Typical uses include:

-   enforcing diversification by requiring a minimum number of holdings
    
-   limiting portfolio complexity by capping the number of securities
    
-   satisfying regulatory or prospectus requirements
    
-   controlling the number of active long or short bets
    

Because the optimizer must decide **which assets are included or excluded**, this constraint introduces binary decisions and converts the optimization problem into a **Mixed Integer Program (MIP)**. This may increase solve time relative to purely continuous optimization problems.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum number of securities to hold. At least one of min\_value or max\_value must be provided.
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum number of securities to hold. At least one of min\_value or max\_value must be provided.
    
-   **level** (_Level_ _or_ _int__,_ _default Level.PORTFOLIO_) – Granularity at which to apply the constraint.
    
-   **names\_selection** (_int__,_ _default 0_) –
    
    Which securities to count:
    
    -   0: All held securities
        
    -   1: Long only
        
    -   2: Short only
        
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Restricts the constraint to a specific asset class:
    
    -   0 = All assets
        
    -   1 = Equity
        
    -   2 = Debt (fixed income)
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration used when `level=Level.GROUP`. For example, the constraint may apply separately by sector, country, or custom classification.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) –
    
    Composite lookthrough depth for fund-of-fund or ETF structures:
    
    -   \-2 = inherit the strategy default
        
    -   0 = no lookthrough
        
    -   1+ = decompose N levels of underlying holdings
        
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Raises:

**ValueError** – If neither min\_value nor max\_value is provided.

Examples

Require the portfolio to hold between 30 and 50 securities:

```
>>> builder.add_number_of_assets_constraint(
...     name="Portfolio Size",
...     min_value=30,
...     max_value=50
... )
```

Limit the portfolio to at most 100 holdings:

```
>>> builder.add_number_of_assets_constraint(
...     name="Max Holdings",
...     max_value=100
... )
```

Require at least 40 long positions:

```
>>> builder.add_number_of_assets_constraint(
...     name="Min Long Positions",
...     min_value=40,
...     names_selection=1
... )
```

Limit the portfolio to at most 20 short positions:

```
>>> builder.add_number_of_assets_constraint(
...     name="Max Shorts",
...     max_value=20,
...     names_selection=2
... )
```

add\_sensitivity\_constraint(_name_, _\*_, _formula\=None_, _predefined\=None_, _min\_value\=''_, _max\_value\=''_, _level\=0_, _relative\_to\_benchmark\=False_, _unit\=1_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_sensitivity_constraint "Link to this definition")

Add a Sensitivity constraint to the optimisation.

The Sensitivity constraint allows you to set limits on the contribution of a particular attribute on the optimal portfolio.

The attribute can be specified as a selection from a drop-down menu or as a custom formula. If you define a custom formula, a **Units** drop-down appears in the UI. Select “Percent”, “Currency”, or “Number” to define how your minimum/maximum bounds are applied to the values returned by your formula.

Exactly one of `formula` or `predefined` must be supplied. At least one of `min_value` or `max_value` must be provided.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint (shown as **Name** in the UI).
    
-   **formula** (_NumericValue__,_ _optional_) –
    
    A custom FactSet formula or OFDB reference defining the per-security sensitivity values. For example:
    
    -   `"QFL_BETA(0,LEVEL,252D)"` – 1-year market beta
        
    -   `"FG_BETA(504D,0,USD)"` – 2-year beta in USD
        
    -   `"FI_DURATION"` – bond duration
        
    -   `"OFDB(Client:/Betas.OFDB, 'FACTOR_BETA', 0)"` – custom OFDB
        
-   **predefined** (_int__,_ _optional_) – A built-in fixed-income sensitivity metric from `SensitivitySelection` (e.g. `SensitivitySelection.EFFECTIVE_DURATION`).
    
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum bound (shown as **Minimum** in the UI).
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum bound (shown as **Maximum** in the UI).
    
-   **level** (_int__,_ _default 0_) –
    
    The level at which the constraint is applied (shown as **Level** in the UI):
    
    -   0 : **Portfolio** – applies to the optimal portfolio as a whole
        
    -   1 : **Group** – applies to certain group(s) of securities. When using group level, configure the `groupings` parameter.
        
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – When `False` (Absolute), bounds apply to the portfolio value alone. When `True` (Relative), bounds are relative to the benchmark. Shown as the **Absolute / Relative** toggle in the UI.
    
-   **unit** (_int__,_ _default 1_) –
    
    How the minimum/maximum bounds are interpreted relative to the formula values (shown as **Units** in the UI):
    
    -   0 : **Currency**
        
    -   1 : **Percent** (default)
        
    -   2 : **Number**
        
-   **penalty\_enabled** (_bool__,_ _default False_) – Allow the constraint to be softened (shown as **Enable Penalty** in the UI). When enabled, the engine may violate the bound in exchange for a penalty applied against the objective function.
    
-   **penalty\_type** (_int__,_ _default 0_) –
    
    Penalty function type:
    
    -   0 : **Linear** (default)
        
    -   1 : **Quadratic**
        
-   **penalty\_value** (_NumericValue__,_ _default ""_) – The multiplier applied to the violation to determine the penalty cost (shown as **Penalty Value** in the UI).
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum amount by which the constraint may be violated (shown as **Max Violation** in the UI). Optional.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    The asset class to which the constraint applies (shown as **Universe** in the UI):
    
    -   0 : **All** – all assets in the investable universe (default)
        
    -   1 : **Equity** – equity securities only
        
    -   2 : **Debt** – fixed income securities only
        
    -   3 : **Cash** – numeraire (riskless) cash position only
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level (-2 = use strategy setting).
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimisation (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Bound portfolio beta between 0.8 and 1.2 (formula):

```
>>> fpo.add_sensitivity_constraint(
...     name="Beta 0.8–1.2",
...     formula="QFL_BETA(0,LEVEL,252D)",
...     min_value="0.8",
...     max_value="1.2",
... )
```

Cap effective duration at 5 (predefined metric):

```
>>> from fds.fpe.quant.fpo._strategy_builder import SensitivitySelection
>>> fpo.add_sensitivity_constraint(
...     name="Duration ≤ 5",
...     predefined=SensitivitySelection.EFFECTIVE_DURATION,
...     max_value="5",
... )
```

Bound OAS relative to benchmark with a soft quadratic penalty (predefined, active, soft):

```
>>> fpo.add_sensitivity_constraint(
...     name="Active OAS 10–50 bps (soft)",
...     predefined=SensitivitySelection.OAS,
...     min_value="10",
...     max_value="50",
...     relative_to_benchmark=True,
...     penalty_enabled=True,
...     penalty_type=1,
...     penalty_value="200",
...     max_violation="10",
... )
```

Cap modified duration, benchmark-relative (predefined, active):

```
>>> fpo.add_sensitivity_constraint(
...     name="Active Modified Duration ≤ 1",
...     predefined=SensitivitySelection.MODIFIED_DURATION,
...     max_value="1",
...     relative_to_benchmark=True,
... )
```

add\_holdings\_threshold\_constraint(_name_, _\*_, _min\_value_, _level\=0_, _unit\=1_, _asset\_type\=0_, _custom\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_holdings_threshold_constraint "Link to this definition")

Add a Holdings Threshold constraint to set minimum position sizes.

The Holding Threshold constraint sets a **minimum weight limit** for assets held in the optimal portfolio. It does **not** force the engine to hold any asset — it merely defines the minimum amount that must be held _if_ the engine decides to include that asset. This is an “if-then” constraint:

> IF w\_i > 0 THEN w\_i >= min\_value

Use cases:

-   Avoiding small, illiquid positions that are costly to trade
    
-   Ensuring meaningful position sizes for active bets
    
-   Meeting minimum lot-size requirements
    

Note

This differs from [`add_limit_position_constraint()`](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_limit_position_constraint "fds.fpe.quant.fpo.FPO.add_limit_position_constraint"), which sets hard min/max bounds on positions. Holdings Threshold allows zero positions but prevents small non-zero positions.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **min\_value** (_NumericValue_) – **Required.** Minimum position size if held. Securities can either have zero weight or weight >= `min_value`.
    
-   **level** (_int__,_ _default 0_) –
    
    Granularity at which to apply the constraint:
    
    -   0 or Level.PORTFOLIO: Total portfolio level
        
    -   1 or Level.GROUP: Per-group (e.g., per sector). Use `groupings` to specify the grouping variable. With **Member** semantics the bound applies to each member within the group (e.g., a 3% bound for Energy sets a 3% threshold for every stock in Energy).
        
    -   2 or Level.ASSET: Per-security level (most common). Use **All** to target every asset in the initial portfolio, benchmark, and buy list, or **Custom** with a formula to target only the assets for which the formula returns a value.
        
-   **unit** (_int__,_ _default 1_) –
    
    Unit for `min_value`:
    
    -   0: Currency amount
        
    -   1: Percent of portfolio (e.g., 0.5 = 0.5%)
        
    -   2: Number of shares
        
-   **asset\_type** (_int__,_ _default 0_) –
    
    Asset selection filter (applicable when `level=2` / Asset):
    
    -   0: All — applies to every asset in the selected universe
        
    -   1: Custom — applies only to assets for which the formula in `custom` returns a value (use with `custom` parameter)
        
-   **custom** (_NumericValue__,_ _default ""_) – Formula identifying which assets the constraint applies to. Only used when `asset_type=1` (Custom). Enter a formula or column reference that returns True/False or 1/0.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Restrict the constraint to a specific asset-class universe:
    
    -   0: All
        
    -   1: Equity
        
    -   2: Debt (fixed income)
        
    -   3: Cash (numeraire / riskless)
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints (`level=1`).
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level (-2 = use strategy setting).
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

```
>>> # Minimum 0.5% position size for any held security (asset level)
>>> optimizer.add_holdings_threshold_constraint(
...     name="Min 0.5% If Held",
...     min_value=0.5,       # 0.5%
...     level=2,             # Asset
...     unit=1,              # Percent
... )
>>>
>>> # Minimum $10,000 position in currency terms
>>> optimizer.add_holdings_threshold_constraint(
...     name="Min $10k Position",
...     min_value=10000,
...     level=2,             # Asset
...     unit=0,              # Currency
... )
>>>
>>> # Custom asset filter — threshold only for flagged assets
>>> optimizer.add_holdings_threshold_constraint(
...     name="Flagged Assets Min",
...     min_value=0.3,       # 0.3%
...     level=2,             # Asset
...     asset_type=1,        # Custom
...     custom="FG_CONSTITUENTS(SP50,0,CLOSE)=1",
... )
```

add\_limit\_position\_constraint(_name_, _\*_, _min\_value\=''_, _max\_value\=''_, _level\=2_, _unit\=1_, _relative\_to\_benchmark\=False_, _asset\_type\=0_, _custom\=''_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _group\_type\=0_, _composite\_lookthrough\=\-2_, _apply\_only\_to\_direct\=True_, _variable\_type\=0_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_limit_position_constraint "Link to this definition")

Add a Limit Position constraint to bound security weights.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum allowed position weight.
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum allowed position weight.
    
-   **level** (_int__,_ _default 0_) –
    
    Granularity at which to apply the constraint:
    
    -   0 or Level.PORTFOLIO: Total portfolio bounds (rarely used)
        
    -   1 or Level.GROUP: Per-group bounds (e.g., by sector)
        
    -   2 or Level.ASSET: Per-security bounds (most common)
        
-   **unit** (_int__,_ _default 1_) –
    
    Unit for bounds:
    
    -   0: Currency amount
        
    -   1: Percent of portfolio (e.g., 5 = 5%)
        
    -   2: Number of shares
        
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – If True, bounds are relative to benchmark weights.
    
-   **asset\_type** (_int__,_ _default 0_) –
    
    Asset selection filter (applicable when `level=2` / Asset):
    
    -   0: All — applies to every asset in the selected universe
        
    -   1: Custom — applies only to assets for which the formula in `custom` returns a value (use with `custom` parameter)
        
    -   2: Trade Universe — assets contained in the initial portfolio and the buy list
        
-   **custom** (_NumericValue__,_ _default ""_) – Formula identifying which assets the constraint applies to (all for which a formula returns a value). Only used when `asset_type=1` (Custom). Enter a formula.
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, allow soft constraint violation with a penalty cost.
    
-   **penalty\_type** (_int__,_ _default 0_) – Type of penalty function (0=linear, 1=quadratic).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Cost per unit of constraint violation.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum allowed violation when penalty is enabled.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Restrict the constraint to a specific asset-class universe:
    
    -   0: All
        
    -   1: Equity
        
    -   2: Debt (fixed income)
        
    -   3: Cash (numeraire / riskless)
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **group\_type** (_int__,_ _default 0_) –
    
    Controls how the constraint bounds are applied across groups when `level=Level.GROUP` (shown as **Grouping Type** in the UI):
    
    -   0 (Total): Applies the bounds to all groupings taken as a whole (e.g., a 3 % bound for Energy and Financials added together).
        
    -   1 (Selection): Applies the bounds to each grouping individually (e.g., a 3 % bound for Energy, a 5 % bound for Financials).
        
    -   2 (Member): Applies the bounds to each member of a designated grouping individually (e.g., a 3 % bound for Energy sets a 3 % bound on every asset within the Energy sector).
        

composite\_lookthroughint, default -2

Composite lookthrough level.

apply\_only\_to\_directbool, default True

If True, only apply to direct holdings.

variable\_typeint, default 0

Limit type (shown as **Limit Type** in the UI). Controls how min/max apply to long, short, or net holdings.

-   0 : **Net** – use net positions
    
-   1 : **Long** – use only long positions
    
-   2 : **Short** – use only short positions
    
-   3 : **Absolute** – absolute values
    

hierarchyint, default 0

Constraint hierarchy/priority used in hierarchical optimization (if enabled).

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

```
>>> # Long-only asset level constr with max 5% per position
>>> optimizer.add_limit_position_constraint(
...     name="Position Limits",
...     level=2,
...     min_value=0,
...     max_value=5
... )
>>>
>>> # Long-short asset level ±3% net position limits
>>> optimizer.add_limit_position_constraint(
...     name="Long-Short Limits",
...     level=2,
...     min_value=-3,
...     max_value=3
... )
```

add\_number\_of\_buys\_constraint(_name_, _\*_, _level\=0_, _universe\_limitation\=0_, _max\_value\=''_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_number_of_buys_constraint "Link to this definition")

Add a Number of Buys constraint.

The Number of Buys constraint limits the **total number of securities that can be purchased** during the optimization/rebalance. This is useful for controlling operational workload, reducing unnecessary trading, and enforcing “low-touch” rebalances.

### UI Defaults (as shown in the Strategy Builder)[#](https://fpe.factset.com/docs/fpo.html#ui-defaults-as-shown-in-the-strategy-builder "Link to this heading")

-   Universe: All
    
-   Level: Portfolio
    
-   Maximum: (blank until specified)
    

type name:

`str`

param name:

Descriptive name for this constraint (shown in the UI).

type name:

str

type level:

`int`

param level:

Constraint application level (UI: Level).

The UI currently supports:

-   0 = Portfolio: applies a single cap to the whole portfolio (UI default)
    

type level:

int, default 0

type universe\_limitation:

`int`

param universe\_limitation:

Asset class scope (UI: Universe):

-   0 = All: applies to all assets in the investable universe (UI default)
    
-   1 = Equity: limits the constraint to equity securities
    
-   2 = Debt: limits the constraint to fixed income securities
    

type universe\_limitation:

int, default 0

type max\_value:

`str` | `int` | `float`

param max\_value:

Maximum number of securities that may be sold during the optimization.

Notes

-   This is a **count**, not a percent.
    
-   A “buy” is counted when the optimizer generates a trade that increases an existing holding (including new positions). Exact counting rules depend on the engine’s trade definition.
    

type max\_value:

NumericValue, default “”

type hierarchy:

`int`

param hierarchy:

Constraint hierarchy/priority used in hierarchical optimization (if enabled).

type hierarchy:

int, default 0

returns:

Returns self for method chaining.

rtype:

FPO

Examples

Limit the rebalance to at most 10 purchases (portfolio-wide):

```
>>> optimizer.add_number_of_buys_constraint(
...     name="Max 10 Purchase",
...     level=0,          # Portfolio
...     max_value="10",
... )
```

Limit to at most 5 equity purchases:

```
>>> I optimizer.add_number_of_buys_constraint(
...     name="Max 5 Equity Purchase",
...     universe_limitation=1,  # Equity
...     max_value=5,
... )
```

Limit to at most 3 fixed-income purchases:

```
>>> optimizer.add_number_of_buys_constraint(
...     name="Max 3 Debt Purchase",
...     universe_limitation=2,  # Debt
...     max_value="3",
... )
```

add\_number\_of\_sells\_constraint(_name_, _\*_, _level\=0_, _universe\_limitation\=0_, _max\_value\=''_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_number_of_sells_constraint "Link to this definition")

Add a Number of Sells constraint.

The Number of Sells constraint limits the **total number of securities that can be sold** during the optimization/rebalance. This is useful for controlling operational workload, reducing unnecessary trading, and enforcing “low-touch” rebalances.

### UI Defaults (as shown in the Strategy Builder)[#](https://fpe.factset.com/docs/fpo.html#id2 "Link to this heading")

-   Universe: All
    
-   Level: Portfolio
    
-   Maximum: (blank until specified)
    

type name:

`str`

param name:

Descriptive name for this constraint (shown in the UI).

type name:

str

type level:

`int`

param level:

Constraint application level (UI: Level).

The UI currently supports:

-   0 = Portfolio: applies a single cap to the whole portfolio (UI default)
    

type level:

int, default 0

type universe\_limitation:

`int`

param universe\_limitation:

Asset class scope (UI: Universe):

-   0 = All: applies to all assets in the investable universe (UI default)
    
-   1 = Equity: limits the constraint to equity securities
    
-   2 = Debt: limits the constraint to fixed income securities
    

type universe\_limitation:

int, default 0

type max\_value:

`str` | `int` | `float`

param max\_value:

Maximum number of securities that may be sold during the optimization.

Notes

-   This is a **count**, not a percent.
    
-   A “sell” is counted when the optimizer generates a trade that reduces an existing holding (including full liquidations). Exact counting rules depend on the engine’s trade definition.
    

type max\_value:

NumericValue, default “”

type hierarchy:

`int`

param hierarchy:

Constraint hierarchy/priority used in hierarchical optimization (if enabled).

type hierarchy:

int, default 0

returns:

Returns self for method chaining.

rtype:

FPO

Examples

Limit the rebalance to at most 10 sells (portfolio-wide):

```
>>> optimizer.add_number_of_sells_constraint(
...     name="Max 10 Sells",
...     level=0,          # Portfolio
...     max_value="10",
... )
```

Limit to at most 5 equity sells:

```
>>> optimizer.add_number_of_sells_constraint(
...     name="Max 5 Equity Sells",
...     universe_limitation=1,  # Equity
...     max_value=5,
... )
```

Limit to at most 3 fixed-income sells:

```
>>> optimizer.add_number_of_sells_constraint(
...     name="Max 3 Debt Sells",
...     universe_limitation=2,  # Debt
...     max_value="3",
... )
```

add\_number\_of\_trades\_constraint(_name_, _\*_, _level\=0_, _universe\_limitation\=0_, _max\_value\=''_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_number_of_trades_constraint "Link to this definition")

Add a Number of Trades constraint.

The Number of Trades constraint limits the **total number of securities that can be traded (buy or sell)** during the optimization/rebalance. This is useful for controlling operational workload, reducing unnecessary trading, and enforcing “low-touch” rebalances.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint (shown in the UI).
    
-   **level** (_int__,_ _default 0_) –
    
    Constraint application level (UI: Level).
    
    The UI currently supports: - 0 = Portfolio: applies a single cap to the whole portfolio (UI default)
    
-   **universe\_limitation** (_int__,_ _default 0_) – Asset class scope (UI: Universe): - 0 = All: applies to all assets in the investable universe (UI default) - 1 = Equity: limits the constraint to equity securities - 2 = Debt: limits the constraint to fixed income securities
    
-   **max\_value** (_NumericValue__,_ _default ""_) –
    
    Maximum number of securities that may be traded during the optimization.
    
    Notes - This is a **count**, not a percent. - Both buys and sells count toward this limit.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Limit the rebalance to at most 10 trades (portfolio-wide):

```
>>> optimizer.add_number_of_trades_constraint(
...     name="Max 10 Trades",
...     level=0,
...     max_value="10",
... )
```

Limit to at most 5 equity trades:

```
>>> optimizer.add_number_of_trades_constraint(
...     name="Max 5 Equity Trades",
...     universe_limitation=1,
...     max_value=5,
... )
```

add\_round\_lots\_constraint(_name_, _\*_, _level\=2_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _asset\_level\=''_, _asset\_type\=0_, _custom\=''_, _general\=0.0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_round_lots_constraint "Link to this definition")

Add a Round Lots constraint.

Forces traded quantities to be integer multiples of a specified lot size, ensuring trades conform to exchange round-lot requirements.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **level** (_int__,_ _default 2_ _(__Level.ASSET__)_) –
    
    Constraint application level:
    
    -   0 (Level.PORTFOLIO): single constraint for the whole portfolio
        
    -   1 (Level.GROUP): per-group (requires `groupings`)
        
    -   2 (Level.ASSET): per-asset ← UI default
        
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Restrict the constraint to a specific asset-class universe:
    
    -   0: All
        
    -   1: Equity
        
    -   2: Debt (fixed income)
        
    -   3: Cash (numeraire / riskless)
        
-   **groupings** (_dict__,_ _optional_) – Group configuration used only when `level=1` (Group). Ignored otherwise.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) –
    
    Lookthrough depth for composite / fund-of-fund assets.
    
    -   \-2: inherit from strategy settings
        
    -   0: no lookthrough
        
    -   1+: decompose N levels deep
        
-   **asset\_level** (_NumericValue__,_ _default ""_) – Formula or value defining the lot size for each asset.
    
-   **asset\_type** (_int__,_ _default 0_) –
    
    Which assets are subject to the constraint:
    
    -   0: All
        
    -   1: Custom — applies only to assets selected by `custom`
        
-   **custom** (_NumericValue__,_ _default ""_) – Custom asset filter used only when `asset_type=1`. Typically a boolean/flag column reference.
    
-   **general** (_float__,_ _default 0.0_) – General scalar value passed to the constraint engine.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Enforce 1-share round lots for all assets (simplest case):

```
>>> fpo.add_round_lots_constraint(
...     name="1-Share Round Lots",
...     asset_level="1",
... )
```

Apply round lots to equity securities only:

```
>>> fpo.add_round_lots_constraint(
...     name="Equity Round Lots",
...     asset_level="1",
...     universe_limitation=1,
... )
```

Use a per-asset lot size from an OFDB field (e.g. exchange-mandated board lot sizes):

```
>>> fpo.add_round_lots_constraint(
...     name="Exchange Board Lots",
...     asset_level="OFDB(Client:/LotSizes.OFDB, 'LOT_SIZE', 0)",
... )
```

Apply round lots only to a custom-flagged subset of assets:

```
>>> fpo.add_round_lots_constraint(
...     name="Round Lots – Flagged Assets",
...     asset_level="1",
...     asset_type=1,
...     custom="OFDB(Client:/RoundLotFlags.OFDB, 'APPLY_LOT', 0)",
... )
```

add\_trade\_threshold\_constraint(_name_, _\*_, _level\=2_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _min\_value\=''_, _asset\_type\=0_, _custom\=''_, _unit\=1_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_trade_threshold_constraint "Link to this definition")

Add a Trade Threshold constraint.

The Holding Threshold constraint sets a **minimum weight limit** for assets held in the optimal portfolio. It does **not** force the engine to hold any asset - it merely defines the minimum amount that must be held _if_ the engine decides to include that asset. This is an “if-then” constraint:

> IF w\_i > 0 THEN w\_i >= min\_value

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **level** (_int__,_ _default 2_ _(__Level.ASSET__)_) –
    
    Constraint application level:
    
    -   Level.PORTFOLIO (0)
        
        Single threshold applied at portfolio level.
        
    -   Level.GROUP (1)
        
        Threshold applied per group (requires `groupings`).
        
    -   Level.ASSET (2)
        
        Threshold applied per individual asset. ← UI default
        
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Universe limitation (UI: Universe):
    
    -   0 = All
        
    -   1 = Equity
        
    -   2 = Debt (fixed income)
        
    -   3 = Cash (numeraire / riskless)
        
-   **groupings** (_dict__,_ _optional_) – Group configuration used only when `level=Level.GROUP`. Ignored otherwise.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) –
    
    Lookthrough depth for composite / fund-of-fund assets:
    
    -   \-2 = inherit from strategy settings
        
    -   0 = no lookthrough
        
    -   1+ = decompose N levels deep
        
-   **min\_value** (_NumericValue__,_ _default ""_) –
    
    Minimum trade threshold. If an asset is traded, the trade must be at least this value (in the specified `unit`).
    
    When `unit=1` (Percent):
    
    -   5 means 5%
        
    -   1 means 1%
        
    -   0.5 means 0.5%
        
    
    Values follow UI-style percent format (not decimals like 0.05).
    
-   **custom** (_NumericValue__,_ _default ""_) – Custom asset filter used only when `asset_type=1`. Enter a formula.
    
-   **unit** (_int__,_ _default 1_) – Unit of the threshold (UI: Units): - 0 = Currency - 1 = Percent (UI default) - 2 = Number (e.g., shares)
    
-   **asset\_type** (_int__,_ _default 0_) – Universe — the asset class to which the constraint applies: - 0: All assets in the investable universe - 1: Custom (use `custom` parameter)
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Default usage (matches UI defaults: Universe=All, Level=Asset, Assets=All, Units=Percent):

```
>>> optimizer.add_trade_threshold_constraint(
...     name="Trade Threshold",
...     min_value="5",   # 5% minimum trade if a trade occurs
... )
```

Enforce a 1% minimum trade on FI:

```
>>> optimizer.add_trade_threshold_constraint(
...     name="Trade Threshold 1% on Fixed Income",
...     universe_limitation=2,
...     min_value="1",
... )
```

Enforce $1,000 minimum trade:

```
>>> optimizer.add_trade_threshold_constraint(
...     name="Trade Threshold Currency",
...     unit=0,
...     min_value="1000",
... )
```

add\_transaction\_cost\_constraint(_name_, _\*_, _level\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_, _max\_value\=''_, _asset\_type\=0_, _custom\=''_, _unit\=1_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_transaction_cost_constraint "Link to this definition")

Add a Transaction Cost constraint.

Places an upper limit on the transaction costs incurred when trading the selected assets.

Important

For this constraint to take effect, you must define buy and/or sell cost values in the strategy’s Transaction Cost component. Without a transaction cost model, this constraint will typically have no impact.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **level** (_int__,_ _default Level.PORTFOLIO_ _(__0__)_) – Constraint level (UI: Level): - 0 = Portfolio - 1 = Group (requires `groupings`) - 2 = Asset
    
-   **universe\_limitation** (_int__,_ _default 0_) – Universe limitation (UI: Universe): - 0 = All (applies to all assets in the investable universe) - 1 = Equity (equity securities only) - 2 = Debt (fixed income securities only) - 3 = Cash (cash / numeraire position)
    
-   **groupings** (_dict__,_ _optional_) – Group configuration used only when `level=1` (Group). The UI supports group behaviors such as Total / Selection / Member; these are expressed via the grouping configuration schema.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Lookthrough depth for composite holdings: - -2 = inherit from strategy setting - 0 = no lookthrough - 1+ = decompose N levels deep
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum transaction cost (UI: Maximum). If empty, the constraint is not effectively configured.
    
-   **asset\_type** (_int__,_ _default 0_) – Asset filter (UI: All / Custom) when `level=2`: - 0 = All - 1 = Custom (requires `custom`)
    
-   **custom** (_NumericValue__,_ _default ""_) – Custom asset selector used only when `asset_type=1`. Enter a formula.
    
-   **unit** (_int__,_ _default 1_) –
    
    Unit applied to `max_value`: - 0 = Currency - 1 = Percent
    
    Percent values are UI-style (5 means 5%, not 0.05).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Cap portfolio transaction costs at 0.5%:

```
>>> optimizer.add_transaction_cost_constraint(
...     name="Transaction Cost Cap",
...     max_value="0.5",
... )
```

Cap portfolio transaction costs at $25,000:

```
>>> optimizer.add_transaction_cost_constraint(
...     name="Transaction Cost Cap ($)",
...     unit=0,
...     max_value="25000",
... )
```

add\_turnover\_constraint(_name_, _\*_, _max\_value\=''_, _level\=0_, _turnover\_type\=0_, _asset\_type\=0_, _custom\=''_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_turnover_constraint "Link to this definition")

Add a Turnover constraint to limit trading activity.

The Turnover constraint limits the total percentage value of the designated assets that can be traded during the optimization (rebalance). This is commonly used to control rebalancing intensity, transaction costs, market impact, and tax implications.

The constraint can be applied at the portfolio, group, or asset level, and can optionally be softened via a penalty (allowing violations at a cost).

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **max\_value** (_NumericValue__,_ _default ""_) –
    
    Maximum allowed turnover (UI: Maximum (%)).
    
    Values use UI-style percent format:
    
    20 means 20% (not 0.20)
    
-   **level** (_int__,_ _default Level.PORTFOLIO_ _(__0__)_) – Constraint level: - 0 = Portfolio - 1 = Group (requires `groupings`) - 2 = Asset
    
-   **turnover\_type** (_int__,_ _default 0_) – Turnover direction (UI: Turnover Type): - 0 = Total (buys + sells) - 1 = Buy-side only - 2 = Sell-side only
    
-   **asset\_type** (_int__,_ _default 0_) – Which assets this constraint applies to (UI: Asset Type / Assets): - 0 = All: applies to all assets within the specified universe - 1 = Custom: applies to assets selected by `custom` - 2 = Buy List: applies only to the Buy List (if available)
    
-   **custom** (_NumericValue__,_ _default ""_) –
    
    Custom asset selector used only when `asset_type=1` (Custom). In the UI, this corresponds to entering a formula/value in the Custom field (often via Formula Lookup).
    
    Ignored unless `asset_type` is Custom.
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, allow the constraint to be softened by applying a penalty for violations against the objective function.
    
-   **penalty\_type** (_int__,_ _default 0_) – Penalty type. UI describes the penalty as linear (default 0=linear).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Penalty multiplier applied to the violation amount.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Optional maximum violation allowed when penalty is enabled.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Universe limitation: - 0 = All - 1 = Equity - 2 = Debt (fixed income) - 3 = Cash
    
-   **groupings** (_dict__,_ _optional_) – Group configuration used only when `level=Level.GROUP`. The UI supports group modes such as Total / Selection / Member; these are expressed through your grouping schema.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level (-2=infer from strategy settings).
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Limit total turnover to 20%:

```
>>> optimizer.add_turnover_constraint(
...     name="Max Turnover",
...     max_value="20",
... )
```

Limit sell-side turnover to 5%:

```
>>> optimizer.add_turnover_constraint(
...     name="Max Sell Turnover",
...     turnover_type=2,
...     max_value="5",
... )
```

Enable a soft turnover limit with a linear penalty:

```
>>> optimizer.add_turnover_constraint(
...     name="Soft Turnover Cap",
...     max_value="15",
...     penalty_enabled=True,
...     penalty_value="2.0",
...     max_violation="5",   # allow up to +5% turnover beyond the cap
... )
```

add\_limit\_risk\_etl\_constraint(_name_, _\*_, _maximum\_etl\=''_, _confidence\_level\='95'_, _active\_etl\=False_, _level\=0_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_limit_risk_etl_constraint "Link to this definition")

Add a Limit Risk ETL (Expected Tail Loss) constraint.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **maximum\_etl** (_NumericValue__,_ _default ""_) – Maximum allowed expected tail loss.
    
-   **confidence\_level** (_NumericValue__,_ _default "95"_) – Confidence level for ETL calculation.
    
-   **active\_etl** (_bool__,_ _default False_) – If True, constrain active ETL.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, allow soft constraint violation with a penalty cost.
    
-   **penalty\_type** (_int__,_ _default 0_) – Type of penalty function (0=linear, 1=quadratic).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Cost per unit of constraint violation.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum allowed violation when penalty is enabled.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_risk\_contribution\_constraint(_name_, _\*_, _level\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _max\_percent\=''_, _asset\_type\=0_, _custom\=''_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_risk_contribution_constraint "Link to this definition")

Add a Percent Contribution to Risk constraint.

This constraint limits how much of total portfolio variance may be contributed by selected assets or groups. The bound is expressed in percentage terms, so values must be passed as percentages:

-   3 means 3%
    
-   10 means 10%
    

and not as decimals.

The constraint can be applied at different scopes via `level`: to groups, to individual assets, to all assets in the selected universe, or to assets selected by a custom formula.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **level** (_int__,_ _default 0_) – Constraint scope/granularity (for example group, asset, all, or custom), following the optimizer/API enumeration.
    
-   **universe\_limitation** (_int__,_ _default 0_) –
    
    Restrict the constraint to a specific asset-class universe:
    
    -   0: All
        
    -   1: Equity
        
    -   2: Debt (fixed income)
        
    -   3: Cash (numeraire / riskless)
        
-   **groupings** (_dict__,_ _optional_) – Grouping configuration used for group-level application.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    
-   **max\_percent** (_NumericValue__,_ _default ""_) – Maximum allowed percent contribution to total risk. Values must be in percentage format, e.g. `3` for 3%.
    
-   **asset\_type** (_int__,_ _default 0_) –
    
    Asset selection filter (applicable when `level=2` / Asset):
    
    -   0: All — applies to every asset in the selected universe
        
    -   1: Custom — applies only to assets for which the formula in `custom` returns a value (use with `custom` parameter)
        
-   **custom** (_NumericValue__,_ _default ""_) – Formula identifying which assets the constraint applies to (all for which a formula returns a value). Only used when `asset_type=1` (Custom). Enter a formula.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Cap each selected asset at 3% contribution to portfolio volatility:

```
>>> optimizer.add_risk_contribution_constraint(
...     name="Asset RC cap",
...     level=2,
...     max_percent="3",
...     risk_type=0,
... )
```

add\_risk\_volatility\_constraint(_name_, _\*_, _min\_risk\=''_, _max\_risk\=''_, _active\_risk\=False_, _risk\_type\=0_, _level\=0_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _factors\=''_, _use\_secondary\_risk\_model\=False_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_risk_volatility_constraint "Link to this definition")

Add a Risk Volatility constraint to bound portfolio risk.

This constraint limits the portfolio’s volatility (standard deviation of returns):

> min\_risk ≤ σ(portfolio) ≤ max\_risk

where σ(portfolio) is calculated from the risk model as:

> σ = √(w’ × Σ × w)

with w being the weight vector and Σ the covariance matrix from the risk model.

If active\_risk=True, the constraint applies to tracking error relative to benchmark:

> min\_risk ≤ σ(portfolio - benchmark) ≤ max\_risk

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **min\_risk** (_NumericValue__,_ _default ""_) – Minimum allowed volatility/tracking error.
    
-   **max\_risk** (_NumericValue__,_ _default ""_) – Maximum allowed volatility/tracking error.
    
-   **active\_risk** (_bool__,_ _default False_) – If True, constrain tracking error instead of total volatility.
    
-   **risk\_type** (_int__,_ _default 0_) – Risk type: - 0: Standard Deviation - 1: Variance
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, allow soft constraint violation with a penalty cost.
    
-   **penalty\_type** (_int__,_ _default 0_) – Type of penalty function (0=linear, 1=quadratic).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Cost per unit of constraint violation.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum allowed violation when penalty is enabled.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    
-   **factors** (_str__,_ _default ""_) – Specific factors to include.
    
-   **use\_secondary\_risk\_model** (_bool__,_ _default False_) – If True, use secondary risk model.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Cap total portfolio volatility at 15 %:

```
>>> fpo.add_risk_volatility_constraint(
...     name="Vol cap",
...     max_risk="15",
... )
```

Cap active risk (tracking error) at 5 % — requires a benchmark:

```
>>> fpo.add_risk_volatility_constraint(
...     name="TE cap",
...     max_risk="5",
...     active_risk=True,
... )
```

Target a tracking error band of 3–5 %:

```
>>> fpo.add_risk_volatility_constraint(
...     name="TE target",
...     min_risk="3",
...     max_risk="5",
...     active_risk=True,
... )
```

Soft volatility cap — penalise breaches instead of forbidding them:

```
>>> fpo.add_risk_volatility_constraint(
...     name="Soft vol cap",
...     max_risk="15",
...     penalty_enabled=True,
...     penalty_type=0,
...     penalty_value="0.5",
...     max_violation="3",
... )
```

Combine with a Sharpe Ratio objective via method chaining:

```
>>> (
...     fpo
...     .add_sharpe_ratio_term(name="Sharpe", risk_free_rate="2")
...     .add_risk_volatility_constraint(name="Vol cap", max_risk="15")
... )
```

add\_tax\_gain\_loss\_constraint(_name_, _\*_, _min\_value\=''_, _max\_value\=''_, _gain\_loss\=0_, _include\_long\_term\=False_, _include\_short\_term\=False_, _exclude\_realized\=False_, _level\=0_, _unit\=0_, _tax\_type\=0_, _hierarchy\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_tax_gain_loss_constraint "Link to this definition")

Add a Tax Gain/Loss constraint.

Note: Tax settings must be configured using set\_tax\_settings() first.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum gain/loss.
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum gain/loss.
    
-   **gain\_loss** (_int__,_ _default 0_) – What to constrain (0=Net, 1=Gains only, 2=Losses only).
    
-   **include\_long\_term** (_bool__,_ _default False_) – Include long-term gains/losses.
    
-   **include\_short\_term** (_bool__,_ _default False_) – Include short-term gains/losses.
    
-   **exclude\_realized** (_bool__,_ _default False_) – Exclude already-realized gains/losses.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **unit** (_int__,_ _default 0_) – Unit for bounds (0=percent, 1=currency).
    
-   **tax\_type** (_int__,_ _default 0_) – Tax type classification.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_tax\_cost\_constraint(_name_, _\*_, _max\_value_, _exclude\_realized\=False_, _level\=0_, _unit\=0_, _hierarchy\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_tax_cost_constraint "Link to this definition")

Add a Tax Cost constraint.

Note: Tax settings must be configured using set\_tax\_settings() first.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **max\_value** (_NumericValue_) – **Required.** Maximum allowed tax cost.
    
-   **exclude\_realized** (_bool__,_ _default False_) – Exclude already-realized gains/losses.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **unit** (_int__,_ _default 0_) – Unit for max\_value (0=percent, 1=currency).
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_tax\_min\_holding\_period\_constraint(_name_, _\*_, _period\_days_, _level\=0_, _hierarchy\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_tax_min_holding_period_constraint "Link to this definition")

Add a Tax Minimum Holding Period constraint.

Note: Tax settings must be configured using set\_tax\_settings() first.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **period\_days** (_int_) – **Required.** Minimum days a position must be held before selling.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_tax\_almost\_long\_term\_gains\_constraint(_name_, _\*_, _days\_to\_long\_term_, _level\=0_, _hierarchy\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_tax_almost_long_term_gains_constraint "Link to this definition")

Add a Tax Almost Long-Term Gains constraint.

Note: Tax settings must be configured using set\_tax\_settings() first.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **days\_to\_long\_term** (_int_) – **Required.** Days before long-term qualification to protect.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_model\_deviation\_constraint(_name_, _\*_, _min\_value\=''_, _max\_value\=''_, _level\=0_, _model\_deviation\_type\=0_, _relative\_to\_benchmark\=False_, _attribute\=''_, _unit\=1_, _penalty\_enabled\=False_, _penalty\_type\=0_, _penalty\_value\=''_, _max\_violation\=''_, _hierarchy\=0_, _universe\_limitation\=0_, _groupings\=None_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_model_deviation_constraint "Link to this definition")

Add a Model Deviation constraint.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **min\_value** (_NumericValue__,_ _default ""_) – Minimum allowed deviation.
    
-   **max\_value** (_NumericValue__,_ _default ""_) – Maximum allowed deviation.
    
-   **level** (_int__,_ _default 0_) – Granularity (0=Portfolio, 1=Group, 2=Asset).
    
-   **model\_deviation\_type** (_int__,_ _default 0_) – Type of deviation metric.
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – If True, measure deviation relative to benchmark.
    
-   **attribute** (_NumericValue__,_ _default ""_) – Custom attribute for deviation calculation.
    
-   **unit** (_int__,_ _default 1_) – How the minimum/maximum bounds are interpreted relative to the formula values (shown as **Units** in the UI): - 0 : **Currency** - 1 : **Percent** (default)
    
-   **penalty\_enabled** (_bool__,_ _default False_) – If True, allow soft constraint violation with a penalty cost.
    
-   **penalty\_type** (_int__,_ _default 0_) – Type of penalty function (0=linear, 1=quadratic).
    
-   **penalty\_value** (_NumericValue__,_ _default ""_) – Cost per unit of constraint violation.
    
-   **max\_violation** (_NumericValue__,_ _default ""_) – Maximum allowed violation when penalty is enabled.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Grouping configuration for group-level constraints.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_issuer\_holding\_constraint(_name_, _\*_, _level\=0_, _universe\_limitation\=0_, _groupings\=None_, _composite\_lookthrough\=\-2_, _aggregate\_max\=''_, _issuer\_threshold\=''_, _issuer\_max\=''_, _issuer\_classification\=''_, _unit\=0_, _hierarchy\=0_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_issuer_holding_constraint "Link to this definition")

Add an Issuer Holding constraint.

Parameters:

-   **name** (_str_) – Descriptive name for this constraint.
    
-   **level** (_int__,_ _default 0_) – Constraint level.
    
-   **universe\_limitation** (_int__,_ _default 0_) – Restrict the constraint to a specific asset-class universe: - 0: All - 1: Equity - 2: Debt (fixed income) - 3: Cash (numeraire / riskless)
    
-   **groupings** (_dict__,_ _optional_) – Groupings configuration.
    
-   **composite\_lookthrough** (_int__,_ _default -2_) – Composite lookthrough level.
    
-   **aggregate\_max** (_NumericValue__,_ _default ""_) – Aggregate max.
    
-   **issuer\_threshold** (_NumericValue__,_ _default ""_) – Issuer threshold.
    
-   **issuer\_max** (_NumericValue__,_ _default ""_) – Issuer max.
    
-   **issuer\_classification** (_NumericValue__,_ _default ""_) – Issuer classification formula.
    
-   **unit** (_int__,_ _default 0_) – Unit type.
    
-   **hierarchy** (_int__,_ _default 0_) – Constraint hierarchy/priority used in hierarchical optimization (if enabled).
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_diversification\_ratio\_term(_name_, _\*_, _multiplier\='1'_, _direction\=1_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_diversification_ratio_term "Link to this definition")

Add a Diversification Ratio objective term.

The Diversification Ratio (DR) measures how well the portfolio exploits low correlations among its holdings. It is defined as:

> DR(w) = (Σᵢ wᵢ σᵢ) / σₚ(w) = (wᵀ σ) / √(wᵀ Σ w)

where:

-   wᵢ — weight of asset i in the portfolio
    
-   σᵢ — annualised volatility (standard deviation) of asset i
    
-   σₚ(w) — portfolio volatility √(wᵀ Σ w)
    
-   Σ — covariance matrix of asset returns
    
-   σ — vector of individual asset volatilities
    

**Key properties**

-   DR(w) ≥ 1 for any long-only portfolio (Cauchy–Schwarz inequality). Equality holds only when all assets are perfectly correlated (ρᵢⱼ = 1).
    
-   The numerator is the volatility of a “naive” equally-correlated portfolio; the denominator is the true portfolio volatility. The gap between the two quantifies the diversification benefit obtained from imperfect correlations.
    
-   Maximising DR yields the **Maximum Diversification portfolio** (Choueifong & Coignard, 2008), which, under the assumption that Sharpe ratios are equal across assets, is equivalent to the tangency portfolio.
    

This term should almost always be **maximized** (`direction=1`, the default).

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Scalar weight applied to this term in a multi-objective function.
    
-   **direction** (_int__,_ _default 1_) – Optimization direction: - 1: Maximize (default and recommended — increases diversification). - 0: Minimize (rarely useful; reduces diversification).
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active in the optimization.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_drawdown\_term(_name_, _\*_, _multiplier\='1'_, _direction\=0_, _confidence\_level\='95'_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_drawdown_term "Link to this definition")

Add a Drawdown objective term.

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term.
    
-   **direction** (_int__,_ _default 0_) – Direction (0=minimize, 1=maximize).
    
-   **confidence\_level** (_NumericValue__,_ _default "95"_) – Confidence level.
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_expected\_return\_term(_name_, _\*_, _direction\=1_, _multiplier\='1'_, _custom\_returns\=None_, _relative\_to\_benchmark\=False_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_expected_return_term "Link to this definition")

Add an Expected Return objective term.

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **direction** (_int__,_ _default 1_) – Direction (0=minimize, 1=maximize).
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term.
    
-   **custom\_returns** (_NumericValue__,_ _optional_) – Custom formula for expected returns. If None, uses strategy’s alpha formula.
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – If True, optimize active return.
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Maximize the strategy’s alpha signal:

```
>>> fpo.add_expected_return_term(name="Max return")
```

Maximize active return relative to benchmark:

```
>>> fpo.add_expected_return_term(
...     name="Max active return",
...     relative_to_benchmark=True,
... )
```

Maximize return while capping total portfolio volatility at 12 %:

```
>>> (
...     fpo
...     .add_expected_return_term(name="Max return")
...     .add_risk_volatility_constraint(name="Vol cap", max_risk="12")
... )
```

Maximize active return while capping tracking error at 5 %:

```
>>> (
...     fpo
...     .add_expected_return_term(name="Max active return", relative_to_benchmark=True)
...     .add_risk_volatility_constraint(name="TE cap", max_risk="5", active_risk=True)
... )
```

add\_expected\_tail\_loss\_term(_name_, _\*_, _multiplier\='1'_, _direction\=0_, _confidence\_level\='95'_, _use\_centered\_etl\=False_, _active\_risk\=True_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_expected_tail_loss_term "Link to this definition")

Add an Expected Tail Loss objective term.

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term.
    
-   **direction** (_int__,_ _default 0_) – Direction (0=minimize, 1=maximize).
    
-   **confidence\_level** (_NumericValue__,_ _default "95"_) – Confidence level.
    
-   **use\_centered\_etl** (_bool__,_ _default False_) – Whether to use centered ETL.
    
-   **active\_risk** (_bool__,_ _default True_) – Whether active risk is enabled.
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_factor\_exposure\_term(_name_, _\*_, _multiplier\='1'_, _direction\=0_, _relative\_to\_benchmark\=False_, _model\_grouping\_id\=''_, _risk\_model\_id\=''_, _factors\=None_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_factor_exposure_term "Link to this definition")

Add a Factor Exposure objective term to optimise risk factor exposures.

The Factor Exposure term allows you to add a linear function of risk factor exposures to your objective. Selecting a risk model populates the list of available factors; you then choose which factors to include in the optimisation.

Parameters:

-   **name** (_str_) – Descriptive name for this term (shown as **Term Name** in the UI).
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – A positive number that sets the term’s importance relative to other terms in the objective (shown as **Multiplier** in the UI). Higher values indicate higher priority – e.g. a multiplier of `"2"` makes the term twice as important as one with `"1"`.
    
-   **direction** (_int__,_ _default 0_) –
    
    Optimisation direction (shown as **Direction** in the UI):
    
    -   0 : Minimize
        
    -   1 : Maximize
        
    
    You may also use `Direction.MINIMIZE` / `Direction.MAXIMIZE`.
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – When `False` (Absolute), the term targets absolute factor exposures. When `True` (Relative), it targets _active_ exposures (portfolio minus benchmark). Shown as the **Absolute / Relative** toggle in the UI.
    
-   **model\_grouping\_id** (_str__,_ _default ""_) – Optional factor grouping to apply (shown as **Factor Grouping** in the UI). When set to `""` or `"none"` no grouping is applied and all individual factors from the risk model are listed.
    
-   **risk\_model\_id** (_str__,_ _default ""_) – Risk model whose factors will be used (shown as **Risk Model** in the UI). Selecting a risk model populates the list of available factors. If empty, the account’s default risk model is used. Passing the value explicitly (e.g. `"FDS:GLOBAL_EQUITY_M_V1"`) is recommended to avoid ambiguity.
    
-   **factors** (_list_ _of_ _str__,_ _optional_) –
    
    List of factor IDs to include in the term. Only selected factors are enabled; all others are ignored. Factor IDs are risk-model specific. For `FDS:GLOBAL_EQUITY_M_V1` common factor IDs include:
    
    -   `"S_BETA"` – Beta (market sensitivity)
        
    -   `"S_SIZE"` – Size
        
    -   `"S_MOMENTUM"` – Momentum
        
    -   `"S_VOLATILITY"` – Volatility
        
    -   `"S_LEVERAGE"` – Leverage
        
    -   `"S_EARNINGS_YIELD"` – Earnings Yield
        
    -   `"S_GROWTH"` – Growth
        
    -   `"S_DIVIDEND_YIELD"` – Dividend Yield
        
    -   `"S_BOOK_TO_PRICE"` – Book to Price
        
    -   `"S_PROFITABILITY"` – Profitability
        
    -   `"S_LIQUIDITY"` – Liquidity
        
    
    When `None` (default), no factors are selected.
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active in the optimisation.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Minimise beta exposure (absolute, single factor):

```
>>> fpo.add_factor_exposure_term(
...     name="Min Beta Exposure",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors=["S_BETA"],
...     direction=Direction.MINIMIZE,
... )
```

Minimise multiple factor exposures relative to benchmark (with a small multiplier in a multi-term objective):

```
>>> fpo.add_factor_exposure_term(
...     name="Min Active Factor Exposure",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors=["S_BETA", "S_SIZE", "S_MOMENTUM"],
...     direction=Direction.MINIMIZE,
...     multiplier="0.5",
...     relative_to_benchmark=True,
... )
```

Maximise value-factor exposure (earnings yield + book to price):

```
>>> fpo.add_factor_exposure_term(
...     name="Max Value Tilt",
...     risk_model_id="FDS:GLOBAL_EQUITY_M_V1",
...     factors=["S_EARNINGS_YIELD", "S_BOOK_TO_PRICE"],
...     direction=Direction.MAXIMIZE,
...     multiplier="0.3",
... )
```

add\_general\_linear\_term(_name_, _\*_, _attribute_, _direction\=0_, _multiplier\='1'_, _aggregation\_method\=0_, _relative\_to\_benchmark\=False_, _financial\_instrument\_type\=''_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_general_linear_term "Link to this definition")

Add a General Linear objective term to optimise a custom security attribute.

The General Linear term allows you to add a linear function of a specified security attribute to your objective. It is the most flexible objective term, supporting any FactSet formula, OFDB field, or screening expression as the attribute.

When `aggregation_method=0` (Weight, the default) the term contributes:

> direction \* multiplier \* sum\_i(w\_i \* a\_i)

where _w\_i_ is the portfolio weight of asset _i_ and _a\_i_ is its attribute value. When `aggregation_method=1` (Shares) the portfolio shares are used instead of weights.

Parameters:

-   **name** (_str_) – Descriptive name for this term (shown as **Term Name** in the UI).
    
-   **attribute** (_NumericValue_) – **Required.** A formula defining the per-security attribute to optimise (shown as **Security Attribute** in the UI). This can be any FactSet formula, screening expression, or OFDB reference. For example - `"FF_DIV_YLD(ANN,0)"` – dividend yield - `"FF_EARN_YLD(ANN_R,0)"` – earnings yield - `"FF_ROE(ANN_R,0)"` – return on equity - `"OFDB(Client:/ESG.OFDB, 'ESG_SCORE', 0)"` – custom OFDB field
    
-   **direction** (_int__,_ _default 0_) – Optimisation direction (shown as **Direction** in the UI): - 0 : Minimize - 1 : Maximize You may also use `Direction.MINIMIZE` / `Direction.MAXIMIZE`.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – A positive number that sets the term’s importance relative to other terms in the objective (shown as **Multiplier** in the UI). Higher values indicate higher priority – e.g. a multiplier of `"2"` makes the term twice as important as one with `"1"`.
    
-   **aggregation\_method** (_int__,_ _default 0_) – How the security attribute is aggregated across the portfolio (shown as **Aggregation Method** in the UI): - 0 : **Weight** – weighted by portfolio weights (default) - 1 : **Shares** – weighted by portfolio shares
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – When `False` (Absolute), the term is evaluated on the portfolio alone. When `True` (Relative), the term is evaluated relative to the benchmark – i.e. the optimiser targets the _active_ attribute (portfolio minus benchmark). Shown as the **Absolute / Relative** toggle in the UI.
    
-   **financial\_instrument\_type** (_str__,_ _default ""_) – Internal parameter for filtering to specific instrument types. Not exposed in the standard UI. Leave as `""` for equity optimisations.
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active in the optimisation.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Maximise dividend yield (absolute, by weight):

```
>>> fpo.add_general_linear_term(
...     name="Max Dividend Yield",
...     attribute="FF_DIV_YLD(ANN,0)",
...     direction=Direction.MAXIMIZE,
... )
```

Maximise earnings yield relative to benchmark with higher importance:

```
>>> fpo.add_general_linear_term(
...     name="Max Active Earnings Yield",
...     attribute="FF_EARN_YLD(ANN_R,0)",
...     direction=Direction.MAXIMIZE,
...     multiplier="2",
...     relative_to_benchmark=True,
... )
```

Maximise return on equity (absolute, aggregated by shares):

```
>>> fpo.add_general_linear_term(
...     name="Max ROE (by shares)",
...     attribute="FF_ROE(ANN_R,0)",
...     direction=Direction.MAXIMIZE,
...     aggregation_method=1,
... )
```

add\_risk\_parity\_term(_name_, _\*_, _risk\_type\=2_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_risk_parity_term "Link to this definition")

Add a Risk Parity objective term.

All objective terms added before this call are removed and any added after are silently ignored. Constraints are kept but forced to disabled. This ensures the optimizer runs in pure risk parity mode.

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **risk\_type** (_int__,_ _default 2_) – Risk type: - 0: Expected Tail Loss (ETL) - 1: Standard Deviation - 2: Variance
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_starr\_term(_name_, _\*_, _multiplier\='1'_, _risk\_free\_rate\='0'_, _direction\=1_, _confidence\_level\='95'_, _use\_centered\_etl\=False_, _active\_risk\=False_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_starr_term "Link to this definition")

Add a STARR (Stable Tail Adjusted Return Ratio) objective term.

STARR replaces the standard deviation in the Sharpe Ratio denominator with the Expected Tail Loss (ETL, also known as CVaR / Expected Shortfall), making the objective sensitive to distributional asymmetry and tail risk:

> STARR(w) = (E\[rₚ\] − rf) / ETLα(rₚ)

where:

-   E\[rₚ\] — portfolio expected return
    
-   rf — risk-free rate (`risk_free_rate`)
    
-   ETLα(rₚ) — Expected Tail Loss at confidence level α:
    
    ETLα = −E\[rₚ | rₚ ≤ VaRα(rₚ)\], i.e. the expected loss in the worst (1−α) fraction of outcomes
    

Unlike the Sharpe Ratio, which treats upside and downside deviations symmetrically, STARR penalises fat tails and negative skewness more heavily because ETL captures the _severity_ of extreme losses rather than only their frequency.

**Centered ETL** (`use_centered_etl=True`)

ETL is computed on mean-adjusted returns rₚ − E\[rₚ\]. This removes the drift contribution so that the denominator reflects only the shape of the return distribution — volatility, skewness, and kurtosis — rather than the level of expected returns. Use this when you want the risk measure to be purely a function of higher moments.

**Active STARR** (`active_risk=True`)

Replaces total portfolio returns with active returns rₐ = rₚ − rB and ETL with active ETL, optimizing the ratio of active return to active tail risk. This is analogous to the Information Ratio but uses a tail risk denominator. A benchmark must be specified in the FPO setup.

Both total and active STARR should almost always be **maximized** (`direction=1`, the default).

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Scalar weight applied to this term in a multi-objective function.
    
-   **risk\_free\_rate** (_NumericValue__,_ _default "0"_) – Annualised risk-free (hurdle) rate for the STARR numerator. Accepts a numeric constant (e.g. `"5"` for 5 %) or a FactSet formula. Ignored when `active_risk=True` — the benchmark return acts as the hurdle.
    
-   **direction** (_int__,_ _default 1_) –
    
    Optimization direction:
    
    -   1: Maximize (default and recommended — higher STARR is better).
        
    -   0: Minimize (rarely useful).
        
-   **confidence\_level** (_NumericValue__,_ _default "95"_) – Confidence level for the ETL calculation, entered as a percentage. E.g. `"95"` means ETL covers the worst 5 % of outcomes. `"99"` targets the worst 1 %, producing a more conservative (tail- heavy) risk measure.
    
-   **use\_centered\_etl** (_bool__,_ _default False_) – If True, compute ETL on mean-adjusted returns to isolate higher- moment risk (volatility, skewness, kurtosis) from drift. If False (default), ETL is computed on raw returns.
    
-   **active\_risk** (_bool__,_ _default False_) –
    
    Selects the risk framework:
    
    -   False: total-risk STARR — ETL of total portfolio returns.
        
    -   True: active-risk STARR — ETL of active returns relative to the benchmark. Requires a benchmark to be set in the FPO setup.
        
-   **enabled** (_bool__,_ _default True_) – Whether this term is active in the optimization.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Maximize STARR at 95 % confidence with a 2 % risk-free rate:

```
>>> optimizer.add_starr_term(
...     name="STARR 95",
...     risk_free_rate="2",
...     confidence_level="95",
... )
```

Use a stricter 99 % confidence level to target deep tail risk:

```
>>> optimizer.add_starr_term(
...     name="STARR 99",
...     risk_free_rate="2",
...     confidence_level="99",
... )
```

Active STARR — maximize active-return-to-active-tail-risk ratio (benchmark must be set in FPO setup):

```
>>> optimizer.add_starr_term(
...     name="Active STARR",
...     active_risk=True,
...     confidence_level="95",
... )
```

Use centered ETL to focus purely on distributional shape:

```
>>> optimizer.add_starr_term(
...     name="STARR centered",
...     confidence_level="95",
...     use_centered_etl=True,
... )
```

add\_sharpe\_ratio\_term(_name_, _\*_, _multiplier\='1'_, _risk\_free\_rate\='0'_, _direction\=1_, _active\_risk\=False_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_sharpe_ratio_term "Link to this definition")

Add a Sharpe Ratio (or Information Ratio) objective term.

The metric being optimized is selected by the `active_risk` flag.

**Sharpe Ratio mode** (`active_risk=False`, default)

Maximises the classic Sharpe Ratio:

> SR(w) = (E\[rₚ\] − rf) / σₚ(w)

where E\[rₚ\] is the portfolio expected return, rf the risk-free rate (`risk_free_rate`), and σₚ(w) = √(wᵀ Σ w) the total portfolio volatility.

**Information Ratio mode** (`active_risk=True`)

Replaces total volatility with tracking error as the denominator, yielding the Information Ratio:

> IR(w) = (E\[rₚ\] − E\[rB\]) / σₐ(w)

where E\[rB\] is the benchmark expected return and σₐ(w) = √((w − wB)ᵀ Σ (w − wB)) is the tracking error of the active portfolio (w − wB) relative to benchmark weights wB. IR measures the reward for active bets per unit of active risk taken. A benchmark must be specified in the FPO setup when this mode is used.

Both metrics should almost always be **maximized** (`direction=1`, the default).

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Scalar weight applied to this term in a multi-objective function.
    
-   **risk\_free\_rate** (_NumericValue__,_ _default "0"_) – Annualised risk-free (hurdle) rate used in the SR numerator. Accepts a numeric constant (e.g. `"0.04"` for 4 %) or a FactSet formula. Ignored when `active_risk=True` - the benchmark return acts as the threshold in IR mode.
    
-   **direction** (_int__,_ _default 1_) –
    
    Optimization direction:
    
    -   1: Maximize (default and recommended — higher SR or IR is better).
        
    -   0: Minimize (rarely useful).
        
-   **active\_risk** (_bool__,_ _default False_) –
    
    Selects the risk framework:
    
    -   False: Sharpe Ratio - denominator is total portfolio volatility.
        
    -   True: Information Ratio - denominator is tracking error relative to the benchmark. Requires a benchmark to be set in the FPO setup.
        
-   **enabled** (_bool__,_ _default True_) – Whether this term is active in the optimization.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

Maximize the Sharpe Ratio with a 4 % annual risk-free rate:

```
>>> optimizer.add_sharpe_ratio_term(
...     name="max Sharpe with 4% risk-free rate",
...     risk_free_rate="4",
... )
```

Maximize the Information Ratio (benchmark must be set in FPO setup):

```
>>> optimizer.add_sharpe_ratio_term(
...     name="Max IR",
...     active_risk=True,
... )
```

Use as part of a multi-objective strategy together with a risk cap:

```
>>> (
...     optimizer
...     .add_sharpe_ratio_term(name="Мax IR", active_risk=True)
...     .add_risk_volatility_constraint(name="Active Vol cap", active_risk=True, max_risk="5")
... )
```

add\_volatility\_term(_name_, _\*_, _direction\=0_, _multiplier\='1'_, _active\_risk\=True_, _risk\_type\=1_, _factors\=None_, _factor\_weight\='1'_, _specific\_weight\='1'_, _use\_secondary\_risk\_model\=False_, _secondary\_risk\_model\=''_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_volatility_term "Link to this definition")

Add a Volatility objective term to the optimization objective.

This term contributes to the objective as:

> direction × multiplier × σ²

where σ² is the portfolio variance calculated from the risk model:

> σ² = w’ × Σ × w = factor\_weight × (w’ × B × F × B’ × w) + specific\_weight × (w’ × D × w)

with B being factor loadings, F the factor covariance, and D the specific variance.

This is typically the primary risk term in mean-variance optimization, representing the Markowitz portfolio variance penalty.

Defaults match the UI: - Direction: Minimize - Multiplier: 1 - Risk Type: Standard Deviation - Risk Scope: Active Risk (tracking error) - Factor Weight: 1 - Specific Weight: 1 - Secondary benchmark/model: disabled

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **direction** (_int__,_ _default Direction.MINIMIZE_ _(__0__)_) – Direction: - 0 = minimize (UI default) - 1 = maximize
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term (risk aversion parameter).
    
-   **active\_risk** (_bool__,_ _default True_) – If True, optimize active risk (tracking error). If False, optimize total risk.
    
-   **risk\_type** (_int__,_ _default 1_) – Risk measure: - 1: Standard Deviation - 2: Variance
    
-   **factors** (_list__\[__str__\]__,_ _optional_) – Factor IDs to include. If None, uses all factors.
    
-   **factor\_weight** (_NumericValue__,_ _default "1"_) – Weight for factor risk component.
    
-   **specific\_weight** (_NumericValue__,_ _default "1"_) – Weight for specific risk component.
    
-   **use\_secondary\_risk\_model** (_bool__,_ _default False_) – If True, use a secondary risk model / benchmark source.
    
-   **secondary\_risk\_model** (_str__,_ _default ""_) – Secondary risk model identifier (used only when `use_secondary_risk_model=True`).
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Examples

UI-default configuration (active risk setup):

```
>>> optimizer.add_volatility_term(name="Volatility")
```

Minimize total risk (not relative to benchmark):

```
>>> optimizer.add_volatility_term(
...     name="Total Volatility",
...     active_risk=False,
... )
```

Use variance instead of standard deviation:

```
>>> optimizer.add_volatility_term(
...     name="Variance Penalty",
...     risk_type=2,
...     multiplier="2"
... )
```

Only factor risk:

```
>>> optimizer.add_volatility_term(
...     name="Factor Risk Penalty",
...     risk_type=2,
...     specific_weight="0"
... )
```

Emphasize factor risk relative to specific risk:

```
>>> optimizer.add_volatility_term(
...     name="Factor-Heavy Risk",
...     factor_weight="2",
...     specific_weight="1",
... )
```

add\_transaction\_cost\_term(_name_, _\*_, _multiplier\='1'_, _direction\=0_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_transaction_cost_term "Link to this definition")

Add a Transaction Cost objective term.

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term.
    
-   **direction** (_int__,_ _default 0_) – Direction (0=minimize, 1=maximize).
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

add\_sensitivity\_term(_name_, _\*_, _formula\=None_, _predefined\=None_, _direction\=0_, _multiplier\='1'_, _relative\_to\_benchmark\=False_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_sensitivity_term "Link to this definition")

Add a Sensitivity objective term to optimise a custom security attribute.

The Sensitivity term adds a linear function of a per-security attribute to the objective. The attribute is either a custom FactSet formula (`formula`) or a built-in fixed-income metric (`predefined`).

Exactly one of `formula` or `predefined` must be supplied.

Parameters:

-   **name** (_str_) – Descriptive name for this term (shown as **Term Name** in the UI).
    
-   **formula** (_str_ _or_ _numeric__,_ _optional_) –
    
    A custom FactSet formula, OFDB reference, or screening expression defining the per-security attribute. For example:
    
    -   `"FF_DIV_YLD(ANN,0)"` – dividend yield
        
    -   `"FF_EARN_YLD(ANN_R,0)"` – earnings yield
        
    -   `"FF_ROE(ANN_R,0)"` – return on equity
        
    -   `"QFL_BETA(0,LEVEL,252D)"` – 1-year market beta
        
    -   `"OFDB(Client:/ESG.OFDB, 'ESG_SCORE', 0)"` – custom OFDB field
        
-   **predefined** (_int__,_ _optional_) – A built-in fixed-income sensitivity metric from `SensitivitySelection` (e.g. `SensitivitySelection.EFFECTIVE_DURATION`). Use this instead of `formula` when targeting a standard fixed-income measure.
    
-   **direction** (_int__,_ _default 0_) – Optimisation direction (0 = minimize, 1 = maximize).
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term relative to other objective terms.
    
-   **relative\_to\_benchmark** (_bool__,_ _default False_) – When `True`, targets the _active_ attribute (portfolio minus benchmark).
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

Raises:

**ValueError** – If both or neither of `formula` / `predefined` are supplied.

Examples

Maximise dividend yield (formula, absolute):

```
>>> fpo.add_sensitivity_term(
...     name="Max Dividend Yield",
...     formula="FF_DIV_YLD(ANN,0)",
...     direction=1,
... )
```

Maximise earnings yield relative to benchmark with higher importance (formula, active):

```
>>> fpo.add_sensitivity_term(
...     name="Max Active Earnings Yield",
...     formula="FF_EARN_YLD(ANN_R,0)",
...     direction=1,
...     multiplier="2",
...     relative_to_benchmark=True,
... )
```

Minimise effective duration (predefined, absolute):

```
>>> from fds.fpe.quant.fpo._strategy_builder import SensitivitySelection
>>> fpo.add_sensitivity_term(
...     name="Min Effective Duration",
...     predefined=SensitivitySelection.EFFECTIVE_DURATION,
...     direction=0,
... )
```

Maximise OAS with reduced weight (predefined, absolute):

```
>>> fpo.add_sensitivity_term(
...     name="Max OAS",
...     predefined=SensitivitySelection.OAS,
...     direction=1,
...     multiplier="0.5",
... )
```

Minimise active modified duration (predefined, benchmark-relative):

```
>>> fpo.add_sensitivity_term(
...     name="Min Active Modified Duration",
...     predefined=SensitivitySelection.MODIFIED_DURATION,
...     direction=0,
...     relative_to_benchmark=True,
... )
```

add\_tax\_cost\_term(_name_, _\*_, _direction\=0_, _multiplier\='1'_, _penalty\=0_, _enabled\=True_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO.add_tax_cost_term "Link to this definition")

Add a Tax Cost objective term.

Note: Tax settings must be configured using set\_tax\_settings() first.

Parameters:

-   **name** (_str_) – Descriptive name for this term.
    
-   **direction** (_int__,_ _default 0_) – Direction (0=minimize, 1=maximize).
    
-   **multiplier** (_NumericValue__,_ _default "1"_) – Weight of this term.
    
-   **penalty** (_int__,_ _default 0_) – Penalty adjustment.
    
-   **enabled** (_bool__,_ _default True_) – Whether this term is active.
    

Returns:

Returns self for method chaining.

Return type:

[FPO](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo.FPO")

## portfolio\_simulation[#](https://fpe.factset.com/docs/fpo.html#id3 "Link to this heading")

```
from fds.fpe.quant.fpo import FPO
from fds.fpe.quant.fpo.preload import load_simulation_data
from fds.fpe.quant.fpo.simulation import portfolio_simulation
from fds.fpe.dates import TimeSeries

# Create FPO object
optimizer = FPO(
    acct='PERSONAL:CASH_PORT_FDS_123.ACCT',
    strategy='BT_DOCUMENTS:US Large Cap',
    backtest_date='20230630',
    risk_model_date='20230630',
    risk_model_id_override='FDS:GLOBAL_EQUITY_M_V1',
)

# Define simulation time series
ts = TimeSeries(start='20230630', stop='20240630', freq='Q')

# Preload data
ps_data = load_simulation_data(dates=ts, fpo=optimizer)

# Run portfolio simulation
sim_results = portfolio_simulation(
    fpo=optimizer,
    preloaded_data=ps_data,
    time_series=ts,
    intraperiod_actions=True,
    verbose=False,
    max_turnover=80,
)
```

fds.fpe.quant.fpo.portfolio\_simulation(_fpo_, _acct=None_, _initial\_portfolio\_usage=InitialUsage.FIRST\_PERIOD\_ONLY_, _ofdb\_path=None_, _time\_series=None_, _dates=None_, _risk\_model=None_, _max\_turnover=<object object>_, _apply\_turnover\_on\_start=False_, _starting\_cash=1000000000.0_, _currency='USD'_, _intraperiod\_actions=True_, _verbose=False_, _ofdb\_exists=False_, _archive\_path=None_, _preloaded\_data=None_, _incomplete\_result=None_, _continue\_on\_infeasible=False_, _run\_in\_bulk=False_, _calculate\_risk\_contribution=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.portfolio_simulation "Link to this definition")

Run a portfolio simulation for a given time series, using your optimal portfolio for the previous period as your initial portfolio for each new period. By default, the simulation will start with 1 billion cash USD. The max turnover for each period will default to the cash percent of the previous period.

Parameters:

-   **fpo** (_FPO object_) – An fds.fpe.quant.fpo.\_fpo.FPO object containing your optimization settings.
    
-   **acct** (_str__,_ _optional_) – Allows you to override the .ACCT used as the initial portfolio. Any metadata contained in this .ACCT will be applied to the current optimization. If this key is not defined, the .ACCT saved FPO object will be used as the initial portfolio. If .ACCT saved FPO object is not defined, the .ACCT saved in the PA document will be used as the initial portfolio.
    
-   **initial\_portfolio\_usage** (_InitialUsage object__,_ _optional_) – This parameter specifies the method and timing of applying the Initial Portfolio definition throughout the simulation.
    
-   **ofdb\_path** (_str__,_ _optional_) – The path on which to archive your optimal holdings for each period. The path must not already exist and must not include a file extension (e.g “OFDB” or “ACCT”). An ACCT and OFDB file will be created on this path. A cash portfolio will be stored on this path. Any acct overrides defined in your FPO instance will be overriden by this path.
    
-   **time\_series** (_TimeSeries object__,_ _optional_) – An fds.fpe.dates.TimeSeries object, to be used as the simulation dates. You may also pass a list of dates.
    
-   **dates** (_list__,_ _optional_) – A list of dates to be used for your simulation, to be used as the simulation dates. Accepts dates of type str or datetime.datetime objects.
    
-   **risk\_model** (_str_) – A valid risk model ID to be used for your optimization. If you do not pass a risk model, the sim will check your FPO instance for a risk model. If you have not specified a risk model on your FPO instance, “FDS:GLOBAL\_EQUITY\_M\_V1” will be used. You must have the appropriate CACCESS for the risk model provided.
    
-   **max\_turnover** (_int__,_ _optional_) – The max turnover percent for your simulation. By default, the simulation will use the percent cash from the previous period as the max\_turnover for the current period, until reaching or falling below “max\_turnover”, at which point this value will be used. If not provided, no turnover limit will be imposed during the simulation. By default 20.
    
-   **apply\_turnover\_on\_start** (_bool__,_ _optional_) – If True, the turnover limit specified by max\_turnover will be applied on the first date of the simulation. If False, the turnover will be relevant only for the dates after the first. By default, False.
    
-   **starting\_cash** (_int__,_ _optional_) – The amount of cash to load in your initial cash portfolio. By default, 1 billion.
    
-   **currency** (_str__,_ _optional_) – The currency to use for your starting cash. By default, USD. Must provide valid ISO3 currency code.
    
-   **intraperiod\_actions** (_bool__,_ _optional_) – If true, update acct/ofdb holdings to reflect any intraperiod corporate actions (e.g. mergers, split, dividends) By default, True.
    
-   **verbose** (_bool__,_ _optional_) – If true, print metadata for optimization and intraperiod actions calculations. By default, False.
    
-   **ofdb\_exists** (_bool__,_ _optional_) – Whether the ofdb provided already exists By default, False
    
-   **archive\_path** (_str__,_ _optional_) – An alternative path to archive the simulation results By default, None
    
-   **preloaded\_data** (_FPOBacktestDataLoader__,_ _optional_) – If provided, the preloaded data will be used to run the simulation
    
-   **incomplete\_result** (_\_SimulationResults__,_ _optional_) – If provided, the backtest will resume from here
    
-   **continue\_on\_infeasible** (_bool__,_ _optional_) – If set to True, the simulation will carry on after an infeasible point by carrying the current portfolio one step further. By default, False
    
-   **run\_in\_bulk** (_bool__,_ _optional_) – If True, will use the engine endpoint for running the simulation. By default False
    
-   **calculate\_risk\_contribution** (_bool__,_ _optional_) – If True, will calculate risk contribution report for the simulation. By default False
    

Return type:

`_SimulationResults` | `Dict`\[`str`, `_SimulationResults`\]

Returns:

-   _A python dictionary whose keys are your simulation dates and whose values_
    
-   _are the optimal results for each date._
    

References

-   FPO OA: [https://my.apps.factset.com/oa/pages/21541](https://my.apps.factset.com/oa/pages/21541)
    
-   FPO API documentation: [https://developer.factset.com/api-catalog/factset-portfolio-optimizer-api](https://developer.factset.com/api-catalog/factset-portfolio-optimizer-api)
    
-   PA3 OA: [https://my.apps.factset.com/oa/pages/17520](https://my.apps.factset.com/oa/pages/17520)
    

## efficient\_frontier[#](https://fpe.factset.com/docs/fpo.html#id4 "Link to this heading")

```
from fds.fpe.quant.fpo import FPO, efficient_frontier

# Create FPO object
optimizer = FPO(
    acct='PERSONAL:CASH_PORT_FDS_123.ACCT',
    strategy='BT_DOCUMENTS:US Large Cap',
    backtest_date='20230630',
    risk_model_date='20230630',
    risk_model_id_override='FDS:GLOBAL_EQUITY_M_V1',
)

# Run efficient frontier calculation
result_ef = efficient_frontier(
    fpo=optimizer,
    date='20230630',
    points=5,
)
```

fds.fpe.quant.fpo.efficient\_frontier(_fpo_, _date_, _points_, _data\=None_, _active\_risk\=True_, _progress\_bar\=False_, _calculate\_risk\_contribution\=False_, _solver\=None_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.efficient_frontier "Link to this definition")

Runs an efficient frontier calculation

Parameters:

-   **fpo** ([`FPO`](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.FPO "fds.fpe.quant.fpo._fpo.FPO")) – FPO object An FPO object containing your optimization settings.
    
-   **date** (`str`) – str The date for which the frontier should be calculated
    
-   **points** (`int`) – int The number of points on the frontier
    
-   **data** (`FPOBacktestDataLoader`) – FPOBacktestDataLoader object Optional, a preloaded data to be used for running the frontier
    
-   **active\_risk** (`bool`) – bool Optional, whether to run the active risk frontier. By default, True
    
-   **calculate\_risk\_contribution** (`bool`) – bool Optional, whether to calculate risk contribution report. By default, False
    
-   **progress\_bar** (`bool`) – bool Optional, whether to show the progress bar for the calculation. By default, False
    

Return type:

`FrontierResult`

Returns:

a frontier result object containing the points data

## load\_simulation\_data[#](https://fpe.factset.com/docs/fpo.html#load-simulation-data "Link to this heading")

```
from fds.fpe.quant.fpo import FPO
from fds.fpe.quant.fpo.preload import load_simulation_data
from fds.fpe.dates import TimeSeries

# Create FPO object
optimizer = FPO(
    acct='PERSONAL:CASH_PORT_FDS_123.ACCT',
    strategy='BT_DOCUMENTS:US Large Cap',
    backtest_date='20230630',
    risk_model_date='20230630',
    risk_model_id_override='FDS:GLOBAL_EQUITY_M_V1',
)

# Define simulation time series and preload data
ts = TimeSeries(start='20230630', stop='20240630', freq='Q')
ps_data = load_simulation_data(dates=ts, fpo=optimizer)
```

fds.fpe.quant.fpo.load\_simulation\_data(_dates_, _fpo_, _data\_provider\=None_, _use\_pa\_for\_dividends\=True_, _universe\_type\=UniverseType.EQUITY_, _equity\_corporate\_actions\_source\=EquityCorporateActionsSource.FACTSET_, _fi\_corporate\_actions\_source\=FICorporateActionsSource.FACTSET_, _\_full\_cache\_reload\=False_, _auto\_preload\_file\=None_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.load_simulation_data "Link to this definition")

Loads data for simulation

Parameters:

-   **dates** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")) – The dates for which the data will be loaded
    
-   **fpo** (_FPO object_) – An fds.quant.fpo.\_fpo.FPO object containing your optimization settings.
    
-   **data\_provider** (_FPOBacktestDataProvider object_) – Optional, partially loaded data that will be extended for the given dates
    
-   **use\_pa\_for\_dividends** (_bool object telling whether to use PA to fetch dividends._) – By default, it’s False which means the dividends will be fetched via screening
    
-   **universe\_type** (_UniverseType_) – Optional, the expected contents of the universe defined in the FPO object (PA doc). By default, equity is assumed
    
-   **equity\_corporate\_actions\_source** (_EquityCorporateActionsSource_) – Optional, the source used for getting equity corporate actions. By default, Factset
    
-   **fi\_corporate\_actions\_source** (_FICorporateActionsSource_) – Optional, the source used for getting debt corporate actions. By default, Factset
    
-   **\_full\_cache\_reload** (_bool_) – Optional, if set to True when the strategy is changed it will be reloaded for all dates in the data provider separately instead of once in the beginning. Useful for cases where we have dynamic global variables or group-changing assets By default, False auto\_preload\_file: str, optional The file name where the preload data will be saved.
    

Return type:

a loaded data object that can be used for running a simulation

## read\_data\_from\_file[#](https://fpe.factset.com/docs/fpo.html#read-data-from-file "Link to this heading")

fds.fpe.quant.fpo.read\_data\_from\_file(_filename_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.read_data_from_file "Link to this definition")

Report generation helper function.

Parameters:

**filename** (_str_) – The filename under which the data is stored

Return type:

FPOBacktestDataLoader instance that can be used for running a simulation

## store\_data\_to\_file[#](https://fpe.factset.com/docs/fpo.html#store-data-to-file "Link to this heading")

fds.fpe.quant.fpo.store\_data\_to\_file(_data_, _filename_)[#](https://fpe.factset.com/docs/fpo.html#fds.fpe.quant.fpo.store_data_to_file "Link to this definition")

Report generation helper function.

Parameters:

-   **data** (_a FPOBacktestDataProvider object_) – The data to be stored
    
-   **filename** (_str_) – The filename under which to store the data
    

Return type:

True if store was successful, False otherwise
