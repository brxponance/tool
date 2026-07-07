"""
Portfolio Optimizer — MILP-based portfolio construction.

Maximizes weighted normalized skill (Σ wᵢ · ns_zᵢ) subject to:
  - Σ wᵢ = 100%
  - Per-manager weight is semi-continuous: 0 OR in [min_weight, max_weight]
  - Manager-count cardinality: min_managers ≤ N_selected ≤ max_managers
  - Portfolio 3-factor V-G ∈ [vg_center − vg_band, vg_center + vg_band]
  - **At most one strategy per firm** (so the optimizer never picks both
    "Bayard" and "Bayard xUS")
  - **For EAFE peer group, any manager with "xUS" in the name is excluded**
    from the candidate set (xUS strategies have EM exposure and don't fit
    an EAFE benchmark)
  - Forced managers honored at user-specified weights (override the [min,max]
    band per user spec); they consume part of the weight budget AND count
    toward the cardinality. Forcing a manager also blocks any OTHER strategy
    from the same firm from being suggested.

Solver: scipy.optimize.milp (HiGHS backend). Fast for the typical N≈30-50
candidate count of a single buy-list peer group.

Candidate universe is restricted to the client's peer group on the buy list
(clone_results[peer_group]). Forced managers may come from other peer groups
but the optimizer itself never *suggests* outside the peer group.
"""

import re
import numpy as np
from scipy.optimize import milp, LinearConstraint, Bounds


# ── Defaults ──────────────────────────────────────────────────────────────
DEFAULT_MIN_WEIGHT  = 0.05
DEFAULT_MAX_WEIGHT  = 0.20
DEFAULT_MIN_MGRS    = 4
DEFAULT_MAX_MGRS    = 8
DEFAULT_VG_BAND     = 0.07
DEFAULT_VG_CENTER   = 0.0


# ── Firm-key extraction ───────────────────────────────────────────────────
# Tokens that indicate a strategy descriptor rather than the firm name.
# Stripped from the right of a manager name to derive the firm key. Two
# strategies from the same firm map to the same firm_key.
_STRATEGY_TOKENS = {
    'xus', 'isc', 'sc', 'eafe', 'em', 'acwi', 'lcg', 'lcv',
    'mcg', 'mcv', 'micro', 'global', 'concentrated', 'value', 'growth',
    'small', 'cap', 'mid', 'large', 'canada', 'world',
    'core', 'plus', 'select', 'focus', 'focused', 'fund', 'strategy',
    'international', 'equity', 'emerging', 'markets', 'ex', 'us',
    'developed', 'all', 'multi', 'multicap',
}


def _firm_key(name):
    """Strip strategy descriptors from the right of a manager name to derive
    a 'firm' identifier. Used to enforce 'at most one strategy per firm'.

    Examples:
      'Bayard'             → 'bayard'
      'Bayard xUS'         → 'bayard'
      'IMC EAFE SC'        → 'imc'
      'CastleArk EAFE+Canada Concentrated' → 'castleark'
      'Bridge City SC'     → 'bridge city'     (preserves multi-word firms)
      'Eastern Shore SC'   → 'eastern shore'
    """
    if not name:
        return ''
    normalized = (str(name)
                  .replace('+', ' ').replace(',', ' ')
                  .replace('/', ' ').replace('-', ' ').strip())
    tokens = normalized.split()
    while tokens and tokens[-1].lower().strip('.()[]') in _STRATEGY_TOKENS:
        tokens.pop()
    if not tokens:
        return str(name).strip().lower()
    return ' '.join(t.lower() for t in tokens)


def _has_xus(name):
    """True if the manager name contains 'xUS' or 'ex US' (any case).
    Used to filter EAFE candidate sets — xUS strategies include EM and
    are not appropriate for EAFE-benchmarked portfolios."""
    if not name:
        return False
    s = str(name).lower()
    # Match xus, x-us, x us, ex-us, ex us — but not random 'us' in larger words
    if re.search(r'\bx\s*[- ]?\s*us\b', s):
        return True
    if re.search(r'\bex\s*[- ]?\s*us\b', s):
        return True
    return False


