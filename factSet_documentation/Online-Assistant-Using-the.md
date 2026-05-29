---
created: 2026-05-05T19:21:00 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/17358
author: 
---

# Online Assistant : Using the

> ## Excerpt
> The Backtesting library provides a way to get started building backtesting reports in Universal Screening. The library includes several premade formulas with arguments selected based on a typical backtesting environment.

---
The Backtesting library provides a way to get started building backtesting reports in Universal Screening. The library includes several premade formulas with arguments selected based on a typical backtesting environment.

To access the Backtesting library in Universal Screening, click the **Lookup** button and select Sources > Quantitative > Backtesting Factor Library.    

The following page provides additional information on the formula arguments and examples to better understand what each formula is providing.

|**Note**|This library requires a subscription to Backtesting and either FactSet Estimates or FactSet Fundamentals. Contact your Quant Specialist or email [Quant\_Support@factset.com](mailto:quant_support@factset.com) for more information.|
|---|---|

### Topics covered:

Estimates:

-   [Analyst Buy/Sell Ratios (%): QAPPSE\_BUY\_SELL](https://my.apps.factset.com/oa/pages/17358#ABS)
-   [EPS Estimate Dispersion: QAPPSE\_DISPERSION](https://my.apps.factset.com/oa/pages/17358#EEED)
-   [EPS: QAPPSE\_EPS](https://my.apps.factset.com/oa/pages/17358#EPSE)
-   [EPS Estimate Revisions: QAPPSE\_EPS\_REVISIONS](https://my.apps.factset.com/oa/pages/17358#EEER)
-   [Analyst Upgrade/Downgrade (%): QAPPSE\_GRADE](https://my.apps.factset.com/oa/pages/17358#AUD)
-   [Estimated Growth (%) EPS, Three to Five Year EPS, Margin, Stable: QAPPSE\_GROWTH](https://my.apps.factset.com/oa/pages/17358#VRQ)
-   [Analyst Rating: QAPPSE\_RATING](https://my.apps.factset.com/oa/pages/17358#ARQR)
-   [Down or Up Revisions (%): QAPPSE\_REVISIONS](https://my.apps.factset.com/oa/pages/17358#EDUR)
-   [Standardized Unanticipated Earnings: QAPPSE\_SUE](https://my.apps.factset.com/oa/pages/17358#SUE)
-   [Valuation Ratios: QAPPSE\_VALUATION](https://my.apps.factset.com/oa/pages/17358#VRQV)

Functions:

-   [Correlation between Two DataSets: QAPPS\_CORREL](https://my.apps.factset.com/oa/pages/17358#correl)
-   [Kurtosis Measure of a Time-Series of Data: QAPPS\_KURTOSIS](https://my.apps.factset.com/oa/pages/17358#kurtosis)
-   [Inverse of Normal Distribution: QAPPS\_NORMSINV](https://my.apps.factset.com/oa/pages/17358#normsinv)
-   [Average Pairwise Correlation: QAPPS\_PAIRWISE\_AVG](https://my.apps.factset.com/oa/pages/17358#PAVG)
-   [Average Pairwise Correlation: QAPPS\_PAIRWISE\_MED](https://my.apps.factset.com/oa/pages/17358#MED)
-   [Linear Regression: QAPPS\_REGRESS](https://my.apps.factset.com/oa/pages/17358#lreg)
-   [Skewness Measure of a Time-Series of Data: QAPPS\_SKEWNESS](https://my.apps.factset.com/oa/pages/17358#FSKEW)

Fundamentals:

-   [Credit Ratios: QAPPSF\_CREDIT\_RATIO](https://my.apps.factset.com/oa/pages/17358#FCR)
-   [Annual Growth Rate (%): QAPPSF\_GROWTH](https://my.apps.factset.com/oa/pages/17358#FAGR)
-   [Margin Ratios (%): QAPPSF\_MARGIN](https://my.apps.factset.com/oa/pages/17358#FMR)
-   [Per Share Items: QAPPSF\_PER\_SHARE](https://my.apps.factset.com/oa/pages/17358#FPSI)
-   [Profitability Measure (%): QAPPSF\_PROFIT](https://my.apps.factset.com/oa/pages/17358#FPM)
-   [Turnover Ratios: QAPPSF\_TURNOVER](https://my.apps.factset.com/oa/pages/17358#FTR)
-   [Valuation Ratios: QAPPSF\_VALUATION](https://my.apps.factset.com/oa/pages/17358#FVR)
-   [Variability Factors: QAPPSF\_VARIABILITY](https://my.apps.factset.com/oa/pages/17358#FVF)

Prices:

-   [Company Beta: QAPPSP\_BETA](https://my.apps.factset.com/oa/pages/17358#PCB)
-   [MACD Oscillator: QAPPSP\_MACD](https://my.apps.factset.com/oa/pages/17358#PMACD)
-   [Maximum Drawdown: QAPPSP\_MAX\_DRAWDOWN](https://my.apps.factset.com/oa/pages/17358#PMD)
-   [Relative Strength Index: QAPPSP\_RSI](https://my.apps.factset.com/oa/pages/17358#PRSI)
-   [Ulcer Index: QAPPSP\_ULCER\_INDEX](https://my.apps.factset.com/oa/pages/17358#ulcer)

___

## Estimates - Analyst Buy/Sell Ratios (%): QAPPSE\_BUY\_SELL

**Arguments:** BUY, SELL

**Description:** The percentage of analysts that have given a BUY or SELL rating over the past 30 days. The value returned is equal to the number of analysts who have given either a BUY or a SELL rating over the past 30 days divided by the total number of ratings given over the past 30 days.

Examples:

-   BUY - Returns the percentage of analysts that gave a BUY rating over the past 30 days.
    
    100\*FE\_RATING(NEST,BUY,0,0,-1AM,,'ESTDATE=INPUT,RT=N') / FE\_RATING(NEST,TOTAL,0,0,-1AM,,'ESTDATE=INPUT,RT=N')
-   SELL - Returns the percentage of analysts that gave a SELL rating over the past 30 days.
    
    100\*FE\_RATING(NEST,SELL,0,0,-1AM,,'ESTDATE=INPUT,RT=N') / FE\_RATING(NEST,TOTAL,0,0,-1AM,,'ESTDATE=INPUT,RT=N')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - EPS Estimate Dispersion: QAPPSE\_DISPERSION

**Arguments:** ANNUAL, QUARTERLY, SEMI

**Description:** Returns the standard deviation of all EPS estimates for the unreported fiscal period given over the past 100 days divided by the absolute value of the mean EPS.

Examples:

-   ANNUAL – For companies that have at least 5 EPS estimates for the current unreported fiscal year, returns the standard deviation of all estimates given over 100 days divided by the absolute value of the mean EPS estimate:
    
    IF(FE\_ESTIMATE(EPS,NEST,ANNUAL,+1,0,'ACT=0,CURRENCY=LOCAL,ESTDATE=INPUT,RT=N')>=5, FE\_ESTIMATE(EPS,STDDEV,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / ABS(FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO')),NA)
-   SEMI - For companies that have at least 5 EPS estimates for the current unreported fiscal half-year, returns the standard deviation of all estimates given over 100 days divided by the absolute value of the mean EPS estimate:
    
    IF(FE\_ESTIMATE(EPS,NEST,SEMI,+1,0,'ACT=0,CURRENCY=LOCAL,ESTDATE=INPUT,RT=N')>=5, FE\_ESTIMATE(EPS,STDDEV,SEMI,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / ABS(FE\_ESTIMATE(EPS,MEAN,SEMI,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO')),NA)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - EPS: QAPPSE\_EPS

**Arguments:**

Statistic: HIGH, LOW, MEAN, MED, STDDEV, NEST

Report Basis: ANNUAL, QUARTERLY, SEMI

Fiscal Period: +1, +2, +3 (QUARTERLY only), +4 (QUARTERLY only)

Currency: LOCAL, ESTCUR, AUD, CAD, CHF, EUR, GBP, JPY,USD

**Description:** Returns the EPS estimate statistic as of the backtest date; based on the four possible period arguments using a 100-day window.

Examples:

-   HIGH FY1 LOCAL – Returns the HIGH EPS Estimate for FY1 in local currency using the default 100-day window.
    
    FE\_ESTIMATE(EPS,HIGH,ANNUAL,+1,0,'ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO')
-   HIGH FY1 USD – Returns the HIGH EPS Estimate for FY1 in USD currency using the default 100-day window.
    
    FE\_ESTIMATE(EPS,HIGH,ANNUAL,+1,0,'ESTDATE=INPUT,RT=N,CURRENCY=USD,FIXEDRATE=NO')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - EPS Estimate Revisions: QAPPSE\_EPS\_REVISIONS

**Arguments:** ANNUAL, QUARTERLY, SEMI

**Description:** Returns the mean EPS estimate divided by the average of the mean EPS estimates for each of the last 3 months.

Examples:

-   ANNUAL - Returns the FY1 estimate divided by the average of the last 3 monthly FY1 estimates:
    
    FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / AVG(FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,-1/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,-2/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'))
-   QUARTERLY - Returns the FQ1 estimate divided by the average of the last 3 monthly FQ1 estimates:
    
    FE\_ESTIMATE(EPS,MEAN,QUARTERLY,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / AVG(FE\_ESTIMATE(EPS,MEAN,QUARTERLY,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,QUARTERLY,+1,-1/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,QUARTERLY,+1,-2/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'))
-   SEMI - Returns the FH1 estimate divided by the average of the last 3 monthly FH1 estimates:
    
    FE\_ESTIMATE(EPS,MEAN,SEMI,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / AVG(FE\_ESTIMATE(EPS,MEAN,SEMI,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,SEMI,+1,-1/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,SEMI,+1,-2/0/0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO'))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - Analyst Upgrade/Downgrade (%): QAPPSE\_GRADE

**Arguments:** UP, DOWN

**Description:** Returns the percentage of analysts that have upgraded or downgraded their rating over the past 30 days. The value returned is equal to the number of analysts that have either upgraded or downgraded their rating in the past 30 days divided by the total number of analysts who have given a rating over the past 30 days.

Examples:

-   UP - Returns the percentage of analysts that have upgraded their rating over the past 30 days.
    
    100\*FE\_RATING(UP,NOTE,0,0,-1AM,,'ESTDATE=INPUT,RT=N') / FE\_RATING(NEST,TOTAL,0,0,-1AM,,'ESTDATE=INPUT,RT=N')
-   DOWN - Returns the percentage of analysts that have downgraded their rating over the past 30 days.
    
    100\*FE\_RATING(DOWN,NOTE,0,0,-1AM,,'ESTDATE=INPUT,RT=N') / FE\_RATING(NEST,TOTAL,0,0,-1AM,,'ESTDATE=INPUT,RT=N'))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - Estimated Growth (%) EPS, 3-5 Year EPS, Margin, Stable: QAPPSE\_GROWTH

**Arguments:**

Growth: EPS, LTG, STABLE, MARGIN

EPS Report Basis (EPS only): ANNUAL, QUARTERLY, SEMI

**Description:** The estimated EPS Growth Rate is calculated by dividing the unreported period's EPS estimate by the latest actual as of the backtest date; estimated EPS Growth Rate is calculated for Annual, Quarterly, or Semi-Annual periods. The estimated Long-Term Growth Rate is the annual EPS growth rate expected for the next three to five years. The Margin Growth Rate returns the estimated growth in a company's gross margin from the most recently reported fiscal year (using actuals) to the current unreported fiscal year (using estimates). The Stable Growth Rate is calculated by dividing the Estimated Long-Term EPS Growth Rate by the 5-Year Historical EPS Stability Ratio.

Examples:

-   MARGIN – Returns the estimated growth in a company's gross margin from the most recent reported fiscal year (using actuals) to the current unreported fiscal year (using estimates).
    
    100\*(FE\_VALUATION(GROSS\_MARGIN,MEAN,ANNUAL,+1,0,',ESTDATE=INPUT,RT=N,0,0,CURRENCY=LOCAL,FIXEDRATE=NO,') / (FE\_ACTUAL(ACTUAL,INC\_GROSS,ANNUAL,0,0,'RT=N')/FE\_ACTUAL(ACTUAL,SALES,ANNUAL,0,0,'RT=N')\*100)-1)
-   LTG – The estimated long-term EPS growth rate is the annual EPS growth rate that the company is expected to sustain over the next 3 to 5 years.
    
    FE\_ESTIMATE(EPS\_LTG,MEAN,ANNUAL,1,0,'CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N')
-   STABLE – Returns the mean estimate EPS long-term growth rate given over the past 100 days from the backtest date and divides it by the 5-Year Historical Earnings Stability Ratio.
    
    FE\_ESTIMATE(EPS\_LTG,MEAN,ANNUAL,1,0,'CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N') / FE\_EPS\_STABILITY\_5YR(0)
-   EPS, ANNUAL – Returns the estimated EPS growth rate by dividing the FY1 EPS estimate by the FY0 Actual EPS. We then subtract one from this quotient and multiply the difference by 100 to put it in percent form.
    
    100\*(FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL,FIXEDRATE=NO') / FE\_ACTUAL(ACTUAL,EPS,ANNUAL,0,0,'CURRENCY=LOCAL,FIXEDRATE=NO,RT=N')-1)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - Analyst Rating: QAPPSE\_RATING

**Arguments:** BEST, WORST, MED, STDDEV

**Description:** Returns the Best, Worst, Median, or Standard Deviation rating using all analyst ratings given over the past 100 days from the backtest date.

Examples:

-   BEST – Returns the best rating for a company as of the backtest date, using all ratings given over 100 days from the backtest date.
    
    FE\_RATING(BEST,NOTE,0,0,'ESTDATE=INPUT,RT=N')
-   WORST – Returns the worst rating for a company as of the backtest date, using all ratings given over 100 days from the backtest date.
    
    FE\_RATING(WORST,NOTE,0,0,'ESTDATE=INPUT,RT=N')
-   MED – Returns the median rating for a company as of the backtest date, using all ratings given over 100 days from the backtest date.
    
    FE\_RATING(MED,NOTE,0,0,'ESTDATE=INPUT,RT=N')
-   STDDEV – Returns the standard deviation of ratings for a company as of the backtest date, using all ratings given over 100 days from the backtest date.
    
    FE\_RATING(STDDEV,NOTE,0,0,'ESTDATE=INPUT,RT=N')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - Down or Up Revisions (%): QAPPSE\_REVISIONS

**Arguments:**

Type: DOWN, UP, UP\_DOWN

Report Basis: ANNUAL, QUARTERLY, SEMI

**Description:** Returns the percentage of analysts that have given an upward or downward EPS revision for the current unreported fiscal year over the past 30 days. The value returned is equal to the number of analysts who gave either an upward or a downward EPS revision over the past 30 days divided by the total number of analysts who gave an EPS estimate in the past 30 days.

Examples:

-   DOWN, ANNUAL - Returns the percentage of analysts that gave downward EPS revisions for FY1 over the past 30 days:
    
    100\*(FE\_ESTIMATE(EPS,DOWN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,AWIN=30') / FE\_ESTIMATE(EPS,NEST,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,WIN=30'))
-   UP, ANNUAL – Returns the percentage of analysts that gave upward EPS revisions for FY1 over the past 30 days:
    
    100\*(FE\_ESTIMATE(EPS,UP,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,AWIN=30') / FE\_ESTIMATE(EPS,NEST,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,WIN=30'))
-   UP\_DOWN, QUARTERLY – Takes the number of upward revisions given over the past 30 days and subtracts the number of downward revisions over the past 30 days. This difference is then divided by the total number of estimates given over the past 30 days. For FQ1:
    
    100\*(FE\_ESTIMATE(EPS,UP,QUARTERLY,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,AWIN=30') - FE\_ESTIMATE(EPS,DOWN,QUARTERLY,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,AWIN=30')) / FE\_ESTIMATE(EPS,NEST,QUARTERLY,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,WIN=30')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - Standardized Unanticipated Earnings: QAPPSE\_SUE

**Arguments:** ANNUAL, QUARTERLY, SEMI

**Description:** Standard Unanticipated Earnings is calculated as the EPS Surprise Amount divided by the Standard Deviation of EPS Estimates as of the latest reported fiscal period for the backtest date. Note: the Standard Deviation uses all EPS estimates given in the 100 days before earnings were announced.

Example:

-   ANNUAL – Returns the SUE for the most recently reported fiscal year as of the backtest date.
    
    FE\_SURPRISE(AMOUNT,EPS,MEAN,ANNUAL,0,0,'CURRENCY=LOCAL,FIXEDRATE=NO,RT=N,') / FE\_SURPRISE(BEFORE,EPS,STDDEV,ANNUAL,0,0,'CURRENCY=LOCAL,FIXEDRATE=NO,RT=N,')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Estimates - Valuation Ratios: QAPPSE\_VALUATION

**Arguments:**

Valuation Statistic: CFP, EP, WEP

Report Basis (CFP & EP only): ANNUAL, QUARTERLY, SEMI, NTMA

Decay Factor (WEP): 0.67, Type your own

**Description:** Returns the ratio of cash flow to price (CEP) or earnings to price (EP). Note: if the valuation statistic is set to WEP, the value returned is an exponentially-weighted average of earning to price.

Examples:

-   WEP, 0.67 - Returns the exponentially-weighted E/P using estimates for FY1, FY2, & FY3.
    
    EXPSMOOTH(0.67, FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL, FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,ANNUAL,+2,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL, FIXEDRATE=NO'), FE\_ESTIMATE(EPS,MEAN,ANNUAL,+3,0,'ACT=0,ESTDATE=INPUT,RT=N,CURRENCY=LOCAL, FIXEDRATE=NO')) / FE\_MARKET\_DATA(PRICE,0,'CURRENCY=LOCAL,FIXEDRATE=NO')
-   CFP, ANNUAL – Returns the FY1 predicted Cash Flow/Price using the current unreported fiscal year's cash flow estimate divided by the backtest date's price.
    
    FE\_ESTIMATE(CFPS,MEAN,ANNUAL,+1,0,'ACT=0,CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N') / FE\_MARKET\_DATA(PRICE,0,'CURRENCY=LOCAL,FIXEDRATE=NO')
-   CFP, QUARTERLY – Returns the FQ1 predicted Cash Flow/Price using the current unreported fiscal quarter's cash flow estimate divided by the backtest date's price.
    
    FE\_ESTIMATE(CFPS,MEAN,QUARTERLY,+1,0,'ACT=0,CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N') / FE\_MARKET\_DATA(PRICE,0,'CURRENCY=LOCAL,FIXEDRATE=NO')
-   EP, ANNUAL – Returns the FY1 predicted E/P using the current unreported fiscal year's EPS estimate divided by the backtest date's price.
    
    FE\_ESTIMATE(EPS,MEAN,ANNUAL,+1,0,'ACT=0,CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N') / FE\_MARKET\_DATA(PRICE,0,'CURRENCY=LOCAL,FIXEDRATE=NO')
-   EP, QUARTERLY – Returns the FQ1 predicted E/P using the current unreported fiscal quarter's EPS estimate divided by the backtest date's price.
    
    FE\_ESTIMATE(EPS,MEAN,QUARTERLY,+1,0,'ACT=0,CURRENCY=LOCAL,FIXEDRATE=NO,ESTDATE=INPUT,RT=N') / FE\_MARKET\_DATA(PRICE,0,'CURRENCY=LOCAL,FIXEDRATE=NO')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Correlation between Two Datasets: QAPPS\_CORREL

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe.

Independent Variable: Any screening formula.

Dependent Variable: Any screening formula.

Correlation Type: Pearson ("PEARSON"), Spearman ("SPEARMAN"), Kendall ("KENDALL")

Correlation Result: Correlation Coefficient ("COEFF"), Test Statistic ("TEST")

**Description:** Returns the cross-sectional correlation coefficient for two datasets. Note: when in Screening, use the native formula [CORREL()](https://my.apps.factset.com/oa/pages/pages/1588) to return the Pearson correlation.

Example:

-   Return the Pearson correlation between the monthly returns and net income of the top thirty companies on the Dow.
    
    QAPPS\_CORREL(ISON\_DOW,P\_TOTAL\_RETURN(6/31/2013,7/31/2013),FF\_NET\_INC(LTM,0 L45D,RP,USD)/AVG2(FF\_COM\_EQ(QTR,0,RP,USD)), '0')

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Kurtosis Measure of a Time-Series of Data: QAPPS\_KURTOSIS

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe.

Data Item: Any screening formula. To create a timeseries using the frequency of the database, wrap the formula in ARRAYn(). To create a timeseries using [custom iteration](https://my.apps.factset.com/oa/pages/pages/17017#custom), wrap the formula in ARRAY(#DT).

**Description:** Returns Pearson's moment coefficient of kurtosis. Note: NA data is ignored during calculation. If a company only has NA data, NA will be returned.

Example:

-   Calculate the kurtosis, as measured by Pearson's moment coefficient of kurtosis, for the past 60 days' daily returns for each company in the Russell 1000 Index.
    
    QAPPS\_KURTOSIS(ISON\_RUSSELL\_IDX, ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Inverse of Normal Distribution: QAPPS\_NORMSINV

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe.

Probability: Enter a value between 0 and 1 (exclusive) or enter a screening function.

**Description:** Returns the test statistic, X, for which the cumulative normal distribution function is less than or equal to the Probability argument.

Example:

-   Return the test statistic that will be greater than 90.879% of the standard normal random variables (i.e., 90.879% of the standard normal random variables will be less than what statistic?).
    
    QAPPS\_NORMSINV(RUNIVERSE,90.879)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Average Pairwise Correlation: QAPPS\_PAIRWISE\_AVG

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe

Data Item: Any screening formula. To create a timeseries using the frequency of the database, wrap the formula in ARRAYn(). To create a timeseries using [custom iteration](https://my.apps.factset.com/oa/pages/pages/17017#custom) , wrap the formula in ARRAY(#DT).

Result Type: "UNIV", "COMP"

**Description:** Returns the average pairwise correlation between all pairs of data in a dataset.

Examples:

-   ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D)), "UNIV" - For each company in the S&P 100 Index, fetch the most recent 60 days' worth of daily returns. Calculate each company pair's correlation of the available returns. Only complete pairwise observations will be used. The "UNIV" argument means that all of the pairwise correlations will be averaged to return one value. The average pairwise correlation for the universe is the average of all correlations above or below the diagonal of the correlation matrix. It does not use the diagonal and does not double-count the correlations.
    
    QAPPS\_PAIRWISE\_AVG(ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D),"UNIV")
-   ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D)), "COMP" - For each company in the S&P 100 Index, fetch the most recent 60 days' worth of daily returns. Calculate each company pair's correlation of the available returns. Only complete pairwise observations will be used. The "COMP" argument means that each company's column in the correlation matrix will be averaged, ignoring the diagonal. Each company may have different values.
    
    QAPPS\_PAIRWISE\_AVG(ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D),"COMP")

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Median Pairwise Correlation: QAPPS\_PAIRWISE\_MED

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe.

Data Item: Any screening formula. To create a timeseries using the frequency of the database, wrap the formula in ARRAYn(). To create a timeseries using [custom iteration](https://my.apps.factset.com/oa/pages/pages/17017#custom) , wrap the formula in ARRAY(#DT).

Result Type: "UNIV", "COMP"

**Description:** Returns the median pairwise correlation between all pairs of data in a dataset.

Examples:

-   ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D)), "UNIV" - For each company in the S&P 100 Index, fetch the most recent 60 days worth of daily returns. Calculate each company pair's correlation of the available returns. Only complete pairwise observations will be used. The "UNIV" argument means that the median will be calculated using all of the pairwise correlations. The result will be one value for the entire universe. The median pairwise correlation for the universe is the median of all correlations above or below the diagonal of the correlation matrix. It does not use the diagonal and does not double-count the correlations.
    
    QAPPS\_PAIRWISE\_MED(ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D),"UNIV")
-   ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D)), "COMP" - For each company in the S&P 100 Index, fetch the most recent 60 days worth of daily returns. Calculate each company pair's correlation of the available returns. Only complete pairwise observations will be used. The "COMP" argument means that each company's column in the correlation matrix will be used to determine the median, ignoring the diagonal. Each company may have different values.
    
    QAPPS\_PAIRWISE\_MED(ISON\_SP\_US\_INDEX(0,100,CLOSE), ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D),"COMP")

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Linear Regression: QAPPS\_REGRESS

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe.

Independent Variable: Any screening formula.

Dependent Variable: Any screening formula.

Stat Type: Coefficient ("COEFF"), Test Statistic ("TEST"), Residual ("RESIDUAL")

Coefficient: Intercept ("INTERCEPT"), Slope Coefficient ("X1")

**Description:** Runs a linear regression between one independent variable, X, and one dependent variable, Y. The regression syntax is as follows: QAPPS\_REGRESS(universe,independent (X),dependent (Y),statistic,coefficient).

Examples:

-   Returns the intercept coefficient calculated when regressing returns on Book to Price. Uses securities on the S&P 500.
    
    QAPPS\_REGRESS(ISON\_SP\_US\_INDEX(0,500,CLOSE), FF\_PBK(ANN\_R,0), P\_TOTAL\_RETURN(0,-1), "COEFF", "INTERCEPT")
-   Returns the slope coefficient calculated when regressing returns on Sales. Uses securities on the S&P 500.
    
    QAPPS\_REGRESS(ISON\_SP\_US\_INDEX(0,500,CLOSE), FF\_SALES(ANN\_R,0), P\_TOTAL\_RETURN(0,-1), "COEFF", "X1")
-   Returns the residuals calculated when regressing returns on Annual Growth. Uses securities on the S&P 500.
    
    QAPPS\_REGRESS(ISON\_SP\_US\_INDEX(0,500,CLOSE), QAPPSE\_GROWTH(EPS,ANNUAL), P\_TOTAL\_RETURN(0,-1), "RESIDUALS")

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Functions - Skewness Measure of a Time-Series of Data: QAPPS\_SKEWNESS

**Arguments:**

Universe: Enter any universe formula that returns a 1 for a company passing the universe.

Formula: Any screening formula. To create a timeseries using the frequency of the database, wrap the formula in ARRAYn(). To create a timeseries using [custom iteration](https://my.apps.factset.com/oa/pages/pages/17017#custom) , wrap the formula in ARRAY(#DT).

**Description:** Returns Pearson's moment coefficient of skewness. Note: NA data is ignored during calculation. If a company only has NA data, NA will be returned.

Example:

-   Calculate the skewness, as measured by Pearson's moment coefficient of skewness, for the past 60 days' daily returns for each company in the Russell 1000 Index.
    
    QAPPS\_SKEWNESS(ISON\_RUSSELL\_IDX, ARRAY(P\_TOTAL\_RETURN(#DT,#DT-1D),0D,-59D,D))
    
    |**Note**|The formula for calculating Pearson's moment coefficient of skewness is
    |---|---|
    ![](online-assistant/24402.html)|
    

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Credit Ratios: QAPPSF\_CREDIT\_RATIO

**Arguments:**

Credit Ratio: CapEx / Assets (CAPEXA), CF Coverage (CFC), CFO Ratio (CFO), Cash Ratio (CASH), Current Ratio (CURR), Debt to Capital (DBTCAP), Debt / Common Eq (DCEQ), Debt / Equity (DEQ), Financial Leverage Ratio (FINLEV), Interest Coverage (INTCOV), Quick Ratio (QR)

Report Basis Period: Annual (ANN), Quarterly (QTR), Semi-Annual (SEMI), Last Twelve Months (LTM)

Lagging Period: 90 Days (L90D), 60 Days (L60D), 45 Days (L45D), No Lag, LTM Preset (LTM only)

**Description:** Returns the ratio specified in the first argument. For ratios that combine either Income or Cash Flow Statement items with Balance Sheet items, an average of the balance sheet item is taken. If the report basis is set to Annual, Quarterly, or Semi-annual, an average of the last two reported periods is taken. If the report basis is set to Last Twelve Months, the formula takes the average of two values: either the value reported last quarter and the value reported four quarters ago OR the value reported in the last semi-annual period and the value reported two semi-annual periods ago.

Examples:

-   CFC, ANN, L90D – Returns Cash Flow coverage ratio for the latest reported annual period from the backtest date, lagged 90 days.
    
    (FF\_OPER\_CF(ANN,0 L90D) + ZAV(FF\_INT\_EXP\_NET(ANN,0 L90D))) / ZAV(FF\_INT\_EXP\_NET(ANN,0 L90D))
-   CFO, ANN, L90D – Returns Cash Flow from Operations ratio for the last reported annual period as of the backtest date, lagged 90 days.
    
    FF\_OPER\_CF(ANN,0 L90D) / AVG2(FF\_LIABS\_CURR(ANN,0 L90D))
-   CASH, ANN, L90D – Returns Cash ratio for the latest reported annual period from the backtest date, lagged 90 days.
    
    FF\_CASH\_ST(ANN,0 L90D) / FF\_LIABS\_CURR(ANN,0 L90D)
-   CURR, QTR, L45D – Returns Current ratio for the latest reported quarter from the backtest date, lagged 45 days.
    
    FF\_ASSETS\_CURR(QTR,0 L45D) / FF\_LIABS\_CURR(QTR,0 L45D)
-   DCEQ, QTR, L45D – Returns Debt to Common Equity ratio for the last reported quarter from the backtest date, lagged 45 days.
    
    FF\_DEBT(QTR,0 L45D) / FF\_COM\_EQ(QTR,0 L45D)
-   DEQ, QTR, L45D – Returns Debt to Equity ratio for the last reported quarter as of the backtest date, lagged 45 days.
    
    FF\_DEBT(QTR,0 L45D) / FF\_SHLDRS\_EQ(QTR,0 L45D)
-   FINLEV, SEMI, L60D – Returns Financial Leverage ratio for the last reported half year as of the backtest date, lagged 60 days.
    
    FF\_ASSETS(SEMI,0 L60D) / FF\_COM\_EQ(SEMI,0 L60D)
-   QR, SEMI, L60D – Returns Quick ratio for the latest reported half year from the backtest date, lagged 60 days.
    
    (FF\_CASH\_ST(SEMI,0 L60D) + ZAV(FF\_RECEIV\_GROSS(SEMI,0 L60D))) / FF\_LIABS\_CURR(SEMI,0 L60D)
-   DBTCAP, SEMI, L60D – Returns Total Debt ratio for the last reported half year as of the backtest date, lagged 60 days.
    
    FF\_DEBT(SEMI,0 L60D) / FF\_TCAP(SEMI,0 L60D)
-   CAPEXA, LTM – Returns CapEx to Assets ratio for the latest reported quarter or half year from the backtest date, lagged 45 or 60 days. There is no argument for lags with the LTM designation.
    
    AVAIL(FF\_CAPEX(LTM,0 L45D),FF\_CAPEX(LTM\_SEMI,0 L60D)) / AVAIL(AVG(FF\_ASSETS(QTR,0 L45D),FF\_ASSETS(QTR,-4 L45D)),AVG(FF\_ASSETS(SEMI,0 L60D),FF\_ASSETS(SEMI,-2 L60D)))
-   INTCOV, LTM – Returns Interest Coverage ratio for the latest reported quarter or half year from the backtest date, lagged 45 or 60 days. There is no argument for lags with the LTM designation.
    
    AVAIL(FF\_EBIT\_OPER(LTM,0 L45D),FF\_EBIT\_OPER(LTM\_SEMI,0 L60D)) / AVAIL(FF\_INT\_EXP\_NET(LTM,0 L45D),FF\_INT\_EXP\_NET(LTM\_SEMI,0 L60D))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Annual Growth Rate (%): QAPPSF\_GROWTH

**Arguments:**

Growth Statistic: DPS (DPS), EPS (EPS), Div Payout Ratio (PAYOUT), Sales (SALES)

Growth Period: 1 Year (1), 5 Year (5)

Lag Data: 90 Days (L90D), No Lag

**Description:** Returns the annual growth rate over a 1- or 5-year period for the data item selected.

Examples:

-   DPS,1, L90D – Returns the DPS growth rate over a 1-year period.
    
    RATE1(FF\_DPS(ANN, 0 L90D))
-   DPS, 5, L90D - Returns the DPS growth rate over a 5-year period.
    
    RATE5(FF\_DPS(ANN, 0 L90D))
-   EPS,1, L90D – Returns the EPS growth rate over a 1-year period.
    
    RATE1(FF\_EPS(ANN, 0 L90D))
-   EPS, 5, L90D - Returns the EPS growth rate over a 5-year period.
    
    RATE5(FF\_EPS(ANN, 0 L90D))
-   PAYOUT, 1, L90D - Returns the Div Payout Ratio growth rate over a 1-year period.
    
    RATE1(FF\_PAY\_OUT\_RATIO(ANN, 0 L90D))
-   PAYOUT, 5, L90D - Returns the Div Payout Ratio growth rate over a 5-year period.
    
    RATE5(FF\_PAY\_OUT\_RATIO(ANN, 0 L90D))
-   SALES, 5, L90D - Returns the exponentially smoothed sales growth rate over 5 years.
    
    EXPSMOOTH5(0.8,FF\_SALES\_GR(ANN, 0 L90D))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Margin Ratios (%): QAPPSF\_MARGIN

**Arguments:**

Margin: Gross Profit Margin (GROSS), Loan Loss Provision Margin (LLPM), Net Interest Margin (NETINT), Net Profit Margin (NET), Non-Interest Income Margin (NIIM), Operating Profit Margin (OPER), Pretax Margin (PRETAX)

Report Basis: Annual (ANN), Quarterly (QTR), Semi-Annual (SEMI), Last Twelve Months (LTM)

Lagging Period: 90 Days (L90D), 45 Days (L45D), 60 Days (L60D), No Lag, LTM Preset (LTM only)

**Description:** Returns the ratio of the Margin argument to Sales (GROSS, NET, OPER,PRETAX), the ratio of the Margin argument to net interest income (LLPM,NIIM), or simply the net interest margin (NETINT).

Examples:

-   GROSS, ANN, L90D – Returns the Annual Gross Profit Margin with the latest reported annual Gross Income and Sales, as of the backtest date, lagged 90 days.
    
    100 \* FF\_GROSS\_INC(ANN,0 L90D) / FF\_SALES(ANN,0 L90D)
-   LLPM, ANN, L90D - Returns the Loan Loss Provision Margin with the latest reported annual Loan Loss Provision and Net Interest Income, as of the backtest date, lagged 90 days.
    
    100 \* FF\_LOAN\_LOSS\_PROV(ANN,0 L90D) / FF\_INT\_INC\_NET(ANN,0 L90D)
-   NETINT, QTR, L45D - Returns the Net Interest Margin with the latest reported quarterly data, as of the backtest date, lagged 45 days.
    
    FF\_INT\_MGN(QTR,0 L45D)
-   NET, QTR, L45D – Returns the Net Profit Margin with the last reported quarterly sales and net income as of the backtest date, lagged 45 days.
    
    100 \* FF\_NET\_INC(QTR,0 L45D) / FF\_SALES(QTR,0 L45D)
-   NIIM, LTM – Returns the Net Interest Income Margin using the last four reported quarters or last two reported semi-annual periods as of the backtest date. The lag is predefined as 45 days for quarters and 60 days for semi-annual.
    
    100 \* AVAIL(FF\_NON\_INT\_INC(LTM,0 L45D),FF\_NON\_INT\_INC(LTM\_SEMI,0 L60D)) / AVAIL(FF\_INT\_INC\_NET(LTM,0 L45D),FF\_INT\_INC\_NET(LTM\_SEMI,0 L60D))
-   OPER, LTM – Returns the Operating Profit Margin using the last four reported quarters or last two reported semi-annual periods as of the backtest date. The lag is predefined as 45 days for quarters and 60 days for semi-annual.
    
    100 \* AVAIL(FF\_OPER\_INC(LTM,0 L45D),FF\_OPER\_INC(LTM\_SEMI,0 L60D)) / AVAIL(FF\_SALES(LTM,0 L45D),FF\_SALES(LTM\_SEMI,0 L60D))
-   PRETAX, SEMI, L60D – Returns the Pretax Margin using the latest reported semi-annual pretax income and sales as of the backtest date, lagged 60 days.
    
    100 \* FF\_PTX\_INC(SEMI,0 L60D) / FF\_SALES(SEMI,0 L60D)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Per Share Items: QAPPSF\_PER\_SHARE

**Arguments:**

Per Share: Book Value (BPS), Cash Flow from Operations (CFO), Dividends (DPS), Earnings (EPS), Earnings – Basic (BEPS), Earnings – Diluted (DEPS), Price (P), Sales (SPS), Tangible Book Value (TBPS)

Report Basis: Annual (ANN), Quarterly (QTR), Semi-annual (SEMI), Last Twelve Months (LTM), Calendar Month (CM0), Fiscal Year (FY0), Fiscal Quarter (FQ0), Fiscal Half-Year (FH0)

Lagging Period: 90 Days (L90D), 45 Days (L45D), 60 Days (L60D), No Lag, LTM Preset (LTM only)

Currency: Local (LOC), USD - US Dollar (USD), EUR – Euro (EUR), GBP – UK Pound Sterling (GBP), CHF – Swiss Franc (CHF), JPY - Japanese Yen (JPY), AUD – Australian Dollar (AUD), CAD – Canadian Dollar (CAD), or type your own

**Description:** Returns the Per Share argument using the specified report basis and appropriate lag. Note: the Calendar Month, Fiscal Year, Fiscal Quarter, and Fiscal Half-Year report basis arguments only work with Price.

Examples:

-   BPS, ANN, L90D, EUR – Returns Book Value per Share for latest reported annual period as of the backtest date, lagged 90 days. The Book Value is lagged 90 days and brought back in Euros. The share data is not lagged and pulls from the latest annual report as of the backtest date.
    
    FF\_COM\_EQ(ANN,0 L90D,RP,EUR) // FF\_COM\_SHS\_OUT(ANN,0)
-   TBPS, ANN, L90D, EUR - Returns Tangible Book Value per Share for latest reported annual period as of the backtest date, lagged 90 days. The Book Value and Intangible Assets are lagged 90 days and brought back in Euros. The share data is not lagged and pulls from the latest annual report as of the backtest date.
    
    (FF\_COM\_EQ(ANN,0 L90D,RP,EUR) - ZAV(FF\_INTANG(ANN,0 L90D,RP,EUR))) // FF\_COM\_SHS\_OUT(ANN,0)
-   CFO, QTR, L45D, USD - Returns Cash Flow from Operations per Share for latest reported quarter as of the backtest date, lagged 45 days. The Cash Flow from Operations is lagged 45 days and brought back in USD. The share data is not lagged and pulls from the latest quarterly report as of the backtest date.
    
    FF\_OPER\_CF(QTR,0 L45D,RP,USD) // AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(QTR,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(QTR,0))
-   DPS, QTR, L45D, USD - Returns the Dividends per Share for latest reported quarter as of the backtest date, lagged 45 days. This is the reported number, so the data item itself is lagged 45 days.
    
    FF\_DPS(QTR,0 L45D,RP,USD)
-   EPS, SEMI, L60D, LOCAL - Returns the Earnings per Share for latest reported semi-annual period as of the backtest date, lagged 60 days. This is the reported number, so the data item itself is lagged 60 days.
    
    FF\_EPS(SEMI,0 L60D,RP,LOC)
-   BEPS, SEMI, L60D, LOCAL - Returns the Basic Earnings per Share for latest reported semi-annual period as of the backtest date, lagged 60 days. This is the reported number, so the data item itself is lagged 60 days.
    
    FF\_EPS\_BASIC(SEMI,0 L60D,RP,LOCAL)
-   DEPS, LTM, 0, GBP - Returns the Diluted Earnings per Share. The formula will first reach back for last four quarters data and, if quarterly data is not available, for the last two semi-annual periods. This is the reported number, so the data item itself is lagged 45 days if quarterly data is used or 60 days if semi-annual data is used.
    
    AVAIL(FF\_EPS\_DIL(LTM,0 L45D,RP,GBP),FF\_EPS\_DIL(LTM\_SEMI,0 L60D,RP,GBP))
-   SPS, LTM, 0, GBP - Returns Sales per Share. For Sales, the formula first reach back for quarterly LTM data lagged 45 days and, if quarterly data is not available, for the semi-annual LTM data lagged 60 days. The Shares data is not lagged and is pulled from the latest quarterly report or semi-annual report. Diluted shares data is used when available; if diluted shares data is not available, basic shares data is used.
    
    AVAIL(FF\_SALES(LTM,0 L45D,RP,GBP),FF\_SALES(LTM\_SEMI,0 L60D,RP,GBP)) // AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(QTR,0),FF\_COM\_SHS\_OUT\_EPS\_DIL(SEMI,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(QTR,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(SEMI,0))
-   P, CM0, 0, CAD - Returns the Price for the latest month end in Canadian Dollars. This data is not lagged.
    
    FF\_PRICE\_CLOSE\_CP(MON,0,RP,CAD)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Profitability Measure (%): QAPPSF\_PROFIT

**Arguments:**

Profitability Measure: Assets (ROA), Common Equity (ROCE), Equity (ROE), Invested Capital (ROIC), Invested Capital \* B/P (ROICBP), Total Capital (ROTC), Tangible Common Equity (ROTCE), Risk-weighted Assets (RORWA)

Report Basis: Annual (ANN), Last Twelve Months (LTM)

Lagging Period: Lag 90 Days (L90D), Lag 60 Days (L60D), Lag 45 Days (L45D), No Lag, LTM Preset (LTM only)

**Description:** If the Profitability Measure argument is set to ROCE, this formula returns the ratio of Net Income before Extraordinaries to a two-period average of common equity. Otherwise, this formula returns the ratio of Net Income to the value specified in the Profitability Measure argument.

Examples:

-   ROA, ANN, L90D – Return on Assets for the latest reported annual Net Income and Assets, each lagged 90 days.
    
    100 \* (FF\_NET\_INC(ANN,0 L90D) // AVG2(FF\_ASSETS(ANN,0 L90D)))
-   ROCE, ANN, L90D – Return on Common Equity for the latest reported annual Net Income before extraordinaries and Common Equity, each lagged 90 days.
    
    100 \* (FF\_NET\_INC\_BASIC\_BEFT\_XORD(ANN,0 L90D) // AVG2(FF\_COM\_EQ(ANN,0 L90D)))
-   ROE, ANN, L90D – Return on Equity for the last reported annual Net Income and Shareholder's Equity, lagged 90 days.
    
    100 \* (FF\_NET\_INC(ANN,0 L90D) // AVG2(FF\_SHLDRS\_EQ(ANN,0 L90D)))
-   ROIC, ANN, L90D – Return on Invested Capital for the last reported annual Net Income and Invested Capital, lagged 90 days.
    
    100 \* (FF\_NET\_INC(ANN,0 L90D) // AVG2(FF\_INVEST\_CAP(ANN,0 L90D)))
-   ROICBP, LTM – Return on Invested Capital multiplied by the Book to Price ratio. Net Income is either the sum of the last 4 reported quarters or 2 semi-annual periods. Invested Capital is the average of the last two reported quarters or semi-annual periods. Book Value per share comes from the latest reported quarter or semi-annual period. The Price is from the latest month end.
    
    100 \* AVAIL(FF\_NET\_INC(LTM,0 L45D),FF\_NET\_INC(LTM\_SEMI,0 L60D)) // AVAIL(AVG(FF\_INVEST\_CAP(QTR,0 L45D),FF\_INVEST\_CAP(QTR,-4 L45D)),AVG(FF\_INVEST\_CAP(SEMI,0 L60D),FF\_INVEST\_CAP(SEMI,-2 L60D))) \* AVAIL(FF\_COM\_EQ(QTR,0 L45D),FF\_COM\_EQ(SEMI,0 L60D)) / (FF\_COM\_SHS\_OUT(MON,0) \* FF\_PRICE\_CLOSE\_CP(MON,0))
-   ROTC, LTM – Return on Total Capital. Net Income is either the sum of the last 4 reported quarters or 2 semi-annual periods. Total Capital is the average of the last two reported quarters or semi-annual periods.
    
    100 \* AVAIL(FF\_NET\_INC(LTM,0 L45D),FF\_NET\_INC(LTM\_SEMI,0 L60D)) // AVAIL(AVG(FF\_TCAP(QTR,0 L45D),FF\_TCAP(QTR,-4 L45D)),AVG(FF\_TCAP(SEMI,0 L60D),FF\_TCAP(SEMI,-2 L60D)))
-   ROTCE, LTM – Return on Tangible Common Equity. Net Income is either the sum of the last 4 reported quarters or 2 semi-annual periods. Tangible Common Equity is the average of the last two reported quarters or semi-annual periods, as defined by Common Equity minus Intangibles.
    
    100 \* AVAIL(FF\_NET\_INC(LTM,0 L45D),FF\_NET\_INC(LTM\_SEMI,0 L60D)) // AVAIL(AVG((FF\_COM\_EQ(QTR,0 L45D)-ZAV(FF\_INTANG(QTR,0 L45D))),(FF\_COM\_EQ(QTR,-4 L45D)-ZAV(FF\_INTANG(QTR,-4 L45D)))),AVG((FF\_COM\_EQ(SEMI,0 L60D)-ZAV(FF\_INTANG(SEMI,0 L60D))),(FF\_COM\_EQ(SEMI,-2 L60D)-ZAV(FF\_INTANG(SEMI,-2 L60D)))))
-   RORWA, LTM – Return on Risk-weighted Assets. Net Income is either the sum of the last 4 reported quarters or 2 semi-annual periods. Risk-weighted assets is the average of the last two reported quarters or semi-annual periods.
    
    100 \* AVAIL(FF\_NET\_INC(LTM,0 L45D),FF\_NET\_INC(LTM\_SEMI,0 L60D)) // AVAIL(AVG(FF\_ASSETS\_RISK\_WGHT(QTR,0 L45D),FF\_ASSETS\_RISK\_WGHT(QTR,-4 L45D)),AVG(FF\_ASSETS\_RISK\_WGHT(SEMI,0 L60D),FF\_ASSETS\_RISK\_WGHT(SEMI,-2 L60D)))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Turnover Ratios: QAPPSF\_TURNOVER

**Arguments:**

Asset Management Stat: Cash Conversion Cycle (CCC), Equity Turnover (EQ), Fixed Asset Turnover (FIX), Inventory Turnover (INV), Payables Turnover (PAY), Receivables Turnover (REC), Total Asset Turnover (TOT)

Report Basis: Annual (ANN), Semi-annual (SEMI), Quarterly (QTR), Last Twelve Months (LTM)

Lagging Period: 90 Days (L90D), 60 Days (L60D), 45 Days (L45D), No Lag, LTM Preset (LTM only)

**Description:** Returns the turnover specified by the Asset Management Stat argument. Turnover is calculated by summing COGS and the most recent change in Inventory and then dividing that figure by the average accounts payable over the last two periods.

Examples:

-   CCC, ANN, L90D – Returns the Cash Conversion Cycle for the latest reported annual period from the backtest date, lagged 90 days.
    
    FF\_CASH\_CONV\_CYCLE(ANN,0 L90D)
-   EQ, ANN, L90D - Returns the Equity Turnover for the latest reported annual period from the backtest date, lagged 90 days. It is calculated as the Sales divided by the average Equity of the last two reported periods.
    
    FF\_SALES(ANN,0 L90D) / AVG2(FF\_SHLDRS\_EQ(ANN,0 L90D))
-   FIX, ANN, L90D - Returns the Fixed Asset Turnover for the latest reported annual period from the backtest date, lagged 90 days. It is calculated as Sales divided by the average Net Fixed Assets of the last two reported periods.
    
    FF\_SALES(ANN,0 L90D) / AVG2(FF\_PPE\_NET(ANN, 0 L90D))
-   INV, QTR, L45D - Returns the Inventory Turnover for the latest reported quarterly period from the backtest date, lagged 45 days. It is calculated as COGS divided by the average Inventory of the last two reported quarters.
    
    FF\_COGS(QTR,0 L45D) / AVG2(FF\_INVEN(QTR,0 L45D))
-   PAY, QTR, L45D - Returns the Payables Turnover for the latest reported quarterly period from the backtest date, lagged 45 days. It is calculated as the sum of COGS and the most recent change in Inventory divided by the average accounts payable over the last two periods.
    
    (FF\_COGS(QTR,0 L45D) + ZAV(FF\_INVEN(QTR,0 L45D) - FF\_INVEN(QTR,-1 L45D))) / AVG2(FF\_PAY\_ACCT(QTR,0 L45D))
-   REC, QTR, L45D - Returns the Receivables Turnover for the latest reported quarterly period from the backtest date, lagged 45 days. It is calculated as Sales divided by the average of total receivables over the last two periods.
    
    FF\_SALES(QTR,0 L45D) / AVG2(FF\_RECEIV\_TOT(QTR,0 L45D))
-   TOT, QTR, L45D - Returns the Total Asset Turnover for the latest reported quarterly period from the backtest date, lagged 45 days. It is calculated as Sales divided by the average assets of the last two reported periods.
    
    FF\_SALES(QTR,0 L45D) / AVG2(FF\_ASSETS(QTR,0 L45D))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Valuation Ratios: QAPPSF\_VALUATION

**Arguments:**

Valuation Statistic: Book to Price (BP), Book to Price ex Goodwill (BPX), Cash Flow to Price (CFP), Dividend Yield (DY), Earnings to Price (EP), EBIT to Price (EBITP), EBITDA to Price (EBITDAP), Enterprise Value to EBIT (EVEBIT), Enterprise Value to EBITDA (EVEBITDA), PEG Ratio (PEG), PEGY Ratio (PEGY), Sales to Price (SP), Tangible Book to Price (TBP)

Report Basis: Annual (ANN), Semi-annual (SEMI), Quarterly (QTR), Last Twelve Months (LTM)

Lagging Period: 90 Days (L90D), 60 Days (L60D), 45 Days (L45D), No Lag, LTM Preset (LTM only)

**Description:** Returns the ratio specified in the Valuation Statistic argument. The returned value is the last reported value as of the backtest date, using the specified lag.

Examples:

-   BP, ANN, L90D – Returns the last reported annual book to price ratio as of the backtest date with a 90 day lag on the book value and using the most recent month end's price as of the backtest date.
    
    FF\_COM\_EQ(ANN,0 L90D) // FF\_COM\_SHS\_OUT(ANN,0) / FF\_PRICE\_CLOSE\_CP(MON,0)
-   BPX, ANN, L90D – Returns the last reported annual book to price ratio ex goodwill as of the backtest date with a 90 day lag on the book value and using the most recent month end's price as of the backtest date.
    
    (FF\_COM\_EQ(ANN,0 L90D) - ZAV(FF\_GW(ANN,0 L90D))) / (FF\_COM\_SHS\_OUT(ANN,0) \* FF\_PRICE\_CLOSE\_CP(MON,0))
-   CFP, LTM – Returns the last reported four quarters or last reported two semi-annual periods for Cash Flow per share as of the backtest date. Quarterly data is lagged by 45 days and Semi-annual data is lagged by 60 days. The price is not lagged and is the most recent calendar month's end as of the backtest date.
    
    (AVAIL(FF\_OPER\_CF(LTM, 0 L45D),FF\_OPER\_CF(LTM\_SEMI,0 L60D)) // AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(MON,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(MON,0))) / FF\_PRICE\_CLOSE\_CP(MON,0)
-   DY, LTM - Returns the last reported four quarters or last reported two semi-annual periods for dividends per share as of the backtest date. Quarterly data is lagged by 45 days and Semi-annual data is lagged by 60 days. The price is not lagged and is the most recent calendar month's end as of the backtest date.
    
    AVAIL(FF\_DPS(LTM,0 L45D),FF\_DPS(LTM\_SEMI,0 L60D)) / FF\_PRICE\_CLOSE\_CP(MON,0)
-   EBITP, QTR, L45D - Returns the last reported quarter or last reported semi-annual period for EBIT and Common Shares as of the backtest date. EBIT is lagged while Shares and Prices are not. Quarterly data is lagged by 45 days and Semi-annual data is lagged by 60 days. The price is as of the most recent calendar month's end as of the backtest date.
    
    FF\_EBIT\_OPER(QTR,0 L45D) / (FF\_PRICE\_CLOSE\_CP(MON,0) \* AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(QTR,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(QTR,0)))
-   EBITDAP, QTR, L45D - Returns the last reported quarter or last reported semi-annual period for EBITDA and Common Shares as of the backtest date. EBITDA is lagged while Shares and Prices are not. Quarterly data is lagged 45 days and Semi-annual data is lagged 60 days. The price is as of the most recent calendar month's end as of the backtest date.
    
    FF\_EBITDA\_OPER(QTR,0 L45D) / (FF\_PRICE\_CLOSE\_CP(MON,0) \* AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(QTR,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(QTR,0)))
-   EP, ANN, L90D – Returns the last reported annual EPS as of the backtest date with a 90 day lag and using the most recent month end's price as of the backtest date.
    
    FF\_EPS(ANN,0 L90D) / FF\_PRICE\_CLOSE\_CP(MON,0)
-   EVEBIT, ANN, L90D – Returns the annual EV/EBIT ratio.
    
    ((FF\_PRICE\_CLOSE\_CP(MON,0) \* AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(ANN,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(ANN,0),FF\_COM\_SHS\_OUT(ANN,0))) + ZAV(FF\_PFD\_STK(ANN,0)) + ZAV(FF\_DEBT(ANN,0 L90D)) + ZAV(FF\_MIN\_INT\_ACCUM(ANN,0 L90D)) - ZAV(FF\_CASH\_ST(ANN,0 L90D))) // FF\_EBIT\_OPER(ANN,0 L90D)
-   EVEBITDA, QTR, L45D – Returns the quarterly EV/EBITDA ratio.
    
    ((FF\_PRICE\_CLOSE\_CP(MON,0) \* AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(QTR,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(QTR,0),FF\_COM\_SHS\_OUT(QTR,0))) + ZAV(FF\_PFD\_STK(QTR,0)) + ZAV(FF\_DEBT(QTR,0 L45D)) + ZAV(FF\_MIN\_INT\_ACCUM(QTR,0 L45D)) - ZAV(FF\_CASH\_ST(QTR,0 L45D))) // FF\_EBITDA\_OPER(QTR,0 L45D)
-   PEG, ANN, L90D – Returns the PEG Ratio using the latest reported annual data lagged 90 days from the backtest date. Price is not lagged.
    
    (FF\_PRICE\_CLOSE\_CP(MON,0) // FF\_EPS(ANN,0 L90D)) / RATE3(FF\_EPS(ANN,0 L90D))
-   PEGY, LTM – Returns the PEGY Ratio using the latest reported annual data lagged 90 days from the backtest date. Price and dividends per share are not lagged.
    
    (FF\_PRICE\_CLOSE\_CP(MON,0) / AVAIL(FF\_EPS(LTM,0 L45D),FF\_EPS(LTM\_SEMI,0 L60D))) / (AVAIL(RATE12(FF\_EPS(LTM,0 L45D)),RATE6(FF\_EPS(LTM\_SEMI,0 L60D))) + (AVAIL(FF\_DPS(LTM,0),FF\_DPS(LTM\_SEMI,0)) / FF\_PRICE\_CLOSE\_CP(MON,0)) \* 100)
-   SP, LTM - Returns the last reported four quarters or last reported two semi-annual periods for sales per share as of the backtest date. Quarterly data is lagged by 45 days and Semi-annual data is lagged by 60 days. The price is not lagged and is the most recent calendar month's end as of the backtest date.
    
    (AVAIL(FF\_SALES(LTM,0 L45D),FF\_SALES(LTM\_SEMI,0 L60D)) // AVAIL(FF\_COM\_SHS\_OUT\_EPS\_DIL(MON,0),FF\_COM\_SHS\_OUT\_EPS\_BASIC(MON,0))) / FF\_PRICE\_CLOSE\_CP(MON,0)
-   TBP, QTR, L45D - Returns the last reported quarter or last reported semi-annual period for Book Value, Intangible Assets, and Common Shares as of the backtest date. Book Value & Intangible Assets are lagged while Shares and Prices are not. Quarterly data is lagged 45 days and Semi-annual data is lagged 60 days. The price is as of the most recent calendar month's end as of the backtest date.
    
    (FF\_COM\_EQ(QTR,0 L45D) - ZAV(FF\_INTANG(QTR,0 L45D))) / FF\_COM\_SHS\_OUT(QTR,0) / FF\_PRICE\_CLOSE\_CP(MON,0)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Fundamentals - Variability Factors: QAPPSF\_VARIABILITY

**Arguments:**

Variability Type: Earnings (EPS), Operating Income (OPER\_INC), Sales (SALES)

Report Basis: Annual (ANN), Quarterly (QTR), Semi-annual (SEMI), Last Twelve Months (LTM)

Lagging Period: 90 Days (L90D), 45 Days (L45D), 60 Days (L60D), No Lag, LTM Preset

**Description:** Returns the 5-year variability of the selected argument.

Examples:

-   EPS, ANN, L90D – Returns Earnings Variability over the past 5 reported annual periods, using available data. The data is lagged 90 days from the backtest date.
    
    STD5(FF\_EPS(ANN,0 L90D))//AVG5(FF\_EPS(ANN,0 L90D))
-   OPER\_INC, LTM – Returns Operating Income Variability over the past 5 reported quarters or semi-annual periods, depending upon how the company reports. The data is lagged 45 days for quarterly data and 60 days for semi-annual data.
    
    AVAIL(STD5(FF\_EBIT\_OPER(LTM,0 L45D)),STD5(FF\_EBIT\_OPER(LTM\_SEMI,0 L60D)))//AVAIL(AVG5(FF\_EBIT\_OPER(LTM,0 L45D)),AVG5(FF\_EBIT\_OPER(LTM\_SEMI,0 L60D)))
-   SALES, SEMI, L60D – Returns the Sales Variability over the past 5 reported semi-annual periods, using the available data. The data is lagged 60 days from the backtest date.
    
    STD5(FF\_SALES(SEMI,0 L60D))//AVG5(FF\_SALES(SEMI,0 L60D))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Prices - Company Beta: QAPPSP\_BETA

**Arguments:**

Index: Choose an index by using Identifier Lookup or by typing an index name into the text field. The identifier must be covered by FactSet Prices in order to return a Beta.

Data Frequency: Monthly (M), Weekly (W), Daily (D)

Number of Periods: Default of 60 for Monthly (60), 52 for Weekly (52), and 252 for Daily (252), Type your own

Currency: Local (LOC), USD - US Dollar (USD), EUR – Euro (EUR), GBP – UK Pound Sterling (GBP), CHF – Swiss Franc (CHF), JPY - Japanese Yen (JPY), AUD – Australian Dollar (AUD), CAD – Canadian Dollar (CAD), or type your own

**Description:** Returns the company volatility against an index using the specified frequency.

Examples:

-   SP50, M, 60 – Calculates the company beta by regressing 60 monthly returns for the company against 60 monthly returns for the S&P 500 index. By default, the function will use the local currency for the company against the local currency of the benchmark. This code will pull back any data available over the past 60 months. It is not required that all 60 months be available.
    
    REGSLOPE60(VALUE(SP50,P\_TOTAL\_RETURN(0M,-1M,M)),P\_TOTAL\_RETURN(0M,-1M,M))
-   RUI, W, 52, EUR – Calculates the company beta by regressing 52 weekly returns for the company against 52 weekly returns for the Russell 1000 Index. Both the index and the company returns are converted to Euros when calculating the Beta. This code will pull back any data available over the past 52 weeks. It is not required that all 52 weeks be available.
    
    REGSLOPE52(VALUE(RUI,P\_TOTAL\_RETURN(EUR,0W,-1W,W)),P\_TOTAL\_RETURN(EUR,0W,-1W,W))
-   US10YR, D, 252, AUD - Calculates the company beta by regressing 252 daily returns for the company against 252 daily returns for the 10 Year U.S. Treasury Yield. Both the index and the company returns are converted to Australian Dollars when calculating the Beta. This code will pull back any data available over the past 252 days. It is not required that all 252 days be available.
    
    REGSLOPE252(VALUE(US10YR,P\_TOTAL\_RETURN(AUD,0,-1)),P\_TOTAL\_RETURN(AUD,0,-1))

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Prices - MACD Oscillator: QAPPSP\_MACD

**Arguments:**

Universe: Enter any universe formula

Relative End Date: 0, -1, 0M, Type your own

Number of Prices: 60 (Type to edit)

Fast EMA (Days): 12 (Type to edit)

Slow EMA (Days): 26 (Type to edit)

Signal EMA (Days): 9 (Type to edit)

Currency: LOC, USD, EUR, GBP, CHF, JPY, AUD, CAD, Type your own

**Description:** Returns the moving average of the signal; the signal is the difference between the fast exponential moving average and the slow exponential moving average.

Examples:

-   RUNIVERSE, 0, 51, 12, 26, 9, USD - The RUNIVERSE argument indicates that this function will only work in Universal Screening. Returns the 9-day EMA of the MACD Oscillator using the past 51 daily prices in USD, starting from the zero date, for each company in the Screen's universe. The MACD oscillator is the difference between the 26 day moving average and the 12 day moving average.
    
    QAPPSP\_MACD(RUNIVERSE, 0, 51, 12, 26, 9, USD)
-   ISON\_SP\_US\_INDEX(0,100,CLOSE), -1, 50, 12, 26, 9, LOC - Returns the 9-day EMA of the MACD Oscillator as of yesterday using the past 50 daily prices starting from yesterday in the local currency for each company in the S&P 100. Note that the default column heading in Universal Screening does not work correctly when the universe specification contains commas. One way around this, in Universal Screening, is to put the universe limitation as a separate parameter and use row referencing within the QAPPSP\_MACD code such as QAPPSP\_MACD(ROWn,...).
    
    QAPPSP\_MACD(ISON\_SP\_US\_INDEX(0,100,CLOSE), -1, 50, 12, 26, 9, LOC)
    
    |**Note**|You can use the arguments for relative end date and number of prices to pull in different MACD points starting from the same date. For example, open the  [![](online-assistant/24402.1.html) MACD demo spreadsheet](https://my.apps.factset.com/oa/pages/cms/oaAttachment/aa656c38-4e07-4334-adbf-72f658c5da30/24402).
    |---|---|
    In the FactSet ribbon, select Refresh > All ActiveGraphs/Fields. You can then see MMM's MACD for 8/15/2014 when using the inputs and find the answer in cell J53.
    To pull in the previous day's (8/14/2014) MACD when starting from the same date of 5-Jun-2014, you would change the Number of Prices argument to 50 and the Relative End Date to -1 in the QAPPSP\_MACD formula. To perform this calculation in the spreadsheet, change the Backtest Date (cell B2) to 8/14/2014 and the Number of Prices (cell B3) to 50.|
    

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Prices - Maximum Drawdown: QAPPSP\_MAX\_DRAWDOWN

**Arguments:**

Universe: Enter any universe formula

Number of Returns: 60 (Type to edit)

Return Frequency: Weekly (W)

Currency: LOC, USD, EUR, GBP, CHF, JPY, AUD, CAD, Type your own

**Description:** Measures an asset's largest loss from peak to trough in a certain time period, before a new peak is achieved. In other words, the maximum loss from any point during the period. Returns are calculated as a simple price change from the FactSet Prices database. Any NA is automatically removed from the returns stream.

Examples:

-   RUNIVERSE, 60, D, USD - The RUNIVERSE function indicates that this function will only work in Universal Screening. Returns the Maximum Drawdown using the past 60 days of returns in USD.
    
    QAPPSP\_MAX\_DRAWDOWN(RUNIVERSE,60,D,USD)
-   ISON\_SP\_US\_INDEX(0,500,CLOSE), 156, W, LOC - For each company in the S&P 500, returns the Maximum Drawdown using the past 156 weeks of returns, set in local currency.
    
    QAPPSP\_MAX\_DRAWDOWN(ISON\_SP\_US\_INDEX(0,500,CLOSE), 156, W, LOC)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Prices - Relative Strength Index: QAPPSP\_RSI

**Arguments:**

Universe: Enter any universe formula

End Date: 0, -1, 0M, Type your own Relative Date

Number of Prices: 60 (Type to edit)

RSI Window: 14 (Type to edit)

Currency: LOC, USD, EUR, GBP, CHF, JPY, AUD, CAD, or type your own

**Description:** Returns the relative strength index using pricing data from the FactSet Pricing database.

Examples:

-   RUNIVERSE, 0, 51, 14, USD - The RUNIVERSE argument indicates that this function will only work in Universal Screening. Returns the 14-day RSI using the past 51 daily prices in USD for each company in the Screen's universe.
    
    QAPPSP\_RSI(RUNIVERSE, 0, 51, 14, USD)
-   ISON\_SP\_US\_INDEX(0,100,CLOSE), -1, 25, 14, LOC - Returns the 14-day RSI as of yesterday using the past 25 daily prices starting from yesterday in the local currency (USD) for each company in the S&P 100. Note that the default column heading in Universal Screening will only work if the universe specification is free of commas. To accomplish this in Universal Screening, enter the universe limitation as a separate parameter and use row referencing within the QAPPSP\_RSI code.
    
    QAPPSP\_RSI(ISON\_SP\_US\_INDEX(0,100,CLOSE), -1, 25, 14, LOC)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)

___

## Prices - Ulcer Index: QAPPSP\_ULCER\_INDEX

**Arguments:**

Universe: Enter any universe formula

Number of Returns: 60 (Type to edit)

Return Frequency: Monthly (M), Weekly (W), Daily (D)

Currency: LOC, USD, EUR, GBP, CHF, JPY, AUD, CAD, Type your own

**Description:** Measures the depth and duration of drawdowns in prices from earlier highs.

Examples:

-   ISON\_SP\_US\_INDEX(0,100,CLOSE), 60, M, LOC - Returns the ulcer index for each company in the S&P 100 using the past 60 months' worth of monthly returns using each company's local currency.
    
    QAPPSP\_ULCER\_INDEX(ISON\_SP\_US\_INDEX(0,100,CLOSE),60,M,LOC)
-   TICKER='HAL',61W,LOC - Returns the ulcer index for ticker HAL (Halliburton) using the past 61 weeks' worth of weekly returns in Halliburton's local currency.
    
    QAPPSP\_ULCER\_INDEX(TICKER='HAL',61,W,LOC)

[Top of Page](https://my.apps.factset.com/oa/pages/17358#top)
