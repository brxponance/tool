---
created: 2026-05-05T19:03:44 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21170
author: 
---

# Online Assistant : Advanced Chart

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
Launch it with FactSet Search: @AT4

The Chart Options dialog lets you set advanced chart options such as select the dimensions (e.g., categories, series, plot, size, color) of a given chart type, sort and filter categories based on the values of charted data or uncharted grid data, and define chart-type specific settings. 

To define advanced chart dimension options, right-click in a chart tile and select "Chart Options." The Chart Options dialog box opens.

Alternatively, you can access advanced chart options by clicking the **Chart ![](online-assistant/27501.html)**  menu > Chart Options. 

![](online-assistant/27501.1.html) 

|**Tip**|Change the chart type in the Chart Options dialog box by clicking the **Chart Type ![](online-assistant/27501.2.html)**  menu.|
|---|---|

Topics covered:

-   [Including/Excluding Future Items (Lock icon)](https://my.apps.factset.com/oa/pages/21170#future_items)
-   [Splitting Data into Separate Sections](https://my.apps.factset.com/oa/pages/21170#splitting)
-   [Moving Data to a Different Chart Dimension](https://my.apps.factset.com/oa/pages/21170#move)
-   [Switching Chart Dimensions](https://my.apps.factset.com/oa/pages/21170#switch)
-   [Sorting and Filtering](https://my.apps.factset.com/oa/pages/21170#sort_filter)
-   [Preferences](https://my.apps.factset.com/oa/pages/21170#preferences)

___

## Including/Excluding Future Items (Lock icon)

The lock setting lets you define if data items should be automatically shown in the chart if they're added to the report at some point in the future. 

![](online-assistant/27501.3.html)

For example, the following chart shows six periods of data. The **Locked** ![](online-assistant/27501.4.html) icon indicates future periods are not allowed to be included. 

![](online-assistant/27501.5.html)

If you add more periods of data to the tile, the chart re-renders with the original six periods because the **Locked** icon was selected. You can still chart the additional periods by manually selecting the corresponding check boxes.

![](online-assistant/27501.6.html) 

This same concept applies to all groups which can change with tile settings or over time. For example:

-   Factor groups (new sectors, countries, or currencies in the universe)
-   Numeric fractiles (due to tile filters)
-   New periods (due to model updates or tile filters)

To toggle the lock setting, right-click on the icon and select the option.

![](online-assistant/27501.7.html)

[Top of Page](https://my.apps.factset.com/oa/pages/21170#top)

___

## Splitting Data into Separate Sections

Break out a sub-group to easily select consistent settings across the parent-group. The more top-level groups have consistent breakouts, the more useful this is.

For example, in the following screenshot, the three calculations (Universe Return, Excess vs. Bench, and Factor Average) are split into fractiles 1 and 5. Only fractile 1 is selected to chart. Instead of expanding each calculation and selecting "1" for each calculation, it's easier to make the same selections by rearranging the groups. 

![](online-assistant/27501.8.html)

After splitting, you only have to select the "1" check box once.  

![](online-assistant/27501.9.html)

To group the factors/fractiles/calculations separately:

1.  Click the **Tools** ![](online-assistant/27501.10.html) menu in the dimension you want to split.
2.  Select Split by Fractile (or Factor or Calculation) > Split into separate selections.
    
    ![](online-assistant/27501.11.html)
3.  The series groups are rearranged.

[Top of Page](https://my.apps.factset.com/oa/pages/21170#top)

___

## Moving Data to a Different Chart Dimension

Sometimes series breakouts can also be expressed as category breakouts. In the following chart the fractile selections are expressed as series.

![](online-assistant/27501.12.html) 

But equivalently, the fractile breakouts could be expressed as categories instead. You can switch the fractile selections to be categories using the following procedure.

To move data to another chart dimension:

1.  Click the **Tools** ![](online-assistant/27501.13.html) menu in the fractile dimension you want to move. 
2.  Select Split by Split by Fractile > Move to Categories > As separate selection. 
    
    ![](online-assistant/27501.10.html) 
3.  The fractile breakouts are now shown in the category labels. ![](online-assistant/27501.14.html) 

[Top of Page](https://my.apps.factset.com/oa/pages/21170#top)

___

## Switching Chart Dimensions

The **Switch Category & Series** button lets you easily switch the layout of your data so the information is organized in a way that makes sense to your analysis. For example, if you charted a column as a bar chart, categories show the row data and series show the column data. You can switch the chart layout so that categories show column data and series show row data.

In the following screenshot, the categories are charted on the X-axis, and the series are the legend. 

![](online-assistant/27501.15.html)

Clicking the **Switch Category & Series** button will switch the X-axis and the legend. Now, the categories are in the legend, and the series are chart on the X-axis.

![](online-assistant/27501.16.html) 

|**Note**|You can switch series breakouts with category breakouts using the [Moving Data to Different Chart Dimension](https://my.apps.factset.com/oa/pages/21170#move) feature.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21170#top)

___

## Sorting and Filtering

Sort and filter categories based on the values of charted data or uncharted grid data. Choose the "Sort & Filter" tab to view the following options:

![](online-assistant/27501.17.html) 

### Filtering

Filter out categories based on chart data values. By default, no filter is applied. 

**Filter By:** Choose a charted series to filter based on that series' data. The options in the drop-down will vary depending on the chart type.

**Filter Method:** Control which data items are included in the chart. 

-   **Greater Than N Values**: Chart only those items greater than the specified value.
-   **Less Than N Values**: Chart only those items less than the specified value.
-   **Between Min and Max Values**: Exclude values that fall outside the specified range.
-   **Top N Values**: Chart the specified number of values starting with the largest value.
-   **Bottom N Values**: Chart the specified number of values starting with the lowest value.
-   **Top/Bottom N Values**: Exclude values that fall into the specified top/bottom percentile.

**Apply to drilldowns:** Apply the same filter criteria to the drill-downs in the data series.

**Show filtered items as "Other":** Only on heatmap and pie chart types. Will group filtered out items into an "Other" category. 

### 

Sorting

Change the order of the labels and the data presented on the chart. Only available for Column/Bar and Line/Area charts.

Sort ascending or descending by:

-   Category values
-   Series values
-   Uncharted data values

[Top of Page](https://my.apps.factset.com/oa/pages/21170#top)

___

## Preferences

Choose the "Preferences" tab to view the following options to define chart-type specific settings. The options will vary depending on the chart type.

![](online-assistant/27501.18.html)

### Statistical Markers:

-   **Mean**: Adds a line to the chart to represent the series average.
-   **Regression Order**: Adds a line. Select an order of 1 for linear regression line and order greater than 1 for polynomial regression lines. 
-   **Standard Deviations**: Adds lines at _n_ standard deviations on either side of the mean. Enter the number of standard deviations and click the **Add** ![](online-assistant/27501.19.html) button to chart the line. In Scatter and Bubble charts, the standard deviations are displayed relative to the mean unless a regression line is added, in which case they are displayed relative to the regression line. 

### Heatmap Options: 

-   **Minimum/Maximum Colors**: Use heatmap coloring to help visualize the distribution of data in any column with a color gradient. The values that approach the set maximum and minimum will be brighter shades of the colors that you specify.
-   **Depth**: If the categories have multiple drill-down levels, the heatmap can be shown with increased "depth" by including the drill-down levels.
-   **Show labels for all levels**: Show the [data labels](https://my.apps.factset.com/oa/pages/pages/21169#data_labels) of each dataset. When enabled, the label will be displayed for every series in the chart. 

### Histogram Options:

-   **Show as**: Frequency or Probability. This determines the Y-axis values.
-   **Number of bins**: Define how many bins to form for the histogram chart.

### Matrix Options:

-   **Negative/Positive Colors**: Use matrix coloring to help visualize the distribution of data in any column with a color gradient. The values that approach the set negative and positive will be brighter shades of the colors that you specify.

[Top of Page](https://my.apps.factset.com/oa/pages/21170#top)
