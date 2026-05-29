---
created: 2026-05-11T13:05:41 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/alpha_testing.html
author: 
---

# Alpha Testing — FactSet

> ## Excerpt
> The fds.fpe.alpha_testing module provides a powerful extension to FactSet’s Alpha Testing
application. This allows for deeper analysis of model data within FPE. After running your model in
Alpha Testing, you can read tile data into a pandas DataFrame within FPE.

---
The _fds.fpe.alpha\_testing_ module provides a powerful extension to FactSet’s Alpha Testing application. This allows for deeper analysis of model data within FPE. After running your model in Alpha Testing, you can read tile data into a pandas DataFrame within FPE.

[![Alpha Testing](alpha-testing/alpha_testing.png)](https://fpe.factset.com/docs/_images/alpha_testing.png)

## Tile Data[#](https://fpe.factset.com/docs/alpha_testing.html#tile-data "Link to this heading")

fds.fpe.alpha\_testing.tile(_doc_, _report_, _tile\=None_, _grouped\=True_, _col\_char\_map\=None_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.tile "Link to this definition")

Get tile data from an Alpha Testing tile.

Parameters:

-   **doc** (_str_) – The path to your Alpha Testing document.
    
-   **report** (_str_) – Name of the report in your document.
    
-   **tile** (_str__,_ _optional_) – Name of the tile. Only required if the tile name is different than the report name, by default None.
    
-   **grouped** (_bool__,_ _optional_) – Whether to group the output by non-default columns, by default True.
    
-   **col\_char\_map** (_dict__,_ _optional_) – Mapping of characters to replace in column names, by default `{'\n': ' '}`.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying requests calls.
    

Returns:

A pandas DataFrame containing the tile data, indexed by date and symbol.

Return type:

DataFrame

Raises:

**ValueError** – Errors returned by the alpha testing tile service.

fds.fpe.alpha\_testing.tiles(_doc_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.tiles "Link to this definition")

Get a list of all tiles available in an Alpha Testing document.

Parameters:

-   **doc** (_str_) – The path to your Alpha Testing document.
    
-   **\*\*kwargs** (`Any`) – Additional keyword arguments forwarded to the underlying requests calls.
    

Returns:

A list of tuples containing report and tile names.

Return type:

list

## ATModel[#](https://fpe.factset.com/docs/alpha_testing.html#atmodel "Link to this heading")

This is a beta feature. See [below](https://fpe.factset.com/docs/alpha_testing.html#atmodel-limitations) for a list of limitations.

_class_ fds.fpe.alpha\_testing.ATModel(_model\_path\=None_, _model\_data\=None_)[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel "Link to this definition")

Provides access to AT Model parameters.

Note

Beta feature. For a list of limitations see the [FPE documentation](https://fpe.factset.com/docs/alpha_testing.html#atmodel-limitations).

Parameters:

-   **model\_path** (_str__,_ _optional__,_ _default None_) – A path to an AT model. E.g.: `'Super_client:/path/to/My AT Model'`. If no `model_path` is provided, `model_data` is required.
    
-   **model\_data** (_dict__,_ _optional__,_ _default None_) – AT model data in JSON format as returned by the alpha-testing-model API. If no `model_data` is provided, `model_path` is required.
    

Return type:

[ATModel](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel "fds.fpe.alpha_testing.ATModel")

_property_ calendar[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.calendar "Link to this definition")

The model’s calendar.

_property_ composite\_factor\_components[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.composite_factor_components "Link to this definition")

The components of the model’s composite factors.

_property_ composite\_factor\_components\_and\_weights[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.composite_factor_components_and_weights "Link to this definition")

The components of the model’s composite factors.

_property_ composite\_factor\_ids[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.composite_factor_ids "Link to this definition")

The IDs of the model’s composite factors.

_property_ factor\_ids[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.factor_ids "Link to this definition")

The IDs of the model’s factors (including composites and grouped factors). Universe formulas are excluded.

_property_ factor\_parameters[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.factor_parameters "Link to this definition")

The model’s factor parameters.

_property_ freq[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.freq "Link to this definition")

The model’s frequency.

_classmethod_ from\_json(_filename_)[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.from_json "Link to this definition")

Creates an ATModel instance from `filename`.

The file should contain the model data in the format returned by the alpha-testing-model API.

_property_ grouped\_factor\_ids[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.grouped_factor_ids "Link to this definition")

The IDs of the model’s grouped factors.

_property_ id[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.id "Link to this definition")

The model name.

_property_ model\_data[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.model_data "Link to this definition")

The raw model data in JSON format.

_property_ mp[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.mp "Link to this definition")

A dictionary with the model’s parameters.

_property_ path[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.path "Link to this definition")

The model path. Either a path to an AT Model file or a local JSON file.

_property_ simple\_factor\_ids[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.simple_factor_ids "Link to this definition")

The IDs of the model’s simple factors.

_property_ start[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.start "Link to this definition")

The model’s start date. Eiher in mm/dd/yyyy or relative date format e.g. 0M.

_property_ stop[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.stop "Link to this definition")

The model’s stop date. Eiher in mm/dd/yyyy or relative date format e.g. 0M.

to\_json(_filename_)[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.to_json "Link to this definition")

Writes model data to `filename`.

_property_ universe\_expression[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.universe_expression "Link to this definition")

The model’s universe expression.

_property_ universe\_expression\_type[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.universe_expression_type "Link to this definition")

The model’s universe expression type. Either of `{'formula', 'portfolio', 'screen'}`.

_property_ universe\_formula\_ids[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.universe_formula_ids "Link to this definition")

The IDs of the model’s universe formulas.

_property_ universe\_formula\_parameters[#](https://fpe.factset.com/docs/alpha_testing.html#fds.fpe.alpha_testing.ATModel.universe_formula_parameters "Link to this definition")

Parameters of the model’s universe formulas.

### Unsupported features[#](https://fpe.factset.com/docs/alpha_testing.html#unsupported-features "Link to this heading")

Some AT model parameters are currently not accessible via `ATModel`.

-   return sources (returns formula, mcap formula, and weights formula)
    
-   currency
    
-   benchmark
    
-   conditional MFRs
    
-   risk factors
    
-   period formulas
