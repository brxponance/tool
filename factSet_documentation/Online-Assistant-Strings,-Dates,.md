---
created: 2026-05-05T19:20:01 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/20677
author: 
---

# Online Assistant : Strings, Dates,

> ## Excerpt
> Easily dictate the capitalization of your Screening items or return a piece of a text string to customize the way textual data is displayed in your report. Perform mathematical calculations to analyze the data in your results.

---
## Performing Textual, Date, and Mathematical Manipulations Page 20677

Easily dictate the capitalization of your Screening items or return a piece of a text [string](https://my.apps.factset.com/oa/pages/pages/3938#string) to customize the way textual data is displayed in your report. Perform mathematical calculations to analyze the data in your results.

Topics covered: 

-   [Manipulating String Results](https://my.apps.factset.com/oa/pages/20677#Manipulating)
-   [Formatting Report Dates](https://my.apps.factset.com/oa/pages/20677#Formatting)
-   [Performing Mathematical Calculations](https://my.apps.factset.com/oa/pages/20677#Performing)

___

## Manipulating String Results  

FactSet's string functions use text string arguments to evaluate textual information, such as a company's ticker, [CUSIP](https://my.apps.factset.com/oa/pages/pages/3922#cusip), name, or industry. 

Depending on the string function you select, you may be required to specify one to three inputs. Each applied input affects the way in which your function is calculated. The first input, Parameter, is always required.

However, some of these functions also require a start and end _pattern_ of a substring (e.g., "abc" and "xyz"), or the start and end _indices_ of a substring (e.g., the value starts at position "5" and goes to position "10").

String functions can be used to perform many types of calculations on textual data. For example, the FS (i.e., FactSet Sector) parameter allows you to dictate the number of letters returned for each sector covered, return the length of the string output, or perform any other manipulation that is available within the String category of [Function Builder](https://my.apps.factset.com/oa/pages/pages/20695). String functions always require a string parameter.

### Function and Calculation 

Propercase, Uppercase, and Lowercase functions accept a single string parameter and are used to dictate which letters or words are capitalized.

String Length accepts a single string and returns its length.

Substring and String Replace require you to specify where your substring starts and ends. This is required in order for the function to either parse the string out and return it, or replace it.

For more information on the string functions available, see [Strings](https://my.apps.factset.com/oa/pages/pages/20665#Strings). 

[Top of Page](https://my.apps.factset.com/oa/pages/20677#top)

___

## Formatting Report Dates 

FactSet's date functions are used to manipulate dates. For example, you can return a date in a specific format (i.e., YYYMMDD), or return a date as a text string (i.e., Friday, March 17, 2017).

### Function and Calculation 

Julian to Date converts a Julian date into a numeric date YYYYMMDD format. The opposite of this function, Date to Julian, converts a numeric date into a Julian date.

Convert Date (String) and Convert Date (Numeric) take a string or a numeric date, respectively, and change the way the date is formatted. Convert Date (String) formatting options are YYYY-MM-DD, M/D/YY, DD.MM.YY,MMM-DD-YYYY,DDDD MMM D YYYY, CQ, or a custom format. Convert Date (Numeric) formatting options are YYYYMMDD, YYYY, Julian, or a custom format.

For more information on the date functions available, see [Dates](https://my.apps.factset.com/oa/pages/pages/20665#Dates). 

[Top of Page](https://my.apps.factset.com/oa/pages/20677#top)

___

## Performing Mathematical Calculations 

FactSet's mathematical functions allow you to perform a variety of mathematical calculations in your report. It includes `ABS`, `FRAC`, `LOG`, `SQRT`, and trigonometric functions.

Depending on the mathematical function you select, you may be required to specify two inputs. Each applied input affects the way in which your function is calculated. The first input, Parameter, is always required.

However, some of these functions also require one extra number or parameter, which is used to determine how they should be calculated.

Similar to string functions, mathematical functions can be used to perform various types of calculations on numeric data. They always require a parameter that returns a number.  

### Function and Calculation 

Absolute, Exponent, Log, Square Root, Fractional, Sine, Cosine, Tangent, Arcsine, Arccosine, and Arctangent functions accept a single numeric parameter and are used to perform a simple mathematical calculation.  

Ceiling, Floor, Power, Round, Precision, and Modulo accept a single numeric parameter and another number, which is used to determine how they should be calculated.

Percent Change accepts two numeric parameters; it is used to determine the rate of differences between them. This is the extent to which each parameter gains or loses value.

For more information on the mathematical functions available, see [Math](https://my.apps.factset.com/oa/pages/pages/20665#Math). 

[Top of Page](https://my.apps.factset.com/oa/pages/20677#top)
