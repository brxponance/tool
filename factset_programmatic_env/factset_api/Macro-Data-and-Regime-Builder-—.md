---
created: 2026-05-11T13:07:47 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/global_macro_data.html
author: 
---

# Macro Data and Regime Builder —

> ## Excerpt
> This module provides tools for selecting, downloading, and processing macroeconomic
time series data for empirical analysis, regime modeling, and economic indicator tracking.

---
## Macroeconomic Series Data Module[#](https://fpe.factset.com/docs/global_macro_data.html#macroeconomic-series-data-module "Link to this heading")

This module provides tools for selecting, downloading, and processing macroeconomic time series data for empirical analysis, regime modeling, and economic indicator tracking.

The module simplifies access to popular macroeconomic indicators through a pre-curated list organized by geographic area and data type, eliminating the need to search through millions of available FactSet series.

### Main Components[#](https://fpe.factset.com/docs/global_macro_data.html#main-components "Link to this heading")

MacroSeriesDataclass

Core class for macro data selection and retrieval

Interactive WidgetsGUI

User-friendly interface for series selection grouped by Area and Type

Data Retrievalautomated

Automatic download and formatting of historical time series data

### Typical Workflow[#](https://fpe.factset.com/docs/global_macro_data.html#typical-workflow "Link to this heading")

1.  Instantiate `MacroSeriesData` to access the curated indicator list
    
2.  Use `display_grouped_selectors()` to interactively select macro series via widget
    
3.  Download historical data with `get_macro_data()` specifying date range and frequency
    
4.  Use the resulting DataFrame for analysis, modeling, or visualization
    

Examples

**Example 1: Basic workflow with interactive selection:**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>>
>>> # Initialize with curated macro indicator list
>>> msd = MacroSeriesData()
>>>
>>> # Display interactive widget for series selection
>>> msd.display_grouped_selectors()
>>> # User selects indicators via widget interface
>>>
>>> # Download 20 years of monthly data
>>> df = msd.get_macro_data(start="-20Y", stop="-1M", frequency="M")
>>> print(df.head())
```

**Example 2: Programmatic workflow without GUI:**

```
>>> msd = MacroSeriesData()
>>>
>>> # Set indicators programmatically
>>> msd.set_symbols(['USA.LOLITOAA.STSA', 'BLSCUUR0000SA0'])
>>>
>>> # Download quarterly data for last 10 years
>>> df = msd.get_macro_data(start="-10Y", stop="-1M", frequency="Q")
>>> print(df.shape)
```

Notes

-   The curated macro series list includes metadata: Area and Type
    
-   Geographic areas include Eurozone, USA, United Kingdom, Germany, China, Australia, Japan and India
    
-   Types include Leading Indicators, Inflation, Employment, GDP, Interest Rates, etc.
    
-   Data sources are accessed via via FactSet FQL APIs
    

See also

`RegimeBuilder`

Module for building empirical regime models from macro data

_class_ fds.fpe.quant.global\_macro.macro\_series\_data.MacroSeriesData[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData "Link to this definition")

Unified interface for selecting and downloading macroeconomic time series data.

`MacroSeriesData` provides streamlined access to a pre-curated collection of popular macroeconomic indicators, organized by geographic area and data type. The class supports both interactive (widget-based) and programmatic workflows for series selection and data retrieval.

The pre-curated list eliminates the need to search through millions of available FactSet macro series, focusing instead on the most commonly used indicators for economic analysis, regime modeling, and market research.

**Business Use Cases:**

-   **Regime Modeling**: Select macro factors for empirical regime classification
    
-   **Economic Research**: Track leading indicators across multiple economies
    
-   **Market Analysis**: Monitor inflation, employment, and growth trends
    
-   **Nowcasting**: Build real-time economic activity indicators
    
-   **Risk Management**: Track macro risk factors for portfolio analysis
    
-   **Backtesting**: Create historical macro environments for strategy evaluation
    

macro\_symbols[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.macro_symbols "Link to this definition")

List of selected macro indicator codes (e.g., \[‘USA.LOLITOAA.STSA’\])

Type:

list of str

macro\_data[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.macro_data "Link to this definition")

Downloaded macroeconomic time series data with columns formatted as “{Factor Name} ({Code})”

Type:

pandas.DataFrame

Parameters:

**None** – Class initialization loads the curated indicator list from the bundled Excel file automatically

Examples

**Example 1: Interactive selection and download**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>>
>>> # Initialize
>>> msd = MacroSeriesData()
>>>
>>> # Display widget grouped by Area and Type
>>> msd.display_grouped_selectors()
>>> # User selects: OECD US Leading Indicator, US CPI, US Unemployment
>>>
>>> # Download monthly data for last 20 years
>>> df = msd.get_macro_data(start="-20Y", stop="-1M", frequency="M")
>>>
>>> # Inspect results
>>> print(df.columns)
>>> print(df.tail())
```

**Example 2: Programmatic workflow for automation**

