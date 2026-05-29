---
created: 2026-05-05T19:19:58 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20668
author: 
---

# Online Assistant : Ranking and

> ## Excerpt
> Add a rank with Function Builder to analyze the performance of each security in your report. Bucket your data into any number of fractiles to increase the scope of your analysis.

---
## Ranking and Bucketing Data Page 20668

Add a rank with [Function Builder](https://my.apps.factset.com/oa/pages/pages/20695) to analyze the performance of each security in your report. Bucket your data into any number of fractiles to increase the scope of your analysis.  

Topics covered:

-   [Creating an Absolute Rank](https://my.apps.factset.com/oa/pages/20668#AbsoluteRank)
-   [Bucketing the Data Using Fractiles](https://my.apps.factset.com/oa/pages/20668#Bucketing)

___

## Creating an Absolute Rank

You can specify and adjust up to five different inputs when calculating a rank. Each applied input affects the way in which your function is calculated. The first input, Parameter, is always required. The four others – Universe, Group, Weight, and Ties – are optional.

These ranking functions can be used to perform many types of calculations, both simple and complex. Each has a default that lets you easily replicate simple functions, which normally require one or two arguments (i.e., UFTILE or UWFTILE). They also let you replicate complex functions that generally require more specificity.

-   **Universe** determines which securities are used to calculate your function. This input provides a list of commonly used universe options. The default universe is [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790), which is comprised of securities that have passed all of your universe limitations. These are identified in the application's Criteria pane. To learn more about the other universe options available, see [Setting Group, Weight, and Universe Statistics](https://my.apps.factset.com/oa/pages/pages/20664#UniverseOptions). 
    
    |**Note**|The RUNIVERSE function works similarly to the [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790) function; however, the SCREENUNIVERSE function does not consider the parameter limitation when calculating the universe. Therefore, the number of companies considered by RUNIVERSE will always be less than or equal to the number evaluated by SCREENUNIVERSE.
    |---|---|
    You can limit your screen with SCREENUNIVERSE, but not RUNIVERSE. For example, `UMGWFTILE((@SCREENUNIVERSE)=1,1,1,FF_SALES(ANN,0,RP,USD),"R",0.5)` is completely valid, while `UMGWFTILE((@RUNIVERSE)=1,1,1,FF_SALES(ANN,0,RP,USD),"R",0.5)` is not.
    To work around RUNIVERSE and limit your screen, move all of your desired limits to the [Criteria](https://my.apps.factset.com/oa/pages/pages/20802) pane, and then apply @SCREENUNIVERSE to each.|
    
-   **Group** adjusts the aggregation over which your function calculates. The Group search box is also type-ahead compatible. It accepts formulas or report groups, which are referenced using #P.GRLVL_n_. The default is "No Groups" (i.e., 1). 
-   **Weight** determines how much impact a security has on the statistical calculation. The search box is type-ahead compatible; it accepts any formulas. The default is "Not Weighted" (i.e., 1). 
-   **Ties** determines how tied securities are assigned to a rank. The default is "Mean Rank" (i.e., 0.5).

### Function and Calculation 

The ranking functions are calculated as follows: 

`UMGWFTILE(<UniverseInput)>,<GroupInput>,<WeightInput>,<ParamInput>,"R",<TieInput>)` 

The "R" is hardcoded to denote that this formula will return the rank of securities in your report. 

|**Note**|The Rank - Exclusive Universe function returns "N/A" for any universe constituents that for anything in the screen that falls outside of the specified universe. For example, if this rank uses the S&P 100 and the screen contains all securities of the S&P _500_, 400 securities will return "N/A."|
|---|---|

For more information on the ranking functions available, see [Rankings](https://my.apps.factset.com/oa/pages/pages/20665#Rankings). 

[Top of Page](https://my.apps.factset.com/oa/pages/20668#top)

___

## Bucketing the Data Using Fractiles 

You can specify and adjust up to six different inputs when calculating a bucket. Each applied input affects the way in which your function is calculated. The first input, Parameter, is always required. The five others – Buckets, Universe, Group, Weight, and Ties – are optional.

These bucketing functions can be used to perform many types of calculations, both simple and complex. Each has a default that lets you easily replicate simple functions, which normally require one or two arguments (i.e., UFTILE or UWFTILE). They also let you replicate complex functions that generally require more specificity.

-   **Buckets** adjusts the number of fractiles used to bucket the data.
-   **Universe** determines which securities are used to calculate your function. This input provides a list of commonly used universe options. The default universe is [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790), which is comprised of securities that have passed all of your universe limitations. These are identified in the application's Criteria pane. To learn more about the other universe options available, see [Setting Group, Weight, and Universe Statistics](https://my.apps.factset.com/oa/pages/pages/20664#UniverseOptions). 
    
    |**Note**|The RUNIVERSE function works similarly to the [SCREENUNIVERSE](https://my.apps.factset.com/oa/pages/pages/6790) function; however, the SCREENUNIVERSE function does not consider the parameter limitation when calculating the universe. Therefore, the number of companies considered by RUNIVERSE will always be less than or equal to the number evaluated by SCREENUNIVERSE.
    |---|---|
    You can limit your screen with SCREENUNIVERSE, but not RUNIVERSE. For example, `UMGWFTILE((@SCREENUNIVERSE)=1,1,1,FF_SALES(ANN,0,RP,USD),4,0.5)` is completely valid, while `UMGWFTILE((@RUNIVERSE)=1,1,1,FF_SALES(ANN,0,RP,USD),4,0.5)` is not.
    To work around RUNIVERSE and limit your screen, move all of your desired limits to the [Criteria](https://my.apps.factset.com/oa/pages/pages/20802) pane, and then apply @SCREENUNIVERSE to each.|
    
-   **Group** adjusts the aggregation over which your function calculates. The Group search box is also type-ahead compatible. It accepts formulas or report groups, which are referenced using #P.GRLVL_n_. The default is "No Groups" (i.e., 1). 
-   **Weight** determines how much impact a security has on the statistical calculation. The search box is type-ahead compatible; it accepts any formulas. The default is "Not Weighted" (i.e., 1). 
-   **Ties** determines how tied securities are assigned to a rank. The default is "Mean Rank" (i.e., 0.5).

### Function and Calculation

The bucketing functions are calculated as follows: 

`UMGWFTILE(<UniverseInput>,<GroupInput>,<WeightInput>,<ParamInput>,<BucketInput>,<TieInput>)` 

|**Note**|The Bucket - Fractile Percentile Ntile - Exclusive Universe function returns "N/A" for anything in the screen that falls outside of the specified universe. For example, if this rank uses the S&P 100 and the screen contains all securities of the S&P _500_, 400 securities will return "N/A."|
|---|---|

For more information on the bucketing functions available, see [Bucketings](https://my.apps.factset.com/oa/pages/pages/20665#Bucketings). 

[Top of Page](https://my.apps.factset.com/oa/pages/20668#top)
