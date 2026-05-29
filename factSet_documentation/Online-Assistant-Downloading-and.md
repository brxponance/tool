---
created: 2026-05-05T19:20:40 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21010
author: 
---

# Online Assistant : Downloading and

> ## Excerpt
> Use the Export Results menu  to output your results to a third-party application. You can also archive your results within a new or existing private database (i.e., directory) on FactSet for later use.

---
## Downloading and Archiving Results Page 21010

Use the **Export Results** menu ![](online-assistant/26309.html) to output your results to a third-party application. You can also archive your results within a new or existing private database (i.e., directory) on FactSet for later use. 

![](online-assistant/26309.1.html) 

Topics covered:

-   [Downloading a Screen](https://my.apps.factset.com/oa/pages/21010#downloading)
-   [Setting Download Options](https://my.apps.factset.com/oa/pages/21010#Setup)
-   [Archiving a Screen](https://my.apps.factset.com/oa/pages/21010#Archiving)

___

## Downloading a Screen 

Select the "Download" option to export your results to Microsoft Excel, a delimited text file, or a PDF file.  

![](online-assistant/26309.2.html)

### Downloading a Screen to Excel 

1.  Select "Excel" from the Format drop-down menu. Each spreadsheet supports a maximum of 5 million cells. 
2.  Select the output type: 
    
    **Report
    
    **Downloads the main report content (e.g., companies, data columns). 
    
    **Summary
    
    **Downloads the contents of the Select Criteria pane, the Format Results pane, and the Result pane's Parameter view into Excel tabs called Universe, Format, and Parameters respectively. The Parameters tab includes the list of parameters and header information, such as the number of passed and available securities. The Format tab includes info such as grouping, sorting, statistics, conditional formatting, rank, filter, append settings.
    
3.  Select each output option you want:   
    
    **Download Outlines
    
    **Allows you to expand and collapse all groups of securities within Microsoft Excel's spreadsheet environment. Once selected, you can choose how you would like to download the data.
    
    > > |**Note**|You can only expand or collapse the highest level of each grouping. The ability to expand/collapse various grouping levels is currently unsupported but forthcoming. If all groupings are expanded/collapsed in the Results pane, they will appear as such when extracted to Excel.|
    > > |---|---|
    
    **Maintain NA Format** Allows you to specify that the NA formatting displayed in the numeric columns of your report is also be displayed when you download the screen into the Excel template. If you do not select this option, Excel will display non-available data as #N/A by default.
    
    > > |**Note**|Microsoft Excel only accepts #N/A as being a representation of non-available data; all other formats are treated as text. Excel's handling of downloaded templates from Universal Screening will change as a result of selecting this option, including sorting functions and certain Excel functions such as ISERROR.|
    > > |---|---|
    
    **Download to Active Spreadsheet
    
    **Downloads information to the current (i.e., open) spreadsheet file. It does not create a new spreadsheet.
    
    **Download All Tabs to One Spreadsheet**
    
    Downloads and merges the results of all tabs (i.e., [column sets](https://my.apps.factset.com/oa/pages/pages/20608#columnsets)) into a _single_ Microsoft Excel spreadsheet. By default, tab results are downloaded into _multiple_ spreadsheets within the same Microsoft Excel workbook.  
    
    **Download Filtered Results**
    
    Downloads the screen results that appear when filters are applied. When unchecked, it will download all screen results.  
    
    **Use Alternate Row Shading**
    
    Enables alternate row shading when downloading a screen into Microsoft Excel. This formatting is set on a per screen basis.  
    
4.  Click **Download**.

### Downloading a Screen to a Delimited Text File 

1.  Select "Delimited Text File" from the Format drop-down menu. Each file supports a maximum of 5 million cells. 
2.  Select each output option you want:   
    
    **Quoted Strings
    
    **Downloads the report tab that is currently selected. 
    
    **Remove Headers
    
    **Allows you to remove all column headings. 
    
    **Maintain NA Format** Allows you to specify that the NA formatting displayed in the numeric columns of your report is also be displayed when you download the screen into a delimited text file. If you do not select this option, Excel will display non-available data as #N/A by default.
    
    **Download Filtered Results**
    
    Downloads the screen results that appear when filters are applied. When unchecked, it will download all screen results.   
    
3.  Select the "Space", "Tab", or "Custom" delimiter option. Custom allows you to enter another text character (e.g., a comma) as the delimiter.
4.  Click **Download**.

### Downloading a Screen to a PDF File

1.  Select "PDF" from the Format drop-down menu. Each file supports a maximum of 1 million cells. 
2.  Select each output option you want:   
    
    **Current Tab
    
    **Downloads the report tab that is currently selected. 
    
    **All Tabs** Downloads all report tabs to a single PDF file. 
    
    **Download Filtered Results**
    
    Downloads the screen results that appear when filters are applied. When unchecked, it will download all screen results.   
    
    **Use Alternate Row Shading
    
    **Enables alternate row shading when downloading a screen into PDF. This formatting is set on a per screen basis.  
    
    **Wrap Text in Cells**
    
    Wraps long text to as many cells as necessary if it does not fit into the space available.
    
    **Download to FactSet Drive**
    
    Downloads the screen results to [FactSet Drive](https://my.apps.factset.com/oa/pages/pages/17784).   
    
3.  Click **Download**.
    
    |**Note**|Screens downloaded to PDF are automatically re-scaled to fit within a single page; however, FactSet recommends using the Landscape orientation for screens containing more than 10 columns.|
    |---|---|
    

### Downloading Charts to a PDF File

1.  Select "PDF - Chart" from the Format drop-down menu. 
2.  Click **Download**.

All the charts displayed in your screen will download to a single PDF file.

### Downloading a Database Import File 

1.  Select "Database Import" from the Format drop-down menu. 
2.  Select each output option you want:   
    
    **Quoted Strings
    
    **Downloads fields enclosed in quotes
    
    **Download Filtered Results**
    
    Downloads the screen results that appear when filters are applied. When unchecked, it will download all screen results.   
    
3.  Select the "Space", "Tab", or "Custom" delimiter option. Custom allows you to enter another text character (e.g., a comma) as the delimiter.
4.  Click **Download**.

[Top of Page](https://my.apps.factset.com/oa/pages/21010#top)

___

## Setting Download Options

Select the "Page Setup" option to customize the size and layout of the PDF download and print output of your screen.

![](online-assistant/26309.3.html)

To preview you output, select the **Print** menu ![](online-assistant/26309.4.html) > Preview option. The preview shows the first 100 rows. 

[Top of Page](https://my.apps.factset.com/oa/pages/21010#top)

___

## **Archiving a Screen** 

Select the "Archive to a New Database" or "Archive to Existing Database" archive option to save the universe of identifiers that "pass" specified Screening parameters to an OFDB file or database.

Each archived file contains the identifiers that pass the parameters at the time you archive the screen. Archived files do not automatically update. Once you archive data, you can use it with other applications on FactSet. 

![](online-assistant/26309.5.html) 

To archive screen results to a new database:

1.  Select the archive type:

**IDs**

Saves the list of identifiers to an OFDB file, which can be opened from other applications. Identifiers can have up to 32 characters in length. To maintain the order of the symbols in Universal Screening's Result view in the OFDB file, select the "Use report symbol order" check box.

**IDs and Data**

Creates a new non-time series OFDB file using the specified universe and parameters. You can only select this option if you subscribe to [Data Central](https://my.apps.factset.com/oa/pages/pages/21192).

**Time Series** 

Creates a new time series OFDB file using the specified universe, parameters, and record date. You can only select this option if you subscribe to Data Central. 

If a parameter permits split information, you can set the split direction for that field. Once selected, the parameter, field, and split information will appear in the Current Mapping workspace. By default, all archive data is split-adjusted. Select the "Archive history is unsplit" check box when you are archiving data as historically unadjusted for splits. If your field is iterated, select a frequency (e.g., daily). 

2\. Select the directory where you want to save the results.

3\. Enter a file name and click **Save**.

To archive screen results to an existing database:

1.  Select the directory where you want to save the results. The bottom of the dialog box will update to reveal the type of OFDB file, in addition to its name.
2.  If the file types is "IDs," you can choose to overwrite the existing data, or simply append the new IDs.  
    
    If the file type is "Time Series," you can choose to overwrite the existing date, or simply append a new one. By default, the dates in your time series are set to what is specified in the Record Date list.
    
3.  Click **Preview OFDB** to see a preview of your modified results in the Current Mapping workspace.
4.  Click **Save**. 

[Top of Page](https://my.apps.factset.com/oa/pages/21010#top)
