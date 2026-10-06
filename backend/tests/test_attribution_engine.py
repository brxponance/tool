"""
Acceptance tests for attribution_engine theme discovery.

This repo has no test framework, so these are plain asserts runnable with:

    cd backend && ./venv/Scripts/python.exe tests/test_attribution_engine.py

They still work unchanged under pytest if one is ever added.

The degenerate-R_b cases below are not edge-case trivia — they are the
requirement. The benchmark can return zero or go negative in a quarter, and a
grouping must still be flagged when it is an outsized contributor OR an
outsized detractor. Anything that divides by R_b breaks exactly there, which is
why E_G (= c_G − w_G·R_b) ranks and the ratio is only ever decoration.
"""

import math
import os
import sys

# Group labels and the maths notation here contain non-ASCII (×, Σ, φ) and the
# Windows console defaults to cp1252, which raises on them mid-run.
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:  # pragma: no cover - very old Python
    pass

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from attribution_engine import (  # noqa: E402
    RATIO_FLOOR, discover_themes, parse_attribution_file,
)

FAILURES = []


def check(cond, msg):
    if cond:
        print(f"  ok   {msg}")
    else:
        print(f"  FAIL {msg}")
        FAILURES.append(msg)


def make_parsed(securities, period='TEST', benchmark='MSCI Test Index'):
    """Build a parsed-file structure by hand.

    `securities` = [(name, sector, country, avg_weight_pct, contribution_pct)]
    Weights/contributions are given in PERCENT here (as FactSet writes them)
    and converted to decimals, mirroring the real parser.
    """
    secs = {}
    for i, (name, sector, country, w_pct, c_pct) in enumerate(securities):
        secs[f'SED{i:04d}'] = {
            'name': name, 'sedol': f'SED{i:04d}',
            'GICS Sector': sector, 'Country': country,
            'GICS Industry': f'{sector} Industry',
            'Region': 'Test Region', 'Market Development': 'Developed',
            'periods': {period: {'avg_weight': w_pct / 100.0,
                                 'contribution': c_pct / 100.0,
                                 'end_weight': w_pct / 100.0}},
        }
    return {
        'periods': [period], 'period_spans': {period: (None, None)},
        'quarter_period': period,
        'benchmarks': {benchmark: secs}, 'benchmark_names': [benchmark],
        'managers': {}, 'manager_names': [],
        'section_totals': {benchmark: {period: sum(s[4] for s in securities) / 100.0}},
        'quintile_breaks_by_benchmark': {benchmark: {}},
        'n_blocks': 1,
    }


def finite(rows, *fields):
    for r in rows:
        for f in fields:
            v = r.get(f)
            if v is None:
                continue
            if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
                return False
    return True


# ── 1. R_b == 0 exactly: one big winner, everything else negative ─────────
def test_flat_benchmark():
    print("\n[1] R_b = 0 exactly — one winner carries a flat benchmark")
    parsed = make_parsed([
        ('Semi A', 'Information Technology', 'Japan', 3.0, 60.0),
        ('Semi B', 'Information Technology', 'Japan', 2.0, 40.0),
        ('Bank A', 'Financials', 'France', 40.0, -40.0),
        ('Bank B', 'Financials', 'Germany', 35.0, -35.0),
        ('Util A', 'Utilities', 'Spain', 20.0, -25.0),
    ])
    res = discover_themes(parsed, min_weight=0.01, top_n=10)

    check(abs(res['r_b']) < 1e-12, f"R_b is exactly 0 (got {res['r_b']})")
    check(res['ratio_available'] is False, "ratio suppressed below the floor")
    check(len(res['contributors']) > 0, "contributors are still produced")

    top = res['contributors'][0]
    check('Japan' in top['label'] or 'Information Technology' in top['label'],
          f"the winning group ranks first (got '{top['label']}')")
    check(top['e_g_bps'] > 0, f"its E_G is positive ({top['e_g_bps']:.0f} bps)")
    check(top['share'] is not None and 0 < top['share'] <= 1.0,
          f"share of dispersion is a usable fraction ({top['share']})")
    check(all(r['phi'] is None and r['ratio'] is None
              for r in res['contributors'] + res['detractors']),
          "phi/ratio are None rather than NaN or Infinity")
    check(finite(res['contributors'] + res['detractors'],
                 'w', 'r_g', 'excess', 'e_g', 'e_g_bps', 'share'),
          "no NaN/Inf anywhere in the returned rows")


