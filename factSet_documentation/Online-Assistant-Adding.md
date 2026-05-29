---
created: 2026-05-05T19:19:27 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21060
author: 
---

# Online Assistant : Adding

> ## Excerpt
> Use conditional formatting in Universal Screening to make your reports easier to interpret. You can add formatting to securities, group statistics, and/or report statistics using conditions, up/down (positive values vs. negative values), and heat maps.

---
## Adding Conditional Formatting Page 21060

Use conditional formatting in Universal Screening to make your reports easier to interpret. You can add formatting to securities, group statistics, and/or report statistics using conditions, up/down (positive values vs. negative values), and heat maps. 

To get started, expand the Format Results pane, choose the Conditional Format tab, and then select a data column from the left pane. 

Topics covered: 

-   [Specifying Conditions for Conditional Formatting](https://my.apps.factset.com/oa/pages/21060#SpecifyingConditions)
-   [Using Up/Down Formatting](https://my.apps.factset.com/oa/pages/21060#UpDown)
-   [Using Heat Map Formatting](https://my.apps.factset.com/oa/pages/21060#Heatmap) 

___

## Specifying Conditions for Conditional Formatting

You can create conditions to format parameters based on their relation to a value, another parameter, report statistics, or group statistic. Apply a font and/or cell color, bond, italics, and/or underline to values that meet a given condition: 

-   **Values:** Compare the value for each security to a hardcoded value(s) 
-   **Other Column:** Compare each security's value for one parameter to the value in another parameter
-   **Report Statistic:** Compare the value for each security to a report-level [statistic](https://my.apps.factset.com/oa/pages/pages/20607#Adding), which includes Average, Weighted Average, Harmonic Average, Weighted Harmonic Average, Median, and more. The statistic does not need to be displayed in the report. 
-   **Group Statistic:** Compare values for each security to a statistic for their immediate group. This report should have [groupings](https://my.apps.factset.com/oa/pages/pages/20607#Defining) applied to use this option. Available statistics include Average, Weighted Average, Harmonic Average, Weighted Harmonic Average, Median, and more. The statistic does not need to be displayed in the report. 

You can set multiple conditions for the same parameter. If you set multiple conditions, the first condition that's met – which appears at the top of the conditions workspace – will be the one applied to a given value. 

To create a condition: 

1.  Select "Conditions" from the drop-down menu in the first pane of the Conditional Format tab. 
    
    ![](online-assistant/26368.html) 
2.  Select whether you want to apply the formatting to security data, report statistics, and/or group statistics. 
3.  To use the values returned by a different column to determine the formatting, choose a column from the Select Report Columns pane. 
4.  In the second pane of the Conditional Format tab, select the desired relation from the Operator drop-down menu.  
    
    ![](online-assistant/26368.1.html) 
5.  Use the Reference drop-down menu to specify if you'd like to compare to a value, another parameter, report statistic, or group statistic. 
    
    ![](online-assistant/26368.2.html) 
    
    |**Tip**|For textual columns (e.g., Name), you can enter an "Equal to," "Not Equal to," "Contains," or "Is Not Available" condition.|
    |---|---|
    
6.  Select the desired font and/or cell color, as well as bold, italic, and/or underline formatting. 
7.  Click the **Add** button ![](online-assistant/26368.3.idunno) to add the condition to the conditions workspace, which is located directly beneath the Security, Report Statistics, and Group Statistics check boxes. The condition will also be added to your report results. To edit the selected condition, click the **Modify** button ![](online-assistant/26368.4.html) in the bottom right of the Conditional Format tab. 
8.  If you want to raise or lower the priority of the condition, place your cursor over its **Drag to reorder** button ![](online-assistant/26368.5.html) and then drag and drop the condition to the desired spot. 
    
    ![](online-assistant/26368.6.html) 

|**Note**|While you are able to apply more than one _condition_ to a single parameter, you cannot apply more than one _heat map_ or _up/down_ format to it. Additionally, only one type of formatting option (e.g., "Conditions") can be applied to a parameter. For example, if you apply multiple conditions to a single parameter, you cannot add heat map or up/down formatting that parameter.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21060#top)

___

## Using Up/Down Formatting

Use the Up/Down option to format a report parameter in different colors depending on whether the value is positive or negative. 

To set up/down formatting: 

1.  Select "Up/Down" from the drop-down menu in the first pane of the Conditional Format tab. This is the default selection. 
    
    ![](online-assistant/26368.7.html) 
2.  Select whether you want to apply the formatting to security data, report statistics, and/or group statistics.
3.  To use the values returned by a different column to determine the formatting, choose a column from the Select Report Columns pane. 
4.  Select the desired font and/or cell color, as well as bold, italic, and/or underline formatting. 
5.  Click the **Add** button ![](online-assistant/26368.8.html) to add the condition to the conditions workspace and to apply it to your report results. Once the condition is added, you can edit it by clicking the **Modify** button ![](online-assistant/26368.3.idunno) in the bottom right of the tab.  

|**Note**|Zero and NA data cannot be formatted when using the Up/Down option.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21060#top)

___

## Using Heat Map Formatting 

Use the Heat Map option to help visualize where the value for each security falls relative to the other securities in the report. The values that approach the set maximum and minimum will be brighter shades of the colors that you specify. 

To create a heat map condition: 

1.  Select "Heat Map" from the drop-down menu in the first pane of the Conditional Format tab. 
    
    ![](online-assistant/26368.4.html)
2.  Select whether you want to apply the formatting to security data, report statistics, and/or group statistics.
3.  To use the values returned by a different column to determine the formatting, choose a column from the Select Report Columns pane. 
4.  Select the desired distribution from the Distribution Type drop-down menu, which allows you to select the mid-point of the key. In Linear mode, this is zero, so colors in the key are distributed around zero. In Mean mode, the mid-point is mean, so colors in the key are distributed around the mean. 
5.  Enter a number of standard deviations into the Clamp Data text box. The maximum and minimum values are determined based on the value entered here, in standard deviations from zero in Linear mode or in standard deviations from the mean in Mean mode. 
6.  Select the desired color families to use by clicking the Max Color, Mid Color, and Min Color boxes.
7.  Click the **Add** button ![](online-assistant/26368.9.html) to add the condition to the conditions workspace and to apply it to your report results. Once the condition is added, you can edit it by clicking the **Modify** button ![](online-assistant/26368.8.html) in the bottom right of the tab.  

[Top of Page](https://my.apps.factset.com/oa/pages/21060#top)
