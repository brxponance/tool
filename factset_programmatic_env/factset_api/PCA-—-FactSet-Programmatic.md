---
created: 2026-05-11T13:05:35 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/pca.html
author: 
---

# PCA — FactSet Programmatic

> ## Excerpt
> The PCA class allows you to read, create and edit existing composite assets, just like in the Composite Asset Builder in the FactSet Workstation.
This can be a nice supplementary tool to the OFDB Class.

---
The _PCA_ class allows you to read, create **and** edit existing composite assets, just like in the [Composite Asset Builder](https://my.apps.factset.com/oa/pages/12556) in the FactSet Workstation. This can be a nice supplementary tool to the [OFDB Class](https://fpe.factset.com/docs/ofdb.html).

## PCA[#](https://fpe.factset.com/docs/pca.html#id1 "Link to this heading")

_class_ fds.fpe.pca.PCA(_path_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA "Link to this definition")

PCA object that can be used to create, delete or overwrite existing composite asset components.

Parameters:

**path** (_str_) – The destionation folder in which you want to control the composite assets.

create\_composite(_pca\_id_, _name_, _holdings\_type_, _holdings_, _weight\_schema_, _weights\=''_, _price\=''_, _currency\=''_, _shares\_out\=''_, _industry\=''_, _leverage\=1.0_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA.create_composite "Link to this definition")

Create compossite asset.

Additional information about the parameters can be found in the Online Assistant Page 12557.

Parameters:

-   **pca\_id** (_str_) – The ID of the composite asset.
    
-   **name** (_str_) – The name of the composite asset.
    
-   **holdings\_type** (_str_ _or_ _HoldingTypes Enum_) – The holdings type of the composite asset. As strings you can use one of the following: ‘portfolio’, ‘screen’, ‘formula’ or ‘identifier’. As an alternative you can use the Enums from the pca module - pca.HoldingTypes.
    
-   **holdings** (_str_ _or_ _OFDB instance_) – This is the expression according to the holdings\_type. If you have formula as holdings\_type, you should specify the formula to be used. If you have ‘screen’ or ‘portfolio’ as holdings\_type, you should specify the path of the screen/portfolio or OFDB instance. If you have identifier as holdings\_type you should pass the identifier to be used.
    
-   **weight\_schema** (_str_ _or_ _WeightingSchemas Enum_) – The weighting schema of the composite asset. As strings you can use one of the following: ‘shares’, ‘percent’, ‘mcap’ or ‘equal’. As an alternative you can use the Enums from the pca module - pca.WeightingSchemas.
    
-   **weights** (_str__,_ _optional_) – If your weight\_schema is ‘percent’ or ‘mcap’ you should pass the expression for it.
    
-   **price** (_str__,_ _optional_) – The price for the composite asset. You can enter ‘mcap’ if you want to use the portfolio market value as price. Otherwise, you can specify screening formula, like ‘P\_PRICE(0)’.
    
-   **currency** (_str__,_ _optional_) – The currency for the price field. It should be the three letter ISO, for e.g. ‘USD’ for US dollar. Specify currency only if price is different from the default empty string or ‘mcap’.
    
-   **shares\_out** (_str__,_ _optional_) – This can be a screening formula or enter a fix value.
    
-   **industry** (_str__,_ _optional_) – Enter formula to be used for dynamic update or use a simple string to fix the industry.
    
-   **leverage** (_float__,_ _optional_) – The leverage factor for the composite asset.
    

Return type:

`None`

Returns:

None

delete\_composite(_pca\_id_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA.delete_composite "Link to this definition")

Delete a composite, or list of composites, specified by the user.

Parameters:

**pca\_id** (_str_ _or_ _list_ _of_ _str_) – The id, or list of ids, of the asset(s) that you want to delete.

Return type:

`None`

Returns:

None

get\_composites()[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA.get_composites "Link to this definition")

Fetch all composite assets.

Return type:

`DataFrame`

Returns:

pandas DataFrame

overwrite\_composite(_pca\_id_, _name_, _holdings\_type_, _holdings_, _weight\_schema_, _weights\=''_, _price\=''_, _currency\=''_, _shares\_out\=''_, _industry\=''_, _leverage\=1.0_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA.overwrite_composite "Link to this definition")

Overwrite an existing compossite asset.

If the composite id (`pca_id`) does not exist, it will be created. Additional information about the parameters can be found in the Online Assistant Page 12557.

Parameters:

-   **pca\_id** (_str_) – The ID of the composite asset.
    
-   **name** (_str_) – The name of the composite asset.
    
-   **holdings\_type** (_str_ _or_ _HoldingTypes Enum_) – The holdings type of the composite asset. As strings you can use one of the following: ‘portfolio’, ‘screen’, ‘formula’ or ‘identifier’. As an alternative you can use the Enums from the pca module - pca.HoldingTypes.
    
-   **holdings** (_str_ _or_ _OFDB instance_) – This is the expression according to the holdings\_type. If you have formula as holdings\_type, you should specify the formula to be used. If you have ‘screen’ or ‘portfolio’ as holdings\_type, you should specify the path of the screen/portfolio or OFDB instance. If you have identifier as holdings\_type you should pass the identifier to be used.
    
-   **weight\_schema** (_str_ _or_ _WeightingSchemas Enum_) – The weighting schema of the composite asset. As strings you can use one of the following: ‘shares’, ‘percent’, ‘mcap’ or ‘equal’. As an alternative you can use the Enums from the pca module - pca.WeightingSchemas.
    
-   **weights** (_str__,_ _optional_) – If your weight\_schema is ‘percent’ or ‘mcap’ you should pass the expression for it.
    
-   **price** (_str__,_ _optional_) – The price for the composite asset. You can enter ‘mcap’ if you want to use the portfolio market value as price. Otherwise, you can specify screening formula, like ‘P\_PRICE(0)’.
    
-   **currency** (_str__,_ _optional_) – The currency for the price field. It should be the three letter ISO, for e.g. ‘USD’ for US dollar. Specify currency only if price is different from the default empty string or ‘mcap’.
    
-   **shares\_out** (_str__,_ _optional_) – This can be a screening formula or enter a fix value.
    
-   **industry** (_str__,_ _optional_) – Enter formula to be used for dynamic update or use a simple string to fix the industry.
    
-   **leverage** (_float__,_ _optional_) – The leverage factor for the composite asset.
    

Return type:

`None`

Returns:

None

_property_ path[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA.path "Link to this definition")

Return the PCA folder path.

Returns:

The destination folder path for composite assets.

Return type:

str

rename\_composite(_old\_id_, _new\_id_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.PCA.rename_composite "Link to this definition")

Change the ID of an existing composite.

All of the parameters stays absolutely the same.

Parameters:

-   **old\_id** (_str_) – The old id of the composite asset.
    
-   **new\_id** (_str_) – The new id of the composite asset.
    

Return type:

`None`

Returns:

None

## HoldingTypes[#](https://fpe.factset.com/docs/pca.html#holdingtypes "Link to this heading")

_enum_ fds.fpe.pca.HoldingTypes(_value_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.HoldingTypes "Link to this definition")

Valid values are as follows:

PORTFOLIO _\= <HoldingTypes.PORTFOLIO: ('Portfolio', 1)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.HoldingTypes.PORTFOLIO "Link to this definition")