```
>>> msd = MacroSeriesData()
>>>
>>> # Set indicators programmatically (no widget)
>>> msd.set_symbols([
...     'USA.LOLITOAA.STSA',  # OECD US Leading Indicator
...     'BLSCUUR0000SA0',     # US CPI-U
...     'ISMPMI@M'            # ISM Manufacturing PMI
... ])
>>>
>>> # Download quarterly data
>>> df = msd.get_macro_data(start="-15Y", stop="-1M", frequency="Q")
>>> print(f"Downloaded {df.shape[0]} quarters of data")
```

**Example 3: Integration with regime modeling**

```
>>> from fds.fpe.quant.global_macro import RegimeBuilder
>>>
>>> # Select and download macro data
>>> msd = MacroSeriesData()
>>> msd.display_grouped_selectors()
>>> macro_df = msd.get_macro_data(start="-30Y", frequency="M")
>>>
>>> # Build regime model
>>> builder = RegimeBuilder(macro_df)
>>> builder.data_transformations_widget()
>>> transformed = builder.transform_data()
>>> regime_data = builder.run_regime()
```

Notes

-   Maximum of 10 series can be selected via the widget interface
    
-   Column names in output DataFrame: “{Factor Name} ({Code})”
    
-   Index is automatically converted to end-of-month dates for non-daily data
    
-   Data availability varies by indicator and source
    
-   Some indicators may only be available at quarterly frequency
    

See also

