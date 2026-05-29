---
created: 2026-05-11T13:04:29 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/universe.html
author: 
---

# Universe — FactSet Programmatic

> ## Excerpt
> A universe in FPE defines the set of securities you want to analyze for a given time series. There
are many ways to define a universe in FPE but they all share a common interface.

---
## Universe[#](https://fpe.factset.com/docs/universe.html#id1 "Link to this heading")

A universe in FPE defines the set of securities you want to analyze for a given time series. There are many ways to define a universe in FPE but they all share a common interface.

Every universe in FPE will have the following attributes.

> symbols:
> 
> A list of all unique symbols within the universe.
> 
> time\_series:
> 
> The time series associated with the universe.
> 
> dates:
> 
> Provides quick access to the list of datetime objects derived from the time\_series.
> 
> constituents:
> 
> A pandas DataFrame representing the constituents of the universe. This DataFrame is indexed by symbol and there is a colum for each period of the universe’s time series that indicate if this symbol existed in this universe on this period.
> 
> ison\_univ:
> 
> A pandas DataFrame indexed by \[‘date’, ‘symbol’\] with a column labeled ‘ison\_univ’ which tells you which symbols were in the universe for each period. This is basically a transposed representation of the constituents which allows you to easily merge this information with any other DataFrame that is also indexed by \[‘date’, ‘symbol’\].
> 
> univ\_type:
> 
> The universe type provided in the constructor.

### IdentifierUniverse[#](https://fpe.factset.com/docs/universe.html#identifieruniverse "Link to this heading")

```
from fds.fpe.universe import IdentifierUniverse
from fds.fpe.dates import TimeSeries

identifier_univ = IdentifierUniverse(['FDS-US'], time_series=TimeSeries(start='-5AM', freq='M'))
```

_class_ fds.fpe.universe.IdentifierUniverse(_identifiers_, _univ\_type\=UnivType.EQUITY_, _time\_series\=None_, _desc\=None_, _progress\_bar\=False_, _index\_cols\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.IdentifierUniverse "Link to this definition")

Universe of Identifiers.

Define the securities that you want to analyze by providing a list of identifiers.

Parameters:

-   **identifiers** (_list__,_ _DataFrame__,_ _dict__,_ [_OFDB_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB "fds.fpe.ofdb.OFDB") _or_ _str_) – A list of strings representing the identifiers for the securities in your universe. The DataFrame must be indexed by ‘date’ and ‘symbol’. ‘date’ must be a string with format yyyymmdd, yyyy-mm-dd, or yyyy/mm/dd The format of the dictionary can be dict(symbol : dates) or dict(date : symbols), where ‘symbol’ is a string of the symbol of a security and ‘dates’ is a list of dates in formats yyyymmdd, yyyy-mm-dd, yyyy/mm/dd. If your OFDB contains 2 dimensional data, your constituents will exist for every period in the TimeSeries provided from the time\_series parameter. If your OFDB contains 3 dimensional data, time series information will be constructed from the OFDB’s dates. Each period in the time series will ONLY contain symbols that exist in that OFDB for that period. A string will be assumed to be the path to an OFDB.
    
