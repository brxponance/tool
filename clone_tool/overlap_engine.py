"""
Holdings-overlap engine — computes pairwise security overlap between the
managers held in a client portfolio, using the security-level holdings parsed
from the FactSet exposures file (parse_exposures_file → exposures_data).

Two questions the matrix answers, per pair (A, B):

  1. Strategy similarity — how alike are the two portfolios, ignoring how much
     of the client is in each. Uses each manager's INTERNAL weights (the
     FactSet position weights, which sum to ~100% per manager).

  2. Client doubling-up — how much of the actual client portfolio is the same
     bet held twice. Uses each manager's internal weights SCALED by that
     manager's allocation in the client portfolio (current or proposed).

For each pair we report, on each weight basis:

  * shared_count       — number of SEDOLs held by both managers
  * common_weight      — Σ over shared SEDOLs of min(w_A, w_B)   (symmetric)
  * a_in_shared        — Σ over shared SEDOLs of w_A             (directional)
  * b_in_shared        — Σ over shared SEDOLs of w_B             (directional)
  * jaccard            — |A ∩ B| / |A ∪ B|   (count-based similarity, 0-1)

Manager → exposure-file matching reuses _fuzzy_match_manager from
exposures_engine so the held managers map to the exact same holdings the
Exposures tab uses.

Weight convention
-----------------
FactSet position weights arrive as percentages (e.g. 2.19 = 2.19%). We keep
them as percentages internally and report common/directional weights as
percentages. Client allocation weights come in as fractions 0-1 (matching the
rest of the tool); the scaled basis multiplies the manager's within-portfolio
percentage by its client allocation fraction, so a manager at 25% of the
client holding a name at 4% of its own book contributes 1.0% on the scaled
basis.
"""

import numpy as np

from exposures_engine import _fuzzy_match_manager

import re

# ── Issuer-level key normalisation ─────────────────────────────────────────
# When match_basis='issuer', two holdings collapse to the same security if
# they resolve to the same issuer key. This strips share-class, depositary-
# receipt (ADR/GDR/ADS), and preferred/registered-share markers from the
# security name so that e.g. "Alphabet Inc. Class A" and "Alphabet Inc.
# Class C" — or "Naspers Ltd. Class N" and its ADR, or a Chinese issuer's
# A-share and H-share — all fold into one issuer.
#
# Order matters: strip the trailing class/receipt/pref markers first, then
# normalise punctuation and common corporate suffixes so "A.P. Moller -
# Maersk A/S" and "AP Moller Maersk" would still align.

# Trailing markers, applied repeatedly until the name stabilises (a name can
# carry more than one, e.g. "Sea Limited Sponsored ADR Class A").
_TRAILING_MARKERS = re.compile(
    r'\s+('
    r'sponsored\s+adr(\s+reg\s*s)?|unsponsored\s+adr|sponsored\s+ads|adr|ads|gdr|gds'
    r'|class\s+[a-z0-9]+'
    r'|cl\s+[a-z0-9]+'
    r'|series\s+[a-z0-9]+'
    r'|ser\s+[a-z0-9]+'
    r'|reg\s*s(\s+shs)?|regs'
    r'|registered\s+sh(are)?s?(\s+non[- ]?voting)?'
    r'|bearer\s+sh(are)?s?'
    r'|non[- ]?cum\s+perp\s+pfd.*'
    r'|pfd(\s+shs?)?(\s+series\s+[a-z0-9]+)?(\s+non[- ]?voting)?(\s+registered\s+shs?)?(\s+[a-z0-9]+)?'
    r'|pref(erred)?(\s+shs?)?(\s+non[- ]?voting)?'
    r'|non[- ]?voting(\s+sh(are)?s?)?'
    r'|voting(\s+sh(are)?s?)?'
    r'|ord(inary)?(\s+sh(are)?s?)?'
    r'|(common\s+)?shs?(\s+new)?'
    r'|units?(\s+cons.*)?'
    r'|new'
    r')\s*$',
    re.IGNORECASE,
)