[`display_grouped_selectors`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors")

Interactive widget for series selection

[`get_macro_data`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data")

Download time series data for selected indicators

[`set_symbols`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols")

Programmatically set indicator codes

display\_grouped\_selectors()[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors "Link to this definition")

Display an interactive widget for selecting macroeconomic indicators, grouped hierarchically by geographic area and data type.

This method renders the recommended interface for selecting macro series. The widget organizes indicators into a two-level hierarchy:

1.  **First level**: Geographic Area (USA, Europe, China, Japan, Global, etc.)
    
2.  **Second level**: Data Type (Leading Indicators, Inflation, Employment, GDP, Interest Rates, Money Supply, etc.)
    

This hierarchical organization makes it easy to find relevant indicators without searching through the complete list. For example, to find US inflation indicators, users navigate to USA → Inflation.

The widget provides a user-friendly alternative to searching through millions of available macroeconomic series at FactSet by focusing on the most popular and widely used indicators for economic analysis.

**Widget Features:**

-   **Hierarchical Navigation**: Browse by Area, then Type
    
-   **Add/Remove**: Easily manage selected indicators
    
-   **Visual Feedback**: Selected indicators clearly displayed
    
-   **Search**: Quick filtering within groups
    
-   **Auto-Save**: Selections automatically stored in `macro_symbols`
    

Returns:

Displays widget directly in Jupyter notebook output

Return type:

None

Notes

-   This is the **recommended** method for interactive selection
    
-   Preferred over `display_selectors()` for better user experience
    
-   Widget is designed for Jupyter notebook environments
    
-   Selected codes are stored in `self.macro_symbols`
    
-   Maximum 10 indicators can be selected
    

Examples

**Example 1: Basic usage:**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>>
>>> # Initialize
>>> msd = MacroSeriesData()
>>>
>>> # Display grouped selector widget
>>> msd.display_grouped_selectors()
>>> # User navigates: USA → Leading Indicators → OECD US Leading Indicator
>>> # User navigates: USA → Inflation → US CPI-U
>>> # User clicks "Add Selected Indicators"
>>>
>>> # Download selected data
>>> df = msd.get_macro_data(start="-20Y", stop="-1M", frequency="M")
```

**Example 2: Select indicators across multiple regions:**

```
>>> msd = MacroSeriesData()
>>> msd.display_grouped_selectors()
>>> # User selects:
>>> #   - USA → Leading Indicators → OECD US Leading Indicator
>>> #   - Europe → Leading Indicators → OECD Euro Area Leading Indicator
>>> #   - China → Leading Indicators → OECD China Leading Indicator
>>>
>>> df = msd.get_macro_data(start="-15Y", frequency="Q")
>>> # Compare leading indicators across economies
```

**Example 3: Complete workflow with regime modeling:**

```
>>> from fds.fpe.quant.global_macro import RegimeBuilder
>>>
>>> # Step 1: Select macro series
>>> msd = MacroSeriesData()
>>> msd.display_grouped_selectors()
>>>
>>> # Step 2: Download data
>>> macro_df = msd.get_macro_data(start="-30Y", frequency="M")
>>>
>>> # Step 3: Build regime model
>>> builder = RegimeBuilder(macro_df)
>>> builder.data_transformations_widget()
>>> regime_data = builder.run_regime()
```

See also

[`display_selectors`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_selectors "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_selectors")

Simple dropdown selection (not hierarchical)

[`set_symbols`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols")

Programmatic method to set indicators without widget

[`get_macro_data`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data")

Download time series for selected indicators

display\_selectors()[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_selectors "Link to this definition")

Display an interactive dropdown widget for selecting macroeconomic indicators.

This method renders a simple dropdown-based selection interface that allows users to choose up to 10 macro series from the pre-curated list. The widget includes a flat list of all available indicators without hierarchical grouping.

The widget initializes with two default selections:

-   ‘USA.LOLITOAA.STSA’: OECD US Leading Indicator
    
-   ‘BLSCUUR0000SA0’: US CPI-U (Consumer Price Index)
    

Users can add additional indicators up to the maximum limit and remove unwanted selections. Selected indicators are automatically stored in the `macro_symbols` attribute.

Returns:

Displays widget directly in Jupyter notebook output

Return type:

None

Notes

-   Maximum 10 indicators can be selected simultaneously
    
-   Widget is designed for Jupyter notebook environments
    
-   Selected codes are stored in `self.macro_symbols`
    
-   For hierarchical selection by Area/Type, use `display_grouped_selectors()`
    

Examples

**Example 1: Basic usage:**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>> msd = MacroSeriesData()
>>>
>>> # Display simple dropdown selector
>>> msd.display_selectors()
>>> # User interacts with widget to select indicators
>>>
>>> # After selection, download data
>>> df = msd.get_macro_data(start="-20Y", frequency="M")
```

**Example 2: Access selected symbols:**

```
>>> msd.display_selectors()
>>> # After user makes selections
>>> print(f"Selected indicators: {msd.macro_symbols}")
```

See also

[`display_grouped_selectors`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors")

Hierarchical selection by Area and Type (recommended)

[`set_symbols`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols")

Programmatic method to set indicators without widget

get\_macro\_data(_start\='-70Y'_, _stop\='-1M'_, _frequency\='M'_, _calendar\='FIVEDAY'_)[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data "Link to this definition")

Download macroeconomic time series data for selected indicators.

This method retrieves historical data for all macro series selected via the widget or `set_symbols()`. The data is returned as a pandas DataFrame with properly formatted column names and datetime index.

The method handles multiple data items automatically and formats the output consistently. For all frequencies, the index is adjusted to end-of-month dates.

Parameters:

-   **start** (_str__,_ _optional_) –
    
    Start date offset in relative format. Accepts formats like:
    
    -   ”-70Y”: 70 years before stop date (default)
        
    -   ”-20Y”: 20 years before stop date
        
    -   ”-36M”: 36 months before stop date
        
    -   ”08/31/2000”: Absolute start date
        
-   **stop** (_str__,_ _optional_) –
    
    End date offset in relative format (default: “-1M”). Accepts formats like:
    
    -   ”-1M”: 1 month before current date (default)
        
    -   ”-1D”: 1 day before current date
        
    -   ”08/31/2024”: Absolute end date
        
-   **frequency** (_str__,_ _optional_) –
    
    Data frequency for retrieval. Options:
    
    -   **”M”**: Monthly (default) - most common for macro data
        
    -   **”Q”**: Quarterly - for GDP and other quarterly series
        
    -   **”D”**: Daily - for interest rates and financial indicators
        
    -   **”W”**: Weekly - for select high-frequency indicators
        
-   **calendar** (_str__,_ _optional_) –
    
    Calendar type for date alignment (default: “FIVEDAY”). Options:
    
    -   **”FIVEDAY”**: 5-day trading week (default)
        
    -   **”SEVENDAY”**: 7-day calendar week
        
    
    Note: Only relevant for daily and weekly frequencies
    

Returns:

Time series data with:

-   **Index**: DatetimeIndex (end-of-month for non-daily data)
    
-   **Columns**: Formatted as “{Factor Name} ({Code})” Example: “OECD US Leading Indicator (USA.LOLITOAA.STSA)”
    
-   **Values**: Numeric time series data (units vary by indicator)
    

Return type:

pandas.DataFrame

Raises:

-   **ValueError** – If no indicators are selected (empty `macro_symbols`)
    
-   **KeyError** – If selected indicator codes are not found in the curated list
    
-   **ConnectionError** – If data retrieval from API fails
    

Notes

-   Column names: “{Factor} ({Code})” format for clarity
    
-   Index is sorted chronologically
    
-   Missing values are preserved (not filled)
    
-   Different indicators may have different start dates
    
-   Some indicators are only available quarterly
    
-   Downloaded data is cached in `self.macro_data`
    

Examples

**Example 1: Data download with interactive selection**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>> msd = MacroSeriesData()
>>> msd.display_grouped_selectors()
>>>
>>> # Download 20 years of monthly data
>>> df = msd.get_macro_data(start="-20Y", stop="-1M", frequency="M")
>>> print(df.head())
>>> print(f"Shape: {df.shape}")
>>> print(f"Date range: {df.index[0]} to {df.index[-1]}")
```

**Example 2: Data download with programmatic selection**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>> msd = MacroSeriesData()
>>> msd.set_symbols(['USA.LOLITOAA.STSA', 'BLSCUUR0000SA0'])
>>>
>>> # Download 20 years of monthly data
>>> df = msd.get_macro_data(start="-20Y", stop="-1M", frequency="M")
>>> print(df.head())
>>> print(f"Shape: {df.shape}")
>>> print(f"Date range: {df.index[0]} to {df.index[-1]}")
```

See also

[`set_symbols`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols")

Programmatically set indicator codes

[`display_grouped_selectors`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors")

Interactive widget for series selection

set\_symbols(_symbols_)[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.set_symbols "Link to this definition")

Set the macroeconomic indicator codes for subsequent data retrieval.

This method provides a programmatic way to specify which macro indicators to download, bypassing the interactive widget interface. It’s useful for automated workflows, batch processing, or when the desired indicators are already known.

The provided indicator codes must match those in the curated list (IDs.xlsx). Valid codes can be found by examining the ‘Code’ column in the indicator list.

Parameters:

**symbols** (_list_ _of_ _str_) –

List of macro indicator codes to download. Each code must be a valid identifier from the curated indicator list. Examples:

-   ’USA.LOLITOAA.STSA’: OECD US Leading Indicator
    
-   ’BLSCUUR0000SA0’: US CPI-U
    
-   ’ISMPMI@M’: ISM Manufacturing PMI
    
-   [’ECONSENTNR2@EUZ20](mailto:'ECONSENTNR2%40EUZ20)’: Euro Area Economic Sentiment Indicator
    

Returns:

Selected symbols are stored in `self.macro_symbols`

Return type:

None

Examples

**Example 1: Basic usage:**

```
>>> from fds.fpe.quant.global_macro import MacroSeriesData
>>> msd = MacroSeriesData()
>>>
>>> # Set indicators programmatically
>>> msd.set_symbols(['USA.LOLITOAA.STSA', 'BLSCUUR0000SA0'])
>>>
>>> # Download data
>>> df = msd.get_macro_data(start="-20Y", frequency="M")
```

**Example 2: Multiple indicators for comprehensive analysis:**

```
>>> msd = MacroSeriesData()
>>> msd.set_symbols([
...     'USA.LOLITOAA.STSA',   # US Leading Indicator
...     'BLSCUUR0000SA0',      # US CPI
...     'ISMNMI@NM',           # ISM Services PMI
...     'TRYUS10Y-FDS'         # 10Y Treasury Yield
... ])
>>> df = msd.get_macro_data(start="-25Y", frequency="M")
```

**Example 3: Reset selections:**

```
>>> msd = MacroSeriesData()
>>> msd.set_symbols(['USA.LOLITOAA.STSA'])
>>> # Later, replace with new selection
>>> msd.set_symbols(['BLSCUUR0000SA0', 'USA.UNRTNAA.STSA'])
```

**Example 4: Automated workflow:**

```
>>> # Define indicator sets for different analysis types
>>> INFLATION_INDICATORS = ['BLSCUUR0000SA0', 'RCPICY1@US']
>>> GROWTH_INDICATORS = ['USA.LOLITOAA.STSA', 'US.GDPR']
>>>
>>> # Use programmatically
>>> msd = MacroSeriesData()
>>> msd.set_symbols(INFLATION_INDICATORS)
>>> inflation_df = msd.get_macro_data(start="-10Y")
```

Notes

-   This method overwrites any previous selections
    
-   No validation is performed until `get_macro_data()` is called
    
-   Invalid codes will raise errors during data download
    
-   For interactive selection, use `display_grouped_selectors()`
    

See also

[`display_grouped_selectors`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.display_grouped_selectors")

Interactive widget for series selection

[`get_macro_data`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data "fds.fpe.quant.global_macro.macro_series_data.MacroSeriesData.get_macro_data")

Download time series for selected indicators

## Regime Factor Builder Module[#](https://fpe.factset.com/docs/global_macro_data.html#regime-factor-builder-module "Link to this heading")

This module provides comprehensive tools for building empirical regime models that map historical dates to generic macroeconomic regimes based on the performance of provided macroeconomic factors.

The module enables users to upload time series of macroeconomic variables, apply transformations from a predefined set of options, and use the transformed data to classify historical periods into distinct regime states. This is particularly useful for regime-aware investment strategies, economic cycle analysis, and backtesting systematic models under different market conditions.

### Main Components[#](https://fpe.factset.com/docs/global_macro_data.html#id1 "Link to this heading")

RegimeBuilderclass

Core class for regime model construction and data management

Transformation Functionscallable

Predefined transformation rules (Raw Data, Percentage Return, Difference, MA1 minus MA2)

GUI Widgetsinteractive

Interactive interface for transformation selection and parameter configuration

Regime Mappingautomated

Automatic generation of binary regime indicators and regime classification

### Typical Workflow[#](https://fpe.factset.com/docs/global_macro_data.html#id2 "Link to this heading")

1.  Instantiate `RegimeBuilder` with a DataFrame containing macro time series
    
2.  Configure transformations either via:
    
    1.  GUI: Use `data_transformations_widget()` for interactive selection
        
    2.  Direct: Set `transformations` property programmatically
        
3.  Apply transformations using `transform_data()`
    
4.  Generate regime model and map dates to regimes with `run_regime()`
    

### Alternative Workflows[#](https://fpe.factset.com/docs/global_macro_data.html#alternative-workflows "Link to this heading")

-   **Direct regime generation**: Instantiate with data and immediately call `run_regime()`
    
-   **External transformation**: Transform data outside the class, then instantiate a new `RegimeBuilder` with pre-transformed data
    
-   **Multi-stage transformation**: Apply transformations, export data, apply additional transformations externally, then re-import for regime generation
    

Examples

**Example 1: Basic workflow with GUI:**

```
>>> import pandas as pd
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> # Load macro data
>>> macro_data = pd.DataFrame({
...     'GDP': [102.1, 102.3, 102.5, 102.2, 101.8, 101.5],
...     'Inflation': [2.0, 2.2, 2.4, 2.6, 2.3, 2.1],
...     'Unemployment': [5.5, 5.3, 5.1, 5.2, 5.4, 5.6]
... }, index=pd.date_range('2020-01-01', periods=6, freq='Q'))
>>>
>>> # Initialize builder
>>> builder = RegimeBuilder(macro_data)
>>>
>>> # Display GUI for transformation selection (Jupyter environment)
>>> builder.data_transformations_widget()
>>>
>>> # Apply transformations and generate regimes
>>> transformed = builder.transform_data()
>>> regime_data = builder.run_regime()
```

**Example 2: Programmatic workflow without GUI:**

```
>>> # Configure transformations directly
>>> builder.transformations = [
...     {
...         "column": "GDP",
...         "transformer": "Percentage Return",
...         "params": {"scaling": 100.0, "normalize": True}
...     },
...     {
...         "column": "Inflation",
...         "transformer": "Difference",
...         "params": {"scaling": 1.0, "normalize": False}
...     }
... ]
>>>
>>> # Execute transformation and regime generation
>>> transformed = builder.transform_data()
>>> regime_data = builder.run_regime()
```

Notes

-   The module is designed for use in Jupyter notebook environments when using GUI features
    
-   All data transformations preserve the original input DataFrame
    
-   Missing values are automatically dropped after transformation
    
-   Maximum of 10 indicators supported for computational efficiency
    

_class_ fds.fpe.quant.global\_macro.regime\_factor\_builder.RegimeBuilder(_df_)[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder "Link to this definition")

Builder for creating empirical regime models from macroeconomic time series.

`RegimeBuilder` provides a comprehensive toolkit for transforming macroeconomic data into regime indicators and mapping historical periods to distinct macroeconomic regimes. It supports both programmatic and interactive (GUI) workflows, making it accessible to both data scientists and quantitative analysts.

The class maintains three distinct data states throughout the workflow:

1.  **Source data**: Original input DataFrame (immutable)
    
2.  **Transformed data**: Result after applying selected transformations
    
3.  **Regime data**: Final output with regime factors, indicators and classifications
    

Parameters:

**df** (_pd.DataFrame_) –

Source DataFrame containing macroeconomic time series. Should have:

-   DatetimeIndex or comparable time-based index
    
-   Numeric columns representing different macro variables
    
-   No excessive missing values (will be dropped after transformation)
    

transformations[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transformations "Link to this definition")

Get or set the list of transformations to apply to source data.

This property provides a programmatic way to configure transformations without using the GUI interface. It’s particularly useful for automated workflows, batch processing, or when integrating with other systems.

Parameters:

**value** (_list_ _of_ _dict_) –

List of transformation configurations. Each dict must contain:

-   **column** (str): Name of column from source DataFrame
    
-   **transformer** (str): Name of transformer (see Available Transformers)
    
-   **params** (dict): Dictionary of transformer-specific parameters
    

Notes

-   Available Transformers:
    
    -   Raw Data
        
        Identity transformation; no mathematical modification.
        
        **Parameters**: None
        
    -   Percentage Return
        
        Period-over-period percentage change.
        
        **Parameters**: - `scaling` (float, default 100.0): Multiplicative factor - `normalize` (bool, default False): Apply z-score normalization
        
    -   Difference
        
        First difference between consecutive values.
        
        **Parameters**: - `scaling` (float, default 1.0): Multiplicative factor - `normalize` (bool, default False): Apply z-score normalization
        
    -   MA1 minus MA2
        
        Difference between short and long moving average returns.
        
        **Parameters**: - `ma1` (int, default 3) - `ma2` (int, default 36) - `scaling` (float, default 100.0): Multiplicative factor - `normalize` (bool, default False): Apply z-score normalization
        

Examples

**Example 1: Single transformation:**

```
>>> builder.transformations = [
...     {
...         "column": "GDP_Growth",
...         "transformer": "Raw Data",
...         "params": {}
...     }
... ]
```

**Example 2: Multiple transformations with normalization:**

```
>>> builder.transformations = [
...     {
...         "column": "GDP_Growth",
...         "transformer": "Difference",
...         "params": {"scaling": 1.0, "normalize": True}
...     },
...     {
...         "column": "Inflation",
...         "transformer": "MA1 minus MA2",
...         "params": {"scaling": 100.0, "normalize": True}
...     },
...     {
...         "column": "Leading_Index",
...         "transformer": "Percentage Return",
...         "params": {"ma1": 3, "ma2": 12, "scaling": 100.0, "normalize": True}
...     }
... ]
```

Notes

-   Setting transformations does not execute them; call `transform_data()` to apply
    
-   Invalid column names or transformer names will raise errors during execution
    
-   Parameter validation occurs during transformation execution
    

Type:

list of dict

Raises:

-   **TypeError** – If df is not a pandas DataFrame
    
-   **ValueError** – If df is empty or contains no data
    

Notes

-   Original data is copied internally and never modified
    
-   All transformations operate on copies to prevent side effects
    
-   Widget state is preserved across method calls in Jupyter environments
    
-   Maximum 10 transformed series supported (computational constraint)
    

## Example Business Use Cases[#](https://fpe.factset.com/docs/global_macro_data.html#example-business-use-cases "Link to this heading")

-   **Regime-Aware Asset Allocation**: Adjust portfolio weights based on macro regime
    
-   **Economic Cycle Analysis**: Identify and characterize different economic phases
    
-   **Backtesting Framework**: Test strategies under different historical regime conditions
    
-   **Risk Management**: Enhance risk models with regime-dependent parameters
    
-   **Capital Market Assumptions**: Generate regime-conditional return forecasts
    

Examples

**Example 1: Basic workflow with pre-configured transformations**

```
>>> import pandas as pd
>>> from datetime import datetime
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> # Create sample macro data
>>> dates = pd.date_range('2015-01-01', periods=60, freq='M')
>>> macro_data = pd.DataFrame({
...     'GDP_Growth': np.random.normal(2.0, 1.0, 60),
...     'Inflation': np.random.normal(2.5, 0.5, 60),
...     'Unemployment': np.random.normal(5.0, 0.8, 60),
...     'Bond_Yield': np.random.normal(3.0, 1.2, 60)
... }, index=dates)
>>>
>>> # Initialize and configure
>>> builder = RegimeBuilder(macro_data)
>>> builder.transformations = [
...     {
...         "column": "GDP_Growth",
...         "transformer": "Difference",
...         "params": {"scaling": 1.0, "normalize": True}
...     },
...     {
...         "column": "Inflation",
...         "transformer": "MA1 minus MA2",
...         "params": {"ma1": 3, "ma2": 12, "scaling": 100.0, "normalize": True}
...     }
... ]
>>>
>>> # Execute workflow
>>> transformed_data = builder.transform_data()
>>> regime_data = builder.run_regime()
>>> print(regime_data)
```

**Example 2: Interactive GUI workflow (Jupyter)**

```
>>> import pandas as pd
>>> from datetime import datetime
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> builder = RegimeBuilder(macro_data)
>>> # Display interactive widget for transformation selection
>>> builder.data_transformations_widget()
>>> # User interacts with GUI to select transformations and their parameters
>>> # Then execute:
>>> transformed_data = builder.transform_data()
>>> regime_data = builder.run_regime()
```

**Example 3: Simple regime generation with raw data**

```
>>> # Use raw data directly without transformations
>>> builder = RegimeBuilder(macro_data)
>>> regime_data = builder.run_regime()
>>> # Regime indicators based on sign of raw values
```

**Example 4: Multi-stage transformation pipeline**

```
>>> import pandas as pd
>>> from datetime import datetime
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> # First transformation stage
>>> builder1 = RegimeBuilder(macro_data)
>>> builder1.transformations = [
...     {"column": "GDP_Growth", "transformer": "Percentage Return",
...      "params": {"scaling": 100.0, "normalize": False}}
... ]
>>> intermediate_data = builder1.transform_data()
>>>
>>> # Apply custom transformation to the data in intermediate_data outside of the the builder
>>> # For example one could take the difference of two already trasnformed series in intermediate_data
>>>
>>> # Second transformation stage
>>> builder2 = RegimeBuilder(intermediate_data)
>>> regime_data = builder2.run_regime()
```

**Example 5: Accessing and analyzing regime transitions**

```
>>> regime_data = builder.run_regime()
>>> # Count regime occurrences
>>> regime_counts = regime_data['Regime'].value_counts()
>>> # Identify regime transitions
>>> regime_data['Regime_Change'] = (
...     regime_data['Regime'] != regime_data['Regime'].shift(1)
... )
>>> transitions = regime_data[regime_data['Regime_Change']]
>>> print(f"Number of regime transitions: {len(transitions)}")
```

See also

[`transform_data`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data")

Apply configured transformations to source data

[`run_regime`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.run_regime "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.run_regime")

Generate regime indicators and classifications

[`data_transformations_widget`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.data_transformations_widget "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.data_transformations_widget")

Display interactive GUI for transformation setup

data\_transformations\_widget()[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.data_transformations_widget "Link to this definition")

Display interactive GUI widget for configuring data transformations.

This method renders a user-friendly Jupyter interface that allows users to interactively configure transformations without writing code. The widget automatically updates the `transformations` property as users make selections.

The widget interface provides:

-   **Series selector**: Dropdown menu to select source data columns
    
-   **Transformer selector**: Dropdown menu to choose transformation function
    
-   **Parameter controls**: Dynamic widgets (sliders, inputs) for transformation parameters
    
-   **Add button**: Create additional transformation configurations
    
-   **Remove buttons**: Delete unwanted transformation rows
    
-   **Preview area**: Live preview of transformed data structure
    

Returns:

Displays widget directly in Jupyter notebook output

Return type:

None

Notes

-   Designed exclusively for Jupyter notebook environments
    
-   Widget state persists across multiple calls (no duplication)
    
-   Parameter widgets adapt dynamically based on selected transformer
    
-   Changes are immediately reflected in the `transformations` property
    
-   Call `transform_data()` after configuration to apply transformations
    

### Widget Behavior[#](https://fpe.factset.com/docs/global_macro_data.html#widget-behavior "Link to this heading")

-   **Series Selection**: Choose which column from source data to transform
    
-   **Transformer Selection**: Pick transformation function (updates parameter widgets)
    
-   **Parameter Configuration**: Adjust transformation-specific parameters
    
-   **Multiple Rows**: Add multiple transformations for different series
    
-   **Real-time Updates**: Preview updates automatically when calling `transform_data()`
    

Examples

**Example 1: Basic usage in Jupyter:**

```
>>> import pandas as pd
>>> from datetime import datetime
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> builder = RegimeBuilder(macro_data)
>>> builder.data_transformations_widget()
>>> # Interactive widget appears with dropdown menus and parameter controls
>>> # User selects transformations via GUI
>>> # No code needed to configure transformations
```

**Example 2: Workflow with widget:**

```
>>> # Step 1: Display widget
>>> builder.data_transformations_widget()
>>>
>>> # Step 2: User interacts with GUI to configure transformations
>>> # (Select series, choose transformers, set parameters, add rows)
>>>
>>> # Step 3: Execute transformations
>>> transformed = builder.transform_data()
>>>
>>> # Step 4: Generate regimes
>>> regimes = builder.run_regime()
```

Combining GUI and programmatic approaches:

```
>>> # Start with GUI
>>> builder.data_transformations_widget()
>>> # User makes some selections
>>>
>>> # Programmatically add more transformations
>>> current = builder.transformations
>>> current.append({
...     "column": "New_Series",
...     "transformer": "Raw Data",
...     "params": {"scaling": 1.0, "normalize": False}
... })
>>> builder.transformations = current
```

See also

[`transformations`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transformations "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transformations")

Property for programmatic transformation configuration

[`transform_data`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data")

Method to execute configured transformations

run\_regime()[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.run_regime "Link to this definition")

Generate regime indicators from regime factors and classify each period into a distinct regime.

This method creates the final regime model by converting transformed data into binary regime indicators and combining them to produce unique regime classifications. Each historical period is mapped to a specific regime state.

The regime generation process:

1.  **Input Validation**: Ensure transformed data exists or create default
    
2.  **Indicator Generation**: Convert each series to binary (1 for positive, 0 for non-positive)
    
3.  **Regime Classification**: Combine indicators to create unique regime labels
    
4.  **Result Assembly**: Merge transformed data, indicators, and regime labels
    

Returns:

Complete regime dataset containing:

-   All transformed series (`"{column} - Regime Factor"`)
    
-   Binary regime indicators (`"{column} - Regime Indicator"`)
    
-   Regime classification column (`"Regime"`)
    

Return type:

pd.DataFrame

Raises:

**ValueError** – If more than 10 indicators are present (computational limit: 2^10 = 1024 regimes)

Notes

-   If no transformations configured, applies Raw Data transformer to all columns
    
-   Automatically calls `transform_data()` if not already executed
    
-   Regime labels are generic identifiers (not interpretable as “expansion”, “recession”, etc.)
    
-   Maximum 10 indicators supported to prevent excessive regime fragmentation
    
-   Regime data is cached for consistent results across multiple calls
    

### Regime Indicator Logic[#](https://fpe.factset.com/docs/global_macro_data.html#regime-indicator-logic "Link to this heading")

For each transformed series:

-   Values > 0 → Indicator = 1
    
-   Values <= 0 → Indicator = 0
    

Regime labels are created by combining all indicators, effectively creating 2^N possible regimes where N is the number of indicators.

Examples

**Example 1: Basic regime generation:**

```
>>> import pandas as pd
>>> from datetime import datetime
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> builder = RegimeBuilder(macro_data)
>>> builder.transformations = [
...     {"column": "GDP", "transformer": "Difference",
...      "params": {"scaling": 1.0, "normalize": True}}
... ]
>>> regime_data = builder.run_regime()
>>> print(regime_data.columns)
Index(['GDP - Regime Factor', 'GDP - Regime Indicator', 'Regime'], dtype='object')
```

**Example 2: Analyze regime distribution:**

```
>>> regime_data = builder.run_regime()
>>> print(regime_data['Regime'].value_counts())
Regime_0    45
Regime_1    38
Name: Regime, dtype: int64
```

**Example 3: Multiple indicators create more regimes:**

```
>>> builder.transformations = [
...     {"column": "GDP", "transformer": "Difference",
...      "params": {"scaling": 1.0, "normalize": True}},
...     {"column": "Inflation", "transformer": "Difference",
...      "params": {"scaling": 1.0, "normalize": True}}
... ]
>>> regime_data = builder.run_regime()
>>> # Now up to 4 possible regimes (2^2)
>>> print(regime_data['Regime'].value_counts())
```

**Example 4: Direct regime generation without transformations:**

```
>>> import pandas as pd
>>> from datetime import datetime
>>> from fds.fpe.quant.global_macro  import RegimeBuilder
>>>
>>> builder = RegimeBuilder(macro_data)
>>> regime_data = builder.run_regime()
>>> # Uses raw data values to create indicators
```

**Example 5: Identify regime transitions:**

```
>>> regime_data = builder.run_regime()
>>> regime_data['Regime_Changed'] = (
...     regime_data['Regime'] != regime_data['Regime'].shift(1)
... )
>>> transition_dates = regime_data[regime_data['Regime_Changed']].index
>>> print(f"Regime transitions occurred on: {list(transition_dates)}")
```

**Example 6: Use regimes for conditional analysis:**

```
>>> regime_data = builder.run_regime()
>>> for regime_name in regime_data['Regime'].unique():
...     regime_subset = regime_data[regime_data['Regime'] == regime_name]
...     print(f"{regime_name}: {len(regime_subset)} periods")
...     print(regime_subset[['GDP - Regime Factor']].describe())
```

See also

[`transform_data`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data")

Apply transformations before regime generation

`add_regime_indicator_columns`

Function that creates binary indicators

`add_regime_column`

Function that creates regime classifications

transform\_data()[#](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transform_data "Link to this definition")

Apply configured transformations to source data.

This method processes source data through all configured transformations, creating new columns with standardized naming (`" - Regime Factor"` suffix). Missing values resulting from transformations are automatically dropped.

The transformation pipeline:

1.  Validate that transformations are configured
    
2.  For each transformation configuration:
    
    1.  Extract source column and transformer function
        
    2.  Apply transformer with specified parameters
        
    3.  Apply normalization if requested
        
    4.  Append result with “ - Regime Factor” suffix
        
3.  Combine all transformed series into DataFrame
    
4.  Drop rows with any missing values
    
5.  Cache result and update widget preview
    

Returns:

Transformed data ready for regime analysis. Column names follow format: `"{original_column_name} - Regime Factor"`

Return type:

pd.DataFrame

Raises:

-   **ValueError** – If transformation parameters are invalid (e.g., ma1 >= ma2)
    
-   **Exception** – If transformation function encounters an error
    

Notes

-   Transformed data is cached internally for consistency
    
-   Multiple calls return the same cached result unless transformations change
    
-   Widget preview updates automatically if GUI is active
    
-   Missing values are dropped to ensure clean regime analysis
    
-   Original source data remains unmodified
    

Warning

Rows with NaN values (from transformations like pct\_change or diff) are silently dropped. Ensure sufficient data history for transformations like MA1 minus MA2.

Examples

**Example 1: Basic transformation:**

```
>>> builder.transformations = [
...     {"column": "GDP", "transformer": "Percentage Return",
...      "params": {"scaling": 100.0, "normalize": False}}
... ]
>>> transformed = builder.transform_data()
>>> transformed.columns
Index(['GDP - Regime Factor'], dtype='object')
```

**Example 2: Multiple transformations:**

```
>>> builder.transformations = [
...     {"column": "GDP", "transformer": "Difference",
...      "params": {"scaling": 1.0, "normalize": True}},
...     {"column": "CPI", "transformer": "MA1 minus MA2",
...      "params": {"ma1": 3, "ma2": 12, "scaling": 100.0, "normalize": True}}
... ]
>>> transformed = builder.transform_data()
>>> print(transformed.head())
```

Inspect transformed data before regime generation:

```
>>> transformed = builder.transform_data()
>>> print(f"Shape: {transformed.shape}")
>>> print(f"Date range: {transformed.index[0]} to {transformed.index[-1]}")
>>> print(transformed.describe())
```

See also

[`run_regime`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.run_regime "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.run_regime")

Generate regime indicators and classifications from transformed data

[`transformations`](https://fpe.factset.com/docs/global_macro_data.html#fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transformations "fds.fpe.quant.global_macro.regime_factor_builder.RegimeBuilder.transformations")

Property containing transformation configurations
