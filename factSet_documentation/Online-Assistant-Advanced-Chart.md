---
created: 2026-05-05T19:03:41 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21169
author: 
---

# Online Assistant : Advanced Chart

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Advanced Chart Formatting Page 21169

Launch it with FactSet Search: @AT4

The Edit Chart page shows advanced chart formatting options. To access the Edit Chart page, right-click in a [chart tile](https://my.apps.factset.com/oa/pages/pages/21157#format), select "Format," and then select the **Advanced** button.

Click through sections in the left pane of the Edit Chart page to define options, or click on an area in the Chart Preview to be directed to the left pane section that contains the area's formatting options.

Topics covered:

-   [Series and Regions](https://my.apps.factset.com/oa/pages/21169#series)
-   [Backgrounds & Borders](https://my.apps.factset.com/oa/pages/21169#back)
-   [Axes](https://my.apps.factset.com/oa/pages/21169#axes)
-   [Legends](https://my.apps.factset.com/oa/pages/21169#legends)

___

## Series and Regions

Customize each data series (e.g., individual lines, bars, or pie-chart segments) or highlighted region in your chart.

### Draw Style

-   **Break on NA**: Show a break in any series that returns an "N/A" value at a given time. For example, if you were charting a P/E ratio over time, and at one point, the company had negative earnings and thus returned an "N/A" P/E value until it had positive earnings again, this option would actually show a break in the chart line during the negative-earnings period. 
-   **Fill Style**: Select a solid color, hatched color, or gradient (two colors blended) as the fill style.
-   **Line Style**: Add a border to the charted series. Select a border color, line width, and line style from the drop-down menus.
-   **Bin Width**: Define how wide the charted series should be.

### Marker

-   **Show Marker**: Select to add markers to your data series. This will also add the marker in the legend.
-   **Style**: Select a marker style (square, circle, triangle, etc.).
-   **Fill Color**: Select the fill color.
-   **Line Style**: Select an outline width and style for the markers.
-   **Size**: Drag the indicator up/down to adjust the size of the marker. 

### Data Labels

Data labels show the value of each dataset. When enabled, the label will be displayed for every series in the chart. 

-   **Show Data Label:** Select to show data labels in the chart. 
-   **Numeric Data Value**: Customize how numbers are displayed on the label. 
    
    -   Default: This is the default numbering system, with no special formatting available.
    -   Custom: Customize the following:
        -   **Negative Number Format**: Select how to represent negative numbers in the label ("-1" vs.(1)), as well as Western vs. European locale. The "Western" setting uses decimal points to separate integers from fractional values, whereas the "European" setting uses commas. The value "one and a half" is represented as "1.5" (Western) or "1,5" (European).
        -   **Decimal Places**: Specify the number of decimal places.
    -   Advanced: Select an advanced format from the drop-down menu or click inside the text box to create your own format. 
        
        Review the available [date, time, and numeric formats](https://my.apps.factset.com/oa/pages/pages/14323#date).
        
        Specify a PreFix and/or PostFix for your axis label. For example, if you specified a PreFix of "$" your axis numbers might read: $100, $200, $300, and so on. Using a PostFix of "%", your axis numbers might read: 10%, 20%, 30%, and so on.
        
-   **Font**: Specify the font face, color, and size of the label text.
-   **Position**: Specify the position of the data label.  
-   **Fill Style**: Select the fill color.
-   **Line Style**: Select an outline width and style for the data label.

### End of Line Labels

End-of-line labels (i.e., Quick Labels) are dynamic labels can add to the end of a charted series. You can place a Quick Label on every series in the chart or on one individual series. 

-   **Show End of Line Label:** Select to show Quick Labels in the chart. 
-   **Text**: You can customize what appears in a Quick Label. 
    
    |Max|The maximum value for a series' dataset (excluding NA)|
    |---|---|
    |Min|The minimum value for a series' dataset (excluding NA)|
    |First|The first non-NA value listed under a series' dataset|
    |Last|The last non-NA value listed under a series' dataset|
    |Label|The series label (the title entered in the [Series Name in Legend](https://my.apps.factset.com/oa/pages/21169#series_name_legend))|
    |Change over range|The difference between the first and last values on the chart|
    |Percent change over range|The percent change between the first and last values on the chart|
    |Custom|Hard-code text|
    
    Depending on the selected Text, you can customize how numbers are displayed on the label. 
    
    -   Default: This is the default numbering system, with no special formatting available.
    -   Custom: Customize the following:
        -   **Negative Number Format**: Select how to represent negative numbers in the label ("-1" vs.(1)), as well as Western vs. European locale. The "Western" setting uses decimal points to separate integers from fractional values, whereas the "European" setting uses commas for this purpose. The value "one and a half" is represented as "1.5" (Western) or "1,5" (European).
        -   **Decimal Places**: Specify the number of decimal places.
    -   Advanced: Select an advanced format from the drop-down menu or click inside the text box to create your own format. 
        
        Review the available [date, time, and numeric formats](https://my.apps.factset.com/oa/pages/pages/14323#date).
        
        Specify a PreFix and/or PostFix for your axis label. For example, if you specified a PreFix of "$" your axis numbers might read: $100, $200, $300, and so on. Using a PostFix of "%", your axis numbers might read: 10%, 20%, 30%, and so on.
        
-   **Font**: Specify the font face, color, and size of the label text.
-   **Left Label Position**: Choose if you want to add the label to the left side of the charted series.

### Conditional Coloring

Set the color of the series based on a threshold value. For example, if the series falls below 0, you can make it a different color.

To apply conditional coloring:

1.  Select the "Show Conditional Coloring" check box to enable coloring.
2.  Select which axis to apply the coloring to.
3.  Specify the threshold and how to format the values that go above/below the threshold. 

[Top of Page](https://my.apps.factset.com/oa/pages/21169#top)

___

## Backgrounds & Borders

-   **Plot Background**: The area in which the chart is actually plotted. Normally this falls within the confines of the X- and Y-Axes. The plot area is in front of the canvas background.
-   **Canvas Background**: The area surrounding the chart: the legend, titles, and so on. The chart area is the background upon which the plot area "hangs," like a painting on the museum wall. If no formatting is specified for the plot area, the canvas formatting will show through in the plot area.

In the following screenshot, the _Plot Background_ is black and the _Canvas Background_ is gray.

![](online-assistant/26605.html)

### Fill Style

Select a solid color, hatched color, or gradient (two colors blended) as the fill style.

### Line Style

Add a border around the background.

### Margins

Customize the margins of the plot area.

### Equate Left and Right Margins

Select to force the left and right margins to be symmetrical. This is only available for the plot area.

[Top of Page](https://my.apps.factset.com/oa/pages/21169#top)

___

## Axes

Customize the appearance and data of the X and Y axes of your chart.

### Show Axis

Select to display series labels on the axis.

![](online-assistant/26605.1.html)

|**Note**|You can hide/display axis _titles_ in the report view. To enable axis titles, right-click in the axis and select "Show axis label." In the screenshot below, the X axis title is "Grouping" and the Y axis title is "Port. Weight."
|---|---|
![](online-assistant/26605.2.html)|

### Font Style

Specify the font face, color, and size of the axis label text.

### Line Style

Customize the colors, thickness, and style of the axis lines using the drop-down menus.

### Max and Max Axis Length (% of Plot)

Specify maximum and minimum axis length as a percentage of the overall chart size.

### Major and Minor Gridline Style

Customize the axis lines on your chart. Major gridlines for the X axis run vertical, while major gridlines for the Y axis run horizontal. Customize the colors, thickness, and style of the axis lines using the drop-down menus.

Select the "Show Major/Minor Tick Marks" check boxes to show gridlines on the chart, or deselect one or both check boxes to remove gridlines.

### Axis Scale

You can adjust the automatic settings for tick modes. You can adjust the automatic settings for tick modes. In "Auto" mode, the chart will dynamically compute values for each of these options. Select "Custom" if you would prefer to define your own values. The options will vary depending on the chart.

-   **Label**: Select a display format for the dates in the chart. Click inside the text box to create your own format; review [Date Formats](https://my.apps.factset.com/oa/pages/pages/14323#date) for the available values.
-   **Min & Max Values**: The minimum and maximum values used to scale the chart.
    -   **Auto**: This option allows the chart to pre-compute where its major/minor tick marks are drawn for optimal spacing.
    -   **Fixed**: Define the values of the first and last major tick mark.
-   **Minor and Major Units**: The number of units to space out each major or minor tick mark.
    -   **Allow partial major units at the top & bottom of the scale**:
    -   **Use Minor & Major Values**:
        -   **Auto**: This option allows the chart to pre-compute where its major/minor tick marks are drawn for optimal spacing.
        -   **Fixed**: Major/minor tick marks and labels align with the endpoints of the axis.
    -   **Use # of Tick Marks**: A major tick mark and label aligns with the endpoints of the axis. The tick offset is computed based on the "Use # of Tick Marks" value so there are exactly the "number of ticks" produced.

### Axis Scale Label

Customize how your axis labels appear on your chart.

-   **Default**: This is the default axis numbering system, with no special formatting available.
-   **Custom**: Customize the following:
    -   **Negative Number Format**: Select how to represent negative numbers on an axis ("-1" vs.(1)), as well as Western vs. European locale. The "Western" setting uses decimal points to separate integers from fractional values, whereas the "European" setting uses commas for this purpose. The value "one and a half" is represented as "1.5" (Western) or "1,5" (European).
    -   **Decimal Places**: Specify the number of decimal places.
-   **Advanced Label Value Format**: You can select an advanced format from the drop-down menu or click inside the text box to create your own format.
    
    Review the available [date, time, and numeric formats](https://my.apps.factset.com/oa/pages/pages/14323#date).
    
    Specify a PreFix and/or PostFix for your axis label. For example, if you specified a PreFix of "$" your axis numbers might read: $100, $200, $300, and so on. Using a PostFix of "%", your axis numbers might read: 10%, 20%, 30%, and so on.
    

### Use Log Scale

Select to use the logarithmic scale. With the logarithmic scale, the axis is structured so that the scaling applied is based on a 10-log function.

### Reverse Drawing

Select to reverse the order of the X and Y axes so that the Y axis will draw from top to bottom and the X axis will draw from right to left.

### Show Outlier Axis

Outliers are auto-scaled by default. Select the "Show Outlier Axis" check box to show a separate axis for any outlier data in your chart.

Sometimes, valuation time series data will have spikes that dominate the series, making it difficult to notice trends. This is generally due to the denominator value of the ratio being unusually low. A relevant example is how an extremely low EPS value can cause a spike in the PE for that time period. Outlier handling visually improves time series data (with spikes) by focusing on more crucial sets of data.

### Outlier Area Size (% of Plot)

Specify values for outlier cutoffs as a percentage of the overall chart size. Sometimes, valuation time series data will have spikes that dominate the series, making it difficult to notice trends.

### Apply Standard Deviation Based Outlier Clipping

Select to find the outliers that are most meaningful to you. This allows you to control maximum/minimum factor outliers using a number of standard deviations away from the universe average for each period (i.e., normal distribution). Next, enter the number of standard deviations (using a positive value) you want to use to limit the minimum or maximum factor value allowed. 

### Outlier Max & Min

Specify an actual value to control maximum/minimum outlier values.

[Top of Page](https://my.apps.factset.com/oa/pages/21169#top)

___

## Legends

Customize the appearance of your chart's legend.

### Show Legends

To show or hide the entire legend, select or deselect the "Show Legend" check box.

### Font

Change the font face, font size, and font color of the legend text.

### Fill Style

Add a background color to your legend. Select a solid color, hatched color, or gradient (two colors blended together) as the fill style.

### Line Style

Add a border to your legend. Select a border color, line width, and line style from the drop-down menus.

### Series List Direction

Choose the direction the legend entries are grouped: Horizontal (row) or Vertical (column).

### Position

Specify the position of your chart's legend. Select an option corresponding to where you'd like the legend to appear. Note that some positions are inside the chart's plot area, while others are outside the chart's plot area. To specify a custom position for your legend, select an option nearest the place where you'd like to place the legend, then enter values in the X Offset and Y Offset boxes to position the legend precisely.

### Series Name in Legend

To change a legend entry's name, select a series, click the **Configure** button and enter a new name. Select the "Show in Legend" check box to show the entry in the legend.

![](online-assistant/26605.3.html) 

[Top of Page](https://my.apps.factset.com/oa/pages/21169#top)
