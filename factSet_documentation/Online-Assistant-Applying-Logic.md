---
created: 2026-05-05T19:18:37 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20673
author: 
---

# Online Assistant : Applying Logic

> ## Excerpt
> Logic defines the relationships between your universe limitations. In addition, AND, OR, and NOT are the logical operators used to transform your specified criteria into a logical statement. Parentheses are used to group the criteria together.

---
## Applying Logic to Limitations Page 20673

Logic defines the relationships between your universe limitations. In addition, _AND_, _OR_, and _NOT_ are the logical operators used to transform your specified criteria into a logical statement. Parentheses are used to group the criteria together. 

Examples of logical statements include common stock from Australia or New Zealand, constituents of the FTSE – All Share Index, except Financials or Utilities, and Asian or European airline stocks with a load factor greater than 75.

![](online-assistant/25830.html)

Click the **Logic** button ![](online-assistant/25830.1.html) in the Select Criteria pane to launch the Logic text box.

Topics covered:

-   [Default Logic](https://my.apps.factset.com/oa/pages/20673#Default)
-   [Custom Logic](https://my.apps.factset.com/oa/pages/20673#Custom)

___

## Default Logic 

By default, logic is applied to each criteria item that you select. The following section identifies the logical operator used when certain items are selected.

**Criteria Items from the Same Category: OR**  

In most cases, OR is the logical operator used when items are selected from the same category. However, if more than one item is selected from the _Formulas_ category, AND is defaulted. 

For example, if you select France and Germany from the Geography category, your universe will consist of securities from France _or_ Germany. On the other hand, if you select FF\_SALES(ANN,0)>5000 and FF\_PE(ANN,0)>5 from the Formulas category, your universe will consist of securities whose most recent net sales/revenue exceeds 5000 _and_ most recent price to earnings exceeds five. 

**Criteria Inclusions from Different Categories: AND** 

For example, if you select Preferred from the Security category and New York Stock Exchange (NYSE) from the Exchange category, your universe will consist of all preferred stocks listed on the NYSE.

**Criteria Inclusion from Formulas, Custom Formulas, Functions: AND** 

For example, if you create custom formula limits of sales growth greater than 10 and price to earnings less than 20, only securities that pass both of these limits will be in your universe.

**Criteria Inclusions from the Identifier Category: OR**   

These inclusions always use the OR operator within the entirety of the logic statement. This means that the specified securities will always be part of your universe.

For example, if you select Fuji Heavy Industries from the Identifier category, then Fuji Heavy Industries will always be part of your universe, regardless of what other inclusions/exclusions are specified.

**Criteria Exclusions: AND NOT** 

These exclusions use the AND NOT operator within the entirety of the logic statement (i.e., aside from identifier inclusions).

For example, if you add an exclusion of utilities, then all utilities will be excluded from your universe.

**Criteria Exclusions from the Identifier Category: AND NOT** 

These exclusions always use the AND NOT operator within the entirety of the logic statement. This means that they will always be excluded from your universe.

[Top of Page](https://my.apps.factset.com/oa/pages/20673#top)

___

## Custom Logic

Criteria items (i.e., limitations) are labeled L1, L2, and so forth. If you wish to edit the default logic, click the **Logic** button ![](online-assistant/25830.2.html) and then edit the relationship defined in the populated text box. This will change the relationship between the selected criteria.

![](online-assistant/25830.1.html) 

To validate your changes, click out of the Logic box. If you have constructed an invalid logical relationship, an error message will appear; in addition, the screen will not be able to run until the statement is corrected.  

Once your logic is edited from the default, the rules for creating default logic will no longer apply to your universe.

[Top of Page](https://my.apps.factset.com/oa/pages/20673#top)
