---
created: 2026-05-11T13:08:17 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/file_manager.html
author: 
---

# File Manager — FactSet Programmatic

> ## Excerpt
> The fds.fpe.file_manager module queries the file manager application and returns a list of files (OFDBs,
screens, strategies, models, or accounts, etc.) from the directory passed in the directory
parameter.

---
The _fds.fpe.file\_manager_ module queries the file manager application and returns a list of files (OFDBs, screens, strategies, models, or accounts, etc.) from the directory passed in the _directory_ parameter.

The default is to return a list of strings representing the list of files, as this is the most common use case. However, setting the _full\_detail_ parameter to True would return a DataFrame with addition metadata.

## All Files[#](https://fpe.factset.com/docs/file_manager.html#all-files "Link to this heading")

fds.fpe.file\_manager.get\_files(_directory\='personal:'_, _extensions\=None_, _full\_detail\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_files "Link to this definition")

Get a list of files available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’
    
-   **extensions** (_list__,_ _optional_) – List of file extensions to filter results, by default None.
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

## OFDBs[#](https://fpe.factset.com/docs/file_manager.html#ofdbs "Link to this heading")

fds.fpe.file\_manager.get\_ofdbs(_directory\='personal:'_, _full\_detail\=False_, _progress\_bar\=True_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_ofdbs "Link to this definition")

Get a list of OFDBs available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’.
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date. By default False.
    
-   **progress\_bar** (_bool__,_ _optional_) – Whether to show a progress bar, by default True.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

See also

-   [https://my.apps.factset.com/oa/pages/21192](https://my.apps.factset.com/oa/pages/21192)
    
-   [https://my.apps.factset.com/oa/pages/3934#ofdb](https://my.apps.factset.com/oa/pages/3934#ofdb)
    

## Accounts[#](https://fpe.factset.com/docs/file_manager.html#accounts "Link to this heading")

fds.fpe.file\_manager.get\_accounts(_directory\='personal:'_, _full\_detail\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_accounts "Link to this definition")

Get a list of Accounts available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’.
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date. By default False.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

## Universal Screening[#](https://fpe.factset.com/docs/file_manager.html#universal-screening "Link to this heading")

fds.fpe.file\_manager.get\_screens(_directory\='personal:'_, _full\_detail\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_screens "Link to this definition")

Get a list of Universal Screening documents available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

## Portfolio Analysis[#](https://fpe.factset.com/docs/file_manager.html#portfolio-analysis "Link to this heading")

fds.fpe.file\_manager.get\_pa\_documents(_directory\='personal:'_, _full\_detail\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_pa_documents "Link to this definition")

Get a list of Portfolio Anlaysis documents available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’.
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date. By default False.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

## Alpha Testing[#](https://fpe.factset.com/docs/file_manager.html#alpha-testing "Link to this heading")

fds.fpe.file\_manager.get\_at\_documents(_directory\='personal:'_, _full\_detail\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_at_documents "Link to this definition")

Get a list of Alpha Testing documents available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’.
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date. By default False.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

## Optimizers[#](https://fpe.factset.com/docs/file_manager.html#optimizers "Link to this heading")

fds.fpe.file\_manager.get\_optimizer\_strategies(_directory\='personal:'_, _full\_detail\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/file_manager.html#fds.fpe.file_manager.get_optimizer_strategies "Link to this definition")

Get a list of Optimizer Strategy documents available for the given directory.

Parameters:

-   **directory** (_str__,_ _optional_) – The directory to search, e.g. ‘super\_client:/mySubDir/’. By default ‘personal:’
    
-   **full\_detail** (_bool__,_ _optional_) – If true, returns more detail about each file returned, e.g. description, creation date, modified date.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying file listing calls.
    

Returns:

A list of file paths, or a DataFrame with full details.

If full\_detail is False, returns a list of strings representing the path to each available file. If full\_detail is True, returns a DataFrame with more detail about each file.

Return type:

list or DataFrame

See also

-   [https://my.apps.factset.com/oa/pages/21541](https://my.apps.factset.com/oa/pages/21541)
    
-   [https://my.apps.factset.com/oa/pages/20614](https://my.apps.factset.com/oa/pages/20614)