# ── 2. R_b < 0: a flat group is a POSITIVE contributor ───────────────────
def test_negative_benchmark():
    print("\n[2] R_b < 0 — a flat group cushions the decline")
    parsed = make_parsed([
        ('Defensive A', 'Utilities', 'Spain', 10.0, 0.0),
        ('Cyclical A', 'Financials', 'France', 50.0, -3.0),
        ('Cyclical B', 'Industrials', 'Germany', 40.0, -2.0),
    ])
    res = discover_themes(parsed, min_weight=0.01, top_n=10)

    check(res['r_b'] < 0, f"R_b is negative ({res['r_b'] * 100:.2f}%)")
    # 'Utilities', 'Spain' and 'Utilities Industry' all cover the same single
    # stock, so nesting keeps one representative and the tie-break decides
    # which label it wears. Identify the group by its weight, not its name.
    util = next((r for r in res['contributors'] if abs(r['w'] - 0.10) < 1e-9), None)
    check(util is not None,
          f"the flat group appears among CONTRIBUTORS "
          f"(got {[r['label'] for r in res['contributors']]})")
    if util:
        check(util['e_g'] > 0,
              f"its E_G is positive ({util['e_g_bps']:.1f} bps) despite c_G = 0")
    check(len(res['detractors']) > 0, "detractors are still produced")


# ── 3. R_b > 0 with a large detractor ────────────────────────────────────
def test_detractor_surfaces():
    print("\n[3] R_b > 0 — a large detractor is not crowded out")
    parsed = make_parsed([
        ('Winner A', 'Information Technology', 'Japan', 30.0, 6.0),
        ('Winner B', 'Industrials', 'Germany', 30.0, 3.0),
        ('Loser A', 'Energy', 'Norway', 5.0, -5.0),
        ('Flat A', 'Financials', 'France', 35.0, 1.0),
    ])
    res = discover_themes(parsed, min_weight=0.01, top_n=10)

    check(res['r_b'] > 0, f"R_b is positive ({res['r_b'] * 100:.2f}%)")
    energy = next((r for r in res['detractors'] if 'Energy' in r['label']), None)
    check(energy is not None, "the detractor appears in the DETRACTOR table")
    if energy:
        check(energy['e_g'] < 0, f"its E_G is negative ({energy['e_g_bps']:.0f} bps)")
        check(energy['share'] is not None and energy['share'] > 0.05,
              f"it takes a visible share of dispersion ({energy['share']:.1%})")


# ── 4. |R_b| just inside the floor ───────────────────────────────────────
def test_ratio_floor():
    print("\n[4] |R_b| below the ratio floor — every other column still works")
    parsed = make_parsed([
        ('A', 'Information Technology', 'Japan', 10.0, 0.30),
        ('B', 'Financials', 'France', 50.0, -0.20),
        ('C', 'Industrials', 'Germany', 40.0, 0.10),
    ])
    res = discover_themes(parsed, min_weight=0.01, top_n=10)
    rows = res['contributors'] + res['detractors']

    check(abs(res['r_b']) < RATIO_FLOOR,
          f"|R_b| is inside the floor ({res['r_b'] * 10000:.0f} bps)")
    check(res['ratio_available'] is False, "ratio_available is False")
    check(all(r['ratio'] is None for r in rows), "ratio column is blank")
    check(all(r['e_g_bps'] is not None and r['w'] is not None for r in rows),
          "w and E_G are still fully populated")
    check(finite(rows, 'w', 'r_g', 'excess', 'e_g', 'e_g_bps', 'share'),
          "no NaN/Inf")


