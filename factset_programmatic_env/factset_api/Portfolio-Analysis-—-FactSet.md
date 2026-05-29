---
created: 2026-05-11T13:06:02 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/portfolio_analysis.html
author: 
---

# Portfolio Analysis — FactSet

> ## Excerpt
> The fds.fpe.portfolio_analysis module allows you to retrieve component (report/tile) data from an existing PA3 document.

---
## Background[#](https://fpe.factset.com/docs/portfolio_analysis.html#background "Link to this heading")

The _fds.fpe.portfolio\_analysis_ module allows you to retrieve component (report/tile) data from an existing [PA3](https://my.apps.factset.com/oa/pages/17520) document.

Portfolio Analysis 3 makes it easier than ever to instantly start evaluating your portfolio. Use this application to understand how your decisions affected the performance of your portfolio, decompose risk, classify your funds, and compare your returns to thousands of benchmarks and mutual funds.

Using Portfolio Analysis, you can calculate portfolio return, investigate sources of over- and under-performance, view the current valuation and recent trading history of portfolio constituents, and compare portfolio characteristics and weights to any available benchmark, including S&P, FTSE, Bloomberg Barclays, MSCI, and BofA Merrill Lynch indices.

You can analyze portfolios on an absolute basis or compare portfolios to one or more of 5,000 available benchmarks. Performance can be calculated on an absolute basis or studied to investigate sources of over- and under-performance versus any benchmark. You can also use Portfolio Analysis to monitor your portfolio throughout the day.

## Available Modules[#](https://fpe.factset.com/docs/portfolio_analysis.html#available-modules "Link to this heading")

In the `fds.fpe.portfolio_analysis` module, there are two classes to access data from PA3 documents.

**1\. Document** (NEW) - A more intuitive and user-friendly interface for retrieving performance metrics from PA3 documents at both the security and group/summary level.

**2\. Tile** - Interface for retrieving data from a PA3 document with symbol level resolution to easily pair with data generated via the screening engine.

## When to Use What[#](https://fpe.factset.com/docs/portfolio_analysis.html#when-to-use-what "Link to this heading")

Depending on the use case, there may be an overlap in your options to access the same underlying content. To help decipher when to use which method:

### Where the `Document` class is optimal[#](https://fpe.factset.com/docs/portfolio_analysis.html#where-the-document-class-is-optimal "Link to this heading")

-   Retrieving group-level and total-level analytics from PA3 documents
    
-   Working with custom grouping configurations
    
-   Faster retrieval with Apache Arrow format (stach)
    
-   Direct access to PA3 statistics as they appear in the application
    

### Where the `Tile` class is optimal[#](https://fpe.factset.com/docs/portfolio_analysis.html#where-the-tile-class-is-optimal "Link to this heading")

-   Symbol-level resolution required
    
-   More direct alignment with screening engine desired
    

## PA Document[#](https://fpe.factset.com/docs/portfolio_analysis.html#pa-document "Link to this heading")

This is a rewrite of the original portfolio analysis document module, with the goal of providing a more intuitive and user-friendly interface for retrieving performance metrics from PA3 documents, including direct access to all group/total level analytics.

### Comparison with Tile[#](https://fpe.factset.com/docs/portfolio_analysis.html#comparison-with-tile "Link to this heading")

Compared to the tile-based portfolio analysis module, the Document class:

-   Provides a more streamlined and intuitive interface for accessing PA3 data including integration with TimeSeries, grouping configuration and PA3 statistics
    
-   Faster retrieval of data with the change in response from json to apache arrow format (stach), reducing the effort of rendering the dataframe and displaying data as seen in the PA3 application
    
-   More efficient in terms of both time and resources, making it easier for users to work with large datasets and perform complex analyses without experiencing significant slowdowns
    

### Usage[#](https://fpe.factset.com/docs/portfolio_analysis.html#usage "Link to this heading")

**Getting Started**

A simple example of using the Document class:

```
from fds.fpe.pa import Document
from fds.fpe.dates import TimeSeries

doc_name = "CLIENT:PA_Test"

# portfolio
port = 'LION:IYLD-US'
# benchmarks
bench = 'LION:INKM-US'
# currency
curr = 'USD'

# load the document and the pa options groups, once groups are loaded you can use them in
# get_tile_data to retrieve the data with custom groups as seen in the PA application
pa_doc = Document(doc_name)

# to view all tiles under all reports in the document with category and report as index levels
# and tile name as column, tiles which were not loaded under a
# report would be named 'To be Loaded'
pa_doc.reports_and_tiles
```

|Category|Report|Tile|
|---|---|---|
|**Composition**|**asset class exposures**|exposures|
|**Composition**|**asset class exposures**|portfolio exposures|
|**Composition**|**asset class exposures**|benchmark exposures|

**Viewing Available Groups**

```
# to view all the available groups with columns GroupName, Id, Formula, Category as a dataframe
pa_doc.available_groups
```

|Group Name|Id|Formula|Category|
|---|---|---|---|
|**EQUITYORDEBT**|UUID-FEBCF602-B954-4F63-B93B-2AFBE16BF403|PA\_COL\_YTW(#PR,#SD)|PA\_COL\_YTW(#BN,#SD)|
|**Yield to Worst**|YieldtoWorst:FACTSET436|PA\_COL\_YTW(#PR,#SD)|PA\_COL\_YTW(#BN,#SD)|
|**Recommendation Date**|UUID-FD405F11-AD7E-E811-AAB4-AC162D910F68:FACTSET905|PA\_APM\_RECOMMENDATION\_DATE(#PR,#SD,#ED)|FACTSET/Other|

**Retrieving Tile Data**

```
time_series = TimeSeries('20240525', '20250531', 'M', 'FIVEDAY')

# get the tile data as a dataframe for the given time series, report, tile, portfolios,
# benchmark, currency, risk_model_id, etc
# You could perform this even without loading the tiles beforehand,
# this would load the tile on the fly and cache it for future use.
df = pa_doc.get_tile_data(
    report="Asset Class Exposures",
    tile="Exposures",
    port=port,
    bench=bench,
    time_series=time_series,
    currency=curr,
    risk_model_id='BARRA:GEMLT'
)
```

**Using Custom Group IDs**

```
pa_doc.get_tile_data(
    report="Asset Class Exposures",
    tile="Exposures",
    port=port,
    bench=bench,
    time_series=time_series,
    groups=['LEVEL1 - Lipper US:FACTSET721', 'LEVEL2 - Lipper US:FACTSET722'],
    currency=curr,
    risk_model_id='BARRA:GEMLT',
)
```

**Using Custom Group Names and IDs**

```
pa_doc.get_tile_data(
    report="Asset Class Exposures",
    tile="Exposures",
    port=port,
    bench=bench,
    time_series=time_series,
    groups=['LEVEL1 - Lipper US', 'LEVEL2 - Lipper US:FACTSET722'],
    currency=curr,
    risk_model_id='BARRA:GEMLT',
)
```

### API Reference[#](https://fpe.factset.com/docs/portfolio_analysis.html#api-reference "Link to this heading")

_class_ fds.fpe.pa.Document(_doc\_name_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document "Link to this definition")

_property_ available\_groups_: DataFrame_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.available_groups "Link to this definition")

Returns a Series of available group options for the document.

calculate(_\*\*kwargs_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.calculate "Link to this definition")

Calculate the data.

Return type:

`None`

_property_ desc_: str_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.desc "Link to this definition")

Description used in the representation of the object.

get\_report\_tiles(_report\_name\=None_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.get_report_tiles "Link to this definition")

Loads tiles for a given report, if they are not already loaded.

If report\_name is not provided it fetches all the tiles for all the reports and updates the dataframe. Returns a dataframe of tiles for the given report.

Parameters:

**report\_name** (_str__,_ _optional_) – The name of the report to get tiles for. If None, gets tiles for all reports.

Returns:

Tiles for the given report, or all reports when report\_name is None.

Return type:

pd.DataFrame

get\_tile\_data(_report_, _tile_, _port_, _bench\='BENCH:SP50'_, _groups\=''_, _precision\=2_, _time\_series\=None_, _currency\=None_, _risk\_model\_id\=None_, _port\_hold\_mode\='BH'_, _bench\_hold\_mode\='BH'_, _port\_price\_sources\=None_, _bench\_price\_sources\=None_, _progress\_bar\=True_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.get_tile_data "Link to this definition")

Get tile data from a PA tile.

The hierarchy of PA components from largest to smallest is Document > Report > Tile.

Parameters:

-   **report** (_str_) – The document report name to retrieve.
    
-   **tile** (_str_) – The report tile name to retrieve.
    
-   **port** (_str_) – The account or index to use as the portfolio.
    
-   **bench** (_str_) – The account or index to use as the benchmark.
    
-   **groups** (_str_ _or_ _list_ _of_ _str__,_ _optional_) – Grouping to be applied to the dataframe. They could be group names or group IDs. By default, no grouping is applied. then the resulting dataframe will have default groupings from the document.
    
-   **precision** (_int__,_ _optional_) – Number of decimal places to return for float values. By default 2.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series parameters for the calculation.
    
-   **currency** (_str__,_ _optional_) – Used to override the currency of the report. By default None.
    
-   **risk\_model\_id** (_str__,_ _optional_) – Used to override the risk model used in the report. Pass the risk model ID as a string. By default None, which means no override at all.
    
-   **port\_hold\_mode** (_str__,_ _optional_) – Used to override the holdings mode of the portfolio. Use BH for ‘Buy and Hold’ mode, TBR for ‘Transaction Based’, OMS for ‘Order Management System’, EXT for external returns and VLT for ‘Vaulted Returns’. By default, ‘BH’.
    
-   **bench\_hold\_mode** (_str__,_ _optional_) – Used to override the holdings mode of the benchmark. Use BH for ‘Buy and Hold’ mode, TBR for ‘Transaction Based’, OMS for ‘Order Management System’, EXT for external returns and VLT for ‘Vaulted Returns’. By default, ‘BH’.
    
-   **port\_price\_sources** (_list_ _of_ _dict__,_ _optional_) – Used to override the price sources for the portfolio. Pass a list of dictionaries, where each dictionary will be checked for three keys - directory, category and name. Each key should have a string value. Specify all three for specific source. If you want to select a whole category pass values for directory and category only. If you want to select whole directory pass value only for it. For sources that do not have category, simply pass values for directory and name. You can pass multiple sources and they act just like in PA3 - with waterfall logic - the first one to pass, will be the first one to use. By default it is None, which means no override at all.
    
-   **bench\_price\_sources** (_list_ _of_ _dict__,_ _optional_) – Absolutely the same as port\_price\_sources but for the benchmark. By default it is None, which means no override at all.
    
-   **progress\_bar** (_bool__,_ _optional_) – Whether to show the progress bar, by default True
    
-   **\*\*kwargs** – Additional keyword arguments forwarded to the underlying requests calls.
    

Returns:

A pandas DataFrame containing PA tile data. The structure of the data

will replicate PA exactly except the dates will be transposed as an index to align with FPE’s data structure and to make post-pull analysis easier. For non-security-level reports, DataFrame is indexed by ‘date’. For all other reports, DataFrame is indexed by ‘date’ and ‘symbol’.

Return type:

DataFrame

See also

-   Portfolio Analysis 3: [https://my.apps.factset.com/oa/pages/17520](https://my.apps.factset.com/oa/pages/17520)
    
-   Absolute Dates: [https://my.apps.factset.com/oa/pages/1964#abs](https://my.apps.factset.com/oa/pages/1964#abs)
    
-   Relative Dates: [https://my.apps.factset.com/oa/pages/1964#rel](https://my.apps.factset.com/oa/pages/1964#rel)
    
-   Holding Modes: [https://my.apps.factset.com/oa/pages/13815](https://my.apps.factset.com/oa/pages/13815)
    

_property_ is\_calculated_: bool_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.is_calculated "Link to this definition")

Has the data been calculated?

_property_ reports\_and\_tiles[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.reports_and_tiles "Link to this definition")

Returns a dataframe of available reports and tiles in the document along with the category.

_property_ tile\_metadata[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.tile_metadata "Link to this definition")

Returns a dataframe of metadata for the currently loaded tile. If no tile is loaded, returns None.

_property_ timestamp_: datetime_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.timestamp "Link to this definition")

Execution timestamp.

_property_ wall\_time_: float_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.wall_time "Link to this definition")

Calculation wall time.

_property_ warnings_: list\[Any\] | None_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.pa.Document.warnings "Link to this definition")

If there has been some warnings during the calculation, they will be stored here as a list.

## Tile[#](https://fpe.factset.com/docs/portfolio_analysis.html#tile "Link to this heading")

The portfolio\_analysis module includes various methods and functionality to support integration and retrieval from PA3 tiles with symbol-level resolution.

### Usage[#](https://fpe.factset.com/docs/portfolio_analysis.html#id1 "Link to this heading")

**List Available Tiles in a PA Document**

```
from fds.fpe import portfolio_analysis

tiles = portfolio_analysis.tiles(doc='Personal:PA_FDP')
# Returns a list of (report, tile) tuples, e.g.:
# [('Exposures', 'Weights'), ('Exposures', 'Weights Difference'), ...]
```

**Retrieve Data from a Specific Tile**

```
from fds.fpe import portfolio_analysis
from fds.fpe.dates import Calendar

pa_report = portfolio_analysis.tile(
    doc='Personal:PA_FPD',
    port='Personal:Portfolio_2.ACCT',
    bench='DEFAULT',
    report='Exposures',
    tile='Weights',
    start='20240701',
    stop='20240707',
    calendar=Calendar.UNITED_STATES,
    currency='USD',
    grouped=True,
    group_statistic='sum',
    port_hold_mode='OMS',
    bench_hold_mode='BH',
    port_price_sources=[{'directory': 'Equity', 'category': 'FactSet', 'name': 'FactSet - Equity'}],
    bench_price_sources=[{'directory': 'Equity', 'category': 'Euronext'}],
)

pa_report.head()
```

### API Reference[#](https://fpe.factset.com/docs/portfolio_analysis.html#id2 "Link to this heading")

_enum_ fds.fpe.portfolio\_analysis.DocumentSettings(_value_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings "Link to this definition")

Enum of PA document settings paths for overriding report configuration.

Valid values are as follows:

PRICE\_SOURCES _\= <DocumentSettings.PRICE\_SOURCES: ('docSettings', 'datasources', 'PriceDataSources')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.PRICE_SOURCES "Link to this definition")

ANALYTICS _\= <DocumentSettings.ANALYTICS: ('docSettings', 'datasources', 'AnalyticsDataSources')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.ANALYTICS "Link to this definition")

