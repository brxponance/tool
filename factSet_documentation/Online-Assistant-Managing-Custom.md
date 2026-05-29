---
created: 2026-05-05T19:02:13 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21350
author: 
---

# Online Assistant : Managing Custom

> ## Excerpt
> You can create custom fractile bins when adding factors to your model.  If you're adding a new factor, follow the basic steps to add a new factor, and then use the information on this page to create and manage your custom fractile bins.

---
## Managing Custom Fractile Bins Page 21350

You can create custom fractile bins when adding factors to your model.  If you're adding a new factor, follow the basic steps to [add a new factor](https://my.apps.factset.com/oa/pages/pages/21240#add_factor_list), and then use the information on this page to create and manage your custom fractile bins.

Topics covered:

-   [Creating Custom Fractile Bins](https://my.apps.factset.com/oa/pages/21350#create)

-   [Factor Values](https://my.apps.factset.com/oa/pages/21350#factorvals)
-   [Best/Worst](https://my.apps.factset.com/oa/pages/21350#bw)
-   [Factor's Fractiles](https://my.apps.factset.com/oa/pages/21350#factorfract)
-   [Group](https://my.apps.factset.com/oa/pages/21350#group)

-   [Editing Custom Fractile Bins](https://my.apps.factset.com/oa/pages/21350#edit)

___

## Creating Custom Fractile Bins

Click the **Define** button to define your own fractile break points. Once in the Define dialog, you can create fractile break points based on the options in the "Fractiles Based On" drop-down menu.

![](online-assistant/26712.html)

### Factor Values

Fractile break points are hardcoded values that are associated with the factor data after Alpha Testing performs NA or outlier handling. Use the Conditional Operator and Conditional Value fields when defining the break point.

-   The "Lower Values Rank Better" check box allows you to reverse the order of the fractile bins.
-   The Conditional Operator offers three choices: "Less than," "Less than or equal to," and "Equal to."
-   The Conditional Value is a numeric value that is compared to the company's factor value using the Conditional Operator to determine the company's custom bin.
-   Once you have the Operator and Value in place, click the **Add** button to add the fractile break points. You can always [edit](https://my.apps.factset.com/oa/pages/21350#edit_bins) the bins later.

Use the following steps to help you determine where to set your break points for Factor Values:

1.  Enter your factor and choose a number of fractiles.
2.  Within Fractiling Options, select the "[Fractile Across Periods](https://my.apps.factset.com/oa/pages/pages/21351#fractile_periods)" check box.
3.  Run the factor/model to fetch the data.
4.  Edit the factor, change the Fractiles option to "Custom," and click the **Define** button.
5.  When you base your fractiles on Factor Values, you will see the break points of all fractiles. You can then edit the break points and deselect "Fractile Across periods."

### Best/Worst

Enter any positive integer into the “Best/Worst Fractile Size” field to find the fractile break points. Click the **Add** button to create the fractile bins.

By default, Alpha Testing populates the "Best" category with the highest factor values. Select the "Lower Values Rank Better" check box to populate the Best category with the lowest values. 

Fractile break points are created using the following process:

1.  Rank all companies by their factor values from Best to Worst.
2.  Starting from the best factor value, count down N companies. Alpha Testing uses the factor value of this company as the break point for the "Best" fractile. Companies that meet or exceed this factor value will be placed into the Best fractile. Keep in mind that fractile designation can be affected by the [Tie Resolution](https://my.apps.factset.com/oa/pages/pages/21351#ties) options.
3.  Starting from the worst factor value, count up N companies. Alpha Testing uses the factor value of this company as the break point for the "Worst" fractile. Companies with this factor value or a worse value will be placed into the Worst fractile. Fractile designations around this break point can be affected by the [Tie Resolution](https://my.apps.factset.com/oa/pages/pages/21351#ties) options.
4.  All remaining companies are placed into the "Middle" fractile.

To change the bin size, enter a different integer, and then click **Add**. 

You can also edit the name of your fractile, without affecting the order of the fractiles. For more information, see the [Editing Custom Fractile Bins](https://my.apps.factset.com/oa/pages/21350#edit) section below.

### Factor's Fractiles

This option allows you to fractile a factor and create custom bins based on those fractile values. Group or Custom fractiling is not available with this option.  Using this option, you can create custom bins on the fractile values. 

1.  After selecting Factor's Fractiles, select or enter the number of fractiles in the first entry box.
2.  Select or deselect the "Lower Values Rank Better" depending on the factor.
3.  Use the Conditional Operator and Conditional Value fields when defining the break point.

-   Select the Conditional Operator from the drop-down menu. The Conditional Operator offers three choices: "Less than," "Less than or equal to," and "Equal to."
-   Enter hardcoded numbers in the Conditional Value field to determine the break points. The Conditional Value is a numeric value that is compared to the company’s fractile using the Conditional Operator to determine the company’s custom bin.

5.  Once you have the Operator and Value in place, click the **Add** button to add the fractile break points. You can always [edit the bins](https://my.apps.factset.com/oa/pages/21350#edit) later.

Custom bins that use the Factor's Fractiles option will always rank lower values better in the New and Edit Factor dialog boxes. This is because Alpha Testing places the best values into the first fractiles. With this option being a fractiling of fractiles, you will generally want to have the lowest values (e.g., Fractile 1) ranked best. 

The example below creates custom bins from percentiles of a P/E factor. When you percentile a P/E factor using the "Lower Values Rank Better" option, the lowest P/E is placed into the first percentile and the highest is placed in the 100th. The custom bins group Percentiles 1 – 5 in Custom Fractile 1, Percentiles 6 – 25 in Custom Fractile 2, and so on. 

![](online-assistant/26712.1.html)

Therefore, when you click the **OK** button to create your custom fractile option, the factor will automatically rank lower values better so that the lower percentiles are ranked better.

### Group

This option allows you to build a mapping table within Alpha Testing using the results of a factor formula. Select the "Group" option from the Fractiles Based On drop-down menu.  

|**Note**|Your grouped factor must return fewer than 501 unique values. For example, P\_PRICE(0) will most likely return unique values for each company, resulting in over 500 unique groups.|
|---|---|

If you are defining custom group fractiles for a factor that has not yet been fetched, Alpha Testing will evaluate the formula for all companies in the current screening universe. If the factor has already been fetched, then the formula will fetch the saved results across all periods in the model and then populate.

-   Fractile Condition shows the actual result of the factor formula.
-   Fractile Name is the name you give to the custom fractile. When mapping, you will map from fractile condition to the fractile name. By default, fractile value and fractile name will match.  For more information on editing the name, see the [Editing Custom Fractile Bins](https://my.apps.factset.com/oa/pages/21350#edit) section below.

Working with custom fractile groups:

-   Click the **Add New** button to add a fractile that does not populate in the Custom Fractile dialog. You should type in the Fractile Condition (or expected result of the underlying formula). 
-   Click the **Remove Group** button ![](online-assistant/26712.2.html) to remove a fractile or rename it to "@NA." Companies that fall into the removed fractile will be placed into the NA fractile.
-   Map multiple fractile conditions to the same fractile by changing the fractile names to be the same (remember that they are case sensitive). Once you have applied this change, the fractile values will be placed into a "Multiple" fractile. Using the example below, a custom fractile group is created using the FG\_GICS\_INDUSTRY factor formula.  The Aerospace & Defense, Air Freight & Logistics, and the Airlines industries are mapped to a single Aerospace custom fractile group and placed into a "MULTIPLE" fractile.
    
    ![](online-assistant/26712.3.html)
-   Drag and drop fractiles to reorder/move them.
    
    |**Note**|If you are moving a Multiple fractile value, it will move the entire group. The order of the fractiles within the group is fixed and cannot be changed.
    |---|---|
    Renaming a Multiple fractile name will automatically rename all the constituent fractile value names. Changing a constituent fractile value name will remove it from its current Multiple fractile value.|
    

[Top of Page](https://my.apps.factset.com/oa/pages/21350#top)

___

## Editing Custom Fractile Bins

When you have your Factor Values or Factor's Fractiles bins set, there are several ways to edit them. Begin by clicking any fractile.

|**Note**|The Conditional Operator selection cannot be edited.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21350#top)
