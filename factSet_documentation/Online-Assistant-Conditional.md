---
created: 2026-05-05T19:03:32 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21413
author: 
---

# Online Assistant : Conditional

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Conditional Formatting Page 21413

Launch it with FactSet Search: @AT4

Use conditional formatting in Alpha Testing to make your reports easier to interpret. This feature allows you to customize a column so that its values change color or format depending on their relation to a static value (up to one decimal place) or to another column.

To begin setting up conditions, click the **Tile Options** ![](online-assistant/26802.html) button (located in the top right corner of any tile), select "Tile Options," and then choose the Columns section from the left pane. Find and select the column you want to format and expand the "Conditional Format" section in the right pane.

![](online-assistant/26802.1.html)

Topics covered:

-   [Using the Custom Condition Formatting Type](https://my.apps.factset.com/oa/pages/21413#custom)
-   [Using the Heat Map Formatting Type](https://my.apps.factset.com/oa/pages/21413#heatmap)

___

## Using the Custom Conditions Formatting Type

Custom conditions are based on one column's relation to another column or value.

To create a custom condition type:

1.  [Open the Conditional Formatting options](https://my.apps.factset.com/oa/pages/21413#open).
2.  Select "Condition" from the Type drop-down menu.
    
    ![](online-assistant/26802.2.html) 
3.  Select which column you want to base the condition on using the Column drop-down menu.
    
    |**Note**|You can choose hidden columns to be Condition Columns. In other words, a column does not have to be visible in your report to use it as a Condition Column.|
    |---|---|
    
4.  (Optional) To apply the formatting to the group-level and/or summary-level cells, click the "Group Level" and/or "Total Level" check boxes. Otherwise conditions will only be determined on and applied to the lowest level of grouping.
5.  Click the **Add Condition** button.
6.  Select a relation from the drop-down menu, then enter a constant value to meet or select a column reference.
    
    ![](online-assistant/26802.3.html) 
7.  Specify how to format the values that fit the condition.
    
    ![](online-assistant/26802.4.html) 
8.  (Optional) Add another condition by clicking the **Add Condition** button again. Alpha Testing evaluates conditions from the top down. Once a group meets a condition, it is formatted and no other conditions are evaluated on that group.
    
    ![](online-assistant/26802.5.html)
    
    For example, in the previous screenshot the first condition looks for values greater than 50 and highlights those cells green. If the value is not greater than 50, the second condition is evaluated. If the second condition is met, highlight the cell red. Since these conditions are mutually exclusive and exhaustive, all cells are highlighted either red or green. In the following screenshot, the same conditions have been applied to the % > Bench, % > Up Bench, and % > Down Bench columns.
    
    ![](online-assistant/26802.6.html)
    

[Top of Page](https://my.apps.factset.com/oa/pages/21413#top)

___

## Using the Heat Map Formatting Type

Use heat map coloring to help visualize the distribution of data in any column with a color gradient. The values that approach the set maximum and minimum will be brighter shades of the colors that you specify.

![](online-assistant/26802.7.html)

|**Note**|Conditional formatting for group- and total-level values is not currently supported when using heat map formatting.|
|---|---|

To create a heat map type:

1.  [Open the Conditional Formatting options](https://my.apps.factset.com/oa/pages/21413#open).
2.  Select "Heat Map" from the Type drop-down menu.
    
    ![](online-assistant/26802.8.html) 
3.  Select the column to base the condition on from the Column drop-down menu.
4.  Use the "Calculate Heat Map Per Column" check box to determine how the heat map is applied to an iterated column.
    -   **When deselected**: (Default behavior) Evaluate all numbers at once and apply the heat map to the matrix of values. This means if one column's values are very positive or negative relative to the other iterations, it will be fully green or red.
    -   **When selected**: Evaluate each iteration separately, highlighting the highest and lowest values for each column instead of across the entire matrix of values.
5.  Select the desired color families using the Minimum, Base, and Maximum drop-down menus.
6.  Enter a number of standard deviations in the Clamp Data text box. The maximum and minimum values are determined based on the value entered here, in standard deviations from zero in Linear mode or in standard deviations from the mean in Mean mode.
    
    Alternatively, you can drag the indicator left or right to adjust the standard deviations. 
    
    ![](online-assistant/26802.9.html)
7.  Select the desired distribution from the Distribution drop-down menu. This allows you to select the mid-point of the Key. In Linear mode this is zero, so colors in the Key are distributed around zero. In Mean mode the mid-point is the mean, so colors in the Key are distributed around the mean.

[Top of Page](https://my.apps.factset.com/oa/pages/21413#top)