EXCHANGE\_RATE _\= <DocumentSettings.EXCHANGE\_RATE: ('docSettings', 'datasources', 'ExchangeRateDataSources')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.EXCHANGE_RATE "Link to this definition")

CALENDAR _\= <DocumentSettings.CALENDAR: ('docSettings', 'dates')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.CALENDAR "Link to this definition")

CURRENCY _\= <DocumentSettings.CURRENCY: ('docSettings', 'pricing')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.CURRENCY "Link to this definition")

RISK _\= <DocumentSettings.RISK: ('docSettings', 'risk')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.RISK "Link to this definition")

UNIVERSE _\= <DocumentSettings.UNIVERSE: ('docSettings', 'universe')>_[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.UNIVERSE "Link to this definition")

The `Enum` and its members also have the following methods:

get\_settings\_object(_doc_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.DocumentSettings.get_settings_object "Link to this definition")

Returns a settings dictionary with the specific path value in the structure.

Parameters:

**doc** (`dict`\[`str`, `Any`\]) – The document (dict) to fetch the value from.

Return type:

`dict`\[`str`, `Any`\]

Returns:

A settings dictionary with the value in the desired format.

fds.fpe.portfolio\_analysis.tile(_doc_, _report_, _tile_, _port_, _bench\='BENCH:SP50'_, _precision\=2_, _grouped\=False_, _group\_cols\=True_, _group\_statistic\='mean'_, _levels\=0_, _start\=None_, _stop\=None_, _calendar\=None_, _currency\=None_, _port\_hold\_mode\='BH'_, _bench\_hold\_mode\='BH'_, _port\_price\_sources\=None_, _bench\_price\_sources\=None_, _progress\_bar\=True_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.tile "Link to this definition")

