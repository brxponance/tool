"""One-shot audit: print which uploaded file is active per engine slot.
Read-only. Loads cache/results.pkl directly without booting Flask."""
import os
import pickle
import sys

ROOT      = os.path.dirname(os.path.abspath(__file__))
PKL_PATH  = os.path.join(ROOT, 'cache', 'results.pkl')
UPLOAD_DIR = os.path.join(ROOT, 'uploads')

USER_FILES = {
    'BEST_Equity_Factor_Returns.xlsx',
    'BEST_Risk_Data_TEST.xlsx',
    'Equity_factor_returns_-03-2026.xlsx',
    'Exposures_Testw.xlsx',
    'fr.xlsx',
    'ISC_Exposures_Test.xlsx',
    'ISC_Peer_Group_Test.xlsx',
    'Manager_Weights_Example.xlsx',
    'Risk_Summary_TEST.xlsx',
    'Risk_Summary_TEST_2.xlsx',
    'Risk_Summary_TEST_3.xlsx',
    'Risk_TEST.xlsx',
    'universe_consolidated_Universe_Returns.xlsx',
    'universe_ISC_ISC_Peer_Group_Test.xlsx',
    'XPO_Buy_List_Mgr_Rts_Q1_26.xlsx',
}

def hr(c='-', n=72): print(c * n)

if not os.path.exists(PKL_PATH):
    print(f"Cache pickle not found: {PKL_PATH}")
    sys.exit(1)

with open(PKL_PATH, 'rb') as f:
    cache = pickle.load(f)

files = cache.get('files') or {}

print("\n=== Active file per slot (from cache/results.pkl) ===")
hr()
print(f"{'Slot':<22} {'Active basename':<48} {'Status':<10}")
hr()

active_basenames = set()

def report_slot(slot, value):
    if value is None:
        print(f"{slot:<22} {'(none)':<48} {'EMPTY':<10}")
        return
    if isinstance(value, dict):
        # universe_returns nested dict {peer_tab -> path}
        for k, v in value.items():
            report_slot(f"{slot}[{k}]", v)
        return
    bn = os.path.basename(value)
    active_basenames.add(bn)
    if os.path.exists(value):
        status = 'OK'
    elif os.path.exists(os.path.join(UPLOAD_DIR, bn)):
        status = 'OK (resolved)'
    else:
        status = 'MISSING'
    print(f"{slot:<22} {bn:<48} {status:<10}")

for slot in ['manager_returns', 'factor_returns', 'weights',
             'risk_summary', 'security_risk', 'exposures',
             'universe_returns']:
    report_slot(slot, files.get(slot))

print()
print("=== Engine-state slots populated in cache ===")
hr()
def yn(d, key):
    v = d.get(key)
    if v is None: return 'EMPTY'
    if hasattr(v, '__len__') and len(v) == 0: return 'EMPTY'
    return f"OK ({len(v)} entries)" if hasattr(v, '__len__') else 'OK'

print(f"  exposures_data            : {yn(cache, 'exposures_data')}")
print(f"  risk_data                 : {yn(cache, 'risk_data')}")
print(f"  security_risk_data        : {yn(cache, 'security_risk_data')}")
print(f"  weights                   : {yn(cache, 'weights')}")
print(f"  client_benchmarks         : {yn(cache, 'client_benchmarks')}")
print(f"  clone_results             : {yn(cache, 'clone_results')}")
print(f"  universe_clone_results    : {yn(cache, 'universe_clone_results')}")
print(f"  norm_skill_by_tab         : {yn(cache, 'norm_skill_by_tab')}")

# 15-file diff
print()
print("=== Your 15 files vs the active set ===")
hr()
all_basenames_in_uploads = set(os.listdir(UPLOAD_DIR)) if os.path.isdir(UPLOAD_DIR) else set()

inferred_slot = {
    'BEST_Equity_Factor_Returns.xlsx':           'factor_returns',
    'Equity_factor_returns_-03-2026.xlsx':       'factor_returns',
    'fr.xlsx':                                   'factor_returns',
    'XPO_Buy_List_Mgr_Rts_Q1_26.xlsx':           'manager_returns',
    'Manager_Weights_Example.xlsx':              'weights',
    'BEST_Risk_Data_TEST.xlsx':                  'risk_summary',
    'Risk_Summary_TEST.xlsx':                    'risk_summary',
    'Risk_Summary_TEST_2.xlsx':                  'risk_summary',
    'Risk_Summary_TEST_3.xlsx':                  'risk_summary',
    'Risk_TEST.xlsx':                            'risk_summary',
    'Exposures_Testw.xlsx':                      'exposures',
    'ISC_Exposures_Test.xlsx':                   'exposures',
    'ISC_Peer_Group_Test.xlsx':                  'universe_returns',
    'universe_ISC_ISC_Peer_Group_Test.xlsx':     'universe_returns',
    'universe_consolidated_Universe_Returns.xlsx': 'universe_returns',
}

groups = {}
for fn, slot in inferred_slot.items():
    groups.setdefault(slot, []).append(fn)

for slot, fns in groups.items():
    print(f"\n  Inferred slot: {slot}")
    for fn in sorted(fns):
        in_uploads = '✓' if fn in all_basenames_in_uploads else '✗'
        active     = '★ ACTIVE' if fn in active_basenames else '  unused'
        print(f"    {in_uploads} {fn:<46} {active}")

# Files in uploads/ that aren't in your 15-file list
extra = all_basenames_in_uploads - USER_FILES
if extra:
    print()
    print("=== Files in uploads/ NOT in your 15-file list ===")
    hr()
    for fn in sorted(extra):
        active = '★ ACTIVE' if fn in active_basenames else '  unused'
        print(f"    {fn:<60} {active}")

print()
hr()
print("Done.")
