---
created: 2026-05-05T19:02:17 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21261
author: 
---

# Online Assistant : Multi

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Multi-Factor Rank Builder Page 21261

Launch it with FactSet Search: @AT4

While each individual factor may predict which securities will outperform their benchmark, a combination of factors may do even better. The Multi-Factor Rank (MFR) builder lets you create a weighted rank between a combination of components.

|**!**|To create an MFR, you first must create [factors](https://my.apps.factset.com/oa/pages/pages/21240).|
|---|---|

Topics covered:

-   [Building a Multi-Factor Rank](https://my.apps.factset.com/oa/pages/21261#build)
-   [Defining General Multi-Factor Rank Settings](https://my.apps.factset.com/oa/pages/21261#general)
-   [Adding/Editing Components](https://my.apps.factset.com/oa/pages/21261#add_edit_components)
-   [Defining Individual Component Settings](https://my.apps.factset.com/oa/pages/21261#component_factor_settings)
-   [Creating a Conditional (Grouped) Multi-Factor Rank](https://my.apps.factset.com/oa/pages/21261#create_component_groups)

___

## Building a Multi-Factor Rank

To build a multi-factor rank:

1.  Click the **Model Options** button in the application toolbar.
2.  Choose the Factors section in the left pane of the Edit Model Options page.
3.  Click the **Add** ![](online-assistant/26611.html) button and select "New Multi-Factor Rank" from the drop-down menu. 
    
    ![](online-assistant/26611.1.html) 
4.  A new MFR is added to the Factors list with a default name and the right pane populates with the MFR options, but the new MFR does not yet contain any components. To add components to the MFR, click the **Edit MFR Components** button in the right pane.
    
    ![](online-assistant/26611.2.html)
5.  Click the **Add Factors** button on the Edit MFR Options page to select the components of the MFR. Review [Adding/Editing Components](https://my.apps.factset.com/oa/pages/21261#add_edit_components) for more information on adding components.
    
    ![](online-assistant/26611.3.html) 
    
    |**Tip**|Click the **Add/Remove** ![](online-assistant/26611.4.html) button to adjust the columns shown in the table.|
    |---|---|
    
6.  Define the component settings using the options in the right pane. Review [Defining Individual Component Settings](https://my.apps.factset.com/oa/pages/21261#component_factor_settings) for more information.
7.  (Optional) Add component groups to create a conditional MFR. Review [Creating a Conditional (Grouped) MFR](https://my.apps.factset.com/oa/pages/21261#create_component_groups) for more information.
8.  Click **Done** in the top right corner to apply your changes and return to the Edit Model Options page.
9.  Define the MFR options in the right pane of the Edit Model Options page. Click the links below for details on the options in each section:
    
    -   [General](https://my.apps.factset.com/oa/pages/21261#general) 
    -   [Data Management](https://my.apps.factset.com/oa/pages/pages/21351#data_mgmt,)
    -   [Fractiling Options](https://my.apps.factset.com/oa/pages/pages/21351#fractiling_options)
10.  Click **Done** in the top right corner to save the MFR and exit the Edit Model Options page.

___

## Defining General Multi-Factor Rank Settings

This section describes the options in the General section of MFR settings. You can find these options within Edit Model Options > Factors > Options section for a selected MFR.

![](online-assistant/26611.5.html)

### Name

Enter a name for the MFR. The name cannot contain special characters. 

### Edit MFR Components

Click to add or edit components. Review [Adding/Editing Components](https://my.apps.factset.com/oa/pages/21261#add_edit_components) for more information.

### Formula Ranking Type

Choose how to enter component scores into the MFR Calculation. The options are:

|**Z-Score**|Transforms the factor data by subtracting the universe’s average value from each individual security's value and then dividing the result by the standard deviation of the universe values. This is the same as the [UZSCORE](https://my.apps.factset.com/oa/pages/pages/5834) function. This is the default selection for non-grouped factors.|
|---|---|
|**Percentile**|Fractile the component into 100 buckets and use the fractile value as the component score.|
|**Decile**|Fractile the component into 10 buckets and use the fractile value as the component score.|
|**Quintile**|Fractile the component into 5 buckets and use the fractile value as the component score.|
|**Quartile**|Fractile the component into 4 buckets and use the fractile value as the component score.|
|**N-tile**|Fractile the component into _n_ buckets and use the fractile value as the component score. Enter an integer in the Formula Ranking Fractiles field to set the number of fractiles.|
|**Absolute Rank**|Rank the component for all companies and use the rank value as the component score.|
|**Actual Value**|Use the underlying component value, with no manipulation, as the component score.|
|**Use Factor’s Fractiles**|Use the fractiles of the underlying components. The fractiles for the underlying components are set on the [Edit Model Options > Factors page](https://my.apps.factset.com/oa/pages/pages/21240#general). Use this option if you want to include both a layered and non-layered factor on the same formula in an MFR.|

### Rank Across Periods

Select this option to calculate fractiles or ranks on formula data for results for all periods. By default, fractiles and ranks are generated for individual periods and not across all periods.

### Normalize Component Weights

By default, Alpha Testing normalizes weights by taking each available component’s weight and dividing by the sum of the absolute values of the available component weights. Deselect the check box to use the component weights defined by the [Relative Ranking Weight](https://my.apps.factset.com/oa/pages/21261#relative_ranking_weight) option. 

### Fractiles

Select the number of fractiles you want applied to your multi-factor score. Multi-factor rankings are treated the same as component in Alpha Testing reports, where the multi-factor score is the same as a component's values. 

Each factor's assigned fractiles are independent and are not affected by the fractiling of other factors (e.g., if you choose to exclude [NA factor data](https://my.apps.factset.com/oa/pages/pages/13573#NA), then securities that are excluded for one factor and will not necessarily be excluded from others).  Fractiles are assigned to each security when you run the model and therefore cannot be changed by report options such as [filters](https://my.apps.factset.com/oa/pages/pages/13554#filtersection).

 You can select from the following options:

-   Select "Custom" to create custom fractile bins.  To learn more about the different options available when selecting this option, see [Managing Custom Fractile Bins](https://my.apps.factset.com/oa/pages/pages/21350)**.**
-   Select the "Group" option to have each unique result of your formula placed in a fractile group.
-   Select the number of fractiles in which to divide the universe of companies from the Fractiles drop-down menu.

[Be sure to use the correct fractile type](https://my.apps.factset.com/oa/pages/pages/21351#fractiling_type) for your selected factor.

### Lower Values Rank Better

If you've selected to fractile data, you can select the "Lower Values Rank Better" check box to assign securities with the lowest factor values to the first fractile. Use this option with valuation ratios, such as P/E or Price to Book, where lower values are generally assumed to be more favorable. For example, if you specify Price to Book as your ranking formula, by default securities with the largest Price to Book are assigned to the first fractile. However, if you select "Low Values Rank Better", securities with the smallest Price to Book are assigned to the first fractile. 

This setting will affect the Fractile option for [Outlier Handling](https://my.apps.factset.com/oa/pages/pages/21351#data_mgmt).

|**Note**|You cannot use the "Low Values Rank Better" option with grouped factors as grouped factors have no concept of "best" and "worst" fractile. A grouped factor only takes the result of a formula for each company and creates a group for each result.|
|---|---|

 

### Layer On 

(Optional) Select a factor from the Layer On drop-down menu to layer the fractiling of your multi-factor score. The selected factor should be not added as a component of the MFR. 

There are three ways to layer an MFR:

-   **Component Factor Scores**: Data is layered (e.g., by sector) and then Component Factor Scores are calculated for each data item within the layer. The resulting scores are placed in numerical order, independent of the layer affiliation, and fractiled accordingly. For example, using Z-Scores as the Formula Ranking Type, Layering On Sector, and Apply Layering To Component Factor Scores will calculate the Z-Score as follows: (observation – Sector Average)/Sector Standard Deviation
-   **Composite Scores**: Composite Scores are calculated for each data item in the universe with no special considerations. The resulting scores are then layered and fractiled accordingly.
-   **Both**: Data is layered (e.g., by sector) and then Component Factor Scores are calculated for each data item within the layer. The resulting scores are then layered and fractiled accordingly.

Review [Layering on a Factor](https://my.apps.factset.com/oa/pages/pages/21240#layer) for more information on layering.

[Top of Page](https://my.apps.factset.com/oa/pages/21261#top)

___

## Adding/Editing Components

Select/deselect MFR components on the Edit MFR Options page. You can access this page within Edit Model Options > Factors > Options section for a selected MFR > Edit MFR Components button.

To select/deselect factors:

1.  Click the **Add Factors** button. The selection dialog opens. The Available list represents all factors that can be added to the MFR. By default, all non-time series/risk factors will be available (Factors, Universe Formulas, MFRs). Note that this excludes Period Formulas, Dummy Factors, Currency Factors, Beta Factors, and Exogenous Factors.
    
    The Selected list represents the active factors that will be included in the MFR Score calculation. 
2.  To select a component, double-click a factor name from the Available list. Repeat this step until you've added all necessary factors to the Selected list. You can add each factor once.
    
    ![](online-assistant/26611.6.html)
    
    Alternatively, you can add a factor to the Selected list by clicking the right **Add arrow** ![](online-assistant/26611.7.html) button or dragging and dropping the factor into the Selected list. 
    
    Re-order a factor by highlighting it and clicking the **Up/Down** buttons. Changing the order will only impact the order that they are presented for this MFR.
    
3.  To deselect a component, double-click a factor name from the Selected list or highlight it and click the **left Remove arrow** button. To remove all components from the Selected list, click **Clear All**.
4.  Once you have selected all components, click outside of the selection dialog to close it. The active components are shown in the grid.
    
    |**Note**|By default, the components are combined with equal weights. However, there are several options to set custom weights in the right pane. Review [Define Individual Component Settings](https://my.apps.factset.com/oa/pages/21261#component_factor_settings) for more information.|
    |---|---|
    

[Top of Page](https://my.apps.factset.com/oa/pages/21261#top)

___

## Define Individual Component Settings

Define settings for the MFR components on the Edit MFR Options page.  You can find these options within Edit Model Options > Factors > Options section for a selected MFR > Edit MFR Components button > Options section for a selected component.

![](online-assistant/26611.8.html)  

|**Tip**|To define settings for multiple factors at the same time, hold the **CTRL** key while making your selections.
|---|---|
![](online-assistant/26611.9.html)|

### Relative Ranking Weight

Enter the weights for your selected component by choosing one of three options:

-   **Formula**: 
    
    Enter a relative ranking weight for your selected component using a static value or screening formula. When using a screening formula use VALUE functions or any function that takes an identifier as an argument. Click the **Edit** ![](online-assistant/26714.html) button to build the formula using [Formula Lookup](https://my.apps.factset.com/oa/pages/pages/20929) and define the data sources. You can enter a different weight formula/constant for each component.   
-   **OFDB**:
    
    Enter a relative ranking weight for your selected component using data from an OFDB. To use ranking weights from an OFDB:
    
    1.  Click the **Lookup ![](online-assistant/26714.1.html)**  button to choose an OFDB. 
    2.  Use the Field drop-down to pick the OFDB field from which the weight should be chosen.
    3.  To adjust your symbols, use the [Component Symbol Manager](https://my.apps.factset.com/oa/pages/pages/21356).
    4.  By default, Alpha Testing will generate #AFTn IDs for each MFR component, where _n_ represents the the order in which the component appears in the table.
    
    |**Tips**|Alpha Testing refetches OFDB weights on every model run for every component for every period.
    |---|---|
    When uploading, you should upload raw weights. Alpha Testing normalizes weights by taking each available component’s weight and dividing by the sum of the absolute values of the available component weights.
    Include at least one date in the OFDB file. If the first date in the OFDB is a date halfway through a model’s date range, then the MFR will only have values starting on that date.|
    
-   **Column**:
    
    Apply the result of a report column for the weights for your selected factor. To specify a column as your ranking weight:
    
    1.  In the Select Column list, find and select the column that should be used to determine the ranking weights of the selected component. 
    2.  In the Options list, modify the column’s return type and/or return horizon. These options are similar to the column options in [Editing Tile Options](https://my.apps.factset.com/oa/pages/pages/21348#returns). 
    3.  Expand the Column section in the right pane. Select "Summary" or "Period" data to use for your ranking weights.
        
        ![](online-assistant/26714.2.html) 
        
        -   **Summary**:
            
            The summary results from the Factors report are used for each selected factor.
        -   **Period**:
            
            The period results from the Periods report are used for each selected factor. To define which period results to use, use the Column Relative Date Range and Ranking Weight Rebalance drop-down menus. 

 

### Lower Values Rank Better

If you've selected to fractile data, you can select the "Lower Values Rank Better" check box to assign securities with the lowest factor values to the first fractile. Use this option with valuation ratios, such as P/E or Price to Book, where lower values are generally assumed to be more favorable. For example, if you specify Price to Book as your ranking formula, by default securities with the largest Price to Book are assigned to the first fractile. However, if you select "Low Values Rank Better", securities with the smallest Price to Book are assigned to the first fractile. 

This setting will affect the Fractile option for [Outlier Handling](https://my.apps.factset.com/oa/pages/pages/21351#data_mgmt).

|**Note**|You cannot use the "Low Values Rank Better" option with grouped factors as grouped factors have no concept of "best" and "worst" fractile. A grouped factor only takes the result of a formula for each company and creates a group for each result.|
|---|---|

### Data Management Options

For details on the Data Management options, review [Selecting Advanced Factor Options](https://my.apps.factset.com/oa/pages/pages/21351#data_mgmt).

[Top of Page](https://my.apps.factset.com/oa/pages/21261#top)

___

## Creating a Conditional (Grouped) Multi-Factor Rank 

Conditional MFRs let you create MFRs using different components for companies that meet different conditional groups. For example, you can create one MFR that uses different components based on a company’s Sector.

You can create a conditional MFR by adding groups to an MFR on the Edit MFR Options page. You can access this page within Edit Model Options > Factors > Options section for a selected MFR > Edit MFR Components button.

To add groups to an MFR:

1.  Click the **Add Group** button. The selection dialog opens. The Selected list represents the active MFR conditions (groups). You can add groups to the Selected list using a formula or by selecting a factor from the list of factors. 
    
    ![](online-assistant/26611.10.html) 
    
    -   **Formula**:
        
        Enter a screening formula into the text box. Click the **Edit** ![](online-assistant/26611.11.html) button to build the formula using [Formula Lookup](https://my.apps.factset.com/oa/pages/pages/20929). Click the **Add** button to add the formula to the Selected list.
        
        Groups are based on the resulting values from the formula calculated against the entire active list of available securities. This may result in too many or too few groups, since a model creates a different universe over time and the Group condition is only calculated for active securities.
    -   **Factors**:
        
        Presents a list of all model factors. Double-click the factor name to add it to the Selected list. The groups listed will be the fractiles of the selected factor. 
    
    |**Note**|Add two or more conditions to create more refined groupings. For example, grouping by Country then Sector would give you (Number of Countries \* Number of Sectors) groups.|
    |---|---|
    
2.  (Optional) Edit the groups in the Selected list.
    
    ![](online-assistant/26611.12.html) 
    
3.  Once you have chosen your Selected groups, click outside of the selection dialog to close it. Your selected components will be categorized by the selected groups, which you can expand and collapse. 
    
    If you have added two or more groups, use the drop-down menu to select the primary grouping.
    
    ![](online-assistant/26611.13.html)
    
    All selected components appear underneath each group. To activate a component for a group, select the corresponding  check box. By default, all components are activated. To deactivate a component, deselect the corresponding check box.
    
    |**Tip**|Select the "Only Show Enabled" check box to hide the deactivated components.|
    |---|---|
    

[Top of Page](https://my.apps.factset.com/oa/pages/21261#top)
