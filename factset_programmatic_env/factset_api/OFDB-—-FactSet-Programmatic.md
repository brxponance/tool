---
created: 2026-05-11T13:05:27 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/ofdb.html
author: 
---

# OFDB — FactSet Programmatic

> ## Excerpt
> The OFDB class allows you to read and write data through OFDB. This can be a powerful tool
to import and export data into and out of the FPE environment.

---
The _OFDB_ class allows you to read **and** write data through [OFDB](https://my.apps.factset.com/oa/pages/3934#ofdb). This can be a powerful tool to import and export data into and out of the FPE environment.

## OFDB[#](https://fpe.factset.com/docs/ofdb.html#id2 "Link to this heading")

_class_ fds.fpe.ofdb.OFDB(_ofdb\_path_, _data\=None_, _create\_acct\=False_, _acct\_desc\=None_, _progress\_bar\=True_, _split\_direction\='NONE'_, _col\_desc\=None_, _schema\=None_, _split\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB "Link to this definition")

Open FactSet Database (OFDB).

FactSet OFDBs let you view and upload all your proprietary data to FactSet. Once uploaded, you can use your proprietary data, along with data from other sources on FactSet.

Proprietary data can contain any information you wish to upload, such as shares held, analyst names, and proprietary earnings estimates.

OFDB is a high-performance multi-dimensional database system used to securely store proprietary numeric and textual data on FactSet. OFDB files can be time-series or non-time series databases and can be fully integrated with FactSet’s library of databases.

OFDB is ideal for users who manage large portfolios or maintain extensive historical proprietary databases. OFDB optimizes large, multi-dimensional databases, giving FactSet users highly flexible, fast access to large volumes of complex data that can be used in many different applications.

Using the OFDB class, you can create and view OFDB databases.

Parameters:

-   **ofdb\_path** (_str_) – The path for your ofdb. For example, ‘personal:demo.ofdb’. If the OFDB does not exist, a new OFDB will be created if you provide a pandas DataFrame to the data parameter.
    
-   **data** (_DataFrame__,_ _optional_) – A DataFrame containing the data you would like to write to OFDB. To write 2D data, your index names must be \[‘symbol’\]. To write 3D data, your index names must be \[‘date’, ‘symbol’\]
    
-   **create\_acct** (_bool__,_ _optional_) – Create an account for the OFDB, by default False
    
-   **acct\_desc** (_str__,_ _optional_) – Description for the account. Only used if create\_account is True, by default ‘None’
    
-   **split\_direction** (_{'none'__,_ _'normal'__,_ _'reverse'}__,_ _default 'none'_) – Specify a mode for handling splits in your portfolio. Will be deprecated, please use the schema argument.
    
-   **col\_desc** (_list_ _of_ _str__,_ _optional_) – A list of the descriptions that you want to pass for each column. The number of descriptions should be equal to the number of columns of the passing data. If the OFDB exists already this argument will be ignored. If None, the descriptions will be the same as the column names in the data. By default, None. Will be deprecated, please use the schema argument.
    
-   **schema** (_OFDBSchema instance__,_ _optional_) – This should be a schema created via the OFDBSchema Class. It will be used only when creating new OFDBs. If None, the schema will be inherited from the DataFrame in the data argument that you have passed and all fields will be iterated (3D). By default, None.
    
-   **split** (_bool__,_ _optional_) – This argument defines whether the data you are writing to the OFDB is already split adjusted or not. If True it means that the data is split adjusted already and data in previous dates will be affected by the split directon option of the field. It refers to the entire dataset, not for a single field. Check OFDBSchema documentation for the split direction. By default False.
    

Raises:

-   **FileNotFoundError** – If the OFDB does not exist.
    
-   **ValueError** – If the OFDB path does not start with ‘Personal:’, ‘Client:’, or ‘Super\_client:’.
    

See also

-   [https://my.apps.factset.com/oa/pages/21192](https://my.apps.factset.com/oa/pages/21192)
    
-   [https://my.apps.factset.com/oa/pages/3934#OFDB](https://my.apps.factset.com/oa/pages/3934#OFDB)
    
-   [https://my.apps.factset.com/oa/pages/21344](https://my.apps.factset.com/oa/pages/21344)
    

_enum_ WriteModes(_value_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.WriteModes "Link to this definition")

Enums for the allowed types of writing OFDB.

Valid values are as follows:

APPEND _\= <WriteModes.APPEND: 'append'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.WriteModes.APPEND "Link to this definition")

APPEND\_FPE _\= <WriteModes.APPEND\_FPE: 'append\_fpe'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.WriteModes.APPEND_FPE "Link to this definition")

REPLACE\_DATES _\= <WriteModes.REPLACE\_DATES: 'replace\_dates'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.WriteModes.REPLACE_DATES "Link to this definition")

REPLACE\_OFDB _\= <WriteModes.REPLACE\_OFDB: 'replace\_ofdb'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.WriteModes.REPLACE_OFDB "Link to this definition")

