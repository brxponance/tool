---
created: 2026-05-11T13:04:13 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/dates.html
author: 
---

# Dates — FactSet Programmatic

> ## Excerpt
> Define time series settings.

---
## TimeSeries[#](https://fpe.factset.com/docs/dates.html#timeseries "Link to this heading")

```
from fds.fpe.dates import TimeSeries, Calendar

time_series = TimeSeries(start='-15M', stop='-3M', freq='MONTHLY', calendar=Calendar.FIVEDAY)
```

_class_ fds.fpe.dates.TimeSeries(_start\=None_, _stop\=None_, _freq\=None_, _calendar\=None_, _dates\=None_, _progress\_bar\=False_, _\*\*kwargs_)[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "Link to this definition")

Define time series settings.

TimeSeries stores your time series settings and resolves those settings to a list of datetime objects. This allows you to take advantage of FactSet’s extensive functionality for date logic.

TimeSeries supports Absolute Dates or FactSet Relative Dates and Frequencies. It also supports FactSet’s wide range of Trading Calendars.

This offers advantages whether you’re retrieving data from a specific country or across several countries.

Parameters:

-   **start** (_str_ _or_ [_RelativeDate_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates.RelativeDate")_,_ _optional_) – The start date of your time series. If a string is provided, it can be an absolute date or a relative date. Alternatively, you can provide a RelativeDate. By default, the value will be RelativeDate.PREV\_CLOSE. _Note: If the dates parameter is provided, start will be set to the earliest date provided in the format ‘YYYYMMDD’._
    
-   **stop** (_str_ _or_ [_RelativeDate_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates.RelativeDate")_,_ _optional_) – The stop date of your time series. If a string is provided, it can be an absolute date or a relative date. Alternatively, you can provide a RelativeDate. By default, the value will be RelativeDate.PREV\_CLOSE. _Note: If the dates parameter is provided, stop will be set to the latest date provided in the format ‘YYYYMMDD’._
    
-   **freq** (_str_ _or_ [_Frequency_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency "fds.fpe.dates.Frequency")_,_ _optional_) – The frequency of your time series. If a string is provided, any Factset supported frequency code(for example, ‘Y’) or full name(‘YEARLY’) is valid. By default it is Frequency.MONTHLY. _Note: If the dates parameter is provided, freq will default to Frequency.DAILY._
    
-   **calendar** (_str_ _or_ [_Calendar_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar "fds.fpe.dates.Calendar")_,_ _optional_) – Trading calendar, by default Calendar.FIVEDAY _Note: If the dates parameter is provided, calendar will default to Calendar.SEVENDAY._
    
-   **dates** (_list__,_ _optional_) –
    
    A list of datetime objects. When provided:
    
    > -   start and stop default to the earliest and latest dates in the list.
    >     
    > -   freq defaults to Frequency.DAILY.
    >     
    > -   calendar defaults to Calendar.SEVENDAY.
    >     
    
-   **progress\_bar** (_bool__,_ _optional_) – Display a progress bar while resolving dates. By default False.
    

See also

-   Absolute Dates: [https://my.apps.factset.com/oa/pages/1964#abs](https://my.apps.factset.com/oa/pages/1964#abs)
    
-   Relative Dates: [https://my.apps.factset.com/oa/pages/1964#rel](https://my.apps.factset.com/oa/pages/1964#rel)
    
-   Frequency: [https://my.apps.factset.com/oa/pages/1964#frequency](https://my.apps.factset.com/oa/pages/1964#frequency)
    
-   Calendar: [https://my.apps.factset.com/oa/pages/2012#Calendar](https://my.apps.factset.com/oa/pages/2012#Calendar)
    
-   Market Holidays: [https://my.apps.factset.com/oa/pages/10397](https://my.apps.factset.com/oa/pages/10397)
    

_property_ calendar_: str | [Calendar](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar "fds.fpe.dates._calendar.Calendar") | None_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.calendar "Link to this definition")

Get time series calendar.

_property_ dates_: list\[datetime\]_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.dates "Link to this definition")

Get time series dates.

_property_ freq_: str | [Frequency](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency "fds.fpe.dates._frequency.Frequency")_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.freq "Link to this definition")

Get time series frequency.

_property_ is\_default\_calendar_: bool_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.is_default_calendar "Link to this definition")

Check if calendar was user provided or defaulted.

_property_ is\_default\_freq_: bool_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.is_default_freq "Link to this definition")

Check if frequency was user provided or defaulted.

_property_ start_: str | [RelativeDate](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates._relative_dates.RelativeDate") | None_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.start "Link to this definition")

Get time series start.

_property_ stop_: str | [RelativeDate](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "fds.fpe.dates._relative_dates.RelativeDate") | None_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries.stop "Link to this definition")

Get time series stop.

## RelativeDate[#](https://fpe.factset.com/docs/dates.html#relativedate "Link to this heading")

_class_ fds.fpe.dates.RelativeDate(_value_, _names\=None_, _\*_, _module\=None_, _qualname\=None_, _type\=None_, _start\=1_, _boundary\=None_)[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.RelativeDate "Link to this definition")

An Enum representing FactSet relative dates.

Relative dates represent a date relative to the most recently-updated period. For example, 0 (zero) represents the most recently-updated period; -1 represents the time period prior to the most recently updated.

The “zero date” is determined by the default time period or the natural frequency of the data being requested. Zero (0), when used with monthly data, indicates the most recent month-end. Negative one (-1), when used with annual data, indicates one fiscal year prior to the most recently-updated fiscal year.

Some examples values:

-   LATEST = ‘NOW’
    
-   PREV\_CLOSE = ‘0D’
    
-   PREV\_WEEK\_END = ‘0W’
    
-   PREV\_MONTH\_END = ‘0M’
    
-   PREV\_QUARTER\_END = ‘0CQ’
    
-   PREV\_YEAR\_END = ‘0CY’
    
-   ONE\_DAY\_AGO = ‘-1D’
    
-   TWO\_DAYS\_AGO = ‘-2D’
    
-   …
    
-   ONE\_CALENDAR\_WEEK\_AGO = ‘-1W’
    
-   TWO\_CALENDAR\_WEEKS\_AGO = ‘-2W’
    
-   …
    
-   ONE\_ACTUAL\_WEEK\_AGO = ‘-1AW’
    
-   TWO\_ACTUAL\_WEEKS\_AGO = ‘-2AW’
    
-   …
    
-   ONE\_CALENDAR\_MONTH\_AGO = ‘-1M’
    
-   TWO\_CALENDAR\_MONTHS\_AGO = ‘-2M’
    
-   …
    
-   ONE\_ACTUAL\_MONTH\_AGO = ‘-1AM’
    
-   TWO\_ACTUAL\_MONTHS\_AGO = ‘-2AM’
    
-   …
    
-   ONE\_CALENDAR\_QUARTER\_AGO = ‘-1CQ’
    
-   TWO\_CALENDAR\_QUARTERS\_AGO = ‘-2CQ’
    
-   …
    
-   ONE\_ACTUAL\_QUARTER\_AGO = ‘-1AQ’
    
-   TWO\_ACTUAL\_QUARTERS\_AGO = ‘-2AQ’
    
-   …
    
-   ONE\_FISCAL\_QUARTER\_AGO = ‘-1Q’
    
-   TWO\_FISCAL\_QUARTERS\_AGO = ‘-2Q’
    
-   …
    
-   ONE\_CALENDAR\_YEAR\_AGO = ‘-1CY’
    
-   TWO\_CALENDAR\_YEARS\_AGO = ‘-2CY’
    
-   …
    
-   ONE\_ACTUAL\_YEAR\_AGO = ‘-1AY’
    
-   TWO\_ACTUAL\_YEARS\_AGO = ‘-2AY’
    
-   …
    
-   ONE\_FISCAL\_YEAR\_AGO = ‘-1Y’
    
-   TWO\_FISCAL\_YEARS\_AGO = ‘-2Y’
    

Parameters:

**enum** (_enum.Enum_) – The desired enum value.

## Frequency[#](https://fpe.factset.com/docs/dates.html#frequency "Link to this heading")

_enum_ fds.fpe.dates.Frequency(_value_)[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency "Link to this definition")

An Enum representing FactSet frequencies.

Parameters:

**enum** (_enum.Enum_) – The desired enum value.

Valid values are as follows:

DAILY _\= <Frequency.DAILY: 'DAILY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.DAILY "Link to this definition")

WEEKLY _\= <Frequency.WEEKLY: 'WEEKLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.WEEKLY "Link to this definition")

MONTHLY _\= <Frequency.MONTHLY: 'MONTHLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.MONTHLY "Link to this definition")

QUARTERLY _\= <Frequency.QUARTERLY: 'QUARTERLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.QUARTERLY "Link to this definition")

YEARLY _\= <Frequency.YEARLY: 'YEARLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.YEARLY "Link to this definition")

FISCAL\_QUARTERLY _\= <Frequency.FISCAL\_QUARTERLY: 'FISCAL\_QUARTERLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.FISCAL_QUARTERLY "Link to this definition")

FISCAL\_YEARLY _\= <Frequency.FISCAL\_YEARLY: 'FISCAL\_YEARLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.FISCAL_YEARLY "Link to this definition")

CALENDAR\_MONTHLY _\= <Frequency.CALENDAR\_MONTHLY: 'CALENDAR\_MONTHLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.CALENDAR_MONTHLY "Link to this definition")

CALENDAR\_QUARTERLY _\= <Frequency.CALENDAR\_QUARTERLY: 'CALENDAR\_QUARTERLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.CALENDAR_QUARTERLY "Link to this definition")

CALENDAR\_YEARLY _\= <Frequency.CALENDAR\_YEARLY: 'CALENDAR\_YEARLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.CALENDAR_YEARLY "Link to this definition")

ACTUAL\_WEEKLY _\= <Frequency.ACTUAL\_WEEKLY: 'ACTUAL\_WEEKLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.ACTUAL_WEEKLY "Link to this definition")

ACTUAL\_MONTHLY _\= <Frequency.ACTUAL\_MONTHLY: 'ACTUAL\_MONTHLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.ACTUAL_MONTHLY "Link to this definition")

ACTUAL\_QUARTERLY _\= <Frequency.ACTUAL\_QUARTERLY: 'ACTUAL\_QUARTERLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.ACTUAL_QUARTERLY "Link to this definition")

ACTUAL\_YEARLY _\= <Frequency.ACTUAL\_YEARLY: 'ACTUAL\_YEARLY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Frequency.ACTUAL_YEARLY "Link to this definition")

## Calendar[#](https://fpe.factset.com/docs/dates.html#calendar "Link to this heading")

_enum_ fds.fpe.dates.Calendar(_value_)[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar "Link to this definition")

An Enum representing FactSet trading calendars.

Choose the trading calendar of any exchange around the world.

Parameters:

**enum** (_enum.Enum_) – The desired enum value.

See also

-   Calendar: [https://my.apps.factset.com/oa/pages/2012#Calendar](https://my.apps.factset.com/oa/pages/2012#Calendar)
    
-   Market Holidays: [https://my.apps.factset.com/oa/pages/10397](https://my.apps.factset.com/oa/pages/10397)
    

Valid values are as follows:

FIVEDAY _\= <Calendar.FIVEDAY: 'FIVEDAY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.FIVEDAY "Link to this definition")

SEVENDAY _\= <Calendar.SEVENDAY: 'SEVENDAY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SEVENDAY "Link to this definition")

LOCAL _\= <Calendar.LOCAL: 'LOCAL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.LOCAL "Link to this definition")

ABU\_DHABI _\= <Calendar.ABU\_DHABI: 'FUA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ABU_DHABI "Link to this definition")

ARGENTINA _\= <Calendar.ARGENTINA: 'LAB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ARGENTINA "Link to this definition")

ARMENIA _\= <Calendar.ARMENIA: 'DDY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ARMENIA "Link to this definition")

AUSTRALIA _\= <Calendar.AUSTRALIA: 'AAS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.AUSTRALIA "Link to this definition")

AUSTRALIA\_NSW _\= <Calendar.AUSTRALIA\_NSW: 'BY9'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.AUSTRALIA_NSW "Link to this definition")

AUSTRALIA\_VICTORIA _\= <Calendar.AUSTRALIA\_VICTORIA: 'BZ3'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.AUSTRALIA_VICTORIA "Link to this definition")

AUSTRIA _\= <Calendar.AUSTRIA: 'EAV'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.AUSTRIA "Link to this definition")

BAHRAIN _\= <Calendar.BAHRAIN: 'FDB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BAHRAIN "Link to this definition")

BALTIC\_EXCHANGES _\= <Calendar.BALTIC\_EXCHANGES: 'BY3'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BALTIC_EXCHANGES "Link to this definition")

BANGLADESH _\= <Calendar.BANGLADESH: 'FBD'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BANGLADESH "Link to this definition")

BELGIUM _\= <Calendar.BELGIUM: 'EBA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BELGIUM "Link to this definition")

BERMUDA _\= <Calendar.BERMUDA: 'NBH'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BERMUDA "Link to this definition")

