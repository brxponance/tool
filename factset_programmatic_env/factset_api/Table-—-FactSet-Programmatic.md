---
created: 2026-05-11T13:08:51 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/table.html
author: 
---

# Table — FactSet Programmatic

> ## Excerpt
> An ipywidget for displaying structured tabular data.
Suited for financial summaries, comparison tables, blotters, and similar
presentation-quality layouts. Tables size to fit their content by default and are
intended for smaller datasets where visual presentation is the priority.

---
An `ipywidget` for displaying structured tabular data. Suited for financial summaries, comparison tables, blotters, and similar presentation-quality layouts. Tables size to fit their content by default and are intended for smaller datasets where visual presentation is the priority.

## Key capabilities[#](https://fpe.factset.com/docs/table.html#key-capabilities "Link to this heading")

-   **Flexible input** — accepts a pandas DataFrame or plain Python dicts
    
-   **Nested rows** — group rows with collapsible children
    
-   **Multi-level column headers** — column groups with child columns
    
-   **Conditional formatting** — per-column or global `CellStyle` with Python callables
    
-   **Number formatting** — decimal places, percent, and currency display
    
-   **Pagination** — optional page controls for longer tables
    
-   **Reactive updates** — reassign any attribute from Python to refresh the display
    

## Quick start[#](https://fpe.factset.com/docs/table.html#quick-start "Link to this heading")

**From a DataFrame:**

```
import pandas as pd
from fds.fpe.datagrid import Table

df = pd.DataFrame({'ticker': ['AAPL', 'MSFT'], 'price': [189.45, 415.10], 'chg': [2.5, -1.2]})
Table(dataframe=df)
```

**From dicts:**

```
from fds.fpe.datagrid import Table, CellStyle

Table(
    columns=[
        {'id': 'ticker', 'label': 'Ticker', 'width': 80},
        {'id': 'price',  'label': 'Price',  'width': 100, 'number_format': {'decimals': 2}},
        {'id': 'chg',    'label': 'Chg',    'width': 80},
    ],
    rows=[
        {'label': 'AAPL', 'ticker': 'AAPL', 'price': 189.45, 'chg': 2.5},
        {'label': 'MSFT', 'ticker': 'MSFT', 'price': 415.10, 'chg': -1.2},
    ],
    renderers={
        'chg': CellStyle(
            background=lambda v: '#eeffee' if v > 0 else '#ffeeee' if v < 0 else None,
            color=lambda v: '#006600' if v > 0 else '#cc0000' if v < 0 else None,
        ),
    },
)
```

## API reference[#](https://fpe.factset.com/docs/table.html#api-reference "Link to this heading")

