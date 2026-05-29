---
created: 2026-05-05T19:24:10 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/16698
author: 
---

# Online Assistant : Defining Logic

> ## Excerpt
> Launch it with FactSet Search: @ISC

---
## Defining Logic Page 16698

Launch it with FactSet Search: @ISC

Logic defines the relationship between your screen parameters. This will help you narrow your screen.

Click the **Adjust Logic** button to launch the Logic dialog box from an open screen in the Idea Screening toolbar.

![](online-assistant/20139.html)

Topics covered:

-   [Understanding the Logic Tree](https://my.apps.factset.com/oa/pages/16698#logic_tree)
-   [Adjusting Logic for Parameters](https://my.apps.factset.com/oa/pages/16698#define)
-   [Updating Result Counts](https://my.apps.factset.com/oa/pages/16698#result)

___

## Understanding the Logic Tree

The Logic dialog displays a box for each parameter defined in your screen. By default, all search parameters added to a new screen have "AND" logic. If you're using a previously saved screen, the logic is not always "AND" as the logic used is saved with the screen. You can adjust the logic by dragging and dropping parameters within the Logic tree as [shown below](https://my.apps.factset.com/oa/pages/16698#define). The default logical relationship is displayed as follows:

-   AND parameters are displayed vertically
-   OR parameters are displayed horizontally

### Example

![](online-assistant/20139.1.html)

Example logic = P1 and P2 and (P3 or P4)

Each logic box also comes with an accompanying Filtered Count, representing the remaining entities still in the available universe after the filter is applied to the screen. When you first open the Logic tree, click the **Update Counts** button to generate the Filtered Counts.

[Top of Page](https://my.apps.factset.com/oa/pages/16698#top)

___

## Adjusting Logic for Parameters

To change logic for a specific parameter, drag and drop the parameter to the desired spot.

-   To change from AND to OR logic, drag and drop the parameter so it's adjacent to the appropriate parameter that you want to include in the OR statement.
-   To change from OR to AND logic, drag the parameter from the OR statement and hover over the AND statement that you want to include the parameter below. You can see when you're ready to "drop" the parameter once the tooltip changes to include AND at the end of the parameter detail. In the following example, Sector and Industry is being moved from OR to AND logic:
    
    ![](online-assistant/20139.2.html)
    
-   To group parameters, drag and drop a parameter onto another parameter to customize the order in which the group(s) is executed within the screen. Parameters part of the same group will appear within their designated grey box.
-   To quickly include or exclude a parameter from the Logic dialog box, click the "incl" or "excl" toggle in the upper right corner of the individual box.
-   To update the Filtered Counts, click the **Update Counts** button

[Top of Page](https://my.apps.factset.com/oa/pages/16698#top)

___

## Updating Result Counts

To view the number of entities that pass each criteria with the selected logic, as well as update the Filtered Counts, click the **Update Counts** button. The values displayed in the lower right corner show you the number that passed for that individual item against the entire universe. You can view the count(s) against the universe for any groups you've created, as well as a Total Count value that shows the number of entities that passed all criteria at the bottom of the Logic dialog box.

[Top of Page](https://my.apps.factset.com/oa/pages/16698#top)