BOSNIA _\= <Calendar.BOSNIA: 'CBA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BOSNIA "Link to this definition")

BOTSWANA _\= <Calendar.BOTSWANA: 'KBG'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BOTSWANA "Link to this definition")

BRAZIL _\= <Calendar.BRAZIL: 'LBR'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BRAZIL "Link to this definition")

BULGARIA _\= <Calendar.BULGARIA: 'DBS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BULGARIA "Link to this definition")

CANADA\_MONTREAL _\= <Calendar.CANADA\_MONTREAL: 'NCM'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CANADA_MONTREAL "Link to this definition")

CANADA\_TORONTO _\= <Calendar.CANADA\_TORONTO: 'NCT'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CANADA_TORONTO "Link to this definition")

CAYMAN\_ISLANDS _\= <Calendar.CAYMAN\_ISLANDS: 'LFC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CAYMAN_ISLANDS "Link to this definition")

CHANNEL\_ISLANDS _\= <Calendar.CHANNEL\_ISLANDS: 'DYC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CHANNEL_ISLANDS "Link to this definition")

CHILE _\= <Calendar.CHILE: 'LCS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CHILE "Link to this definition")

CHINA _\= <Calendar.CHINA: 'FCS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CHINA "Link to this definition")

COLOMBIA _\= <Calendar.COLOMBIA: 'LLB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.COLOMBIA "Link to this definition")

