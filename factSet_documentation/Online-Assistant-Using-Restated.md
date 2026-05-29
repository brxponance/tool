---
created: 2026-05-05T19:05:23 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13752
author: 
---

# Online Assistant : Using Restated

> ## Excerpt
> When building your historical models, it is important to know which databases on FactSet restate their data. This page lists the most commonly used databases and explains if the database restates their data or not.

---
## Using Restated Data Page 13752

When building your historical models, it is important to know which databases on FactSet restate their data. This page lists the most commonly used databases and explains if the database restates their data or not.

Databases covered:

-   [Compustat](https://my.apps.factset.com/oa/pages/13752#cs)
-   [FactSet Fundamentals](https://my.apps.factset.com/oa/pages/13752#factsetfundamentals)
-   [Ford Equity Research](https://my.apps.factset.com/oa/pages/13752#ford)
-   [I/B/E/S](https://my.apps.factset.com/oa/pages/13752#ibes)
-   [Refinitiv Financials](https://my.apps.factset.com/oa/pages/13752#MG)
-   [Refinitiv Worldscope Fundamentals](https://my.apps.factset.com/oa/pages/13752#ws)

### When to Use Restated Data

As a general rule, you may find the following guidelines helpful in deciding if you need to use restated data.

-   **Money Managers** often are interested in non-restated historical data, because these numbers are being compared with the stock price _at a specific point in history._ If you're comparing a price to a financial item, you would typically _not_ use restated financial data because you wouldn't be using a restated price (i.e., since price is not restated).
-   **Investment Bankers** often analyze growth rates and relative valuations and using restated data is more meaningful in such calculations.

___

## Compustat

[Compustat](https://my.apps.factset.com/oa/pages/pages/274) restates its quarterly data. It does not restate its annual data, but does provide separate annual restated data items for key items.

**Compustat Quarterly Database**

When a company reports for a new quarter and at the same time reports different data than originally reported for the corresponding quarter of the prior year, that data for the corresponding quarter of the prior year is changed and said to be restated. These restatements can be due to such things as mergers, acquisitions, discontinued operations, and accounting changes. Sales is the most common item to be restated, but other Income Statement items (including EPS) can also be restated. Balance sheet and cash flow quarterly items are not restated.

|**Notes**|A restatement can affect up to two years (eight quarters) of prior data.|
|---|---|

**Compustat Annual Database**

Compustat does not restate its annual data. Restated data is available for key items from the balance sheet and income statement in the Compustat North America formula library.  All restated items include the \_SUMM suffix. For example, to access restated sales you would use [CSF\_SALES\_SUMM](https://my.apps.factset.com/oa/pages/DataItem.aspx?p=C&name=CSF_SALES_SUMM&node_id=D12585) instead of [CSF\_SALES](https://my.apps.factset.com/oa/pages/DataItem.aspx?p=C&name=CSF_SALES&node_id=D11516).

Annual restated data may affect up to 10 years (if company supplies a 10-year summary of restated information). If a company supplies a second restatement summary -- for example, for 5 years -- then all of the restated data prior to that gets replaced with "N/A" due to incompatibility.

Compustat often takes restated annual numbers from the 3 - 5 or 5 - 10 year summary in annual reports (10-K's) and prospectuses. If a company presents restated annual data, it may include only a few specific items (e.g., Sales, Assets, Working Capital, etc.) Any years not included in the summary will return "N/A" for restated data items.

If a company does not have _any_ restated annual data, then the regular data is slotted into the annual restated field for all 20 years of history. For example, the data item for Net Sales (CSF\_SALES) will be entered for data item Restated Net Sales (CSF\_SALES\_SUMM).

You can see the full list of restated annual formulas available from Compustat by going to Sidebar or Formula Lookup and limiting your results to Financial > Compustat > Compustat North America.  After selecting the Compustat North America library, search for "SUMM" to view all of the summary/restated annual formulas.

[Top of Page](https://my.apps.factset.com/oa/pages/13752#top)

___

## FactSet Fundamentals

[FactSet Fundamentals](https://my.apps.factset.com/oa/pages/pages/15087) captures restatements made in the year immediately following the year of the statement that needs to be adjusted. For example, a 2005 restatement of 2004 financials will be reflected in the data, however, a 2006 restatement of 2004 financials will not be reflected in the data.

FactSet Fundamentals restated data offers comprehensive coverage beginning in 2004 and encompasses the adoption of IFRS, Discontinued Operations, Spinoffs, De-Mergers, Mergers/Acquisitions, adoption of a new accounting policy related to specific items, and changes in account GAAP followed by the company, including any combination of these events and/or for other reasons. However, the data does not include material errors in the application of existing accounting standards or fraud, in which case the originally-reported data is amended instead.

[Top of Page](https://my.apps.factset.com/oa/pages/13752#top)

___

## Ford Equity Research Databases

[Ford Equity Research](https://my.apps.factset.com/oa/pages/pages/437) does not restate its data.

[Top of Page](https://my.apps.factset.com/oa/pages/13752#top)

___

## I/B/E/S

[I/B/E/S](https://my.apps.factset.com/oa/pages/pages/214) does not restate its data (not even in cases of spinoffs, accounting changes, etc.). The only changes I/B/E/S makes is to correct historical estimates/actuals.

[Top of Page](https://my.apps.factset.com/oa/pages/13752#top)

___

## Refinitiv Financials

[Refinitiv Financials](https://my.apps.factset.com/oa/pages/pages/435) restates specific annual and quarterly financial statement data. Refinitiv Financials provides a restatement date to indicate when the data was restated.

Refinitiv Financials restates financial statement data in cases of mergers and acquisitions, discontinued operations, extraordinary items, and/or accounting changes. In the case of a "pooling of interests" merger, Refinitiv Financials creates a new report for the newly formed entity.

[Top of Page](https://my.apps.factset.com/oa/pages/13752#top)

___

## Refinitiv Worldscope Fundamentals

[Refinitiv Worldscope Fundamentals](https://my.apps.factset.com/oa/pages/pages/279) captures restatements made in the year immediately following the year of the statement that needs to be adjusted. For example, a 2005 restatement of 2004 financials will be reflected in the data, however, a 2006 restatement of 2004 financials will not be reflected in the data.

Refinitiv Worldscope Fundamentals restated data offers comprehensive coverage beginning in 2004 and encompasses the adoption of IFRS, Discontinued Operations, Spinoffs, De-Mergers, Mergers/Acquisitions, adoption of a new accounting policy related to specific items, and changes in account GAAP followed by the company, including any combination of these events and/or for other reasons. However, the data does not include material errors in the application of existing accounting standards or fraud, in which case the originally-reported data is amended instead.

[Top of Page](https://my.apps.factset.com/oa/pages/13752#top)
