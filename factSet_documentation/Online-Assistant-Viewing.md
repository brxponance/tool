---
created: 2026-05-05T19:20:29 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/21898
author: 
---

# Online Assistant : Viewing

> ## Excerpt
> The Parameter view lists the number of securities or funds passing your screen, along with the report parameters. The top level shows the data item being analyzed and the following levels show the individual items and functions that make up each formula definition.

---
## Viewing Parameters Page 21898

The Parameter view lists the number of securities or funds passing your screen, along with the report parameters. The top level shows the data item being analyzed and the following levels show the individual items and functions that make up each formula definition. 

![](online-assistant/27354.html)

Topics covered:

-   [Managing the Parameter View](https://my.apps.factset.com/oa/pages/21898#param_view)
-   [Renumbering Parameters](https://my.apps.factset.com/oa/pages/21898#renumber)
-   [Importing Parameters](https://my.apps.factset.com/oa/pages/21898#import)
-   [Finding and Replacing Text within Parameters](https://my.apps.factset.com/oa/pages/find_replace)

___

## Managing the Parameter View

The Parameter view is organized into [tabs](https://my.apps.factset.com/oa/pages/21898#Create_Category). Click the **Expand** or **Collapse** buttons ![](online-assistant/27354.1.html)  to open or close all the tabs.   

-   **Frozen Columns (default)**: contains the Company Name and Company Symbol rows.
-   **Tab1(default)**: contains all the applied parameters.
-   **Grouping Selections**: contains all the applied grouping in your screen. Each grouping is denoted with GRLVL_n_ reference names, with _n_ representing the order in which the tabs were created.
    
    |**Tip**|Place your cursor on a grouping and click the **Remove Row** button ![](online-assistant/27354.2.html) to instantly remove a grouping. Subsequent groupings will move up a level.|
    |---|---|
    

The following columns are available in the Parameter view. These show you the number of securities or funds that meet the specified limitations: 

-   **Available**: The number of securities or funds in the universe. 
    
-   **Passed**: The number of securities or funds in the universe that pass _all_ of your screening parameters. 

These figures update whenever an item is changed and the screen is refreshed. If a [parameter is deactivated](https://my.apps.factset.com/oa/pages/21898#Deactivating), only its formula will update; counts will not. Passed values cannot be shown for erroneous parameters, which display "N/A" in the Results pane.

![](online-assistant/27354.3.html) 

|**Tip**|In the Parameter View, hover over a hyperlink to reference pop-ups that show the underlying definition of global variables and parameter row references. 
|---|---|
![](online-assistant/29793.html)|

**Right-Click Menu**

You can right-click on rows in the Parameter view to perform a variety of screening tasks. 

-   **Edit Formula**: Places the selected formula within the Add Columns workspace, so you can revise arguments, apply functions, or revert back to FactSet's defaults.
-   **Create Tab**: Sends the selected row(s) to a new tab (i.e., category), which appears at the bottom of your Parameter view. The default name for new tabs are Tab_n_, with _n_ representing the order in which the tabs were created. You can create up to 50 tabs.
    
    |**Tip**|Double-click on a tab row you've created to rename it. The naming rules for tabs are the same as the rules for parameter reference names. Right-click a tab row and select "Delete Tab" to entirely remove it from your screen. When you remove a tab, its constituents will be added to the bottom of the first tab.|
    |---|---|
    
-   **Format**: Applies [formatting](https://my.apps.factset.com/oa/pages/pages/20607#Applying) to the selected parameter. 
-   **Move Parameters above row**: Moves the selected parameter(s) above a specified row; default is row 1.
-   **Move Parameters to Tab**: Sends the selected row(s) to another tab of your choosing.
-   **Deactivate/Recalculate Selected**: Controls the calculation of selected parameters. These options are most useful when creating or modifying large formulas or parameters that reference each other. If you deactivate a parameter, the **Deactivated** icon ![](online-assistant/27354.4.html) will appear within its Passed column. If you save the screen, it will save the deactivated state of that parameter. As such, when you reopen the screen, the parameter will remain deactivated until you select to recalculate it.  
-   **Hide/Show Selected**: Switches between [hiding and showing](https://my.apps.factset.com/oa/pages/pages/20607#Applying) the parameter in your report results. You can also click the ![](online-assistant/27354.5.html) icon to hide/show parameters.

[Top of Page](https://my.apps.factset.com/oa/pages/21898#top)

___

## Renumbering Parameters

You can renumber parameters so that the parameter's reference name aligns with the parameter's index/row number within the screen. This means that the first parameter will automatically become P1, the second will become P2, etc.

To update parameter reference names based on their index number, click on the **Renumber Parameters** button ![](online-assistant/27354.6.html) from the Parameter view. This action cannot be undone.

|**Note**|There is no undo feature for this functionality. When you save your screens by renumbering the parameters, the reference name is replaced with the corresponding P_index_ syntax. But, P_index_ syntax cannot be changed back to the actual reference name.|
|---|---|

[Top of Page](https://my.apps.factset.com/oa/pages/21898#top)

___

## Importing Parameters

The import parameter feature allows you to import up to 150 parameters from one screen into another screen. Parameter metadata, such as parameter reference name, column header, column description, format, statistics and the Conditional Formatting applied from the previous screen, are carried over to the target screen, forgoing the need to edit and make the changes after importing.  

To import parameters:

1.  Click the **Import Parameters** button ![](online-assistant/27354.7.html) from the Parameter view.
2.  Select a saved screen from your Client, Personal, or Super\_Client directory.
3.  Select the parameter(s) to add and click the **Import** button. You can also select the tab you want to import into; if you do not select a tab, the parameter(s) will imported to the active tab by default. 

![](online-assistant/27354.8.html)

|**Notes**|If you select more than 150 parameters, a message will appear in red at the bottom and the Import button will be disabled.
|---|---|
You can import parameters that reference other parameters without having to select the referenced (dependent) parameter. For example, you could import a parameter,
#P.P2/#P.P1, without importing the parameters P1 and P2.|

[Top of Page](https://my.apps.factset.com/oa/pages/21898#top)

___

## Finding and Replacing Text within Parameters

You can find and replace text in single or multiple parameters at once.

To search and replace text in your parameters:

1.  Click the **Find and Replace** button ![](online-assistant/27354.9.html) from within the Parameters view.
2.  Enter the text you want to find in the Find String field.
3.  Enter the text you want to replace it with in the Replace With field.
4.  Click **Replace** to replace just one instance or **Replace All** to replace all instances of the find text. 

-   Replace: If there are any errors while replacing and validating, you will receive a pop-up window that displays the error. Clicking **Cancel** will revert the changes that generated an error and clicking **OK** will apply the changes. 
-   Replace All: If there are any errors while replacing and validating, you will receive a pop-up window that displays all the errors. Clicking **All Changes** will apply all the changes irrespective of errors, clicking **Valid Only** will make the changes that do not generate any error, and clicking **Cancel** will revert all the changes.

|**Tips**|To find a parameter search that exactly matches the entered text, click the **Whole Word Match** icon within the Find String field.
|---|---|
If there is no match found for the text searched you will see an alert icon. If you click on the icon, it will say: _Nothing to Replace, note only Formula text can be replaced._
To find text within your parameters, enter text in the Find String field and click the **Up** and **Down Arrows** to find the next or previous match.
![](online-assistant/27354.10.html)|

[Top of Page](https://my.apps.factset.com/oa/pages/21898#top)