CROATIA _\= <Calendar.CROATIA: 'DCZ'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CROATIA "Link to this definition")

CYPRUS _\= <Calendar.CYPRUS: 'EON'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CYPRUS "Link to this definition")

CZECH\_REPUBLIC _\= <Calendar.CZECH\_REPUBLIC: 'ECP'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.CZECH_REPUBLIC "Link to this definition")

DENMARK _\= <Calendar.DENMARK: 'SDC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.DENMARK "Link to this definition")

DUBAI _\= <Calendar.DUBAI: 'FUB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.DUBAI "Link to this definition")

ECUADOR _\= <Calendar.ECUADOR: 'LKQ'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ECUADOR "Link to this definition")

EGYPT _\= <Calendar.EGYPT: 'KEC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.EGYPT "Link to this definition")

EUROPEAN\_ENERGY _\= <Calendar.EUROPEAN\_ENERGY: 'BY4'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.EUROPEAN_ENERGY "Link to this definition")

ESTONIA _\= <Calendar.ESTONIA: 'DET'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ESTONIA "Link to this definition")

FINLAND _\= <Calendar.FINLAND: 'SFH'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.FINLAND "Link to this definition")

FRANCE _\= <Calendar.FRANCE: 'EFB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.FRANCE "Link to this definition")

