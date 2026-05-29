---
created: 2026-05-05T19:04:47 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/14702
author: 
---

# Online Assistant : Alpha Testing

> ## Excerpt
> You have three options for requesting to download information from Alpha Testing model results using FQL codes. Stat codes fetch column results from an Alpha Testing report. Data codes fetch constituent data from the model according to the data item. Display codes return your report's display options. You can use these codes to fetch Alpha Testing results directly into Microsoft Excel spreadsheets or into other FactSet applications that use FQL codes.

---
## Alpha Testing FQL Codes Page 14702

You have three options for requesting to download information from Alpha Testing model results using [FQL codes](https://my.apps.factset.com/oa/pages/pages/1962). Stat codes fetch column results from an Alpha Testing report. Data codes fetch constituent data from the model according to the data item. Display codes return your report's display options. You can use these codes to fetch Alpha Testing results directly into Microsoft Excel spreadsheets or into other FactSet applications that use FQL codes.

Topics covered:

-   [Returning Column Results](https://my.apps.factset.com/oa/pages/14702#stat)
-   [Returning Constituent Data](https://my.apps.factset.com/oa/pages/14702#data)
-   [Returning Display Options](https://my.apps.factset.com/oa/pages/14702#display)

___

## Returning Column Results

You can use stat codes to return Alpha Testing column results using the following syntax:

^=at3\_result\_stat("_Directory:/sub-directory/model name_", "_Report name_", "_Column number_", "_Result type_", "_Sorting column_", "_Sort order_", "_Report setting name/Template name_", "_Report setting/Template_")_r_

These are the stat code arguments and their descriptions:

-   Directory:/sub-directory/model name is the name of the model you want to pull data from. For example: "FactSet:Calculation Example Model" or "Personal:/SubDirectory/Test Model."
    
    |**Note**|Syntax for the directory argument depends on the presence of subdirectories. For example, you can fetch a file from the main Personal directory by entering "Personal:FileName." However, if the file is in a subdirectory, the syntax is "Personal:/Subdirectory/FileName" (notice the insertion of a forward slash before Subdirectory).|
    |---|---|
    
-   Report name is the report from which you want to download data. For example, "periods" or "[constituents](https://my.apps.factset.com/oa/pages/pages/14100)." You can use any report, including [new reports](https://my.apps.factset.com/oa/pages/pages/14294#new) that you create.
    
    |**Note**|For reports that are added or copied to Alpha Testing 4, use the "_`Report name - tile name`_" format when specifying the report name.  Tile names are not unique and are only fully identified along with their report name. For example, enter "Periods - Chart" for the report name argument to refer to the tile "Chart" within the report named "Period."|
    |---|---|
    
-   Column number is the number of the column from which you want to download data. This number starts at one and includes all columns in the report, even if it's a column that can’t be removed. For example, entering "3" in a code that fetches data from any Constituents report will give you the period column. Enter "All" to download the results of all the columns in a report. To download a range of columns, use the following format: "_StartColumn_:_EndColumn_" (e.g., "2:5" for columns two through five).
-   (Optional) Result Type describes the data type you want to download.
    -   "M"- returns the main data in the report. This is the default if you do not enter an argument
    -   "S" - returns summary data (i.e., the summary line in Period reports)
    -   "H" - returns the column header. If your report contains multiple column headers, you can specify which row of headers you want to download by including a row number in the argument. For example, "H1" will return the top level header, "H2" the next row down, and so on. To download all headers as an array, enter "HALL."
        
        |**Note**|If you enter "H" without specifying a row number, Alpha Testing will return the lowest row in the report.|
        |---|---|
        
        ![](online-assistant/23464.html)
        
-   (Optional) Sorting column is the column that you want to sort the data by. For example, to sort a Constituents report by date, enter the number that corresponds to the data column (in this case "3"). In a Periods report, the first column contains dates, so enter "1" to sort a Periods report by date. If this argument is left out, then the data is sorted as it appears in the report.
-   (Optional) Sort order determines if your data is sorted in ascending ("A") or descending ("D") order. By default, your data will display in ascending order.
-   (Optional) Report setting name/Template name is the name of the [report setting or template](https://my.apps.factset.com/oa/pages/pages/13982) that you want to use. The [report name](https://my.apps.factset.com/oa/pages/14702#rn) you entered in the second argument must be in this report setting or template. For example, enter the argument as "FactSet:different regression types" in order to select reports from that report template. If you leave this argument blank, then the default uses reports from the model's default report setting.
-   (Optional) Report setting/Template identifies your file as a report setting ("RS") or template ("T").
-   (Optional) r downloads the results of the FQL code across the row rather than down the column. Leave this blank to download data down the column.
    
    |**Note**|In cases where the data is downloaded across the row by default (e.g., a summary line from the Periods report), including the r argument will have the opposite effect on the data and download it down the column.|
    |---|---|
    

|**Note**|The results for Alpha Testing FQL downloading do not change based on any identifier, but you still need an identifier to do a data download. Enter "dummy^" as your ID in cell A1 of the spreadsheet.
|---|---|
The number that you use to reference columns in the Alpha Testing FQL code should correspond to the order that each column appears in the report. This means that if you have a [fractile or factor](https://my.apps.factset.com/oa/pages/pages/13554#groupings) column selection that creates multiple columns for one report statistic, then the column number you should use will not correspond to the column number in the Columns tab of report settings.|

Examples:

-   ^=at3\_result\_stat("FactSet:Calculation Example Model", "constituents", "all", "M", "1")
    
    Downloads all the main report data from the Constituents report for the FactSet:Calculation Example Model.
-   ^=at3\_result\_stat("FactSet:Calculation Example Model", "pooled mfr", "5", "M", "1", "A", "FactSet:different regression types", "T") r
    
    Downloads the main report data from the fifth column of the "pooled mfr" report in the "FactSet:different regression types" report template in the "FactSet:Calculation Example Model" sorted by the period column in ascending order. The r argument transposes the data by downloading it across the row.
-   ^=at3\_result\_stat("Personal:/Testing/TestModel", "Alpha Calculation", "all", "M", "1", "A", "ReportSetting2", "RS") r
    
    Downloads all the main report data from the "Alpha Calculation" report from the report setting called "ReportSetting2" for the model "Personal:/Testing/TestModel." The data is transposed by using the r argument, so that the results for each date go down each column instead of across each row.
-   ^=at3\_result\_stat("FactSet:Calculation Example Model", "periods", "all", "S", "1")
    
    Downloads all the results from the summary line of the Periods report for the "FactSet:Calculation Example Model."

[Top of Page](https://my.apps.factset.com/oa/pages/14702#top)

___

## Returning Constituent Data

You can use data codes to return Alpha Testing constituent data using the following syntax:

^=at3\_result\_data("_Directory:/sub-directory/model name_", "Constituents", "_Data item_", "_Date_", "_Security_", "_Sort order_", "_Result Type_")

These are the data code arguments and their descriptions:

-   Directory:/sub-directory/model name is the name of the model you want to pull data from. For example: "FactSet:Calculation Example Model" or "Personal:/Testing/PreDownloadModel20070109."
    
    |**Note**|Syntax for the directory argument depends on the presence of subdirectories. For example, you can fetch a file in the main Personal directory by entering "Personal:FileName." However, if the file is in a subdirectory, the syntax is "Personal:/Subdirectory/FileName" (notice the insertion of a forward slash before Subdirectory).|
    |---|---|
    
-   Constituents is a constant. Other report names will not work. AT3\_RESULT\_DATA does not pull from the model's [Constituents](https://my.apps.factset.com/oa/pages/pages/14100) report. Use AT3\_RESULT\_STAT to match the interactive Constituents report. When pulling constituent data via AT3\_RESULT\_DATA, you are essentially building a new Constituents report behind the scenes.
-   Data item is the name of the model's data item. Use the following arguments as the data item (surrounded with quotes, e.g., "All"):
    -   All downloads all the data
    -   Id is the security's identifier
    -   Company name is the security's name
    -   Ticker is the security's ticker
    -   Periods is the report date for each item
    -   Return, return2, return3, etc. are the returns fetched for each security; if you have selected [additional return horizons](https://my.apps.factset.com/oa/pages/pages/13553#horizon) then the first additional return horizon is "return2"
    -   Weights are the weights fetched for each security
    -   Mktcap is the market cap fetched for each security
    -   Factor1, factor2, factor3, etc. are the factor data for a particular factor in your model. The number is based on how you entered the factors in the [Factors tab](https://my.apps.factset.com/oa/pages/pages/13573) of Model Inputs
    -   Raw\_factor1, raw\_factor2, raw\_factor3, etc. are the raw factor data for a particular factor in your model. The number is based on how you entered the factors in the Factors tab of Model Inputs. This is the factor data before any [NA](https://my.apps.factset.com/oa/pages/pages/13573#na) or [outlier modifications](https://my.apps.factset.com/oa/pages/pages/13573#control) are applied
    -   Fractile\_factor1, fractile\_factor2, fractile\_factor3, etc. are the fractiles calculated for a particular factor in your model. The number is based on how you entered the factors in the Factors tab of Model Inputs
-   (Optional) Date is the date for which you want to fetch data, entered in "YYYYMMDD" format, (e.g., "20040130"). You can use "All" to download data for all dates. "All" is also the default if you do not specify an argument.
-   (Optional) Security is the security for which you want to download data. This is the identifier that is shown in the first column of the Constituents report, which is usually a CUSIP or SEDOL (e.g., use "369604103" to only download data for GE). You can use "All" as an argument to download data for all securities. "All" is also the default if you don't specify an argument.
    
    If you specify an identifier using this argument, then you will download one row of data for each time the security appears in the model, unless you specify only one specific date using the Date argument.
    
-   (Optional) Sort order: The direction to sort the data. Enter "A" for ascending or "D" for descending. The default setting will not sort the data in any way.
-   (Optional) Result Type describes the data type you want to download. "M" returns the main data in the report, and "H" will return the column header. The "H" argument will not replicate any changes you make to the column headers in the constituents report since Alpha Testing assigns default column headers to identify the result data. "M" is the default if this argument is left out.

Examples:

-   ^=at3\_result\_data("FactSet:Calculation Example Model", "constituents", "all", "all", "all")
    
    Downloads all the constituent data for the FactSet:Calculation Example Model, with each security/period in each row and each data item result in each column.
-   ^=at3\_result\_data("FactSet:Demonstration Model", "constituents", "return", "all", "all", "d") r
    
    Downloads all the main return data for the FactSet:Demonstration Model across the row and sorted in descending order.
-   ^=at3\_result\_data("FactSet:Calculation Example Model", "constituents", "all", "all", "08865810")
    
    Downloads all the data for identifier 08865810 from the FactSet:Calculation Model.
-   ^=at3\_result\_data("FactSet:Calculation Example Model", "constituents", "all", "20040130", "all")
    
    Downloads all the data from the 30-Jan-2004 period of the FactSet:Calculation Model.
-   ^=at3\_result\_data("FactSet:Calculation Example Model", "constituents", "weights", "20040331", "02341R40")
    
    Downloads the weight for identifier 02341R40 on the period 31-Mar-2004 of the FactSet:Calculation Model.

[Top of Page](https://my.apps.factset.com/oa/pages/14702#top)

___

## Returning Display Options

You can use display option codes to return Display Options from Alpha Testing Model reports using the following syntax:

^=AT3\_DISPLAY\_OPTION(“Directory:/sub-directory/model name”, “Report Name”, “Header/Footer”, “Row Number”, “Report Setting Name/Template Name”, “Report setting/Template”)r

The following are the Display Option code arguments:

-   Directory:/sub-directory/model name: the name of the model to pull data from, e.g., "FactSet:Calculation Example Model" or "Personal:/SubDirectory/Test Model"
    
    |**Note**|Syntax for the directory argument depends on the presence of subdirectories. For example, you can fetch a file from the main Personal directory by entering "Personal:FileName." However, if the file is in a subdirectory, the syntax is "Personal:/Subdirectory/FileName" (notice the insertion of a forward slash before "Subdirectory").|
    |---|---|
    
-   Report Name is the report from which you want to download data. For example, "Periods" or "Fractiles". You can use any report, include new reports that you create
    
    |**Note**|For reports that are added or copied to Alpha Testing 4, use the "`Report name - tile name`" format when specifying the report name.  Tile names are not unique and are only fully identifiable along with their report name. For example, enter "Periods - Chart" for the report name argument to refer to the tile "Chart" within the report named "Period."|
    |---|---|
    
-   Header/Footer downloads display options from either the report's header or footer
-   Row Number refers to the display option in the particular row of the header or footer. You can see the items for headers and footers in the [Display Options](https://my.apps.factset.com/oa/pages/pages/14100) tab of the Report Settings dialog box. Enter “All” to download the entire header or footer
-   (Optional) Report setting name/Template name: the name of the report setting or template to use. The report name you entered in the "Report Name" argument must be in this report setting or template. For example, enter the argument as "FactSet:different regression types" to select reports from that report template. If you leave this argument blank, the default uses reports from the model's default report setting
-   (Optional) Report setting/Template: identifies your file as a Report Setting ("RS") or Template ("T")
-   (Optional) r: transposes the values of the formula. By default, Alpha Testing downloads your display options down a column. Adding the r argument instructs Alpha Testing to download the display options across a row
