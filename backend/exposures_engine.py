"""
Exposures engine — parses FactSet-style contribution files and computes
weighted portfolio exposure to categorical groups and quintile buckets.

Key design decisions:
- Weights within each portfolio/manager sum to 100 (as percentages).
- Categorical groupings (Region, Country, Sector, Industry): sum the weight
  of all securities in each category bucket.
- Continuous metrics (ROE, P/E, etc.): break the benchmark universe into 5
  equal-count quintiles, then sum the weight of portfolio securities that
  fall in each quintile bucket.
- Quintile boundaries are computed once from the benchmark; all portfolios
  and managers are bucketed using the same boundaries.
- '--' and None are treated as missing. Securities with missing values for a
  specific metric fall into an "Unclassified" bucket for that metric.
- Portfolio weights are normalised by covered weight (managers present in the
  exposure file) so percentages always sum to 100%.  Coverage % is returned
  separately for the UI to display as a caveat.
"""

import math
import re
import numpy as np
import pandas as pd
from rapidfuzz import fuzz, process

# ── Column definitions ─────────────────────────────────────────────────────
CATEGORICAL_COLS = {'MSCI Region', 'MSCI Country', 'GICS Sector', 'GICS Industry'}

CONTINUOUS_COLS = [
    'Market Capitalization',
    'New Custom ROE', 'ROIC', 'Gross Margin NEW', 'Net Margin', 'ROA',
    'New Price to Earnings LTM', 'Price to Earnings - Next Twelve Months NEW',
    'Price to Book', 'Price to FCF NEW', 'Dividend Yield',
    'RSI 63', 'RSI 252',
    'Earnings Growth - 3-5 Year Projected NEW',
    'Earnings Growth - 3 Year Historical NEW', 'Hist 3Yr Sales Growth',
    'Beta (3 yr)', 'Return Vol - 252D', 'Skewness - 252D', 'Kurtosis - 252D',
]

# Short display labels for the UI
DISPLAY_LABELS = {
    'Market Capitalization':                     'Market Cap',
    'New Custom ROE':                            'ROE',
    'ROIC':                                      'ROIC',
    'Gross Margin NEW':                          'Gross Margin',
    'Net Margin':                                'Net Margin',
    'ROA':                                       'ROA',
    'New Price to Earnings LTM':                 'P/E LTM',
    'Price to Earnings - Next Twelve Months NEW':'P/E NTM',
    'Price to Book':                             'P/B',
    'Price to FCF NEW':                          'P/FCF',
    'Dividend Yield':                            'Div Yield',
    'RSI 63':                                    'RSI 63',
    'RSI 252':                                   'RSI 252',
    'Earnings Growth - 3-5 Year Projected NEW':  'EPS Growth 3-5yr',
    'Earnings Growth - 3 Year Historical NEW':   'EPS Growth 3yr',
    'Hist 3Yr Sales Growth':                     'Sales Growth 3yr',
    'Beta (3 yr)':                               'Beta',
    'Return Vol - 252D':                         'Vol 252D',
    'Skewness - 252D':                           'Skewness',
    'Kurtosis - 252D':                           'Kurtosis',
    'MSCI Region':                               'MSCI Region',
    'MSCI Country':                              'MSCI Country',
    'GICS Sector':                               'Sector',
    'GICS Industry':                             'Industry',
}

# Groups for the selector UI (matches FactSet's row 6)
COL_GROUPS = {
    'MSCI Region': 'Categorical',
    'MSCI Country': 'Categorical',
    'GICS Sector': 'Categorical',
    'GICS Industry': 'Categorical',
    'Market Capitalization': 'Size',
    'New Custom ROE': 'Profitability',
    'ROIC': 'Profitability',
    'Gross Margin NEW': 'Profitability',
    'Net Margin': 'Profitability',
    'ROA': 'Profitability',
    'New Price to Earnings LTM': 'Value',
    'Price to Earnings - Next Twelve Months NEW': 'Value',
    'Price to Book': 'Value',
    'Price to FCF NEW': 'Value',
    'Dividend Yield': 'Value',
    'RSI 63': 'Momentum',
    'RSI 252': 'Momentum',
    'Earnings Growth - 3-5 Year Projected NEW': 'Growth',
    'Earnings Growth - 3 Year Historical NEW': 'Growth',
    'Hist 3Yr Sales Growth': 'Growth',
    'Beta (3 yr)': 'Sensitivity',
    'Return Vol - 252D': 'Sensitivity',
    'Skewness - 252D': 'Sensitivity',
    'Kurtosis - 252D': 'Sensitivity',
}

N_QUINTILES = 5


def _safe_float(v):
    """Return float or None for a cell value. Treats '--' as None."""
    if v is None or v == '--':
        return None
    try:
        f = float(v)
        return None if math.isnan(f) or math.isinf(f) else f
    except (TypeError, ValueError):
        return None