GERMANY _\= <Calendar.GERMANY: 'EDA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GERMANY "Link to this definition")

GERMANY\_BAVARIA _\= <Calendar.GERMANY\_BAVARIA: 'BY1'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GERMANY_BAVARIA "Link to this definition")

GERMANY\_BAVARIA\_SPECIAL _\= <Calendar.GERMANY\_BAVARIA\_SPECIAL: 'BZ1'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GERMANY_BAVARIA_SPECIAL "Link to this definition")

GHANA _\= <Calendar.GHANA: 'KJA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GHANA "Link to this definition")

GREECE _\= <Calendar.GREECE: 'EHA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GREECE "Link to this definition")

HONG\_KONG _\= <Calendar.HONG\_KONG: 'FHH'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.HONG_KONG "Link to this definition")

HUNGARY _\= <Calendar.HUNGARY: 'EMB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.HUNGARY "Link to this definition")

ICELAND _\= <Calendar.ICELAND: 'SIR'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ICELAND "Link to this definition")

INDIA _\= <Calendar.INDIA: 'FIB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.INDIA "Link to this definition")

INDONESIA _\= <Calendar.INDONESIA: 'FLJ'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.INDONESIA "Link to this definition")

IRAQ _\= <Calendar.IRAQ: 'FV9'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.IRAQ "Link to this definition")

IRELAND _\= <Calendar.IRELAND: 'EZI'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.IRELAND "Link to this definition")

ISRAEL _\= <Calendar.ISRAEL: 'FZT'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ISRAEL "Link to this definition")

ITALY _\= <Calendar.ITALY: 'EIB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ITALY "Link to this definition")

IVORY\_COAST _\= <Calendar.IVORY\_COAST: 'KIA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.IVORY_COAST "Link to this definition")

JAMAICA _\= <Calendar.JAMAICA: 'LJK'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.JAMAICA "Link to this definition")

JAPAN _\= <Calendar.JAPAN: 'FJH'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.JAPAN "Link to this definition")

