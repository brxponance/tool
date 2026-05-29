---
created: 2026-05-11T13:05:08 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/screening.html
author: 
---

# Screening — FactSet Programmatic

> ## Excerpt
> Fetch Screening data for a Universe.

---
## Screen[#](https://fpe.factset.com/docs/screening.html#screen "Link to this heading")

```
from fds.fpe.screening import Screen
from fds.fpe.dates import TimeSeries
from fds.fpe.universe import ScreeningExpressionUniverse, UnivLimit

# Create S&P 500 universe with 2-year monthly data
dates = TimeSeries(start='-24M', freq='M')
universe = ScreeningExpressionUniverse(UnivLimit.SP500, time_series=dates)

# Screen for Price and Market Cap
screen = Screen(universe=universe, formulas=['P_PRICE', 'FF_MKT_VAL'])

screen.calculate()

# Access results as a pandas DataFrame after calculate().
# The DataFrame is multi-indexed, using symbol and date as indexes.
df = screen.data
```

_class_ fds.fpe.screening.Screen(_universe\=None_, _formulas\=None_, _columns\=None_, _entire\_universe\=False_, _array\_values\=False_, _progress\_bar\=None_, _index\_cols\=None_, _desc\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen "Link to this definition")

Fetch Screening data for a Universe.

Screening formulas let you retrieve data through FactSet’s Screening Engine.

Parameters:

-   **universe** (_Universe_) – The universe for which to fetch data. This can be any type of universe. For example: IdentifierUniverse, OFDBUniverse, ScreeningExpressionUniverse, ScreeningDocumentUniverse
    
-   **formulas** (_list__,_ _optional_) – List of Screening formulas (strings), ScreeningExpressions, and UniversalScreenParameters to calculate for the given universe. By default, None. If a ScreeningDocumentUniverse was provided for the universe parameter, formulas will default to the formulas in the provided screening document.
    
-   **columns** (_list__,_ _optional_) – Column labels to use for the resulting DataFrame. By default, None, and column names will taken from formulas.
    
-   **entire\_universe** (_bool__,_ _optional_) – If True, use all unique identifiers from the given universe for every period. This is the union of symbols across all periods from the universe’s constituents. If False, use only the identifiers that exist in the universe for each period. By default, False.
    
-   **array\_values** (_bool__,_ _optional_) – Allow array values to be returned from the screening engine. If True, any screening results that returns more than one value will be stored as an array. By default False
    
-   **progress\_bar** (_bool__,_ _optional_) – An option to display progress bars during calculation. By default, None, displaying a progress bar only while data fetching. If True, an additional is displayed during universe calculation. If False, progress bars are suppressed.
    
-   **index\_cols** (_bool__,_ _optional_) – Display Pandas multi-index as columns on generated screen. Assigned automatically on screen load. Returns True if an R kernel is running. User-passed arguments will override automatic assignment. By default None
    

See also

-   FactSet Estimates: [https://my.apps.factset.com/oa/pages/20042](https://my.apps.factset.com/oa/pages/20042)
    
-   FactSet Fundamentals: [https://my.apps.factset.com/oa/pages/15099](https://my.apps.factset.com/oa/pages/15099)
    
-   FactSet Equity Prices: [https://my.apps.factset.com/oa/pages/458](https://my.apps.factset.com/oa/pages/458)
    
-   FactSet Database: [https://my.apps.factset.com/oa/pages/8](https://my.apps.factset.com/oa/pages/8)
    
-   Writing FactSet Functions: [https://my.apps.factset.com/oa/pages/20409](https://my.apps.factset.com/oa/pages/20409)
    
-   Fixed Income : [https://my.apps.factset.com/oa/pages/20053](https://my.apps.factset.com/oa/pages/20053)
    

_property_ array\_values_: bool_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.array_values "Link to this definition")

Allowing array values for formula results?

calculate(_\*\*kwargs_)[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.calculate "Link to this definition")

Calculate the data.

Return type:

`None`

_property_ columns_: list\[Any\]_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.columns "Link to this definition")

List of column labels for the data DataFrame.

_property_ data_: DataFrame_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.data "Link to this definition")

A pandas DataFrame indexed by date and symbol.

Contains all of the screening data fetched based on the given inputs.

_property_ desc_: str_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.desc "Link to this definition")

Description used in the representation of the object.

_property_ entire\_universe_: bool_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.entire_universe "Link to this definition")

Using all unique identifiers for the given universe for every period?

_property_ formulas_: list\[Any\]_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.formulas "Link to this definition")