# ── 5. The partition identity ────────────────────────────────────────────
def test_partition_sums_to_zero():
    print("\n[5] Sum of E_G across a complete partition is 0")
    parsed = make_parsed([
        ('A', 'Information Technology', 'Japan', 12.0, 2.4),
        ('B', 'Financials', 'France', 38.0, -1.1),
        ('C', 'Industrials', 'Germany', 30.0, 0.9),
        ('D', 'Utilities', 'Spain', 20.0, -0.3),
    ])
    res = discover_themes(parsed, min_weight=0.0, top_n=50)
    rec = res['reconciliation']

    check(rec['partition_sum_ok'],
          f"Σ E_G over GICS Sector = {rec['partition_sum_e_g']:.3e}")
    check(rec['sum_weight_ok'], f"weights sum to 1.0 (got {rec['sum_weight']:.6f})")
    check(rec['total_matches_reported'] is not False,
          "Σ contribution matches the reported section total")


# ── 6. The worked example from the brief ─────────────────────────────────
def test_japan_semis_example():
    print("\n[6] Worked example — 5% weight, outsized share of return")
    # Japanese semis: 5 % of weight, +2.0 % of a +10 % benchmark return.
    parsed = make_parsed([
        ('Semi A', 'Information Technology', 'Japan', 5.0, 2.0),
        ('Rest A', 'Financials', 'France', 55.0, 4.0),
        ('Rest B', 'Industrials', 'Germany', 40.0, 4.0),
    ])
    res = discover_themes(parsed, min_weight=0.01, top_n=10)

    check(abs(res['r_b'] - 0.10) < 1e-12, f"R_b = {res['r_b'] * 100:.1f}%")
    # 'Japan', 'Information Technology' and their intersection cover the same
    # single stock here, so nesting collapses them to one representative row
    # and which label survives is arbitrary. Identify it by its weight.
    jp = next((r for r in res['contributors'] if abs(r['w'] - 0.05) < 1e-9), None)
    check(jp is not None,
          f"the 5%-weight group is surfaced (got {[r['label'] for r in res['contributors']]})")
    if jp:
        # E_G = c_G − w_G·R_b = 0.02 − 0.05(0.10) = 0.015 → 150 bps
        check(abs(jp['e_g_bps'] - 150.0) < 1e-6,
              f"E_G = {jp['e_g_bps']:.1f} bps (expected 150.0)")
        check(res['ratio_available'] and abs(jp['ratio'] - 4.0) < 1e-9,
              f"ratio = {jp['ratio']:.2f}× (20% of return on 5% of weight)")


# ── 7. Parser rejects a file without the two required columns ────────────
def test_parser_requires_new_columns():
    print("\n[7] Parser refuses today's exposures file with a useful message")
    import glob
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    olds = sorted(glob.glob(os.path.join(here, 'uploads', 'Fact*Group_Exposure*.xlsx')))
    if not olds:
        print("  skip (no legacy exposures file present)")
        return
    try:
        parse_attribution_file(olds[-1])
        check(False, "should have raised — that file has no contribution column")
    except ValueError as e:
        msg = str(e)
        check('Average Weight' in msg and 'Contribution To Return' in msg,
              "error names both missing columns")
        check('Port. Ending Weight' in msg,
              "error warns not to move Port. Ending Weight")
    except Exception as e:  # noqa: BLE001
        check(False, f"raised the wrong error type: {type(e).__name__}: {e}")


if __name__ == '__main__':
    for fn in (test_flat_benchmark, test_negative_benchmark,
               test_detractor_surfaces, test_ratio_floor,
               test_partition_sums_to_zero, test_japan_semis_example,
               test_parser_requires_new_columns):
        fn()
    print("\n" + "=" * 60)
    if FAILURES:
        print(f"{len(FAILURES)} FAILURE(S):")
        for f in FAILURES:
            print(f"  - {f}")
        sys.exit(1)
    print("All attribution engine checks passed.")
