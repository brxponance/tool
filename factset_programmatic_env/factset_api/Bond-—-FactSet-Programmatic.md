---
created: 2026-05-11T13:08:32 (UTC -04:00)
tags: []
source: https://fpe.factset.com/docs/bonds.html
author: 
---

# Bond — FactSet Programmatic

> ## Excerpt
> FactSet provides robust fixed-income and derivatives coverage, including global corporate bonds, sovereign debt, securitized products, derivatives, and bank loans. Through FPE’s Bond class, you can combine your proprietary holdings with Factset content and data from rating agencies, constituent-level benchmarks, and global-exchange indices.

---
FactSet provides robust fixed-income and derivatives coverage, including global corporate bonds, sovereign debt, securitized products, derivatives, and bank loans. Through FPE’s Bond class, you can combine your proprietary holdings with Factset content and data from rating agencies, constituent-level benchmarks, and global-exchange indices.

## Bond[#](https://fpe.factset.com/docs/bonds.html#id1 "Link to this heading")

_class_ fds.fpe.quant.bonds.Bond(_symbols_, _time\_series\=None_, _equity\_screen\=False_)[#](https://fpe.factset.com/docs/bonds.html#fds.fpe.quant.bonds.Bond "Link to this definition")

The Bond class allows you to retrieve all issue and issuer-level data on a debt universe, as well as derive analytics from your fixed income portfolio.

Parameters:

-   **symbols** (_list_) – List with bond ISIN Identifier. Alternatively, if equity\_screen=True, a list of equity tickers.
    
-   **time\_series** ([_TimeSeries_](https://fpe.factset.com/docs/dates.html#fds.fpe.dates.TimeSeries "fds.fpe.dates.TimeSeries")_,_ _optional_) – The time series associated with your universe. By default, this will resolve to a default [TimeSeries](https://fpe.factset.com/docs/dates.html#timeseries).
    
-   **equity\_screen** (_bool__,_ _optional_) – If true, pass a list of equity tickers to symbols to return their debt instruments
    

calculate()[#](https://fpe.factset.com/docs/bonds.html#fds.fpe.quant.bonds.Bond.calculate "Link to this definition")

Calculate time-series price and derived analytics data for the issues