add\_field(_name_, _iteration_, _type_, _size\=None_, _description\=None_, _frequency\='unknown'_, _splitDirection\='None'_, _currencyField\=None_, _data\=None_, _progress\_bar\=True_, _split\=False_, _isVectorField\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.add_field "Link to this definition")

Add a new field to the OFDB.

Parameters:

-   **name** (_str_) – The name of the field. The field name should be no more than 32 characters.
    
-   **iteration** (_str_ _or_ [_OFDBField.ITERATION_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.ITERATION "fds.fpe.ofdb.OFDBField.ITERATION")) – Whether the field is to be iterated or non-iterated. Possible values are ‘2D’ for non-iterated field and ‘3D’ for iterated fields. Another option is to choose from OFDBField.ITERATION Enum
    
-   **type** (_str_ _or_ [_OFDBField.DATA\_TYPE_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE "fds.fpe.ofdb.OFDBField.DATA_TYPE")) – Type of the data that will be stored. Possible string options are ‘text’ (252 char limit), ‘integer’, ‘numeric’, ‘high precision’, or ‘extended text’ (8000 char limit). You can also choose from OFDBField.DATA\_TYPE Enum.
    
-   **size** (_int_) – This defines how many characters can a text field hold. It is not used for fields that are not text.
    
-   **description** (_str__,_ _optional_) – The description used for the field. If None, it will be the same as the name of the field. By default, None.
    
-   **frequency** (_str_ _or_ [_OFDBField.FREQUENCY_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY "fds.fpe.ofdb.OFDBField.FREQUENCY")_,_ _optional_) – The frequency of the iteration. Possible string values are ‘daily’ or ‘D’, ‘weekly’ or ‘W’, ‘monthly’ or ‘M’, ‘quarterly’ or ‘Q’, ‘yearly’ or ‘Y’, ‘random’ or ‘R’, ‘unknown’ or ‘X’. OFDBField.FREQUENCY Enum is also available. By default will be ‘unknown’.
    
-   **splitDirection** (_str_ _or_ [_OFDBField.SPLIT\_DIRECTION_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION "fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION")_,_ _optional_) – How to split adjust the field. Options are ‘per share’ (multiplied by split factor), ‘number of shares’ (divided by split factor), ‘none’ (no split adjustment), or any value from OFDBField.SPLIT\_DIRECTION Enum. By default, None.
    
-   **currencyField** (_str__,_ _optional_) – The currency field to which the field will be mapped. If there is no existing currency field it will be automatically created.
    
-   **data** (_pd.Series__,_ _optional_) – A data that you would like to upload with the field. Must be indexed by date and symbol. If date or symbol is not part of the OFDB, they will be created. If None the whole field will be NA. By default, None.
    
-   **progress\_bar** (_True__,_ _optional_) – If True, display a progress bar. By default True
    
