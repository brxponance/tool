---
created: 2026-05-05T19:19:08 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21423
author: 
---

# Online Assistant : Defining an

> ## Excerpt
> With Account Screening, you can screen on attributes for accounts (ACCT) and account composites (ACTM). You can also save the accounts that pass the screen as an account composite.

---
With Account Screening, you can screen on attributes for [accounts (ACCT)](https://my.apps.factset.com/oa/pages/pages/14785) and [account composites (ACTM)](https://my.apps.factset.com/oa/pages/pages/21346). You can also save the accounts that pass the screen as an account composite. 

An account links a holdings and returns portfolio together so you can seamlessly analyze your portfolio between portfolio products such as [Portfolio Analysis](https://my.apps.factset.com/oa/pages/pages/17520) and [SPAR](https://my.apps.factset.com/oa/pages/pages/20779). Account composites combine two or more accounts to create a custom composite.

|**Note**|Access to Account Screening requires a subscription to the Universal Screening Web - Account Screening product. Contact your FactSet representative or [FactSet Support](https://my.apps.factset.com/oa/pages/pages/4129) for more information.|
|---|---|

Topics covered:

-   [Getting Started](https://my.apps.factset.com/oa/pages/21423#GettingStarted)
-   [Managing Universe Limitations](https://my.apps.factset.com/oa/pages/21423#Managing)
-   [Accessing Additional Information](https://my.apps.factset.com/oa/pages/21423#Accessing)

___

## Getting Started 

To get started, click the **Account** button located at the top of the application [Home](https://my.apps.factset.com/oa/pages/pages/20595#home) page.

You can choose from the following options in the Suggested Screens section: 

-   Click the **New Account Screen** ![](online-assistant/26819.html) button to create a blank report. All your accounts and account composites are included in the default universe. 
-   Click the **Starter Screen** button to get some basic result columns on the default account universe. 

[Top of Page](https://my.apps.factset.com/oa/pages/21423#top)

___

## Managing Universe Limitations 

When you open Account Screening, the default universe consists of all your accounts and account composites. Limiting your universe is the first step used to narrowing the list of accounts and account composites in your report. 

To limit your universe, start typing in the Add Criteria search box.

![](online-assistant/26819.1.html)

### Searching for Limits with Type Ahead 

Use the type-ahead search functionality to quickly find a criteria item or parameter. Enter all or part of it into the Add Criteria box to view a list of matches. Use your cursor or keyboard arrows to locate and select the desired item. 

Most limit types are automatically added to your criteria list when you select them. However, formula and function limits need to be converted. To do this, simply add an operator (e.g., equal to). For example, to limit to portfolios or custom benchmarks that are benched against the S&P 500:

1.  Select the formula from the search results.
    
     ![](online-assistant/26819.2.html)
    
2.  Add "`BENCH:SP50`" to the end of the formula.
    
    ![](online-assistant/26819.3.html)
    
3.  Press **ENTER**.
    
    ![](online-assistant/26819.4.html)
    

### Defining Limits with Formulas 

The following table lists the formulas you can use to define several universe limitations. Some examples are also provided. 

|**Formula**|**Formula Description**|
|---|---|
|PM\_H\_PORTFOLIO != ""|Includes accounts with holdings|
|(PM\_H\_PORTFOLIO == "" AND PM\_ISACTM == 0) = 1|Includes accounts without holdings and excludes account composites|
|PM\_R\_PRIMARY\_RET\_TYPE != "INVALID"|Includes accounts with returns|
|(PM\_R\_PRIMARY\_RET\_TYPE == "INVALID" AND PM\_ISACTM == 0) = 1|Includes accounts without holdings and excludes account composites|
|PM\_ISACTM == 1|Includes all account composites|
|PM\_GIPS\_COMPLIANT == 1|Includes all GIPS Composites|
|PM\_ISFIRM == "Y"|Includes all GIPS Firms|
|PM\_DIRECTORY="_<Full path to desired directory>_"|Includes a directory based on the specified directory path
   Example: `PM_DIRECTORY="CLIENT:/"`|
|PM\_DIRECTORY!="_<Full path to desired directory>_"|Excludes a directory based on the specified directory path  
   Example: `PM_DIRECTORY!="CLIENT:/"`|
|BEGINS\_WITH(PM\_DIRECTORY,"_<Full path to desired directory>_")|Includes the directory and respective sub-directories based on the specified directory
   Example: `BEGINS_WITH(PM_DIRECTORY,"CLIENT:/")`|
|DOES\_NOT\_BEGIN\_WITH(PM\_DIRECTORY,"_<Full path to desired directory to be excluded>_")=1|Excludes the directory and respective sub-directories based on the specified directory
   Example: `DOES_NOT_BEGIN_WITH(PM_DIRECTORY,"CLIENT:/")=1`|
|BEGINS\_WITH(PM\_SYMBOL,"_<Full path to desired account/account composite>_")|Includes the specified account or account composite
   Example: `BEGINS_WITH(PM_SYMBOL,"CLIENT:/123.ACCT")`|
|DOES\_NOT\_BEGIN\_WITH(PM\_SYMBOL,"_<Full path to desired account/account composite to be excluded>_")|Excludes the specified account or account composite
   Example: `DOES_NOT_BEGIN_WITH(PM_SYMBOL,"CLIENT:/123.ACCT")=1`|
|OR'ing BEGINS\_WITH|Includes the specified accounts or account composites
   Example: `(BEGINS_WITH(PM_SYMBOL,"CLIENT:/123.ACCT") OR BEGINS_WITH(PM_SYMBOL,"CLIENT:/ABC.ACTM"))=1`|
|AND'ing DOES\_NOT\_BEGIN\_WITH|Excludes the specified accounts and account composites 
   Example: `(DOES_NOT_BEGIN_WITH(PM_SYMBOL,"CLIENT:/123.ACCT") AND DOES_NOT_BEGIN_WITH(PM_SYMBOL,"CLIENT:/ABC.ACTM"))=1`|

[Top of Page](https://my.apps.factset.com/oa/pages/21423#top)

___

## Accessing Additional Information 

After defining your account universe criteria, use the following resources to continue working with your screen:

-   [Formatting and Analyzing Data](https://my.apps.factset.com/oa/pages/pages/20607) 
-   [Viewing Screen Results](https://my.apps.factset.com/oa/pages/pages/20608)
-   [Working with the Report Toolbar](https://my.apps.factset.com/oa/pages/pages/20610)

[Top of Page](https://my.apps.factset.com/oa/pages/21423#top)