# Corporate-form suffixes stripped once markers are gone, so the residual key
# is the bare issuer name. Kept conservative to avoid merging distinct firms.
_CORP_SUFFIXES = re.compile(
    r'\b('
    r'incorporated|inc|corporation|corp|company|companies|co|limited|ltd|llc|lp|plc'
    r'|holdings?|group|grp|the'
    r'|ag|kgaa|se|sa|s\.?a\.?b\.?(\s+de\s+c\.?v\.?)?|nv|n\.?v\.?|a\.?s|a\.?b|as|ab'
    r'|oyj|oy|spa|s\.?p\.?a|asa|aps|bhd|tbk|pjsc|pcl|psc'
    r')\b',
    re.IGNORECASE,
)


def _issuer_key(name):
    """Collapse a security name to an issuer-level key. Returns a lowercase,
    punctuation-normalised issuer string. Falls back to the cleaned full name
    if stripping would leave nothing.

    Guard against over-merging: corporate-form suffixes are only stripped when
    doing so leaves a reasonably distinctive key (>= 2 tokens, or a single
    token of >= 6 chars). Otherwise we keep the corporate form attached, so
    e.g. 'Tokai Corp.' and 'Tokai Holdings Corporation' stay distinct rather
    than both collapsing to 'tokai'."""
    if not name:
        return ''
    s = str(name).strip()
    # 1) Strip trailing class / receipt / preferred markers, repeatedly.
    for _ in range(4):
        new = _TRAILING_MARKERS.sub('', s).strip().rstrip('.,;-')
        if new == s:
            break
        s = new
    core = s
    # 2) Normalise punctuation to spaces.
    base = re.sub(r'[.,/&\-()]+', ' ', s.lower())
    base = re.sub(r'\s+', ' ', base).strip()
    # 3) Attempt corporate-form suffix removal.
    stripped = _CORP_SUFFIXES.sub(' ', base)
    stripped = re.sub(r'\s+', ' ', stripped).strip()
    toks = stripped.split()
    # Only accept the suffix-stripped key if it stays distinctive; a single
    # short token (e.g. 'tokai') is too weak an identity claim, so keep the
    # full punctuation-normalised name (which retains 'holdings'/'corp' etc).
    if toks and (len(toks) >= 2 or len(toks[0]) >= 6):
        return stripped
    return base or core.lower()


def _pair_metrics(secs_a, secs_b):
    """Given two {key: weight} dicts (weights already on the desired basis),
    return the pairwise overlap metrics."""
    keys_a = set(secs_a.keys())
    keys_b = set(secs_b.keys())
    shared = keys_a & keys_b
    union  = keys_a | keys_b

    common      = 0.0
    a_in_shared = 0.0
    b_in_shared = 0.0
    for k in shared:
        wa = secs_a[k]
        wb = secs_b[k]
        common      += min(wa, wb)
        a_in_shared += wa
        b_in_shared += wb

    jaccard = (len(shared) / len(union)) if union else 0.0
    return {
        'shared_count': len(shared),
        'common_weight': round(common, 4),
        'a_in_shared':  round(a_in_shared, 4),
        'b_in_shared':  round(b_in_shared, 4),
        'jaccard':      round(jaccard, 4),
    }


def _manager_holdings(securities, match_basis):
    """Return {key: {'weight': pct, 'name': display, 'sedol': one_sedol,
    'sector':.., 'country':..}} for one manager's securities dict.

    match_basis='sedol'  → key is the SEDOL (exact security).
    match_basis='issuer' → key is the issuer key; positions in multiple share
                           classes of the same issuer are SUMMED, and the
                           highest-weight variant's metadata represents the
                           group (so the drill-down shows a sensible name).
    """
    out = {}
    for sedol, rec in securities.items():
        w = float(rec.get('weight', 0) or 0)
        nm = rec.get('name') or str(sedol)
        if match_basis == 'issuer':
            key = _issuer_key(nm) or str(sedol)
        else:
            key = sedol
        if key not in out:
            out[key] = {'weight': 0.0, 'name': nm, 'sedol': sedol,
                        'sector': rec.get('GICS Sector') or '',
                        'country': rec.get('MSCI Country') or '',
                        '_topw': w, 'n_lines': 0}
        grp = out[key]
        grp['weight'] += w
        grp['n_lines'] += 1
        # Keep the display metadata from the largest-weight constituent.
        if w >= grp['_topw']:
            grp['_topw'] = w
            grp['name'] = nm
            grp['sedol'] = sedol
            grp['sector'] = rec.get('GICS Sector') or grp['sector']
            grp['country'] = rec.get('MSCI Country') or grp['country']
    return out


