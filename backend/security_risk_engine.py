"""
security_risk_engine.py — Stock-level risk factor engine.

Validated against FactSet aggregates: Σ(wᵢ·factorᵢ) bottom-up from
Security-Level Risk DNA, subtracted from benchmark absolute exposures from
Risk Summary tab. Supports US / Non-US / EM regional sleeve breakdown.
"""
from __future__ import annotations
import re, math
from typing import Optional
import openpyxl

STYLE_FACTORS = [
    'Beta', 'Book to Price', 'Dividend Yield', 'Earnings Yield',
    'Growth', 'Leverage', 'Liquidity', 'Momentum',
    'Profitability', 'Size', 'Volatility',
]

# ── Country classification ────────────────────────────────────────────────
EAFE_COUNTRIES = frozenset([
    'Austria','Belgium','Denmark','Finland','France','Germany','Ireland',
    'Israel','Italy','Netherlands','Norway','Portugal','Spain','Sweden',
    'Switzerland','United Kingdom',
    'Australia','New Zealand','Japan','Hong Kong','Singapore',
])
_CANADA = frozenset(['Canada'])
_US     = frozenset(['United States'])
_EM     = frozenset([
    'Brazil','Chile','Colombia','Mexico','Peru','Czech Republic','Egypt',
    'Greece','Hungary','Kuwait','Poland','Qatar','Saudi Arabia',
    'South Africa','Turkey','United Arab Emirates','China','India',
    'Indonesia','South Korea','Malaysia','Philippines','Taiwan','Thailand',
])
EAFE_CANADA  = EAFE_COUNTRIES | _CANADA
WORLD        = EAFE_CANADA | _US
ALL_STANDARD = WORLD | _EM

SLEEVE_US    = 'US'
SLEEVE_NONUS = 'Non-US'
SLEEVE_EM    = 'EM'


def classify_country(country: str, has_em_sleeve: bool = False):
    """Return (region_label, flag_or_None)."""
    if not country or country.strip() in ('--', ''):
        return None, None
    c = country.strip()
    if c in _US:            return SLEEVE_US,    None
    if c in EAFE_COUNTRIES: return SLEEVE_NONUS, None
    if c in _CANADA:        return SLEEVE_NONUS, None
    if c in _EM:
        if has_em_sleeve:   return SLEEVE_EM, None
        return SLEEVE_NONUS, f'{c} is EM — included in Non-US (no EM sleeve)'
    flag = f'{c} not in standard classification — treated as Non-US/EM'
    if has_em_sleeve:       return SLEEVE_EM, flag
    return SLEEVE_NONUS, flag


# ── Sleeve options per benchmark ─────────────────────────────────────────
# (display_label, sleeve_constant, preferred_bench_key)
_SLEEVES = {
    'msci world': [
        ('Full Portfolio',                None,        'MSCI World'),
        ('US vs Russell 1000',            SLEEVE_US,   'Russell 1000'),
        ('Non-US vs MSCI EAFE + Canada',  SLEEVE_NONUS,'MSCI EAFE + Canada'),
    ],
    'msci acwi': [
        ('Full Portfolio',                   None,        'MSCI ACWI'),
        ('US vs Russell 1000',               SLEEVE_US,   'Russell 1000'),
        ('Non-US Dev vs MSCI EAFE + Canada', SLEEVE_NONUS,'MSCI EAFE + Canada'),
        ('EM vs MSCI EM',                    SLEEVE_EM,   'MSCI EM'),
    ],
    'msci acwi ex-us': [
        ('Full Portfolio',                   None,        'MSCI ACWI ex-US'),
        ('Non-US Dev vs MSCI EAFE + Canada', SLEEVE_NONUS,'MSCI EAFE + Canada'),
        ('EM vs MSCI EM',                    SLEEVE_EM,   'MSCI EM'),
    ],
    'msci eafe + canada': [
        ('Full Portfolio', None, 'MSCI EAFE + Canada'),
    ],
    'msci eafe+canada': [
        ('Full Portfolio', None, 'MSCI EAFE + Canada'),
    ],
    'msci eafe sc':        [('Full Portfolio', None, 'MSCI EAFE Small Cap')],
    'msci eafe small cap': [('Full Portfolio', None, 'MSCI EAFE Small Cap')],
    'msci eafe':           [('Full Portfolio', None, 'MSCI EAFE')],
    'msci em':             [('Full Portfolio', None, 'MSCI EM')],
    'russell 1000':        [('Full Portfolio', None, 'Russell 1000')],
    'russell 2000':        [('Full Portfolio', None, 'Russell 2000')],
}


