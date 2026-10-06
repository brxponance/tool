"""
Attribution engine — benchmark theme discovery (P1).

Parses a FactSet "Contribution" XLSX that carries per-security **Average
Weight** and **Contribution To Return**, then ranks grouping combinations
(sector / industry / country / region / metric-quintile, and pairwise
intersections) by how much they added or cost versus the benchmark's own
average return.

Design notes that matter — see docs/attribution-theme-discovery.md:

* The ranking metric is  E_G = w_G (R_G − R_b) = c_G − w_G·R_b, in return
  units. It NEVER divides by R_b, so it stays meaningful when the benchmark
  return is zero or negative — the case where a share-of-performance ratio
  blows up or silently inverts. It also sums to exactly 0 across a complete
  partition, which is the strongest self-check available here.
* The "outsized" display measure is share of *active dispersion*,
  |E_G| / Σ_s |c_s − w_s·R_b|. Always defined, grouping-independent, and
  bounded by 1.
* φ_G = c_G/R_b (share of benchmark return) is computed only when |R_b|
  clears RATIO_FLOOR, and is returned as a separate, clearly-null-able field.
  It must never rank or gate anything.

This module deliberately mirrors exposures_engine's parsing conventions and
reuses its column vocabulary and quintile assignment so the groupings offered
here are exactly the groupings the Exposures tab already shows.
"""

import re
from datetime import datetime

import numpy as np

from exposures_engine import (
    CATEGORICAL_COLS,
    CONTINUOUS_COLS,
    COLUMN_ALIASES,
    DISPLAY_LABELS,
    N_QUINTILES,
    _assign_quintile,
    _safe_float,
)

# Column headers we need beyond the grouping columns. Matched case- and
# whitespace-insensitively because FactSet header text drifts between pulls
# ('Market Cap' vs 'Market Capitalization' was a real instance).
AVG_WEIGHT_HEADERS = ('average weight', 'avg weight', 'port. average weight')
CONTRIB_HEADERS = ('contribution to return', 'contrib to return', 'contribution')
END_WEIGHT_HEADERS = ('port. ending weight', 'ending weight')

# Below this |R_b| the share-of-benchmark-return ratio is not reported. 50 bps.
RATIO_FLOOR = 0.005

# Groups thinner than this are dropped before ranking: a 0.1 % group can post a
# spectacular ratio on noise and would crowd out everything that matters.
DEFAULT_MIN_WEIGHT = 0.01

# A pair whose weight is ≥ this fraction of a stronger already-surfaced group's
# weight is flagged as nested rather than presented as an independent finding
# (Japan × Semiconductors inside Japan × Info Tech).
NEST_THRESHOLD = 0.90


def _norm_header(v):
    return re.sub(r'\s+', ' ', str(v or '')).strip().lower()


def _match_header(name, candidates):
    n = _norm_header(name)
    return any(n == c for c in candidates)


_DATE_RANGE_RE = re.compile(
    r'(\d{1,2}-[A-Za-z]{3}-\d{4})\s*(?:to|–|-)\s*(\d{1,2}-[A-Za-z]{3}-\d{4})'
)


def _parse_period_label(text):
    """Return (label, start, end) for a 'DD-MON-YYYY to DD-MON-YYYY' string."""
    if not text:
        return None
    m = _DATE_RANGE_RE.search(str(text))
    if not m:
        return None
    try:
        start = datetime.strptime(m.group(1).upper(), '%d-%b-%Y')
        end = datetime.strptime(m.group(2).upper(), '%d-%b-%Y')
    except ValueError:
        return None
    return (m.group(0), start, end)


