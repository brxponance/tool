---
created: 2026-05-11T13:08:46 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/data_grid.html
author: 
---

# DataGrid — FactSet Programmatic

> ## Excerpt
> An ipywidget for displaying a pandas DataFrame in a remote grid view in FPE.
Suited for large datasets where interactive exploration — sorting, grouping, and
statistics — is the priority.

---
An `ipywidget` for displaying a pandas DataFrame in a remote grid view in FPE. Suited for large datasets where interactive exploration — sorting, grouping, and statistics — is the priority.

## Key capabilities[#](https://fpe.factset.com/docs/data_grid.html#key-capabilities "Link to this heading")

-   **Large DataFrame rendering** — streams data efficiently for large tables
    
-   **Pinned columns** — freeze columns to keep them visible while scrolling
    
-   **Column widths** — set per-column or default widths; auto-fit to content
    
-   **Decimal formatting** — per-column or global decimal precision
    
-   **Column visibility and order** — show/hide and reorder columns
    
-   **Row grouping** — group rows by one or more columns
    
-   **Summary statistics** — per-column aggregate shown as a header row
    
-   **Download button** — optional CSV export control
    
-   **Multi-level columns** — supports DataFrames with multi-indexed columns
    

## Quick start[#](https://fpe.factset.com/docs/data_grid.html#quick-start "Link to this heading")

```
import pandas as pd
from fds.fpe.datagrid import DataGrid

df = pd.DataFrame({
    'ticker': ['AAPL', 'MSFT', 'GOOG'],
    'price':  [189.45, 415.10, 140.23],
    'chg':    [2.5, -1.2, 0.8],
})
DataGrid(df)
```

**With common options:**

```
DataGrid(
    df,
    pinned_columns=['ticker'],
    column_widths={'ticker': 80, 'price': 100, 'chg': 80},
    decimals={'price': 2, 'chg': 1},
    statistics={'price': 'mean', 'chg': 'sum'},
    download=True,
)
```

## Reassigning the DataFrame[#](https://fpe.factset.com/docs/data_grid.html#reassigning-the-dataframe "Link to this heading")

Assign a new DataFrame to `df` to update the grid without recreating the widget:

```
datagrid = DataGrid(df)
datagrid.df = new_df
```

## Multi-level columns[#](https://fpe.factset.com/docs/data_grid.html#multi-level-columns "Link to this heading")

DataGrid handles DataFrames with multi-indexed columns seamlessly:

```
arrays = [['A', 'A', 'B', 'B'], ['one', 'two', 'one', 'two']]
tuples = list(zip(*arrays))
columns = pd.MultiIndex.from_tuples(tuples, names=['first', 'second'])

multi_col_df = pd.DataFrame(
    [[1, 2, 3, 4], [5, 6, 7, 8]],
    index=['row1', 'row2'],
    columns=columns,
)
DataGrid(multi_col_df)
```

Warning

Limitations with multi-indexed DataFrames:

-   Normal columns cannot be dragged into or to the boundaries of a multi-columned section.
    
-   Split columns can only be moved within their own section.
    

## API reference[#](https://fpe.factset.com/docs/data_grid.html#api-reference "Link to this heading")

