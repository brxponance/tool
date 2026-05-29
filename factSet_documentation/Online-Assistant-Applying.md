---
created: 2026-05-05T19:19:30 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20688
author: 
---

# Online Assistant : Applying

> ## Excerpt
> Launch it with FactSet Search: @US

---
## Applying Parameter Rankings Page 20688

Launch it with FactSet Search: @US

Use the Rank tab to aggregate the results of several data columns in your screen into a single final ranking. For example, you may want to combine several valuation ratios into a single weighted valuation ranking.

Individual rankings are first applied to each data column that you select. They are computed to return each security's rank relative to the selected universe. Then, one final column is returned, which uses your weightings to combine the individual rankings into an overall score for each security. More than one set of rankings can be added to the same screen.

Topics covered:

-   [Creating a New Ranking](https://my.apps.factset.com/oa/pages/20688#Creating)
-   [Adding, Editing, and Deleting Rankings](https://my.apps.factset.com/oa/pages/20688#Adding)
-   [Calculating Overall Scores](https://my.apps.factset.com/oa/pages/20688#score)

___

## Creating a New Ranking

To create a new ranking, expand the Format Results pane and select the Rank tab. You'll immediately see a list identifying all data columns in your screen. Columns that are selected from this list are added to the Ranking table. Each column you select requires three primary inputs: Order, Weight, and Value of NA.

![](online-assistant/25851.html)  

-   **Ranking Order**
    
    Controls whether the securities with the smallest values will be given the best ranking (1) or the securities with the largest values will be given the best ranking. For example, for the Price to Earnings ratio, you may want the smallest ratio to be given the best rank. On the other hand, for Dividend Yield, you may want the best rank for the largest yields.
-   **Ranking Weight** 
    
    Controls the relative importance of each individual ranking when calculating the overall score. The larger the weight, the more influence that item will have on the overall score. The weights are relative to each other.
    
    Shown in the example image above, Dividend Yield will have twice the influence on the overall score as Price to Book Value. This is because its weight is twice as large.
    
-   **Value of NA** Allows you to control what will be used as the rank for a security that does not have data available for that item. By default, no ranking will be returned.
    
    In the example shown above, "Worst Rank" is returned for any security that does not have data available for Dividend Yield.
    

Click the **Options** button ![](online-assistant/25851.1.html) in the middle pane to access additional options for each selected item.  

![](online-assistant/25851.2.html) 

**Assign Tied Securities To** 

This option controls how tied securities are assigned to a fractile. If "Midpoint of Fractiles" is selected, then all tied securities will be assigned to the midpoint of the fractiles that they could be assigned to.

|**Note**|For example, if Midpoint is selected when you are deciling 100 securities for Dividend Yield, and 30 of these do not pay a dividend, all 30 will be assigned to the ninth fractile (i.e., the midpoint of the eighth, ninth, and tenth fractiles). As an alternative, you can specify that all securities be assigned to the better or worst of the tied fractiles.|
|---|---|

**Extra Securities Distribution** 

This is the starting point for distributing extra securities into fractiles. "Middle Out" is the default selection; it places extra securities in middle fractiles before outer fractiles. "Outside In" is the opposite; it places extra securities in outer fractiles before middle fractiles. 

**Extra Securities Direction**

This option controls whether extra securities should be oriented better or worse. "Favor Best Rank" is the default selection; it allows a better ranking to be favored. "Favor Worst Rank" is the opposite; it allows a worse ranking to be favored.

The Extra Securities Distribution and Direction options work together to determine where the extra securities are placed when they do not fit evenly into the specified number of fractiles.

|**Note**|For example, if you are deciling 101 securities, then nine deciles will contain 10 securities, and one decile will contain 11 securities. If the Extra Securities Distribution input is set to "Outside In" and the Extra Securities Direction input is set to "Favor Best Rank," then decile 1 will be given the eleventh security. If distribution is set to "Middle Out" and direction is set to "Favor Worst," then decile 6 will be given the eleventh security.|
|---|---|

### Selecting Ranking Options 

The Ranking Options menu on the right of the Rank tab allows you to set inputs that apply to all parameters in your report. The Rank Name (i.e., reference name) cannot be edited. USRANK1 will be used for the first ranking you create, USRANK2 will be used for the second, and so forth.

![](online-assistant/25851.3.html) 

**Score Distribution** This input specifies the type of ranking used. You can select fractiles or an absolute ranking.

**Rank Against**

This input specifies the group of securities that each security will be ranked against:

-   **Securities in Defined Universe
    
    **Each security will be ranked against the securities in the screen's universe. The number of securities can be seen at the top of the Select Criteria pane.
    
    ![](online-assistant/25851.4.html) 
-   **Securities in Report** Each security will be ranked against the securities that appear the screen's results. The number of securities can be seen at the top of the Results pane.
    
    ![](online-assistant/25851.5.html) 

**Return NA for Score**

This option allows you to return "NA" for a security's overall score if NAs are returned for that security's individual ranks. For example, if this option is set to "1," any security that returns "NA" from more than one individual rank will have "NA" as its overall score.  

[Top of Page](https://my.apps.factset.com/oa/pages/20688#top)

___

## Adding, Editing, and Deleting Rankings

You can make changes to the ranking that you've previously created, add additional rankings, and remove rankings that you no longer need. 

### Editing Rankings 

To modify a ranking that you've already created, go to the ranking columns drop-down menu and select it from the list.

![](online-assistant/25851.6.html)

When you are finished making your changes, navigate to the bottom right of the Rank tab and click the **Modify Rank** button. The formulas previously created will be updated to reflect your changes. 

|**Note**|There are several differences between the two application versions that do not allow legacy and new rankings to work interchangeably. As such, multi-factor rankings created in the cannot be edited in the new application ([FactSet Search](https://my.apps.factset.com/oa/pages/pages/16233): @US).
|---|---|
Rankings in the new application have the following features:
-   They are added as "real" data columns that can be referenced by other parameters in the screen
-   Improved handling of outliers and tie breaks, to help manage their effects on screen results
-   More than one ranking can be applied to the same screen
Although weighting integers are limited to the new application, the value of rankings in both application versions are relative to each other. As long as the proportions are kept constant, the same results are returned. For example, a legacy screen containing rankings with .1, .15, .25, and .5 weights provides the same results as a new screen containing rankings with 10, 15, 20, and 50 weights.|

### Adding Additional Rankings 

Select "Create New Rank" from the ranking columns drop-down menu and follow the steps [outlined above](https://my.apps.factset.com/oa/pages/20688#Creating) to create your new ranking.

![](online-assistant/25851.7.html) 

### Deleting Rankings

Select the ranking you wish to delete from the ranking columns drop-down menu. Navigate to the bottom right of the Rank tab and click the **Delete Rank** button ![](online-assistant/25851.8.html) to delete it from your screen.

|**Note**|You are not able to delete rankings for any columns that are used as parameter references.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/20688#top)

___

## Calculating Overall Scores

A weighted average of each ranking is calculated to produce the overall rank. The following explains how overall ranking scores are calculated in Universal Screening.  

**Numerator of Formula

**((value of the first ranking \* first ranking weight) + (value of the second ranking \* second ranking weight)+…+ (value of the last ranking \* last ranking weight))

**Denominator of Formula

**(first ranking weight + second ranking weight + third ranking weight)

Here is an example using the weights from the [image shown above](https://my.apps.factset.com/oa/pages/20688#Image): 

![](online-assistant/25851.9.html)

**Numerator

**(1\*15) + (4\*15) + (3\*20) + (2\*20) + (8\*30) =

15 + 60 + 60 + 40 + 240 = 415

**Denominator

**15 + 15 + 20 + 20 + 30 = 100

**Ranking** 415 / 100 = 4.15

[Top of Page](https://my.apps.factset.com/oa/pages/20688#top)