def _norm_bench(s):
    return re.sub(r'[\s\+\-]+', ' ', (s or '').lower()).strip()


def get_sleeve_options(client_bench_str: str, available_benchmarks: list) -> list:
    """Return [{label, sleeve, bench}] for the client's benchmark, filtered
    to only options whose bench column is actually in the uploaded file."""
    key = _norm_bench(client_bench_str)
    options = _SLEEVES.get(key)
    if not options:
        options = [('Full Portfolio', None, client_bench_str or '')]
    avail_norm = {_norm_bench(b): b for b in available_benchmarks}
    result = []
    for label, sleeve, pref in options:
        actual = avail_norm.get(_norm_bench(pref))
        if actual:
            result.append({'label': label, 'sleeve': sleeve, 'bench': actual})
    if not result:
        result.append({'label': 'Full Portfolio', 'sleeve': None, 'bench': None})
    return result


# ── Parser ────────────────────────────────────────────────────────────────
def _coerce(v):
    if v is None or v == '': return None
    try:
        f = float(v)
        return f if math.isfinite(f) else None
    except (TypeError, ValueError):
        return None


def parse_security_risk_file(filepath: str) -> dict:
    """Parse a FactSet Security-Level Risk DNA workbook.

    Returns:
      managers              : {mgr_name: [{security, weight, factors{}, country}]}
      benchmarks            : {bench_name: {factor: float}}
      available_benchmarks  : [str]
      factors               : [str]   style factors found in the file
      as_of_date            : str | None
    """
    wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)
    result = {'managers': {}, 'benchmarks': {}, 'available_benchmarks': [],
              'factors': [], 'as_of_date': None}

    if 'Security-Level Risk DNA' not in wb.sheetnames:
        wb.close(); return result

    ws   = wb['Security-Level Risk DNA']
    rows = list(ws.iter_rows(values_only=True))

    for row in rows[:6]:
        if row[0] and isinstance(row[0], str) and '-' in str(row[0]):
            result['as_of_date'] = str(row[0]).strip(); break

    header_row = rows[7]  # factor names
    factor_cols = {i: str(v).strip() for i, v in enumerate(header_row)
                   if v and str(v).strip() in STYLE_FACTORS}
    result['factors'] = [f for f in STYLE_FACTORS if f in factor_cols.values()]

    current = None
    for row in rows[9:]:
        if not row or row[0] is None: continue
        name = str(row[0]).strip()
        wt   = _coerce(row[1]) if len(row) > 1 else None
        if wt is not None and abs(wt - 100) < 0.5:
            current = name
            result['managers'].setdefault(current, [])
            continue
        if current is None or wt is None: continue
        country = (str(row[2]).strip()
                   if len(row) > 2 and row[2] and str(row[2]).strip() != '--'
                   else None)
        factors = {fname: _coerce(row[ci]) for ci, fname in factor_cols.items()
                   if ci < len(row) and _coerce(row[ci]) is not None}
        result['managers'][current].append(
            {'security': name, 'weight': wt, 'country': country, 'factors': factors})

    if 'Risk Summary' in wb.sheetnames:
        ws2   = wb['Risk Summary']
        rows2 = list(ws2.iter_rows(values_only=True))
        bhdrs = {i: str(v).strip() for i, v in enumerate(rows2[6]) if v and i >= 1}
        result['available_benchmarks'] = list(bhdrs.values())
        for b in bhdrs.values():
            result['benchmarks'][b] = {}
        in_style = False
        for row in rows2[10:]:
            if not row or row[0] is None: continue
            label = str(row[0]).strip()
            if label == 'Style':    in_style = True;  continue
            if label == 'Industry': in_style = False; continue
            if in_style and label in STYLE_FACTORS:
                for ci, bname in bhdrs.items():
                    v = _coerce(row[ci]) if ci < len(row) else None
                    if v is not None:
                        result['benchmarks'][bname][label] = v

    wb.close()
    return result