SCREEN _\= <HoldingTypes.SCREEN: ('Screen', 2)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.HoldingTypes.SCREEN "Link to this definition")

FORMULA _\= <HoldingTypes.FORMULA: ('Formula', 3)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.HoldingTypes.FORMULA "Link to this definition")

IDENTIFIER _\= <HoldingTypes.IDENTIFIER: ('Identifier', 4)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.HoldingTypes.IDENTIFIER "Link to this definition")

## WeightingSchemas[#](https://fpe.factset.com/docs/pca.html#weightingschemas "Link to this heading")

_enum_ fds.fpe.pca.WeightingSchemas(_value_)[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.WeightingSchemas "Link to this definition")

Valid values are as follows:

SHARES _\= <WeightingSchemas.SHARES: ('Shares', 1)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.WeightingSchemas.SHARES "Link to this definition")

EQUAL _\= <WeightingSchemas.EQUAL: ('Equal', 2)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.WeightingSchemas.EQUAL "Link to this definition")

MARKET\_CAP _\= <WeightingSchemas.MARKET\_CAP: ('Market Cap', 3)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.WeightingSchemas.MARKET_CAP "Link to this definition")

PERCENT _\= <WeightingSchemas.PERCENT: ('Formula(Percent)', 4)>_[#](https://fpe.factset.com/docs/pca.html#fds.fpe.pca.WeightingSchemas.PERCENT "Link to this definition")
