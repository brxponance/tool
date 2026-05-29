---
created: 2026-05-05T19:20:32 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21087
author: 
---

# Online Assistant : Using Row

> ## Excerpt
> Launch it with FactSet Search: @US

---
## Using Row References Page 21087

Launch it with FactSet Search: @US

You can use row references when you need to use the same calculation in more than one parameter, limit, or global variable. The order of what you are referencing does not matter, which means you can reorder parameters, limits, or global variables without changing the calculation.

The following table provides the reference prefixes used in the legacy and new Universal Screening. _n_ is the number of the parameter row being referenced. 

|**Legacy Screening Prefix**|**New Screening Prefix**|**Type of Reference**|**Example**|
|---|---|---|---|
|#_n_ / ROW_n_|#P|Parameter Reference (Result)|#P.P1|
|UROW|#UP|Parameter Reference (Universe)|#UP.P1|
|\--|#L|Individual Limit Reference|#L.L1|
|#Letter/_Name_|#V|Global Variable|#V.CURR|

For consistency, the ROW_n_ and #_n_ inputs you make in the [Results](https://my.apps.factset.com/oa/pages/pages/20608#Result) and [Parameters](https://my.apps.factset.com/oa/pages/pages/20608#Parameter) views are automatically updated to use the new #P prefix. In addition, #L references are visible from the Criteria pane, while #P and #UP references are shown via the Parameters view. #V references can be modified using the [Global Variables dialog](https://my.apps.factset.com/oa/pages/pages/21266). 

|**Tip**|In the Parameter View, hover over a hyperlink to reference pop-ups that show the underlying definition of global variables and parameter row references. 
|---|---|
![](online-assistant/29793.html)|

Looking at the following example, you can see that inputting `#5 -` `ROW6` creates a seventh parameter row. This new row calculates the parameters being referenced and also includes PRICE and PRICE\_PREV, which are their reference names. 

![](online-assistant/26401.html)

|**Tip**|Use # references instead of ROW to decrease the number of characters in your parameter. For example, instead of using `ROW1`, use `#1` to reference the first parameter in your screen.|
|---|---|

|**Note**|There is no limit placed on the number of row references you can use in a screen. However, they cannot be used with iterative functions (e.g., _FUNCTION\_NAME_n). 
|---|---|
If ROW_n_ is used as a file name or path in an ISON\_SCREEN, PRT-related, or OFDB-related formula, it is automatically converted to the #P prefix. To ensure your file names and paths remain the same, FactSet recommends that ROW_n_ is not included them. 
`ROW0` references are not converted to the #P prefix.|

### When to Use the Function: #P vs. #UP

The #P function can be used as a universe argument (where the #P function defines the universe by the referenced parameter only), whereas the #UP function checks that the securities in the report are part of the specified universe as defined by the Criteria limits and the parameter(s) referenced.

For example, you can use the Criteria pane to limit your report to the Dow Jones 65 Composite index and then set your first parameter (Row 1) to return securities in the S&P 500 index.

![](online-assistant/26401.1.html) 

When you use the UCOUNT function to return the number of securities available in the universe with the #P function (e.g., UCOUNT(#P.SP50=1,1)), then 503 will be the value returned. The screening universe is defined by the parameter listed in Row 1, which in this case is the S&P 500 index. 

![](online-assistant/26401.2.html)

However, when you use the UCOUNT function to return the number of securities available in the universe with the #UP function (e.g., UCOUNT(#UP.SP50=1,1)), then 59 will be the value returned. The screening universe is defined by the limitations set in the Criteria pane _and_ the SP50 parameter, which in this case are securities that are in both the Dow Jones 65 Composite and the S&P 500 indices.

![](online-assistant/26401.3.html)

[Top of Page](https://my.apps.factset.com/oa/pages/21087#top)