def parse_exposures_file(path):
    """
    Parse a FactSet-style contribution XLSX.  Returns a dict:
    {
        'benchmarks':     { name: {sedol: {...}} },   # one or more benchmark portfolios
        'benchmark_name': str,                         # default benchmark (first-listed)
        'benchmark_names':[str, ...],                  # all recognised benchmarks
        'manager_names':  [str, ...],
        'benchmark':      { sedol: {...} },            # default benchmark's securities
        'managers':       { name: { sedol: {...} } },
        'quintile_breaks_by_benchmark': { bmk_name: { col: [q20,q40,q60,q80] } },
        'quintile_breaks':{ col: [...] },              # default benchmark's breaks (back-compat)
        'coverage':       { col: float },              # default benchmark coverage
    }

    Header-row detection: we scan the first ~15 rows for one that contains both
    'SEDOL' and 'Port. Ending Weight' (or 'Ending Weight'). This keeps us
    robust to small upstream format shifts (e.g. an extra metadata row was
    added above the grid, pushing the header from row 7 to row 8).
    """
    import openpyxl
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb['Contribution']
    all_rows = list(ws.iter_rows(values_only=True))
    wb.close()

    # ── Locate the header row ────────────────────────────────────────────
    header_row_idx = None
    for r_idx, row in enumerate(all_rows[:20]):
        str_vals = [str(v).strip() if v is not None else '' for v in row]
        has_sedol  = 'SEDOL' in str_vals
        has_weight = any('Port. Ending Weight' in v or 'Ending Weight' in v
                         for v in str_vals)
        if has_sedol and has_weight:
            header_row_idx = r_idx
            break
    if header_row_idx is None:
        raise ValueError("Could not find header row — expected row containing "
                         "'SEDOL' and 'Port. Ending Weight' in the first 20 rows")

    headers   = all_rows[header_row_idx]
    col_names = list(headers)
    data_start = header_row_idx + 1

    # ── Find portfolio section headers: col A set, col B empty, past header row
    sections = []
    for r_idx, row in enumerate(all_rows):
        if r_idx < data_start:
            continue
        if row[0] is not None and row[1] is None:
            sections.append((r_idx, str(row[0]).strip()))
    sections.append((len(all_rows), '__END__'))

    def parse_section(start, end):
        """Return {sedol: {name, weight, ...col_values}} for rows (start, end)."""
        securities = {}
        for row in all_rows[start + 1:end]:
            if row[0] is None or row[1] is None:
                continue
            name   = str(row[0])
            sedol  = str(row[1])
            weight = _safe_float(row[2])
            if weight is None:
                weight = 0.0
            record = {'name': name, 'weight': weight}
            for i, col in enumerate(col_names):
                if col is None or col in ('Port. Ending Weight',):
                    continue
                record[col] = row[i] if col in CATEGORICAL_COLS else _safe_float(row[i])
            securities[sedol] = record
        return securities

    # ── Split sections into benchmarks vs managers ─────────────────────────
    # A section is treated as a benchmark if its name starts with a known
    # benchmark prefix (MSCI / FTSE / Russell / S&P / Bloomberg) or contains
    # 'Benchmark' / 'Index'. Everything else is a manager portfolio.
    def is_benchmark_name(nm):
        low = nm.lower()
        prefixes = ('msci ', 'ftse ', 'russell ', 's&p ', 'bloomberg ',
                    'stoxx ', 'nikkei ', 'topix ')
        keywords = ('benchmark', 'index')
        return low.startswith(prefixes) or any(k in low for k in keywords)

    benchmarks = {}
    benchmark_names = []
    managers = {}
    manager_names = []

    for i, (s_idx, s_name) in enumerate(sections[:-1]):
        e_idx = sections[i + 1][0]
        parsed = parse_section(s_idx, e_idx)
        if is_benchmark_name(s_name):
            benchmarks[s_name]    = parsed
            benchmark_names.append(s_name)
        else:
            managers[s_name]      = parsed
            manager_names.append(s_name)

    if not benchmarks:
        # Fallback: first section is the benchmark (legacy behavior)
        if sections[:-1]:
            s_idx, s_name = sections[0]
            e_idx         = sections[1][0]
            benchmarks[s_name] = parse_section(s_idx, e_idx)
            benchmark_names    = [s_name]
            # Re-classify: first was misread as manager; remove from managers
            if s_name in managers:
                del managers[s_name]
                manager_names = [n for n in manager_names if n != s_name]

    # ── Compute quintile breaks per benchmark ──────────────────────────────
    quintile_breaks_by_benchmark = {}
    coverage_by_benchmark        = {}
    for bname, bdict in benchmarks.items():
        bsecs = list(bdict.values())
        n_b   = len(bsecs)
        qbreaks, cov = {}, {}
        for col in CONTINUOUS_COLS:
            vals = [s[col] for s in bsecs if s.get(col) is not None]
            cov[col] = (len(vals) / n_b) if n_b else 0.0
            if len(vals) >= N_QUINTILES * 2:
                arr = np.array(vals)
                qbreaks[col] = [
                    float(np.percentile(arr, 20)),
                    float(np.percentile(arr, 40)),
                    float(np.percentile(arr, 60)),
                    float(np.percentile(arr, 80)),
                ]
            else:
                qbreaks[col] = None
        quintile_breaks_by_benchmark[bname] = qbreaks
        coverage_by_benchmark[bname]        = cov

    # Default benchmark = first benchmark listed in file
    default_bmk = benchmark_names[0] if benchmark_names else None

    return {
        'benchmarks':                   benchmarks,
        'benchmark_names':              benchmark_names,
        'benchmark_name':               default_bmk,                  # back-compat
        'benchmark':                    benchmarks.get(default_bmk, {}),  # back-compat
        'manager_names':                manager_names,
        'managers':                     managers,
        'quintile_breaks_by_benchmark': quintile_breaks_by_benchmark,
        'quintile_breaks':              quintile_breaks_by_benchmark.get(default_bmk, {}),  # back-compat
        'coverage_by_benchmark':        coverage_by_benchmark,
        'coverage':                     coverage_by_benchmark.get(default_bmk, {}),  # back-compat
    }