def _lookup_manager(clone_results, norm_skill_by_tab, tab, name):
    """Return (clone_dict, ns_z) for a manager in a given tab, or (None, None)."""
    clone = (clone_results.get(tab) or {}).get(name)
    if clone is None:
        # Whitespace-normalized fallback (matches _norm_skill_for behavior in app.py)
        key_norm = str(name or '').strip().lower()
        for k, v in (clone_results.get(tab) or {}).items():
            if str(k or '').strip().lower() == key_norm:
                clone = v
                name = k  # use the canonical name
                break
    if clone is None:
        return None, None, name
    ns_rec = (norm_skill_by_tab.get(tab) or {}).get(name) or {}
    if not ns_rec:
        # whitespace fallback for norm skill
        key_norm = str(name or '').strip().lower()
        for k, v in (norm_skill_by_tab.get(tab) or {}).items():
            if str(k or '').strip().lower() == key_norm:
                ns_rec = v
                break
    ns_z = ns_rec.get('z') if ns_rec else None
    return clone, ns_z, name


def optimize_portfolio(
    peer_group,
    forced_managers,
    clone_results,
    norm_skill_by_tab,
    min_weight=DEFAULT_MIN_WEIGHT,
    max_weight=DEFAULT_MAX_WEIGHT,
    min_managers=DEFAULT_MIN_MGRS,
    max_managers=DEFAULT_MAX_MGRS,
    vg_band=DEFAULT_VG_BAND,
    vg_center=DEFAULT_VG_CENTER,
    time_limit=30,
):
    """Run the MILP and return a result dict.

    Returns dict with keys:
      status: 'ok' | 'infeasible' | 'error' | 'warning'
      error: human-readable message (when not 'ok')
      optimized_managers: list of {name, tab, weight, vg_3factor, vg_full,
                                   ns_z, r2_full, is_forced}
      summary: {portfolio_vg_3factor, expected_norm_skill, n_managers,
                total_weight, n_forced, n_selected, candidates_considered,
                vg_band, vg_center, min_weight, max_weight,
                min_managers, max_managers}
      detail: only present on infeasible — info about why
    """
    forced_managers = forced_managers or []

    # ── 1. Resolve and validate forced managers ──────────────────────────
    # Two flavors of "forced":
    #   - PINNED (weight > 0): locked at the user's exact weight, taken out
    #     of the MILP entirely (counted toward budget/V-G/cardinality manually)
    #   - REQUIRED (no weight): MUST be included by the optimizer but the
    #     optimizer picks their weight in [min_weight, max_weight]
    #
    # Both flavors block other strategies from the same firm from being
    # suggested by the optimizer.
    pinned_records = []
    required_records = []
    forced_firms = set()
    forced_total_weight = 0.0
    forced_vg_contribution = 0.0
    forced_skill_contribution = 0.0
    forced_skill_uncov_weight = 0.0
    for fm in forced_managers:
        name = fm.get('name') or fm.get('matched_name')
        tab = fm.get('tab')
        try:
            raw_w = fm.get('weight')
            weight = float(raw_w) if raw_w not in (None, '', 0) else 0.0
        except (TypeError, ValueError):
            weight = 0.0
        if not name or not tab:
            continue
        clone, ns_z, canonical = _lookup_manager(clone_results, norm_skill_by_tab, tab, name)
        if clone is None:
            return {
                'status': 'error',
                'error': f"Forced manager '{name}' not found in buy list tab '{tab}'.",
            }
        vg3 = float(clone.get('vg_3factor', 0) or 0)
        fk = _firm_key(canonical)
        if fk in forced_firms:
            return {
                'status': 'error',
                'error': f"Two forced managers share the same firm ('{fk}'). "
                         f"Only one strategy per firm is allowed.",
            }
        forced_firms.add(fk)
        rec = {
            'name': canonical,
            'tab': tab,
            'vg_3factor': vg3,
            'vg_full': float(clone.get('vg_full', 0) or 0),
            'ns_z': float(ns_z) if ns_z is not None else None,
            'r2_full': clone.get('r2_full'),
            'firm_key': fk,
            'is_forced': True,
        }
        if weight > 0:
            rec['weight'] = weight
            rec['forced_kind'] = 'pinned'
            pinned_records.append(rec)
            forced_total_weight += weight
            forced_vg_contribution += weight * vg3
            if ns_z is not None:
                forced_skill_contribution += weight * float(ns_z)
            else:
                forced_skill_uncov_weight += weight
        else:
            rec['forced_kind'] = 'required'
            required_records.append(rec)

    if forced_total_weight > 1.0 + 1e-6:
        return {
            'status': 'error',
            'error': f"Forced weights total {forced_total_weight*100:.1f}%, exceeds 100%.",
        }

    K_pinned = len(pinned_records)
    K_required = len(required_records)
    if K_pinned + K_required > max_managers:
        return {
            'status': 'error',
            'error': f"You forced {K_pinned + K_required} managers but max allowed is {max_managers}.",
        }

    # ── 2. Build candidate set (buy-list managers in peer_group only) ────
    # Filters applied to the natural peer_group loop:
    #   (a) Same-tab pinned/required managers — handled separately
    #   (b) Any strategy from a firm with a forced manager (one strategy
    #       per firm — the user's pick wins)
    #   (c) For peer_group == 'EAFE', any manager with 'xUS'/'ex US' in name
    #   (d) Candidates without a norm skill score (optimizer can't rank them)
    #
    # Required managers (no user-specified weight) are then APPENDED at the
    # end of the candidate list with y_required=True. They can be from any
    # peer-group tab — that's how a user pulls e.g. an ISC small-cap manager
    # into an EAFE optimization without giving it a fixed weight.
    forced_keys = {(rec['tab'], rec['name']) for rec in (pinned_records + required_records)}
    exclude_xus = (peer_group == 'EAFE')
    candidates = []
    candidates_excluded_no_skill = 0
    candidates_excluded_xus = 0
    candidates_excluded_forced_firm = 0
    peer_clone = clone_results.get(peer_group, {}) or {}
    for name, clone in peer_clone.items():
        if (peer_group, name) in forced_keys:
            continue
        fk = _firm_key(name)
        if fk in forced_firms:
            candidates_excluded_forced_firm += 1
            continue
        if exclude_xus and _has_xus(name):
            candidates_excluded_xus += 1
            continue
        ns_rec = (norm_skill_by_tab.get(peer_group) or {}).get(name) or {}
        ns_z = ns_rec.get('z')
        if ns_z is None:
            candidates_excluded_no_skill += 1
            continue
        candidates.append({
            'name': name,
            'tab': peer_group,
            'vg_3factor': float(clone.get('vg_3factor', 0) or 0),
            'vg_full': float(clone.get('vg_full', 0) or 0),
            'ns_z': float(ns_z),
            'r2_full': clone.get('r2_full'),
            'firm_key': fk,
            'y_required': False,
        })

    # Append REQUIRED forced managers as fixed-include candidates. Missing
    # norm skill is allowed — user explicitly chose to include them.
    for rec in required_records:
        candidates.append({
            'name': rec['name'],
            'tab': rec['tab'],
            'vg_3factor': rec['vg_3factor'],
            'vg_full': rec['vg_full'],
            'ns_z': rec['ns_z'] if rec['ns_z'] is not None else 0.0,
            'r2_full': rec['r2_full'],
            'firm_key': rec['firm_key'],
            'y_required': True,
            'is_forced': True,
        })

    N = len(candidates)
    if N == 0 and forced_total_weight < 1.0 - 1e-6:
        return {
            'status': 'error',
            'error': (f"No buy-list candidates in peer group '{peer_group}' "
                      f"with a normalized skill score. "
                      f"({candidates_excluded_no_skill} candidates missing norm skill.)"),
        }

    # ── 3. Derive residual constraints for the optimizer ─────────────────
    # MILP cardinality applies to ALL candidates (regular + required). Required
    # managers have y_required=True so their y_i is forced to 1 — that already
    # gets counted in the y_sum below. We only need to subtract K_pinned from
    # the user-facing cardinality (since pinned managers live outside MILP).
    remaining_weight = 1.0 - forced_total_weight
    k_min = max(0, min_managers - K_pinned)
    k_max = max(0, max_managers - K_pinned)
    if k_min > N:
        return {
            'status': 'error',
            'error': (f"Need at least {k_min} more managers from {peer_group} buy list "
                      f"but only {N} candidates are available."),
        }

    # V-G band the optimizer's contribution must fall within (vs PINNED V-G;
    # required-only V-G is part of the MILP variable contribution)
    vg_lo = (vg_center - vg_band) - forced_vg_contribution
    vg_hi = (vg_center + vg_band) - forced_vg_contribution

    # Special case: pinned fills 100% of budget (no room for MILP variables)
    if remaining_weight < 1e-9:
        if K_required > 0:
            return {
                'status': 'error',
                'error': ('Pinned weights total 100% but you also required additional '
                          'managers — there is no budget left for them.'),
            }
        total_vg = forced_vg_contribution
        in_band = (vg_center - vg_band - 1e-6) <= total_vg <= (vg_center + vg_band + 1e-6)
        summary = {
            'portfolio_vg_3factor': total_vg,
            'expected_norm_skill': forced_skill_contribution,
            'n_managers': K_pinned,
            'total_weight': forced_total_weight,
            'n_forced': K_pinned,
            'n_selected': 0,
            'candidates_considered': N,
            'vg_band': vg_band,
            'vg_center': vg_center,
            'min_weight': min_weight,
            'max_weight': max_weight,
            'min_managers': min_managers,
            'max_managers': max_managers,
            'skill_uncovered_weight': forced_skill_uncov_weight,
        }
        if k_min > 0:
            return {
                'status': 'error',
                'error': 'Pinned weights total 100% but cardinality requires additional managers.',
            }
        if not in_band:
            return {
                'status': 'warning',
                'error': (f'Pinned portfolio V-G ({total_vg*100:+.2f}%) is outside the '
                          f'±{vg_band*100:.0f}% band. No optimizer adjustment possible.'),
                'optimized_managers': pinned_records,
                'summary': summary,
            }
        return {
            'status': 'ok',
            'optimized_managers': pinned_records,
            'summary': summary,
        }

    # ── 4. Build MILP ────────────────────────────────────────────────────
    # Variables: [x_0..x_{N-1}, y_0..y_{N-1}]   (2N total)
    n_vars = 2 * N

    # Objective: maximize Σ x_i · ns_z_i  ⇔  minimize -Σ x_i · ns_z_i
    c = np.zeros(n_vars)
    for i, cand in enumerate(candidates):
        c[i] = -cand['ns_z']

    integrality = np.zeros(n_vars)
    integrality[N:] = 1  # binary inclusion flags

    # Bounds: x_i ∈ [0, min(max_weight, remaining_weight)], y_i ∈ {0,1}.
    # For REQUIRED candidates, force y_i = 1 by setting lb[N+i] = 1.
    upper_w = min(max_weight, remaining_weight)
    lb = np.zeros(n_vars)
    ub = np.ones(n_vars)
    ub[:N] = upper_w
    ub[N:] = 1.0
    for i, cand in enumerate(candidates):
        if cand.get('y_required'):
            lb[N + i] = 1.0  # binary forced to 1
    bounds = Bounds(lb=lb, ub=ub)

    # Linear constraints
    rows, los, his = [], [], []

    # (1) Σ x_i = remaining_weight
    r = np.zeros(n_vars); r[:N] = 1.0
    rows.append(r); los.append(remaining_weight); his.append(remaining_weight)

    # (2) k_min ≤ Σ y_i ≤ k_max
    r = np.zeros(n_vars); r[N:] = 1.0
    rows.append(r); los.append(float(k_min)); his.append(float(k_max))

    # (3) vg_lo ≤ Σ vg_i · x_i ≤ vg_hi
    r = np.zeros(n_vars)
    for i, cand in enumerate(candidates):
        r[i] = cand['vg_3factor']
    rows.append(r); los.append(vg_lo); his.append(vg_hi)

    # (4) x_i ≥ min_weight · y_i   ⇔   x_i − min_weight·y_i ≥ 0
    # (5) x_i ≤ max_weight · y_i   ⇔   x_i − max_weight·y_i ≤ 0
    for i in range(N):
        r = np.zeros(n_vars); r[i] = 1.0; r[N + i] = -min_weight
        rows.append(r); los.append(0.0); his.append(np.inf)
        r = np.zeros(n_vars); r[i] = 1.0; r[N + i] = -max_weight
        rows.append(r); los.append(-np.inf); his.append(0.0)

    # (6) At most one strategy per firm: for each firm with >1 candidate,
    #     Σ y_i (over that firm's strategies) ≤ 1
    firm_to_idx = {}
    for i, cand in enumerate(candidates):
        firm_to_idx.setdefault(cand['firm_key'], []).append(i)
    firm_groups_constrained = 0
    for fk, idxs in firm_to_idx.items():
        if len(idxs) < 2:
            continue
        r = np.zeros(n_vars)
        for i in idxs:
            r[N + i] = 1.0
        rows.append(r); los.append(-np.inf); his.append(1.0)
        firm_groups_constrained += 1

    A = np.array(rows)
    constraints = LinearConstraint(A, np.array(los), np.array(his))

    # ── 5. Solve ─────────────────────────────────────────────────────────
    result = milp(
        c,
        constraints=constraints,
        integrality=integrality,
        bounds=bounds,
        options={'time_limit': time_limit, 'presolve': True, 'disp': False},
    )

    if not result.success or result.x is None:
        return {
            'status': 'infeasible',
            'error': (f'No feasible portfolio satisfies all constraints. '
                      f'Solver message: {result.message}'),
            'detail': {
                'candidates': N,
                'forced_count': K_pinned + K_required,
                'pinned_count': K_pinned,
                'required_count': K_required,
                'remaining_budget': remaining_weight,
                'cardinality_range': [k_min, k_max],
                'optimizer_vg_band': [vg_lo, vg_hi],
                'forced_vg_contribution': forced_vg_contribution,
                'forced_total_weight': forced_total_weight,
            },
        }

    # ── 6. Extract solution ──────────────────────────────────────────────
    x = np.asarray(result.x[:N], dtype=float)
    EPS = 1e-5

    selected = []           # picked by the optimizer (not required, not pinned)
    required_picked = []    # required candidates with weight chosen by optimizer
    for i, cand in enumerate(candidates):
        w = float(x[i])
        if w > EPS:
            rec = dict(cand)
            rec['weight'] = w
            if cand.get('y_required'):
                rec['is_forced'] = True
                rec['forced_kind'] = 'required'
                required_picked.append(rec)
            else:
                rec['is_forced'] = False
                selected.append(rec)

    # Combine: pinned first, then required-picked, then optimizer-picked.
    # Within each group, sort by weight desc.
    all_managers = []
    for fr in pinned_records:
        all_managers.append(dict(fr))
    required_picked.sort(key=lambda m: -m['weight'])
    all_managers.extend(required_picked)
    selected.sort(key=lambda m: -m['weight'])
    all_managers.extend(selected)

    total_vg = sum(m['weight'] * m['vg_3factor'] for m in all_managers)
    total_skill = sum(
        m['weight'] * (m.get('ns_z') or 0)
        for m in all_managers
        if m.get('ns_z') is not None
    )
    total_weight = sum(m['weight'] for m in all_managers)
    skill_uncov_weight = sum(
        m['weight'] for m in all_managers if m.get('ns_z') is None
    )
    n_forced_total = K_pinned + len(required_picked)

    return {
        'status': 'ok',
        'optimized_managers': all_managers,
        'summary': {
            'portfolio_vg_3factor': total_vg,
            'expected_norm_skill': total_skill,
            'n_managers': len(all_managers),
            'total_weight': total_weight,
            'n_forced': n_forced_total,
            'n_pinned': K_pinned,
            'n_required': len(required_picked),
            'n_selected': len(selected),
            'candidates_considered': N,
            'candidates_excluded_xus': candidates_excluded_xus,
            'candidates_excluded_forced_firm': candidates_excluded_forced_firm,
            'candidates_excluded_no_skill': candidates_excluded_no_skill,
            'firm_groups_constrained': firm_groups_constrained,
            'vg_band': vg_band,
            'vg_center': vg_center,
            'min_weight': min_weight,
            'max_weight': max_weight,
            'min_managers': min_managers,
            'max_managers': max_managers,
            'skill_uncovered_weight': skill_uncov_weight,
        },
    }
