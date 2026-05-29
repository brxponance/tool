---
created: 2026-05-05T19:24:07 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/16697
author: 
---

# Online Assistant : Working with

> ## Excerpt
> Launch it with FactSet Search: @ISC

---
## Working with Screening Parameters Page 16697

Launch it with FactSet Search: @ISC

You can customize existing reports or create new ones by managing the parameters within your screen. This page explains how to work with parameters to customize your screens using items in the Screen pane.

Topics covered:

-   [Adding Parameters](https://my.apps.factset.com/oa/pages/16697#adding)
-   [Adding Portfolios/Identifier Lists to Your Screen](https://my.apps.factset.com/oa/pages/16697#port)
-   [Deleting Parameters](https://my.apps.factset.com/oa/pages/16697#deleting)
-   [Moving Parameters](https://my.apps.factset.com/oa/pages/16697#moving)
-   [Filtering by Your Favorite Parameters](https://my.apps.factset.com/oa/pages/16697#filter)

___

## Adding Parameters

To add parameters to your screen:

1.  Highlight the desired parameter. To view the definition for the item, hover your mouse over the parameter's **Information** icon.
    
    ![](online-assistant/20149.html)
2.  Double-click a parameter within the Search Items tab in the Tasks pane to add it to your screen. To add the parameter to a specific location, drag the parameter from your Tasks pane and drop it in the Search pane. See the [table below](https://my.apps.factset.com/oa/pages/16697#types) for parameter types.
    
    Range parameters (e.g., Date Range) include example texts to demonstrate appropriate syntax.
    
    ![](online-assistant/20149.1.html)
    
3.  Define your search by adding values to your screening parameters within the Criteria page. Using the example above, you can see the screen will be further limited by a Fund Target EBIT Range between $5 and $10 million.
4.  (Optional) To change the screening logic for your included parameters, click the [Logic](https://my.apps.factset.com/oa/pages/pages/16698) button.
    
    ![](online-assistant/20149.2.html)
5.  (Optional) Select a currency for your screen and report using the Currency drop-down menu in the upper-right corner. The default currency is USD.
    
    ![](online-assistant/20149.3.html)

### Parameter Types

|**Type**|**Description**|**Example**|
|---|---|---|
|Boolean|Allows you to screen the parameter using Yes/No/Neutral properties.
**The parameter contains a check box that can take three states:**
-   **Selected**: includes the parameter in the screen
-   **Excluded:** actively excludes the paramter from the search
-   **De-selected:** has no impact on the seach|**PE/VC:** Evergreen Fund
**Companies:** SEC/Annual report filer
**PIPE:** First-time issuer|
|Date|Searches using date and date/time properties using dates in either absolute (MM/DD/YYYY) or relative format. Click the **Calendar** button to select an absolute date. Clicking the calendar header will zoom out one level from day to month or from month to year.
Relative dates are available from the date field's drop down. You can manually input both date types by using the appropriate syntax in the relevant field, as well as combine Absolute and Relatives Dates in a range search.|**PE/VC:** Investment/Round Date
**Companies:** Fiscal year end|
|List|Displays a list of check boxes you can select to indicate which categories to screen on. Selecting multiple check boxes will use OR logic within that item so any one option will generate results for the parameter. The check boxes have three states: selected (included in the search), excluded (actively excluded from the search), and de-selected (no impact on the seach)|**PE/VC:** Any of the "Type" or "Status" items (e.g., Type of Investor or Company Status)|
|Hierarchical List|Similar to the List type, except that Hierarchical Lists are in tree form with expandable and collapsable categories. Selecting the top-level item will automatically select all of its sub-categories, which you can then manually adjust (e.g., selecting all of Asia but exclude North Korea). The check boxes have three states: selected (included in the search), excluded (actively excluded from the search), and de-selected (no impact on the seach)|**Companies:** Company type|
|[Keyword](https://my.apps.factset.com/oa/pages/pages/16878)|Searches for keywords in large text collections (e.g., business descriptions, biographies) and supports text searching against specific properties (e.g., business description, product line and web product description).|**PE/VC:** Portfolio or Investor Description (keyword)
**Companies:** Business description (keyword)
**PIPE:** Business description (keyword)|
|Range|Searches using a range of numbers to determine what passes the screen. You can supply only one value and leave the other value unlimited.|Any financial item (e.g., EBIT or Gross Profit)|
|Type-Ahead Search|Searches against established classifications or names (e.g., Sector/Industry or Company Name). Begin typing a search term (e.g., oil) to generate a list of relevant categories to select from. Your selected category will then appear with a check box supporting three states: selected (included in the search), excluded (actively excluded from the search), and de-selected (no impact on the seach).
Type-Ahead Search is also integrated into some of the larger, List type parameters.
Including multiple items in the parameter will screen using OR logic; any one of the items generate results for the parameter.|**Company:** Company Name, Industry|

[Top of Page](https://my.apps.factset.com/oa/pages/16697#top)

___

## Adding Portfolios/Identifier Lists to Your Screen

You can also screen using identifiers from one of your proprietary [OFDB](https://my.apps.factset.com/oa/pages/pages/3934#ofdb) portfolio files.

To screen using a proprietary portfolio:

1.  Add any of the "Name" parameters to your report (e.g., Investor Name, Company Name, etc.).
2.  Click the **Lookup** button in the Name field to search for and select your desired portfolio.
    
    ![](online-assistant/20149.4.html)
3.  To include the list of identifiers from a portfolio in your report, double click the portfolio. Press the **CTRL** key and click to select more than one portfolio, or hold down the **SHIFT** key and click to select sequential ones.
    
    ![](online-assistant/20149.5.html)
    
    You can also choose to filter the portfolios shown by selecting the type of OFDB file from the Type drop-down menu. 
4.  Click **Open** to add the portfolios to your screen.

After adding your portfolio, you can include additional parameters and save the identifiers as a new identifier list to use within Idea Screening or other FactSet components. For more information, see [Saving Identifier Lists](https://my.apps.factset.com/oa/pages/pages/16700#id_lists).

[Top of Page](https://my.apps.factset.com/oa/pages/16697#top)

___

## Deleting Parameters

To delete a parameter from your screen, hover over it in the Screen pane and click the **Delete Item** icon in the top right corner.

![](online-assistant/20149.6.html)

[Top of Page](https://my.apps.factset.com/oa/pages/16697#top)

___

## Moving Parameters

To move a parameter, drag and drop the parameter in the desired position within the Screen pane.

[Top of Page](https://my.apps.factset.com/oa/pages/16697#top)

___

## Filtering by Your Favorite Parameters

You can mark parameters as favorites and filter by those favorites.

To mark a parameter as a favorite:

1.  Hover over the parameter in the Search Items tab within the Tasks pane.
2.  Click the **Favorite** icon ![](online-assistant/20149.7.html).
3.  Select "Personal Favorite" or "Client Favorite". You can select both filters to add a third filter (Personal Favorite/Client Favorite).

To filter items by your favorite parameters:

1.  Click the **Favorite** icon located to the top of the Tasks pane.
    
    ![](online-assistant/20149.8.html)
2.  Select "Personal Favorite", "Client Favorite", or both filters.

|**Tip**|FactSet has its own list of recommended parameters. To filter by these items, click the FactSet Recommended icon ![](online-assistant/20149.9.html) located at the top of the Task pane.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/16697#top)
