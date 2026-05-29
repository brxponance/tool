---
created: 2026-05-05T19:20:43 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21086
author: 
---

# Online Assistant : Customizing

> ## Excerpt
> Add a report title so that when you download or print your screening report, your title is automatically shown instead of "FactSet Universal Screen." You can also insert a subtitle on the second line of each report for further context.

---
## Customizing Report Titles and Subtitles Page 21086

Add a report title so that when you download or print your screening report, your title is automatically shown instead of "FactSet Universal Screen." You can also insert a subtitle on the second line of each report for further context.   

Topics covered:

-   [Adding Titles and Subtitles](https://my.apps.factset.com/oa/pages/21086#Adding)
-   [Inserting Variables](https://my.apps.factset.com/oa/pages/21086#Variables)

___

## Adding Titles and Subtitles 

You can specify the title and subtitle of a screen using two form fields. When you download or print the report, the customized fields will automatically be added. When you save the report, the customized fields will be retained. 

To add a title and subtitle to a screen: 

1.  Navigate to the report toolbar and click the **Screen and Application Settings** menu ![](online-assistant/26399.html).   
2.  Type a title and/or subtitle for the report into the associated form fields. Each title and subtitle can be a maximum of 50 characters long. Both appear in the printed or downloaded report if the "Show Title & Subtitle in Output" check box is selected. 
    
    ![](online-assistant/26399.1.html) 
3.  Click **OK**.
4.  Click **Download** ![](online-assistant/26399.2.html) or **Print** ![](online-assistant/26399.3.html) to export the screen and see the report title(s) you entered. Each is saved into the document. 

|**Note**|When using the `^%SCREEN REPORT` formula, the title saved in the screen will be returned. Any screens without a saved title will simply not have one returned. The ability to format the report title of a screen using (e.g., @AVAIL) is currently being developed. 
|---|---|
All titles and subtitles saved in [legacy Screen documents](https://my.apps.factset.com/oa/pages/pages/20610#Screen) are carried over when the documents are opened in the new application.|

[Top of Page](https://my.apps.factset.com/oa/pages/21086#top)

___

## Inserting Variables 

You can also include special variables in the Title and Subtitle fields by typing any of the syntaxes listed below. The variables specified in each screen are used in all downloaded reports, including those outputted via a batch process. 

|**Syntax**|**Resulting Output**|**Example**|
|---|---|---|
|@TIME|Current time in HH:MM:SS:MS format|6:02:35:47|
|@DATE|Current date in DD-MON-YYYY format|26-Feb-2018|
|@BTDATE|Value entered in the Screen and Application Settings menu > [Backtest Date](https://my.apps.factset.com/oa/pages/pages/20610#backtest) field|14-Jun-2018|
|@CUSTOMDATE|Relative date specified in the report|CUSTOMDATE(-1/0/0)|
|@SCREEN|Current screen name|LOW\_RELATIVE\_PB|
|@FILEPATH|Current screen location|SAMPLE\_SCREENS:|
|@PASSED|Number of securities in the [passed](https://my.apps.factset.com/oa/pages/pages/20608#passed) count|270|
|@AVAIL|Number of securities in the [available](https://my.apps.factset.com/oa/pages/pages/20608#available) count|566|
|@VISIBLE|Number of visible (i.e., not hidden) parameters in the report|7|
|#V.D|Value entered in Variables > [Global Variables](https://my.apps.factset.com/oa/pages/pages/21266) > D row|0/-1/0|
|#V.M|Value of variable entered in Variables > Global Variables > M row|\-1/0/0|
|#V.Q|Value  of variable entered in Variables > Global Variables > Q row|CLIENT:/MYPORTS/PORT.OFDB|
|#V.S|Value of variable entered in Variables > Global Variables > S row|CLIENT:/MYPORTS/PORT2.OFDB|
|#V.Y|Value of variable entered in Variables > Global Variables > Y row|SP50|

For example, if you type `Global Screen @DATE` in the Title field and export the report on October 22, 2018, `Global Screen 22-Oct-2018` is returned as the report title.  

[

Top of Page](https://my.apps.factset.com/oa/pages/21086#top)
