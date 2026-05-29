---
created: 2026-05-05T19:20:46 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20974
author: 
---

# Online Assistant : Using Screen

> ## Excerpt
> Screen Iterator runs a single Equity or Debt Screen multiple times over a specified range of dates.

---
## Using Screen Iterator Page 20974

Screen Iterator runs a single Equity or Debt Screen multiple times over a specified range of dates. 

|**Note**|Access to Screen Iterator requires a subscription to back testing and the Screen Iterator - Monthly or Daily/Weekly product. The Database Import and Delimited Text output options also require separate subscriptions. Contact your FactSet representative or [FactSet Support](https://my.apps.factset.com/oa/pages/pages/4129) for more information.|
|---|---|

Topics covered:

-   [Creating a Model](https://my.apps.factset.com/oa/pages/20974#Creating)
-   [Entering a Start and End Date](https://my.apps.factset.com/oa/pages/20974#Dates)
-   [Specifying the Iteration Frequency](https://my.apps.factset.com/oa/pages/20974#Frequency)

___

## Creating a Model

You can output the results of each iterated screen in two ways:

-   Single, preexisting time-series [OFDB](https://my.apps.factset.com/oa/pages/pages/3934#ofdb) file
-   Single .zip folder containing individual Microsoft Excel (.xlsx), Delimited Text (.csv), or Database Import (.txt) files

To create a new model follow these steps: 

1.  On the Universal Screening homepage, click the **Open** ![](online-assistant/26215.html) button to select the screen you like to iterate. You can use any of the screens stored in your [Personal](https://my.apps.factset.com/oa/pages/pages/3935#personal_library), [Client](https://my.apps.factset.com/oa/pages/pages/3922#client_library), or [Super\_Client](https://my.apps.factset.com/oa/pages/pages/3938#super_client_library) directory. 
    
    |**Note**|Make sure that the screen you select returns results in the Equity Screening or Debt Screening sections of Universal Screening. The results must also change whenever you change the [backtest date](https://my.apps.factset.com/oa/pages/pages/20610#backtest).|
    |---|---|
    
2.  After the screen is populated, click the **Screen Iterator** ![](online-assistant/26215.1.html) button on the top-right corner.  
    
    ![](online-assistant/26215.2.html)
    
3.  Select an output file preference (e.g., OFDB or Delimited Text).
    
    |**Note**|Screen Iterator appends data onto existing dates in an OFDB file.|
    |---|---|
    

If you select the Delimited Text or Database Import option in [Step 3](https://my.apps.factset.com/oa/pages/20974#StepThree), then you must select a file naming preference:

-   Select "Append as prefix" to use the screen name as a prefix (e.g., MYSCREEN\_201801).
-   Select "Append as suffix" to use the screen name as a suffix (e.g., 201801\_MYSCREEN). 

Screen Iterator outputs multiple files using both the screen name and the date. 

|**Tip**|If you want the text fields in your Delimited Text or Database Import files to be enclosed by quotes, then select the **Quoted Strings** check box.
|---|---|
If you want to exclude headers from your Delimited Text file, then select the **Remove Headers** check box.
To apply the screen's current formatting of NA values, select **Screen NA Format**.|

Select a delimiter option:

-   Comma
-   Space
-   Tab
-   Custom

If you select the **Custom** option, then type any character on your keyboard (e.g., a semicolon) that you like to use to delimit the columns in your screen. 

![](online-assistant/26215.3.html)

1.  If you select the Excel option in [Step 3](https://my.apps.factset.com/oa/pages/20974#StepThree), then you must select one of the [file naming preferences](https://my.apps.factset.com/oa/pages/20974#FileNamePreference). Screen Iterator outputs multiple files using both the screen name and the date. 
2.  If you select the OFDB option in [Step 3](https://my.apps.factset.com/oa/pages/20974#StepThree), then you must first set up a [screening-parameters-to-time-series-OFDB-fields](https://my.apps.factset.com/oa/pages/pages/21010#Archiving) mapping in Universal Screening")%> and save the screen. After this mapping is complete, you can select the OFDB that you set up from the Time Series OFDBs drop-down menu. 
    
    If you change your screen to change the archived results to an OFDB file, then you must first delete the existing OFDB file. Set up the OFDB mapping in the screen again before rearchiving results or mix the new results with companies and columns that no longer pass the screen. 
    
    A consideration when selecting the OFDB option is that securities that pass the screen cannot be archived, unless they have at least one non-NA value for at least one field. If some securities have NA values for all the fields that you are archiving, then add a dummy row to your screen with a formula of "1" and archive that field with the field name "ISON" to your OFDB.
    
    |**Tip**|Select the **Archive Data as Unsplit** check box to archive data in the screen as unsplit into the OFDB file. Select this option if your screen is set up to display unsplit data.|
    |---|---|
    
3.  Click the **Calendar** ![](online-assistant/26215.4.html) widgets in the Time Series section to select a date range or manually type [dates](https://my.apps.factset.com/oa/pages/pages/20974#dates) in the text boxes. All date formats (e.g., `MM/DD/YYYY`, `MM/YYYY`, `0M`, or `-1D`) are supported. 
4.  Specify the [iteration frequency](https://my.apps.factset.com/oa/pages/pages/20974#frequency). Select or type the number of iterations needed.
5.  Expand the drop-down menu to select the appropriate frequency.
6.  Expand the Calendar drop-down menu to determine the month-end dates:
    -   **Five Day:** Defaults weekend and non-trading dates to the last trading day
    -   **Seven Day:** Defaults non-trading dates to the last trading day
    -   **A Country-specific Calendar:** Follows the trading schedule of the selected country
7.  Click **Run** to iterate the screen.  

|**!**|If you select the OFDB option, then FactSet recommends that you save your screen immediately after creating the time-series archive via Screening. This action ensures that the OFDB file is always available for future use.|
|---|---|
|**Note**|When the Screen Iterator interactively runs, the maximum number of iterations is capped to 1000. If you try to run more than 1000 iterations at a time, then you are going to receive an error message in the dialog box and you must adjust your inputs before you can continue.
![](online-assistant/26215.5.html)
The Screen Iterator dialog box can be closed while you continue to work in Universal Screening. However, you are unable to archive/download screens or start another Screen Iterator job while there is one in progress. A confirmation message shows after the run is completed.
Models created in the [legacy Screen Iterator application](https://my.apps.factset.com/oa/pages/pages/3960) cannot be imported. They must be recreated via the new Screening application.|

[Top of Page](https://my.apps.factset.com/oa/pages/20974#top)

___

## Entering a Start and End Date 

To see the dates that your iteration is using, you can use the following formula, which returns a comma-delimited list of the dates:

`DATE_RANGE(START_DATE,END_DATE,FREQUENCY).`

You must enter the dates in the MM/31/YYYY or MM/YYYY format if you wish to always use all month-end dates in your monthly models, so the data is [lagged correctly](https://oa.apps.factset.com/pages/13736#test). 

If you use the date format MM/DD/YYYY to specify your start and end date for a monthly model, then always enter 31 for the day to ensure each month's end date is correct. For example, if you enter 2/28/2020 as the start date for February's month-end, then Screen Iterator uses 3/28/2020 for March's month-end date. You must enter 2/31/2020 as your start date to avoid the scenario.

[Top of Page](https://my.apps.factset.com/oa/pages/20974#top)

___

## Specifying the Iteration Frequency 

Select an iteration frequency option and enter the iteration frequency than you want to use. For example, if you select the Months option, then the number you enter represents the number of months between each iteration.

**Example**

If you have the following scenario:

-   Start date of 10/2019
-   End date of 10/2020
-   Select the Months option
-   Frequency of 1

Screen Iterator runs your specified screen every month — for 10/2019, 11/2019, 12/12019, 1/2020, 2/2020, 3/2020, 4/2020, 5/2020, 6/2020, 7/2020, 8/2020, 9/2020, and 10/2020. If you change the frequency to 2, Screen Iterator runs your model for 10/2019, 12/2019, 2/2020, and so on.

[Top of Page](https://my.apps.factset.com/oa/pages/20974#top)
