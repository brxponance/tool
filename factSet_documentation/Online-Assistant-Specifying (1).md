---
created: 2026-05-05T19:03:12 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21416
author: 
---

# Online Assistant : Specifying

> ## Excerpt
> Launch it with FactSet Search: @AT4

---
## Specifying Return Source Page 21416

Launch it with FactSet Search: @AT4

The Returns > Sources section lets you specify the return sources to use when calculating returns for your model universe and benchmark. 

To access return source options, click the **Edit** ![](online-assistant/26811.html) button next to the Returns Sources section of Model Options. Alternatively, you can click the **Model Options** button located in the application toolbar and then select Returns > Sources from the left pane of the Edit Model Options page.

![](online-assistant/26811.1.html)

Topics covered:

-   [Selecting Returns Sources](https://my.apps.factset.com/oa/pages/21416#select_sources)
-   [Creating Custom Returns Sources](https://my.apps.factset.com/oa/pages/21416#custom_return_source)
-   [Creating Custom Risk-Free Rates](https://my.apps.factset.com/oa/pages/21416#custom_risk_free_rates)

___

## Selecting Returns Sources

To specify returns sources:

1.  [Open the Returns > Sources section in Model Options](https://my.apps.factset.com/oa/pages/21416#access).
2.  In the Universe section, find the returns source you want to use. You can use the Search text box above the Available list to search for the source by name, or expand the categories to scroll through all available sources. Double-click the source to add it to the Selected list.
    
    Press and hold the **CTRL** key while selecting the source(s) to add multiple sources at the same time. You can also drag and drop or click the **Add** ![](online-assistant/26811.2.html) button to move the source(s) into the Selected list. 
    
    ![](online-assistant/26811.3.html)
3.  Ensure that the sources in the Selected list are displayed in the order in which you want Alpha Testing to fetch the returns data. To change the order of the sources, select one of the sources in the Selected list and then click the **Move Selection Up/Move Selection Down** ![](online-assistant/26811.4.html) buttons to move it up or down the list. Alternatively, you can drag and drop the sources up/down to change the order.
    
    |**Notes**|-   All selected return sources are fetched for all securities in your universe, and the first available return is assigned to each security. Additional return sources will increase your model's run time, so be mindful when including additional return sources to increase coverage for your universe.
    |---|---|
        
        For example, if you select "Refinitiv Worldscope Fundamentals" as your first return source and "MSCI - Gross" as your second return source, Alpha Testing looks first to Refinitiv Worldscope Fundamentals for return data. If Refinitiv Worldscope Fundamentals does not have data available, Alpha Testing then looks to MSCI - Gross for return data.
    -   If a pricing source covers only your benchmark, then add it only as a benchmark source (see step 5).|
    
4.  Select the desired Weight and Market Cap treatment.  Market capitalization and weight formulas are included with each default return source. To add a custom market capitalization or weight formula, you must [add a custom return source](https://my.apps.factset.com/oa/pages/21416#custom_return_source).
    
    ![](online-assistant/26811.5.html)
    
    -   Weight Options: You will not see the exact results of your weight formula for each security in the Constituents report. Weight formula results are converted to a number that will total 1 for all the securities for each period.
        
        -   **Use Universe Return Source's Weights Formula:** Uses the return source's weight formula. When you select a [FactSet return source](https://my.apps.factset.com/oa/pages/pages/13596) or [create a custom return source](https://my.apps.factset.com/oa/pages/21416#custom_return_source), a source-specific weight formula is used. To see the weight formulas associated with default sources, see [Database-Specific Return Calculations](https://my.apps.factset.com/oa/pages/pages/14025).
        -   **Use Custom Weights Formula for All Universe Return Sources:** Uses a FactSet Screening formula for your weight formula. For example, if your model's universe is the S&P index, you can enter SP\_WEIGHT\_BEGIN(0).
            
            Click the **Edit** ![](online-assistant/26811.html) button to build the formula using Formula Lookup.
            
            In the text box, start typing the formula name/mnemonic, keyword, or phrase. The type-ahead search functionality will quickly return a list of matching results. Use your cursor or keyboard arrows to locate and select your desired formula. Review [Online Assistant page 20929](https://my.apps.factset.com/oa/pages/pages/20929) for more information on Formula Lookup. 
            
            |**Tips**|If you used a [Universal Screen to define your model's universe](https://my.apps.factset.com/oa/pages/pages/20848#screen), you can enter a row reference, such as ROW5, as your weight formula.
            |---|---|
            To search through the list of data items in Formula Lookup, click the **Browse for Formula ![](online-assistant/26811.6.html)**  button. To upload a formula from an underlying screen, click the **Import From Universal Screening** button.
            To make your weight formula sensitive to the currency option, use the [#CU](https://my.apps.factset.com/oa/pages/pages/13697#convert) argument.|
            
    -   Market Cap Options:
        
        -   **Use Universe Return Source's Weights Formula:** Uses the return source's market capitalization formula. When you select a [FactSet return source](https://my.apps.factset.com/oa/pages/pages/13596) or [create a custom return source](https://my.apps.factset.com/oa/pages/21416#custom_return_source), a source-specific market capitalization formula is used. To see the market capitalization formulas associated with default sources, see [Database-Specific Return Calculations](https://my.apps.factset.com/oa/pages/pages/14025).
        -   **Use Custom Universe Weights Formula (Above):** Uses the custom formula you entered as your weight for your market capitalization formula.
        -   **Use Custom Market Cap Formula for All Universe Return Sources:** Uses a FactSet screening formula for your market capitalization formula. For example, to calculate growth using share values from an OFDB in your client directory named MY\_OFDB, enter OFDB(CLIENT:MY\_OFDB,SHARES,0)\*P\_PRICE(0).
            
            Click the **Edit** ![](online-assistant/26811.html) button to build the formula using Formula Lookup. In the text box, start typing the formula name/mnemonic, keyword, or phrase. The type-ahead search functionality will quickly return a list of matching results. Use your cursor or keyboard arrows to locate and select your desired formula. Review [Online Assistant page 20929](https://my.apps.factset.com/oa/pages/pages/20929) for more information on Formula Lookup.
            
            |**Tips**|If you used a [Universal Screen to define your model's universe](https://my.apps.factset.com/oa/pages/pages/20848#screen), you can enter a row reference, such as ROW5, as your market capitalization formula.
            |---|---|
            To search through the list of data items in Formula Lookup, click the **Browse for Formula ![](online-assistant/26811.7.html)**  button. To upload a formula from an underlying screen, click the **Import From Universal Screening** button.
            To make your market capitalization formula sensitive to the currency option, use the [#CU](https://my.apps.factset.com/oa/pages/pages/13697#convert) argument.|
            
5.  (Optional) To select return sources for your benchmark that are different from the selected _universe_ return sources, deselect the "Same As Universe" check box. 
    
    In the Benchmark section, use the Search text box in the Available list to search for the source by name, or expand the categories to scroll through all available sources. Double-click the source to add it to the Selected list. 
    
    ![](online-assistant/26811.6.html)
    
6.  (Optional) To specify risk-free rate returns source, select a source from the Risk Free Rate section. You can use the Search text box in the Available list to search for the database by name, or expand the categories to scroll through all available databases. Double-click the source to add it to the Selected list.
    
    By default, the "Zero" source is selected, which fetches a risk-free rate of 0. If you select a new source it should match the currency of your model.
    
    ![](online-assistant/26811.8.html)

[Top of Page](https://my.apps.factset.com/oa/pages/21416#top)

___

## Creating Custom Returns Sources

Add custom return sources to your model inputs. Alpha Testing will assume that your custom return source will use the local currency unless you [select a different currency in Return options](https://my.apps.factset.com/oa/pages/pages/21526#currency).

To add a custom return source:

1.  [Open the Returns > Sources section in Model Options](https://my.apps.factset.com/oa/pages/21416#access).
2.  Click the **Add an Item ![](online-assistant/26811.9.html)**  button that is located in either the Universe or Benchmark section.
    
    ![](online-assistant/26811.10.html)
3.  The Definition dialog box opens. Enter a name for your custom return source.
    
    ![](online-assistant/26811.11.html)
4.  Enter custom Return and Weight formulas. In the text boxes, start typing the formula name/mnemonic, keyword, or phrase. The type-ahead search functionality will quickly return a list of matching results. Use your cursor or keyboard arrows to locate and select your desired formula. 
    
    ![](online-assistant/26811.12.html)
    
    Customize the formula's scope and output. The most common formula arguments are dates and currency; most formula arguments are optional and there are some formulas that do not require any. Click the **Reset Defaults** ![](online-assistant/26811.13.html) button to revert back to FactSet's default formula arguments. 
    
    ![](online-assistant/26811.14.html)
    
    |**Tip**|As an alternative to searching for data items with type-ahead search, you can also import data items from a Universal Screen or Formula Lookup by clicking the **Lookup** ![](online-assistant/26811.15.html) button.|
    |---|---|
    
5.  (Optional) If you want to use a market capitalization formula that is different from your weight formula, deselect the "Use Weight Formula for Market Cap" check box and enter a formula in the Market Cap Formula text box. For example, to calculate a market capitalization using share values from an OFDB file, enter OFDB(CLIENT:MY\_OFDB,SHARES,0) \* P\_PRICE(0). 
    
    |**Notes**|To make your weight and market cap formulas sensitive to the currency option, use the [#CU](https://my.apps.factset.com/oa/pages/13697#convert) argument.
    |---|---|
    For example, FF\_MKT\_VAL(MON,0,RS,#CU).|
    
6.  Define the directory where the custom pricing source should be saved ([Client](https://my.apps.factset.com/oa/pages/pages/3922#client_library), [Personal](https://my.apps.factset.com/oa/pages/pages/3935#personal_library), [Super Client](https://my.apps.factset.com/oa/pages/pages/3938#super_client_library), [Document](https://my.apps.factset.com/oa/pages/pages/3923#document)).
    
    |**Note**|The Document directory will save the custom source for use only in the current model (and not for use with future models). You must select the "Document" directory when saving custom return, weight, or market capitalization formulas that reference a specific row (e.g., ROW2) from a Universal Screen.|
    |---|---|
    
7.  Click **Save**. The Definition dialog box will close and the new custom source will be added to the Available list. 
8.  In the Available list, open the relevant directory, and double-click your custom source to add it to the Selected list.

[Top of Page](https://my.apps.factset.com/oa/pages/21416#top)

___

## Creating Custom Risk-Free Rates

Create a custom risk-free rate return source. Risk-free rate definitions do not require market cap or weight inputs. Most risk-free rates on FactSet are priced as annual yields and must be converted to match your return frequency.

To create a custom risk-free rate price source:

1.  [Open the Returns > Sources section in Model Options](https://my.apps.factset.com/oa/pages/21416#access).
2.  Click the **Add an Item** ![](online-assistant/26811.16.html) button that is located in the Risk Free Rate section.
    
    ![](online-assistant/26811.9.html)
3.  The Definition dialog box opens. Enter a name for your custom risk-free rate source.
4.  Choose to use either a Screening or FQL formula. This setting tells Alpha Testing how to evaluate the formula and ensures that the appropriate Formula Lookup launches.
5.  Start typing the formula name/mnemonic, keyword, or phrase into the Formula text box. The type-ahead functionality will quickly return a list of matching items. Click a filter (e.g., Formulas, Functions) to further refine your search. Use your cursor or keyboard arrows to locate and select your desired formula.
    
    ![](online-assistant/26811.17.html) 
    
    |**Tips**|The Formula text box leverages Formula Lookup to aid you in creating custom sources. Review [Online Assistant page 20929](https://my.apps.factset.com/oa/pages/pages/20929) for more information on Formula Lookup.
    |---|---|
    You can also import data items from a Universal Screen (if using a Screening formula) or the Formula Lookup dialog by clicking the **Lookup** ![](online-assistant/26811.18.idunno) button.|
    
    Customize the formula's scope and output. Click the **Reset Defaults** ![](online-assistant/26811.15.html) button to revert back to FactSet's default formula arguments. 
    
    ![](online-assistant/26811.13.html) 
6.  Enter the Risk-Free Rate identifier. You do not need to include an identifier when using an economic FQL formula. Click the **Lookup** ![](online-assistant/26811.19.html) button to find the ID using [Identifier Lookup](https://my.apps.factset.com/oa/pages/pages/14587).
7.  Define the directory where the custom pricing source should be saved ([Client](https://my.apps.factset.com/oa/pages/pages/3922#client_library), [Personal](https://my.apps.factset.com/oa/pages/pages/3935#personal_library), [Super Client](https://my.apps.factset.com/oa/pages/pages/3938#super_client_library), [Document](https://my.apps.factset.com/oa/pages/pages/3923#document)).
    
    |**Note**|The Document directory will save the custom source for use only in the current model (not for use with future models). You must select the "Document" directory when saving custom return, weight, or market capitalization formulas that reference a specific row (e.g., ROW2) from a Universal Screen.|
    |---|---|
    
8.  Click **Save**. The Definition dialog box will close and the new custom source will be added to the Available list.
9.  In the Available list, open the relevant directory, and double-click your custom source to add it to the Selected list.
    
    |**Note**|To convert annual rates into a daily rate, you need to use the #PY variable (periods per year). Most risk-free rates on FactSet are priced as annual yields.
    |---|---|
    If you select the FQL option, you must use the #SD or #ED variables in any date argument to specify the date relative to the current and previous dates|
    

### Example

If you are using a one-month return frequency, you can convert annualized rates to match your frequency by using one of the following methods. Note that the #PY variable returns the number of return periods per year, which, for a monthly frequency, will be 12. 

-   In a Screening formula, enter:
    
    100\*(POWER((1+PAVG(0 0+#F)/100),1/12)-1) for the identifier US5YR
-   In an FQL formula, enter:
    
    (POW((AVG(OECD\_MEI\_DATA("JPN.IRSTOD01.ST",#SD,#ED,D))/100)+1,(1.0/#PY))-1.0)\*100.0 for the identifier CASH\_JPY

When using a custom risk free rate as your return source, be certain that your identifier and formula are priced using the corresponding currency for your country.

[Top of Page](https://my.apps.factset.com/oa/pages/21416#top)
