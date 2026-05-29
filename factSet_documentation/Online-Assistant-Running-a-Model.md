---
created: 2026-05-05T19:03:52 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20830
author: 
---

# Online Assistant : Running a Model

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Running a Model Page 20830

Launch it with FactSet Search: @AT4

Once you have entered all of your model inputs, click on the **Run Model** button or select drop-down options to run your model and generate data.

Alpha Testing 4 lets you change your model inputs at any time during your Alpha Testing session; however, Alpha Testing does not automatically update your model data. You _must_ re-run your model after you make any model input changes.

### Run Settings

To access Run Settings, expand the Run Model drop-down menu and select one of the following options:

![](online-assistant/26049.html)

-   **Append Run**: If you select this option, Alpha Testing will assume you only want to fetch data for any changes or new dates since the last time the model was run. Therefore, Alpha Testing will run the model and append new results to existing data. 
-   **Full Run:** If you select this option, Alpha Testing will assume you want to run the open model in full. Any existing results will be erased once the model finishes running and saves successfully.
-   **Selective Dates:** If you select this option, Alpha Testing will prompt you to select the dates you want to re-fetch. Alpha Testing will replace the results from the selected dates and add new dates, but will retain all other data from the previous run.
-   **Schedule:** If you select this option, you will be redirected to [Quant Scheduler](https://my.apps.factset.com/oa/pages/pages/20514). Use Quant Scheduler to specify when you want a certain model to run.

|**Note**|If you click the **Run Model** button, Alpha Testing performs a full run for new models and an append run for previously-run models by default.|
|---|---|

When multiple models have been submitted to run from Alpha Testing, view and manage the queue using the model run drop-down. Queued models can be removed by clicking **Cancel Run**.

![](online-assistant/26049.1.html)

The background run queue can also be managed in the Interactive Model Runs table of Quant Scheduler 2 (@QS2).

![](online-assistant/26049.2.html)

### **Refresh Returns**

To address missing returns without altering factor data, select Run Model > Individual Dates and select the "Refresh Returns Only" check box (“Individual Dates” and “Range” types in Quant Scheduler 2). This action regenerates returns data for the selected dates or range, but run the remaining model in append mode, retrieving only new dates or changed configurations.

![](online-assistant/27834.html)

[Top of Page](https://my.apps.factset.com/oa/pages/20830#top)