def compute_holdings_overlap(managers_with_weights, exposures_data,
                             benchmark_name=None, weight_state='current',
                             match_basis='sedol'):
    """
    Compute the pairwise holdings-overlap matrix for a client portfolio.

    Parameters
    ----------
    managers_with_weights : list of dicts
        Each dict has 'matched_name', optionally 'weight_file_name',
        'current_weight', 'proposed_weight' (allocations as fractions 0-1).
        Only managers with a positive allocation on the chosen `weight_state`
        are included.
    exposures_data : dict
        As returned by parse_exposures_file().
    benchmark_name : str, optional
        Used only as a matching hint for _fuzzy_match_manager (helps
        disambiguate LC vs SC / EAFE vs EAFE+Canada sleeves).
    weight_state : 'current' | 'proposed'
        Which client allocation drives the 'scaled' (client doubling-up)
        basis and which managers are included.

    Returns
    -------
    dict with keys:
        managers   : [ {name, display, count, alloc}, ... ]   (matrix axis order)
        pairs      : [ {i, j, name_i, name_j,
                        internal: {...}, scaled: {...}}, ... ]   (i < j)
        unmatched  : [name, ...]   held managers with no exposure-file holdings
        weight_state, benchmark_name
    """
    if exposures_data is None:
        return {'error': 'No exposure data loaded.'}

    exp_managers = exposures_data.get('managers') or {}
    if not exp_managers:
        return {'error': 'Exposure file has no manager holdings.'}

    candidate_names = list(exp_managers.keys())
    wkey = 'proposed_weight' if weight_state == 'proposed' else 'current_weight'

    # ── Select held managers on the chosen basis, match to the file ─────────
    held   = []   # list of dicts: {name, display, alloc, exp_name}
    unmatched = []
    seen_exp = set()
    for m in managers_with_weights:
        alloc = float(m.get(wkey, 0) or 0)
        if alloc <= 0:
            continue
        display = m.get('matched_name') or m.get('weight_file_name') or '?'
        match_input = m.get('weight_file_name') or m.get('matched_name')
        exp_name = _fuzzy_match_manager(match_input, candidate_names,
                                        benchmark_hint=benchmark_name)
        if not exp_name:
            unmatched.append(display)
            continue
        # Guard against two held managers resolving to the same file row
        # (would double-count); keep the first, flag the rest as unmatched.
        if exp_name in seen_exp:
            unmatched.append(display)
            continue
        seen_exp.add(exp_name)
        held.append({'name': display, 'display': display,
                     'alloc': alloc, 'exp_name': exp_name})

    if len(held) < 2:
        return {
            'managers':   [{'name': h['name'], 'display': h['display'],
                            'count': len(_manager_holdings(exp_managers[h['exp_name']], match_basis)),
                            'alloc': round(h['alloc'] * 100, 2)} for h in held],
            'pairs':      [],
            'unmatched':  unmatched,
            'weight_state': weight_state,
            'benchmark_name': benchmark_name,
            'match_basis': match_basis,
            'note': 'Need at least two matched managers with a positive '
                    f'{weight_state} weight to build an overlap matrix.',
        }

    # ── Pre-extract each manager's holdings on both weight bases ────────────
    # Holdings are first collapsed per the match_basis ('sedol' = exact,
    # 'issuer' = share classes summed into one issuer). internal uses the
    # collapsed within-manager pct; scaled multiplies by the client alloc.
    internal = []
    scaled   = []
    counts   = []
    for h in held:
        holds = _manager_holdings(exp_managers[h['exp_name']], match_basis)
        i_w = {k: v['weight'] for k, v in holds.items()}
        s_w = {k: w * h['alloc'] for k, w in i_w.items()}
        internal.append(i_w)
        scaled.append(s_w)
        counts.append(len(holds))

    n = len(held)
    axis = [{'name': h['name'], 'display': h['display'],
             'count': counts[k],
             'alloc': round(h['alloc'] * 100, 2)}
            for k, h in enumerate(held)]

    pairs = []
    for i in range(n):
        for j in range(i + 1, n):
            im = _pair_metrics(internal[i], internal[j])
            sm = _pair_metrics(scaled[i], scaled[j])
            pairs.append({
                'i': i, 'j': j,
                'name_i': held[i]['name'], 'name_j': held[j]['name'],
                'internal': im,
                'scaled':   sm,
            })

    return {
        'managers':   axis,
        'pairs':      pairs,
        'unmatched':  unmatched,
        'weight_state': weight_state,
        'benchmark_name': benchmark_name,
        'match_basis': match_basis,
    }


