"""
Skill engine — Normalized Skill v1.

For each manager M at each month-end snapshot t:
  1. Raw skill = mean monthly excess return from M's inception to t, × 12.
  2. Qualifying peers:
     STRICT: peer inception ≤ M's inception AND peer has data through t.
     FALLBACK (if strict pool < 30): any peer with ≥36 months overlap with M.
  3. For each qualifying peer, compute their skill on the SAME window as M
     (NOT the peer's own full history).
  4. Z-score M's skill against the peer distribution → Normalized Skill.

Public API:
    compute_norm_skill_latest(clone_results, universe_clone_results, tab, exclude=...)
        → { manager_name: { ...metrics..., z, skill, n_peers, adj_method, last_month } }
"""
import math
import numpy as np
import pandas as pd

MIN_HISTORY       = 36
STRICT_MIN_PEERS  = 30
ANNUALIZE         = 12

# Known duplicates between buy-list and eVestment universe files (ISC peer).
# Keys are buy-list names; values are universe names to drop so managers don't
# double-count in the peer group.
_DUPLICATES = {
    'Runde SC':                 'Runde International Small-Cap Value',
    'CastleArk EAFE SC':        'CastleArk International Small Cap Equity',
    'Arga ISC':                 'ARGA International Small-Cap Equity Strategy',
    'Ativo SC':                 'Ativo International Small Cap Composite',
    'Global Alpha SC':          'Global Alpha International Small Cap',
    'Cedar Street xUS':         'Cedar Street International Small Cap Value',
    'Hillsdale EAFE Small Cap': 'Hillsdale International Small Cap Equity Strategy',
    'Lizard EAFE':              'Lizard EAFE Small Cap',
    'Tancook':                  'Tancook International Small Cap Fund',
    'Castleark xUS':            'CastleArk International Small Cap Equity',
    'Cedar Street EAFE':        'Cedar Street EAFE Small Cap Value Strategy',
    'Evolution Global':         'Evolution Global Advisors International Small Cap',
    'Mac Alpha':                'MAC Alpha Capital International Small Cap Fund LP',
}


def _clean_excess(manager_returns, static_clone_full):
    """Return list of (idx, excess) for all valid (manager, clone) pairs."""
    out = []
    for i, (m, c) in enumerate(zip(manager_returns, static_clone_full)):
        if m is None or c is None:
            continue
        try:
            mf, cf = float(m), float(c)
            if math.isnan(mf) or math.isnan(cf):
                continue
        except (TypeError, ValueError):
            continue
        out.append((i, mf - cf))
    return out


def _build_panel(clone_results, universe_clone_results, tab, exclude):
    """
    Merge buy-list and universe clones for a tab into a single excess-return
    matrix (N managers × T months). Returns (names, excess_mat, master_dates,
    inception_idx, last_idx, buy_names).
    """
    buy = (clone_results or {}).get(tab, {}) or {}
    uni = (universe_clone_results or {}).get(tab, {}) or {}

    uni_to_drop = set(_DUPLICATES.values())
    exclude     = exclude or set()

    combined = {}
    for n, d in buy.items():
        if n in exclude: continue
        combined[n] = {'source': 'buy', 'dates': d['dates'],
                       'manager_returns': d['manager_returns'],
                       'static_clone_full': d['static_clone_full']}
    for n, d in uni.items():
        if n in uni_to_drop or n in exclude: continue
        # Buy-list entry takes priority — do NOT overwrite a manager that is
        # already keyed from the buy panel. Universe data is only used when a
        # manager has no buy-list clone (e.g. recently added, or universe-only).
        if n in combined:
            continue
        combined[n] = {'source': 'universe', 'dates': d['dates'],
                       'manager_returns': d['manager_returns'],
                       'static_clone_full': d['static_clone_full']}

    if not combined:
        return [], np.zeros((0, 0)), [], {}, {}, set(buy.keys())

    all_dates = set()
    for d in combined.values():
        all_dates.update(d['dates'])
    master_dates = sorted(all_dates)
    T = len(master_dates)
    date_to_idx = {dt: i for i, dt in enumerate(master_dates)}

    names = sorted(combined.keys())
    excess = np.full((len(names), T), np.nan)

    for i, n in enumerate(names):
        d   = combined[n]
        idx = {dt: k for k, dt in enumerate(d['dates'])}
        for dt, i_master in date_to_idx.items():
            k = idx.get(dt)
            if k is None: continue
            m, c = d['manager_returns'][k], d['static_clone_full'][k]
            if m is None or c is None: continue
            try:
                mf, cf = float(m), float(c)
                if math.isnan(mf) or math.isnan(cf): continue
            except (TypeError, ValueError):
                continue
            excess[i, i_master] = mf - cf

    inception_idx = {}
    last_idx      = {}
    for i, n in enumerate(names):
        nz = np.where(~np.isnan(excess[i]))[0]
        inception_idx[n] = int(nz[0])  if len(nz) else T
        last_idx[n]      = int(nz[-1]) if len(nz) else -1

    return names, excess, master_dates, inception_idx, last_idx, set(buy.keys())


