---
created: 2026-05-05T19:04:55 (UTC -04:00)
tags: []
source: https://my.apps.factset.com/oa/pages/13739
author: 
---

# Online Assistant : Companies

> ## Excerpt
> The Universal Screening application aligns data to ensure that you are looking at data that actually occurred on a given date. If the price date is earlier than PD(FIRST) or later than PD(LAST), Universal Screening sets all price fields for a security to @NA.

---
The [Universal Screening](https://my.apps.factset.com/oa/pages/pages/11721) application aligns data to ensure that you are looking at data that actually occurred on a given date. If the price date is earlier than [PD(FIRST)](https://my.apps.factset.com/oa/pages/pages/471#first_last) or later than [PD(LAST)](https://my.apps.factset.com/oa/pages/pages/471#first_last), Universal Screening sets all price fields for a security to @NA.

Other databases drop companies as follows:

-   FactSet will not Interactive's data (FactSet's provider of daily U.S. pricing data) if a security has not traded in the last ten days.
-   FactSet will not rotate Exshare's data (FactSet's provider of daily non-U.S. pricing data) if a security has not traded in the last 30 days. Generally, only common stocks trading on their home market are rotated.
-   With other databases, such as Refinitiv Worldscope Fundamentals, FactSet rotates inactive companies (as opposed to excluding them from the rotation).

### How Does This Affect You?

Some securities covered by the pricing database will return data when using the pricing code P(0) (either by screening or data downloading) even if the security no longer is trading. (This could occur when using other databases as well).

Thus, if you plan on using a pricing code in your analysis (e.g., referencing a market capitalization screen as your defined model universe in Alpha Testing), add an additional request code to remove companies that have no current trading volume. For example, enter PVOL(0)<>0.

Copyright © 1999-2026 FactSet Research Systems Inc.

The information contained in FactSet Online Assistant® includes information proprietary to FactSet. Redistribution of this material to any person or organization who is not a FactSet subscriber is prohibited. Republication in any form is prohibited without prior express written consent of FactSet.

You must have an internet connection to view outside websites. Linked sites are not under the control of FactSet and FactSet is not responsible for the contents of any linked site or any link contained in a linked site, or any changes or updates to such sites. FactSet is not responsible for webcasting or any other form of transmission received from any linked site. The views expressed on these sites do not necessarily reflect the views of FactSet. Information on these sites may not be current.