def _assign_quintile(value, breaks):
    """Return quintile label 'Q1 (High)' … 'Q5 (Low)' or 'Unclassified'.
    Convention: Q1 is the highest-value bucket, Q5 is the lowest."""
    if value is None or breaks is None:
        return 'Unclassified'
    if value <= breaks[0]:
        return 'Q5 (Low)'
    elif value <= breaks[1]:
        return 'Q4'
    elif value <= breaks[2]:
        return 'Q3'
    elif value <= breaks[3]:
        return 'Q2'
    else:
        return 'Q1 (High)'


def _quintile_breaks_for_subset(securities, col):
    """Compute [p20, p40, p60, p80] from a securities iterable for column `col`.
    Returns None if fewer than N_QUINTILES * 2 (=10) non-missing values — the
    same sparse-bucket threshold used in parse_exposures_file."""
    if isinstance(securities, dict):
        securities = securities.values()
    vals = [s.get(col) for s in securities]
    vals = [v for v in vals if v is not None]
    if len(vals) < N_QUINTILES * 2:
        return None
    arr = np.array(vals)
    return [
        float(np.percentile(arr, 20)),
        float(np.percentile(arr, 40)),
        float(np.percentile(arr, 60)),
        float(np.percentile(arr, 80)),
    ]


# Per-metric range-label formatter. Falls back to a generic numeric format when
# the column isn't listed (defensive — every entry in CONTINUOUS_COLS is here).
_RANGE_FMT = {
    'Market Capitalization':                       lambda v: f"${v:.0f}B" if abs(v) >= 1 else f"${v:.1f}B",
    'New Custom ROE':                              lambda v: f"{v:.1f}%",
    'ROIC':                                        lambda v: f"{v:.1f}%",
    'Gross Margin NEW':                            lambda v: f"{v:.0f}%",
    'Net Margin':                                  lambda v: f"{v:.1f}%",
    'ROA':                                         lambda v: f"{v:.1f}%",
    'New Price to Earnings LTM':                   lambda v: f"{v:.1f}x",
    'Price to Earnings - Next Twelve Months NEW':  lambda v: f"{v:.1f}x",
    'Price to Book':                               lambda v: f"{v:.2f}x",
    'Price to FCF NEW':                            lambda v: f"{v:.1f}x",
    'Dividend Yield':                              lambda v: f"{v:.1f}%",
    'RSI 63':                                      lambda v: f"{v:.0f}",
    'RSI 252':                                     lambda v: f"{v:.0f}",
    'Earnings Growth - 3-5 Year Projected NEW':    lambda v: f"{v:.1f}%",
    'Earnings Growth - 3 Year Historical NEW':     lambda v: f"{v:.1f}%",
    'Hist 3Yr Sales Growth':                       lambda v: f"{v:.1f}%",
    'Beta (3 yr)':                                 lambda v: f"{v:.2f}",
    'Return Vol - 252D':                           lambda v: f"{v:.0f}%",
    'Skewness - 252D':                             lambda v: f"{v:.2f}",
    'Kurtosis - 252D':                             lambda v: f"{v:.1f}",
}


def _quintile_range_labels(breaks, sub_col):
    """Format the 5 range strings shown next to each quintile label.
    Q1 (High): ≥ p80 · Q2: p60 – p80 · Q3: p40 – p60 · Q4: p20 – p40 · Q5 (Low): < p20."""
    if breaks is None:
        return ['', '', '', '', '']
    fmt = _RANGE_FMT.get(sub_col, lambda v: f"{v:.2f}")
    p20, p40, p60, p80 = breaks
    return [
        f"≥ {fmt(p80)}",                  # ≥
        f"{fmt(p60)} – {fmt(p80)}",       # –
        f"{fmt(p40)} – {fmt(p60)}",
        f"{fmt(p20)} – {fmt(p40)}",
        f"< {fmt(p20)}",
    ]