Get tile data from a PA tile.

The hierarchy of PA components from largest to smallest is Document > Report > Tile.

Parameters:

-   **doc** (_str_) – The PA document to retrieve.
    
-   **report** (_str_) – The document report to retrieve.
    
-   **tile** (_str_) – The report tile to retrieve.
    
-   **port** (_str_) – The account or index to use as the portfolio.
    
-   **bench** (_str_) – The account or index to use as the benchmark.
    
-   **precision** (_int__,_ _optional_) – Number of decimal places to return for float values. By default 2.
    
-   **grouped** (_bool__,_ _optional_) – Determines whether DataFrame is returned grouped by groups set in report. By default False.
    
-   **group\_cols** (_bool__,_ _optional_) – Determines whether document groups are returned as DataFrame columns. By default True.
    
-   **group\_statistic** (_str__,_ _optional_) – The statistic to be used at the group level if ‘grouped’ is True. By default ‘mean’ (Note: Does not apply to Attribution Reports).
    
-   **levels** (_int_ _or_ _str__,_ _optional_) – For Attribution Reports, if grouped is True, the group-level index for which to calculate attribution. For example, if report groups are Economic Sector > Industry, levels=1 would return attribution at the Industry level. If set to ‘all’, returns attribution at every group level including security-level. By default 0.
    
