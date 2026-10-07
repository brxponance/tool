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
    _row_outline_levels,
    _safe_float,
)

# Column headers we need beyond the grouping columns. Matched case- and
# whitespace-insensitively because FactSet header text drifts between pulls
# ('Market Cap' vs 'Market Capitalization' was a real instance).
AVG_WEIGHT_HEADERS = ('average weight', 'avg weight', 'port. average weight')
CONTRIB_HEADERS = ('contribution to return', 'contrib to return', 'contribution',
                   'port. contribution to return')
END_WEIGHT_HEADERS = ('port. ending weight', 'ending weight')

# Share-of-benchmark-return figures are reported only when R_b clears this, and
# only when it is positive — below it they diverge, below zero they reverse.
# 50 bps.
RATIO_FLOOR = 0.005

# Groups thinner than this are dropped before ranking: a 0.1 % group can post a
# spectacular ratio on noise and would crowd out everything that matters.
DEFAULT_MIN_WEIGHT = 0.01

# Only the extremes of a metric are offered as themes. A theme is meant to name
# something you could hold a view about — "high-ROE names beat the market" is
# one, "mid-ROE names beat the market" is not: the middle of a distribution has
# no economic direction, so a Q3 bucket topping the table says the cut-points
# landed somewhere, not that anything happened. Dropping Q2–Q4 also removes
# three fifths of the metric candidates, which makes the pair sweep cheaper and
# stops middling buckets displacing real findings in the top ten.
#
# Categorical groupings (sector, country, region) are untouched — every value
# of those is a thing in itself.
THEME_QUINTILES = ('Q1 (High)', 'Q5 (Low)')

# A pair whose weight is ≥ this fraction of a stronger already-surfaced group's
# weight is flagged as nested rather than presented as an independent finding
# (Japan × Semiconductors inside Japan × Info Tech).
NEST_THRESHOLD = 0.90