-   **univ\_type** (_str_ _or_ [_fds.fpe.universe.UnivType_](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType "fds.fpe.universe.UnivType")_,_ _optional_) – The type of universe as a string. For example, ‘equity’ or ‘debt’. Alternatively, you can provide a UnivType. By default, UnivType.EQUITY.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series associated with your universe. By default, this will resolve to a default [TimeSeries](https://fpe.factset.com/docs/dates.html#timeseries).
    
-   **desc** (_str__,_ _optional_) – A string describing your universe. This will be displayed in the \_\_repr\_\_ for this object. By default, None
    
-   **index\_cols** (_bool__,_ _optional_) – Display Pandas multi-index as columns on generated screen. Assigned automatically on screen load. Returns True if an R kernel is running. User-passed arguments will override automatic assignment. By default None
    
-   **progress\_bar** (_bool__,_ _optional_) – If True, shows a progress bar during initialization. By default, False.
    

from\_list()[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.IdentifierUniverse.from_list "Link to this definition")

Log that the universe is being created from a list of identifiers.

This method exists solely for logging purposes and performs no additional logic.

Return type:

`None`

### OFDBUniverse[#](https://fpe.factset.com/docs/universe.html#ofdbuniverse "Link to this heading")

```
from fds.fpe.universe import OFDBUniverse

ofdb_univ = OFDBUniverse("Personal:/example.ofdb")
```

_class_ fds.fpe.universe.OFDBUniverse(_ofdb\_path_, _univ\_type\=UnivType.EQUITY_, _time\_series\=None_, _desc\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.OFDBUniverse "Link to this definition")

Universe of Securities Defined by an OFDB.

If your OFDB contains 2 dimensional data, your constituents will exist for every period in the TimeSeries provided from the time\_series parameter.

If your OFDB contains 3 dimensional data, time series information will be constructed from the OFDB’s dates. Each period in the time series will ONLY contain symbols that exist in that OFDB for that period.

Parameters:

-   **ofdb\_path** ([_OFDB_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB "fds.fpe.ofdb.OFDB") _or_ _str_) – The OFDB to read identifiers from or its path.
    
-   **univ\_type** (_str_ _or_ [_fds.fpe.universe.UnivType_](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType "fds.fpe.universe.UnivType")_,_ _optional_) – The type of universe as a string. For example, ‘equity’ or ‘debt’. Alternatively, you can provide a UnivType. By default, UnivType.EQUITY.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series associated with your universe. By default, this will resolve to the dates in your OFDB.
    
-   **desc** (_str__,_ _optional_) – A string describing your universe. This will be displayed in the \_\_repr\_\_ for this object. By default, None.
    
-   **progress\_bar** (_bool__,_ _optional_) – If True, shows a progress bar during initialization. By default, False.
    

### ScreeningExpressionUniverse[#](https://fpe.factset.com/docs/universe.html#screeningexpressionuniverse "Link to this heading")

```
from fds.fpe.universe import ScreeningExpressionUniverse, UnivLimit
from fds.fpe.dates import TimeSeries

screening_univ = ScreeningExpressionUniverse(UnivLimit.SP500, time_series=TimeSeries(start='-5AM', freq='M'))
screening_univ.calculate()
```

**Create from a Screening document**

```
from fds.fpe.universe import ScreeningExpressionUniverse

univ_from_screen_doc = ScreeningExpressionUniverse.from_screen("Personal:/SP500_SALES")
```

_class_ fds.fpe.universe.ScreeningExpressionUniverse(_expression\=None_, _univ\_type\=UnivType.EQUITY_, _time\_series\=None_, _inactive\_securities\=True_, _secondary\_listings\=True_, _nonequity\_securities\=True_, _index\_cols\=None_, _desc\=None_, _progress\_bar\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ScreeningExpressionUniverse "Link to this definition")

Universe of securities defined by a Screening expression.

A Screening expression is a way to fetch data from FactSet’s Screening Engine. It is an easy way to filter down to a specific set of securities to analyze.You can use the same expressions you would use in Screening in FPE.

For example, to analyze securities from a standard benchmark, use FactSet Global Constituents formulas to retrieve those constituents.

\> FG\_CONSTITUENTS(SP50, 0, Close) # Returns the constituents of the S&P 500

Parameters:

-   **expression** (_str_ _or_ _list_) – The Screening expression to be evaluated for every period in the given time series. This can be an expression string or a list of expression strings. If a list of expressions is provided, they will be joined into a single expression using AND logic.
    
-   **univ\_type** (_str_ _or_ [_fds.fpe.universe.UnivType_](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType "fds.fpe.universe.UnivType")_,_ _optional_) – The type of universe as a string. For example, ‘equity’ or ‘debt’. Alternatively, you can provide a UnivType. By default, UnivType.EQUITY.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series associated with your universe. By default, this will resolve to a default [TimeSeries](https://fpe.factset.com/docs/dates.html#timeseries).
    
-   **inactive\_securities** (_bool__,_ _optional_) – Include inactive securities. Inactive securities are securities that have ceased trading due to bankruptcy, M&A activity, etc. By default True.
    
-   **secondary\_listings** (_bool__,_ _optional_) – Include secondary listings. Secondary listings are securities that are linked to a primary listing (e.g., ADR, GDR, etc.). By default True.
    
-   **index\_cols** (_bool__,_ _optional_) – Display Pandas multi-index as columns on generated screen. Assigned automatically on screen load. Returns True if an R kernel is running. User-passed arguments will override automatic assignment. By default None
    
-   **nonequity\_securities** (_bool__,_ _optional_) – Include non-equity securities. Non-equity securities include indices, market statistics, mutual funds, and ETFs. Preferred stock is considered on a case-by-case basis. By default True.
    
-   **desc** (_str__,_ _optional_) – A string describing your universe. This will be displayed in the \_\_repr\_\_ for this object. By default, None
    
-   **progress\_bar** (_bool__,_ _optional_) – An option to display progress bars during calculation. By default, None, displaying a progress bar only while data fetching. If True, an additional is displayed during universe calculation. If False, progress bars are suppressed.
    

expression[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ScreeningExpressionUniverse.expression "Link to this definition")

The screening expression for filtering universe constituents.

Type:

str or list

### ScreeningDocumentUniverse[#](https://fpe.factset.com/docs/universe.html#screeningdocumentuniverse "Link to this heading")

_class_ fds.fpe.universe.ScreeningDocumentUniverse(_screen\_path_, _time\_series\=None_, _desc\=None_, _progress\_bar\=None_, _index\_cols\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ScreeningDocumentUniverse "Link to this definition")

Universe of securities defined by a Screening document.

Define the securities that you want to analyze by specifying a Screening document. The constituents for this universe will be constructed by evaluating the screening document provided for every period in your time series.

Warning

This method of defining a universe can be slow. First, It is worth trying to use a ScreeningExpressionUniverse to reference a Screening document.

Parameters:

-   **screen\_path** (_str_) – The path of the Screening document to use to construct the constituents of this universe.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series associated with your universe. By default, this will resolve to a default [TimeSeries](https://fpe.factset.com/docs/dates.html#timeseries).
    
-   **desc** (_str__,_ _optional_) – A string describing your universe. This will be displayed in the \_\_repr\_\_ for this object. By default, None
    
-   **progress\_bar** (_bool__,_ _optional_) – An option to display progress bars during calculation. By default, is None, and a progress bar is shown only during fetching of data. If True, an additional is displayed during universe calculation. If False, progress bars are suppressed.
    
-   **index\_cols** (_bool__,_ _optional_) – Display Pandas multi-index as columns on generated screen. Assigned automatically on screen load. Returns True if an R kernel is running. User-passed arguments will override automatic assignment. By default None
    

expand\_params()[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ScreeningDocumentUniverse.expand_params "Link to this definition")

Return all screen document parameters with variables replaced with native formulas.

Variables such as parameter references and global variables are replaced.

Return type:

`DataFrame`

_property_ screen\_path[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ScreeningDocumentUniverse.screen_path "Link to this definition")

Get the screening document path.

Returns:

The path of the screening document provided in the constructor.

Return type:

str

### ACTMUniverse[#](https://fpe.factset.com/docs/universe.html#actmuniverse "Link to this heading")

_class_ fds.fpe.universe.ACTMUniverse(_actm\_path_, _time\_series\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ACTMUniverse "Link to this definition")

Universe of securities defined by an ACTM.

Parameters:

-   **actm\_path** (_str_) – The ACTM (account composite) used to define a universe of securities.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series associated with your universe. By default, this will resolve to a default [TimeSeries](https://fpe.factset.com/docs/dates.html#timeseries).
    

exists(_actm\_path\=None_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.ACTMUniverse.exists "Link to this definition")

Check whether the ACTM document exists.

Parameters:

**actm\_path** (_str__,_ _optional_) – The ACTM path to check. By default, None, which uses the path provided in the constructor.

Returns:

True if the ACTM document exists, False otherwise.

Return type:

bool

## UnivLimit[#](https://fpe.factset.com/docs/universe.html#univlimit "Link to this heading")

_enum_ fds.fpe.universe.UnivLimit(_value_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit "Link to this definition")

An Enum representing common benchmarks as Screening expressions.

Valid values are as follows:

SP500 _\= <UnivLimit.SP500: 'FG\_CONSTITUENTS(SP50, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.SP500 "Link to this definition")

SP500\_USA _\= <UnivLimit.SP500\_USA: 'FG\_CONSTITUENTS(SP50-USA, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.SP500_USA "Link to this definition")

SPX _\= <UnivLimit.SPX: 'FG\_CONSTITUENTS(SPX, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.SPX "Link to this definition")

MSCI\_WORLD _\= <UnivLimit.MSCI\_WORLD: 'FG\_CONSTITUENTS(990100, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_WORLD "Link to this definition")

MSCI\_AC\_WORLD _\= <UnivLimit.MSCI\_AC\_WORLD: 'FG\_CONSTITUENTS(892400, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_AC_WORLD "Link to this definition")

MSCI\_UNITED\_KINGDOM _\= <UnivLimit.MSCI\_UNITED\_KINGDOM: 'FG\_CONSTITUENTS(982600, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_UNITED_KINGDOM "Link to this definition")

MSCI\_EM _\= <UnivLimit.MSCI\_EM: 'FG\_CONSTITUENTS(891800, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_EM "Link to this definition")

MSCI\_EUROPE _\= <UnivLimit.MSCI\_EUROPE: 'ISON\_MSCI\_REGION(990500,0,CLOSE,OFF)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_EUROPE "Link to this definition")

MSCI\_INDIA _\= <UnivLimit.MSCI\_INDIA: 'FG\_CONSTITUENTS(935600, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_INDIA "Link to this definition")

MSCI\_EAFE _\= <UnivLimit.MSCI\_EAFE: 'FG\_CONSTITUENTS(990300, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_EAFE "Link to this definition")

R1000 _\= <UnivLimit.R1000: 'FG\_CONSTITUENTS(R.1000, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R1000 "Link to this definition")

R1000G _\= <UnivLimit.R1000G: 'FG\_CONSTITUENTS(R.1000G, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R1000G "Link to this definition")

R1000V _\= <UnivLimit.R1000V: 'FG\_CONSTITUENTS(R.1000V, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R1000V "Link to this definition")

R2000 _\= <UnivLimit.R2000: 'FG\_CONSTITUENTS(R.2000, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R2000 "Link to this definition")

R2000G _\= <UnivLimit.R2000G: 'FG\_CONSTITUENTS(R.2000G, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R2000G "Link to this definition")

R2000V _\= <UnivLimit.R2000V: 'FG\_CONSTITUENTS(R.2000V, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R2000V "Link to this definition")

FTSE100 _\= <UnivLimit.FTSE100: 'FG\_CONSTITUENTS(180555, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.FTSE100 "Link to this definition")

LHMN0038 _\= <UnivLimit.LHMN0038: 'FG\_CONSTITUENTS(LHMN0038, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.LHMN0038 "Link to this definition")

DJII\_USA _\= <UnivLimit.DJII\_USA: 'FG\_CONSTITUENTS(DJII-USA, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.DJII_USA "Link to this definition")

MSCI\_CANADA _\= <UnivLimit.MSCI\_CANADA: 'FG\_CONSTITUENTS(912400, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_CANADA "Link to this definition")

ISON\_DOW _\= <UnivLimit.ISON\_DOW: 'ISON\_DOW'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.ISON_DOW "Link to this definition")

ISON\_SPUS\_INDEX _\= <UnivLimit.ISON\_SPUS\_INDEX: 'ISON\_SPUS\_INDEX'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.ISON_SPUS_INDEX "Link to this definition")

ALL\_EQUITY _\= <UnivLimit.ALL\_EQUITY: "FS\_SEC\_TYPE='SHARE'">_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.ALL_EQUITY "Link to this definition")

ALL\_US\_EQUITY _\= <UnivLimit.ALL\_US\_EQUITY: "(F\_COUNTRY='UNITED STATES' AND FS\_SEC\_TYPE='SHARE')=1">_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.ALL_US_EQUITY "Link to this definition")