_class_ fds.fpe.datagrid.Table(_\*\*kwargs: Any_)[#](https://fpe.factset.com/docs/table.html#fds.fpe.datagrid.Table "Link to this definition")

An FPE table widget for displaying structured data.

Currently accepts either a Pandas Dataframe or plain Python dicts for row and column data. Exactly one of these initialization methods must be used.

Parameters:

-   **dataframe** (_pandas.DataFrame__,_ _optional_) –
    
    DataFrame to display. Columns are inferred from the DataFrame:
    
    -   integer dtypes → `'numericint'`
        
    -   float → `'numericfloat'`
        
    -   datetime → `'date'`
        
    -   all others → `'text'`
        
    -   If the index is named or non-default, its values are used as row `label`.
        
    -   Cannot be combined with `rows` / `columns`.
        
-   **columns** (_list__\[__dict__\]__,_ _optional_) –
    
    List of column dicts. Each dict may contain the following fields:
    
    -   `id` (str, **required**): unique key used to match row cell data.
        
    -   `label` (str, optional): display text for the column header. Defaults to `id`.
        
    -   `width` (int | float, optional): column width in pixels. Can also be set or overridden via the `column_widths` parameter.
        
    -   `type` (str, optional): one of `'numeric'`, `'numericint'`, `'numericfloat'`, `'numericdouble'`, `'date'`, `'mixed'`, `'text'`.
        
    -   `alignment` (str, optional): one of `'left'`, `'right'`, `'center'`. Defaults to `'right'` for numeric types, `'left'` for all others.
        
    -   `group_id` (str, optional): links this column to a column group.
        
    -   `lines` (int, optional): number of lines for the column header.
        
    -   `number_format` (dict, optional): number formatting options. Supported keys:
        
        -   `decimals` (int): shorthand — sets both minimum and maximum decimal places.
            
        -   `min_decimals` (int): minimum decimal places always shown.
            
        -   `max_decimals` (int): maximum decimal places shown.
            
        -   `style` (str): `'decimal'` (default), `'percent'`, or `'currency'`.
            
        -   `currency` (str): ISO 4217 code, e.g. `'USD'`. Required when `style='currency'`.
            
        -   `use_grouping` (bool): whether to insert thousands separators. Defaults to `True`.
            
        
        `decimals` takes precedence over `min_decimals`/`max_decimals` when both are set. Columns with `style='percent'` or `style='currency'` are automatically converted to `type='text'` and values are pre-formatted (`style='percent'` treats the value as a proportion: pass `0.056` to display `5.6%`).
        
    -   `children` (list\[dict\], optional): nested child columns, same structure.
        
-   **rows** (_list__\[__dict__\]__,_ _optional_) –
    
    List of row dicts (mutually exclusive with `dataframe`). Cell data is keyed by the column’s `id`. All fields are optional:
    
    -   `id` (str, optional): unique row identifier. Auto-generated if omitted.
        
    -   `label` (str, optional): display text for the row header.
        
    -   `group` (bool, optional): whether the row is a group header.
        
    -   `show_data` (bool, optional): whether a group row also shows its own data.
        
    -   `children` (list\[dict\], optional): nested child rows, same structure.
        
-   **height** (_int_ _|_ _float_ _|_ _str__,_ _optional_) – Height of the table container. A number is treated as pixels (e.g. `400` or `100.5` → `'400px'`, `'100.5px'`). A string must end with `'px'` or `'%'` (e.g. `'400px'`, `'50%'`). Default `None` (auto-sized by content / notebook cell output).
    
-   **width** (_int_ _|_ _float_ _|_ _str__,_ _optional_) – Width of the table container. A number is treated as pixels (e.g. `800` or `100.5` → `'800px'`, `'100.5px'`). A string must end with `'px'` or `'%'` (e.g. `'800px'`, `'100%'`). Default `None` (fills available width).
    
-   **font\_size** (_str__,_ _optional_) – Named font size. One of `'auto'`, `'extrasmall'`, `'small'`, `'medium'`, `'large'`, `'extralarge'`. Default `None` (inherits table default).
    
-   **font\_size\_px** (_int__,_ _optional_) – Exact font size in pixels. Overrides `font_size` when set. Default `None`.
    
-   **tight\_wrap** (_bool__,_ _optional_) – If `True`, reduces line spacing for wrapped text. Default `False`.
    
-   **page\_size** (_int__,_ _optional_) – Maximum number of rows per page when pagination is enabled. Default `100`.
    
-   **paginate** (_bool__,_ _optional_) – If `True`, renders the table with pagination controls. Default `False`.
    
-   **stack\_enabled** (_bool__,_ _optional_) – If `True`, switches to a stacked card layout when the viewport is narrower than 640px. Default `False`.
    
-   **text\_casing** (_str__,_ _optional_) – Text casing applied to all cells. One of `'default'`, `'uppercase'`. Default `None` (inherits table default).
    
-   **spacing\_mode** (_str__,_ _optional_) – Row spacing density. One of `'default'`, `'compact'`, `'minimal'`, `'spacious'`. Default `None` (inherits table default).
    
-   **column\_widths** (_dict__,_ _optional_) – Mapping of column `id` (str) to width in pixels (int or float). Overrides any `width` set on the column definition. Default `None`.
    
-   **column\_formats** (_dict__,_ _optional_) – Mapping of column `id` (str) to a `number_format` options dict (same schema as `number_format` on each column dict). Overrides any `number_format` set directly on the column definition. Intended as the primary formatting API when DataFrame support is added — pass column names as keys instead of repeating format options inside each column dict. Default `None`.
    
-   **renderers** (_dict__\[__str__,_ _CellStyle__\]__,_ _optional_) –
    
    Per-column conditional formatting. Maps column `id` to a `CellStyle` instance. Styles are evaluated in Python and embedded in each row before sync, so any Python callable — including lambdas and named functions — works. Default `{}`:
    
    ```
    renderers={
        'chg': CellStyle(
            background=lambda v: '#eeffee' if v > 0 else '#ffeeee' if v < 0 else None,
            color=lambda v: '#007700' if v > 0 else '#cc0000' if v < 0 else None,
        ),
    }
    ```
    
    Two-argument callables also receive the full row dict as a second argument, enabling cross-column formatting:
    
    ```
    renderers={
        'price': CellStyle(
            background=lambda v, row: '#ffdddd' if row.get('signal') == 'Sell' else None,
        ),
    }
    ```
    
    Reassigning `renderers` updates cell colors reactively without rerunning the cell. Takes precedence over `default_renderer` for any column listed as a key.
    
-   **default\_renderer** (_CellStyle__,_ _optional_) –
    
    Fallback `CellStyle` applied to every column **not** listed in `renderers`. Useful for applying a uniform style (e.g. green/red sign coloring) across all columns without listing each one explicitly. Default `None`:
    
    ```
    default_renderer=CellStyle(
        background=lambda v: '#eeffee' if isinstance(v, (int, float)) and v > 0
                        else '#ffeeee' if isinstance(v, (int, float)) and v < 0
                        else None,
    )
    ```
    
    Reassigning `default_renderer` (including setting it to `None` to remove it) updates cell colors reactively.
    

Examples

### Basic table[#](https://fpe.factset.com/docs/table.html#basic-table "Link to this heading")

```
>>> from fds.fpe.datagrid import Table
```

```
>>> table = Table(
...     columns=[{'id': 'name', 'label': 'Name', 'width': 200},
...              {'id': 'age', 'label': 'Age', 'width': 100, 'type': 'numeric'}],
...     rows=[{'label': 'Alice', 'name': 'Alice', 'age': 30},
...           {'label': 'Bob', 'name': 'Bob', 'age': 25}],
... )
```

### From a pandas DataFrame (index used as row label)[#](https://fpe.factset.com/docs/table.html#from-a-pandas-dataframe-index-used-as-row-label "Link to this heading")

```
>>> import pandas as pd
>>> df = pd.DataFrame({'name': ['Alice', 'Bob'], 'age': [30, 25]})
>>> df.index.name = 'label'  # optional: use the index as the row label
>>> Table(dataframe=df)
```

### DataFrame with column formatting[#](https://fpe.factset.com/docs/table.html#dataframe-with-column-formatting "Link to this heading")

```
>>> df = pd.DataFrame({'ticker': ['AAPL', 'MSFT'], 'price': [189.45, 415.10], 'chg': [0.025, -0.012]})
>>> Table(
...     dataframe=df,
...     column_formats={
...         'price': {'decimals': 2},
...         'chg': {'style': 'percent', 'decimals': 1},
...     },
... )
```

### Sizing (height and width)[#](https://fpe.factset.com/docs/table.html#sizing-height-and-width "Link to this heading")

```
>>> # fixed pixel height and width
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], height=400, width=600)
```

```
>>> # percentage width, fixed height
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], height='300px', width='100%')
```

### Column widths[#](https://fpe.factset.com/docs/table.html#column-widths "Link to this heading")

```
>>> Table(
...     columns=[{'id': 'ticker'}, {'id': 'price'}, {'id': 'chg'}],
...     rows=[{'label': 'AAPL', 'ticker': 'AAPL', 'price': 189.45, 'chg': 2.5}],
...     column_widths={'ticker': 80, 'price': 100, 'chg': 80},
... )
```

### Nested group rows (parent with children)[#](https://fpe.factset.com/docs/table.html#nested-group-rows-parent-with-children "Link to this heading")

```
>>> Table(
...     columns=[{'id': 'metric'}, {'id': 'value', 'type': 'numeric'}],
...     rows=[
...         {'id': 'g1', 'label': 'Group 1', 'group': True, 'show_data': False, 'children': [
...             {'label': 'r1', 'metric': 'A', 'value': 10},
...             {'label': 'r2', 'metric': 'B', 'value': 20},
...         ]},
...         {'label': 'orphan', 'metric': 'C', 'value': 5},
...     ],
... )
```

### Column groups / multi-level headers[#](https://fpe.factset.com/docs/table.html#column-groups-multi-level-headers "Link to this heading")

```
>>> Table(
...     columns=[
...         {'id': 'g1', 'label': 'Group A', 'children': [
...             {'id': 'a1', 'label': 'A1'}, {'id': 'a2', 'label': 'A2'}
...         ]},
...         {'id': 'b', 'label': 'B'},
...     ],
...     rows=[{'label': 'r1', 'a1': 1, 'a2': 2, 'b': 3}],
... )
```

### Number formatting examples[#](https://fpe.factset.com/docs/table.html#number-formatting-examples "Link to this heading")

```
>>> # decimals shorthand (sets both min/max)
>>> Table(columns=[{'id': 'x', 'type': 'numeric'}], rows=[{'label':'r','x': 1.2345}], column_formats={'x': {'decimals': 2}})
```

```
>>> # percent style: value is a fraction (0.056 -> 5.6%)
>>> Table(columns=[{'id': 'p'}], rows=[{'label':'r','p': 0.056}], column_formats={'p': {'style': 'percent', 'decimals': 1}})
```

```
>>> # currency style (requires ISO currency code)
>>> Table(columns=[{'id': 'amt'}], rows=[{'label':'r','amt': 1234.5}], column_formats={'amt': {'style': 'currency', 'currency': 'USD', 'decimals': 2}})
```

### Conditional formatting: renderers and default\_renderer[#](https://fpe.factset.com/docs/table.html#conditional-formatting-renderers-and-default-renderer "Link to this heading")

```
>>> from fds.fpe.datagrid import CellStyle
>>> Table(
...     columns=[{'id': 'chg'}, {'id': 'signal'}],
...     rows=[{'label': 'A', 'chg': 2, 'signal': 'Buy'}, {'label': 'B', 'chg': -1, 'signal': 'Sell'}],
...     renderers={
...         'chg': CellStyle(
...             background=lambda v: '#eeffee' if v > 0 else '#ffeeee' if v < 0 else None,
...             color=lambda v: '#006600' if v > 0 else '#990000' if v < 0 else None,
...         ),
...     },
... )
```

```
>>> # two-argument renderer can use other cells in the same row
>>> Table(
...     columns=[{'id': 'price'}, {'id': 'signal'}],
...     rows=[{'label': 'A', 'price': 10, 'signal': 'Buy'}],
...     renderers={'price': CellStyle(background=lambda v, row: '#ffdddd' if row.get('signal') == 'Sell' else None)},
... )
```

```
>>> # default_renderer applies to all columns not listed in `renderers`
>>> Table(
...     columns=[{'id': 'a'}, {'id': 'b'}],
...     rows=[{'label': 'r', 'a': 1, 'b': -1}],
...     default_renderer=CellStyle(background=lambda v: '#eeffee' if isinstance(v, (int, float)) and v > 0 else '#ffeeee' if isinstance(v, (int, float)) and v < 0 else None),
... )
```

### Display options[#](https://fpe.factset.com/docs/table.html#display-options "Link to this heading")

```
>>> # compact row spacing
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], spacing_mode='compact')
```

```
>>> # minimal spacing for the densest layout
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], spacing_mode='minimal')
```

```
>>> # named font size
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], font_size='small')
```

```
>>> # exact font size in pixels
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], font_size_px=12)
```

```
>>> # reduce line spacing for wrapped text
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], tight_wrap=True)
```

```
>>> # uppercase text casing
>>> Table(columns=[{'id': 'x'}], rows=[{'label': 'r', 'x': 1}], text_casing='uppercase')
```

### Pagination and responsive stack layout[#](https://fpe.factset.com/docs/table.html#pagination-and-responsive-stack-layout "Link to this heading")

```
>>> Table(columns=[{'id': 'i'}], rows=[{'label': str(i), 'i': i} for i in range(50)], paginate=True, page_size=10, stack_enabled=True)
```

### Reactive updates (change properties from Python)[#](https://fpe.factset.com/docs/table.html#reactive-updates-change-properties-from-python "Link to this heading")

```
>>> t = Table(columns=[{'id': 'x'}, {'id': 'y'}], rows=[{'label': 'r1', 'x': 1, 'y': 2}])
>>> t.rows = [{'label': 'r2', 'x': 3, 'y': 4}]  # update data
>>> t.column_formats = {'x': {'decimals': 0}}  # update formatting
>>> t.column_widths = {'x': 120, 'y': 80}  # update widths
>>> t.renderers = {'y': CellStyle(color=lambda v: '#f00' if v < 0 else None)}  # update styles
>>> t.default_renderer = None  # remove default renderer
```

```
>>> # reassign dataframe when initialized with a DataFrame
>>> t = Table(dataframe=df)
>>> t.dataframe = pd.DataFrame({'name': ['Carol'], 'age': [40]})  # update data reactively
```

Warning

`dataframe` and `rows`/`columns` are mutually exclusive — exactly one must be provided. Passing both (or neither) raises a `ValueError`.

Warning

When initialized with a `dataframe`, reassigning `rows` or `columns` directly raises a `ValueError`. Update the data by reassigning `dataframe` instead.

Warning

Every column dict must include an `id` field. There is no fallback if it is missing.

Note

`style='percent'` treats values as proportions — pass `0.056` to display `5.6%`. Columns with `style='percent'` or `style='currency'` are automatically converted to `type='text'` and values are pre-formatted.

Note

`renderers` takes precedence over `default_renderer` for any column listed as a key in `renderers`.