def _portfolio_exposure_nested(securities, primary_col, sub_col, breaks_by_bucket):
    """Double-bucket a portfolio: {primary_bucket: {child_label: weight}}.
    Children are quintile labels (Q1 (High)…Q5 (Low) + Unclassified for missing
    sub-values). Buckets in `breaks_by_bucket` with value None are sparse —
    their weight goes into a single 'Insufficient data' child instead of
    quintile rows. The 'Unclassified' primary bucket is kept but not expanded."""
    out = {}
    for s in securities.values():
        v = s.get(primary_col)
        parent = str(v) if v is not None and v != '--' else 'Unclassified'
        children = out.setdefault(parent, {})
        if parent == 'Unclassified':
            children[''] = children.get('', 0.0) + s['weight']
            continue
        # Sparse bucket: missing breaks → single 'Insufficient data' child
        if parent in breaks_by_bucket and breaks_by_bucket[parent] is None:
            children['Insufficient data'] = children.get('Insufficient data', 0.0) + s['weight']
            continue
        breaks = breaks_by_bucket.get(parent)
        label  = _assign_quintile(s.get(sub_col), breaks)
        children[label] = children.get(label, 0.0) + s['weight']
    return out


def _portfolio_exposure(securities, col, quintile_breaks):
    """
    Compute exposure of a single portfolio to one grouping.
    Returns {bucket_label: weight_pct} where weight_pct uses the portfolio's
    own weight (0-100 scale from the file).
    """
    buckets = {}
    total_w = sum(s['weight'] for s in securities.values())
    if total_w < 1e-9:
        return {}

    if col in CATEGORICAL_COLS:
        for s in securities.values():
            v = s.get(col)
            label = str(v) if v is not None and v != '--' else 'Unclassified'
            buckets[label] = buckets.get(label, 0.0) + s['weight']
    else:
        breaks = quintile_breaks.get(col)
        for s in securities.values():
            label = _assign_quintile(s.get(col), breaks)
            buckets[label] = buckets.get(label, 0.0) + s['weight']

    return buckets


def _norm_mgr_name(s):
    """Normalise a manager name for sleeve-aware matching. Mirrors the
    matcher in security_risk_engine — preserves size markers (sc/lc/mc)
    so 'CastleArk EAFE + Canada SC' and 'CastleArk EAFE + Canada' don't
    collapse to the same key. Strips regional/style descriptors that vary
    across files for the same underlying portfolio."""
    s = str(s).lower().strip()
    s = re.sub(r'\([^)]*\)', '', s)
    s = re.sub(r'[\./\-_,\+]+', ' ', s)
    s = re.sub(r'\bsmall\s+cap\b', 'sc', s)
    s = re.sub(r'\blarge\s+cap\b', 'lc', s)
    s = re.sub(r'\bmid\s+cap\b',   'mc', s)
    # Compound region+size shorthand
    s = re.sub(r'\bisc\b',  'sc', s)
    s = re.sub(r'\bussc\b', 'sc', s)
    for region in ['international', 'eafe', 'acwi', 'em', 'us', 'usa',
                   'world', 'global', 'xus', 'ex', 'non', 'canada']:
        s = re.sub(r'\b' + re.escape(region) + r'\b', '', s)
    for generic in ['composite', 'portfolio', 'strategy', 'fund',
                    'equity', 'equities', 'growth', 'value', 'blend', 'core']:
        s = re.sub(r'\b' + re.escape(generic) + r'\b', '', s)
    return re.sub(r'\s+', ' ', s).strip()


def _benchmark_region_tokens(bmk):
    """Expand a client-benchmark name into the set of region tokens we'd
    prefer to see in matched manager names. Handles equivalences like
    'MSCI World ex US' ≈ 'MSCI EAFE + Canada' so a portfolio benchmarked
    against 'MSCI World ex US SC' resolves Hillsdale to the EAFE+Canada
    SC sleeve rather than the plain EAFE SC sleeve."""
    if not bmk:
        return set()
    b = str(bmk).lower()
    out = set(re.split(r'[\s\+\-\.,/]+', b))
    out.discard('')
    # Geographic equivalences: "World ex US" / "ACWI ex-US" / "ex-US" ≈ EAFE+Canada
    if ('world' in out and 'ex' in out and 'us' in out) or \
       ('acwi' in out and 'ex' in out and 'us' in out):
        out.update({'eafe', 'canada'})
    # SC / Small Cap canonicalisation
    if 'small' in out and 'cap' in out:
        out.add('sc')
    return out