ALL\_NA\_EQUITY _\= <UnivLimit.ALL\_NA\_EQUITY: "((F\_COUNTRY='UNITED STATES' OR F\_COUNTRY='MEXICO'OR F\_COUNTRY='CANADA')=1 AND FS\_SEC\_TYPE='SHARE')=1">_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.ALL_NA_EQUITY "Link to this definition")

MSCI\_AC\_APAC _\= <UnivLimit.MSCI\_AC\_APAC: 'FG\_CONSTITUENTS(MS302000,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_AC_APAC "Link to this definition")

MSCI\_AC\_EURO _\= <UnivLimit.MSCI\_AC\_EURO: 'FG\_CONSTITUENTS(990400,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.MSCI_AC_EURO "Link to this definition")

R3000 _\= <UnivLimit.R3000: 'FG\_CONSTITUENTS(R.3000,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R3000 "Link to this definition")

R3000G _\= <UnivLimit.R3000G: 'FG\_CONSTITUENTS(R.3000G, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R3000G "Link to this definition")

R3000V _\= <UnivLimit.R3000V: 'FG\_CONSTITUENTS(R.3000V, 0, Close)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.R3000V "Link to this definition")

NASDAQ\_COMP _\= <UnivLimit.NASDAQ\_COMP: 'FG\_CONSTITUENTS(COMP,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.NASDAQ_COMP "Link to this definition")

