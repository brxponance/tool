"""
Client-aware manager → exposure-section resolver for the holdings features
(holdings overlap + FactSet grouping exposures).

Every client-manager sleeve is uploaded as its own section in the FactSet
group-exposures workbook, labeled with a client prefix (MD-, CALSTRS, XPN…SL,
XPN…E, NYCBERS, …). The old `_fuzzy_match_manager` matched purely on string
similarity, which could land a manager on ANOTHER manager's section entirely
(WRatio ties on generic tokens like 'SC' resolved by file order — see
journal 2026-08-13). This module replaces string-guessing with ownership:

  Tier 1 — the client's OWN section for that manager (prefix rules below).
  Tier 2 — another client's section for the same manager whose SLEEVE asset
           class is compatible (keyed on the sleeve, not the client benchmark:
           an EAFE+Canada sleeve inside an ACWI-ex-US client borrows from an
           EAFE+Canada profile, not from an ACWI-ex-US one).
  Tier 3 — unmarked profiles (no client designation, e.g. 'IMC Global').
  Else   — genuinely missing. Cross-client borrowing NEVER crosses size
           (SC / micro / standard) or region families (US vs ex-US, EM vs
           developed): 'IQI Micro Cap' must not borrow IQI's EAFE Value
           holdings — it flags missing instead.

Section sleeve classes come from the OWNING client's weights roster when
possible (coded sections like 'XPNDCMSL-Decatur Capital' carry no class
tokens; the STL roster's 'Decatur US' supplies it), falling back to tokens
in the section name.
"""

import re

# ── Client-prefix ownership rules (user-specified 2026-08-13) ────────────────
# Order matters: more specific patterns first. XPN codes: …SL → St Louis,
# …E → ATL Health.

def section_client(section_name):
    """Return the owning client for an exposures-file section, or None for
    unmarked profiles (no client designation)."""
    s = str(section_name).strip()
    u = s.upper()
    if s.startswith('MD-'):
        return 'MD'
    # Spelled-out ATL Health sections ('Atlantic Health Endowment- IMC') —
    # newer uploads name the account in full instead of the XPN…AHE code.
    if u.startswith('ATLANTIC HEALTH'):
        return 'ATL Health'
    if u.startswith('CALSTRS'):
        return 'CALSTRS'
    if u.startswith('STLOUIS'):
        return 'STL'
    if u.startswith('XPN'):
        code = re.split(r'[-\s]', u, 1)[0]
        if code.endswith('SL'):
            return 'STL'
        if code.endswith('E'):
            return 'ATL Health'
        return None
    if u.startswith('MICROSOFT'):
        return 'Microsoft'
    if u.startswith('IMRF'):
        return 'IMRF'
    if u.startswith('FIS NONUS SMALL CAP CIT'):
        return 'CIT'
    if u.startswith('MASS PRIM'):
        return 'MASS PRIM'
    if u.startswith('NYSCRF'):
        return 'NYSCRF'
    if u.startswith('NYCBERS'):
        return 'NYC'
    if u.startswith('NYSTRS'):
        return 'NYSTRS'
    if u.startswith('COB'):
        return 'COB'
    if u.startswith('NEW HAVEN'):
        return 'New Haven'
    return None


# Single-mandate clients: every section they own is this sleeve class, even
# when neither the coded section name ('XPNEIAHE - Empiric') nor the client's
# weights roster carries class tokens. User rule (2026-09-03): XPN…AHE =
# ATL Health, an EAFE Small Cap account — anything with that designation is
# EAFE SC and belongs against the EAFE SC benchmark.
CLIENT_DEFAULT_CLASS = {'ATL Health': ('EAFE', 'SC')}


# Leading client/account decoration stripped before firm-name extraction.
_SECTION_PREFIX = re.compile(
    r'^\s*(MD|CALSTRS|STLOUIS|XPN[A-Z0-9]+|Microsoft|IMRF'
    r'|FIS\s+NonUS\s+Small\s+Cap\s+CIT|MASS\s+PRIM|NYSCRF(?:/XPONANCE)?'
    r'|NYCBERS|NYSTRS|COB|New\s+Haven'
    r'|Atlantic\s+Health(?:\s+Endowment)?)\s*-\s*',
    re.IGNORECASE,
)