-   **split** (_bool__,_ _optional_) – This argument defines whether the data you are writing to the OFDB is already split adjusted or not. If True it means that the data is split adjusted already and will not be affected by the split directon option in the field. Check OFDBSchema documentation for the split direction. By default False.
    
-   **isVectorField** (_bool__,_ _optional_) – Indicate whether a given field is vector field. Vector fields are used for OMS OFDBs storing transactional data. By default False.
    
-   **\*\*kwargs** – Additional keyword arguments forwarded to the underlying requests calls.
    

data(_symbols\=None_, _fields\=None_, _dates\=None_, _time\_series\=None_, _drop\_non\_iter\=False_, _progress\_bar\=True_, _split\=True_, _include\_txn\=True_, _expand\_txn\=False_, _txn\_id\_col\='txn\_id'_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.data "Link to this definition")

Read OFDB data into a pandas DataFrame.

Parameters:

-   **symbols** (_list__,_ _optional_) – List of strings representing the specific symbols to filter from the OFDB. By default None.
    
-   **fields** (_list__,_ _optional_) – List of strings representing the specific fields to filter from the OFDB. By default None.
    
-   **dates** (_list__,_ _optional_) – List of strings representing the specific dates in the format ‘YYYYMMDD’ to filter from the OFDB. By default None.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")) – A time series to filter specific dates from the OFDB. Time series take precedence over the dates argument. By default None.
    
-   **drop\_non\_iter** (_bool__,_ _optional_) – If True, drop non-iterable fields from the DataFrame. By default False.
    
-   **progress\_bar** (_bool__,_ _optional_) – If True, display a progress bar. By default True.
    
-   **split** (_bool__,_ _optional_) – Specify whether you want to get the split adjusted values or not. By default True.
    
-   **include\_txn** (_bool__,_ _optional_) – Whether the returned DataFrame to include the transaction fields or no. If the OFDB is not an OMS\_OFDB, this argument is simply ignored. By default True.
    
-   **expand\_txn** (_bool__,_ _optional_) – If the OFDB has transctions (like OMS OFDBs) you can use this argument and chose whether to expand the transactions into single rows and indexed by the txn\_id\_col argument. This process can be quite expensive in terms of computing, so you may notice slow down in the process, especially for big OMS OFDBs. By default False.
    
-   **txn\_id\_col** (_string_) – Since OMS OFDBs has another level of record - transaction, the dataframe that will be returned has to have one more index level. Use this argument to specify which column from your OMS OFDB to be used as third level. The column should have unique values per day per symbol and should not have nan values. This argument is used only for OMS OFDBs. By default ‘txn\_id’.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments. Supports `iters` to specify iteration fields.
    

Returns:

A pandas DataFrame containing the OFDB data.

If the OFDB is 2D, the DataFrame is indexed by ‘symbol’. If the OFDB is 3D, the DataFrame is indexed by ‘date’ and ‘symbol’.

Return type:

DataFrame

dates(_symbol\=None_, _field\=None_, _pbar\=True_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.dates "Link to this definition")

Read dates from the OFDB.

Parameters:

-   **symbol** (_str__,_ _optional_) – If None, will return all dates. By default None.
    
-   **field** (_str__,_ _optional_) – Field to find dates for in the OFDB. By default None.
    
-   **pbar** (_bool__,_ _optional_) – Whether to show a progress bar, by default True.
    

Returns:

list of dates

Return type:

list

delete()[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.delete "Link to this definition")

Delete the OFDB.

This will delete the OFDB from FactSet. This operation cannot be undone.

Raises:

-   **Exception** – If there was an error deleting the OFDB.
    
-   **ValueError** – If the path for the OFDB is invalid.
    

Return type:

`None`

delete\_field(_name_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.delete_field "Link to this definition")

Delete field from an existing OFDB.

Parameters:

**name** (_str_) – The name of the field to be deleted.

Return type:

`None`

fields()[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.fields "Link to this definition")