# Components that are not managers: FactSet's residual plug and the fee /
# transition accounts a client composite carries. They hold real weight and
# real contribution, so they MUST stay in the client totals — dropping them
# breaks Σw = 100 and Σc = the composite's own return. They are flagged
# instead, so they never surface as a manager in a ranking.
def _is_residual_component(name):
    low = str(name or '').strip().lower()
    return (low == 'm4rz' or 'transition' in low or 'fee account' in low)


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

    # A label sitting to the LEFT of the first block is the report-wide range
    # ('30-JUN-2026 to 30-SEP-2026' in column A), not any one block's period.
    # It must be held apart from the per-block labels: counting it among them
    # made len(found) == len(block_bounds) by coincidence, which sent the
    # positional fallback one place off and handed the quarterly Total block
    # September's label. The widest-span rule then picked a MONTH as the
    # quarter, so the tab silently reported July as the quarterly view.
    first_block_start = block_bounds[0][0] if block_bounds else 0
    span_labels = [(c, p) for c, p in found if c >= first_block_start]
    report_label = next((p for c, p in found if c < first_block_start), None)

    def label_for_block(b_idx, start, end):
        # Prefer a label whose cell sits within this block's column span.
        for c_idx, parsed in span_labels:
            if start <= c_idx < end:
                return parsed
        # The trailing block of a FactSet contribution export is headed
        # 'Total' rather than a date range: it is the whole reporting period.
        if report_label is not None and b_idx == len(block_bounds) - 1:
            return report_label
        # Otherwise fall back positionally, then to a synthetic label.
        if len(span_labels) == len(block_bounds):
            return span_labels[b_idx][1]
        if len(block_bounds) == 1 and span_labels:
            return span_labels[0][1]
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
            "ADDED, keeping 'Port. Ending Weight' under that name — the "
            "Exposures grid finds it by name, so it can move but not be "
            "renamed.")

    # ── Sections, and the composite hierarchy ─────────────────────────────
    # A name with an empty SEDOL starts a section. Since the client-composite
    # pull, that is true at two depths: the composite itself, and each manager
    # sleeve inside it. Outline level separates them — composite 0, sleeve 1,
    # holding 2 — and a section runs until the next name row at its own depth
    # or shallower. A composite therefore spans all of its sleeves, which is
    # what makes its aggregate the client portfolio.
    first_sedol = block_bounds[0][0]
    outline = _row_outline_levels(path, sheet)

    def depth(r_idx):
        return outline.get(r_idx + 1, 0)

    def is_name_row(r_idx):
        row = all_rows[r_idx]
        if not row:
            return False
        name = row[0]
        if name is None or not str(name).strip():
            return False
        return first_sedol >= len(row) or row[first_sedol] is None

    name_idxs = [r for r in range(header_idx + 1, len(all_rows)) if is_name_row(r)]
    name_set = set(name_idxs)

    def is_parent(r_idx):
        """True when this section's children are sleeves, not holdings."""
        nxt = r_idx + 1
        if nxt not in name_set:
            return False
        # With grouping present the depths settle it. Without it, a name row
        # directly followed by another name row can only be a parent — the
        # structural reading, which agreed with the outline levels on all 200
        # name rows of the 2026-10-06 pull.
        return depth(nxt) > depth(r_idx) if outline else True

    def section_end(pos):
        """Row index one past this section, i.e. the next sibling or shallower."""
        here = depth(name_idxs[pos])
        for j in range(pos + 1, len(name_idxs)):
            if depth(name_idxs[j]) <= here:
                return name_idxs[j]
            if not outline and not is_parent(name_idxs[pos]):
                return name_idxs[j]
        return len(all_rows)

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
                # FactSet writes percents; store decimals. Values ACCUMULATE
                # rather than replace, because one SEDOL legitimately appears
                # more than once in a span: currency lines repeat under a
                # single code ('AUD999999' and 'Australian Dollar' are both
                # CASH_AUD), and a composite aggregates a holding across every
                # sleeve that owns it. Overwriting silently dropped both.
                slot = rec['periods'].setdefault(
                    label, {'avg_weight': None, 'contribution': None,
                            'end_weight': None})
                for key, val in (('avg_weight', aw), ('contribution', ct),
                                 ('end_weight', ew)):
                    if val is None:
                        continue
                    slot[key] = (slot[key] or 0.0) + val / 100.0
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

    benchmarks, managers, composites = {}, {}, {}
    benchmark_names, manager_names, composite_names = [], [], []
    totals = {}

    for pos, s_idx in enumerate(name_idxs):
        if depth(s_idx) > 0:
            continue          # a sleeve — collected with its composite below
        s_name = str(all_rows[s_idx][0]).strip()
        end = section_end(pos)
        secs = parse_section(s_idx, end)
        if not secs:
            continue
        totals[s_name] = section_totals(s_idx)

        if is_parent(s_idx):
            # A client composite. `secs` is already every holding across every
            # sleeve, summed — the client portfolio in client space. The
            # sleeves are kept beside it, each in CLIENT space too: their
            # weights are shares of the client, not of the manager. The
            # same-named entries under `managers` are the manager-space
            # sections, and the two must never be conflated — rebasing one
            # into the other is the ÷ avg-weight error that measured +912 bps.
            sleeves, sleeve_totals, residual = {}, {}, []
            for j in range(pos + 1, len(name_idxs)):
                c_idx = name_idxs[j]
                if depth(c_idx) <= depth(s_idx):
                    break
                if depth(c_idx) != depth(s_idx) + 1:
                    continue
                c_name = str(all_rows[c_idx][0]).strip()
                sleeves[c_name] = parse_section(c_idx, section_end(j))
                sleeve_totals[c_name] = section_totals(c_idx)
                if _is_residual_component(c_name):
                    residual.append(c_name)
            # Which periods this composite actually carries. A composite can
            # be pulled over a different span than the sleeve sections it sits
            # beside — the 2026-10-06 file had composites for July only, while
            # the sleeves ran all three months plus the quarter. The unpulled
            # blocks are not empty, they are MISALIGNED: the composite's own
            # columns run past one block's width, so block 2+ lands on
            # grouping and metric columns and reads as contribution. Summed,
            # that produced +18,034 % with zero weight behind it. Σw ≈ 1 is the
            # test that tells a real period from a misread one.
            usable = []
            for per in block_periods:
                tw = sum((r['periods'].get(per, {}).get('avg_weight') or 0.0)
                         for r in secs.values())
                if abs(tw - 1.0) < 0.02:
                    usable.append(per)
            composites[s_name] = {
                'securities': secs,
                'sleeves': sleeves,
                'sleeve_totals': sleeve_totals,
                'residual_sleeves': residual,
                'periods': usable,
            }
            composite_names.append(s_name)
        elif is_benchmark_name(s_name):
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
        # Client composites, in CLIENT space: 'securities' is the client
        # portfolio (every sleeve's holdings summed), 'sleeves' each manager's
        # slice of it, 'sleeve_totals' their client weights and contributions,
        # 'residual_sleeves' the fee/transition/M4RZ components that belong in
        # the totals but are not managers.
        'composites': composites,
        'composite_names': composite_names,
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
    phi (share of R_b) and excess_share (phi − w, the overshoot against the
    group's own weight) — both None when |R_b| < RATIO_FLOOR —
    nested_in (label of a dominating group, or None).
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
        for v in THEME_QUINTILES:
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

    # Share of the benchmark's return (φ) against share of its weight. A group
    # holding 20 % of the benchmark would, if it were unremarkable, account for
    # 20 % of the return; φ − w is how far from that it landed, in percentage
    # points of the benchmark's return.
    #
    # This is the same quantity as E_G, rescaled: φ − w = E_G / R_b exactly. So
    # it never becomes the sort key, and it is reported ONLY when R_b is both
    # above the floor and POSITIVE.
    #
    # Negative R_b does not merely make it noisy, it reverses it. Measured on
    # EM's −303 bps July: China cushioned the fall (+243 bps E_G) and reads
    # −80pp, while the momentum pocket that drove the loss (−556 bps E_G) reads
    # +183pp. Read left to right, the column says the exact opposite of what
    # happened — the whole "a 20 % weight should be 20 % of the return" framing
    # presumes there is a positive return to take a share of. E_G keeps one
    # meaning in every regime; this is only its restatement where the
    # restatement is safe.
    ratio_available = r_b >= RATIO_FLOOR
    for row in rows:
        if ratio_available:
            phi = row['c'] / r_b
            row['phi'] = phi
            row['excess_share'] = phi - row['w']
        else:
            row['phi'] = None
            row['excess_share'] = None

    # ── Nesting: flag a group mostly contained in a stronger one ──────────
    ordered = sorted(
        rows, key=lambda r: (-abs(r['e_g']), r['cardinality'], r['label']))

    # Resolving nesting for every candidate is quadratic in the candidate
    # count (7k+ on a real pull) and used to BE the endpoint's runtime: 75.0s
    # of a 75.3s call, 4.4M Python-level iterations each allocating two
    # temporaries. Two changes remove it without changing any answer:
    #
    #   1. One row's test is a single BLAS matrix-vector product against
    #      every stronger row at once, instead of a Python loop.
    #   2. Rows are only tested when a ranking actually asks for them. Each
    #      ranking below walks a sorted list and stops as soon as it is full,
    #      so a few hundred rows get tested rather than all of them.
    #
    # The mask matrix is float32 (125MB at the widest benchmark, freed on
    # return) and built on first use, so include_nested=True barely pays.
    w_f32 = w.astype(np.float32)
    nest_state = {'matrix': None, 'cache': {}}

    def nested_label(i):
        """Label of the strongest group containing ≥ NEST_THRESHOLD of row i."""
        cache = nest_state['cache']
        if i in cache:
            return cache[i]
        row = ordered[i]
        label = None
        if i and row['w']:
            if nest_state['matrix'] is None:
                nest_state['matrix'] = np.array(
                    [r['_mask'] for r in ordered], dtype=np.float32)
            matrix = nest_state['matrix']
            # inter_j = Σ_s w_s · mask_i,s · mask_j,s over every stronger j < i.
            # Ascending indices, so the first hit is the strongest container —
            # the same row the old inner loop broke on.
            inter = matrix[:i] @ (matrix[i] * w_f32)
            hit = np.flatnonzero(inter >= NEST_THRESHOLD * row['w'])
            if hit.size:
                label = ordered[int(hit[0])]['label']
        cache[i] = label
        return label

    # Nested rows are redundant findings ('Energy', 'Oil Gas & Consumable
    # Fuels', 'Energy × Oil Gas & Consumable Fuels' are one story, not three)
    # and would otherwise eat the whole top-N. They do not consume a headline
    # slot, but they keep their nested_in label so the UI can explain why.
    def take(indices, limit):
        """Walk indices in rank order, resolving nesting only as far as needed."""
        picked = []
        for i in indices:
            label = nested_label(i)
            if label is not None and not include_nested:
                continue
            ordered[i]['nested_in'] = label
            picked.append(ordered[i])
            if len(picked) >= limit:
                break
        return picked

    # `ordered` is sorted by -|E_G|, so within the positives that is already
    # -E_G descending and within the negatives it is E_G ascending — the exact
    # orders the two tables want, tie-breaks included.
    contributors = take([i for i, r in enumerate(ordered) if r['e_g'] > 0], top_n)
    detractors = take([i for i, r in enumerate(ordered) if r['e_g'] < 0], top_n)
    # Most outsized relative to weight, the user's framing of the question.
    # Ranked on intensity, not E_G, and reported alongside rather than instead:
    # a big group with a modest tilt and a tiny group with a violent one are
    # both worth knowing about, and neither ranking surfaces the other.
    most_outsized = take(
        sorted((i for i, r in enumerate(ordered)
                if r['intensity'] is not None and r['w'] >= min_weight),
               key=lambda i: (-ordered[i]['intensity'], ordered[i]['cardinality'],
                              ordered[i]['label'])),
        top_n)

    nest_state['matrix'] = None
    for row in rows:
        row.pop('_mask', None)

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


def composite_client(parsed, composite_name):
    """Which client a composite belongs to.

    `section_client` reads the name, which works for 'CALSTRS EAFE+Canada
    Composite' but not for 'Maryland Non US SC Composite' or 'St Louis Public
    Schools'. The sleeves inside always carry the coded prefix, so they vote —
    unanimously, for all 11 composites in the 2026-10-06 pull.
    """
    from collections import Counter
    from holdings_resolver import section_client
    direct = section_client(composite_name)
    if direct:
        return direct
    comp = (parsed.get('composites') or {}).get(composite_name) or {}
    votes = Counter(c for c in (section_client(s) for s in comp.get('sleeves') or {})
                    if c)
    return votes.most_common(1)[0][0] if votes else None


def _theme_predicate(parts, qbreaks):
    """A membership test for one theme, in the benchmark's own quintile space.

    Quintile cut-points come from the benchmark, so 'high P/E' means high
    relative to THAT benchmark — the same convention discover_themes uses, and
    the reason a client's exposure to a theme is comparable to the
    benchmark's.
    """
    checks = []
    for part in parts:
        col = part.get('column')
        val = str(part.get('value', ''))
        if col in CATEGORICAL_COLS:
            checks.append((col, val, None))
        else:
            breaks = (qbreaks or {}).get(col)
            if not breaks:
                return None          # metric absent from this pull
            checks.append((col, val, breaks))

    def match(sec):
        for col, val, breaks in checks:
            if breaks is None:
                if str(sec.get(col) or '').strip() != val:
                    return False
            elif _assign_quintile(sec.get(col), breaks) != val:
                return False
        return True

    return match


def _theme_totals(securities, period, match):
    w = c = 0.0
    for sec in securities.values():
        if not match(sec):
            continue
        d = sec['periods'].get(period) or {}
        w += d.get('avg_weight') or 0.0
        c += d.get('contribution') or 0.0
    return w, c


def client_theme_detail(parsed, benchmark_name, period, composite_name, parts):
    """One theme, read down from the benchmark to the managers who built it.

    Three readings, each in its own space and never converted between:
      * benchmark vs client — the active position,
      * the manager split, in CLIENT space, which sums to the client's own
        weight and contribution,
      * each sleeve against the benchmark in MANAGER space, which is the
        separate question of whether that manager's own bet paid.
    Rebasing one into the other is the ÷ avg-weight error measured at +912 bps.
    """
    comps = parsed.get('composites') or {}
    if composite_name not in comps:
        raise ValueError(f"No composite '{composite_name}' in the uploaded file.")
    if benchmark_name not in (parsed.get('benchmarks') or {}):
        raise ValueError(f"Benchmark '{benchmark_name}' not found in the uploaded file.")
    comp = comps[composite_name]
    per = period or parsed.get('quarter_period')
    if per not in (comp.get('periods') or []):
        available = ', '.join(comp.get('periods') or []) or 'none'
        raise ValueError(
            f"'{composite_name}' has no reconciled data for '{per}'. "
            f"Periods available for this composite: {available}.")

    qbreaks = (parsed.get('quintile_breaks_by_benchmark') or {}).get(benchmark_name, {})
    match = _theme_predicate(parts, qbreaks)
    if match is None:
        raise ValueError(
            "This theme uses a metric that is not in the current pull.")

    bsecs = parsed['benchmarks'][benchmark_name]
    b_w, b_c = _theme_totals(bsecs, per, match)
    c_w, c_c = _theme_totals(comp['securities'], per, match)

    residual = set(comp.get('residual_sleeves') or [])
    managers = []
    for name, secs in comp['sleeves'].items():
        w, c = _theme_totals(secs, per, match)
        if w <= 0 and abs(c) < 1e-12:
            continue
        own = parsed['managers'].get(name)
        own_w = _theme_totals(own, per, match)[0] if own else None
        managers.append({
            'name': name,
            'weight': w,                 # share of the CLIENT
            'contribution': c,
            'contribution_bps': c * 10000.0,
            'share_of_client': (w / c_w) if c_w else None,
            # The sleeve's own weight in the theme, as a share of itself, next
            # to the benchmark's — the manager's bet in manager space.
            'own_weight': own_w,
            'own_active_weight': (own_w - b_w) if own_w is not None else None,
            'is_residual': name in residual,
        })
    managers.sort(key=lambda m: -m['weight'])

    return {
        'benchmark': benchmark_name,
        'period': per,
        'composite': composite_name,
        'client': composite_client(parsed, composite_name),
        'theme': {'label': _group_label(tuple(
                      (p['column'], p['value']) for p in parts)),
                  'parts': parts},
        'benchmark_weight': b_w,
        'benchmark_contribution': b_c,
        'client_weight': c_w,
        'client_contribution': c_c,
        'active_weight': c_w - b_w,
        'impact': c_c - b_c,
        'impact_bps': (c_c - b_c) * 10000.0,
        'managers': managers,
        'reconciliation': {
            'manager_weight_sum': sum(m['weight'] for m in managers),
            'manager_contribution_sum': sum(m['contribution'] for m in managers),
            'matches_client': abs(sum(m['weight'] for m in managers) - c_w) < 5e-6,
        },
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
