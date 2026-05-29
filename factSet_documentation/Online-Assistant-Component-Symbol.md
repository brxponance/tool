---
created: 2026-05-05T19:02:20 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21356
author: 
---

# Online Assistant : Component Symbol

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Component Symbol Manager Page 21356

Launch it with FactSet Search: @AT4

Use the Component Symbol Manager to assign identifiers to your model's factors when fetching Multi-Factor Rank (MFR) component weights using OFDB data. The Component Symbol Manager lets you specify a symbol for each factor in the model. Alpha Testing will then use this symbol to fetch that factor’s OFDB weights. All MFRs in the model will use the symbols as listed in the Component Symbol Manager.

Topics covered:

-   [Launching the Component Symbol Manager](https://my.apps.factset.com/oa/pages/21356#launch)
-   [Editing Symbols](https://my.apps.factset.com/oa/pages/21356#edit)

___

## Launching the Component Symbol Manager

To launch the Component Symbol Manager:

1.  Click the **Model Options** button in the application toolbar.
2.  Choose Factors from the left pane of the Edit Model Options page.
3.  Click the **Tools ![](online-assistant/26720.html)**  button and select "Component Symbol Manager" from the drop-down menu.
    
    ![](online-assistant/26720.1.html)

When the Component Symbol Manager page opens, you will see your list of Factors and Universe formulas from [the Factors table](https://my.apps.factset.com/oa/pages/pages/21240). By default, each Factor has a symbol of #AFTn. During a model run, Alpha Testing replaces the _n_ with an integer indicating its order position in the Factors page. #AFTn is a dynamic identifier that will change as the order of the Factors/Universe Formulas in the Factors table changes.

Similarly, Universe Formulas will have the symbol #FRMn, where _n_ denotes the formula’s order in the Factors table.

The "Used In" column indicates when a Factor or Universe Formula is part of an MFR. This column is significant since you can only change component symbols at a model level, not an MFR level. Any edits you make to the Component Symbol will be applied to all MFRs.

![](online-assistant/26720.2.html) 

[Top of Page](https://my.apps.factset.com/oa/pages/21356#top)

___

## Editing Symbols

Highlight the row and select one of the three options in the right pane to edit the symbol. 

![](online-assistant/26720.3.html)

### Default

This will reset the Symbol to #AFTn or #FRMn.

### Symbol Name

Type the new symbol directly in the Symbol Name text box.

### Import from OFDB

Import symbols from an OFDB file. To use this option, click the **Lookup** ![](online-assistant/26720.4.html) button and select an OFDB. The "Symbols from OFDB" drop-down menu will populate with all symbols from the OFDB; select the desired symbol from the drop-down menu.

[Top of Page](https://my.apps.factset.com/oa/pages/21356#top)