def compute_pair_detail(managers_with_weights, exposures_data, name_i, name_j,
                        benchmark_name=None, weight_state='current',
                        top_n=None, match_basis='sedol'):
    """
    Return the shared-security detail for one pair, for the drill-down panel.

    Output rows are sorted by combined internal weight (w_i + w_j) descending.
    When match_basis='issuer', share classes are collapsed per issuer before
    the intersection is taken (weights summed within each manager).
    Each row: {sedol, name, sector, country,
               wi_internal, wj_internal, wi_scaled, wj_scaled, n_lines}.
    """
    if exposures_data is None:
        return {'error': 'No exposure data loaded.'}
    exp_managers = exposures_data.get('managers') or {}
    candidate_names = list(exp_managers.keys())
    wkey = 'proposed_weight' if weight_state == 'proposed' else 'current_weight'

    def _resolve(target_display):
        for m in managers_with_weights:
            display = m.get('matched_name') or m.get('weight_file_name') or '?'
            if display != target_display:
                continue
            alloc = float(m.get(wkey, 0) or 0)
            match_input = m.get('weight_file_name') or m.get('matched_name')
            exp_name = _fuzzy_match_manager(match_input, candidate_names,
                                            benchmark_hint=benchmark_name)
            return exp_name, alloc
        return None, 0.0

    exp_i, alloc_i = _resolve(name_i)
    exp_j, alloc_j = _resolve(name_j)
    if not exp_i or not exp_j:
        return {'error': 'One or both managers not found in exposure file.'}

    holds_i = _manager_holdings(exp_managers[exp_i], match_basis)
    holds_j = _manager_holdings(exp_managers[exp_j], match_basis)
    shared = set(holds_i.keys()) & set(holds_j.keys())

    rows = []
    for key in shared:
        ri = holds_i[key]
        rj = holds_j[key]
        wi = float(ri.get('weight', 0) or 0)
        wj = float(rj.get('weight', 0) or 0)
        n_lines = ri.get('n_lines', 1) + rj.get('n_lines', 1)
        rows.append({
            'sedol':       ri.get('sedol') or rj.get('sedol') or key,
            'name':        ri.get('name') or rj.get('name') or key,
            'sector':      ri.get('sector') or rj.get('sector') or '',
            'country':     ri.get('country') or rj.get('country') or '',
            'wi_internal': round(wi, 4),
            'wj_internal': round(wj, 4),
            'wi_scaled':   round(wi * alloc_i, 4),
            'wj_scaled':   round(wj * alloc_j, 4),
            # Number of underlying share-class lines folded into this row
            # across both managers (>2 signals a genuine multi-class collapse).
            'n_lines':     n_lines if match_basis == 'issuer' else 0,
        })
    rows.sort(key=lambda r: (r['wi_internal'] + r['wj_internal']), reverse=True)
    if top_n:
        rows = rows[:int(top_n)]

    return {
        'name_i': name_i, 'name_j': name_j,
        'exp_i': exp_i, 'exp_j': exp_j,
        'alloc_i': round(alloc_i * 100, 2), 'alloc_j': round(alloc_j * 100, 2),
        'shared_count': len(shared),
        'rows': rows,
        'weight_state': weight_state,
        'match_basis': match_basis,
    }