Read OFDB Field Information.

This returns the schema information for the OFDB

Returns:

A dict representation of the OFDB’s fields and their schemas.

Return type:

dict

modify\_field(_name_, _newName\=None_, _description\=None_, _frequency\=None_, _splitDirection\=None_, _currencyField\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.modify_field "Link to this definition")

Modify an existing field in the OFDB.

Parameters:

-   **name** (_str_) – The name of the field that you want to change.
    
-   **newName** (_str__,_ _optional_) – The new name of the field if you want to change it.
    
-   **description** (_str__,_ _optional_) – The new description to be used for the field.
    
-   **frequency** (_str_ _or_ [_OFDBField.FREQUENCY_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY "fds.fpe.ofdb.OFDBField.FREQUENCY")_,_ _optional_) – The frequency of the iteration. Possible string values are ‘daily’ or ‘D’, ‘weekly’ or ‘W’, ‘monthly’ or ‘M’, ‘quarterly’ or ‘Q’, ‘yearly’ or ‘Y’, ‘random’ or ‘R’, ‘unknown’ or ‘X’. OFDBField.FREQUENCY Enum is also available. By default will be None or not changing.
    
-   **splitDirection** (_str_ _or_ [_OFDBField.SPLIT\_DIRECTION_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION "fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION")_,_ _optional_) – How to split adjust the field. Options are ‘per share’ (multiplied by split factor), ‘number of shares’ (divided by split factor), ‘none’ (no split adjustment), or any value from OFDBField.SPLIT\_DIRECTION Enum. By default, None which means not changing.
    
-   **currencyField** (_str__,_ _optional_) – The currency field to which the field will be mapped. If there is no existing currency field it will be automatically created.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying requests calls.
    

Return type:

`None`

_property_ ofdb\_path_: str_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.ofdb_path "Link to this definition")

Get the path for this OFDB.

open()[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.open "Link to this definition")

Open the OFDB in Data Central.

This will jump you to Data Central and open the OFDB.

Return type:

`None`

_property_ schema_: any_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.schema "Link to this definition")

Get OFDB’s schema.

_property_ split\_direction_: str_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.split_direction "Link to this definition")

Get the split settings for this OFDB.

symbols(_date\=None_, _pbar\=True_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.symbols "Link to this definition")

Read the symbols from the OFDB.

Parameters:

-   **date** (_str_ _or_ _datetime__,_ _optional_) – Filter the results to only return symbols for a particular date. By default None.
    
-   **pbar** (_bool__,_ _optional_) – Whether to show a progress bar, by default True.
    

Returns:

List of strings representing the symbols stored in the OFDB.

Return type:

list

write(_df_, _create\_acct\=False_, _acct\_desc\='FPE Portfolio'_, _append\=False_, _handle\_nans\=False_, _progress\_bar\=True_, _mode\=WriteModes.APPEND_, _dates\=None_, _new\_col\_desc\=None_, _new\_split\_direction\='NONE'_, _schema\=None_, _split\=False_, _write\_txn\=False_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDB.write "Link to this definition")

Write data from a DataFrame to the OFDB.

Data will only be written if OFDB schema conforms with the data you’re attempting to write from your DataFrame.

Parameters:

-   **df** (_DataFrame_) – The DataFrame containing the data you would like to write to OFDB. To write 2D data, your index names must be \[‘symbol’\]. To write 3D data, your index names must be \[‘date’, ‘symbol’\].
    
-   **create\_acct** (_bool__,_ _optional_) – Create an account for the OFDB, by default False. Used also for mode=’replace\_ofdb’.
    
-   **acct\_desc** (_str__,_ _optional_) – Description for the account. Only used if create\_account is True. Used also for mode=’replace\_ofdb’. By default ‘FPE Portfolio’
    
-   **append** (_bool__,_ _optional_) – If true, do not overwrite any existing data in the DataFrame. Deprecated - please use the argument mode.
    