# Tokens that describe the sleeve (region / size / style / vehicle), not the
# firm. Removed when building the firm identity key.
_CLASS_TOKENS = {
    'eafe', 'acwi', 'em', 'us', 'usa', 'usd', 'world', 'global', 'intl',
    'international', 'developed', 'emerging', 'canada', 'can', 'ex', 'x',
    'xus', 'non', 'nonus', 'sc', 'lc', 'mc', 'isc', 'ussc', 'small', 'large',
    'mid', 'micro', 'cap', 'value', 'growth', 'core', 'blend', 'yield',
    'quality', 'adr', 'equity', 'equities', 'worldxus', 'acwixus',
}
# Corporate-form / generic suffix tokens that vary between files for the same
# firm ('Ballina' vs 'Ballina Capital' vs 'BALLINA CAPITAL').
_CORP_TOKENS = {
    'capital', 'partners', 'investment', 'investments', 'invest', 'ment',
    'management', 'asset', 'advisors', 'associates', 'company', 'group',
    'inc', 'llc', 'lp', 'ltd',
}


def firm_key(name, is_section=False):
    """Collapse a manager label (weights-file name or exposures section name)
    to a firm identity key, e.g. 'XPNBCAHE-Ballina' → 'ballina',
    'Princeton Value Partners' → 'princeton', 'IQI Micro Cap' → 'iqi'."""
    s = str(name or '')
    if is_section:
        s = _SECTION_PREFIX.sub('', s)
    s = s.lower()
    s = re.sub(r'\([^)]*\)', ' ', s)
    s = re.sub(r'[._/\-+,&]+', ' ', s)
    s = re.sub(r'\d+', ' ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    # Known multi-word identity that appears both spelled out and as an
    # acronym ('INTEGRATED QUANTITATIVE INVEST MENT' vs 'IQI …').
    if s.startswith('integrated quantitative') or re.match(r'\biqi\b', s):
        return 'iqi'
    toks = [t for t in s.split()
            if t not in _CLASS_TOKENS and t not in _CORP_TOKENS]
    # 'north of south' keeps its connective; drop dangling connectives otherwise
    while toks and toks[-1] in ('of', 'the', 'and'):
        toks.pop()
    return ' '.join(toks) if toks else s


def _firms_equal(a, b):
    """Firm keys match if equal, or if one is a leading-token prefix of the
    other ('frontier' vs 'frontier global')."""
    if not a or not b:
        return False
    if a == b:
        return True
    at, bt = a.split(), b.split()
    n = min(len(at), len(bt))
    return n >= 1 and at[:n] == bt[:n]


# ── Sleeve asset-class parsing ───────────────────────────────────────────────
# Canonical regions. UNKNOWN cross-client is treated as incompatible (strict),
# so a class-less profile can only serve its own client.
_REGIONS_EXUS_DEV = {'EAFE', 'EAFE_CAN', 'WORLD_XUS'}   # developed ex-US family


def sleeve_class(name):
    """Parse (region, size) from a sleeve label. region ∈ {US, EM, ACWI,
    ACWI_XUS, EAFE, EAFE_CAN, WORLD, WORLD_XUS, INTL, UNKNOWN};
    size ∈ {STD, SC, MICRO}."""
    s = str(name or '').lower()
    s = re.sub(r'[._/\-+,]+', ' ', s)
    s = re.sub(r'\bworldxus\b', 'world x us', s)
    s = re.sub(r'\bacwixus\b', 'acwi x us', s)
    s = re.sub(r'\bxus\b', 'x us', s)
    s = re.sub(r'\bsmall\s+cap\b', ' sc ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    toks = set(s.split())

    size = 'STD'
    if 'micro' in toks:
        size = 'MICRO'
    elif toks & {'sc', 'isc', 'ussc'}:
        size = 'SC'

    ex = bool(toks & {'ex', 'x', 'non', 'nonus'})
    region = 'UNKNOWN'
    if toks & {'em', 'emerging'}:
        region = 'EM'
    elif 'acwi' in toks or 'isc' in toks:
        region = 'ACWI_XUS' if (ex and ('us' in toks or 'nonus' in toks)) or 'isc' in toks else 'ACWI'
    elif 'world' in toks:
        region = 'WORLD_XUS' if (ex and 'us' in toks) else 'WORLD'
    elif 'eafe' in toks:
        region = 'EAFE_CAN' if toks & {'canada', 'can'} else 'EAFE'
    elif 'global' in toks:
        region = 'WORLD'
    elif toks & {'international', 'intl'}:
        region = 'INTL'
    elif ex and toks & {'us', 'usa'}:
        # Bare 'xUS' / 'ex US' with no index family named — generic ex-US
        region = 'ACWI_XUS'
    elif toks & {'us', 'usa', 'ussc'}:
        region = 'US'
    return region, size


def class_distance(want, have):
    """Compatibility distance between two (region, size) sleeve classes for
    cross-client borrowing. None = incompatible. Size must match exactly;
    region may relax within the ex-US family."""
    wr, ws = want
    hr, hs = have
    if ws != hs:
        return None
    if wr == 'UNKNOWN' or hr == 'UNKNOWN':
        return None
    if wr == hr:
        return 0
    pair = {wr, hr}
    # Developed ex-US family: EAFE ≈ EAFE+Canada ≈ World ex US (Canada delta)
    if pair <= _REGIONS_EXUS_DEV:
        return 1
    # INTL is an unqualified ex-US label — nearest to any ex-US class
    if 'INTL' in pair and (pair & (_REGIONS_EXUS_DEV | {'ACWI_XUS'})):
        return 1
    # ACWI ex-US vs developed ex-US: EM sleeve delta — allowed, ranked last
    if 'ACWI_XUS' in pair and (pair & _REGIONS_EXUS_DEV):
        return 2
    # Global including US: World ≈ ACWI (EM delta)
    if pair == {'WORLD', 'ACWI'}:
        return 1
    return None


# ── Passive / index sleeves ──────────────────────────────────────────────────
# A client can hold an index sleeve (e.g. COB's 'MSCI EAFE + Canada'). That is
# not a manager profile — it resolves to the workbook's BENCHMARK section of
# the same name, so the sleeve participates in overlap and grouping exposures
# with the index's own holdings.

def _norm_bench(s):
    t = str(s or '').lower()
    for ch in ('+', '-', '/', ',', '.'):
        t = t.replace(ch, ' ')
    t = re.sub(r'\bsmall\s+cap\b', 'sc', t)
    t = re.sub(r'\ball\s+country\s+world\b', 'acwi', t)
    t = re.sub(r'\bac\s+world\b', 'acwi', t)
    t = re.sub(r'\bex[- ]?united\s+states\b', 'ex us', t)
    t = re.sub(r'\bexus\b|\bx\s*us\b', 'ex us', t)
    return re.sub(r'\s+', ' ', t).strip()


def match_index_sleeve(weights_name, benchmark_names):
    """Return the benchmark-section name this sleeve label refers to, or None
    if it isn't an index sleeve."""
    target = _norm_bench(weights_name)
    if not target:
        return None
    for b in benchmark_names or []:
        if _norm_bench(b) == target:
            return b
    return None


# ── Section index + resolution ───────────────────────────────────────────────

# Security-risk file columns carry a benchmark suffix ('NYSTRS - CastleArk
# ACWIxUS vs. MSCI EAFE + Canada', '… vs. DEFAULT') that must be stripped
# before ownership/firm/class parsing.
_VS_SUFFIX = re.compile(r'\s+vs\.?\s+.*$', re.IGNORECASE)

def strip_vs_suffix(name):
    return _VS_SUFFIX.sub('', str(name or '')).strip()


def _index_section_names(section_names, client_rosters=None, clean=None):
    """Classify sections (owner client, firm key, sleeve class) from a plain
    list of names. `clean` optionally normalises each name before parsing
    (e.g. strip_vs_suffix for the risk file); the ORIGINAL name is what gets
    returned in resolutions.

    Sleeve class prefers the owning client's weights-roster label for the
    same firm (coded sections carry no class tokens), falling back to the
    section name itself.
    """
    rosters = client_rosters or {}
    index = []
    for sec in section_names:
        cleaned = clean(sec) if clean else str(sec)
        owner = section_client(cleaned)
        firm = firm_key(cleaned, is_section=True)
        cls = sleeve_class(_SECTION_PREFIX.sub('', cleaned))
        if owner and owner in rosters:
            for wname in rosters[owner]:
                if _firms_equal(firm_key(wname), firm):
                    rcls = sleeve_class(wname)
                    if rcls[0] != 'UNKNOWN':
                        cls = rcls
                    break
        if cls[0] == 'UNKNOWN' and owner in CLIENT_DEFAULT_CLASS:
            cls = CLIENT_DEFAULT_CLASS[owner]
        index.append({'section': sec, 'cleaned': cleaned, 'owner': owner,
                      'firm': firm, 'class': cls})
    return index


def build_section_index(exposures_data, client_rosters=None):
    """Backwards-compatible wrapper over _index_section_names for the
    group-exposures workbook."""
    sections = list((exposures_data.get('managers') or {}).keys())
    return _index_section_names(sections, client_rosters)


def resolve_manager_section(weights_name, client_name, section_index,
                            fallback_class=None):
    """Resolve one held manager to an exposures section.

    fallback_class: (region, size) to use when the manager label itself
    carries no class tokens — e.g. derived from the buy-list peer tab for
    managers added via Add Manager, whose label is just the firm name
    ('Oberweis'). Without it, an UNKNOWN class can never pass the tier-2/3
    compatibility gate and the manager is unmatchable outside its own client.

    Returns {'section', 'tier' ('own'|'peer'|'unmarked'), 'owner',
    'distance'} or None when no acceptable profile exists.
    """
    firm = firm_key(weights_name)
    if not firm:
        return None
    cls = sleeve_class(weights_name)
    if cls[0] == 'UNKNOWN' and fallback_class and fallback_class[0] != 'UNKNOWN':
        # Keep an explicit size token from the label (MICRO/SC); otherwise
        # take the fallback's size along with its region.
        cls = (fallback_class[0], cls[1] if cls[1] != 'STD' else fallback_class[1])
    same_firm = [e for e in section_index if _firms_equal(e['firm'], firm)]

    # Tier 1 — own client. No class gate (a client's own upload for the firm
    # is authoritative); class only disambiguates multiple own sleeves.
    # Only applies to a real client: with client_name=None (Manager Detail),
    # owner-None sections would match here ungated and a standard-cap
    # unmarked profile ('IMC Global') would shadow a sleeve-compatible
    # client section ('Atlantic Health Endowment- IMC', EAFE SC). Unmarked
    # profiles get their class-gated shot in tier 3.
    own = [e for e in same_firm if e['owner'] == client_name] if client_name else []
    if own:
        own.sort(key=lambda e: (class_distance(cls, e['class']) is None,
                                class_distance(cls, e['class']) or 0))
        e = own[0]
        return {'section': e['section'], 'tier': 'own',
                'owner': e['owner'], 'distance': 0}

    # Tier 2 — another client's profile with a compatible sleeve class.
    peers = []
    for e in same_firm:
        if e['owner'] in (None, client_name):
            continue
        d = class_distance(cls, e['class'])
        if d is not None:
            peers.append((d, e))
    if peers:
        peers.sort(key=lambda t: (t[0], t[1]['section']))
        d, e = peers[0]
        return {'section': e['section'], 'tier': 'peer',
                'owner': e['owner'], 'distance': d}

    # Tier 3 — unmarked profiles, same compatibility gate.
    unmarked = []
    for e in same_firm:
        if e['owner'] is not None:
            continue
        d = class_distance(cls, e['class'])
        if d is not None:
            unmarked.append((d, e))
    if unmarked:
        unmarked.sort(key=lambda t: (t[0], t[1]['section']))
        d, e = unmarked[0]
        return {'section': e['section'], 'tier': 'unmarked',
                'owner': None, 'distance': d}

    return None


def resolve_managers(managers_with_weights, exposures_data, client_name,
                     client_rosters=None, weight_state='current'):
    """Resolve a client's held managers to exposure sections.

    managers_with_weights: same shape the overlap/exposures engines take
    (dicts with matched_name / weight_file_name / *_weight).

    Returns {display_name: resolution-dict} for matched managers; managers
    with no acceptable profile are absent from the dict. A section is never
    assigned twice (first claimant wins — rosters shouldn't collide once
    matching is ownership-based).
    """
    index = build_section_index(exposures_data, client_rosters)
    bench_names = list((exposures_data.get('benchmarks') or {}).keys())
    return _resolve_all(managers_with_weights, client_name, index,
                        {b: b for b in bench_names})


def resolve_managers_generic(managers_with_weights, section_names, client_name,
                             client_rosters=None, clean=None):
    """Resolver over a plain list of section names (e.g. the security-risk
    file's manager columns, cleaned of their 'vs. <benchmark>' suffixes).

    Index sleeves resolve against sections whose CLEANED name is itself an
    index name (the risk file carries benchmark bottom-up sections like
    'MSCI EAFE + Canada vs. DEFAULT').
    """
    index = _index_section_names(section_names, client_rosters, clean=clean)
    bench_map = {}
    for e in index:
        if e['owner'] is None and _norm_bench(e['cleaned']).startswith('msci'):
            bench_map[e['cleaned']] = e['section']
    return _resolve_all(managers_with_weights, client_name, index, bench_map)


def _resolve_all(managers_with_weights, client_name, index, bench_map):
    """Shared resolution loop. bench_map: {index display name: section name}."""
    out = {}
    taken = set()
    for m in managers_with_weights:
        display = m.get('matched_name') or m.get('weight_file_name') or '?'
        match_input = m.get('weight_file_name') or m.get('matched_name')
        # The peer tab (EAFE/ISC/EM/US/USSC/ACWI) doubles as an asset-class
        # label when the manager's own name carries none — sleeve_class
        # already understands every tab token.
        tab_class = sleeve_class(m.get('tab')) if m.get('tab') else None
        # Passive index sleeve → the benchmark section directly.
        bench = match_index_sleeve(match_input, list(bench_map.keys()))
        if bench:
            res = {'section': bench_map[bench], 'tier': 'index', 'owner': None,
                   'distance': 0}
        else:
            res = resolve_manager_section(match_input, client_name, index,
                                          fallback_class=tab_class)
        if res and res['section'] not in taken:
            taken.add(res['section'])
            out[display] = res
    return out