# ── Parsing ────────────────────────────────────────────────────────────────
def parse_attribution_file(path):
    """
    Parse a FactSet contribution XLSX with Average Weight + Contribution To
    Return. Handles both the single-period layout (today's group-exposures
    pull plus the two new columns) and the multi-block layout (3 monthly
    blocks + a quarterly Total side by side).

    Returns:
    {
      'periods':        [label, ...]               # in file order
      'period_spans':   {label: (start, end)}
      'quarter_period': label | None               # widest span = the quarter
      'benchmarks':     {name: {sedol: record}}
      'benchmark_names':[...]
      'managers':       {name: {sedol: record}}
      'manager_names':  [...]
      'section_totals': {name: {period: total_contribution_or_None}}
      'quintile_breaks_by_benchmark': {bmk: {col: [p20,p40,p60,p80] | None}}
    }

    record = {'name', 'sedol', <grouping cols...>,
              'periods': {label: {'avg_weight', 'contribution', 'end_weight'}}}

    Weights and contributions are stored as DECIMALS (0.0219 = 2.19 %), not the
    percent figures FactSet writes, so downstream algebra needs no unit nudging.
    """
    import openpyxl

    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    sheet = 'Contribution' if 'Contribution' in wb.sheetnames else wb.sheetnames[0]
    ws = wb[sheet]
    all_rows = [list(r) for r in ws.iter_rows(values_only=True)]
    wb.close()

    # ── Header row: the row carrying SEDOL ────────────────────────────────
    header_idx = None
    for r_idx, row in enumerate(all_rows[:25]):
        if any(_norm_header(v) == 'sedol' for v in row):
            header_idx = r_idx
            break
    if header_idx is None:
        raise ValueError(
            "Could not find a header row containing 'SEDOL' in the first 25 "
            "rows — is this a FactSet Contribution export?")

    headers = all_rows[header_idx]
    n_cols = len(headers)

    # ── Blocks: each repeated SEDOL column starts one period block ────────
    sedol_cols = [i for i, v in enumerate(headers) if _norm_header(v) == 'sedol']
    block_bounds = []
    for n, start in enumerate(sedol_cols):
        end = sedol_cols[n + 1] if n + 1 < len(sedol_cols) else n_cols
        block_bounds.append((start, end))

    # ── Period labels: scan the rows above the header for date ranges ─────
    # A multi-block file carries one label per block (positioned near that
    # block's columns); a single-block file carries one label anywhere.
    found = []
    for row in all_rows[:header_idx]:
        for c_idx, v in enumerate(row):
            parsed = _parse_period_label(v)
            if parsed:
                found.append((c_idx, parsed))

    def label_for_block(b_idx, start, end):
        # Prefer a label whose cell sits within this block's column span.
        for c_idx, parsed in found:
            if start <= c_idx < end:
                return parsed
        # Otherwise fall back positionally, then to a synthetic label.
        if len(found) == len(block_bounds):
            return found[b_idx][1]
        if len(block_bounds) == 1 and found:
            return found[0][1]
        return (f'Period {b_idx + 1}', None, None)

    periods, period_spans = [], {}
    block_periods = []
    for b_idx, (start, end) in enumerate(block_bounds):
        label, p_start, p_end = label_for_block(b_idx, start, end)
        # Guard against duplicate labels across blocks.
        if label in period_spans:
            label = f'{label} ({b_idx + 1})'
        periods.append(label)
        period_spans[label] = (p_start, p_end)
        block_periods.append(label)

    # Widest span = the quarterly Total block. With one block, that block.
    quarter_period = None
    spanned = [(lbl, s, e) for lbl, (s, e) in period_spans.items() if s and e]
    if spanned:
        quarter_period = max(spanned, key=lambda t: (t[2] - t[1]).days)[0]
    elif periods:
        quarter_period = periods[-1]

    # ── Column roles within each block ────────────────────────────────────
    def block_cols(start, end):
        roles = {'avg_weight': None, 'contribution': None, 'end_weight': None,
                 'groups': {}}
        for i in range(start, end):
            raw = headers[i]
            if raw is None:
                continue
            canon = COLUMN_ALIASES.get(raw, raw) if isinstance(raw, str) else raw
            if _match_header(raw, AVG_WEIGHT_HEADERS):
                roles['avg_weight'] = i
            elif _match_header(raw, CONTRIB_HEADERS):
                roles['contribution'] = i
            elif _match_header(raw, END_WEIGHT_HEADERS):
                roles['end_weight'] = i
            elif canon in CATEGORICAL_COLS or canon in CONTINUOUS_COLS:
                roles['groups'][canon] = i
        return roles

    block_roles = [block_cols(s, e) for s, e in block_bounds]

    missing = [block_periods[i] for i, r in enumerate(block_roles)
               if r['avg_weight'] is None or r['contribution'] is None]
    if missing:
        raise ValueError(
            "This file has no 'Average Weight' and/or 'Contribution To Return' "
            f"column for: {', '.join(map(str, missing))}. Attribution needs both. "
            "Re-pull the FactSet Contribution report with those two columns "
            "ADDED (keep 'Port. Ending Weight' where it is — the Exposures tab "
            "reads it positionally).")

    # ── Sections: name in col A with col B empty, below the header row ────
    first_sedol = block_bounds[0][0]
    sections = []
    for r_idx in range(header_idx + 1, len(all_rows)):
        row = all_rows[r_idx]
        name = row[0] if row else None
        if name is not None and (first_sedol >= len(row) or row[first_sedol] is None):
            sections.append((r_idx, str(name).strip()))
    sections.append((len(all_rows), '__END__'))

    def is_benchmark_name(nm):
        low = nm.lower()
        prefixes = ('msci ', 'ftse ', 'russell ', 's&p ', 'bloomberg ',
                    'stoxx ', 'nikkei ', 'topix ')
        return low.startswith(prefixes) or 'benchmark' in low or 'index' in low

    def parse_section(start, end):
        securities = {}
        for row in all_rows[start + 1:end]:
            if not row or row[0] is None:
                continue
            if first_sedol >= len(row) or row[first_sedol] is None:
                continue
            sedol = str(row[first_sedol])
            rec = securities.get(sedol)
            if rec is None:
                rec = {'name': str(row[0]), 'sedol': sedol, 'periods': {}}
                securities[sedol] = rec
            for b_idx, roles in enumerate(block_roles):
                label = block_periods[b_idx]
                aw = _safe_float(row[roles['avg_weight']]) if roles['avg_weight'] < len(row) else None
                ct = _safe_float(row[roles['contribution']]) if roles['contribution'] < len(row) else None
                ew = (_safe_float(row[roles['end_weight']])
                      if roles['end_weight'] is not None and roles['end_weight'] < len(row) else None)
                rec['periods'][label] = {
                    # FactSet writes percents; store decimals.
                    'avg_weight': (aw / 100.0) if aw is not None else None,
                    'contribution': (ct / 100.0) if ct is not None else None,
                    'end_weight': (ew / 100.0) if ew is not None else None,
                }
                # Groupings are identical across blocks — take the first that
                # supplies a value so a sparse block can't blank them out.
                for col, c_idx in roles['groups'].items():
                    if c_idx >= len(row):
                        continue
                    if rec.get(col) is None:
                        rec[col] = (row[c_idx] if col in CATEGORICAL_COLS
                                    else _safe_float(row[c_idx]))
        return securities

    def section_totals(hdr_row_idx):
        """The section header row carries FactSet's own portfolio totals —
        a free checksum for Σ contribution. Returns {period: total|None}."""
        row = all_rows[hdr_row_idx]
        out = {}
        for b_idx, roles in enumerate(block_roles):
            idx = roles['contribution']
            val = _safe_float(row[idx]) if idx is not None and idx < len(row) else None
            out[block_periods[b_idx]] = (val / 100.0) if val is not None else None
        return out

    benchmarks, managers = {}, {}
    benchmark_names, manager_names = [], []
    totals = {}

    for i, (s_idx, s_name) in enumerate(sections[:-1]):
        secs = parse_section(s_idx, sections[i + 1][0])
        if not secs:
            continue
        totals[s_name] = section_totals(s_idx)
        if is_benchmark_name(s_name):
            benchmarks[s_name] = secs
            benchmark_names.append(s_name)
        else:
            managers[s_name] = secs
            manager_names.append(s_name)

    if not benchmarks:
        raise ValueError(
            "No benchmark section recognised. Benchmark sections are detected "
            "by name (MSCI/FTSE/Russell/S&P/..., or containing 'Index' or "
            f"'Benchmark'). Sections found: {', '.join(manager_names) or 'none'}")

    # ── Quintile breaks, computed per benchmark exactly as exposures does ──
    qb_by_bmk = {}
    for bname, bsecs in benchmarks.items():
        secs = list(bsecs.values())
        qb = {}
        for col in CONTINUOUS_COLS:
            vals = [s[col] for s in secs if s.get(col) is not None]
            if len(vals) >= N_QUINTILES * 2:
                arr = np.array(vals, dtype=float)
                qb[col] = [float(np.percentile(arr, p)) for p in (20, 40, 60, 80)]
            else:
                qb[col] = None
        qb_by_bmk[bname] = qb

    return {
        'periods': periods,
        'period_spans': period_spans,
        'quarter_period': quarter_period,
        'benchmarks': benchmarks,
        'benchmark_names': benchmark_names,
        'managers': managers,
        'manager_names': manager_names,
        'section_totals': totals,
        'quintile_breaks_by_benchmark': qb_by_bmk,
        'n_blocks': len(block_bounds),
    }