-   **handle\_nans** (_bool__,_ _optional_) – If True, will attempt to cast NaNs as string in proper format to enable ofdb.write() without schema incompatible errors. If False, will raise an error if NaNs are present. By default, False.
    
-   **progress\_bar** (_bool__,_ _optional_) – If True, display a progress bar. By default True.
    
-   **mode** (_str_ _or_ _OFDB.WriteModes Enum__,_ _optional_) –
    
    There are four modes that you can specify
    
    -   ’append’ or OFDB.WriteModes.APPEND This is the default mode. It will append all new data and overwrite the intersection between your OFDB file and the DataFrame, with the data from the DataFrame. Previously this was the append=False option. This is the same as the Append mode in Alpha Testing 4.
        
    -   ’append\_fpe’ or OFDB.WriteModes.APPEND\_FPE This mode will only add the new data from your DataFrame to the OFDB file. The intersection will not be touched and the old data will be kept. Previously this was the append=True option.
        
    -   ’replace\_dates’ or OFDB.WriteModes.REPLACE\_DATES This mode will first delete the dates that have been specified within the dates argument from your OFDB and then will re-insert them again with the data from your DataFrame.
        
    -   ’replace\_ofdb’ or OFDB.WriteModes.REPLACE\_OFDB This mode will first delete the entire OFDB and all linked accounts (ACCTs) to it and then will create new OFDB with the same name, in the same location. The additional arguments for this mode are new\_col\_desc and new\_split\_direction. This is the same as the Overwrite mode in Alpha Testing 4.
        
-   **dates** (_list_ _of_ _str__,_ _datetime objects_ _or_ _pandas Timestamps_) – List of dates that should exists in your OFDB and your DataFrame. It will be used only when you specify mode=’replace\_dates’. If dates are strings they should be in the format ‘YYYYMMDD’.
    
-   **new\_col\_desc** (_list_ _of_ _str__,_ _optional_) – If you have specified mode=’replace\_ofdb’, you can pass here the description for each new column. Default is None, which will copy the name of your columns as description.
    
-   **new\_split\_direction** (_{'none'__,_ _'normal'__,_ _'reverse'}__,_ _default 'none'_) – Specify a mode for handling splits in your new OFDB.
    
-   **schema** (_OFDBSchema instance__,_ _optional_) – The schema will be used to define which fields that you are writing to are iterated (3D) or non-iterated (2D). This allows you to write mixed type data. If None, the schema will be inherited from your dataframe and all fields/columns will be considered as iterated (3D). If you are writing DataFrame with transactions the schema argument is required.
    
-   **split** (_bool__,_ _optional_) – This argument defines whether the data you are writing to the OFDB is already split adjusted or not. If True it means that the data is split adjusted already and data in previous dates will be affected by the split directon option of the field. It refers to the entire dataset, not for a single field. Check OFDBSchema documentation for the split direction. By default False.
    
-   **write\_txn** (_bool__,_ _optional_) – Indicate whether you are writing transactional data (to OMS\_OFDB). If you are writing transactions, schema must be passed. By default False.
    

Raises:

-   **ValueError** – If your dataframe’s index names are not \[‘symbols’\] or \[‘date’, ‘symbol’\].
    
-   **ValueError** – If ‘symbol’ or ‘date’ are columns in the dataframe.
    
-   **ValueError** – If the data in your DataFrame does not conform to the schema of the OFDB. This will also include details explaining why the schema validation failed.
    
-   **ValueError** – If create\_account is True and the dataframe does not include a column for shares or weight.
    
-   **Exception** – If create\_account is True and there was an error creating the account.
    

Return type:

`None`

Returns:

None

Note

OFDB currently supports the following dtypes from a dataframe: ints, floats, bools, and objects (strings only). The dtype ‘object’ will be stored as a string in the OFDB. If you have columns with dtype ‘object’, that data will only be written to OFDB if the column actually contains string values. Otherwise, a warning message will print with more details.