JORDAN _\= <Calendar.JORDAN: 'FRA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.JORDAN "Link to this definition")

KAZAKHSTAN _\= <Calendar.KAZAKHSTAN: 'DOA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.KAZAKHSTAN "Link to this definition")

KENYA _\= <Calendar.KENYA: 'KKN'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.KENYA "Link to this definition")

KUWAIT _\= <Calendar.KUWAIT: 'FOK'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.KUWAIT "Link to this definition")

KYRGYZSTAN _\= <Calendar.KYRGYZSTAN: 'DPB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.KYRGYZSTAN "Link to this definition")

LATVIA _\= <Calendar.LATVIA: 'DKR'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.LATVIA "Link to this definition")

LEBANON _\= <Calendar.LEBANON: 'FXB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.LEBANON "Link to this definition")

LITHUANIA _\= <Calendar.LITHUANIA: 'DLV'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.LITHUANIA "Link to this definition")

LUXEMBOURG _\= <Calendar.LUXEMBOURG: 'ELL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.LUXEMBOURG "Link to this definition")

MACEDONIA _\= <Calendar.MACEDONIA: 'DXS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MACEDONIA "Link to this definition")

MALAYSIA _\= <Calendar.MALAYSIA: 'FNK'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MALAYSIA "Link to this definition")

MALTA _\= <Calendar.MALTA: 'EQV'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MALTA "Link to this definition")

MAURITIUS _\= <Calendar.MAURITIUS: 'KPP'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MAURITIUS "Link to this definition")

MEXICO _\= <Calendar.MEXICO: 'LMM'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MEXICO "Link to this definition")

MONGOLIA _\= <Calendar.MONGOLIA: 'GPU'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MONGOLIA "Link to this definition")

MONTENEGRO _\= <Calendar.MONTENEGRO: 'CMA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MONTENEGRO "Link to this definition")

MOROCCO _\= <Calendar.MOROCCO: 'KMC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.MOROCCO "Link to this definition")

NAMIBIA _\= <Calendar.NAMIBIA: 'JXW'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NAMIBIA "Link to this definition")

NETHERLANDS _\= <Calendar.NETHERLANDS: 'ENA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NETHERLANDS "Link to this definition")

NEW\_ZEALAND _\= <Calendar.NEW\_ZEALAND: 'ANA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NEW_ZEALAND "Link to this definition")

NIGERIA _\= <Calendar.NIGERIA: 'KNL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NIGERIA "Link to this definition")

NORWAY _\= <Calendar.NORWAY: 'SNO'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NORWAY "Link to this definition")

OMAN _\= <Calendar.OMAN: 'GOM'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.OMAN "Link to this definition")

PAKISTAN _\= <Calendar.PAKISTAN: 'FQK'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.PAKISTAN "Link to this definition")

PALESTINE _\= <Calendar.PALESTINE: 'GEN'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.PALESTINE "Link to this definition")

PERU _\= <Calendar.PERU: 'LPL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.PERU "Link to this definition")

PHILIPPINES _\= <Calendar.PHILIPPINES: 'FPA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.PHILIPPINES "Link to this definition")

POLAND _\= <Calendar.POLAND: 'EGW'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.POLAND "Link to this definition")

PORTUGAL _\= <Calendar.PORTUGAL: 'EPL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.PORTUGAL "Link to this definition")

QATAR _\= <Calendar.QATAR: 'GQD'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.QATAR "Link to this definition")

ROMANIA _\= <Calendar.ROMANIA: 'EKR'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ROMANIA "Link to this definition")

RUSSIA _\= <Calendar.RUSSIA: 'ERM'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.RUSSIA "Link to this definition")

SAUDI\_ARABIA _\= <Calendar.SAUDI\_ARABIA: 'FWR'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SAUDI_ARABIA "Link to this definition")

SERBIA _\= <Calendar.SERBIA: 'EJB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SERBIA "Link to this definition")

SINGAPORE _\= <Calendar.SINGAPORE: 'FMS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SINGAPORE "Link to this definition")

SLOVAK\_REPUBLIC _\= <Calendar.SLOVAK\_REPUBLIC: 'DRB'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SLOVAK_REPUBLIC "Link to this definition")

SLOVENIA _\= <Calendar.SLOVENIA: 'DVL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SLOVENIA "Link to this definition")

SOUTH\_AFRICA _\= <Calendar.SOUTH\_AFRICA: 'KSJ'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SOUTH_AFRICA "Link to this definition")