# ── Theme discovery ────────────────────────────────────────────────────────
def _part_label(col, val):
    """A categorical value names itself ('Japan', 'Energy'). A quintile does
    not — 'Q1 (High)' is meaningless without the metric, and two different
    metrics' Q1 buckets would otherwise render identically."""
    if col in CONTINUOUS_COLS:
        return f'{DISPLAY_LABELS.get(col, col)} {val}'
    return str(val)


def _group_label(parts):
    """[('Country','Japan'), ('GICS Sector','Information Technology')]
       → 'Japan × Information Technology'
       [('New Custom ROE','Q1 (High)')] → 'ROE Q1 (High)'"""
    return ' × '.join(_part_label(c, v) for c, v in parts)


def _group_detail(parts):
    return ' · '.join(f'{DISPLAY_LABELS.get(c, c)}: {v}' for c, v in parts)


def discover_themes(parsed, benchmark_name=None, period=None,
                    min_weight=DEFAULT_MIN_WEIGHT, top_n=10,
                    max_cardinality=2, include_unclassified=False,
                    include_nested=False):
    """
    Rank grouping combinations in one benchmark for one period.

    Returns {'benchmark', 'period', 'r_b', 'dispersion', 'contributors',
             'detractors', 'reconciliation', 'ratio_available'}.

    Every row carries: label, detail, members, w (decimal), r_g, excess
    (R_G − R_b), e_g (decimal), e_g_bps, share (of active dispersion),
    phi (share of R_b, or None when |R_b| < RATIO_FLOOR), ratio (phi/w, or
    None), nested_in (label of a dominating group, or None).
    """
    bname = benchmark_name or (parsed['benchmark_names'][0]
                               if parsed['benchmark_names'] else None)
    if bname not in (parsed.get('benchmarks') or {}):
        raise ValueError(f"Benchmark '{bname}' not found in the uploaded file.")
    secs_map = parsed['benchmarks'][bname]
    per = period or parsed.get('quarter_period') or (parsed['periods'][-1])

    secs = list(secs_map.values())
    w = np.array([(s['periods'].get(per, {}).get('avg_weight') or 0.0) for s in secs])
    c = np.array([(s['periods'].get(per, {}).get('contribution') or 0.0) for s in secs])

    r_b = float(c.sum())
    # Per-security excess vs holding at the benchmark's own return. This is the
    # quantity E_G aggregates, so the dispersion denominator is its L1 norm.
    e_s = c - w * r_b
    dispersion = float(np.abs(e_s).sum())

    qbreaks = (parsed.get('quintile_breaks_by_benchmark') or {}).get(bname, {})

    # ── Candidate singles: (column, value) → boolean mask ─────────────────
    singles = {}
    for col in sorted(CATEGORICAL_COLS):
        vals = [s.get(col) for s in secs]
        for v in sorted({str(x).strip() for x in vals if x not in (None, '')}):
            mask = np.array([str(s.get(col) or '').strip() == v for s in secs])
            if mask.any():
                singles[(col, v)] = mask
    for col in CONTINUOUS_COLS:
        br = qbreaks.get(col)
        if not br:
            continue
        labels = [_assign_quintile(s.get(col), br) for s in secs]
        for v in ('Q1 (High)', 'Q2', 'Q3', 'Q4', 'Q5 (Low)'):
            mask = np.array([lb == v for lb in labels])
            if mask.any():
                singles[(col, v)] = mask

    if not include_unclassified:
        singles = {k: m for k, m in singles.items()
                   if str(k[1]).lower() != 'unclassified'}

    # ── Weight floor, applied to singles first ────────────────────────────
    # w(A ∩ B) ≤ min(w(A), w(B)), so a single below the floor cannot appear in
    # any qualifying pair. Pruning here keeps the pair sweep small.
    viable = {k: m for k, m in singles.items() if float(w[m].sum()) >= min_weight}

    candidates = {(k,): m for k, m in viable.items()}

    if max_cardinality >= 2:
        keys = list(viable.keys())
        for i in range(len(keys)):
            for j in range(i + 1, len(keys)):
                a, b = keys[i], keys[j]
                if a[0] == b[0]:
                    continue  # same column — disjoint values, never intersect
                mask = viable[a] & viable[b]
                if not mask.any():
                    continue
                if float(w[mask].sum()) < min_weight:
                    continue
                candidates[(a, b)] = mask

    rows = []
    for parts, mask in candidates.items():
        w_g = float(w[mask].sum())
        if w_g < min_weight:
            continue
        c_g = float(c[mask].sum())
        e_g = c_g - w_g * r_b
        rows.append({
            'label': _group_label(parts),
            'detail': _group_detail(parts),
            'parts': [{'column': col, 'value': val} for col, val in parts],
            'cardinality': len(parts),
            'members': int(mask.sum()),
            'w': w_g,
            'c': c_g,
            'r_g': (c_g / w_g) if w_g else None,
            'excess': ((c_g / w_g) - r_b) if w_g else None,
            'e_g': e_g,
            'e_g_bps': e_g * 10000.0,
            'share': (abs(e_g) / dispersion) if dispersion else None,
            # Share of dispersion per unit of weight — the robust analogue of
            # the φ/w ratio, defined at every R_b including 0 and negative.
            # >1 means the group drives more of the benchmark's active
            # dispersion than its size alone would imply. This is the
            # "outsized" measure; E_G is the "how much it moved" measure.
            'intensity': ((abs(e_g) / dispersion) / w_g)
                         if (dispersion and w_g) else None,
            '_mask': mask,
        })

    ratio_available = abs(r_b) >= RATIO_FLOOR
    for row in rows:
        if ratio_available:
            phi = row['c'] / r_b
            row['phi'] = phi
            row['ratio'] = (phi / row['w']) if row['w'] else None
        else:
            row['phi'] = None
            row['ratio'] = None

    # ── Nesting: flag a group mostly contained in a stronger one ──────────
    ordered = sorted(
        rows, key=lambda r: (-abs(r['e_g']), r['cardinality'], r['label']))
    for i, row in enumerate(ordered):
        row['nested_in'] = None
        for stronger in ordered[:i]:
            inter = float(w[row['_mask'] & stronger['_mask']].sum())
            if row['w'] and inter / row['w'] >= NEST_THRESHOLD:
                row['nested_in'] = stronger['label']
                break

    for row in rows:
        row.pop('_mask', None)

    # Nested rows are redundant findings ('Energy', 'Oil Gas & Consumable
    # Fuels', 'Energy × Oil Gas & Consumable Fuels' are one story, not three)
    # and would otherwise eat the whole top-N. They stay in `all_rows` so the
    # UI can expand a parent, but they do not consume a headline slot.
    headline = ordered if include_nested else [r for r in ordered
                                               if not r['nested_in']]

    contributors = sorted([r for r in headline if r['e_g'] > 0],
                          key=lambda r: (-r['e_g'], r['cardinality'], r['label']))[:top_n]
    detractors = sorted([r for r in headline if r['e_g'] < 0],
                        key=lambda r: (r['e_g'], r['cardinality'], r['label']))[:top_n]
    # Most outsized relative to weight, the user's framing of the question.
    # Ranked on intensity, not E_G, and reported alongside rather than instead:
    # a big group with a modest tilt and a tiny group with a violent one are
    # both worth knowing about, and neither ranking surfaces the other.
    most_outsized = sorted(
        [r for r in headline if r['intensity'] is not None and r['w'] >= min_weight],
        key=lambda r: (-r['intensity'], r['cardinality'], r['label']))[:top_n]

    return {
        'benchmark': bname,
        'period': per,
        'periods': parsed.get('periods', []),
        'r_b': r_b,
        'r_b_bps': r_b * 10000.0,
        'dispersion': dispersion,
        'ratio_available': ratio_available,
        'ratio_floor_bps': RATIO_FLOOR * 10000.0,
        'min_weight': min_weight,
        'n_securities': len(secs),
        'n_candidates': len(rows),
        'contributors': contributors,
        'detractors': detractors,
        'most_outsized': most_outsized,
        'reconciliation': reconcile(parsed, bname, per),
    }


