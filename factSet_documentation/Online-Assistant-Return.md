---
created: 2026-05-05T19:02:58 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/14025
author: 
---

# Online Assistant : Return

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Database-Specific Return Calculations Page 14025

Launch it with FactSet Search: @AT4

The return calculation that is used for the [return source you selected](https://my.apps.factset.com/oa/pages/pages/21416) is determined by [your selections](https://my.apps.factset.com/oa/pages/pages/21526) for the "Include Dividends" and Currency options in the Returns section, and whether your return rebalance frequency in the [Time Series](https://my.apps.factset.com/oa/pages/pages/21243#universe_frequency) section is monthly versus daily or weekly.

Alpha Testing uses the same currency conversion used by the Portfolio Analysis application to convert returns from the local currency to the foreign currency you specified for most default return sources. If a return source listed below has a foreign currency formula, then the currency conversion is performed instead by using the #CU substitution variable. If a return source has a USD formula listed, then that formula is used only for calculating returns when "US Dollar" is selected as your currency. Market capitalization and weight formulas are not converted to foreign currencies unless they use the #CU substitution variable.

When you use the [Identifier](https://my.apps.factset.com/oa/pages/pages/20848) option to specify your model's benchmark, Alpha Testing uses an index identifier return calculation for your benchmark (if one is listed for the return source that you selected). If your benchmark is specified by one of the other options, then your benchmark contains a universe of securities and the company return calculation listed for the return source is used.

The following [Custom Return Variables](https://my.apps.factset.com/oa/pages/pages/13697) and arguments are used in the database-specific default return calculations listed on this page:

-   **0** - Start date or every report date in your alpha testing model.
-   **#F** - End date or every forward return date for each report date in your model. Inserts a different date for each return horizon.
-   **0+#F** - Relative end date/relative forward return date for each report date in your model. Inserts each return horizon number into the #F formula argument instead of using an actual date.
-   **#FREQ** - Return frequency. Inserts each return horizon number into the #FREQ formula argument.
-   **#CU** - [ISO Currency Code](https://my.apps.factset.com/oa/pages/pages/1470). When #CU is used, currency is converted using the specific database (e.g., Refinitiv Worldscope Fundamentals) associated with the formula. For more information, see [Using the Currency Variable](https://my.apps.factset.com/oa/pages/pages/13697#CONVERT) (#CU).

The Returns section in the Model Options lets you specify the database(s) you want to use to calculate your model's returns. This page lists the calculations used for the default databases available.

Available databases you can select from to calculate returns:

-   [Compustat](https://my.apps.factset.com/oa/pages/14025#cs)
-   [STOXX Index Returns](https://my.apps.factset.com/oa/pages/14025#djstoxx)
-   [MSCI-Gross](https://my.apps.factset.com/oa/pages/14025#mscigross)
-   [MSCI-Net](https://my.apps.factset.com/oa/pages/14025#mscinet)
-   [FactSet Fundamentals](https://my.apps.factset.com/oa/pages/14025#fdsfund)
-   [FactSet Prices](https://my.apps.factset.com/oa/pages/14025#fds)
-   [FTSE Prices with FactSet Dividends](https://my.apps.factset.com/oa/pages/14025#ftse)
-   [Russell](https://my.apps.factset.com/oa/pages/14025#russ)
-   [S&P Emerging](https://my.apps.factset.com/oa/pages/14025#spemerg)
-   [Refinitiv Worldscope Fundamentals](https://my.apps.factset.com/oa/pages/14025#ws)
-   [S&P/ASX](https://my.apps.factset.com/oa/pages/14025#spasx)
-   [S&P Prices with FactSet Dividends](https://my.apps.factset.com/oa/pages/14025#sp_fds_div)
-   [S&P Citigroup Equity Indices](https://my.apps.factset.com/oa/pages/14025#spciti)

___

## Compustat

This section lists [Compustat](https://my.apps.factset.com/oa/pages/pages/1932) company and index identifier calculations.

|**Note**|The Compustat database return source is only available for monthly returns and should be used with month-end start and end dates and monthly return frequencies. The Compustat return source covers only the U.S. and Canadian markets.|
|---|---|

Dividends

Local Currency:

100\*((MP(#MF)+SUM#FREQ(ZAV(MDIV(#MF)))+SUM#FREQ(ZAV(MSDIV(#MF))))/MP(0)-1)

No Dividends

Local Currency:

((MP(#MF)/MP(0))-1)\*100

Weight and Market Capitalization Formulas

MP(0)\*MSHS(0)

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## STOXX Index Returns

This section lists [STOXX](https://my.apps.factset.com/oa/pages/pages/12399) index identifier calculations.

|**Notes**|The STOXX Index Returns source is only available for STOXX index identifiers (e.g., 183659) and you should only use it as a Benchmark return source when you specify your benchmark using the [identifier option](https://my.apps.factset.com/oa/pages/pages/20848).
|---|---|
You should only use the STOXX Index Returns source when you select the STOXX [calendar](https://my.apps.factset.com/oa/pages/pages/21243#time_series) for your model.
You must select the Euro as your model's [currency](https://my.apps.factset.com/oa/pages/pages/21526#currency) to use the foreign currency formulas listed below.|

Dividends, Monthly and Daily

Local Currency:

(STX\_TOTAL\_RET\_IDX(#F,LOC,CLOSE)/STX\_TOTAL\_RET\_IDX(0,LOC,CLOSE)-1)\*100

Foreign Currency:

(STX\_TOTAL\_RET\_IDX(#F,#CU,CLOSE)/STX\_TOTAL\_RET\_IDX(0,#CU,CLOSE)-1)\*100

USD:

(STX\_TOTAL\_RET\_IDX(#F,USD,CLOSE)/STX\_TOTAL\_RET\_IDX(0,USD,CLOSE)-1)\*100

No Dividends, Monthly and Daily

Local Currency:

(STX\_PRICE(#F,LOC,CLOSE)/STX\_PRICE(0,LOC,CLOSE)-1)\*100

Foreign Currency:

(STX\_PRICE(#F,#CU,CLOSE)/STX\_PRICE(0,#CU,CLOSE)-1)\*100

USD:

(STX\_PRICE(#F,USD,CLOSE)/STX\_PRICE(0,USD,CLOSE)-1)\*100

Weight and Market Capitalization Formulas

1

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## MSCI-Gross

This section lists [MSCI Gross](https://my.apps.factset.com/oa/pages/pages/12585) company calculations:

Dividends

Local Currency (Monthly):

100\*((((MSCI\_ADJ\_PRICE(#F)+@ZAV(MSCI\_DPS\_RCF(#F)\*(#FREQ/12.0)))/(MSCI\_ADJ\_PRICE(0))))-1)

Local Currency (Daily):

MSCI\_RETC(#F,0,LOC)

No Dividends

Local Currency (Monthly):

((MSCI\_PRICE(#F)/(MSCI\_PRICE(0)))-1)\*100

Local Currency (Daily):

100\*((MSCI\_PRICE\_FX(#F,LOC)/MSCI\_PRICE\_FX(0,LOC))-1)

|**Note**|The formulas listed above will produce unofficial MSCI returns. To get the official MSCI returns in Alpha Testing, you must select the "[Partial Period Returns for NAs (Limited History)](https://my.apps.factset.com/oa/pages/pages/21526#fs_msci)" option. Selecting this option will use Portfolio Analysis as the return calculation engine and use [MSCI's Return Calculation Methodology](https://my.apps.factset.com/oa/pages/pages/10429) for all dates. For forward returns starting after 31-Dec-2000, Portfolio Analysis uses the current period's accrued dividends as of the Ex-Date to calculate a compounded return. For forward returns earlier than 31-Dec-2000, dividends are calculated by taking 1/12 of the annual dividend yield number and not accruing dividends as of the dividend Ex-Dates. Only monthly returns are available for returns prior to 31-Dec-2000.
|---|---|
Therefore, if you use this option with a model that begins prior to 31-Dec-2000 and ends after that date, the return methodology will be different for the time periods before and after 31-Dec-2000. If you do not select the "Partial Period Return for NAs" option, Alpha Testing will only use the formulas listed above. Dividends will be calculated by taking 1/#FREQ of the annual dividend yield number, where #FREQ is the number of times the return horizon occurs in a year (e.g., Monthly = 12). Dividends are not accrued as of the Ex-Date and are spread out equally among each time period.
Company-level formulas will not produce official MSCI returns and are only supported within Alpha Testing. You can use these formulas in Universal Screening, but they will only verify the returns fetched from Alpha Testing.|

The following lists index identifier calculations for MSCI Gross:

Dividends

Local Currency (Monthly and Daily):

((MSCI\_PRICE\_GLOC\_OFCL(#F)/MSCI\_PRICE\_GLOC\_OFCL(0))-1.0)\*100.0

USD (Monthly and Daily):

((MSCI\_PRICE\_GUSD\_OFCL(#F)/MSCI\_PRICE\_GUSD\_OFCL(0))-1.0)\*100.0

Local Currency (Monthly, Unofficial Price Source):

((MSCI\_PRICE\_GLOC\_M(#F)/MSCI\_PRICE\_GLOC\_M(0))-1.0)\*100.0

USD (Monthly, Unofficial Price Source):

((MSCI\_PRICE\_GUSD\_M(#F)/MSCI\_PRICE\_GUSD\_M(0))-1.0)\*100.0

Local Currency (Daily, Unofficial Price Source):

((MSCI\_PRICE\_GLOC\_D(#F)/MSCI\_PRICE\_GLOC\_D(0))-1.0)\*100.0

USD (Daily, Unofficial Price Source):

((MSCI\_PRICE\_GUSD\_D(#F)/MSCI\_PRICE\_GUSD\_D(0))-1.0)\*100.0

|**Note**|You should only use the MSCI-Gross Unofficial return source with country identifiers when you use that country's calendar in Alpha Testing for dates prior to 30-June-2001. If the dates in your test go before and after 30-June-2001, then select both the unofficial and official sources for your benchmark return source.
|---|---|
For example, use the MSCI-Gross-Unofficial return source with the MSCI USA index identifier (i.e., 984000) with a model that's using the United States calendar. However, if your model uses the five-day [calendar](https://my.apps.factset.com/oa/pages/pages/21243#time_series), you can use the MSCI-Gross (Official) as your return source with any MSCI country index.
MSCI Regional index identifiers, such as MSCI Europe's identifier 990500, must be used with a five-day calendar when using either the official or unofficial return sources. If your model uses an MSCI index identifier, do not use the seven-day calendar for either the official or unofficial return sources.|

No Dividends (Monthly and Daily)

Local Currency:

(MSCI\_PRICE(#F)/MSCI\_PRICE(0))-1.0)\*100.0USD:

((MSCI\_PRICE\_USD(#F)/MSCI\_PRICE\_USD(0))-1.0)\*100.0

Weight/Market Capitalization Request Code:

MSCI\_MCAP(0,#CU,STD,N)

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## MSCI-Net

This section lists [MSCI-Net](https://my.apps.factset.com/oa/pages/pages/12585) company calculations:

Dividends

Local Currency (Monthly):

100\*((((MSCI\_ADJ\_PRICE(#F)+@ZAV(MSCI\_DPS\_RCF(#F)\*(#FREQ/12.0)))/(MSCI\_ADJ\_PRICE(0))))-1)

Local Currency (Daily):

MSCI\_RETC(#F,0,LOC)

|**Note**|The formulas listed above will produce unofficial MSCI returns. To get the official MSCI returns in Alpha Testing, you must select the "[Partial Period Returns for NAs (Limited History)](https://my.apps.factset.com/oa/pages/pages/21526#fs_msci)" option. Selecting this option will use Portfolio Analysis as the return calculation engine and use [MSCI's Return Calculation Methodology](https://my.apps.factset.com/oa/pages/pages/10429) for all dates. For forward returns starting after 31-Dec-2000, Portfolio Analysis uses the current period's accrued dividends as of the Ex-Date to calculate a compounded return. For forward returns earlier than 31-Dec-2000, dividends are calculated by taking 1/12 of the annual dividend yield number and not accruing dividends as of the dividend Ex-Dates. Only monthly returns are available for returns prior to 31-Dec-2000.
|---|---|
Therefore, if you use this option with a model that begins prior to 31-Dec-2000 and ends after that date, the return methodology will be different for the time periods before and after 31-Dec-2000. If you do not select the "Partial Period Return for NAs" option, Alpha Testing will only use the formulas listed above. Dividends will be calculated by taking 1/#FREQ of the annual dividend yield number, where #FREQ is the number of times the return horizon occurs in a year (e.g., Monthly = 12). Dividends are not accrued as of the Ex-Date and are spread out equally among each time period.
Company-level formulas will not produce official MSCI returns and are only supported within Alpha Testing. You can use these formulas in Universal Screening, but they will only verify the returns fetched from Alpha Testing.|

No Dividends

Local Currency:

((MSCI\_PRICE(#F)/(MSCI\_PRICE(0)))-1)\*100

Local Currency (Daily):

100\*((MSCI\_PRICE\_FX(#F,LOC)/MSCI\_PRICE\_FX(0,LOC))-1)

The following index identifier calculations are for MSCI Net:

Dividends

Local Currency (Monthly and Daily):

((MSCI\_PRICE\_NLOC\_OFCL(#F)/MSCI\_PRICE\_NLOC\_OFCL(0))-1.0)\*100.0

USD (Monthly and Daily):

((MSCI\_PRICE\_NUSD\_OFCL(#F)/MSCI\_PRICE\_NUSD\_OFCL(0))-1.0)\*100.0

Local Currency (Monthly, Unofficial Price Source):

((MSCI\_PRICE\_NLOC\_M(#F)/MSCI\_PRICE\_NLOC\_M(0))-1.0)\*100.0

USD (Monthly, Unofficial Price Source):

((MSCI\_PRICE\_NUSD\_M(#F)/MSCI\_PRICE\_NUSD\_M(0))-1.0)\*100.0

Local Currency (Daily, Unofficial Prices Source):

((MSCI\_PRICE\_NLOC\_D(#F)/MSCI\_PRICE\_NLOC\_D(0))-1.0)\*100.0

USD (Daily, Unofficial Prices Source):

((MSCI\_PRICE\_NUSD\_D(#F)/MSCI\_PRICE\_NUSD\_D(0))-1.0)\*100.0

|**Note**|You should use the MSCI-Net-Unofficial return source with country identifiers when you use that country's calendar in Alpha Testing for dates prior to 30-June-2001. If the dates in your test go before and after 30-June-2001, then select both the unofficial and official sources for your benchmark return source.
|---|---|
For example, use the MSCI-Net Unofficial return source with the MSCI USA index identifier (i.e., 984000) with a model that's using the United States calendar. However, if your model uses the five-day [calendar](https://my.apps.factset.com/oa/pages/pages/21243#time_series), you can use the MSCI-Net (Official) as your return source with any MSCI country index.
MSCI Regional index identifiers, such as MSCI Europe's identifier 990500, must be used with a five-day calendar when using either the official or unofficial return sources. If your model uses an MSCI index identifier, do not use the seven-day calendar for either the official or unofficial return sources.|

No Dividends (Monthly and Daily)

Local Currency:

((MSCI\_PRICE(#F)/MSCI\_PRICE(0))-1.0)\*100.0

USD:

((MSCI\_PRICE\_USD(#F)/MSCI\_PRICE\_USD(0))-1.0)\*100.0

Weight and Market Capitalization Formulas

MSCI\_MCAP(0,#CU,STD,N)

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## FactSet Fundamentals

This section lists [FactSet Fundamentals](https://my.apps.factset.com/oa/pages/pages/12878) company and index identifier calculations.

|**Note**|Because the FactSet Fundamentals database return source is only available for monthly returns, you should only use it with with month-end start and end dates, and monthly return frequencies.|
|---|---|

Dividends

Local Currency:

100\*((FM\_PRICE\_MONTHLY(#MF)+SUM#FREQ(FM\_QDIV(#MF)))/(FM\_PRICE\_MONTHLY(0))-1)

Foreign Currency:

100\*((FM\_PRICE\_MONTHLY(#MF,#CU)+SUM#FREQ(FM\_QDIV(#MF,#CU)))/(FM\_PRICE\_MONTHLY(0,#CU))-1)

No Dividends

Local Currency:

100\*((FM\_PRICE\_MONTHLY(#MF)-(@T1:=FM\_PRICE\_MONTHLY(0)))/(@T1))

Foreign Currency:

100\*((FM\_PRICE\_MONTHLY(#MF,#CU)-(@T1:=FM\_PRICE\_MONTHLY(#CU 0)))/(@T1))

Weight and Market Capitalization Formulas

FF\_MKT\_VAL(MON,0,RS,#CU)

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## FactSet Prices

This section lists [FactSet Prices](https://my.apps.factset.com/oa/pages/pages/573) company and index identifier calculations:

Dividends (Monthly or Daily)

Local Currency:

PRET(0 #F)

Sources: FactSet Prices - No Weight, - Compustat Weight, - WorldScope Weight, - MSCI Weight, - Reuters Weight

, and - FactSet Fundamentals Weight

|**Note**|If you select the "[Partial Period Returns for NAs (Limited History)](https://my.apps.factset.com/oa/pages/pages/21526#fs_msci)" option for any of the above return sources, Alpha Testing will use Portfolio Analysis as the return calculation engine and calculate compounded returns for all dates. Without this option selected, Alpha Testing calculates simple returns for all dates.|
|---|---|

PRETC(0 #F)

Source: FactSet Prices - Compounded Return

100\*((XP\_PRICE\_VWAP(#F)+PCUMDIVX(#F)-PCUMDIVX(0))/XP\_PRICE\_VWAP(0)-1)

Source: [FactSet Prices - VWAP](https://my.apps.factset.com/oa/pages/pages/13128)

No Dividends (Monthly or Daily)

Local Currency:

PCHG(0 #F)

Sources: All FactSet sources except VWAP

100\*(XP\_PRICE\_VWAP(#F)/XP\_PRICE\_VWAP(0)-1)

Source: FactSet Prices - VWAP

Weight and Market Capitalization Formulas

1

Sources: FactSet Prices - No Weight, - Compounded Return, and - VWAP

MP(0)\*MSHS(0)

Source: FactSet Prices - Compustat Weight

WQ\_MKT\_CAP(0,RS,#CU)

Source: FactSet Prices - Refinitiv Worldscope Fundamentals Weight

MSCI\_MCAP(0,#CU,STD,N)

Source: FactSet Prices - MSCI Weight

AVAIL(RGQ\_SHS\_OUT\_COM(0),RGA\_SHS\_OUT\_COM(0))\*P(#CU 0)

Source: FactSet Prices - Reuters Weight

FF\_MKT\_VAL(MON,0,RS,#CU)

Source: FactSet Prices – FactSet Fundamentals Weight

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## FTSE Prices with FactSet Dividends

This section lists [FTSE](https://my.apps.factset.com/oa/pages/pages/13259) company and index identifier calculations. Only company return calculations use dividends from FactSet.

|**Note**|When you specify your benchmark as a FTSE index identifier (e.g., 180555, 181097, I03180) using the [identifier option](https://my.apps.factset.com/oa/pages/pages/20848) and select the FTSE return source, you should select a five day [calendar](https://my.apps.factset.com/oa/pages/pages/21243#time_series) to get index returns on all dates.
|---|---|
Do not use the seven-day calendar with the FTSE Index Return source.|

Dividends

Index, Local Currency:

100\*(FTO\_TOTAL\_RET\_CURN(#F,LOC)/FTO\_TOTAL\_RET\_CURN(0,LOC)-1)

Index, Foreign Currency:

100\*(FTO\_TOTAL\_RET\_CURN(#F,#CU)/FTO\_TOTAL\_RET\_CURN(0,#CU)-1)

Company, Local Currency:

100\*((AVAIL(FTG\_PRICE(#F),FTSE\_PRICE(#F,LOC,SPLIT,CLOSE))+PCUMDIVX(#F)-PCUMDIVX(0))/AVAIL(FTG\_PRICE(0),FTSE\_PRICE(0,LOC,SPLIT,CLOSE))-1)

No Dividends

Index, Local Currency:

100\*(FTO\_PRICE\_IDX\_CURN(#F,PI,LOC)/FTO\_PRICE\_IDX\_CURN(0,PI,LOC)-1)

Index, Foreign Currency:

100\*(FTO\_PRICE\_IDX\_CURN(#F,PI,#CU)/FTO\_PRICE\_IDX\_CURN(0,PI,#CU)-1)

Company, Local Currency:

100\*(AVAIL(FTG\_PRICE(#F),FTSE\_PRICE(#F,LOC,SPLIT,CLOSE))/AVAIL(FTG\_PRICE(0),FTSE\_PRICE(0,LOC,SPLIT,CLOSE))-1)

Weight and Market Capitalization Formulas

AVAIL(FTG\_MCAP\_CURN(0,#CU),FTSE\_MCAP(0,#CU))

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## Russell

This section lists [Russell](https://my.apps.factset.com/oa/pages/pages/13512) index identifier calculations:

Dividends

Local Currency:

((RUSSELL\_INDEX\_DIVS(#F)/RUSSELL\_INDEX\_DIVS(0))-1)\*100

No Dividends

Local Currency:

((RUSSELL\_INDEX\_VALUE(#F)/RUSSELL\_INDEX\_VALUE(0))-1)\*100

Weight and Market Capitalization Formulas

1

|**Notes**|The above formulas are used to calculate monthly and daily returns.
|---|---|
The Russell return source only covers the US market.|

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## S&P Prices with FactSet Dividends

This section lists company return calculations for both the [S&P](https://my.apps.factset.com/oa/pages/pages/13542) (Gross) with FactSet Dividends and S&P (Net) with FactSet Dividends return sources.

|**Note**|The S&P Prices with FactSet Dividends return source covers only the U.S. market.|
|---|---|

Dividends

Local/USD Currency (Monthly or Daily):

100\*((SP\_PRICE(#F)+PCUMDIVX\_ORIG(#F)-PCUMDIVX\_ORIG(0))/SP\_PRICE(0)-1)

|**Note**|Dividends are calculated using the FactSet database since company-level dividends are not provided by the S&P Indices and Company database.|
|---|---|

No Dividends

Local/USD Currency (Monthly or Daily):

100\*(SP\_PRICE(#F)/SP\_PRICE(0)-1)

This section lists index identifier return calculations for the S&P (Gross) with FactSet Dividends and S&P (Net) with FactSet Dividends return sources. Index return calculations do not use dividends from FactSet.

Dividends

USD Currency, Gross (Monthly or Daily):

100\*(SP\_TOTAL\_RET\_IDX(#F,GROSS,USD)/SP\_TOTAL\_RET\_IDX(0,GROSS,USD)-1)

USD Currency, Net (Monthly or Daily):

100\*(SP\_TOTAL\_RET\_IDX(#F,NET,USD)/SP\_TOTAL\_RET\_IDX(0,NET,USD)-1)

Foreign Currency, Gross (Monthly or Daily):

100\*(SP\_TOTAL\_RET\_IDX(#F,GROSS,#CU)/SP\_TOTAL\_RET\_IDX(0,GROSS,#CU)-1)

Foreign Currency, Net (Monthly or Daily):

100\*(SP\_TOTAL\_RET\_IDX(#F,NET,#CU)/SP\_TOTAL\_RET\_IDX(0,NET,#CU)-1)

|**Note**|Foreign currencies covered for S&P Index returns only include EUR, JPY, CAD, and GBP.|
|---|---|

Local Currency, Gross (Monthly or Daily):

100\*(SP\_TOTAL\_RET\_IDX(#F,GROSS)/SP\_TOTAL\_RET\_IDX(0,GROSS)-1)

Local Currency, Net (Monthly or Daily):

100\*(SP\_TOTAL\_RET\_IDX(#F,NET)/SP\_TOTAL\_RET\_IDX(0,NET)-1)

No Dividends

Local/USD Currency (Monthly or Daily):

100\*(SP\_PRICE(#F)/SP\_PRICE(0)-1)

Weight and Market Capitalization Formulas

SP\_PRICE(0)\*SP\_SHARES(0)

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## S&P Emerging

This section lists [S&P Emerging](https://my.apps.factset.com/oa/pages/pages/13542) company calculations:

Dividends

Local Currency:

((SPE\_PRICE(#F)+ZAV(SUM#FREQ(SPE\_DIVPD\_R(#F))))/(SPE\_PRICE(0))-1)\*100

No Dividends

Local Currency:

100\*(SPE\_PRICE(#F)/(SPE\_PRICE(0))-1)

This section lists S&P Emerging index identifier calculations:

Dividends

Local Currency:

100\*AVAIL(((SPE\_PRICE(#F)+ZAV(SUM#FREQ(SPE\_DIVPD\_R(#F))))/SPE\_PRICE(0)-1),(SPE\_PRICE\_GLOC(#F)/SPE\_PRICE\_GLOC(0)-1))

No Dividends

Local Currency:

100\*(SPE\_PRICE(#F)/SPE\_PRICE(0)-1)

Weight and Market Capitalization Formulas

SPE\_MCAP\_USD(0)

|**Note**|The above formulas are used to calculate monthly and daily returns.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## Refinitiv Worldscope Fundamentals

This section lists [Refinitiv Worldscope Fundamentals](https://my.apps.factset.com/oa/pages/pages/279) company and index identifier calculations.

|**Note**|The Refinitiv Worldscope Fundamentals database return source is only available for monthly returns and should be used with month-end start and end dates and monthly return frequencies.|
|---|---|

Dividends

Local Currency:

100\*((WM\_PRICE\_MONTHLY(#MF)+SUM#FREQ(WM\_QDIV(#MF)))/(WM\_PRICE\_MONTHLY(0))-1)

Foreign Currency:

100\*((WM\_PRICE\_MONTHLY(#MF,#CU)+SUM#FREQ(WM\_QDIV(#MF,#CU)))/(WM\_PRICE\_MONTHLY(0,#CU))-1)

No Dividends

Local Currency:

100\*((WM\_PRICE\_MONTHLY(#MF)-(@T1:= WM\_PRICE\_MONTHLY(0)))/(@T1))

Foreign Currency:

100\*((WM\_PRICE\_MONTHLY(#MF,#CU)-(@T1:=WM\_PRICE\_MONTHLY(0,#CU)))/(@T1))

Weight and Market Capitalization Formulas

WQ\_MKT\_CAP(0,RS,#CU)

|**Note**|The Refinitiv Worldscope Fundamentals All Monthly database return source uses the same formulas as those used by the Refinitiv Worldscope Fundamentals database return source; however, for market capitalization Refinitiv Worldscope Fundamentals All Monthly uses the following formula:
|---|---|
WM\_MKT\_VAL\_COMP(0,#CU)
This formula is a monthly market value for the company. The market cap code for the Refinitiv Worldscope Fundamentals return source is a quarterly security market cap, i.e., the two results will be different on month-ends that aren't fiscal period end dates, and if the company has multiple share classes. To fetch a monthly security-level market cap from Refinitiv Worldscope Fundamentals, change the weight and market cap formula for your return source to
WM\_MKT\_VAL(0,#CU) by using the [Weights](https://my.apps.factset.com/oa/pages/pages/21416#weights) button.|

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## S&P/ASX

This return source is calculated using the [Portfolio Analysis pricing data](https://my.apps.factset.com/oa/pages/pages/17667).

|**Notes**|Use the S&P/ASX return source to calculate monthly and daily returns.
|---|---|
The S&P/ASX return source covers only the Australian market.|

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)

___

## S&P Citigroup Equity Indices

This section lists [S&P Citigroup Equity](https://my.apps.factset.com/oa/pages/pages/4040) company calculations:

No Dividends (Monthly or Daily)

Local Currency:

((SBE\_PRICE(#F,LOCAL)/(SBE\_PRICE(0,LOCAL)))-1)\*100

USD:

((SBE\_PRICE(#F,USD)/(SBE\_PRICE(0,USD)))-1)\*100

[Top of Page](https://my.apps.factset.com/oa/pages/14025#top)