_class_ fds.fpe.datagrid.DataGrid(_\*\*kwargs: Any_)[#](https://fpe.factset.com/docs/data_grid.html#fds.fpe.datagrid.DataGrid "Link to this definition")

A widget for displaying a remote grid.

Parameters:

-   **df** (_pd.DataFrame_) – The DataFrame to be displayed in the remote grid.
    
-   **width** (_int__,_ _float__, or_ _str__,_ _optional_) – The width of the widget. Can be specified as an integer or float (in pixels) or as a string with ‘px’ or ‘%’ units.
    
-   **height** (_int__,_ _float__, or_ _str__,_ _optional_) – The height of the widget. Can be specified as an integer or float (in pixels) or as a string with ‘px’ or ‘%’ units.
    
-   **pinned\_columns** (_list_ _of_ _str__,_ _optional_) – A list of column names to be pinned in the grid.
    
-   **column\_widths** (_list_ _of_ _int__,_ _float__, or_ _str__,_ _optional_) – A list specifying the widths of the columns. Each width can be an integer or float (in pixels) or a string with ‘px’ units. If not specified, the default width of 100px will be used.
    
-   **auto\_fit\_columns** (_bool__,_ _optional_) – If True, columns will automatically adjust their widths to fit the content.
    
-   **default\_column\_width** (_int__,_ _float__, or_ _str__,_ _optional_) – The default width to use for columns not specified in the column\_widths list.
    
-   **decimals** (_dict__,_ _optional_) – A dictionary mapping column names to the number of decimal places to display for numeric columns.
    
-   **default\_decimals** (_int__,_ _optional_) – The default number of decimal places to display for numeric columns not specified in the decimals dictionary.
    
-   **displayed\_columns** (_list_ _of_ _str__,_ _optional_) – A list of column names to display in the grid, in the specified order. Columns not listed will be hidden. If not specified, all columns will be displayed. Note: Columns in pinned\_columns will always be shown even if not listed here.
    
-   **statistics** (_dict__,_ _optional_) – A dictionary mapping column names to an aggregate statistic shown as a summary row at the top of the grid (e.g., ‘mean’, ‘median’, ‘count’, ‘minimum’, ‘maximum’, ‘sum’).
    
-   **default\_statistic** (_str__,_ _optional_) – The default statistic applied to all columns not specified in the statistics dictionary.
    
-   **download** (_bool__,_ _optional_) – If True, displays a download button in the grid. If False (default), the download button is hidden.
    
-   **group\_by** (_list_ _of_ _str__,_ _optional_) – A list of column names to group by. Columns will be grouped in the order specified.
    

Examples

```
>>> import pandas as pd
>>> from fds.fpe.datagrid import DataGrid
```

```
>>> # Create a sample DataFrame
>>> df = pd.DataFrame({
...     'A': [1, 2, 3],
...     'B': [4, 5, 6]
... })
```

```
>>> # Create a DataGrid widget with default width and height
>>> grid = DataGrid(df)
```

```
>>> # Create a DataGrid widget with specified width and height as integers. Read as pixels.
>>> grid = DataGrid(df, width=600, height=400)
```

```
>>> # Create a DataGrid widget with specified width and height as strings. Read as pixels.
>>> grid = DataGrid(df, width='600px', height='400px')
```

```
>>> # Create a DataGrid widget with specified width and height in percentage
>>> grid = DataGrid(df, width='100%', height='50%')
```

```
>>> # Create a DataGrid widget with pinned columns
>>> grid = DataGrid(df, pinned_columns=['A'])
```

```
>>> # Create a DataGrid widget with specified column widths
>>> grid = DataGrid(df, column_widths={'A': '150px', 'B': 200})
```

```
>>> # Create a DataGrid widget with auto fit columns
>>> grid = DataGrid(df, auto_fit_columns=True)
```

```
>>> # Create a DataGrid widget with default column width
>>> grid = DataGrid(df, default_column_width='100px')
```

```
>>> # Create a DataGrid widget with custom decimal formatting
>>> grid = DataGrid(df, decimals={'A': 2, 'B': 4}, default_decimals=1)
```

```
>>> # Create a DataGrid widget with specific columns displayed in the order listed
>>> grid = DataGrid(df, displayed_columns=['B', 'A'])
```

```
>>> # Create a DataGrid widget with statistics
>>> grid = DataGrid(df, statistics={'A': 'sum', 'B': 'median'})
```

```
>>> # Create a DataGrid widget with default statistics
>>> grid = DataGrid(df, default_statistic='mean')
```

```
>>> # Create a DataGrid widget with download button enabled
>>> grid = DataGrid(df, download=True)
```

```
>>> # Create a DataGrid widget with row grouping
>>> grid = DataGrid(df, group_by=['A', 'B'])
```

Note

**Interaction between \`\`pinned\_columns\`\` and \`\`displayed\_columns\`\`:**

-   Pinned columns always remain visible even if omitted from `displayed_columns`.
    
-   Unpinning a column keeps it visible rather than hiding it.
    
-   Pinned columns cannot be hidden until they are unpinned first.
    
-   When unpinned, columns default to the front of the table.
    
-   Changes to these parameters require re-displaying the widget to take effect.
    

Warning

DataFrame columns should not contain mixed data types. Pass DataFrames with a consistent type per column.
