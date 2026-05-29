---
created: 2026-05-05T19:02:46 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21173
author: 
---

# Online Assistant : Creating Custom

> ## Excerpt
> Learn how to create factor models and enhance your own investment process by building a custom risk model.  The following details all relate to the Risk Model section of Edit Model Options and provide the key information towards setting up your custom risk models.

---
## Creating Custom Risk Models Page 21173

Learn how to create factor models and enhance your own investment process by building a custom risk model.  The following details all relate to the Risk Model section of Edit Model Options and provide the key information towards setting up your custom risk models. 

Topics covered:

-   [Understanding the Calculation Methodology for Custom Risk Models](https://my.apps.factset.com/oa/pages/21173#calculation)
-   [Selecting Factors and Transformation Options
    
    ](https://my.apps.factset.com/oa/pages/21173#custom_risk_settings)
    
    -   [Adding Factors](https://my.apps.factset.com/oa/pages/21173#adding)
    -   [Performing Stepwise Regressions](https://my.apps.factset.com/oa/pages/21173#step)
    -   [Applying Transformations](https://my.apps.factset.com/oa/pages/21173#transformations)
    -   [Including Principal Components Analysis Factors](https://my.apps.factset.com/oa/pages/21173#pca)
    -   [Managing Factors and Steps](https://my.apps.factset.com/oa/pages/21173#manage)
-   [Replacing NA Factor Exposures and Residual Risk Values](https://my.apps.factset.com/oa/pages/21173#nahandling)
-   [Selecting Calculation Settings](https://my.apps.factset.com/oa/pages/21173#calc_settings)
-   [Handling Time Series Data](https://my.apps.factset.com/oa/pages/21173#time_series)
-   [Setting Filters](https://my.apps.factset.com/oa/pages/21173#filters)

___

## Understanding the Calculation Methodology for Custom Risk Models

Alpha Testing creates the risk model by using:

-   cross-sectional multiple factor regression to calculate factor returns for multiple periods
-   pre-specified factor returns to calculate security exposures for each period
-   factors whose factor returns and exposures are fully specified
-   principal components analysis (PCA) to calculate statistical factors
-   a combination of each type in multiple steps

The factor returns over time are used to calculate the covariances between each factor and the residual risk for each security.

[Top of Page](https://my.apps.factset.com/oa/pages/21173#top)

___

## Selecting Factors and Transformation Options

Click the **Model Options** button in the application toolbar, and then select the Risk Models section in the left pane of Edit Models Options to specify the following settings.

### Adding Factors

Select the factors to include in your risk model by clicking the **Add** button.  You can add any factors that you have already included in the [Factors tab](https://my.apps.factset.com/oa/pages/pages/21240). 

![](online-assistant/26498.html)

Select the factors you want to include from the Available list and add them to the Selected list.  You can filter the list of factors by name or by type. You can remove previously selected factors from the Selected list from within the drop-down menu.

|**Note**|You must have [Factors](https://my.apps.factset.com/oa/pages/pages/21240) selected in order to further define settings in the Risk Model section. If the Factors grid is blank, select the Factors section in the left pane of Edit Model Options and add factors for your custom risk model before returning to the Risk Models section.|
|---|---|

Once you've added factors to the Factors grid, you can you can [add steps](https://my.apps.factset.com/oa/pages/21173#step), [apply transformations](https://my.apps.factset.com/oa/pages/21173#transformations), and [include PCA factors](https://my.apps.factset.com/oa/pages/21173#pca), and [manage the factors and steps](https://my.apps.factset.com/oa/pages/21173#manage) as detailed in the sections below.

### Performing Stepwise Regressions

You can choose to add steps for a stepwise regression both when adding factors from the Add menu button and from the Factors grid once they are already added. You always have at least one step in your custom risk model.

Stepwise regressions are calculated in the order specified.  It regresses security returns against one set of factors and, once completed, it regresses the residual from the prior regression against the next set of factors in the regression that follows.  

Select the factor that you want to start as the next step and click the **Add Step** button. This will separate the group of factors into multiple steps.

![](online-assistant/26498.1.html)

|**Note**|If you include beta, currency, exogeneous, [Principal Component Analysis](https://my.apps.factset.com/oa/pages/21173#pca), or dummy factors in your custom risk model, then they must be placed in their own steps as Alpha Testing requires that different factor types be placed separately. In other words, each step can only have either fully specified (no regression, e.g., beta, currency, and dummy factors), exogenous (time series regression), endogenous (cross-sectional regression) factors, or statistical (Principal Component Analysis) factors. 
|---|---|
If you add a new factor to the selected factors list that is not compatible with that step's factor type, then Alpha Testing displays an invalid error message:
![](online-assistant/26498.2.html)
If you want to regress your factors against local currency returns, then you can do so by using a non-local model currency. Place the currency factor in the first step, and your endogenous (or exogenous) factors in the second step. This converts the non-local currency returns to local currency returns as the residual from the first step of the regression. 
Adding steps is the only way to include multiple group factors in your custom risk model. Each group must be in a different step to avoid multicollinearity (perfectly correlated independent variables) between group factors.|

### Applying Transformations

Select a specific factor, and then choose from the available transformation options.  Options vary based on the factor you've selected:

|Z-Score|Transforms the factor data by subtracting the universe’s average value from each individual security's value and then dividing the result by the standard deviation of the universe values. This is the same as the [UZSCORE](https://my.apps.factset.com/oa/pages/pages/5834) function.  This is the default selection for non-grouped factors.|
|---|---|
|Weighted Z-Score|Transforms the factor data by subtracting the universe’s weighted average from each individual security's value and then dividing the result by the standard deviation of the universe values.|
|Log -> Z-Score|Transforms the factor data by taking the natural log of the factor data (the same as the [LN](https://my.apps.factset.com/oa/pages/pages/1543) function) and converting the result into a Z-score. Use this option for factors like market cap, where the distribution is skewed with the largest values having much higher results than most of the companies in the universe.|
|Actual Value|Performs no transformation on the factor data. Only choose this option if your factor data is already transformed to have a range of values that are comparable to the other transformed factors you chose for the model. Use this option when your factor data is already transformed, (e.g., already a Z-score or a Beta value, and you don’t want to re-transform the data).|
|Grouped|Creates one factor for each group (e.g., sector or country). The transformed factor data for each of these grouped factors is "0" or "1" for each security ("0" if that security is not in the group and "1" if it is). Each security has only one value of "1" for one of the group factors and a value of 0 for all of the other group factors created. You can select only one group factor per step in your risk model. This transformation option is only available for [group factors](https://my.apps.factset.com/oa/pages/pages/13573#six) and is the default and only available option for group factors. You can set Currency and Dummy factors as Grouped factors instead of Dummy/Beta Exposures, which is the default for both factor types.|
|Dummy/Beta Exposures|This option is only available if you have added a [Currency, Beta, or Dummy factor](https://my.apps.factset.com/oa/pages/pages/15678). This indicates that the Currency, Dummy, or Beta factor is fully specified. A fully specified factor uses an economic or top-down/time series return instead of a factor return calculated from the regression, and exposures for each security that are pre-specified ("dummy" exposures, e.g., "1" for each security's local currency and "0" for all other currencies, or beta exposures, which can be any number but usually numbers between "0" and "1").|

|**Note**|Selecting a transformation is not available for [exogenous factors'](https://my.apps.factset.com/oa/pages/pages/15678#exo) exposures or for Principal Component Analysis factors' exposures. This is because exogenous factors do not have directly observable (i.e., fetched) exposures; instead, they are calculated using [regression](https://my.apps.factset.com/oa/pages/pages/15678#regressed). Principal Component Analysis factors' exposures are eigenvectors that are calculated statistically.|
|---|---|

### Including Principal Components Analysis Factors

You can include statistical (i.e., blind) factors in your custom risk models that are calculated statistically using Principal Components Analysis (PCA) and are not attributable to any specific factor. Statistical Factors help to increase the model fit (adjusted r-squared) and systematic (factor) risk not covered by any pre-specified factors in the model. Statistical factors can be the only factors for a risk model or they can be added as the last step to a risk model that has other factor types.

You can choose to add PCA to your Selected factors both when adding factors from the Add menu button and from the Factors grid once they are already added.

![](online-assistant/26498.3.html)

After you add PCA, select it from the Factors grid and enter the Number of Statistical Factors to be calculated in the Options section. The statistical factors are called Statistical Factor 1, Statistical Factor 2, etc. in your custom risk model reports.

### Managing Factors and Steps

You can manage the factors and steps included in your custom risk model using the Factors grid in the following ways:

-   Delete factors or steps by clicking the **Delete** ![](online-assistant/26498.4.html) button next to the individual factor or step name
-   Click the **Clear All** button to remove all selected factors and steps
-   Rearrange factors and steps by dragging and dropping them in their desired location within the grid as shown below:
    
    ![](online-assistant/26498.5.html)
    

[Top of Page](https://my.apps.factset.com/oa/pages/21173#top)

___

## Replacing NA Factor Exposures and Residual Risk Values

For a security to be included in the risk model it must have a non-NA exposure for all factors and a non-NA residual risk.  A security could have an NA residual risk for several reasons: any factor exposure for any trailing period is NA causing the residual to be NA; the return for the security for any trailing period is NA causing the residual to be NA; or the security did not exist in the universe in one or more of the trailing periods.

Therefore, you have the following options for handling your NA results.

-   **Exclude**: You can exclude any security that has a NA value by selecting the Exclude option from either of the NA handling drop-down menus.
-   **Replace the NA value**: You can choose to replace the NA value with zero, a Period Average, Median, Maximum, or Minimum value, or with a Group Average, Median, Maximum, or Minimum value for the period. If you select any of the Group options, you can choose any of the group factors that are in your available factors list. 
    
    If you have chosen any [NA](https://my.apps.factset.com/oa/pages/pages/13573#na) or [outlier replacement](https://my.apps.factset.com/oa/pages/pages/13573#control) for any of your factors or [returns](https://my.apps.factset.com/oa/pages/pages/13595#na), then the replaced factor and return data is what gets transformed and used for the regression for the risk model calculation. In this case, you only need NA replacement for NA factor exposures if you have not replaced NA values in your model inputs. 
    

[Top of Page](https://my.apps.factset.com/oa/pages/21173#top)

___

## Selecting Calculation Settings

**Regression Type**

Use the Regression Type drop-down menu to select the type of regression that you want to use for calculating the factor returns for the risk model.

The following options are available:

-   Equal Weighted No Intercept: See the [multregnoint](https://my.apps.factset.com/oa/pages/pages/4493) function page to learn more about the underlying calculation when selecting this option.
-   Weighted No Intercept: See the [wmultregnoint](https://my.apps.factset.com/oa/pages/pages/4489) function page to learn more about the underlying calculation when selecting this option. If you choose weighted no intercept, then the weight used is the weight you specified for your model's [return source](https://my.apps.factset.com/oa/pages/pages/14026). This is the same no-intercept regression that you can choose for the [multiple factor regression report](https://my.apps.factset.com/oa/pages/pages/13802#types), except that results for the factor returns (e.g., factor slopes or betas) may not be the same due to the factor data transformations applied for the risk model. One reason why Alpha Testing uses no intercept regression is so that all group factors have a slope from the regression and [one group does not have to be excluded](https://my.apps.factset.com/oa/pages/pages/13802#interpreted). By having a market factor (exposure of "1" across all securities) as the first step in the regression, you can center the data around zero, thereby eliminating the intercept term in the regression equation.
    
    ![](online-assistant/26498.6.html)
    
    ![](online-assistant/26498.7.html)
    

**Return Horizon**

Use the Return Horizon drop-down menu to change the horizon. The list of available return horizons is set in the Returns section. To change the horizon to an option that is not currently listed, go to the Returns section and select the desired horizon. Go to the Risk Model section and select the new return horizon under Calculation Settings.

[Top of Page](https://my.apps.factset.com/oa/pages/21173#top)

___

## Handling Time Series Data

**Number of Periods for Variance Calculations**

Enter a value in the "Number of Periods for Variance Calculations" textbox or use the Up/Down arrows to select one. The number of trailing periods specify the total number of periods used in the risk model calculations. This determines the total number of stepped regressions that take place during risk model calculation, the total number of weights generated to calculate statistics such as the weighted factor return and the weighted squared residual return, and the number of period-specific risk model reports generated during model run.

For example, if the number of periods includes 60 dates and you enter "60" as the number, the first date where a risk model can be calculated is the 61<sup>st</sup> period. For a monthly risk model, the number of trailing periods should be roughly five times the predictive horizon, so if the predictive horizon is annual, the number of trailing periods must be about "60." The maximum number that you can select in this section is based on the Periods that you have selected in the Filters sub-section.

For a daily model, observations are not independent, you need more trailing periods, and you must enter at least 100 trailing periods.

|**Note**|The number of trailing periods must be greater than the number of factors in the model (where a group factor counts as one) for a risk model to be calculated.
|---|---|
The regression results for the current period are not used for calculating the risk model because they use forward returns which would not have been known as of the risk model date. This means that you can calculate a risk model for the most recent month end even though returns are NA. When you update the model the next month to re-fetch these [returns](https://my.apps.factset.com/oa/pages/pages/13869#horizons) then a regression can be calculated for that month and be used for the risk model calculated for the new most recent month end date.|

**Decay Factor**

Select a time period weighting for the factor co-variance and stock residual risk calculation from the Decay Factor drop-down menu. The decay factor specifies a particular method for generating the weights discussed in the [Number of Periods for Variance Calculations](https://my.apps.factset.com/oa/pages/21173#numperiods) section above.

In time series analysis, more recent periods are typically weighted more heavily than prior periods and you can implement different weighting schemes using different decay factors.  When a decay factor is selected, an array of length N is generated, where N is the number of trailing periods for the variance calculation and the contents of this array are determined by the functions described below.

The following options are available:

-   **Exponential**: This is the default weighting with a 0.94 base.  You can also select a 0.96 base or 0.98 base, as well as enter your own number between 0 and 1 in the Base input box. Exponential weights are calculated as `EW(t) = B^(t-1)` where B is the base value and t is the period number (the most recent, or first trailing period is "1," the second trailing period is "2," and the last trailing period is N, where N is the number of trailing periods selected).
-   **None:** This option equally weights all periods.
-   **Descending Fraction:** This option calculates weights as DF(t) = (N - t + 1) / N, where N is the number of trailing periods and t is the trailing period number.
-   **Linear**: This option calculates weights as LW(t) = 1/t, where t is the trailing period number.
-   **Custom**: This option lets you edit the values shown in each cell rather than using the existing predefined functions.

|**Note**|The weights shown in the dialog are not the actual weights for each factor. To get the actual weights, Alpha Testing normalizes the displayed weights so that you add "1" for all factors.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21173#top)

___

## Setting Filters

Select the Filters sub-section from the left pane to exclude selected factors or periods from your custom risk model.

[Top of Page](https://my.apps.factset.com/oa/pages/21173#top)