SOUTH\_KOREA _\= <Calendar.SOUTH\_KOREA: 'FKS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SOUTH_KOREA "Link to this definition")

SOUTH\_KOREA\_AMAK _\= <Calendar.SOUTH\_KOREA\_AMAK: 'BY5'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SOUTH_KOREA_AMAK "Link to this definition")

SPAIN _\= <Calendar.SPAIN: 'EEA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SPAIN "Link to this definition")

SRI\_LANKA _\= <Calendar.SRI\_LANKA: 'FSC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SRI_LANKA "Link to this definition")

SWEDEN _\= <Calendar.SWEDEN: 'SSS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SWEDEN "Link to this definition")

SWITZERLAND _\= <Calendar.SWITZERLAND: 'ESN'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.SWITZERLAND "Link to this definition")

TAIWAN _\= <Calendar.TAIWAN: 'FAT'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.TAIWAN "Link to this definition")

THAILAND _\= <Calendar.THAILAND: 'FTA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.THAILAND "Link to this definition")

TRINIDAD _\= <Calendar.TRINIDAD: 'LTP'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.TRINIDAD "Link to this definition")

TUNISIA _\= <Calendar.TUNISIA: 'KVT'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.TUNISIA "Link to this definition")

TURKEY _\= <Calendar.TURKEY: 'ETI'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.TURKEY "Link to this definition")

UKRAINE _\= <Calendar.UKRAINE: 'DUK'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UKRAINE "Link to this definition")

UK\_LME _\= <Calendar.UK\_LME: 'EXM'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UK_LME "Link to this definition")

UNITED\_KINGDOM _\= <Calendar.UNITED\_KINGDOM: 'EXL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UNITED_KINGDOM "Link to this definition")

UNITED\_STATES _\= <Calendar.UNITED\_STATES: 'NAY'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UNITED_STATES "Link to this definition")

UNITED\_STATES\_BONDS _\= <Calendar.UNITED\_STATES\_BONDS: 'US\_BOND'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UNITED_STATES_BONDS "Link to this definition")

URUGUAY _\= <Calendar.URUGUAY: 'LUM'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.URUGUAY "Link to this definition")

UZBEKISTAN _\= <Calendar.UZBEKISTAN: 'DZT'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UZBEKISTAN "Link to this definition")

VENEZUELA _\= <Calendar.VENEZUELA: 'LVC'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.VENEZUELA "Link to this definition")

VIETNAM _\= <Calendar.VIETNAM: 'GVH'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.VIETNAM "Link to this definition")

ZAMBIA _\= <Calendar.ZAMBIA: 'KZL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ZAMBIA "Link to this definition")

ZIMBABWE _\= <Calendar.ZIMBABWE: 'KRS'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.ZIMBABWE "Link to this definition")

NYSE\_IRISH\_UCITS _\= <Calendar.NYSE\_IRISH\_UCITS: 'BY6'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NYSE_IRISH_UCITS "Link to this definition")

UCITSONLY _\= <Calendar.UCITSONLY: 'BY8'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.UCITSONLY "Link to this definition")

EUREX _\= <Calendar.EUREX: 'ESF'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.EUREX "Link to this definition")

EURONEXT _\= <Calendar.EURONEXT: 'EURONEXT'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.EURONEXT "Link to this definition")

STOXX _\= <Calendar.STOXX: 'STOXX'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.STOXX "Link to this definition")

GLOBAL\_BUSINESS\_DAY _\= <Calendar.GLOBAL\_BUSINESS\_DAY: 'GB1'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GLOBAL_BUSINESS_DAY "Link to this definition")

GLOBAL\_BUSINESS\_SPECIAL _\= <Calendar.GLOBAL\_BUSINESS\_SPECIAL: 'BY2'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.GLOBAL_BUSINESS_SPECIAL "Link to this definition")

FIVEDAY\_EXCLUDING\_JAN\_1 _\= <Calendar.FIVEDAY\_EXCLUDING\_JAN\_1: 'BZ4'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.FIVEDAY_EXCLUDING_JAN_1 "Link to this definition")

NBL _\= <Calendar.NBL: 'N1BL'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NBL "Link to this definition")

NBLGREP\_GEIP _\= <Calendar.NBLGREP\_GEIP: 'BZ2'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.NBLGREP_GEIP "Link to this definition")

BRAZIL\_FI _\= <Calendar.BRAZIL\_FI: '1AA'>_[#](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.Calendar.BRAZIL_FI "Link to this definition")