-   **start** (_str_ _or_ [_RelativeDate_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates.RelativeDate")_,_ _optional_) – Used to override the start date of the report. If a string is provided, it can be an absolute date or a relative date. Alternatively, you can provide a RelativeDate. By default None.
    
-   **stop** (_str_ _or_ [_RelativeDate_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates.RelativeDate")_,_ _optional_) – Used to override the end date of the report. If a string is provided, it can be an absolute date or a relative date. Alternatively, you can provide a RelativeDate. By default None.
    
-   **calendar** (`str` | [`Calendar`](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar "fds.fpe.dates._calendar.Calendar") | `None`) – Used to override the calendar of the report. By default None.
    
-   **currency** (_str__,_ _optional_) – Used to override the currency of the report. By default None.
    
-   **port\_hold\_mode** (_str__,_ _optional_) – Used to override the holdings mode of the portfolio. Use BH for ‘Buy and Hold’ mode, TBR for ‘Transaction Based’, OMS for ‘Order Management System’, EXT for external returns and VLT for ‘Vaulted Returns’. By default, ‘BH’.
    
-   **bench\_hold\_mode** (_str__,_ _optional_) – Used to override the holdings mode of the benchmark. Use BH for ‘Buy and Hold’ mode, TBR for ‘Transaction Based’, OMS for ‘Order Management System’, EXT for external returns and VLT for ‘Vaulted Returns’. By default, ‘BH’.
    
-   **port\_price\_sources** (_list_ _of_ _dict__,_ _optional_) – Used to override the price sources for the portfolio. Pass a list of dictionaries, where each dictionary will be checked for three keys - directory, category and name. Each key should have a string value. Specify all three for specific source. If you want to select a whole category pass values for directory and category only. If you want to select whole directory pass value only for it. For sources that do not have category, simply pass values for directory and name. You can pass multiple sources and they act just like in PA3 - with waterfall logic - the first one to pass, will be the first one to use. By default it is None, which means no override at all.
    
-   **bench\_price\_sources** (_list_ _of_ _dict__,_ _optional_) – Absolutely the same as port\_price\_sources but for the benchmark. By default it is None, which means no override at all.
    
-   **progress\_bar** (_bool__,_ _optional_) – Whether to show the progress bar, by default True
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying requests calls.
    

Returns:

A pandas DataFrame containing PA tile data.

The structure of the data will replicate PA exactly except the dates will be transposed as an index to align with FPE’s data structure and to make post-pull analysis easier. For non-security-level reports, DataFrame is indexed by ‘date’. For all other reports, DataFrame is indexed by ‘date’ and ‘symbol’.

Return type:

DataFrame

See also

-   Portfolio Analysis 3: [https://my.apps.factset.com/oa/pages/17520](https://my.apps.factset.com/oa/pages/17520)
    
-   Absolute Dates: [https://my.apps.factset.com/oa/pages/1964#abs](https://my.apps.factset.com/oa/pages/1964#abs)
    
-   Relative Dates: [https://my.apps.factset.com/oa/pages/1964#rel](https://my.apps.factset.com/oa/pages/1964#rel)
    
-   Holding Modes: [https://my.apps.factset.com/oa/pages/13815](https://my.apps.factset.com/oa/pages/13815)
    

fds.fpe.portfolio\_analysis.tiles(_doc_, _full\_detail\=False_)[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.tiles "Link to this definition")

Get a list of all tiles available in a PA document.

Parameters:

-   **doc** (_str_) – The PA document for which all available tiles will be provided.
    
-   **full\_detail** (_bool__,_ _optional_) – If True, returns more detail about each tile, e.g. title, type, modified date. By default, False.
    

Returns:

A list of report/tile tuples, or a DataFrame with full details.

If full\_detail is False, returns a list of tuples containing report and tile names. If full\_detail is True, returns a DataFrame with more detail about each tile.

Return type:

list or DataFrame

fds.fpe.portfolio\_analysis.video\_tutorial()[#](https://fpe.factset.com/docs/portfolio_analysis.html#fds.fpe.portfolio_analysis.video_tutorial "Link to this definition")

Play the Portfolio Analysis video tutorial.

Return type:

`None`