NIKKEI225 _\= <UnivLimit.NIKKEI225: 'FG\_CONSTITUENTS(180461,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.NIKKEI225 "Link to this definition")

HANGSENG _\= <UnivLimit.HANGSENG: 'FG\_CONSTITUENTS(180458,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.HANGSENG "Link to this definition")

SSE\_COMP _\= <UnivLimit.SSE\_COMP: 'FG\_CONSTITUENTS(180167,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.SSE_COMP "Link to this definition")

EURO\_STOXX50 _\= <UnivLimit.EURO\_STOXX50: 'FG\_CONSTITUENTS(183658,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.EURO_STOXX50 "Link to this definition")

QQQ _\= <UnivLimit.QQQ: 'FG\_CONSTITUENTS(QQQ,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.QQQ "Link to this definition")

DAX30 _\= <UnivLimit.DAX30: 'FG\_CONSTITUENTS(187653,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.DAX30 "Link to this definition")

CAC40 _\= <UnivLimit.CAC40: 'FG\_CONSTITUENTS(180454,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.CAC40 "Link to this definition")

TOPIX _\= <UnivLimit.TOPIX: 'FG\_CONSTITUENTS(180460,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.TOPIX "Link to this definition")

TOPIX\_100 _\= <UnivLimit.TOPIX\_100: 'FG\_CONSTITUENTS(182297,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.TOPIX_100 "Link to this definition")