List of Screening formulas and/or ScreeningExpressions used for data fetching.

_property_ index\_cols_: bool_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.index_cols "Link to this definition")

Displaying pandas multi-index as columns?

_property_ is\_calculated_: bool_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.is_calculated "Link to this definition")

Has the data been calculated?

_property_ metadata_: DataFrame_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.metadata "Link to this definition")

A pandas DataFrame containing metadata about the screening data requests.

This includes duration, warnings, errors, etc.

_classmethod_ recipe(_screen\_path_, _progress\_bar\=False_)[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.recipe "Link to this definition")

Provides a snippet of code that can be used to recreate a screen in FPE.

Parameters:

-   **screen\_path** (_str_) – Path to the screen for which a recipe will be created.
    
-   **progress\_bar** (_bool__,_ _optional_) – An option to display a progress bar during recipe creation. By default, False.
    

Return type:

`None`

_property_ timestamp_: datetime_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.timestamp "Link to this definition")

Execution timestamp.

_property_ universe_: Universe_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.universe "Link to this definition")

The universe for which data is fetched.

_property_ wall\_time_: float_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.wall_time "Link to this definition")

Calculation wall time.

_property_ warnings_: list\[Any\] | None_[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.Screen.warnings "Link to this definition")

If there has been some warnings during the calculation, they will be stored here as a list.

## Screening Expression[#](https://fpe.factset.com/docs/screening.html#screening-expression "Link to this heading")

_class_ fds.fpe.screening.ScreeningExpression(_expression_, _name\=None_, _date\_offset\=None_)[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.ScreeningExpression "Link to this definition")

Represents a Screening expression and its attributes.

The expression and its attributes are sent to the data fetching engine for evaluation.

Parameters:

-   **expression** (_str_) – The text of the Screening formula.
    
-   **name** (_str_) – A short descriptive string used to name the data column.
    
-   **date\_offset** (_str__,_ _optional_) – Allows you to modify the fetch date for this formula. This should be a FactSet date math operation such as +5D, or -1AY. If provided, the data fetching engine will adjust this formula’s current backtest date using the date offset and will fetch data from this new date. The universe will come from the current backtest date. The fetched data will be stored under the current backtest date. None by default.
    

expression[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.ScreeningExpression.expression "Link to this definition")

The text of the Screening formula.

Type:

str

name[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.ScreeningExpression.name "Link to this definition")

The short descriptive string used to name the data column.

Type:

str

date\_offset[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.ScreeningExpression.date_offset "Link to this definition")

The backtest date modifier.

Type:

str

to\_dict()[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.ScreeningExpression.to_dict "Link to this definition")

Returns the Screening expression specification as a dictionary.

Return type:

`dict`\[`str`, `str` | `None`\]

## Universal Screen Parameter[#](https://fpe.factset.com/docs/screening.html#universal-screen-parameter "Link to this heading")

_class_ fds.fpe.screening.UniversalScreenParameter(_reference\_name_, _name\=None_)[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.UniversalScreenParameter "Link to this definition")

Represents a Universal Screening parameter and its attributes.

The reference name and its attributes are sent to the data fetching engine for evaluation.

Parameters:

-   **reference\_name** (_str_) – The text of the Universal Screening parameter.
    
-   **name** (_str_) – A short descriptive string used to name the data column.
    

reference\_name[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.UniversalScreenParameter.reference_name "Link to this definition")

The text of the Universal Screening parameter.

Type:

str

name[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.UniversalScreenParameter.name "Link to this definition")

The short descriptive string used to name the data column.

Type:

str

_static_ all\_parameters()[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.UniversalScreenParameter.all_parameters "Link to this definition")

Returns the specification for retrieving all Universal Screening parameters.

As a dictionary.

Return type:

`dict`\[`str`, `str`\]

to\_dict()[#](https://fpe.factset.com/docs/screening.html#fds.fpe.screening.UniversalScreenParameter.to_dict "Link to this definition")

Returns the Universal Screening parameter specification as a dictionary.

Return type:

`dict`\[`str`, `str`\]