def _skill_on_window(excess_row, start, end):
    """Annualized mean monthly excess return over [start, end] inclusive.
    Returns (skill, n_obs) or (None, n_obs)."""
    v = excess_row[start:end + 1]
    v = v[~np.isnan(v)]
    if len(v) < MIN_HISTORY:
        return None, len(v)
    return float(v.mean() * ANNUALIZE), len(v)


def _compute_snapshot(t_end, names, excess, inception_idx, last_idx,
                       target_set=None):
    """Compute the Normalized Skill snapshot at master_dates[t_end].
    Returns {manager: {...}} including managers whose last reporting month
    IS master_dates[t_end].

    `target_set` (optional): when provided, the OUTER loop only computes
    Z-scores for managers in this set, but the INNER peer loop still
    iterates over every record so the peer distribution is unchanged.
    Used to skip O(N) work on universe managers whose Z-scores aren't
    consumed downstream — only buy-list Z-scores get displayed in the UI.
    Cuts post-clone recompute on the buy-list workflow from ~30 min to
    ~5 sec on large universes."""
    records = []
    for i, nm in enumerate(names):
        inc = inception_idx[nm]
        # Need ≥36 months of history AND must still be reporting at t_end
        if inc > t_end - MIN_HISTORY + 1: continue
        if last_idx[nm] < t_end:          continue
        skill, n_obs = _skill_on_window(excess[i], inc, t_end)
        if skill is None: continue
        records.append({'name': nm, 'idx': i, 'inc': inc,
                        'skill': skill, 'n_obs': n_obs})

    if len(records) < 5:
        return {}

    out = {}
    for r in records:
        # Skip the expensive peer-distribution work for managers we don't
        # need a Z-score for. The peer loops below are O(N) per record;
        # filtering the outer loop to ~25 buy-list managers (vs ~3K total
        # in a US-tab panel) is the optimisation that matters here.
        if target_set is not None and r['name'] not in target_set:
            continue

        M_inc = r['inc']

        # STRICT: peer inception ≤ M_inc, scored on M's window
        strict_skills = []
        for r2 in records:
            if r2['name'] == r['name']: continue
            if r2['inc'] > M_inc:       continue
            s, _ = _skill_on_window(excess[r2['idx']], M_inc, t_end)
            if s is not None: strict_skills.append(s)

        if len(strict_skills) >= STRICT_MIN_PEERS:
            peer_skills, method = strict_skills, 'strict'
        else:
            # FALLBACK: any peer with ≥36 months overlap with M's window
            fallback_skills = []
            for r2 in records:
                if r2['name'] == r['name']: continue
                peer_start = max(M_inc, r2['inc'])
                if t_end - peer_start + 1 < MIN_HISTORY: continue
                s, _ = _skill_on_window(excess[r2['idx']], peer_start, t_end)
                if s is not None: fallback_skills.append(s)
            peer_skills, method = fallback_skills, 'fallback'

        mu = sd = z = None
        n_peers = len(peer_skills)
        if n_peers >= 5:
            mu = float(np.mean(peer_skills))
            sd = float(np.std(peer_skills, ddof=0))
            z  = (r['skill'] - mu) / sd if sd > 1e-12 else 0.0

        out[r['name']] = {
            'skill':      r['skill'],
            'peer_mean':  mu,
            'peer_std':   sd,
            'n_peers':    n_peers,
            'adj_method': method,
            'z':          z,
            'n_obs':      r['n_obs'],
            'inception':  r['inc'],
        }
    return out