def _fuzzy_match_manager(name, candidates, threshold=80, benchmark_hint=None):
    """Match a buy-list manager name to a column in the FactSet exposures
    file. Cascade: exact > norm-key > fuzzy fallback. When several file
    rows share a normalised key (e.g. 'Hillsdale EAFE SC' / 'Hillsdale
    EAFE + Canada SC' / 'Hillsdale xUS SC' all collapse to 'hillsdale
    sc'), the tiebreak prefers candidates that share tokens with both
    the weights-file name AND the client benchmark — so Client MD
    (benchmark MSCI World ex US SC) resolves to the EAFE+Canada SC
    variant rather than the plain EAFE SC one."""
    if not name:
        return None
    # Note: don't shortcut on raw `name in candidates` — when several file
    # rows share the same normalised key (Hillsdale EAFE SC vs Hillsdale
    # EAFE + Canada SC vs Hillsdale xUS SC) the exact match would win
    # immediately and bypass the benchmark-aware tiebreak. Always go
    # through the cascade so the benchmark hint can override.
    by_norm = {}
    for n in candidates:
        by_norm.setdefault(_norm_mgr_name(n), []).append(n)
    wt_tokens = set(re.split(r'[\s\+\-\.,/]+', str(name).lower()))
    wt_tokens.discard('')
    bmk_tokens = _benchmark_region_tokens(benchmark_hint)

    def _best_of(originals):
        if len(originals) == 1:
            return originals[0]
        # Three-key sort:
        #   (1) maximise shared tokens with the weights-file name,
        #   (2) maximise shared tokens with the client benchmark
        #       (handles 'MSCI World ex US SC' → EAFE+Canada SC),
        #   (3) minimise extra tokens not in either set
        #       (handles plain 'MSCI EAFE' → EAFE over EAFE+Canada).
        def _key(o):
            ot = set(re.split(r'[\s\+\-\.,/]+', o.lower()))
            ot.discard('')
            shared_w = len(ot & wt_tokens)
            shared_b = len(ot & bmk_tokens)
            extra    = len(ot - wt_tokens - bmk_tokens)
            return (-shared_w, -shared_b, extra)
        return sorted(originals, key=_key)[0]

    wn = _norm_mgr_name(name)
    if wn in by_norm:
        return _best_of(by_norm[wn])
    m = process.extractOne(wn, list(by_norm.keys()),
                           scorer=fuzz.WRatio, score_cutoff=threshold)
    if m:
        return _best_of(by_norm[m[0]])
    # Final fallback: original partial-ratio behaviour, in case the
    # normalisation strips too much for some pathological input
    result = process.extractOne(
        name, candidates, scorer=fuzz.partial_ratio, score_cutoff=threshold,
    )
    return result[0] if result else None