# ── Name matching ─────────────────────────────────────────────────────────
def _norm_name(s):
    s = str(s).lower().strip()
    s = re.sub(r'\([^)]*\)', '', s)
    s = re.sub(r'[\./\-_,]+', ' ', s)
    for sfx in ['eafe sc','eafe small cap','us lc','us sc','us','eafe',
                'global','isc','em','equity','composite','strategy',
                'growth','value','core','sc','lc','international',
                'small cap','large cap']:
        s = re.sub(r'\b' + re.escape(sfx) + r'\b', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def _match_mgr(weight_name: str, security_names: list) -> Optional[str]:
    wn = _norm_name(weight_name)
    by_norm = {_norm_name(n): n for n in security_names}
    if wn in by_norm: return by_norm[wn]
    try:
        from rapidfuzz import process, fuzz
        m = process.extractOne(wn, list(by_norm.keys()),
                               scorer=fuzz.WRatio, score_cutoff=70)
        if m: return by_norm[m[0]]
    except ImportError:
        pass
    return None


# ── Core computation ──────────────────────────────────────────────────────
def _mgr_abs(stocks: list, factors: list) -> dict:
    tw = sum(s['weight'] for s in stocks)
    if tw <= 0: return {}
    totals = {f: 0.0 for f in factors}
    for s in stocks:
        for f in factors:
            v = s['factors'].get(f)
            if v is not None: totals[f] += s['weight'] * v
    return {f: totals[f] / tw for f in factors}


def compute_exposures(
    portfolio_managers: list,
    security_data: dict,
    benchmark_name: Optional[str],
    sleeve: Optional[str] = None,
) -> dict:
    """Compute current + proposed active style exposures.

    Returns same schema as /compute_risk_exposures (manager-level path) so
    the existing renderRiskExposures() function works without changes.
    """
    factors    = security_data.get('factors') or STYLE_FACTORS
    mgr_data   = security_data.get('managers', {})
    bench_abs  = (security_data.get('benchmarks', {}).get(benchmark_name) or {}) \
                 if benchmark_name else {}
    has_em     = (sleeve == SLEEVE_EM)
    sec_names  = list(mgr_data.keys())

    def compute_side(weight_key: str):
        totals   = {f: 0.0 for f in factors}
        sleeve_w = 0.0
        total_cw = sum(max(m.get(weight_key, 0) or 0, 0) for m in portfolio_managers)
        if total_cw <= 0:
            return {f: None for f in factors}, [], 0.0, set()

        unmatched = []
        flags     = set()

        for m in portfolio_managers:
            cw = m.get(weight_key, 0) or 0
            if cw <= 0: continue
            mgr_key = _match_mgr(m.get('matched_name') or m.get('name', ''), sec_names)
            if mgr_key is None:
                unmatched.append(m.get('matched_name') or m.get('name', '?'))
                continue
            all_stocks = mgr_data.get(mgr_key, [])

            if sleeve is not None:
                stocks = []
                for s in all_stocks:
                    region, flag = classify_country(s.get('country'), has_em)
                    if flag: flags.add(flag)
                    if region == sleeve: stocks.append(s)
            else:
                stocks = all_stocks

            if not stocks: continue

            if sleeve is not None:
                mgr_total = sum(s['weight'] for s in all_stocks) or 1
                contrib   = (cw / total_cw) * (sum(s['weight'] for s in stocks) / mgr_total)
            else:
                contrib   = cw / total_cw

            sleeve_w += contrib
            ma = _mgr_abs(stocks, factors)
            for f in factors:
                if f in ma: totals[f] += contrib * ma[f]

        if sleeve_w <= 0:
            return {f: None for f in factors}, unmatched, 0.0, flags
        return {f: totals[f] / sleeve_w for f in factors}, unmatched, sleeve_w, flags

    cur_abs,  unc_cur,  cur_sw,  cur_flags  = compute_side('current_weight')
    prop_abs, unc_prop, prop_sw, prop_flags = compute_side('proposed_weight')

    def to_active(abs_vals):
        return {f: round(abs_vals[f] - bench_abs[f], 4)
                if abs_vals.get(f) is not None and bench_abs.get(f) is not None
                else abs_vals.get(f)
                for f in factors}

    current  = to_active(cur_abs)
    proposed = to_active(prop_abs)
    delta    = {f: round(proposed[f] - current[f], 4)
                if proposed.get(f) is not None and current.get(f) is not None else None
                for f in factors}

    return {
        'factors':    factors,
        'current':    current,
        'proposed':   proposed,
        'delta':      delta,
        'unmatched':  sorted(set(unc_cur) | set(unc_prop)),
        'benchmark': {
            'matched_column':    benchmark_name,
            'requested':         benchmark_name,
            'fallback_absolute': not bool(bench_abs),
            'available_columns': security_data.get('available_benchmarks', []),
        },
        'sleeve_info': {
            'sleeve':   sleeve,
            'sleeve_wt': round(cur_sw, 4),
            'flags':     sorted(cur_flags | prop_flags),
        },
    }
