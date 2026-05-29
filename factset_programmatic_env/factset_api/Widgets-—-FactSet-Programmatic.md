---
created: 2026-05-11T13:08:40 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/widgets.html
author: 
---

# Widgets — FactSet Programmatic

> ## Excerpt
> Security identifier widget is used for managing financial instrument IDs.
It autocompletes input for tickers/CUSIPs/SEDOLs.

---
## IDWidget[#](https://fpe.factset.com/docs/widgets.html#idwidget "Link to this heading")

_class_ fds.fpe.widgets.IDWidget(_value\=\[\]_, _description\='Identifier'_, _category\=None_, _direction\='horizontal'_, _m\_data\='ID Widget'_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.IDWidget "Link to this definition")

Security identifier widget is used for managing financial instrument IDs. It autocompletes input for tickers/CUSIPs/SEDOLs.

Parameters:

-   **value** (_list__,_ _default=__\[__\]_) – List of security identifiers
    
-   **description** (_str__,_ _default='Identifier'_) – Label text displayed with the widget
    
-   **category** (_str_ _or_ _list_ _of_ _str__,_ _default=__\[__\]_) –
    
    Filter results by one or more category names (e.g., `['index']` to show only indexes).
    
    \[‘publicCompany’, ‘person’, ‘activismCampaign’, ‘activistHolder’, ‘loan’, ‘file’, ‘businessTags’, ‘deepSectorAssets’, ‘cryptocurrency’, ‘cacIdentifiers’, ‘cashIso’, ‘commodity’, ‘country’, ‘region’, ‘deal’, ‘debt’, ‘drugs’, ‘eiu’, ‘etf’, ‘etfRealTime’, ‘exchangeRate’, ‘exchangeRateRealTime’, ‘future’, ‘futuresRealtime’, ‘industry’, ‘index’, ‘indexRealTime’, ‘mutualFund’, ‘mutualFundCanadaFundServ’, ‘mutualFundRealTime’, ‘options’, ‘ownershipHolders’, ‘ownershipSecuritiesInactive’, ‘ownershipHoldersInactive’, ‘ownershipHoldersOS3’, ‘ownershipPrivateCompany’, ‘ownershipFIBonds’, ‘ownershipFILoans’, ‘ownershipFISecuritized’, ‘pevcDeals’, ‘pevcFirm’, ‘pevcFund’, ‘prePricedBonds’, ‘tulletRates’, ‘yield’, ‘yieldCurves’, ‘fixedIncomeRealTime’, ‘sparFundIndex’\].
    