def compute_portfolio_exposures(managers_with_weights, exposures_data, grouping,
                                 benchmark_name=None, sub_grouping=None):
    """
    Compute exposure for a client portfolio to a given grouping.

    Parameters
    ----------
    managers_with_weights : list of dicts
        Each dict has 'matched_name', 'current_weight', 'proposed_weight'
        (weights as fractions 0-1 of the total portfolio).
    exposures_data : dict
        As returned by parse_exposures_file().
    grouping : str
        Column name from CATEGORICAL_COLS or CONTINUOUS_COLS.
    benchmark_name : str, optional
        Which benchmark in the file to compare against. If None, uses the
        default (first-listed) benchmark. If provided but not found, falls
        back to the default and records it in the response.
    sub_grouping : str, optional
        Continuous column for two-level grouping (Mode C). Honored only when
        `grouping` is categorical and `sub_grouping` is continuous; otherwise
        ignored and Mode A or B output is returned. When honored, each
        primary-bucket row gets a `children` array of up to 6 quintile rows
        with breaks computed *per primary bucket*.

    Returns
    -------
    dict with keys: benchmark_name, rows, matched, unmatched,
                    coverage_current, coverage_proposed, display_label.
    Mode C additionally adds: is_nested=True, sub_grouping, sub_label,
                              and per-row children + insufficient_data.
    """
    if exposures_data is None:
        return {'error': 'No exposure data loaded.'}

    exp_managers    = exposures_data['managers']
    benchmarks_all  = exposures_data.get('benchmarks') or {
        exposures_data.get('benchmark_name', ''): exposures_data.get('benchmark', {})
    }
    quintile_all    = exposures_data.get('quintile_breaks_by_benchmark') or {
        exposures_data.get('benchmark_name', ''): exposures_data.get('quintile_breaks', {})
    }

    # Resolve which benchmark to use. Mirrors the matching cascade in the
    # risk endpoint so the user's weights-file label resolves the same way
    # everywhere — exact, then normalized (strip punctuation/whitespace,
    # canonicalise 'SC' / 'Small Cap'), then fuzzy fallback. Without this,
    # 'MSCI EAFE+CANADA' in weights vs 'MSCI EAFE + Canada' in the file
    # silently drops to the file default and the table renders against the
    # wrong benchmark.
    resolved_bmk_name = None
    if benchmark_name:
        if benchmark_name in benchmarks_all:
            resolved_bmk_name = benchmark_name
        else:
            import re as _re
            def _bn(s):
                t = str(s or '').lower()
                for ch in ['+', '-', '/', ',', '.']:
                    t = t.replace(ch, ' ')
                t = _re.sub(r'\bsmall\s+cap\b', 'sc', t)
                return _re.sub(r'\s+', ' ', t).strip()
            target = _bn(benchmark_name)
            for cand in benchmarks_all:
                if _bn(cand) == target:
                    resolved_bmk_name = cand
                    break
            if resolved_bmk_name is None:
                cand_keys = [_bn(c) for c in benchmarks_all]
                cand_orig = list(benchmarks_all)
                m = process.extractOne(target, cand_keys,
                                       scorer=fuzz.WRatio, score_cutoff=80)
                if m:
                    resolved_bmk_name = cand_orig[m[2]]
    if resolved_bmk_name is None:
        # Fall back to the default
        resolved_bmk_name = exposures_data.get('benchmark_name')

    benchmark       = benchmarks_all.get(resolved_bmk_name, {})
    quintile_breaks = quintile_all.get(resolved_bmk_name, {})

    # Note which benchmark we actually used and whether a requested one was missing
    benchmark_fallback = bool(benchmark_name and benchmark_name != resolved_bmk_name)

    candidate_names = list(exp_managers.keys())

    # Match each client manager to a name in the exposure file. Prefer
    # weight_file_name (original weights-file label, e.g. 'Mac Alpha EAFE
    # + Canada SC') over the buy-list matched_name (often a generic
    # 'Mac Alpha') because the weights label carries sleeve-specific
    # info needed to disambiguate LC vs SC and EAFE vs EAFE+Canada
    # variants in the FactSet exposures file.
    matched     = {}   # matched_name -> exposure_file_name
    unmatched   = []
    for m in managers_with_weights:
        nm = m['matched_name']
        match_input = m.get('weight_file_name') or nm
        hit = _fuzzy_match_manager(match_input, candidate_names,
                                    benchmark_hint=resolved_bmk_name)
        if hit:
            matched[nm] = hit
        else:
            unmatched.append(nm)

    # ── Mode C dispatch ────────────────────────────────────────────────────
    # Honored only when grouping is categorical AND sub_grouping is a
    # continuous column. All other combinations fall through to single-axis.
    nested_mode = (
        sub_grouping is not None
        and grouping in CATEGORICAL_COLS
        and sub_grouping in CONTINUOUS_COLS
    )
    if nested_mode:
        return _compute_nested_response(
            managers_with_weights, exposures_data,
            grouping, sub_grouping,
            benchmark, exp_managers, matched, unmatched,
            resolved_bmk_name, benchmark_name, benchmark_fallback,
            benchmarks_all,
        )

    # Benchmark exposure
    bmark_exp = _portfolio_exposure(benchmark, grouping, quintile_breaks)

    # Portfolio exposures — iterate over matched managers
    cur_raw  = {}   # bucket -> weighted contribution
    prop_raw = {}
    cur_covered_wt  = 0.0
    prop_covered_wt = 0.0

    for m in managers_with_weights:
        nm = m['matched_name']
        exp_name = matched.get(nm)
        if exp_name is None:
            continue
        mgr_securities = exp_managers[exp_name]
        mgr_exp = _portfolio_exposure(mgr_securities, grouping, quintile_breaks)

        cw  = float(m.get('current_weight',  0) or 0)
        pw  = float(m.get('proposed_weight', 0) or 0)
        cur_covered_wt  += cw
        prop_covered_wt += pw

        for bucket, pct in mgr_exp.items():
            # pct is 0-100 (within manager); cw is 0-1 fraction of portfolio
            cur_raw[bucket]  = cur_raw.get(bucket,  0.0) + cw  * pct
            prop_raw[bucket] = prop_raw.get(bucket, 0.0) + pw * pct

    # Normalise by covered weight so percentages sum to 100
    def normalise(raw, covered_wt):
        if covered_wt < 1e-9:
            return {}
        return {k: v / covered_wt for k, v in raw.items()}

    cur_norm  = normalise(cur_raw,  cur_covered_wt)
    prop_norm = normalise(prop_raw, prop_covered_wt)

    # Build unified bucket list in a sensible order
    if grouping in CATEGORICAL_COLS:
        # Sort by benchmark weight descending; Unclassified last
        all_buckets = sorted(
            set(bmark_exp) | set(cur_norm) | set(prop_norm),
            key=lambda b: (-bmark_exp.get(b, 0), b)
        )
    else:
        quintile_order = ['Q1 (High)', 'Q2', 'Q3', 'Q4', 'Q5 (Low)', 'Unclassified']
        all_buckets = quintile_order

    # Normalise benchmark to 100 (it already should be, but guard against rounding)
    bmark_total = sum(bmark_exp.values())
    bmark_norm  = {k: v / bmark_total * 100 for k, v in bmark_exp.items()} if bmark_total > 0 else bmark_exp

    # For continuous-only (Mode B) groupings, build the per-quintile range
    # labels from the benchmark-wide breaks so the UI can show ranges
    # like '≥ 25.4 · 17.2 – 25.4 · ...' without the user needing to
    # also pick a categorical sub-grouping. Same labels Mode C builds
    # from per-bucket breaks; here they come from benchmark-wide breaks.
    label_range = {}
    if grouping in CONTINUOUS_COLS:
        breaks = quintile_breaks.get(grouping)
        if breaks is not None:
            range_lbls = _quintile_range_labels(breaks, grouping)
            label_range = dict(zip(['Q1 (High)','Q2','Q3','Q4','Q5 (Low)'], range_lbls))

    rows = []
    for b in all_buckets:
        bw = bmark_norm.get(b, 0.0)
        cw = cur_norm.get(b,   0.0)
        pw = prop_norm.get(b,  0.0)
        if bw < 0.001 and cw < 0.001 and pw < 0.001:
            continue  # skip truly empty rows
        row = {
            'label':         b,
            'benchmark':     round(bw, 2),
            'current':       round(cw, 2),
            'proposed':      round(pw, 2),
            'delta_current': round(cw - bw, 2),
            'delta_proposed':round(pw - bw, 2),
        }
        if b in label_range:
            row['range_label'] = label_range[b]
        rows.append(row)

    cov_src = (exposures_data.get('coverage_by_benchmark', {}).get(resolved_bmk_name)
               or exposures_data.get('coverage', {}))

    return {
        'grouping':            grouping,
        'display_label':       DISPLAY_LABELS.get(grouping, grouping),
        'group_category':      COL_GROUPS.get(grouping, ''),
        'is_categorical':      grouping in CATEGORICAL_COLS,
        'rows':                rows,
        'matched':             list(matched.keys()),
        'unmatched':           unmatched,
        'coverage_current':    round(cur_covered_wt * 100, 1),
        'coverage_proposed':   round(prop_covered_wt * 100, 1),
        'benchmark_coverage':  round(cov_src.get(grouping, 1.0) * 100, 1),
        'benchmark_name':      resolved_bmk_name,
        'benchmark_requested': benchmark_name,
        'benchmark_fallback':  benchmark_fallback,
        'available_benchmarks': list(benchmarks_all.keys()),
    }


