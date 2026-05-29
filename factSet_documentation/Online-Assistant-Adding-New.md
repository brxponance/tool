---
created: 2026-05-05T19:04:51 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13869
author: 
---

# Online Assistant : Adding New

> ## Excerpt
> You can extend the end date (by changing the model end date to a later date) 
  to previously saved model results and retrieve and append data for only the 
  new periods added to your model.

---
## Adding New Period Data Page 13869

You can extend the end date (by changing the model end date to a later date) to previously saved model results and retrieve and append data for only the new periods added to your model.

Topics covered:

-   [Fetching Data for Only New Periods Added for a Model](https://my.apps.factset.com/oa/pages/13869#one)
-   [Fetching Data for Only New Periods Added for Multiple Models](https://my.apps.factset.com/oa/pages/13869#multiple)

|**Note**|The processes described on this page also apply to adding additional factors or changing a model input, such as the model return type. These processes also apply when you are removing data items or periods from a model.
|---|---|
If you have return horizons that extend into the future for later dates in your model, then Alpha Testing will automatically re-fetch the returns for these incomplete return horizons when you append new period data onto your old result as long as the return horizons no longer extend into the future. However, if you have selected the [Partial Period Returns for Future Dates](https://my.apps.factset.com/oa/pages/pages/13595#partial) option, then all prior incomplete return horizons will be re-fetched. These will only take effect for models created after 24-July-2008. For example, if you create and run a model on 9-August, then you will be able to re-fetch data for your incomplete returns at the beginning of September.
For models that have results and have not had their return horizons re-fetched since 24-July, in order to start recalculating incomplete returns when appending, you must either a) first re-run them in full or b) do an append run after changing the end date of your model to the last date that has complete forward return horizons.
You can also set options for rerunning your model in full, or appending to existing results using [unconditional full run options](https://my.apps.factset.com/oa/pages/pages/13707#options).|

___

## Fetching Data for Only New Periods Added for a Model

You can fetch new period data and append the results to an existing Alpha Testing model. When models include Universal Screens, they tend to take longer to run; thus, fetching data for only new periods can be more efficient.

To run data for new periods:

1.  Click the **Menu** button and select File > Open Mode and open an existing model.
2.  With the model open, click the **Inputs** button.
3.  Choose the Time Series tab.
4.  Enter a new end date (a later date than the original end date).
    
    |**Tip**|To update the end date at the beginning of each month, enter \-1M as an end date. Entering -1M as the end date saves you from having to open the model and change the end date each time you want to fetch new period data.|
    |---|---|
    
5.  Click **OK** in the Model Inputs dialog box. You will receive the following prompt:
    
    ![](online-assistant/23443.html)
    
6.  Select the [run option](https://my.apps.factset.com/oa/pages/pages/13707#saving) to use.

[Top of Page](https://my.apps.factset.com/oa/pages/13869#top)

___

## Fetching Data for Only New Periods Added for Multiple Models

You can fetch new period data for multiple Alpha Testing models.

To fetch data for only new periods for multiple models:

1.  Click the **Menu** button and select File > Open and open existing models.
2.  With the models open, click the **Inputs** button.
3.  Choose the Time Series tab.
4.  Enter a new end date (a later date than the original end date).
    
    |**Tip**|To update the end date at the beginning of each month, enter \-1M as an end date. Entering -1M as the end date saves you from having to open the model and change the end date each time you want to fetch new period data.|
    |---|---|
    
5.  Click **OK**. If asked if you want to run your model, click **No**.
6.  Click the **Menu** button and select File > Save to save the new model inputs.
7.  Repeat steps 2 through 6 for each selected model.
8.  Click the **Actions** button and select "Run in Background."
9.  Select the directory where your models are saved.
10.  Select the model. You can select more than one.
11.  Click the **Add** button.
12.  To fetch updated data for just your additional periods, select the "Append to existing results (if any)" check box.
13.  Click the **Actions** button and select "Run Interactively."
    
    **Run in Background**
    
    Runs the model(s) in a process outside of your FactSet session. This allows you to work on other Alpha Testing models (i.e., viewing model results) or use other FactSet applications, such as Universal Screening, while other models are being run outside of FactSet.
    
    To [view the status of your models running](https://my.apps.factset.com/oa/pages/pages/13701#view) during the batch process, select the Background Run Monitor option.
    
    **Run Interactively**
    
    Runs the model(s) inside of your FactSet session. This allows you to view the status of your models as they are running. When using the interactive run process, do not use other FactSet applications, including Alpha Testing.
    
14.  Click **OK** to run the automation process. If you have selected multiple models, they will run in the order you have selected.
15.  You will receive a message dialog box when the batch process is complete. Click **OK**.
    
    |**Note**|When running automation interactively you will no longer see a model running when the process is complete.
    |---|---|
    To view new model results generated by the automation process, Click the **Menu** button and select File > Open Model. Results are saved with the model(s).|
    

[Top of Page](https://my.apps.factset.com/oa/pages/13869#top)

Copyright © 1999-2026 FactSet Research Systems Inc.

The information contained in FactSet Online Assistant® includes information proprietary to FactSet. Redistribution of this material to any person or organization who is not a FactSet subscriber is prohibited. Republication in any form is prohibited without prior express written consent of FactSet.

You must have an internet connection to view outside websites. Linked sites are not under the control of FactSet and FactSet is not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. FactSet is not responsible for webcasting or any other form of transmission received from any linked site. The views expressed on these sites do not necessarily reflect the views of FactSet. Information on these sites may not be current.
