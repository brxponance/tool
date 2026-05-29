---
created: 2026-05-05T19:05:16 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/14052
author: 
---

# Online Assistant : Troubleshooting

> ## Excerpt
> This page addresses some common questions you may encounter while using Alpha Testing and provides you with troubleshooting solutions.

---
This page addresses some common questions you may encounter while using Alpha Testing and provides you with troubleshooting solutions. 

|**!**|The first question you want to answer when troubleshooting an Alpha Testing model issue is "Is the model set up correctly?"
|---|---|
To check if your model is set up properly, review the first two links below.|

Topics covered:

-   [How can I determine if my Alpha Testing model is set up correctly?](https://my.apps.factset.com/oa/pages/14052#one)
-   [Why doesn't my model run completely?](https://my.apps.factset.com/oa/pages/14052#two)
-   [Why are over 100,000 companies being retrieved for each period?](https://my.apps.factset.com/oa/pages/14052#three)
-   [Why do my factor formulas return data but all my fractiles are NA?](https://my.apps.factset.com/oa/pages/14052#four)
-   [Why does the Period report display zero companies for the first few dates?](https://my.apps.factset.com/oa/pages/14052#five)
-   [Why is my model's return or factor data NA?](https://my.apps.factset.com/oa/pages/14052#six)
-   [Why is my F1-FN return NA?](https://my.apps.factset.com/oa/pages/14052#F1)
-   [Why is my model's benchmark return NA?](https://my.apps.factset.com/oa/pages/14052#seven)
-   [Why is the return for my last period NA?](https://my.apps.factset.com/oa/pages/14052#eight)
-   [What do I need to do in Alpha Testing when I make edits to referenced Universal Screens?](https://my.apps.factset.com/oa/pages/14052#twelve)
-   [Why are some companies showing very high returns?](https://my.apps.factset.com/oa/pages/14052#thirteen)
-   [Why don't I see intra-period returns for defunct companies?](https://my.apps.factset.com/oa/pages/14052#fourteen)
-   [Why aren't tied companies being distributed into fractiles the way I want?](https://my.apps.factset.com/oa/pages/14052#sixteen)
-   [Why does my model have NA returns for some return horizons and not others?](https://my.apps.factset.com/oa/pages/14052#seventeen)
-   [Why does my model have NA returns for a few later periods but then has returns for the last few periods?](https://my.apps.factset.com/oa/pages/14052#eighteen)

For more help, see [Quantitative Model Building Tips](https://my.apps.factset.com/oa/pages/pages/13741) or e-mail [Quant Support](mailto:quant_support@factset.com).

___

## How can I determine if my Alpha Testing model is set up correctly?

To check if your model is set up correctly, change your model's end date to match the start date and run your model. After the model has successfully run, check your model's results to make sure that the number of companies and fractiles being returned is reasonable and that your factor and return data does not contain too many NAs.

If your model uses a screen as its universe:

1.  Launch [Universal Screening](https://my.apps.factset.com/oa/pages/pages/11721).
2.  Open the screen.
3.  Set the to the same date as your Alpha Testing's [model start date](https://my.apps.factset.com/oa/pages/pages/13553). If you are running a monthly model, set the backtest date in screening to the 31st, even if that day does not exist (e.g., 31-Feb-2002).
4.  Examine the results of your screen. Confirm that the number of companies returned is as expected. Also, check the results of rows used as factors in your Alpha Testing model.

If you are not using a screen as your universe, you may still enter your universe and factor formulas into Universal Screening, then follow steps 3 and 4 listed above.

For more information, see ["What do I need to do in Alpha Testing when I make edits to referenced Universal Screens?](https://my.apps.factset.com/oa/pages/14052#twelve)".

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why doesn't my model run completely?

If your model is not running to completion but individual periods run successfully, you may be able to use the [caching feature](https://my.apps.factset.com/oa/pages/pages/13869) to run the entire period. Also, see "[How can I determine if my Alpha Testing model is set up correctly?](https://my.apps.factset.com/oa/pages/14052#one)" for more help.

If your model is having issues getting past a specific date and your model uses a Universal Screen, check the results of your Universal Screen or run your Alpha Testing model for just that one backtest date.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why are over 100,000 companies being retrieved for each period?

If more than 100,000 companies are being retrieved for each period, try rewriting your universe formula. Your model may be retrieving every company available to you due to an incorrect formula syntax. Formulas that use the AND/OR logic require an \=1 at the end to close the logic statement. 

For example, (FF\_BPS(MON,0 L45D)/FF\_PRICE\_CLOSE\_CP(MON,0)>1 AND FF\_PRICE\_CLOSE\_CP(MON,0)\*FF\_COM\_SHS\_OUT(MON,0)) uses incorrect syntax whereas (FF\_BPS(MON,0 L45D)/FF\_PRICE\_CLOSE\_CP(MON,0)>1 AND FF\_PRICE\_CLOSE\_CP(MON,0)\*FF\_COM\_SHS\_OUT(MON,0))=1 uses correct formula syntax. 

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why do my factor formulas return data but all my fractiles are NA?

There are two reasons why your parameter formulas may return data while fractiles return NA: either you are trying to fractile textual data or group numeric non-discrete data. If you are doing one of the two, your fractiles will have NAs.

### Textual Factor Data Example

**Incorrect**

If you entered

FG\_FACTSET\_SECTOR

 (returns sector name) as a factor in the Factors tab of the Model Inputs dialog box and selected "5" from the Fractiles drop-down menu, your fractiles will return NAs. This is because you cannot divide sector names into fractiles.

![](online-assistant/23452.html)

**Correct

**To correct this issue, you must select "Group" from the Fractiles drop-down menu.

![](online-assistant/23452.1.html)

### Numeric Factor Data Example

**Incorrect

**If you entered P\_TOTAL\_RETURN(-1M,0M) (return for last month in local currency) as a factor in the Factors tab of the Model Inputs dialog box and selected "Group" from the Fractiles drop-down menu, your fractiles will return NAs. This is because returns will be different for each security for each period, and if allowed, a fractile group would be created for each security for every period (thousands or millions of groups).

![](online-assistant/23452.2.html)

**Correct

**To correct this issue, you must select a number (e.g., 5) from the Fractiles drop-down menu.

![](online-assistant/23452.3.html)

Once you've corrected your model inputs, click the **Run** button.

You will see the following [prompt](https://my.apps.factset.com/oa/pages/pages/13707#saving) regarding your model run after making these changes:

![](online-assistant/23452.4.html)

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why does the Period report display zero companies for the first few dates?

When the Period report displays zero companies for the first few dates, it's often because a database you are using may not have data for those dates or you don’t have access to the data. To solve this issue, check the library description in Online Assistant or use [Formula Lookup](https://my.apps.factset.com/oa/pages/pages/14929) to view the database’s available history.

Another reason may be that no companies pass your screening criteria because the average result has changed over time. For example, companies will pass using the formula FF\_MKT\_VALUE(MON,0)>100000 today, but zero companies pass with a backtest date of 31-Dec-1990.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why is my model's return or factor data NA?

This issue is similar to the one above where the Period report shows zero companies passing.

There are several reasons why return or factor data could be NA.

-   Data may not exist or you may not have access to the data.
-   A universe generated using one database (e.g., MSCI), might not be covered by formulas in another database (e.g., FTSE).
-   You may have a formula syntax error.
-   Using the NOW date argument as your end date results in NA returns for different companies at different times of the day.
-   If only the last few periods are NA, this could be because the [forward return date](https://my.apps.factset.com/oa/pages/pages/13595#pricing) is in the future.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why is my F1-FN return NA?

A [summary F1-FN return](https://my.apps.factset.com/oa/pages/pages/13718#F1NA) will be NA if a period F1-FN return is less than -100.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why is my model's benchmark return NA?

If your model's benchmark returns NA, it may be due to your model's return formula not working with your selected benchmark identifier. 

For example, if you use a Russell index identifier, you must specify Russell as your [benchmark return source](https://my.apps.factset.com/oa/pages/pages/13596) in the Returns tab in the Model Inputs dialog box.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why is the return for my last period NA?

Alpha Testing uses forward returns for each of the periods specified in your model. You cannot use the most recent date as your end date because the forward return has not happened yet. For a monthly model, use "End of Two Months Ago" as your end date.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## What do I need to do in Alpha Testing when I make edits to referenced Universal Screens?

If your model uses a Universal Screen or references a specific row in a screen and you make a change to the screen (e.g., you change the row number in a screen for a factor), your Alpha Testing model will not automatically reflect your changes. You must manually update your model's inputs. This is also true when you change the directory where your screen is saved.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why are some companies showing very high returns?

One reason this can happen is when a company re-emerges out of bankruptcy.

To control high returns, click the **Advanced** button in the Returns tab of Model Inputs dialog box to launch the [Returns Modification dialog box](https://my.apps.factset.com/oa/pages/pages/13595#max). Here you can apply a Maximum % Returns constraint to limit the maximum reported returns.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why don't I see intra-period returns for defunct companies?

If a company stops trading intra-period, you will not see a return for this company.

To include the intra-period return, you must:

-   Use a [custom return formula](https://my.apps.factset.com/oa/pages/pages/13603). For example, for the Pricing database, enter
    
    IF(RANGE(PDNC(LAST),PDNC(0),PDNC(#F)),100\*((P(LAST)\*EXRATE(PISO,"#CU",PDNC(LAST))/P(#CU 0))-1),PRETC(#CU 0 #F)) where you substitue the actual [ISO currency code](https://my.apps.factset.com/oa/pages/pages/1470) (e.g., GBP for British Pounds) for #CU

  OR

-   Select the "[Partial Period Returns for NAs (Limited History)](https://my.apps.factset.com/oa/pages/pages/13595#pricing)" check box in the Returns Modifications dialog box. (Model Inputs button > Returns tab > Advanced button.) This option can only be used with FactSet or MSCI return sources.
    
    ![](online-assistant/23452.5.html)

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why aren't tied companies being distributed into fractiles the way I want?

Review how Alpha Testing handles [tie resolutions](https://my.apps.factset.com/oa/pages/pages/13573#ties). If you still want more control over how ties are handled, consider using a tie-breaker code. This adds a small amount to the factor result, which often is enough to determine ties, but not enough to change the result significantly. For example, if your factor is Book to Price and you want shares to be the grouping tiebreaker, enter:

(FF\_BPS(MON,0 L45D)/FF\_PRICE\_CLOSE\_CP(MON,0)) + FF\_COM\_SHS\_OUT(MON,0)/10000000 .

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why does my model have NA returns for some return horizons and not others?

Some of your return horizons may extend out into the future, so the return is NA because the entire forward period does not exist. If you want to see partial period returns for these periods, select the [Partial Period Returns for Future Dates](https://my.apps.factset.com/oa/pages/pages/13595#partial) check box.

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)

___

## Why does my model have NA returns for some later periods but then has returns for the last few periods?

If you ran the model previously, the full forward return horizon period might not have existed yet for the periods where the returns are NA. These were the last periods in the model at that time. When you appeneded new period data onto the existing model results, Alpha Testing did not re-fetch these returns. To correct this issue, see how to [add new period data](https://my.apps.factset.com/oa/pages/pages/13869#addperdata).

[Top of Page](https://my.apps.factset.com/oa/pages/14052#top)