-   **direction** (_{'horizontal'__,_ _'vertical'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **m\_data** (_str__,_ _default='ID Widget'_) – Metadata identifier
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes; receives the new list of identifiers.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    

Examples

```
from fds.fpe.widgets import IDWidget
id_widget1 = IDWidget(
    value=['AAPL-US', 'MSFT-US'],
    description='Security Identifiers'
)
display(id_widget1)

# With custom layout
from fds.fpe.widgets import Layout
id_widget2 = IDWidget(
    value=['AAPL-US'],
    layout=Layout(width='500px', padding='10px')
)
display(id_widget2)
```

## SparIDWidget[#](https://fpe.factset.com/docs/widgets.html#sparidwidget "Link to this heading")

_class_ fds.fpe.widgets.SparIDWidget(_value\=\[\]_, _description\='SPAR ID'_, _direction\='horizontal'_, _m\_data\='SPAR ID'_, _placeholder\='Select SPAR ID...'_, _on\_change\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.SparIDWidget "Link to this definition")

Widget for selecting a SPAR portfolio or benchmark via a dialog.

Displays a read-only textbox showing the selected identifier alongside a lookup button that opens the SPAR ID selector in a FusionDialog. The selected value is returned as a dict containing `identifier`, `prefix` and `returnType`.

Parameters:

-   **value** (_list_ _of_ _dict__,_ _optional__,_ _default=__\[__\]_) – Initially selected SPAR portfolios, e.g. `[{'identifier': 'CLIENT:/PORT', 'prefix': '', 'returnType': ''}]`.
    
-   **description** (_str__,_ _optional__,_ _default='SPAR ID'_) – Label text displayed alongside the widget.
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _optional__,_ _default='horizontal'_) – Layout direction of label relative to control.
    
-   **m\_data** (_str__,_ _optional__,_ _default='SPAR ID'_) – Metadata identifier.
    
-   **placeholder** (_str__,_ _optional__,_ _default='Select SPAR ID__...__'_) – Placeholder text shown when no value is selected.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked with the new list of portfolio dicts when selection changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to `Layout(width='20rem')`.
    

Examples

```
from fds.fpe.widgets import SparIDWidget
spar = SparIDWidget()
display(spar)

# With a pre-selected value and change callback
spar = SparIDWidget(
    value=[{'identifier': 'CLIENT:/PORT', 'prefix': '', 'returnType': ''}],
    description='Portfolio',
    on_change=lambda val: print(val)
)
display(spar)
```

## AssetClass[#](https://fpe.factset.com/docs/widgets.html#assetclass "Link to this heading")

_class_ fds.fpe.widgets.AssetClass(_value\=''_, _placeholder\=''_, _required\=False_, _show\_label\=True_, _max\_width\='100%'_, _dropdown\_width\=''_, _basis\=''_, _grow\=''_, _direction\='horizontal'_, _description\='Asset Class'_, _m\_data\='Asset Class'_, _disabled\=False_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.AssetClass "Link to this definition")

The AssetClass widget is a selection component that allows users to toggle between different financial asset categories (e.g., Equity, Debt).

Parameters:

-   **value** (_str__,_ _default='DEBT'_) – Selected asset class code (e.g., ‘DEBT’, ‘EQUITY’). Can use code or name.
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text shown when no value is selected
    
-   **required** (_bool__,_ _default=False_) – Whether a selection is required
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to show the label
    
-   **max\_width** (_str__,_ _default='100%'_) – Maximum width of the widget
    
-   **dropdown\_width** (_str__,_ _default=''_) – Width of the dropdown panel (empty string uses default)
    
-   **basis** (_str__,_ _default=''_) – Flex basis of the widget
    
-   **grow** (_str__,_ _default=''_) – Flex grow of the widget
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **description** (_str__,_ _default='Asset Class'_) – Label text displayed with the widget
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **m\_data** (_str__,_ _default='Asset Class'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when the selected value changes; receives the new code string
    

Examples

```
from fds.fpe.widgets import AssetClass
asset_class1 = AssetClass(value='EQUITY')
display(asset_class1)

# With custom layout
from fds.fpe.widgets import Layout
asset_class2 = AssetClass(
    value='EQUITY',
    layout=Layout(width='400px', padding='10px')
)
display(asset_class2)
```

## Date[#](https://fpe.factset.com/docs/widgets.html#date "Link to this heading")

_class_ fds.fpe.widgets.Date(_value\=None_, _description\=''_, _date\_type\='Absolute'_, _show\_relative\=False_, _disabled\=False_, _min\=None_, _max\=None_, _today\=True_, _day\_month\_year\=False_, _year\_month\_day\=False_, _today\_button\=True_, _direction\='horizontal'_, _show\_label\=True_, _layout\=None_, _m\_data\='Date'_, _on\_change\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Date "Link to this definition")

The Date widget allows users to interactively select a date within the FactSet Programmatic Environment, supporting both absolute and relative date selection for use in time-based analysis and data queries.

Parameters:

-   **value** (_datetime.date_ _or_ _str__,_ _default=None_) – Selected date value. Accepts a datetime.date object (absolute date) or a relative code string (e.g. ‘NOW’, ‘0D’, ‘-1AW’). ISO strings are automatically converted to datetime.date on read-back.
    
-   **description** (_str__,_ _default=''_) – Label text displayed with the date picker
    
-   **date\_type** (_str__,_ _default='Absolute'_) – Type of date: ‘Absolute’ or ‘Relative’
    
-   **show\_relative** (_bool__,_ _default=False_) – Whether to show the Absolute/Relative toggle
    
-   **disabled** (_bool__,_ _default=False_) – Whether the date picker is disabled
    
-   **min** (_str__,_ _default=''_) – Minimum selectable date (ISO format YYYY-MM-DD)
    
-   **max** (_str__,_ _default=''_) – Maximum selectable date (ISO format YYYY-MM-DD)
    
-   **day\_month\_year** (_bool__,_ _default=True_) – When True, uses DD/MM/YYYY format; default is MM/DD/YYYY
    
-   **year\_month\_day** (_bool__,_ _default=False_) – When True, uses YYYY/MM/DD format
    
-   **today** (_bool__,_ _default=True_) – Whether to show today option
    
-   **today\_button** (_bool__,_ _default=True_) – Whether to show a button to select today’s date
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction: ‘vertical’, ‘horizontal’, or ‘responsive’
    
-   **show\_label** (_bool__,_ _default=True_) – Whether the label is visible
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when the selected date changes; receives the new value string
    
-   **direction** – Layout direction of label relative to control
    
-   **m\_data** (_str__,_ _default='Date'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’300px’).
    

Examples

```
from fds.fpe.widgets import Date
date = Date(
    value='2024-01-15',
    description='Start Date',
    show_relative=True
)
display(date)
```

## DateRangeWithFrequency[#](https://fpe.factset.com/docs/widgets.html#daterangewithfrequency "Link to this heading")

_class_ fds.fpe.widgets.DateRangeWithFrequency(_\*_, _start\=None_, _end\=None_, _freq\='1M'_, _m\_data\='DateRangeWithFrequency'_, _start\_label\='Start Date'_, _end\_label\='End Date'_, _start\_date\_type\='Absolute'_, _end\_date\_type\='Absolute'_, _direction\='horizontal'_, _show\_relative\=False_, _disabled\=False_, _start\_min\=None_, _start\_max\=None_, _end\_min\=None_, _end\_max\=None_, _day\_month\_year\=False_, _year\_month\_day\=False_, _today\_button\=True_, _show\_label\=True_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.DateRangeWithFrequency "Link to this definition")

The DateRangeWithFrequency widget allows users to interactively define a start date, end date, and data frequency within FPE. It also takes relative date into consideration as an input for time series. It simplifies time-series configuration by combining date range selection and frequency control into a single widget.

Parameters:

-   **start** (_datetime.date_ _or_ _str__,_ _optional_) – Start date. Accepts a datetime.date object (absolute date) or a relative code string (e.g. ‘NOW’, ‘0D’, ‘-1AW’). ISO strings are automatically converted to datetime.date on read-back.
    
-   **end** (_datetime.date_ _or_ _str__,_ _optional_) – End date. Accepts a datetime.date object (absolute date) or a relative code string (e.g. ‘NOW’, ‘0D’, ‘-1AW’). ISO strings are automatically converted to datetime.date on read-back.
    
-   **freq** (_str__,_ _default='1M'_) – Frequency string (e.g., ‘1M’, ‘3Q’, ‘2W’)
    
-   **start\_label** (_str__,_ _default='Start Date'_) – Label for start date picker
    
-   **end\_label** (_str__,_ _default='End Date'_) – Label for end date picker
    
-   **start\_date\_type** (_str__,_ _default='Absolute'_) – Start date type: ‘Absolute’ or ‘Relative’
    
-   **end\_date\_type** (_str__,_ _default='Absolute'_) – End date type: ‘Absolute’ or ‘Relative’
    
-   **direction** (_str__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **show\_relative** (_bool__,_ _default=False_) – Whether to show relative date options for both start and end dates
    
-   **disabled** (_bool__,_ _default=False_) – Whether both date pickers are disabled
    
-   **start\_min** (_str__,_ _default=''_) – Minimum selectable date for start picker (ISO format YYYY-MM-DD)
    
-   **start\_max** (_str__,_ _default=''_) – Maximum selectable date for start picker (ISO format YYYY-MM-DD)
    
-   **end\_min** (_str__,_ _default=''_) – Minimum selectable date for end picker (ISO format YYYY-MM-DD)
    
-   **end\_max** (_str__,_ _default=''_) – Maximum selectable date for end picker (ISO format YYYY-MM-DD)
    
-   **day\_month\_year** (_bool__,_ _default=False_) – When True, uses DD/MM/YYYY format; default is MM/DD/YYYY
    
-   **year\_month\_day** (_bool__,_ _default=False_) – When True, uses YYYY/MM/DD format
    
-   **show\_relative** – Whether to show the Absolute/Relative toggle on each picker
    
-   **today\_button** (_bool__,_ _default=True_) – Whether to show a button to select today’s date
    
-   **direction** – Layout direction: ‘vertical’, ‘horizontal’, or ‘responsive’
    
-   **show\_label** (_bool__,_ _default=True_) – Whether the date picker labels are visible
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when start, end, or freq changes; receives {‘start’, ‘end’, ‘freq’}
    
-   **m\_data** (_str__,_ _default='DateRangeWithFrequency'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import DateRangeWithFrequency
date_range = DateRangeWithFrequency(
    start='2024-01-01',
    end='2024-12-31',
    freq='1M',
    m_data='Analysis Period'
)
display(date_range)

# With custom layout
from fds.fpe.widgets import Layout
date_range = DateRangeWithFrequency(
    start='2024-01-01',
    end='2024-12-31',
    layout=Layout(width='600px', padding='10px')
)
display(date_range)
```

Relative dates are also supported — for example, `-5AY` represents 5 actual years ago. To see all available relative date codes:

```
from fds.fpe.dates import RelativeDate
for name, member in RelativeDate.__members__.items():
    print(f"{name} = {member.value}")
```

## Currency[#](https://fpe.factset.com/docs/widgets.html#currency "Link to this heading")

_class_ fds.fpe.widgets.Currency(_value\=''_, _disabled\=False_, _placeholder\=''_, _clearable\=True_, _show\_label\=True_, _separator\_after\='JPY'_, _open\_on\_focus\=False_, _ensure\_option\=False_, _direction\='horizontal'_, _m\_data\='Currency'_, _description\='Currency'_, _layout\=None_, _on\_change\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Currency "Link to this definition")

Currency selection widget is used for currency codes and names. It allows users to select a currency from a FactSet defined currency list.

Parameters:

-   **value** (_str__,_ _default='LOCAL'_) – Selected currency code (e.g., ‘LOCAL’, ‘USD’, ‘EUR’). Can use code or name; names are automatically resolved to codes.
    
-   **description** (_str__,_ _default='Currency'_) – Label text displayed with the widget
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text shown when no value is selected
    
-   **clearable** (_bool__,_ _default=True_) – Whether the selected value can be cleared
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to show the label
    
-   **separator\_after** (_str__,_ _default='JPY'_) – Value of the option after which a visual separator is inserted
    
-   **open\_on\_focus** (_bool__,_ _default=False_) – Whether the dropdown opens when the input receives focus
    
-   **ensure\_option** (_bool__,_ _default=False_) – When True, only values present in options can be submitted (no free-form input)
    
-   **m\_data** (_str__,_ _default='Currency'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when the selected value changes; receives the new code string
    

Examples

```
from fds.fpe.widgets import Currency
currency1 = Currency(value='USD', description='Currency')
display(currency1)

# With custom layout
from fds.fpe.widgets import Layout
currency2 = Currency(
    value='USD',
    layout=Layout(width='400px', padding='10px')
)
display(currency2)
```

## Calendar[#](https://fpe.factset.com/docs/widgets.html#calendar "Link to this heading")

_class_ fds.fpe.widgets.Calendar(_value\=''_, _direction\='horizontal'_, _m\_data\='Calendar'_, _description\='Calendar'_, _disabled\=False_, _placeholder\=''_, _clearable\=True_, _show\_label\=True_, _separator\_after\='SEVENDAY'_, _open\_on\_focus\=False_, _ensure\_option\=False_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Calendar "Link to this definition")

Calendar selection widget is used for financial calendar codes. The Calendar widget allows users to select a FactSet trading calendar (FIVEDAY, LOCAL, etc.) The trading calendar of any exchange around the world can be selected from a FactSet defined country list.

Parameters:

-   **value** (_str__,_ _default='FIVEDAY'_) – Selected calendar code (e.g., ‘FIVEDAY’, ‘SEVENDAY’). Can use code or name; names are automatically resolved to codes.
    
-   **description** (_str__,_ _default='Calendar'_) – Label text displayed with the widget
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text shown when no value is selected
    
-   **clearable** (_bool__,_ _default=True_) – Whether the selected value can be cleared
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to show the label
    
-   **separator\_after** (_str__,_ _default='SEVENDAY'_) – Value of the option after which a visual separator is inserted
    
-   **open\_on\_focus** (_bool__,_ _default=False_) – Whether the dropdown opens when the input receives focus
    
-   **ensure\_option** (_bool__,_ _default=False_) – When True, only values present in options can be submitted (no free-form input)
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **m\_data** (_str__,_ _default='Calendar'_) – Metadata identifier
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when the selected value changes; receives the new code string
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    

Examples

```
from fds.fpe.widgets import Calendar
calendar1 = Calendar(value='FIVEDAY', description='Cal')
display(calendar1)

# With custom layout
from fds.fpe.widgets import Layout
calendar2 = Calendar(
    value='FIVEDAY',
    layout=Layout(width='400px', padding='10px')
)
display(calendar2)
```

## PriceSources[#](https://fpe.factset.com/docs/widgets.html#pricesources "Link to this heading")

_class_ fds.fpe.widgets.PriceSources(_value\=''_, _m\_data\='Price Sources'_, _description\='Price Sources'_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.PriceSources "Link to this definition")

Widget for selecting price sources and providing pricing formulas.

Parameters:

-   **value** (_str__,_ _default=''_) – Selected price source value or formula
    
-   **description** (_str__,_ _default=''_) – Label text displayed with the widget
    
-   **m\_data** (_str__,_ _default='Price Sources'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import PriceSources
price_sources1 = PriceSources(value='CLOSE', description='Price Sources')
display(price_sources1)
```

## UniverseWidget[#](https://fpe.factset.com/docs/widgets.html#universewidget "Link to this heading")

_class_ fds.fpe.widgets.UniverseWidget(_value\=None_, _description\='Universe'_, _direction\='horizontal'_, _universe\_types\=None_, _m\_data\='Universe Widget'_, _placeholder\=''_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.UniverseWidget "Link to this definition")

A universe in FPE defines the set of securities you want to analyze for a given time series. .. rubric:: Use Case The UniverseWidget allows users to define and select a universe within the FPE such as an equity universe or a debt universe using formulas, portfolios, screens, or identifiers.

Parameters:

-   **value** (_dict__,_ _optional_) – Initial value of the universe selection. Defaults to `{}`.
    
-   **description** (_str__,_ _optional_) – Label text displayed alongside the widget. Defaults to `'Universe'`.
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _optional_) – Layout direction of label relative to control. Defaults to `'horizontal'`.
    
-   **m\_data** (_str__,_ _optional_) – Metadata identifier. Defaults to `'Universe Widget'`.
    
-   **placeholder** (_str__,_ _optional_) – Placeholder text shown in the textbox when no value is selected. Defaults to `'Enter Universe...'` when empty.
    
-   **universe\_types** (_list_ _of_ _str__,_ _optional_) – Allowed universe types passed to the iframe as a URL param
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to `Layout(width='20rem')`.
    

Examples

```
from fds.fpe.widgets import UniverseWidget
universe = UniverseWidget(
    value={'universeType': 'identifier', 'identifiers': ['AAPL-US']},
)
display(universe)
```

With a change callback (use `ipywidgets.Output` to capture prints):

```
import ipywidgets as ipw
output = ipw.Output()

def handle_change(value):
    with output:
        print(f"Universe changed to: {value}")

universe = UniverseWidget(on_change=handle_change)
display(ipw.VBox([universe, output]))
```

## BenchmarkWidget[#](https://fpe.factset.com/docs/widgets.html#benchmarkwidget "Link to this heading")

_class_ fds.fpe.widgets.BenchmarkWidget(_m\_data\='benchmark widget'_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.BenchmarkWidget "Link to this definition")

Benchmark selection widget for portfolio performance comparison. The BenchmarkWidget allows users to define a benchmark using formulas, portfolios, screens, or identifiers within FPE and supports both equity and debt benchmarks.

Use Case

It is used in analytical workflows and performance analysis where a benchmark needs to be specified for comparison against portfolios, universes, or calculated metrics.

Parameters:

-   **value** (_dict__,_ _default={}_) – Selected benchmark data
    
-   **m\_data** (_str__,_ _default='benchmark widget'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import BenchmarkWidget
benchmark1 = BenchmarkWidget(m_data='Portfolio Benchmark')
display(benchmark1)
```

## Sector[#](https://fpe.factset.com/docs/widgets.html#sector "Link to this heading")

_class_ fds.fpe.widgets.Sector(_value\=''_, _direction\='horizontal'_, _description\='Sector'_, _placeholder\=''_, _required\=False_, _show\_label\=True_, _max\_width\='100%'_, _dropdown\_width\=''_, _basis\=''_, _grow\=''_, _m\_data\='Sector'_, _disabled\=False_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Sector "Link to this definition")

Sector selection widget for industry sector classification.

Parameters:

-   **value** (_str__,_ _default='Business Services'_) – Selected sector name or code; names are automatically resolved to codes.
    
-   **description** (_str__,_ _default='Sector'_) – Label text displayed with the widget
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **m\_data** (_str__,_ _default='Sector'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **placeholder** (_str__,_ _default=''_) – Hint text shown when no value is selected
    
-   **required** (_bool__,_ _default=False_) – Whether the field is required
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to show the label
    
-   **max\_width** (_str__,_ _default='100%'_) – Maximum width of the widget
    
-   **dropdown\_width** (_str__,_ _default=''_) – Width of the dropdown panel (empty string uses default)
    
-   **basis** (_str__,_ _default=''_) – Flex basis of the widget
    
-   **grow** (_str__,_ _default=''_) – Flex grow of the widget
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked with the new value whenever the selection changes
    

Examples

```
from fds.fpe.widgets import Sector
sector1 = Sector(value='Technology', description='Select Sector', direction="vertical", disabled=True)
display(sector1)

# With custom layout
from fds.fpe.widgets import Layout
sector2 = Sector(
    value='Technology',
    layout=Layout(width='400px', padding='10px')
)
display(sector2)
```

## Country[#](https://fpe.factset.com/docs/widgets.html#country "Link to this heading")

_class_ fds.fpe.widgets.Country(_value\='US'_, _direction\='horizontal'_, _m\_data\='Country'_, _layout\=None_, _description\='Country'_, _disabled\=False_, _placeholder\=''_, _clearable\=True_, _show\_label\=True_, _separator\_after\=''_, _open\_on\_focus\=False_, _ensure\_option\=False_, _on\_change\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Country "Link to this definition")

Country selection widget for country codes and names.

Parameters:

-   **value** (_str__,_ _default='US'_) – Selected country code (e.g., ‘AF’, ‘US’, ‘GB’). Can use code or name; names are automatically resolved to codes.
    
-   **description** (_str__,_ _default='Country'_) – Label text displayed with the widget
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text shown when no value is selected
    
-   **clearable** (_bool__,_ _default=True_) – Whether the selected value can be cleared
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to show the label
    
-   **separator\_after** (_str__,_ _default=''_) – Value of the option after which a visual separator is inserted
    
-   **open\_on\_focus** (_bool__,_ _default=False_) – Whether the dropdown opens when the input receives focus
    
-   **ensure\_option** (_bool__,_ _default=False_) – When True, only values present in options can be submitted (no free-form input)
    
-   **m\_data** (_str__,_ _default='Country'_) – Metadata identifier
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked with the new value when selection changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    

Examples

```
from fds.fpe.widgets import Country
country1 = Country(description='Country', direction="vertical")
display(country1)

# With custom layout
from fds.fpe.widgets import Layout
country2 = Country(
    value='US',
    layout=Layout(width='400px', padding='10px')
)
display(country2)
```

## ReturnType[#](https://fpe.factset.com/docs/widgets.html#returntype "Link to this heading")

_class_ fds.fpe.widgets.ReturnType(_value\='returns'_, _direction\='horizontal'_, _m\_data\='Return Type'_, _layout\=None_, _description\='Return Type'_, _disabled\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.ReturnType "Link to this definition")

Dropdown widget for selecting return calculation type.

Parameters:

-   **value** (_str__,_ _default='returns'_) – Selected return type code (e.g., ‘returns’, ‘price’). Can use code or name.
    
-   **description** (_str__,_ _default='Return Type'_) – Label text displayed with the widget
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **m\_data** (_str__,_ _default='Return Type'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import ReturnType
return_type1 = ReturnType(
    direction="vertical",
    value='returns',
    description='Return Type',
)
display(return_type1)

# With custom layout
from fds.fpe.widgets import Layout
return_type2 = ReturnType(
    value='returns',
    layout=Layout(width='300px', padding='10px')
)
display(return_type2)
```

## ReturnSources[#](https://fpe.factset.com/docs/widgets.html#returnsources "Link to this heading")

_class_ fds.fpe.widgets.ReturnSources(_m\_data\='Return Sources'_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.ReturnSources "Link to this definition")

Widget for selecting return calculation sources.

Parameters:

-   **value** (_list__,_ _default=__\[__\]_) – List of selected return source identifiers
    
-   **m\_data** (_str__,_ _default='Return Sources'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import ReturnSources
return_sources1 = ReturnSources(description='Return Calculation Sources')
display(return_sources1)
```

## FPOStrategyManagerWidget[#](https://fpe.factset.com/docs/widgets.html#fpostrategymanagerwidget "Link to this heading")

_class_ fds.fpe.widgets.FPOStrategyManagerWidget(_m\_data\='Fpo'_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.FPOStrategyManagerWidget "Link to this definition")

The FPOStrategyManagerWidget is an interactive widget for selecting, configuring, launching, and analyzing Factset Portfolio Optimization strategies, providing a seamless experience connecting inputs, results, and data grids.

Use Case

Use FPOStrategyManagerWidget to run stress tests, optimization, or simulation strategies on portfolios; expose custom parameters, retrieve and visualize output (as a DataGrid), and integrate actionable results in risk dashboards.

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed with the widget
    
-   **m\_data** (_str__,_ _default='Fpo'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import FPOStrategyManagerWidget
fpo1 = FPOStrategyManagerWidget(description='Portfolio Optimization Strategy')
display(fpo1)
```

## RiskModel[#](https://fpe.factset.com/docs/widgets.html#riskmodel "Link to this heading")

_class_ fds.fpe.widgets.RiskModel(_description\='Risk Model'_, _direction\='horizontal'_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.RiskModel "Link to this definition")

The RiskModel widget is a specialized input control for selecting or entering risk model identifiers, supporting custom layout, value monitoring, and callback functions for interactive applications.

Use Case

Use RiskModel to let users specify financial risk models in forms, dashboards, or analytics tools—with real-time value updates, change handling, and flexible layout/label options.

Parameters:

-   **value** (_str__,_ _default=''_) – Selected risk model ID
    
-   **description** (_str__,_ _default=''_) – Label text displayed with the widget
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes (receives the new risk model ID)
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    

Examples

```
from fds.fpe.widgets import RiskModel
def handle_change(value):
    print(f"Risk model changed to: {value}")
risk_model1 = RiskModel(
    description='Risk Model',
    on_change=handle_change
)
display(risk_model1)

# With custom layout
from fds.fpe.widgets import Layout
risk_model2 = RiskModel(
    layout=Layout(width='500px', padding='10px')
)
display(risk_model2)
```

## FormulaLookup[#](https://fpe.factset.com/docs/widgets.html#formulalookup "Link to this heading")

_class_ fds.fpe.widgets.FormulaLookup(_value\={'formulas': \[\], 'type': 'screening'}_, _description\='Formula'_, _direction\='horizontal'_, _m\_data\='Formula Lookup'_, _placeholder\=''_, _on\_change\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.FormulaLookup "Link to this definition")

Formula Lookup widget helps the clients in fetching formulas.

Use Case

-   Helps in fetching the Screening and FQL formulas.
    
-   Supports Identifier Lookup which helps in selecting the formula.
    
-   Allows creating and saving Custom Formulas.
    
-   Selecting the relevant database sources for the creation of the formulas.
    
-   Allows clearing and updating content.
    

Parameters:

-   **value** (_dict__,_ _default={'type': 'screening'__,_ _'formulas':_ _\[__\]__}_) – Formula value with ‘type’ and ‘formulas’ keys.
    
-   **description** (_str__,_ _default='Formula'_) – Label text displayed with the widget.
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control.
    
-   **m\_data** (_str__,_ _default='Formula Lookup'_) – Metadata identifier.
    
-   **placeholder** (_str__,_ _optional_) – Placeholder text shown in the textbox when no value is selected. Defaults to `'Enter Formula...'` when empty.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked with the new value when selection changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to `Layout(width='20rem')`.
    

Examples

```
from fds.fpe.widgets import FormulaLookup
widget = FormulaLookup(description='Stock Formula')
display(widget)
```

## Accordion[#](https://fpe.factset.com/docs/widgets.html#accordion "Link to this heading")

_class_ fds.fpe.widgets.Accordion(_children\=None_, _titles\=None_, _selected\_index\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Accordion "Link to this definition")

The Accordion widget organizes content into collapsible sections, allowing users to expand and collapse individual panels within the FactSet Programmatic Environment.

Parameters:

-   **children** (_list_ _of_ _DOMWidget__,_ _default=__\[__\]_) – Child widgets to display in accordion sections.
    
-   **titles** (_list_ _of_ _str__,_ _default=__\[__\]_) – Section titles for each child widget.
    
-   **selected\_index** (_int_ _or_ _None__,_ _default=None_) – Index of currently expanded section. Use None for all sections collapsed.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’100%’).
    

Examples

```
from fds.fpe.widgets import Accordion, Button, Text
accordion = Accordion(
    children=[Button(description='Click'), Text(value='Enter')],
    titles=['Button', 'Input'],
    selected_index=0
)
display(accordion)
```

## Tab[#](https://fpe.factset.com/docs/widgets.html#tab "Link to this heading")

_class_ fds.fpe.widgets.Tab(_children\=None_, _titles\=None_, _selected\_index\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Tab "Link to this definition")

Tab widget for organizing content into tabbed sections.

Displays multiple child widgets in tab panels with support for single selection. Uses Fusion UI components for modern appearance with FPE Layout styling support.

Two-way binding ensures that all input widgets (Textboxes, Checkboxes, Buttons) nested within different tabs retain their values and continue to execute their logic even when the user navigates to a different tab.

Parameters:

-   **children** (_list_ _of_ _DOMWidget__,_ _optional__,_ _default=__\[__\]_) – Child widgets to display in tab panels.
    
-   **titles** (_list_ _of_ _str__,_ _optional__,_ _default=__\[__\]_) – Tab titles for each child widget.
    
-   **selected\_index** (_int_ _or_ _None__,_ _optional__,_ _default=0_) – Index of currently selected tab. Use None for no tab selected.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’100%’).
    

Examples

```
from fds.fpe.widgets import Tab, Button, Text
tab = Tab(
    children=[Button(description='Click'), Text(value='Enter')],
    titles=['Button', 'Input'],
    selected_index=0
)
display(tab)
```

## Dropdown[#](https://fpe.factset.com/docs/widgets.html#dropdown "Link to this heading")

_class_ fds.fpe.widgets.Dropdown(_description\=''_, _options\=\[\]_, _value\=''_, _m\_data\='Dropdown'_, _placeholder\=''_, _direction\='horizontal'_, _required\=False_, _show\_label\=True_, _max\_width\='100%'_, _dropdown\_width\=''_, _basis\=''_, _grow\=''_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Dropdown "Link to this definition")

The Dropdown widget presents a single-select drop-down menu, allowing users to choose one item from a list of labeled options. Users can add values in the dropdown that they chose from. Options can be provided as a list, label-value pairs, or a dictionary, supporting flexible setup and custom labeling.

Use Case

Use the Dropdown to let users select a category, parameter, or filter—such as choosing a product, color, asset type, or region—triggering updates to your app or analysis based on their selection.

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed with the dropdown
    
-   **options** (_list_ _or_ _dict__,_ _default=__\[__\]_) – Options in formats: \[‘Option 1’, ‘Option 2’\] or \[(‘Label 1’, ‘val1’), (‘Label 2’, ‘val2’)\] or \[{‘value’: ‘val1’, ‘label’: ‘Label 1’}\] or {‘Label 1’: ‘val1’, ‘Label 2’: ‘val2’}
    
-   **value** (_str__,_ _default=''_) – Selected value (can use label or value)
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text when empty
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **required** (_bool__,_ _default=False_) – Whether a selection is required
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label
    
-   **basis** (_str__,_ _default=''_) – CSS flex-basis value for the widget
    
-   **grow** (_str__,_ _default=''_) – CSS flex-grow value for the widget
    
-   **max\_width** (_str__,_ _default='100%'_) – Maximum widget width
    
-   **dropdown\_width** (_str__,_ _default=''_) – Width of the dropdown menu
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when selection changes
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’300px’).
    

Examples

```
from fds.fpe.widgets import Dropdown
# Simple dropdown with change handler
def on_select(value):
    print(f"Selected: {value}")
dropdown0 = Dropdown(
    description="Choose:",
    max_width="50%",
    options=['Red', 'Green', 'Blue'],
    on_change=on_select
)
display(dropdown0)
# Dropdown with label-value pairs and placeholder
dropdown1 = Dropdown(
    description="Product:",
    options=[('Laptop - $999', 'laptop'), ('Phone - $699', 'phone')],
    placeholder="Select a product",
    value='laptop'
)
display(dropdown1)
# Required dropdown with custom layout
from fds.fpe.widgets import Layout
dropdown2 = Dropdown(
    options=['Q1', 'Q2', 'Q3', 'Q4'],
    required=True,
    placeholder="Select quarter",
    layout=Layout(width='400px', padding='10px')
)
display(dropdown2)
```

## RadioButtons[#](https://fpe.factset.com/docs/widgets.html#radiobuttons "Link to this heading")

_class_ fds.fpe.widgets.RadioButtons(_description\=''_, _options\=\[\]_, _value\=''_, _m\_data\='Radio Button'_, _direction\='horizontal'_, _buttons\_direction\='horizontal'_, _align\='left'_, _show\_label\=True_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.RadioButtons "Link to this definition")

The RadioButtons widget presents a group of mutually exclusive options, allowing only one selection at a time and enabling users to trigger context-aware actions based on their choice. Users can add their own values.

Use Case

Configure parameters, display detailed information, or guide user workflow with explicit choices such as “Standard” vs “Custom” update frequencies, each with descriptive details.

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed above the radio button group
    
-   **options** (_list_ _or_ _dict__,_ _default=__\[__\]_) – Options in formats: \[‘Option 1’, ‘Option 2’\] or \[(‘Label 1’, ‘val1’), (‘Label 2’, ‘val2’)\] or \[{‘value’: ‘val1’, ‘label’: ‘Label 1’}\] or {‘Label 1’: ‘val1’, ‘Label 2’: ‘val2’}
    
-   **value** (_str__,_ _default=''_) – Selected value (can use label or value)
    
-   **direction** (_str__,_ _default='horizontal'_) – Label position relative to the radio group: ‘horizontal’ (label left) or ‘vertical’ (label above).
    
-   **buttons\_direction** (_str__,_ _default='horizontal'_) – Orientation of the radio buttons within the group: ‘horizontal’ (side-by-side) or ‘vertical’ (stacked).
    
-   **align** (_str__,_ _default='left'_) – Alignment: ‘left’ or ‘right’
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **m\_data** (_str__,_ _default='Radio Button'_) – Metadata identifier
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when selection changes
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import RadioButtons
# Simple radio button with change handler
def on_select(value):
    print(f"Selected: {value}")
radio1 = RadioButtons(
    description="Choose size:",
    options=['Small', 'Medium', 'Large'],
    on_change=on_select
)
display(radio1)
# Horizontal layout with value-label pairs
radio2 = RadioButtons(
    description="Priority:", m_data="XXX",
    options=[('Low', 'low'), ('High', 'high')],
    direction='horizontal',
    value='low',
    align='left'
)
display(radio2)
# With custom layout
from fds.fpe.widgets import Layout
radio3 = RadioButtons(
    description="",
    options=['Credit', 'Debit'],
    layout=Layout(width='400px', padding='10px')
)
display(radio3)
```

## Text[#](https://fpe.factset.com/docs/widgets.html#text "Link to this heading")

_class_ fds.fpe.widgets.Text(_description\=''_, _value\=''_, _m\_data\='Text'_, _direction\='horizontal'_, _clearable\=True_, _placeholder\=''_, _readonly\=False_, _required\=False_, _type\='text'_, _basis\=''_, _grow\=''_, _max\_width\='100%'_, _show\_label\=True_, _show\_clear\_on\_blur\=False_, _commit\_on\_blur\=True_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Text "Link to this definition")

The Text widget provides a single-line text input field, supporting change events, validation, and custom behaviors for live user input.

Use Case

Use the Text widget to let users enter custom formulas, IDs, names, or any free-form string, and validate or react dynamically as they type—for example, ensuring proper FactSet formula syntax before running a calculation.

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed with the input
    
-   **value** (_str__,_ _default=''_) – Current text content
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text shown when empty
    
-   **type** (_str__,_ _default='text'_) – Input type: ‘text’ or ‘password’
    
-   **direction** (_str__,_ _default='horizontal'_) – Layout direction: ‘vertical’, ‘horizontal’, or ‘responsive’
    
-   **clearable** (_bool__,_ _default=True_) – Show clear button
    
-   **readonly** (_bool__,_ _default=False_) – Read-only mode
    
-   **required** (_bool__,_ _default=False_) – Required field indicator
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label
    
-   **basis** (_str__,_ _default=''_) – CSS flex-basis value for the widget
    
-   **grow** (_str__,_ _default=''_) – CSS flex-grow value for the widget
    
-   **max\_width** (_str__,_ _default='100%'_) – Maximum widget width
    
-   **show\_clear\_on\_blur** (_bool__,_ _default=False_) – Whether to show the clear button when the input loses focus
    
-   **commit\_on\_blur** (_bool__,_ _default=True_) – Trigger on\_change only on blur vs every keystroke
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’300px’).
    

Examples

```
from fds.fpe.widgets import Text
# Simple text input with change handler
def handle_change(value):
    print(f"Text: {value}")
textbox1 = Text(description="Name:", on_change=handle_change, show_clear_on_blur=False)
display(textbox1)
# Text input with all common options
textbox2 = Text(
    description="Email:",
    value="",
    placeholder="Enter your email",
    direction="horizontal",
    required=True,
    clearable=True,
    show_label=True,
    disabled=False
)
display(textbox2)
# With custom layout
from fds.fpe.widgets import Layout
textbox3 = Text(
    description="Name:",
    layout=Layout(width='500px', padding='10px')
)
display(textbox3)
```

## Checkbox[#](https://fpe.factset.com/docs/widgets.html#checkbox "Link to this heading")

_class_ fds.fpe.widgets.Checkbox(_description\=''_, _value\=False_, _m\_data\='Checkbox'_, _indent\=True_, _tooltip\=''_, _indeterminate\=False_, _align\='left'_, _filled\=False_, _stretched\=False_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Checkbox "Link to this definition")

The Checkbox widget renders a single boolean toggle as a checkbox that can be checked or unchecked, with support for labels, callbacks, tooltips, disable state, and optional indeterminate state. Users can add their own values.

Use Case

Use the Checkbox to allow users to enable or disable a feature, make yes/no selections, accept terms, or select/deselect items, with the ability to react to user clicks (e.g., toggle a mode, submit consent, or select all contents).

Parameters:

-   **value** (_bool__,_ _default=False_) – Whether the checkbox is checked.
    
-   **description** (_str__,_ _default=''_) – Label displayed next to the checkbox.
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled.
    
-   **indent** (_bool__,_ _default=True_) – Indent the checkbox to align it with labelled widgets.
    
-   **tooltip** (_str__,_ _default=''_) – Tooltip shown on hover when `description` is empty. If `description` is non-empty the tooltip is suppressed.
    
-   **indeterminate** (_bool__,_ _default=False_) – Indeterminate (mixed) state of the checkbox.
    
-   **align** (_str__,_ _default='left'_) – Position of the checkbox relative to its label: `'left'` or `'right'`.
    
-   **filled** (_bool__,_ _default=False_) – Use a filled style for the checked indicator.
    
-   **stretched** (_bool__,_ _default=False_) – Whether the checkbox stretches to fill its container.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when `value` changes; receives the new `bool`.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import Checkbox
# Basic usage
cb1 = Checkbox(description="Enable feature", value=False)
display(cb1)
# With change handler
def on_change(val):
    print(f"Checked: {val}")
cb2 = Checkbox(description="Dark mode", value=True, on_change=on_change, show_clear_on_blur=True)
display(cb2)
# Indeterminate state
cb3 = Checkbox(description="Select all", indeterminate=True)
display(cb3)
# Right-aligned label, filled style
cb4 = Checkbox(
    description="Accept terms",
    align='right',
    filled=True,
    indent=False,
)
display(cb4)
# With custom layout
from fds.fpe.widgets import Layout
cb5 = Checkbox(
    description="Enable feature",
    layout=Layout(width='300px', padding='10px')
)
display(cb5)
```

## CheckboxList[#](https://fpe.factset.com/docs/widgets.html#checkboxlist "Link to this heading")

_class_ fds.fpe.widgets.CheckboxList(_description\=''_, _options\=\[\]_, _value\=\[\]_, _m\_data\='CheckboxList'_, _align\='left'_, _direction\='vertical'_, _show\_label\=True_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.CheckboxList "Link to this definition")

The CheckboxList widget presents a group of checkboxes for multi-selection, supporting custom labeling, horizontal/vertical layout, disabled states, and change detection for real-time interaction. Users can add their own values.

Use Case

Use CheckboxList to let users select multiple categories or options (like universe types, asset classes, or features) simultaneously, reflecting their choices in the app or analysis—such as filtering investment universes or configuring preferences.

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed above the checkbox group
    
-   **options** (_list_ _or_ _dict__,_ _default=__\[__\]_) – Options in formats: \[‘Option 1’, ‘Option 2’\] or \[(‘Label 1’, ‘id1’), (‘Label 2’, ‘id2’, True)\] or \[{‘id’: ‘id1’, ‘label’: ‘Label 1’, ‘checked’: True}\] or {‘id1’: ‘Label 1’, ‘id2’: ‘Label 2’}
    
-   **value** (_list_ _or_ _str__,_ _default=__\[__\]_) – Selected values as list of IDs or labels. Can be \[‘id1’, ‘id2’\], \[‘Label 1’\], or single value ‘id1’
    
-   **direction** (_str__,_ _default='vertical'_) – Layout direction: ‘horizontal’ or ‘vertical’
    
-   **align** (_str__,_ _default='left'_) – Alignment: ‘left’ or ‘right’
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **m\_data** (_str__,_ _default='CheckboxList'_) – Metadata identifier
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when selection changes
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import CheckboxList
# Simple checkbox list with change handler
def on_change(value):
    print(f"Selected: {value}")
checkbox_list1 = CheckboxList(
    description="Select features:",
    options=['WiFi', 'Bluetooth', 'GPS'],
    value=['WiFi'],
    on_change=on_change
)
display(checkbox_list1)
# Horizontal layout with pre-checked options
checkbox_list2 = CheckboxList(
    description="Preferences:",
    options=[('Email', 'email', True), ('SMS', 'sms', False)],
    direction='horizontal',
    align='left',
    show_label=True
)
display(checkbox_list2)
# With custom layout
from fds.fpe.widgets import Layout
checkbox_list3 = CheckboxList(
    description="Options:",
    options=['A', 'B', 'C'],
    layout=Layout(width='500px', padding='10px')
)
display(checkbox_list3)
```

## ToggleButton[#](https://fpe.factset.com/docs/widgets.html#togglebutton "Link to this heading")

_class_ fds.fpe.widgets.ToggleButton(_description\=''_, _value\=False_, _m\_data\='ToggleButton'_, _max\_width\='100%'_, _grow\=''_, _message\=''_, _error\=''_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.ToggleButton "Link to this definition")

Toggle button widget.

Provides a toggle switch using the FusionToggle component.

Parameters:

-   **value** (_bool__,_ _default=False_) – Whether the toggle is on/off.
    
-   **description** (_str__,_ _default=''_) – Label displayed next to the toggle.
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled.
    
-   **max\_width** (_str__,_ _default='100%'_) – Maximum widget width.
    
-   **grow** (_str__,_ _default=''_) – CSS flex-grow value for the widget.
    
-   **message** (_str__,_ _default=''_) – Helper message displayed below the toggle.
    
-   **error** (_str__,_ _default=''_) – Error message displayed below the toggle.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes; receives the new bool.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import ToggleButton
# Basic usage
toggle0 = ToggleButton(description="Enable notifications", value=False)
display(toggle0)
# With change handler
def on_change(val):
    print(f"Toggle is now: {'ON' if val else 'OFF'}")
toggle1 = ToggleButton(
    description="Dark mode",
    value=True,
    on_change=on_change
)
display(toggle1)
# With helper message
toggle2 = ToggleButton(
    description="Feature flag",
    message="This will enable the new feature",
    max_width='300px'
)
display(toggle2)
# With error message
toggle3 = ToggleButton(
    description="Required setting",
    error="This setting is required",
    value=False
)
display(toggle3)
```

## Button[#](https://fpe.factset.com/docs/widgets.html#button "Link to this heading")

_class_ fds.fpe.widgets.Button(_description\=''_, _on\_click\=None_, _m\_data\='Button'_, _debug\=False_, _disabled\=False_, _type\='primary'_, _icon\=''_, _emphasized\=False_, _color\=''_, _pressed\=False_, _is\_active\=False_, _tooltip\=''_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Button "Link to this definition")

The Button widget displays a clickable button that can include labels, icons, different styles (primary/secondary/icon), customizable colors, and event handlers for interactive actions. Users can add their own values.

Use Case

Use Button to let users trigger core actions—download files, save selections, clear forms, or activate modes—with customizable look and behavior, updating the app live as users interact.

Parameters:

-   **description** (_str__,_ _default=''_) – Text label displayed on the button
    
-   **on\_click** (_callable__,_ _optional_) – Callback function invoked when button is clicked. Can also be set after creation: `button.on_click = my_handler`
    
-   **type** (_str__,_ _default='primary'_) – Button style: ‘primary’, ‘secondary’, ‘tertiary’, ‘icon’, ‘tag’, ‘unstyled’, ‘outlineTagActive’, or ‘outlineTagInactive’
    
-   **icon** (_str__,_ _default=''_) – Icon identifier to display
    
-   **emphasized** (_bool__,_ _default=False_) – Whether to apply emphasized styling
    
-   **color** (_str__,_ _default=''_) – Custom color for the button
    
-   **pressed** (_bool__,_ _default=False_) – Whether the button is in a pressed state
    
-   **is\_active** (_bool__,_ _default=False_) – Whether the button is in an active state
    
-   **disabled** (_bool__,_ _default=False_) – Whether the button is disabled
    
-   **m\_data** (_str__,_ _default='Button'_) – Metadata identifier
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling
    
-   **tooltip** (_str__,_ _default=''_) – Tooltip text displayed on hover
    

Examples

```
from fds.fpe.widgets import Button
# Simple button with click handler
def handle_click():
    print("Button clicked!")
button0 = Button(description="Click Me", on_click=handle_click)
display(button0)
# Set click handler after creation
button1 = Button(description="Click Me")
display(button1)
button1.on_click = handle_click
# Primary emphasized button
button2 = Button(
    description="Save",
    type="primary",
    emphasized=True,
    disabled=False,
    is_active=False,
    pressed=True
)
display(button2)
# Icon button (type="icon" with icon prop)
button3 = Button(
    description="Edit",
    type="icon",
    icon="IconEdit"
)
display(button3)
```

## Layout[#](https://fpe.factset.com/docs/widgets.html#layout "Link to this heading")

_class_ fds.fpe.widgets.Layout(_\*\*kwargs: Any_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Layout "Link to this definition")

The Layout widget provides declarative control over widget visual appearance using CSS properties including flexbox, grid, dimensions, and spacing. Compatible with ipywidgets.Layout.

Use Case

Use Layout to create responsive, visually organized UIs by adjusting the size, spacing, and arrangement of widgets, enabling dynamic updates, grid layouts, hiding/showing elements, and precise alignment in containers.

Layout Support for All Widgets

All generic and custom widgets support the layout parameter, allowing CSS properties to be applied consistently across widgets. This aligns fds\_widgets with the standard ipywidgets layout system.

|Properties|Parameters|
|---|---|
|Sizing|width, height, min\_width, max\_width, min\_height, max\_height|
|Spacing|padding, margin|
|Border|border, border\_top, border\_bottom, border\_left, border\_right|
|Visibility|display, visibility|
|Overflow|overflow, overflow\_x, overflow\_y|
|Flexbox|flex, flex\_flow, justify\_content, align\_items, align\_content, align\_self, order|
|Grid|grid\_template\_columns, grid\_template\_rows, grid\_template\_areas, grid\_area, grid\_gap|

Parameters:

-   **width** (_str__,_ _optional_) – Widget width (e.g., ‘100px’, ‘50%’, ‘10rem’).
    
-   **height** (_str__,_ _optional_) – Widget height (e.g., ‘200px’, ‘100vh’).
    
-   **min\_width** (_str__,_ _optional_) – Minimum width constraint.
    
-   **max\_width** (_str__,_ _optional_) – Maximum width constraint.
    
-   **min\_height** (_str__,_ _optional_) – Minimum height constraint.
    
-   **max\_height** (_str__,_ _optional_) – Maximum height constraint.
    
-   **display** (_str__,_ _optional_) – CSS display property (e.g., ‘flex’, ‘grid’, ‘block’, ‘none’).
    
-   **visibility** (_str__,_ _optional_) – CSS visibility property (‘visible’, ‘hidden’).
    
-   **overflow** (_str__,_ _optional_) – Overflow behaviour on both axes (‘auto’, ‘hidden’, ‘scroll’, ‘visible’).
    
-   **overflow\_x** (_str__,_ _optional_) – Overflow behaviour on the x-axis (‘auto’, ‘hidden’, ‘scroll’, ‘visible’).
    
-   **overflow\_y** (_str__,_ _optional_) – Overflow behaviour on the y-axis (‘auto’, ‘hidden’, ‘scroll’, ‘visible’).
    
-   **padding** (_str__,_ _optional_) – Inner spacing (e.g., ‘10px’, ‘5px 10px’).
    
-   **margin** (_str__,_ _optional_) – Outer spacing (e.g., ‘10px’, ‘auto’).
    
-   **border** (_str__,_ _optional_) – Shorthand — sets all four sides (e.g., ‘1px solid #ccc’).
    
-   **border\_top** (_str__,_ _optional_) – Top border style.
    
-   **border\_right** (_str__,_ _optional_) – Right border style.
    
-   **border\_bottom** (_str__,_ _optional_) – Bottom border style.
    
-   **border\_left** (_str__,_ _optional_) – Left border style.
    
-   **flex** (_str__,_ _optional_) – Flex shorthand (e.g., ‘1’, ‘0 0 auto’).
    
-   **flex\_flow** (_str__,_ _optional_) – Flex direction and wrap (e.g., ‘row’, ‘column’, ‘row wrap’).
    
-   **align\_items** (_str__,_ _optional_) – Cross-axis alignment of flex/grid children (e.g., ‘center’, ‘stretch’).
    
-   **align\_content** (_str__,_ _optional_) – Multi-line cross-axis alignment (e.g., ‘space-between’).
    
-   **align\_self** (_str__,_ _optional_) – Cross-axis alignment for this item specifically.
    
-   **justify\_content** (_str__,_ _optional_) – Main-axis alignment of flex/grid children (e.g., ‘center’, ‘space-between’).
    
-   **justify\_items** (_str__,_ _optional_) – Inline-axis alignment of grid items.
    
-   **order** (_str__,_ _optional_) – Flex/grid item order (e.g., ‘1’, ‘-1’).
    
-   **grid\_template\_columns** (_str__,_ _optional_) – Grid column track sizes (e.g., ‘1fr 1fr 1fr’, ‘200px auto’).
    
-   **grid\_template\_rows** (_str__,_ _optional_) – Grid row track sizes (e.g., ‘auto 1fr’).
    
-   **grid\_template\_areas** (_str__,_ _optional_) – Named grid areas (e.g., ‘“header header” “sidebar main”’).
    
-   **grid\_area** (_str__,_ _optional_) – Assigns this item to a named grid area.
    
-   **grid\_row** (_str__,_ _optional_) – Row placement shorthand (e.g., ‘1 / 3’).
    
-   **grid\_column** (_str__,_ _optional_) – Column placement shorthand (e.g., ‘1 / -1’).
    
-   **grid\_gap** (_str__,_ _optional_) – Gap between grid/flex tracks (e.g., ‘10px’, ‘10px 20px’).
    
-   **grid\_auto\_columns** (_str__,_ _optional_) – Size of implicitly created column tracks.
    
-   **grid\_auto\_rows** (_str__,_ _optional_) – Size of implicitly created row tracks.
    
-   **grid\_auto\_flow** (_str__,_ _optional_) – Auto-placement algorithm (‘row’, ‘column’, ‘dense’).
    
-   **position** (_str__,_ _optional_) – CSS position property (‘static’, ‘relative’, ‘absolute’, ‘fixed’, ‘sticky’).
    
-   **top** (_str__,_ _optional_) – Top offset for positioned elements.
    
-   **right** (_str__,_ _optional_) – Right offset for positioned elements.
    
-   **bottom** (_str__,_ _optional_) – Bottom offset for positioned elements.
    
-   **left** (_str__,_ _optional_) – Left offset for positioned elements.
    
-   **object\_fit** (_str__,_ _optional_) – How replaced content is sized (‘contain’, ‘cover’, ‘fill’, ‘none’).
    
-   **object\_position** (_str__,_ _optional_) – Alignment of replaced content (e.g., ‘center’, ‘top left’).
    

Examples

```
# Dashboard Layout
from fds.fpe.widgets import (Layout, VBox, HBox, Button, Text)

# Header section
header_text = Button(description="Dashboard Header")
header = HBox(
    children=[header_text],
    layout=Layout(
        width='800px',
        padding='15px',
        border='2px solid #2196F3',
        justify_content='center'
    )
)

# Left sidebar
nav1 = Button(description="Navigation 1")
nav2 = Button(description="Navigation 2")
nav3 = Button(description="Navigation 3")

sidebar = VBox(
    children=[nav1, nav2, nav3],
    layout=Layout(
        width='200px',
        padding='10px',
        border='1px solid #ddd',
        grid_gap='5px',
        height='100%'
    )
)

# Main content area
content_field = Text(description="Content", value="Main content")
content_btn = Button(description="Action Button", layout=Layout(align_self='flex-end'))

main_content = VBox(
    children=[content_field, content_btn],
    layout=Layout(
        flex='1',
        padding='10px',
        border='1px solid #ddd',
        margin='0px 0px 0px 10px',
        height='100%',
        justify_content='space-between'
    )
)

# Content row (sidebar + main content)
content_row = HBox(
    children=[sidebar, main_content],
    layout=Layout(
        width='800px',
        height='300px',
        align_items='stretch',
        margin='10px 0px 0px 0px'
    )
)

# Complete dashboard
dashboard = VBox(
    children=[header, content_row],
    layout=Layout(padding='10px')
)

display(dashboard)
```

```
# Overflow axes control
from fds.fpe.widgets import Layout, Box, Button

items = [Button(description=f"Item {i}") for i in range(20)]

scrollable = Box(
    children=items,
    layout=Layout(
        width='300px',
        height='200px',
        overflow_x='hidden',
        overflow_y='auto',
    )
)

display(scrollable)
```

## Box[#](https://fpe.factset.com/docs/widgets.html#box "Link to this heading")

_class_ fds.fpe.widgets.Box(_children\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Box "Link to this definition")

Generic Box container widget for arranging child widgets.

The Box widget is a flexible container that can hold multiple child widgets. Layout is controlled via a `Layout` object; by default it uses flexbox display.

Parameters:

-   **children** (_list__,_ _optional_) – List of widgets to place inside the container
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control the styling of the container
    

Examples

```
# Login Page using Box widget
from fds.fpe.widgets import (Layout, VBox, HBox, Button, Text, HTML, Box)

# The 'Card' containing form fields
login_card = Box(
    children=[
        HTML("<h3 style='text-align:center;'>Login</h3>"),
        Text(description="Username:"),
        Text(description="Password:"),
        Button(description="Sign In", layout=Layout(width='100%', margin='30px 0 0 0'))
    ],
    layout=Layout(
        display='flex',
        flex_flow='column',
        align_items='stretch',
        padding='10px',
        width='350px',
        border='1px solid #4A90E2',
        border_radius='8px'
    )
)

# Outer Box to center the card
centered_page = Box(
    children=[login_card],
    layout=Layout(
        display='flex',
        justify_content='center',
        align_items='center',
        height='400px',
        width='100%',
        background_color='#f0f2f5'
    )
)

centered_page
```

## VBox[#](https://fpe.factset.com/docs/widgets.html#vbox "Link to this heading")

_class_ fds.fpe.widgets.VBox(_children\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.VBox "Link to this definition")

The VBox widget arranges its child widgets in a vertical column, supporting alignment, spacing, and custom layout settings for an organized stack of controls. It inherits from Box and sets flex\_flow to ‘column’ by default.

Use Case

Use VBox to group form fields, buttons, or controls in a tidy vertical layout—ideal for input forms, lists, or step-wise interfaces with adjustable spacing or styling.

Parameters:

-   **children** (_list__,_ _optional_) – List of widgets to arrange vertically
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object for styling (flex\_flow=’column’ set automatically)
    

Examples

```
# Registration Page using VBox widget
from fds.fpe.widgets import (VBox, Button, Dropdown, Layout, Text, RadioButtons, CheckboxList)

# Form header
header_btn = Button(description="User Registration Form", layout=Layout(width='400px'))

header_section = VBox(
    children=[header_btn],
    layout=Layout(
        align_items='center',
        padding='10px',
        border='1px solid #2196F3',
        background_color='#E3F2FD'
    )
)

# Personal info section
name_input = Text(description="Full Name", value="")
email_input = Text(description="Email", value="")

personal_section = VBox(
    children=[name_input, email_input],
    layout=Layout(grid_gap='10px')
)

# Preferences section
country_dropdown = Dropdown(
    description="Country",
    options=['USA', 'UK', 'Canada', 'Australia', 'India']
)

gender_radio = RadioButtons(
    description="Gender",
    options=['Male', 'Female'],
    value='Male'
)

interests_checkbox = CheckboxList(
    description="Interests",
    options=['Technology', 'Sports', 'Music', 'Travel', 'Reading'],
    value=[]
)

preferences_section = VBox(
    children=[country_dropdown, gender_radio, interests_checkbox],
    layout=Layout(grid_gap='15px', padding='10px 0px')
)

# Action buttons
submit_btn = Button(description="Submit")
cancel_btn = Button(description="Cancel")
reset_btn = Button(description="Reset")

action_section = VBox(
    children=[submit_btn, cancel_btn, reset_btn],
    layout=Layout(
        flex_flow='row',
        justify_content='flex-end',
        padding='15px 0px 0px 0px',
        grid_gap='10px'
    )
)

# Complete form
complete_form = VBox(
    children=[header_section, personal_section, preferences_section, action_section],
    layout=Layout(
        width='600px',
        padding='20px',
        border='1px solid #ccc',
        margin='10px'
    )
)

display(complete_form)
```

## HBox[#](https://fpe.factset.com/docs/widgets.html#hbox "Link to this heading")

_class_ fds.fpe.widgets.HBox(_children\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.HBox "Link to this definition")

The HBox widget arranges child widgets in a horizontal row, supporting flexible alignment, spacing, and custom layout for neat, side-by-side placement. It inherits from Box and sets flex\_flow to ‘row’ by default.

Use Case

Use HBox to present action buttons or controls in a row—ideal for toolbars, navigation, or side-by-side form elements—with customizable spacing (justify/align), padding, and borders.

Parameters:

-   **children** (_list__,_ _optional_) – List of widgets to arrange horizontally
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object for styling (flex\_flow=’row’ set automatically)
    

Examples

```
# Horizontal Navigation using HBox widget
from fds.fpe.widgets import (HBox, Button, Layout)

# Top section - centered
top_section = HBox(
    children=[Button(description="Centered Content")],
    layout=Layout(
        width='600px',
        height='80px',
        border='1px solid #3F51B5',
        justify_content='center',
        align_items='center'
    )
)

# Middle section - space-between
middle_section = HBox(
    children=[
        Button(description="Left"),
        Button(description="Middle"),
        Button(description="Right")
    ],
    layout=Layout(
        width='600px',
        height='80px',
        border='1px solid #4CAF50',
        justify_content='space-between',
        align_items='center',
        padding='0px 20px'
    )
)

# Bottom section - flex-end
bottom_section = HBox(
    children=[
        Button(description="Aligned Right 1"),
        Button(description="Aligned Right 2")
    ],
    layout=Layout(
        width='600px',
        height='80px',
        border='1px solid #FF9800',
        justify_content='flex-end',
        align_items='center',
        padding='0px 20px',
        grid_gap='10px'
    )
)

display(top_section, middle_section, bottom_section)
```

## DatePicker[#](https://fpe.factset.com/docs/widgets.html#datepicker "Link to this heading")

_class_ fds.fpe.widgets.DatePicker(_description\=''_, _value\=None_, _m\_data\='DatePicker'_, _min\=None_, _max\=None_, _day\_month\_year\=False_, _year\_month\_day\=False_, _show\_relative\_dates\=False_, _today\_button\=True_, _direction\='horizontal'_, _show\_label\=True_, _today\=True_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.DatePicker "Link to this definition")

The DatePicker widget provides a user-friendly calendar interface for selecting dates, supporting programmatic control, formatting, min/max constraints, layout, callbacks, and accessibility options.

Use Case

Use DatePicker for entering or editing dates, validating ranges (e.g., start/end), displaying read-only dates, formatting to regional standards, or synchronizing date fields—ideal in forms, dashboards, scheduling, or any date-driven input scenario.

Parameters:

-   **value** (_datetime.date__,_ _default=None_) – Selected date value
    
-   **description** (_str__,_ _default=''_) – Label text displayed with the date picker
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **min** (_datetime.date__,_ _default=None_) – Minimum selectable date
    
-   **max** (_datetime.date__,_ _default=None_) – Maximum selectable date
    
-   **day\_month\_year** (_bool__,_ _default=True_) – When True, uses DD/MM/YYYY date format; defaults to MM/DD/YYYY
    
-   **year\_month\_day** (_bool__,_ _default=False_) – When True, uses YYYY/MM/DD date format
    
-   **today** (_bool__,_ _default=True_) – Whether to show today option
    
-   **today\_button** (_bool__,_ _default=True_) – Whether to show a button to auto-select the current date
    
-   **direction** (_str__,_ _default='horizontal'_) – Layout direction: ‘vertical’, ‘horizontal’, or ‘responsive’
    
-   **show\_label** (_bool__,_ _default=True_) – Whether the label is visible
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when the selected date changes (receives datetime.date)
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’300px’).
    

Examples

```
import datetime
from fds.fpe.widgets import DatePicker
def on_date_change(value):
    print(f"Date changed: {value}")
dp1 = DatePicker(
    description='Start Date',
    value=datetime.date(2024, 1, 15),
    min=datetime.date(2024, 1, 1),
    max=datetime.date(2024, 12, 31),
    today_button=True,
    on_change=on_date_change
)
display(dp1)
# With custom layout
from fds.fpe.widgets import Layout
dp2 = DatePicker(
    description='Start Date',
    layout=Layout(width='400px')
)
display(dp2)
```

## HTML[#](https://fpe.factset.com/docs/widgets.html#html "Link to this heading")

_class_ fds.fpe.widgets.HTML(_value\=''_, _description\=''_, _m\_data\='HTML'_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.HTML "Link to this definition")

HTML display widget that renders arbitrary HTML content.

Similar to ipywidgets.HTML but rendered using Vue’s v-html directive.

Parameters:

-   **value** (_str__,_ _default=''_) – HTML string to render
    
-   **description** (_str__,_ _default=''_) – Optional label displayed to the left of the HTML content
    
-   **m\_data** (_str__,_ _default='HTML'_) – Metadata identifier for the widget
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import HTML

# Simple HTML display
html1 = HTML(value='<h2>Hello <b>World</b></h2>')

# HTML with a label
html2 = HTML(
    value='<ul><li>Item 1</li><li>Item 2</li></ul>',
    description='My List'
)

# With custom layout
from fds.fpe.widgets import Layout
html3 = HTML(
    value='<p>Styled content</p>',
    layout=Layout(width='600px', border='1px solid #ccc', padding='10px')
)
display(html1, html2, html3)
```

## Output[#](https://fpe.factset.com/docs/widgets.html#output "Link to this heading")

_class_ fds.fpe.widgets.Output(_layout\=None_, _suppress\_exceptions\=True_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Output "Link to this definition")

Output widget enables users to capture and display dynamic content such as text, logs, and rich outputs (e.g., HTML, charts, and widget interactions) within a defined area. This provides better control over where and how outputs are rendered in applications.

Use Case

Supports plain text, HTML, images, and rich media outputs.

Capture print statements, logs, and error messages.

Allows clearing and updating content.

Can display outputs generated from other widgets and interactive components.

Supports the layout parameter for consistent styling and positioning.

Parameters:

-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties) or dict, optional) – Layout specification for the widget. A plain dict is converted to a Layout instance, e.g., layout={‘border’: ‘1px solid black’}.
    
-   **suppress\_exceptions** (_bool__,_ _default True_) – If True, exceptions raised inside the context are captured into outputs and suppressed. If False, exceptions propagate after being captured.
    

Examples

```
from fds.fpe.widgets import Output
out_manual = Output()
display(out_manual)
out_manual.append_stdout("Appended stdout line\n")
out_manual.append_stderr("Appended stderr warning\n")
```

## Combobox[#](https://fpe.factset.com/docs/widgets.html#combobox "Link to this heading")

_class_ fds.fpe.widgets.Combobox(_description\=''_, _options\=\[\]_, _value\=''_, _placeholder\=''_, _disabled\=False_, _clearable\=True_, _show\_label\=True_, _direction\='horizontal'_, _separator\_after\=''_, _ensure\_option\=False_, _open\_on\_focus\=False_, _m\_data\='Combobox'_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Combobox "Link to this definition")

Combobox widget allows users to select from a predefined list of options or enter custom values. It combines the functionality of a dropdown and a text input, enabling both guided selection and flexible user input.

Use Case

-   Supports selecting a single value from a dropdown list of options.
    
-   Allows users to type custom values when ensure\_option=False.
    
-   Dynamically filters options based on user input for faster selection.
    
-   Displays options in a scrollable list when expanded.
    
-   Restricts input to predefined options when ensure\_option=True.
    
-   Supports the layout parameter for consistent styling and positioning.
    

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed with the combobox
    
-   **options** (_list_ _or_ _dict__,_ _default=__\[__\]_) – Options in formats: \[‘Option 1’, ‘Option 2’\] or \[(‘Label 1’, ‘val1’), (‘Label 2’, ‘val2’)\] or \[{‘value’: ‘val1’, ‘label’: ‘Label 1’}\] or {‘Label 1’: ‘val1’, ‘Label 2’: ‘val2’}
    
-   **value** (_str__,_ _default=''_) – Selected value (can use label or value)
    
-   **placeholder** (_str__,_ _default=''_) – Placeholder text when empty
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled
    
-   **clearable** (_bool__,_ _default=True_) – Whether to show clear button
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control
    
-   **separator\_after** (_str__,_ _default=''_) – Value after which to insert a separator line
    
-   **ensure\_option** (_bool__,_ _default=False_) – When True, value must be one of the options; values not in the list are rejected. When False (default), any value is accepted.
    
-   **open\_on\_focus** (_bool__,_ _default=False_) – Open dropdown automatically when focused
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when selection changes
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’300px’).
    

Examples

```
from fds.fpe.widgets import Combobox
combobox = Combobox(
    description="Choose country:",
    options=['USA', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile'],
    show_label=True,
    direction="vertical",
    value="India",
    ensure_option=False,
)
display(combobox)

# With label-value pairs
product_combobox = Combobox(
    description="Product:",
    options=[
        ('Laptop - $999', 'laptop'),
        ('Desktop - $1299', 'desktop'),
        ('Tablet - $499', 'tablet'),
        ('Phone - $699', 'phone'),
        ('Monitor - $299', 'monitor'),
    ],
    placeholder="Search products...",
    value='laptop',
    width='300px',
)
display(product_combobox)

# With separator between option groups
settings_combobox = Combobox(
    description="Settings:",
    options=[
        ('General', 'general'),
        ('Privacy', 'privacy'),
        ('Security', 'security'),
        ('Logout', 'logout'),
        ('Delete Account', 'delete'),
    ],
    separator_after='security',
    width='250px',
)
display(settings_combobox)

# Disabled combobox
disabled_combobox = Combobox(
    description="Status (read-only):",
    options=['Active', 'Inactive', 'Pending'],
    value='Active',
    disabled=True,
)
display(disabled_combobox)
```

## Listbox[#](https://fpe.factset.com/docs/widgets.html#listbox "Link to this heading")

_class_ fds.fpe.widgets.Listbox(_description\=''_, _options\=\[\]_, _value\=None_, _selection\_mode\='single'_, _show\_filter\=False_, _filter\=''_, _draggable\=False_, _group\_selection\_mode\='selectAllChildren'_, _direction\='vertical'_, _show\_label\=True_, _show\_clear\=False_, _height\=400_, _disabled\=False_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Listbox "Link to this definition")

The Listbox widget allows users to select one or multiple items from a flat list or hierarchical tree within the FactSet Programmatic Environment, with support for filtering, drag-and-drop, and event observation.

Parameters:

-   **description** (_str__,_ _default=''_) – Label text displayed with the listbox.
    
-   **options** (_list__,_ _default=__\[__\]_) –
    
    Options in formats:
    
    -   Plain strings: `['Option 1', 'Option 2']`
        
    -   Tuples: `[('Label', 'value'), ...]`
        
    -   Dicts: `[{'value': 'v1', 'label': 'Label 1', 'children': [...]}]`
        
-   **value** (_any_ _or_ _list_ _or_ _None__,_ _default=None_) – Selected node value. Use a list for multiple selection mode.
    
-   **selection\_mode** (_{'single'__,_ _'multiple'}__,_ _default='single'_) – Whether to allow one or multiple selected nodes.
    
-   **show\_filter** (_bool__,_ _default=False_) – Whether to render a filter/search input above the listbox.
    
-   **filter** (_str__,_ _default=''_) – Current filter string (requires show\_filter=True to display input).
    
-   **draggable** (_bool__,_ _default=False_) – Whether nodes support drag-and-drop reordering.
    
-   **group\_selection\_mode** (_{'selectAllChildren'__,_ _'onlySelectGroup'}__,_ _default='selectAllChildren'_) – In multiple mode, controls whether clicking a parent selects its children.
    
-   **direction** (_{'vertical'__,_ _'horizontal'__,_ _'responsive'}__,_ _default='vertical'_) – Layout direction of label relative to listbox.
    
-   **show\_label** (_bool__,_ _default=True_) – Whether the description label is visible.
    
-   **height** (_int_ _or_ _str__,_ _default=400_) – Height of the listbox in pixels, or `'100%'` to fill parent.
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked with the new value when selection changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border). Defaults to Layout(width=’300px’).
    

Notes

Read-only traits updated by the frontend:

-   **last\_dblclick\_node** : the node most recently double-clicked.
    
-   **last\_expansion\_event** : the most recent tree node expansion/collapse event dict.
    
-   **last\_focused\_node** : the node that most recently received focus.
    
-   **last\_drop\_event** : the most recent drag-and-drop event dict (when draggable=True).
    

Examples

```
from fds.fpe.widgets import Listbox

# Simple list
w = Listbox(
    description='Select Country',
    options=['USA', 'Canada', 'Mexico'],
)
display(w)

# Multiple selection with tuples
w = Listbox(
    description='Select Countries',
    options=[('United States', 'USA'), ('Canada', 'CAN')],
    selection_mode='multiple',
    value=['USA'],
)
display(w)

# Tree nodes
w = Listbox(
    description='File Tree',
    options=[
        {'value': 'src', 'label': 'src', 'children': [
            {'value': 'index.ts', 'label': 'index.ts'},
        ]},
        {'value': 'tests', 'label': 'tests'},
    ],
)
display(w)
```

## GridspecLayout[#](https://fpe.factset.com/docs/widgets.html#gridspeclayout "Link to this heading")

_class_ fds.fpe.widgets.GridspecLayout(_n\_rows_, _n\_columns_, _layout\=None_, _grid\_gap\=None_, _width\=None_, _height\=None_, _justify\_content\=None_, _align\_items\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.GridspecLayout "Link to this definition")

Grid-based layout widget using an N-by-M coordinate system mapped to CSS Grid.

Provides a high-level interface for building structured grid layouts using Python’s slice notation. Ideal for financial dashboards where multiple components — charts, tables, inputs — must align precisely without nesting multiple VBox/HBox containers.

`n_rows`, `n_columns`, the slice-based `__setitem__`/`__getitem__` API, and internal grid-area tracking are all inherited from `ipywidgets.GridspecLayout`.

Parameters:

-   **n\_rows** (_int_) – Number of rows. Must be a positive integer.
    
-   **n\_columns** (_int_) – Number of columns. Must be a positive integer.
    
-   **layout** ([_Layout_](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Layout "fds.fpe.widgets.Layout")_,_ _optional_) – Container-level styling. `display` is forced to `'grid'`.
    
-   **grid\_gap** (_str__,_ _optional_) – Gap between cells (e.g. `'10px'`). Shorthand for `layout.grid_gap`.
    
-   **width** (_str__,_ _optional_) – Container width (e.g. `'100%'`). Shorthand for `layout.width`.
    
-   **height** (_str__,_ _optional_) – Container height (e.g. `'400px'`). Shorthand for `layout.height`.
    
-   **justify\_content** (_str__,_ _optional_) – CSS `justify-content` for the grid. Shorthand for `layout.justify_content`.
    
-   **align\_items** (_str__,_ _optional_) – CSS `align-items` for the grid. Shorthand for `layout.align_items`.
    

Examples

```
from fds.fpe.widgets import GridspecLayout, Button, Layout

grid = GridspecLayout(3, 3, height='300px')

grid[0, :]  = Button(description='Header')
grid[1:, 0] = Button(description='Sidebar')
grid[1:, 1:] = Button(description='Main content')

display(grid)
```

Slicing:

```
grid[0, 0]    = widget   # single cell
grid[0, 1:3]  = widget   # row 0, columns 1–2
grid[1:3, :]  = widget   # rows 1–2, all columns
grid[:, -1]   = widget   # all rows, last column
```

Retrieval:

```
widget = grid[0, 0]
```

## NumberInput[#](https://fpe.factset.com/docs/widgets.html#numberinput "Link to this heading")

_class_ fds.fpe.widgets.NumberInput(_value\=0_, _description\=''_, _direction\='horizontal'_, _disabled\=False_, _required\=False_, _min\=None_, _max\=None_, _step\=1_, _display\_spinner\=True_, _show\_label\=True_, _m\_data\='Number Input'_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.NumberInput "Link to this definition")

A numeric input widget with optional min, max, step, and spinner controls.

Parameters:

-   **value** (_int_ _or_ _float__,_ _default=0_) – Current numeric value. Integers are preserved as int; floats with a fractional part are preserved as float.
    
-   **description** (_str__,_ _default=''_) – Label text displayed with the input.
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to control.
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled.
    
-   **required** (_bool__,_ _default=False_) – Required field indicator.
    
-   **min** (_float_ _or_ _None__,_ _default=None_) – Minimum allowed value. No constraint when None.
    
-   **max** (_float_ _or_ _None__,_ _default=None_) – Maximum allowed value. No constraint when None.
    
-   **step** (_float__,_ _default=1_) – Increment/decrement amount for spinner buttons and arrow keys.
    
-   **display\_spinner** (_bool__,_ _default=True_) – Whether to show the increment/decrement spinner buttons.
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import NumberInput, Output

# Basic usage
num = NumberInput(description='Quantity:', value=10, min=0, max=100)
display(num)

# With step and change callback
out = Output()

def on_change(value):
    with out: print(f"Value changed to: {value}")

num2 = NumberInput(
    description='Step Size:',
    value=0.5,
    step=0.1,
    min=0.0,
    max=10.0,
    on_change=on_change,
)
display(num2, out)
```

## Slider[#](https://fpe.factset.com/docs/widgets.html#slider "Link to this heading")

_class_ fds.fpe.widgets.Slider(_value\=None_, _description\=''_, _min\=0_, _max\=100_, _step\=1_, _direction\='horizontal'_, _disabled\=False_, _range\=False_, _show\_label\=True_, _accessibility\_label\=None_, _histogram\=False_, _histogram\_data\=None_, _m\_data\='Slider'_, _on\_change\=None_, _layout\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/widgets.html#fds.fpe.widgets.Slider "Link to this definition")

A slider widget for selecting a numeric value or a range.

Parameters:

-   **value** (_int__,_ _float__, or_ _dict__,_ _default=0_) – Current value. Integers are preserved as int; floats with a fractional part are preserved as float. Use a dict with `'start'` and `'end'` keys for range mode (e.g. `{'start': 20, 'end': 80}`).
    
-   **description** (_str__,_ _default=''_) – Label text displayed with the slider.
    
-   **min** (_float__,_ _default=0_) – Minimum value of the slider.
    
-   **max** (_float__,_ _default=100_) – Maximum value of the slider.
    
-   **step** (_float__,_ _default=1_) – Increment between selectable values.
    
-   **direction** (_{'horizontal'__,_ _'vertical'__,_ _'responsive'}__,_ _default='horizontal'_) – Layout direction of label relative to the slider control.
    
-   **disabled** (_bool__,_ _default=False_) – Whether the widget is disabled.
    
-   **range** (_bool__,_ _default=False_) – When `True`, enables two-handle range mode. `value` must be a dict with `'start'` and `'end'` keys.
    
-   **show\_label** (_bool__,_ _default=True_) – Whether to display the description label.
    
-   **accessibility\_label** (_str_ _or_ _list_ _of_ _str__,_ _default='Slider'_) – `aria-label` for the slider thumb(s). Pass a list of two strings when `range=True`.
    
-   **histogram** (_bool__,_ _default=False_) – Whether to display a histogram above the slider track.
    
-   **histogram\_data** (_list_ _of_ _float__,_ _optional_) – Numeric data for the histogram bars. Each value represents the height of one bar. Required when `histogram=True`.
    
-   **on\_change** (_callable__,_ _optional_) – Callback invoked when value changes.
    
-   **layout** ([Layout](https://fpe.factset.com/docs/widgets.html#layout-properties), optional) – Layout object to control widget styling (e.g., width, padding, border).
    

Examples

```
from fds.fpe.widgets import Slider, Output

# Single value slider
s = Slider(description='Confidence:', value=50, min=0, max=100)
display(s)

# Range slider
s_range = Slider(
    description='Date Range:',
    value={'start': 20, 'end': 80},
    min=0,
    max=100,
    range=True,
    accessibility_label=['Range start', 'Range end'],
)
display(s_range)

# With change callback
out = Output()
def on_change(value):
    with out: print(f'Slider value: {s2.value}')

s2 = Slider(description='Weight:', value=30, min=0, max=100, step=5, on_change=on_change)
display(s2,out)
```