See also

-   [https://my.apps.factset.com/oa/pages/21192](https://my.apps.factset.com/oa/pages/21192)
    
-   [https://my.apps.factset.com/oa/pages/3934#OFDB](https://my.apps.factset.com/oa/pages/3934#OFDB)
    
-   [https://my.apps.factset.com/oa/pages/11928](https://my.apps.factset.com/oa/pages/11928)
    
-   [https://my.apps.factset.com/oa/pages/14785](https://my.apps.factset.com/oa/pages/14785)
    
-   [https://my.apps.factset.com/oa/pages/21342](https://my.apps.factset.com/oa/pages/21342)
    

## OFDBField[#](https://fpe.factset.com/docs/ofdb.html#ofdbfield "Link to this heading")

The _OFDBField_ class supplements the _OFDBSchema_ class and allows you to control each field, that can be added to every schema, independently.

## OFDBField[#](https://fpe.factset.com/docs/ofdb.html#id3 "Link to this heading")

_class_ fds.fpe.ofdb.OFDBField(_\*\*data_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField "Link to this definition")

Class that is handling each field and is part of any OFDB schema.

Parameters:

-   **name** (_str_) – The name of the field. The field name should be no more than 32 characters.
    
-   **iteration** (_str_ _or_ [_OFDBField.ITERATION_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.ITERATION "fds.fpe.ofdb.OFDBField.ITERATION")) – Whether the field is to be iterated or non-iterated. Possible values are ‘2D’ for non-iterated field and ‘3D’ for iterated fields. Another option is to choose from OFDBField.ITERATION Enum
    
-   **type** (_str_ _or_ [_OFDBField.DATA\_TYPE_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE "fds.fpe.ofdb.OFDBField.DATA_TYPE")) –
    
    Type of the data that will be stored. Possible string options are
    
    -   text - Text field with limit of 252 characters;
        
    -   integer - Field that only allow to store integers;
        
    -   numeric - Field that allow to store floats;
        
    -   high precision - Field that allow for very high precision;
        
    -   extended text - Text field with limit of 8000 characters;
        
    
    Also, you can choose from OFDBField.DATA\_TYPE Enum
    
-   **size** (_int_) – This defines how many characters can a text field hold. It is not used for fields that are not text.
    
-   **description** (_str__,_ _optional_) – The description used for the field. If None, it will be the same as the name of the field. By default, None.
    
-   **frequency** (_str_ _or_ [_OFDBField.FREQUENCY_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY "fds.fpe.ofdb.OFDBField.FREQUENCY")_,_ _optional_) – The frequency of the iteration. Possible string values are ‘daily’ or ‘D’, ‘weekly’ or ‘W’, ‘monthly’ or ‘M’, ‘quarterly’ or ‘Q’, ‘yearly’ or ‘Y’, ‘random’ or ‘R’, ‘unknown’ or ‘X’. OFDBField.FREQUENCY Enum is also available. By default will be ‘unknown’.
    
-   **splitDirection** (_str_ _or_ [_OFDBField.SPLIT\_DIRECTION_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION "fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION")_,_ _optional_) –
    
    How to split adjust the field. Several options available
    
    -   ’per share’ - Per Share is used for any per share data such as price or earnings per share. This data will be multiplied by the split factor.
        
    -   ’number of shares’ - Number of shares is used for data such as shares outstanding or holdings. This data will be divided by the split factor.
        
    -   ’none’ - The OFDB will not take into account split factor.
        
    -   Any of the Enums in OFDBField.SPLIT\_DIRECTION
        
    
    By default, None.
    
-   **currencyField** (_str__,_ _optional_) – The currency field to which the field will be mapped. If there is no existing currency field it will be automatically created.
    
-   **isVectorField** (_bool__,_ _optional_) – Indicate whether a given field is vector field. Vector fields are used for OMS OFDBs storing transactional data. By default False.
    

_enum_ DATA\_TYPE(_value_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE "Link to this definition")

Valid values are as follows:

TEXT _\= <DATA\_TYPE.TEXT: 'CHAR'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE.TEXT "Link to this definition")

EXTENDED\_TEXT _\= <DATA\_TYPE.EXTENDED\_TEXT: 'LONG\_CHAR'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE.EXTENDED_TEXT "Link to this definition")

INTEGER _\= <DATA\_TYPE.INTEGER: 'INT'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE.INTEGER "Link to this definition")

NUMERIC _\= <DATA\_TYPE.NUMERIC: 'FLOAT'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE.NUMERIC "Link to this definition")

HIGH\_PRECISION _\= <DATA\_TYPE.HIGH\_PRECISION: 'DOUBLE'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.DATA_TYPE.HIGH_PRECISION "Link to this definition")