TOPIX\_500 _\= <UnivLimit.TOPIX\_500: 'FG\_CONSTITUENTS(182301,0,CLOSE)'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivLimit.TOPIX_500 "Link to this definition")

## UnivType[#](https://fpe.factset.com/docs/universe.html#univtype "Link to this heading")

_enum_ fds.fpe.universe.UnivType(_value_)[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType "Link to this definition")

Universe Type.

Valid values are as follows:

EQUITY _\= <UnivType.EQUITY: 'EQUITY'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.EQUITY "Link to this definition")

DEBT _\= <UnivType.DEBT: 'DEBT'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.DEBT "Link to this definition")

OS _\= <UnivType.OS: 'OS'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.OS "Link to this definition")

DYNAMIC _\= <UnivType.DYNAMIC: 'DYNAMIC'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.DYNAMIC "Link to this definition")

SPAR _\= <UnivType.SPAR: 'SPAR'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.SPAR "Link to this definition")

UNUSED _\= <UnivType.UNUSED: 'UNUSED'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.UNUSED "Link to this definition")

CRM _\= <UnivType.CRM: 'CRM'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.CRM "Link to this definition")

ACCOUNT _\= <UnivType.ACCOUNT: 'ACCOUNT'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.ACCOUNT "Link to this definition")

DYN\_RM _\= <UnivType.DYN\_RM: 'DYN\_RM'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.DYN_RM "Link to this definition")

MAX\_UNIV\_TYPE _\= <UnivType.MAX\_UNIV\_TYPE: 'MAX\_UNIV\_TYPE'>_[#](https://fpe.factset.com/docs/universe.html#fds.fpe.universe.UnivType.MAX_UNIV_TYPE "Link to this definition")