def reconcile(parsed, benchmark_name, period):
    """Checks that must pass before any ranking is trustworthy."""
    secs = list(parsed['benchmarks'][benchmark_name].values())
    w = np.array([(s['periods'].get(period, {}).get('avg_weight') or 0.0) for s in secs])
    c = np.array([(s['periods'].get(period, {}).get('contribution') or 0.0) for s in secs])
    r_b = float(c.sum())

    reported = (parsed.get('section_totals', {})
                .get(benchmark_name, {}).get(period))

    # Σ E_G over a complete partition must be 0. GICS Sector is the natural one;
    # every security carries a value (missing → its own bucket), so it partitions.
    buckets = {}
    for i, s in enumerate(secs):
        key = str(s.get('GICS Sector') or 'Unclassified')
        buckets.setdefault(key, []).append(i)
    partition_sum = 0.0
    for idxs in buckets.values():
        idx = np.array(idxs)
        partition_sum += float(c[idx].sum()) - float(w[idx].sum()) * r_b

    return {
        'sum_weight': float(w.sum()),
        'sum_weight_ok': abs(float(w.sum()) - 1.0) < 5e-4,
        'sum_contribution': r_b,
        'reported_total': reported,
        'total_matches_reported': (
            None if reported is None else abs(reported - r_b) < 5e-5),
        'partition_sum_e_g': partition_sum,
        'partition_sum_ok': abs(partition_sum) < 1e-9,
    }
