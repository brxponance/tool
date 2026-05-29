---
created: 2026-05-05T19:03:56 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/22164
author: 
---

# Online Assistant : Configuring

> ## Excerpt
> The following page details the available output options when exporting data in Alpha Testing 4 (@AT4) and scheduling models using Quant Scheduler 2 (@QS2).

---
## Configuring Output Options Page 22164

The following page details the available output options when exporting data in Alpha Testing 4 (@AT4) and scheduling models using Quant Scheduler 2 (@QS2).

Topics covered:

-   [Raw Data](https://my.apps.factset.com/oa/pages/22164#raw_data)
-   [Archive to OFDB](https://my.apps.factset.com/oa/pages/22164#archive_ofdb)
-   [Reports](https://my.apps.factset.com/oa/pages/22164#reports)
-   [Report Iterations](https://my.apps.factset.com/oa/pages/22164#report_iterations)
-   [Risk Model Export](https://my.apps.factset.com/oa/pages/22164#risk_model_export) (Available only for Alpha Testing models that have a risk model definition)

___

## Raw Data

After you've run a model, you can download your model results as raw data to a file of your choice. You can only have one type of raw data output per model, either Constituents for actual model data or Benchmark for the limited items used to calculate the benchmark return.

![](online-assistant/27663.html)

After selecting the "Raw Data" option, you can select from the following options from the wrench ![](online-assistant/27663.1.html) drop-down menu:

-   **Settings**: This configures [period filters](https://my.apps.factset.com/oa/pages/22164#raw_data_period_filters), [factor filters](https://my.apps.factset.com/oa/pages/22164#raw_data_factor_filters), [actual columns/data items to output](https://my.apps.factset.com/oa/pages/22164#raw_data_column_settings), as well as the [output format and file name](https://my.apps.factset.com/oa/pages/22164#raw_data_output_settings) options as shown below.
-   **Import**: This option allows you to import a saved model from Alpha Testing 4 if you already have a raw data output configured through the Export Data options.
-   **Remove**: This option allows you to remove a preexisting Raw Data section from your Output Options.

### Specifying Period Filter Settings

The following settings are available in the Period Filter tab after selecting the wrench ![](online-assistant/27663.2.html)  icon > Settings.

Select the dates which should be included in the report. As you are setting your dates, the Preview section will update to show the actual dates.

The period filters are dynamic, which allows you to set different date and frequency ranges that can move with you through time.

![](online-assistant/26967.html)

There are several ways to define the period:

-   **All:** Include all model dates in the report.
-   **Individual Dates:** Select the dates to include from a list of all model dates.
-   **Range:** Apply a date range to model dates to define the periods to include. You can use either actual dates, relative dates, or a combination of the two to set your report filters.

-   **Actual Dates**: You can set filters based on [absolute dates](https://my.apps.factset.com/oa/pages/pages/3923#abs) (e.g., 1/31/2018). This feature will determine what dates to include from your model by seeing if any model dates fall within the time range you specify. You can use actual dates by entering a date or selecting one from the Start/End calendars.
    
    For example, if you enter a start date of 12/31/2006 and an end date of 12/31/2009, your Alpha Testing report will only show model dates that fall within the specified range. 
    
    |**Note**|When using actual dates, FactSet’s feelback behavior is in effect. If you specify a weekend date and are using the United States calendar, the filter will feel back to the latest trading day for the United States calendar and use that as the filter date.|
    |---|---|
    
-   **Relative Dates**: There are two ways to enter [relative dates](https://my.apps.factset.com/oa/pages/pages/3923#rel). You can enter relative calendar dates in the date forms, such as 0/0/-10. This is a relative date because it will always be relative to the most recent 0 date and not to the last date in the model.
    
    Another way to choose relative dates is to specify a range based on model dates. For example, you can pick which model date you want to start from by selecting the Start “Period” option. Zero will dictate the first date of the model, 1 is the second date, 2 is the third date, etc. This logic follows the behavior of [#PRD](https://my.apps.factset.com/oa/pages/pages/13555#prd).
    
    If you choose the End "Period” option, you can specify the last model date with _N_, the second to last model date as -1, etc. The logic follows the behavior of the period level modifiers.
    
    |**Note**|You can also use N, -1, -2, etc. as the start period, or you can use 0, 1, 2, etc. as the end period.
    |---|---|
    For example, if you want a Last Twelve Months report, then you must enter -11 in the start period N as the end period.
    ![](online-assistant/26967.1.idunno)|
    
-   **Frequency**: The frequency setting allows you to only show dates on a specified frequency between the Start and End Dates set in the filter. 

-   **Last 3 months**: Last three months from today's date (not from the model dates).
-   **Last 6 months**: Last six months from today's date (not from the model dates).
-   **Year to Date**: From January 1st of the current year to today's date (not from the model dates).

|**Note**|If you switch from any other filter to "Individual Dates," the initial selection of Individual Dates will match the previous filter. For example, if you choose a Range from Periods -15 to N, then switch to Individual Dates, the last 16 dates will be selected.|
|---|---|

In addition, you have the following options to manage period filters:

-   **Include Dates added in Current Run:** This option allows you to output data for new dates that are added to the model results during the model run. This check box allows you to determine if you want to output data for new dates when "Individual Dates" is selected from the Include drop-down menu. By default, new dates are included for all other options (e.g., All, Range).
-   **Include Production Date**: This option is available when a production date is defined in the model.  The Production Date setting lets you use the most current data available in addition to backtested factor data. For more information, see the [Including the Production Date](https://my.apps.factset.com/oa/pages/pages/21243#production_date) section within the Alpha Testing site.

### Specifying Factor Filter Settings

The following settings are available in the Factor Filter tab after selecting the wrench ![](online-assistant/27663.1.html) icon > Settings.

Filter out the securities belonging to a specific factor’s fractiles. 

To define factor filters:

1.  Choose "Filters" from the left pane of [Tile Options](https://my.apps.factset.com/oa/pages/22164#access_tile_options). The Available list represents all [factors you've added to the model](https://my.apps.factset.com/oa/pages/pages/21240). The Selected list represents the factors with fractiles that you can include/exclude from the tile's calculation. 
2.  Double-click a factor in the Available list to add it to the Selected list. The Options pane populates with the fractiles of the selected factor.
    
    Alternatively, you can select it and click the **right arrow** ![](online-assistant/26968.html) button or drag and drop the factor into the Selected list. 
    
    To select multiple factors, press and hold the **CTRL** key. 
3.  In the Options pane, deselect the fractiles which should be excluded from the tile calculations. 
    
    ![](online-assistant/26968.1.html)
    
    |**Notes**|-   Alpha Testing does not include securities in the selected fractiles, but rather excludes the securities in the fractiles that are not selected. For example, if you only select Fractile 1 of Factor 1, and Fractile 1 of Factor 2, then Alpha Testing only includes securities that are in both fractiles, and not those that are in either of these fractiles.
    |---|---|
    -   Selecting fractiles to filter out of your report only excludes securities from your universe; it does not exclude any securities from your benchmark.|
    

#### Remove Factor Filters

To remove a factor, double-click on a factor in Selected list or click the **left arrow** ![](online-assistant/26968.2.html) button.

To remove all factors, click the **Delete** ![](online-assistant/26968.3.idunno) button above the Selected list.  

### Specifying Column Settings

The following settings are available in the Columns tab after selecting the wrench icon ![](online-assistant/27663.2.html) > Settings. Use this tab to determine what items are included in your output. You can filter the list of columns in the Available section to display:

-   All Model Data: This option will display all possible columns/data items that you can display.
-   Factor Values: This option will limit to only show the available factor values (i.e., no fractiles) to display.
-   Raw Factor Values: This option will limit to only show the available "raw" values (i.e., before outlier and NA handling) to display.
-   Factor Fractiles: This option will limit to only show the available factor fractiles.

The Columns tab allows you to easily select multiple columns.  You can right-click and select the "Select All" option or you can press the **SHIFT** or **CTRL** key to add groups of columns at once.

Once you've selected the columns you want to include, click the **right arrow** ![](online-assistant/27663.1.html) button to add the columns or double-click to add a single selection.

### Specifying Raw Data Output Settings

The following settings are available in the Output tab after selecting the wrench ![](online-assistant/27663.3.html) icon > Settings. Use this tab to  determine how files should be downloaded.

![](online-assistant/27663.2.html)

The following options are available for all file types:

-   File Name: Enter the output file name. You can specify the suffix; otherwise, it will default to the selected type.
-   Use the Add Variable drop-down menu to construct the output filename using application variables. Variables give access to useful system information, such as job run dates and are dynamically updated with each model run.

-   Job Name: The name of the job in which the download takes place
-   Model Name: The Alpha Testing model’s name
-   Job Run Date: The date on which the downloading job started to run
-   Model Run date: The date on which the model started running
-   Job Run Time: The time at which the downloading job started to run
-   Job Serial: The serial number to which the job is assigned
    
    |**Note**|Shorten the variable text by specifying the number of characters to include using the syntax {Variable Name:<number of characters>}.
    |---|---|
    For example, choose {ModelName:8} to reduce the model name to the left eight characters. Use {ModelName:-8} for the right eight characters.|
    

-   Download type: Choose to either output as a text or spreadsheet file.
-   Directory: Select the location to save file if the **Save** output option is chosen in the job configuration.
-   Download Each Period Separately: Select this option to download a separate file for each date.
-   Download Each Fractile Separately: Select this option to download a separate file for each fractile of the selected factor.

These options are only available when downloading as a text file:

-   Numeric NA format: Select how you want numeric NAs to be displayed in our output file(s).
-   String NA format: Select how you want string NAs to be displayed in our output file(s).
-   Delimiter: Select the delimiter between data items in your file(s).
-   Include Headers: Select if you want to include column headers in file(s).
-   Surround Text with Quotes: Select to add quotes around the text in your file(s).
-   End of Line Format:

-   Unix (CR): Select to only use carriage returns, with no line-feed.  This option will not display correctly in Notepad.
-   Windows: Select this option to display the expected Windows text file format.

[Top of Page](https://my.apps.factset.com/oa/pages/22164#top)

___

## Archive to OFDB

After selecting the "Archive to OFDB" option, you can select from the following options:

-   **Settings**: This configures [period filters](https://my.apps.factset.com/oa/pages/22164#archive_ofdb_period_filters), [factor filters](https://my.apps.factset.com/oa/pages/22164#archive_ofdb_factor_filters), [actual columns/data items to output](https://my.apps.factset.com/oa/pages/22164#archive_ofdb_column_settings), as well as the [output format and file name](https://my.apps.factset.com/oa/pages/22164#archive_ofdb_output) options as shown below.
-   **Import**: This option allows you to import a saved model from Alpha Testing 4 if you already have saved archive configurations through the Export Data options.
-   **Remove**: This option allows you to remove a preexisting Raw Data section from your Output Options.

### Specifying Period Filter Settings

The following settings are available in the Period Filter tab after selecting the wrench ![](online-assistant/27663.4.html)  icon > Settings.

Select the dates which should be included in the report. As you are setting your dates, the Preview section will update to show the actual dates.

The period filters are dynamic, which allows you to set different date and frequency ranges that can move with you through time.

![](online-assistant/26967.html)

There are several ways to define the period:

-   **All:** Include all model dates in the report.
-   **Individual Dates:** Select the dates to include from a list of all model dates.
-   **Range:** Apply a date range to model dates to define the periods to include. You can use either actual dates, relative dates, or a combination of the two to set your report filters.

-   **Actual Dates**: You can set filters based on [absolute dates](https://my.apps.factset.com/oa/pages/pages/3923#abs) (e.g., 1/31/2018). This feature will determine what dates to include from your model by seeing if any model dates fall within the time range you specify. You can use actual dates by entering a date or selecting one from the Start/End calendars.
    
    For example, if you enter a start date of 12/31/2006 and an end date of 12/31/2009, your Alpha Testing report will only show model dates that fall within the specified range. 
    
    |**Note**|When using actual dates, FactSet’s feelback behavior is in effect. If you specify a weekend date and are using the United States calendar, the filter will feel back to the latest trading day for the United States calendar and use that as the filter date.|
    |---|---|
    
-   **Relative Dates**: There are two ways to enter [relative dates](https://my.apps.factset.com/oa/pages/pages/3923#rel). You can enter relative calendar dates in the date forms, such as 0/0/-10. This is a relative date because it will always be relative to the most recent 0 date and not to the last date in the model.
    
    Another way to choose relative dates is to specify a range based on model dates. For example, you can pick which model date you want to start from by selecting the Start “Period” option. Zero will dictate the first date of the model, 1 is the second date, 2 is the third date, etc. This logic follows the behavior of [#PRD](https://my.apps.factset.com/oa/pages/pages/13555#prd).
    
    If you choose the End "Period” option, you can specify the last model date with _N_, the second to last model date as -1, etc. The logic follows the behavior of the period level modifiers.
    
    |**Note**|You can also use N, -1, -2, etc. as the start period, or you can use 0, 1, 2, etc. as the end period.
    |---|---|
    For example, if you want a Last Twelve Months report, then you must enter -11 in the start period N as the end period.
    ![](online-assistant/26967.2.html)|
    
-   **Frequency**: The frequency setting allows you to only show dates on a specified frequency between the Start and End Dates set in the filter. 

-   **Last 3 months**: Last three months from today's date (not from the model dates).
-   **Last 6 months**: Last six months from today's date (not from the model dates).
-   **Year to Date**: From January 1st of the current year to today's date (not from the model dates).

|**Note**|If you switch from any other filter to "Individual Dates," the initial selection of Individual Dates will match the previous filter. For example, if you choose a Range from Periods -15 to N, then switch to Individual Dates, the last 16 dates will be selected.|
|---|---|

In addition, you have the following options to manage period filters:

-   **Include Dates added in Current Run:** This option allows you to output data for new dates that are added to the model results during the model run. This check box allows you to determine if you want to output data for new dates when "Individual Dates" is selected from the Include drop-down menu.  By default, new dates are included for all other options (e.g., All, Range).
-   **Include Production Date**: This option is available when a production date is defined in the model.  The Production Date setting lets you use the most current data available in addition to backtested factor data.  For more information, see the [Including the Production Date](https://my.apps.factset.com/oa/pages/pages/21243#production_date) section within the Alpha Testing site.

### Specifying Factor Filter Settings

The following settings are available in the Factor Filter tab after selecting the wrench ![](online-assistant/27663.3.html) icon > Settings.

Filter out the securities belonging to a specific factor’s fractiles. 

To define factor filters:

1.  Choose "Filters" from the left pane of [Tile Options](https://my.apps.factset.com/oa/pages/22164#access_tile_options). The Available list represents all [factors you've added to the model](https://my.apps.factset.com/oa/pages/pages/21240). The Selected list represents the factors with fractiles that you can include/exclude from the tile's calculation. 
2.  Double-click a factor in the Available list to add it to the Selected list. The Options pane populates with the fractiles of the selected factor.
    
    Alternatively, you can select it and click the **right arrow** ![](online-assistant/26968.html) button or drag and drop the factor into the Selected list. 
    
    To select multiple factors, press and hold the **CTRL** key. 
3.  In the Options pane, deselect the fractiles which should be excluded from the tile calculations. 
    
    ![](online-assistant/26968.4.html)
    
    |**Notes**|-   Alpha Testing does not include securities in the selected fractiles, but rather excludes the securities in the fractiles that are not selected. For example, if you only select Fractile 1 of Factor 1, and Fractile 1 of Factor 2, then Alpha Testing only includes securities that are in both fractiles, and not those that are in either of these fractiles.
    |---|---|
    -   Selecting fractiles to filter out of your report only excludes securities from your universe; it does not exclude any securities from your benchmark.|
    

#### Remove Factor Filters

To remove a factor, double-click on a factor in Selected list or click the **left arrow** ![](online-assistant/26968.1.html) button.

To remove all factors, click the **Delete** ![](online-assistant/26968.2.html) button above the Selected list.  

In addition, select the "Ignore Factor NA Exclusions" option to ignore factor NA exclusions. If this option is deselected, then the NA exclusions set on factors will remove all affected securities from the output.  For example, if you set Price NA handling to "exclude" in Model Options, all securities without an available price will be removed from the output when archiving to OFDB.

### Specifying Column Settings

The following settings are available in the Columns tab after selecting the wrench ![](online-assistant/27663.4.html)  icon > Settings.  Use this tab to determine what items are included in your output. You can filter the list of columns in the Available section to display:

-   All Model Data: This option will display all possible columns/data items that you can display.
-   Factor Values: This option will limit to only show the available factor values (i.e., no fractiles) to display.
-   Raw Factor Values: This option will limit to only show the available "raw" values (i.e., before outlier and NA handling) to display.
-   Factor Fractiles: This option will limit to only show the available factor fractiles.

In addition to the Model Data section, you will see the following additional options:

-   Archive Columns: Expand the Archive Columns section under Available to select report column calculation definitions. If you follow the typical scenario and output to an OFDB with security symbols, the securities are assigned either the same value or the value that corresponds to the fractile split (i.e., if the archive column is split by fractile).
-   Specified report tile: You can select a Tile from the drop-down menu under Available to add the columns of that report tile to your archived OFDB file.  This option works similarly to the archive columns described above but applies the tile's factor selection to the column calculation. For example, if a column is split by a factor, it is only split by the factors selected in the tile. If the same column were chosen from "Archive Columns", then it would be split by all factors in the model (i.e., not tile-specific).

The Columns tab allows you to easily select multiple columns.  You can right-click and select the "Select All" option or you can press the **SHIFT** or **CTRL** key to add groups of columns at once.

Once you've selected the columns you want to include, click the **right arrow** ![](online-assistant/27663.3.html) button to add the columns or double-click to add a single selection.

After adding columns to your Selected list, the columns options available will depend on the type of column you've selected. You may not see all options depending on the item selected:

-   OFDB Field Name: Enter a custom field name or leave this field blank to bring in the default name.
-   Split Behavior: Select the type of split behavior to apply to the OFDB field from the drop-down menu.
-   Split Column by Fractiles: Choose from the available options in the drop-down menu to calculate a separate column value for each factor fractile.
-   Factor Columns:  Use this option to specify if you want to calculate the column value for a specific factor or for each factor. You can choose a tile column to apply a specific set of factor selections. For example, only choose 3 of 100 model factors in the tile, and then import a column from the tile.  If you select "All" in the Factor Columns drop-down menu, then you will see an additional drop-down menu that allows you to select how to format the factor columns.
-   Column Return Type: This option is available for return calculations only and allows you to specify what return calculation to apply.

-   Select the "Currency Hedge Return" check box to set the local currency return, rather than using the common model currency.

-   Column Return Horizon: Use this option to select which return horizon to use in the returns calculation. 
-   Period vs Summary Level Data: Use this drop-down menu to select whether to archive the period value to the respective date or archive the summary value to all dates.

### Specifying Archive to OFDB Output Settings

The following settings are available in the Output tab after selecting the wrench ![](online-assistant/27663.1.html) icon > Settings to determine how files should be downloaded.

![](online-assistant/27663.4.html)

The following options are available:

-   Append vs Overwrite:  Select "Append" to add new dates to an existing OFDB. (This option has no effect when you're creating a new OFDB.)  Select "Overwrite" to replace all dates within an existing OFDB after each job run.
-   File Name: Click the **Lookup** ![](online-assistant/27663.5.html) button to select the name and path to the OFDB.
-   Use the Add Variable drop-down menu to construct the output filename using application variables. Variables give access to useful system information, such as job run dates and are dynamically updated with each model run.

-   Job Name: The name of the job in which the download takes place
-   Model Name: The Alpha Testing model’s name
-   Job Serial: The serial number to which the job is assigned
    
    |**Note**|Shorten the variable text by specifying the number of characters to include using the syntax {Variable Name:<number of characters>}.
    |---|---|
    For example, choose {ModelName:8} to reduce the model name to the left eight characters. Use {ModelName:-8} for the right eight characters.|
    

-   Archive to Separate Portfolios: Use this option and the following drop-down menus to create a separate OFDB for all fractiles or only the F1/FN fractiles for select factors.
-   Apply Overnight Symbol Changes: Select this option to automatically updated symbols in the OFDB.
-   Archive History is Unsplit: Select this option to apply selected split adjustments to data historically versus assuming that data is split adjusted as of the current day.
-   Archive Symbols As: Select which symbols to use in the OFDB.  By default, the Symbol column (i.e., security identifier) is used.  You can choose sectors, currencies, countries, and more.

[Top of Page](https://my.apps.factset.com/oa/pages/22164#top)

___

## Reports

Select the “Reports” option to choose reports from your model or from a template to download.

![](online-assistant/27663.6.html)

Within the Selection tab

-   Use the “Template Report Lookup” to access a report template.
-   Choose Report tiles from the Available into the Selected Pane.
    
    |**Note**|Multiple report tiles can be selected at once.|
    |---|---|
    

For Selected report tiles, use the Options pane to select the output file names, which can be set for multiple reports at the same time.

-   Use the revert icon next to the File Name textbox to accept the default name, consisting of model name, report name, and tile name.
-   Use the Add Variable drop-down menu to construct report names using application variables. Variables allow a custom specification of name patterns across multiple tiles. Variables also give access to useful system information, such as job run dates.
    -   Job Name: The name of the job in which the download takes place
    -   Model Name: The Alpha Testing model’s name
    -   Template Name: The report template name, if applicable (blank if not using a template)
    -   Report Name: The name of the report, which is a set of 1 to 4 tiles
    -   Tile Name: The name of the selected report tile
    -   Job Run Date: The date on which the downloading job started to run
    -   Model Run date: The date on which the model started running
    -   Job Run Time: The time at which the downloading job started to run
    -   Job Serial: The serial number under which the downloading job ran
        
        |**Note**|Shorten the variable text by specifying the number of characters to include using the syntax {Variable Name:<number of characters>}.
        |---|---|
        For example, choose {ModelName:8} to reduce the model name to the left eight characters. Use {ModelName:-8} for the right eight characters.|
        

### Specifying Report Output Settings

Use the Output tab to configure the output format of selected reports. The Output tab can be accessed through the wrench menu of the reports section (wrench ![](online-assistant/27663.7.html) icon > Output), or through the Add reports menu (Add menu > reports > Output tab).

![](online-assistant/27663.1.html)

-   File Format: Choose between spreadsheet and text output formats.
    -   Spreadsheet File: Alpha Testing 4 Excel format
        -   Choose this format to download charts created in the current application.
    -   Spreadsheet File – Legacy Format: Alpha Testing 3 Excel format
        -   Choose this format to download charts created in the previous version of Alpha Testing
    -   Delimited Text File: A text format with customizable data delimiters
    -   Fixed Width Text File: A legacy text format with fixed-width columns
-   Directory: Choose the directory if downloading the file to a File Transfer location
-   Spreadsheet File Options
    -   Download to a Single File: Output all report tiles as separate worksheets in a single spreadsheet.
        -   When downloading to a single file, the filename can be specified using a combination of static text and system variables.
    -   Download Outline: Preserve the expand and collapse formatting of groups
    -   Remove Tile Headers: Output the report without informational headers
    -   Remove Tile Footnotes: Output the report without informational footnotes
-   Delimited Text File Options
    -   Numeric NA: Choose the representation of missing numeric data
    -   String NA: Choose the representation of missing textual data
    -   Delimiter: Choose how to separate columns
    -   Surround Text With Quotes: Mark text values with quotes
    -   Include Report Headers: Include informational report headers
    -   Include Section Headers: Include column-section headings
    -   Include Column Headers: Include column headings
    -   Include Footers: Include informational footnotes
    -   Include Summary Statistics: Include the report’s summary statistic row

![](online-assistant/27663.8.html)

[Top of Page](https://my.apps.factset.com/oa/pages/22164#top)

___

## Report Iterations

Create report iterations to view the same report for different settings and scenarios. Iterations can be created for the following characteristics:

-   Return Type
-   Return Horizon
-   Factor Selection
-   Period Filters
-   Factor Filters

Report iterations are accessed through the output configuration overlay.

In AT4, select “Export Data” from the Run Model drop-down menu to open the output configuration overlay.

In Quant Scheduler 2, open a job for edit, select a model in the Selected Models grid and choose “Output Configuration" from the wrench ![](online-assistant/27663.9.html) icon.

![](online-assistant/27663.7.html)

In the Output Configuration overlay, click the gear ![](online-assistant/27663.10.html) icon of a report to access iteration options.

 ![](online-assistant/27663.11.html)

Choose the option “Create Separate Combinations per Tab” in the configuration dialog to iterate each tab separately, rather than creating cross-combinations of all configurations.

After configuring iterations, a preview of resulting combinations" and files will be shown in the overlay.

![](online-assistant/27663.12.html)

### Return Iterations

Select "Return Types" and "Return Horizons" from the Available pane to iterate through returns settings.

Click the **revert** ![](online-assistant/27663.13.html) icon to retrieve the report’s stored default setting.

![](online-assistant/27663.14.html)

### Factor Iterations

Create a new factor combination by clicking the **Add** ![](online-assistant/27663.15.html) icon over the left-hand pane of the Factors tab.

Select the number of factors to include in the report in the middle pane.

For each factor position, select the factors which should be placed in that position.  Multiple factors can be selected.

Click **Update** to generate factor combinations based on these selections.  The resulting factor combinations can be previewed in the right-hand pane, where factor combinations can also be selectively removed using the hover-over remove icon.

![](online-assistant/27663.16.html)

###  Period Filter Iterations

Create period filter iterations in the Periods tab by adding new period filters in the left-hand pane. Each period filter can be configured separately in the left-hand pane.

![](online-assistant/27663.17.html)

### Factor Filter Iterations

Create factor filter iterations in the Fractiles tab by adding new factor filters in the left-hand pane.

For each factor filter, choose a factor from the Factor drop-down menu, then choose the factor groups or fractiles to include as part of the filter configuration. Click **Update Factor** to add the configured factor to the filter.

![](online-assistant/27663.18.html)

[Top of Page](https://my.apps.factset.com/oa/pages/22164#top)

___

## Risk Model Export

The risk model export option is only available for Alpha Testing models which include a risk model configuration. For more information about creating a risk model, see [Creating Custom Risk Models](https://my.apps.factset.com/oa/pages/pages/21173).

The risk model export dialogs can be accessed from Alpha Testing by selecting “Export Data” from the Run Model drop-down menu, then selecting “Risk Model Export” from the top-right Add menu.

In Quant Scheduler 2, open a job for edit and click the **Add** or **Edit** hyperlink in the Risk Model column of the Selected Models table.

![](online-assistant/27663.19.html)

### Risk Model Settings

The Export tab configures the name of the exported risk model and the history to export.

-   Choose “Create New Risk Model” to create a new risk model. The Risk Model Name must have a unique entry for the chosen directory.
-   Choose “Select an Existing Risk Model” to append to or overwrite an existing risk model. Use the Risk Model Name field to select the target risk model.  To append to an existing risk model, the return frequency and the currency of the Alpha Testing model must match the frequency and currency of the target risk model.
-   Use the Periods section in the right-hand pane to configure how much history to export.

![](online-assistant/27663.20.html)

### Map Factors

Use the Map Factors tab to choose custom factor names in the exported risk model or accept the suggested defaults.

-   Custom names can be entered in the Suggested Database Factor ID column.
-   The factor names which were used for the last export to the same target are shown in the Last Saved Database Factor ID column.

Commit changes by clicking **OK**.

![](online-assistant/27663.21.html)

[Top of Page](https://my.apps.factset.com/oa/pages/22164#top)