_enum_ FREQUENCY(_value_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY "Link to this definition")

Valid values are as follows:

DAILY _\= <FREQUENCY.DAILY: 'D'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.DAILY "Link to this definition")

WEEKLY _\= <FREQUENCY.WEEKLY: 'W'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.WEEKLY "Link to this definition")

MONTHLY _\= <FREQUENCY.MONTHLY: 'M'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.MONTHLY "Link to this definition")

QUARTERLY _\= <FREQUENCY.QUARTERLY: 'Q'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.QUARTERLY "Link to this definition")

YEARLY _\= <FREQUENCY.YEARLY: 'Y'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.YEARLY "Link to this definition")

RANDOM _\= <FREQUENCY.RANDOM: 'R'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.RANDOM "Link to this definition")

UNKNOWN _\= <FREQUENCY.UNKNOWN: 'X'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.FREQUENCY.UNKNOWN "Link to this definition")

_enum_ ITERATION(_value_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.ITERATION "Link to this definition")

Valid values are as follows:

NON\_ITERATED _\= <ITERATION.NON\_ITERATED: '2D'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.ITERATION.NON_ITERATED "Link to this definition")

ITERATED _\= <ITERATION.ITERATED: '3D'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.ITERATION.ITERATED "Link to this definition")

_enum_ SPLIT\_DIRECTION(_value_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION "Link to this definition")

Valid values are as follows:

NUMBER\_OF\_SHARES _\= <SPLIT\_DIRECTION.NUMBER\_OF\_SHARES: 'REVERSE'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION.NUMBER_OF_SHARES "Link to this definition")

NONE _\= <SPLIT\_DIRECTION.NONE: 'NONE'>_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.SPLIT_DIRECTION.NONE "Link to this definition")

_property_ get[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.get "Link to this definition")

Return the field definition as a dictionary.

Returns:

A dictionary representation of the field’s attributes.

Return type:

dict

model\_config_: ClassVar\[ConfigDict\]_ _\= {}_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField.model_config "Link to this definition")

Configuration for the model, should be a dictionary conforming to \[ConfigDict\]\[pydantic.config.ConfigDict\].

## OFDBSchema[#](https://fpe.factset.com/docs/ofdb.html#ofdbschema "Link to this heading")