def _compute_nested_response(managers_with_weights, exposures_data,
                              grouping, sub_grouping,
                              benchmark, exp_managers, matched, unmatched,
                              resolved_bmk_name, benchmark_name, benchmark_fallback,
                              benchmarks_all):
    """Build the Mode C response: nested parent rows with `children` quintile
    arrays whose breaks are computed *per primary bucket* (not benchmark-wide)."""

    # Step 1 — partition the benchmark by primary bucket and compute per-bucket
    # quintile breaks for the sub-grouping column. Buckets with <10 non-missing
    # values yield None breaks → that bucket is flagged as insufficient_data.
    bmk_subsets = {}
    for s in benchmark.values():
        v = s.get(grouping)
        b = str(v) if v is not None and v != '--' else 'Unclassified'
        bmk_subsets.setdefault(b, []).append(s)

    breaks_by_bucket = {}
    insufficient_buckets = set()
    for b, subset in bmk_subsets.items():
        if b == 'Unclassified':
            continue
        breaks = _quintile_breaks_for_subset(subset, sub_grouping)
        breaks_by_bucket[b] = breaks
        if breaks is None:
            insufficient_buckets.add(b)

    # Step 2 — double-bucket the benchmark and every matched manager.
    bmk_nested = _portfolio_exposure_nested(benchmark, grouping, sub_grouping, breaks_by_bucket)

    cur_raw  = {}   # primary -> {child -> weight}
    prop_raw = {}
    cur_covered_wt  = 0.0
    prop_covered_wt = 0.0
    for m in managers_with_weights:
        nm = m['matched_name']
        exp_name = matched.get(nm)
        if exp_name is None:
            continue
        mgr_securities = exp_managers[exp_name]
        mgr_nested = _portfolio_exposure_nested(mgr_securities, grouping, sub_grouping, breaks_by_bucket)
        cw = float(m.get('current_weight',  0) or 0)
        pw = float(m.get('proposed_weight', 0) or 0)
        cur_covered_wt  += cw
        prop_covered_wt += pw
        for parent, kids in mgr_nested.items():
            cur_raw.setdefault(parent,  {})
            prop_raw.setdefault(parent, {})
            for child_label, pct in kids.items():
                cur_raw[parent][child_label]  = cur_raw[parent].get(child_label, 0.0)  + cw * pct
                prop_raw[parent][child_label] = prop_raw[parent].get(child_label, 0.0) + pw * pct

    # Normalise child weights so the parent totals reconcile to 100% portfolio
    def _norm_nested(raw, covered_wt):
        if covered_wt < 1e-9:
            return {}
        return {p: {c: v / covered_wt for c, v in kids.items()} for p, kids in raw.items()}
    cur_norm  = _norm_nested(cur_raw,  cur_covered_wt)
    prop_norm = _norm_nested(prop_raw, prop_covered_wt)

    # Benchmark normalisation (the benchmark is already on a 0–100 scale, but
    # totals can drift; renormalise to exactly 100 to match Mode A).
    bmk_grand_total = sum(sum(kids.values()) for kids in bmk_nested.values())
    bmk_norm = {}
    if bmk_grand_total > 0:
        for parent, kids in bmk_nested.items():
            bmk_norm[parent] = {c: v / bmk_grand_total * 100 for c, v in kids.items()}
    else:
        bmk_norm = bmk_nested

    # Step 3 — assemble parent rows in benchmark-weight-desc order, Unclassified last.
    def _parent_total(d, p):
        return sum(d.get(p, {}).values())
    all_parents = sorted(
        set(bmk_norm) | set(cur_norm) | set(prop_norm),
        key=lambda p: (p == 'Unclassified', -_parent_total(bmk_norm, p), p),
    )

    quintile_order = ['Q1 (High)', 'Q2', 'Q3', 'Q4', 'Q5 (Low)', 'Unclassified']
    rows = []
    for parent in all_parents:
        bw = _parent_total(bmk_norm,  parent)
        cw = _parent_total(cur_norm,  parent)
        pw = _parent_total(prop_norm, parent)
        if bw < 0.001 and cw < 0.001 and pw < 0.001:
            continue

        row = {
            'label':          parent,
            'benchmark':      round(bw, 2),
            'current':        round(cw, 2),
            'proposed':       round(pw, 2),
            'delta_current':  round(cw - bw, 2),
            'delta_proposed': round(pw - bw, 2),
        }

        if parent == 'Unclassified':
            # Don't expand Unclassified parent — children intentionally absent.
            row['insufficient_data'] = False
        elif parent in insufficient_buckets:
            row['insufficient_data'] = True
            row['children'] = [{
                'label':          'Insufficient data',
                'benchmark':      round(bw, 2),
                'current':        round(cw, 2),
                'proposed':       round(pw, 2),
                'delta_current':  round(cw - bw, 2),
                'delta_proposed': round(pw - bw, 2),
            }]
        else:
            breaks      = breaks_by_bucket.get(parent)
            range_lbls  = _quintile_range_labels(breaks, sub_grouping)
            label_range = dict(zip(['Q1 (High)','Q2','Q3','Q4','Q5 (Low)'], range_lbls))

            bmk_kids   = bmk_norm.get(parent, {})
            cur_kids   = cur_norm.get(parent, {})
            prop_kids  = prop_norm.get(parent, {})
            children = []
            for cl in quintile_order:
                cb = bmk_kids.get(cl,   0.0)
                cc = cur_kids.get(cl,   0.0)
                cp = prop_kids.get(cl,  0.0)
                # Drop the Unclassified child when totally empty
                if cl == 'Unclassified' and cb < 0.001 and cc < 0.001 and cp < 0.001:
                    continue
                child = {
                    'label':          cl,
                    'benchmark':      round(cb, 2),
                    'current':        round(cc, 2),
                    'proposed':       round(cp, 2),
                    'delta_current':  round(cc - cb, 2),
                    'delta_proposed': round(cp - cb, 2),
                }
                if cl in label_range:
                    child['range_label'] = label_range[cl]
                children.append(child)
            row['children'] = children
            row['insufficient_data'] = False

        rows.append(row)

    cov_src = (exposures_data.get('coverage_by_benchmark', {}).get(resolved_bmk_name)
               or exposures_data.get('coverage', {}))

    return {
        'grouping':            grouping,
        'sub_grouping':        sub_grouping,
        'display_label':       DISPLAY_LABELS.get(grouping, grouping),
        'sub_label':           DISPLAY_LABELS.get(sub_grouping, sub_grouping),
        'group_category':      COL_GROUPS.get(grouping, ''),
        'is_categorical':      True,
        'is_nested':           True,
        'rows':                rows,
        'matched':             list(matched.keys()),
        'unmatched':           unmatched,
        'coverage_current':    round(cur_covered_wt * 100, 1),
        'coverage_proposed':   round(prop_covered_wt * 100, 1),
        'benchmark_coverage':  round(cov_src.get(sub_grouping, 1.0) * 100, 1),
        'benchmark_name':      resolved_bmk_name,
        'benchmark_requested': benchmark_name,
        'benchmark_fallback':  benchmark_fallback,
        'available_benchmarks': list(benchmarks_all.keys()),
    }


def get_all_groupings():
    """Return ordered list of all grouping names for the UI selector."""
    return (
        list(CATEGORICAL_COLS) + CONTINUOUS_COLS
    )


def get_grouping_menu():
    """Return structured menu for the UI: list of {group, cols:[{col, label}]}."""
    from collections import OrderedDict
    menu = OrderedDict()
    for col in list(CATEGORICAL_COLS) + CONTINUOUS_COLS:
        grp = COL_GROUPS.get(col, 'Other')
        if grp not in menu:
            menu[grp] = []
        menu[grp].append({'col': col, 'label': DISPLAY_LABELS.get(col, col)})
    return [{'group': g, 'cols': cols} for g, cols in menu.items()]