def compute_norm_skill_latest(clone_results, universe_clone_results, tab,
                               exclude=None, target_managers=None):
    """
    Compute each manager's Normalized Skill Z-score using their OWN most
    recent reporting month.

    `target_managers`: optional set of names to compute Z-scores for. When
    None (the default), restricts to buy-list manager names — the only
    Z-scores actually displayed in the UI. Pass an empty set to bypass
    filtering and compute everything (legacy behaviour). The peer
    distribution is always built from ALL panel managers (buy-list +
    universe), so Z-scores are unchanged — only the work is reduced.
    Cuts post-clone recompute on the buy-list workflow from ~30 min to
    ~5 sec on large universes (US tab with ~3,600 universe managers).

    Returns:
        { manager_name: {
            'z':          float | None,
            'skill':      float (annualized excess return),
            'peer_mean':  float | None,
            'peer_std':   float | None,
            'n_peers':    int,
            'adj_method': 'strict' | 'fallback',
            'n_obs':      int,
            'last_month': 'YYYY-MM-DD',
            'source':     'buy' | 'universe',
         } }
    """
    exclude = set(exclude or [])
    names, excess, master_dates, inception_idx, last_idx, buy_names = \
        _build_panel(clone_results, universe_clone_results, tab, exclude)

    if len(names) == 0:
        return {}

    T = excess.shape[1]

    # Default target = the buy-list manager names. Universe Z-scores are
    # never read by the production UI (verified: clone_results is the only
    # iterator that calls _norm_skill_for; universe_clone_results is not).
    if target_managers is None:
        target_set = set(buy_names)
    elif not target_managers:
        target_set = None  # explicit opt-out: compute Z for everyone
    else:
        target_set = set(target_managers)

    # For efficiency: group managers by their last_idx, then compute one
    # snapshot per unique last_idx value. With target filtering, we only
    # need snapshots whose t matches a target manager's last_idx.
    if target_set is None:
        unique_last = sorted(set(last_idx[n] for n in names
                                 if last_idx[n] >= MIN_HISTORY - 1))
    else:
        unique_last = sorted(set(last_idx[n] for n in target_set
                                 if n in last_idx and last_idx[n] >= MIN_HISTORY - 1))

    result = {}
    for t in unique_last:
        snap = _compute_snapshot(t, names, excess, inception_idx, last_idx,
                                  target_set=target_set)
        last_month = master_dates[t]
        for nm, d in snap.items():
            # Only record this snapshot's value for managers whose OWN last
            # reporting month is exactly t (so each manager's score is based
            # on their most recent data, not some later snapshot they couldn't
            # participate in).
            if last_idx[nm] != t:
                continue
            result[nm] = {
                'z':          d['z'],
                'skill':      d['skill'],
                'peer_mean':  d['peer_mean'],
                'peer_std':   d['peer_std'],
                'n_peers':    d['n_peers'],
                'adj_method': d['adj_method'],
                'n_obs':      d['n_obs'],
                'last_month': str(last_month),
                'source':     'buy' if nm in buy_names else 'universe',
            }
    return result


def weighted_avg_z(manager_zs_and_weights):
    """Compute a weighted average Z-score from a list of (z, weight) tuples.
    Skips None z-values. Weights are expected as fractions (0-1 scale or
    0-100 scale — result is weight-invariant as long as they're consistent).
    Returns (weighted_z, total_covered_weight, total_provided_weight).
    """
    total_w   = 0.0
    covered_w = 0.0
    wz        = 0.0
    for z, w in manager_zs_and_weights:
        w = float(w or 0)
        total_w += w
        if z is None: continue
        covered_w += w
        wz += z * w
    weighted_z = (wz / covered_w) if covered_w > 1e-9 else None
    return weighted_z, covered_w, total_w