The _OFDBSchema_ class supplements the _OFDB_ class and allows you to specify the schema which to be used when creating new OFDBs or write to existing ones. It gives you control over each field in your OFDB. You can navigate to [OA Page 21741](https://my.apps.factset.com/oa/pages/21741#add_remove_columns) to read more about the attributes that each field take and their purpose.

## OFDBSchema[#](https://fpe.factset.com/docs/ofdb.html#id4 "Link to this heading")

_class_ fds.fpe.ofdb.OFDBSchema(_\*\*data_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema "Link to this definition")

Class that creates OFDB Schema.

The schema is represented as nested dictionaries, where each key has the name of the field and each value is a dictionary containing field’s characteristics. The schema can always be inspected via self.get.

Note

Available methods: `get`, `add_field`, `clear_schema`, `get_fields`, `drop_fields`, `from_dict`, `from_df`, `from_ofdb`.

add\_field(_field_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.add_field "Link to this definition")

Method that will add field to the current schema.

The field SYMBOL will be created automatically later on via the OFDB Class. If there is a ‘3D’ field inserted, the field DATE will be created by itself as well. You do not need to add SYMBOL and DATE fields and you will not see them via OFDBSchema.get.

Parameters:

**field** ([_OFDBField_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField "fds.fpe.ofdb.OFDBField")_,_ _list_ _of_ [_OFDBField_](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBField "fds.fpe.ofdb.OFDBField") _or_ _dict_) – Should be an OFDBField class, list of OFDBField objects or dictionary that will be used as keywords for the OFDBfield class to create a field object.

Return type:

`None`

clear\_schema()[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.clear_schema "Link to this definition")

Clear the whole schema currently stored in the instance.

Return type:

`None`

drop\_fields(_field_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.drop_fields "Link to this definition")

Drop specific fields from the schema created.

Parameters:

**field** (_str_ _or_ _list_ _of_ _str_) – Name of the field or list containing several field names

Return type:

`None`

_classmethod_ from\_df(_df_, _col\_iter\=None_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.from_df "Link to this definition")

Create schema from pandas DataFrame.

Parameters:

-   **df** (_pandas.DataFrame_) – This should be a pandas DataFrame whose columns are going to be used to determine the name and type of the column. The dataframe should not contain symbol or date column unless it is in the index.
    
-   **col\_iter** (_dict__,_ _optional_) – This should be a dictionary where the keys are the names of the pandas DataFrame columns and the values should indicate whether a column is ‘2D’ or ‘3D’ iterated. As value you can also use the OFDBField.ITERATION enums. If the argument is None, all columns will be assumed to be ‘3D’ and the data type will be inherited from the dataframe. By default, None.
    

Return type:

[`OFDBSchema`](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema "fds.fpe.ofdb._ofdb_schema.OFDBSchema")

_classmethod_ from\_dict(_fields_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.from_dict "Link to this definition")

Create schema from nested dictionary.

Parameters:

**fields** (_dict_) – This should be a nested dictionary, where each key is the name of the field and each value should be a sub-dictionary containing key:value pairs, where the keys are the arguments from OFDBField and the values are the parameters to be set. Each field should have at least iteration and data\_type keys specified.

Return type:

[`OFDBSchema`](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema "fds.fpe.ofdb._ofdb_schema.OFDBSchema")

_classmethod_ from\_ofdb(_ofdb_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.from_ofdb "Link to this definition")

Get schema from existing OFDB.

Parameters:

**ofdb** (_str_ _or_ _OFDB Object_) – You can a pass string that should be a path to your OFDB or simply pass an already existing OFDB Object.

Return type:

[`OFDBSchema`](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema "fds.fpe.ofdb._ofdb_schema.OFDBSchema")

_property_ get[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.get "Link to this definition")

Return the schema as a dictionary of field definitions.

Returns:

A dictionary where keys are uppercase field names and values

are dictionaries of field attributes.

Return type:

dict

Raises:

**ValueError** – If the schema has no fields.

get\_fields(_field_)[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.get_fields "Link to this definition")

Get specific fields from the schema created.

Parameters:

**field** (_str_ _or_ _list_ _of_ _str_) – Name of the field or list containing several field names

Return type:

`Dict`\[`str`, `Dict`\[`str`, `str`\]\]

Returns:

Dictionary containing the field names as key and the field parameters as sub-dictionaries

model\_config_: ClassVar\[ConfigDict\]_ _\= {}_[#](https://fpe.factset.com/docs/ofdb.html#fds.fpe.ofdb.OFDBSchema.model_config "Link to this definition")

Configuration for the model, should be a dictionary conforming to \[ConfigDict\]\[pydantic.config.ConfigDict\].
