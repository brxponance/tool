---
created: 2026-05-05T19:20:11 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21266
author: 
---

# Online Assistant : Setting Global

> ## Excerpt
> Launch it with FactSet Search: @US

---
## Setting Global Variables Page 21266

Launch it with FactSet Search: @US

A global variable is a Universal Screening feature that allows you to use special variables instead of entering dates, [OFDB](https://my.apps.factset.com/oa/pages/pages/3934#ofdb) file names, formulas or part(s) of a formula in your parameters. For example, with global variables, you can set the dates for all the parameters in your report in one place.

Topics covered:

-   [Defining Global Variables](https://my.apps.factset.com/oa/pages/21266#Defining)
-   [Viewing Common Global Variables](https://my.apps.factset.com/oa/pages/21266#Viewing)

___

## Defining Global Variables

Click the **Variables** button ![](online-assistant/26616.html) in the [Results pane](https://my.apps.factset.com/oa/pages/pages/20608) to set the dates for all the parameters in your report in one place. For example, the formula FF\_NET\_INC(ANN,#V.Y) uses #V.Y to hold the year argument. When #V.Y is updated in the global variables dialog, all parameters with #V.Y as a year argument will be updated accordingly.

![](online-assistant/26616.1.html)

Click the **Lookup** button ![](online-assistant/26616.2.html) next to each variable to launch [Identifier Lookup](https://my.apps.factset.com/oa/pages/pages/14587) and select your desired portfolio or company identifiers. To input a specific date, click an interactive date shown in the **Calendar** widget ![](online-assistant/26616.3.html). You can also select a particular month or year using the drop-down menus. 

![](online-assistant/26616.4.html)

|**Tip**|Double-click any row within the Definition column to customize the text or values shown. This is especially helpful when variables need to be updated, when a selected portfolio has a lengthy file path, or when a preexisting definition is no longer applicable.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21266#top)

___

## Viewing Common Global Variables 

The following table provides the global variable formats used in the new version of Screening. 

|**Legacy Screening Variables**|**New Screening Variables**|
|---|---|
|_#Letter/Name_|#V._Letter/Name_|

This table provides common global variables that were set and defined in legacy Screening along with examples that show how you to use these variables within parameters and formulas in the new Screening.

|**Legacy Variable**|**New Screening Equivalent**|**Variable Description**|**Example Formulas with Variables**|
|---|---|---|---|
|#D|#V.D|D represents a daily date (e.g., (MM/DD/YYYY format)|P\_PRICE(#V.D)|
|#M|#V.M|M represents a monthly date (e.g., MM/YYYY format)|FF\_EPS(MON,#V.M)|
|#Q|#V.Q|Q represents a quarterly date (e.g., YYYY/_n_C or YYYY/_n_F)|FF\_SALES(QTR,#V.Q)|
|#Y|#V.Y|Y represents an annual date (e.g., YYYY format)|FF\_DPS(ANN,#V.Y)|

[Top of Page](https://my.apps.factset.com/oa/pages/21266#top)
