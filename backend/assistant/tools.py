"""
Read-only tool functions over the PC Tool's HTTP API.

Two things decide whether this is actually useful, and both are handled here:

1. **Name resolution.** Managers are keyed four different ways across the
   system — returns workbook ('Decatur'), weights workbook
   ('Mac Alpha EAFE + Canada SC'), FactSet section ('XPNBCAHE-Ballina'),
   eVestment ('Firm: Strategy'). Without `find_entity`, Claude guesses a
   spelling, the endpoint 404s, and the answer is wrong rather than absent.

2. **Result size.** `/peer_group_view/EAFE` is ~79 KB of JSON and
   `/manager_detail` ships four 299-point series. Everything here goes through
   `table()`, which caps rows and says "showing N of M" rather than silently
   truncating.

Output is compact text, not JSON: Claude reads it more reliably per token and
there is no reason to pay for braces and quotes.

Nothing here writes. No /run, no uploads, no weight edits, no deletes.
"""

from __future__ import annotations

import functools
import urllib.parse

from .http_client import PCToolError, client


def _q(segment) -> str:
    """Percent-encode one URL path segment.

    Not optional: real names carry spaces, '+' and '&'
    ('Polen International EAFE + Canada Concentrated', 'ATL Health',
    'CALSTRS - Ballina EAFE+Canada'). Interpolating those raw produced an
    invalid request line and an unhandled exception rather than an error the
    model could act on. safe='' so '/' inside a name cannot forge a new path.
    """
    return urllib.parse.quote(str(segment or ""), safe="")


def tool_error_boundary(fn):
    """Return every failure as readable text instead of raising.

    An exception escaping a tool is far worse than a bad answer: the model
    gets a protocol-level failure it cannot reason about, where a sentence it
    can read lets it retry, pick a different tool, or tell the user what is
    wrong. PCToolError messages are already written for that; anything else is
    unexpected, so name the type to make it diagnosable.
    """
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except PCToolError as e:
            return f"Error: {e}"
        except Exception as e:  # noqa: BLE001
            return (f"Error: unexpected {type(e).__name__} in {fn.__name__}: {e}. "
                    "This is a bug in the MCP server, not a problem with the "
                    "question — report it rather than retrying.")
    return wrapper

MAX_ROWS = 60
MAX_CELLS = 2000


def _fmt(v, nd=2):
    if v is None:
        return ""
    if isinstance(v, bool):
        return "yes" if v else "no"
    if isinstance(v, float):
        if v != v:  # NaN
            return ""
        return f"{v:.{nd}f}".rstrip("0").rstrip(".") or "0"
    return str(v)


def table(rows, columns, max_rows=MAX_ROWS, note=""):
    """Pipe-separated table with a row cap and an honest overflow line."""
    rows = list(rows)
    total = len(rows)
    if not total:
        return (note + "\n" if note else "") + "(no rows)"
    per_row = max(1, len(columns))
    cap = min(max_rows, max(5, MAX_CELLS // per_row))
    shown = rows[:cap]
    out = []
    if note:
        out.append(note)
    out.append(" | ".join(columns))
    for r in shown:
        out.append(" | ".join(_fmt(c) for c in r))
    if total > len(shown):
        out.append(f"... showing {len(shown)} of {total} rows "
                   f"(ask for a narrower query to see the rest)")
    else:
        out.append(f"({total} rows)")
    return "\n".join(out)


def kv(pairs, note=""):
    lines = [note] if note else []
    lines += [f"{k}: {_fmt(v)}" for k, v in pairs if v not in (None, "")]
    return "\n".join(lines)


def _err(e):
    return f"Error: {e}"


def _exposures_source(c) -> str:
    """Name the exposures file every exposure answer came from.

    The tool holds exactly ONE parsed exposures snapshot — uploading another
    replaces it — so there is no such thing as "as of date X". Stamping the
    source file onto the output is what stops an answer being silently
    mis-dated when someone asks a date question.
    """
    try:
        st = c.get("/status")
    except PCToolError:
        return ""
    f = (st.get("files") or {}).get("exposures")
    return f"Source: {f} (the only loaded snapshot)." if f else ""


def _grouping_menu(c) -> dict:
    """{raw column name: display label} of every valid grouping."""
    d = c.post("/portfolio_exposures", {"grouping": None, "managers": []})
    out = {}
    for grp in (d.get("menu") or []):
        for col in (grp.get("cols") or []):
            if col.get("col"):
                out[col["col"]] = col.get("label") or col["col"]
    return out


def _check_grouping(c, grouping: str):
    """Return an error string for an invalid grouping, else None.

    The API matches the RAW FactSet column name and silently buckets everything
    as 'Unclassified' when it does not recognise one — so passing the display
    label 'Sector' instead of 'GICS Sector' yields a clean-looking, entirely
    wrong table (journal, 2026-09-22). Validating here turns that silent wrong
    answer into a corrective error, which is the whole point of the exercise.
    """
    menu = _grouping_menu(c)
    if not menu or grouping in menu:
        return None
    hit = [col for col, label in menu.items()
           if label.lower() == (grouping or "").lower()]
    if hit:
        return (f"Error: {grouping!r} is a display label, not a column name. "
                f"Use {hit[0]!r}.")
    near = [col for col in menu if (grouping or "").lower() in col.lower()]
    return (f"Error: {grouping!r} is not a valid grouping."
            + (f" Did you mean {near[0]!r}?" if near else
               " Call list_groupings for the valid values."))


def _manager_tabs(c) -> dict:
    """{lowercased manager name: peer tab}. /portfolio_exposures needs the tab
    alongside the name, and asking the model for it invites a wrong guess."""
    out = {}
    for m in (c.get("/all_managers") or {}).get("managers") or []:
        if m.get("name"):
            out[str(m["name"]).lower()] = m.get("tab")
    return out


# ── status / inventory ───────────────────────────────────────────────────
@tool_error_boundary
def get_status() -> str:
    """What data is currently loaded in the PC Tool, and is it stale."""
    try:
        c = client()
        d = c.get("/status")
    except PCToolError as e:
        return _err(e)
    return kv([
        ("target", c.describe_target()),
        ("clone results loaded", d.get("has_results")),
        ("weights loaded", d.get("has_weights")),
        ("universe peer groups", ", ".join(d.get("universe_tabs") or []) or "none"),
        ("FactSet exposures", d.get("has_exposures")),
        ("exposures benchmark", d.get("exposures_benchmark")),
        ("FactSet security risk", d.get("has_security_risk")),
        ("attribution file", d.get("has_attribution")),
        ("attribution period", d.get("attribution_quarter")),
        ("attribution benchmarks", ", ".join(d.get("attribution_benchmarks") or []) or "none"),
        ("qualitative data", d.get("has_qualitative")),
        ("clone stale (inputs changed since last run)", d.get("clone_stale")),
        ("uploaded files", ", ".join(sorted((d.get("files") or {}).keys()))),
    ], note="PC Tool status")


@tool_error_boundary
def list_clients() -> str:
    """Every client account set up in the tool, with the benchmark each is
    measured against."""
    try:
        d = client().get("/clients")
    except PCToolError as e:
        return _err(e)
    bm = d.get("benchmarks") or {}
    rows = [(c, bm.get(c, "")) for c in (d.get("clients") or [])]
    return table(rows, ["client", "benchmark"], note="Client accounts")


@tool_error_boundary
def list_managers(peer_group: str = "") -> str:
    """Every manager the tool has cloned. Optionally filter to one peer group
    Columns: V-G full-model style loading (positive = value, negative =
    growth), R-squared of the clone fit, and the normalized skill z-score.

    Args:
        peer_group: optional filter — one of EAFE, ISC (intl small cap), ACWI, EM, US, USSC (US small cap).
            Empty string returns every manager.
    """
    try:
        d = client().get("/all_managers")
    except PCToolError as e:
        return _err(e)
    mgrs = d.get("managers") or []
    if peer_group:
        pg = peer_group.strip().lower()
        mgrs = [m for m in mgrs if str(m.get("tab", "")).lower() == pg]
    rows = [(m.get("name"), m.get("tab"), m.get("vg_full"), m.get("vg_3factor"),
             m.get("r2_full"), m.get("ns_z"), m.get("is_placeholder"))
            for m in mgrs]
    rows.sort(key=lambda r: (str(r[1]), str(r[0])))
    return table(rows, ["manager", "peer_group", "vg_full", "vg_3factor",
                        "r2", "skill_z", "placeholder"],
                 note=f"Managers{f' in {peer_group}' if peer_group else ''}")


@tool_error_boundary
def find_entity(query: str) -> str:
    """Resolve a partial or differently-spelled name to the exact keys the
    other tools need. ALWAYS call this first when the user names a manager or
    client — the same manager is keyed differently in the returns workbook,
    the weights workbook and the FactSet file, and the other tools need the
    exact key.

    Args:
        query: any fragment of a manager or client name, e.g. "hillsdale",
            "mac alpha", "calstrs". Case-insensitive; partial words match.
    """
    q = (query or "").strip().lower()
    if not q:
        return "Error: empty query."
    try:
        c = client()
        mgrs = (c.get("/all_managers") or {}).get("managers") or []
        clients_d = c.get("/clients") or {}
    except PCToolError as e:
        return _err(e)

    def score(name):
        n = str(name or "").lower()
        if n == q:
            return 0
        if n.startswith(q):
            return 1
        if q in n:
            return 2
        # token overlap, for 'mac alpha' vs 'MAC ALPHA WORLD X US SC'
        qt, nt = set(q.split()), set(n.replace("-", " ").split())
        return 3 if qt & nt else 99

    hits = []
    for m in mgrs:
        s = score(m.get("name"))
        if s < 99:
            hits.append((s, "manager", m.get("name"), m.get("tab")))
    for cl in clients_d.get("clients") or []:
        s = score(cl)
        if s < 99:
            hits.append((s, "client", cl, clients_d.get("benchmarks", {}).get(cl, "")))
    if not hits:
        return (f"No manager or client matches {query!r}. Use list_managers or "
                "list_clients to see the exact spellings available.")
    hits.sort()
    rows = [(kind, name, extra) for _, kind, name, extra in hits[:25]]
    return table(rows, ["kind", "exact_name", "peer_group_or_benchmark"],
                 note=f"Matches for {query!r} (use exact_name verbatim in other tools)")


# ── manager / portfolio detail ───────────────────────────────────────────
@tool_error_boundary
def get_manager_detail(peer_group: str, manager: str) -> str:
    """One manager's clone profile: style buckets, factor betas, fit quality
    and skill. The 299-month return series are omitted by design.

    Args:
        peer_group: EAFE, ISC, ACWI, EM, US or USSC.
        manager: exact name from find_entity, verbatim including punctuation.
    """
    try:
        d = client().get(f"/manager_detail/{_q(peer_group)}/{_q(manager)}")
    except PCToolError as e:
        return _err(e)
    if d.get("error"):
        return f"Error: {d['error']}"
    buckets = d.get("style_buckets") or {}
    betas = d.get("betas_full") or {}
    head = kv([
        ("manager", manager), ("peer group", d.get("peer_group") or peer_group),
        ("V-G (full model)", d.get("vg_full")),
        ("V-G (3-factor)", d.get("vg_3factor")),
        ("R-squared (full)", d.get("r2_full")),
        ("R-squared (3-factor)", d.get("r2_3factor")),
        ("% small cap", d.get("pct_small")), ("% emerging", d.get("pct_em")),
        ("skill z-score", d.get("ns_z")), ("skill", d.get("ns_skill")),
        ("skill months observed", d.get("ns_n_obs")),
        ("peers in skill universe", d.get("ns_n_peers")),
        ("return history months", len(d.get("manager_returns") or [])),
    ], note=f"Manager detail — {manager}")
    b = table(sorted(buckets.items(), key=lambda kv_: -abs(kv_[1] or 0)),
              ["style_bucket", "weight"], note="\nStyle buckets")
    f = table(sorted(betas.items(), key=lambda kv_: -abs(kv_[1] or 0)),
              ["factor_index", "beta"], note="\nFull-model factor betas")
    return f"{head}\n{b}\n{f}"


@tool_error_boundary
def get_client_portfolio(client_name: str) -> str:
    """A client's current and proposed manager line-up with weights, style
    loadings and skill scores.

    Args:
        client_name: exact client name from list_clients (e.g. "CALSTRS",
            "ATL Health").
    """
    try:
        d = client().get(f"/portfolio/{_q(client_name)}")
    except PCToolError as e:
        return _err(e)
    if d.get("error"):
        return f"Error: {d['error']}"
    mgrs = d.get("managers") or []
    rows = [(m.get("matched_name"), m.get("tab"),
             m.get("current_weight"), m.get("proposed_weight"),
             m.get("vg_full"), m.get("pct_small"), m.get("ns_z"))
            for m in mgrs]
    rows.sort(key=lambda r: -(r[2] or 0))
    head = kv([
        ("client", d.get("client")), ("benchmark", d.get("client_benchmark")),
        ("total AUM", d.get("client_aum")),
        ("unmatched names in weights file", ", ".join(d.get("unmatched") or []) or "none"),
    ], note=f"Portfolio — {client_name}")
    return head + "\n" + table(
        rows, ["manager", "peer_group", "current_wt", "proposed_wt",
               "vg_full", "pct_small", "skill_z"])


@tool_error_boundary
def get_portfolio_contribution(client_name: str) -> str:
    """Per-manager performance decomposition for a client: manager return,
    excess vs benchmark, and the split into passive style (what the manager's
    style tilts earned) versus manager skill (what is left after removing
    them). Quarter-to-date, trailing 1 year and trailing 3 years.

    Args:
        client_name: exact client name from list_clients.
    """
    try:
        d = client().get(f"/portfolio_contribution/{_q(client_name)}")
    except PCToolError as e:
        return _err(e)
    if d.get("error"):
        return f"Error: {d['error']}"
    rows = [(m.get("name"), m.get("weight"), m.get("qtd_mgr"), m.get("qtd_bench"),
             m.get("qtd_style"), m.get("qtd_skill"),
             m.get("t1_style"), m.get("t1_skill"),
             m.get("t3_style"), m.get("t3_skill"))
            for m in (d.get("managers") or [])]
    return table(rows,
                 ["manager", "weight", "qtd_return", "qtd_vs_bmk",
                  "qtd_style", "qtd_skill", "1y_style", "1y_skill",
                  "3y_style", "3y_skill"],
                 note=(f"Contribution — {client_name}. Style = clone minus "
                       "benchmark; Skill = manager minus own clone. "
                       "All figures in percent."))


@tool_error_boundary
def get_peer_group(peer_group: str) -> str:
    """Every manager in one peer group with style loadings, fit and skill —
    the Peer Groups tab as a table.

    Args:
        peer_group: one of EAFE, ISC (intl small cap), ACWI, EM, US, USSC (US small cap).
    """
    try:
        d = client().get(f"/peer_group_view/{_q(peer_group)}")
    except PCToolError as e:
        return _err(e)
    if d.get("error"):
        return f"Error: {d['error']}"
    rows = [(m.get("name"), m.get("vg_full"), m.get("vg_3factor"),
             m.get("pct_small"), m.get("pct_em"), m.get("r2_full"),
             m.get("ns_z"), m.get("qtd"), m.get("t1"), m.get("t3"))
            for m in (d.get("managers") or [])]
    rows.sort(key=lambda r: -(r[6] or -99))
    return table(rows, ["manager", "vg_full", "vg_3factor", "pct_small",
                        "pct_em", "r2", "skill_z", "qtd", "1yr", "3yr"],
                 note=f"Peer group {peer_group} (sorted by skill z-score)")


# ── exposures / attribution ──────────────────────────────────────────────
@tool_error_boundary
def list_groupings() -> str:
    """Valid `grouping` values for get_exposures, as raw FactSet column names
    with their display labels. Call this before get_exposures: the API matches
    the raw column name, and a wrong one returns a silently empty
    (100% Unclassified) table rather than an error."""
    d = client().post("/portfolio_exposures", {"grouping": None, "managers": []})
    if d.get("error"):
        return f"Error: {d['error']}"
    rows = []
    for grp in (d.get("menu") or []):
        for col in (grp.get("cols") or []):
            rows.append((grp.get("group"), col.get("col"), col.get("label")))
    return table(rows, ["kind", "grouping (use this)", "display label"],
                 max_rows=80,
                 note="Pass the middle column to get_exposures verbatim.")


@tool_error_boundary
def export_workbook(kind: str) -> str:
    """Save a full dataset to .xlsx and return its path. Prefer this over
    pulling raw rows for whole-dataset work (regressions, screens, long return
    histories) — the user attaches the file to analyse it.

    Args:
        kind: "returns" (manager + clone monthly returns) or "dispersion"
            (returns, summary, positioning, holdings).
    """
    endpoints = {"returns": "/export_returns_xlsx",
                 "dispersion": "/export_dispersion_xlsx"}
    ep = endpoints.get((kind or "").strip().lower())
    if not ep:
        return f"Error: kind must be one of {', '.join(endpoints)}."

    import datetime
    import os

    out_dir = os.environ.get("PC_TOOL_EXPORT_DIR") or os.path.join(
        os.path.expanduser("~"), "Claude")
    try:
        os.makedirs(out_dir, exist_ok=True)
    except OSError as e:
        return f"Error: cannot create export directory {out_dir}: {e}"

    raw = client().get_bytes(ep)
    stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    path = os.path.join(out_dir, f"pc-tool-{kind}-{stamp}.xlsx")
    with open(path, "wb") as f:
        f.write(raw)

    try:
        import openpyxl
        wb = openpyxl.load_workbook(path, read_only=True)
        shape = "; ".join(f"{s} ({wb[s].max_row}x{wb[s].max_column})"
                          for s in wb.sheetnames)
        wb.close()
    except Exception:  # noqa: BLE001 - shape is a nicety, not the deliverable
        shape = "could not read sheet dimensions"

    return (f"Saved {len(raw):,} bytes to:\n{path}\n\nSheets: {shape}\n\n"
            "Attach this file to analyse it — I cannot read it from here.")


@tool_error_boundary
def get_exposures(grouping: str, client_name: str = "", managers: str = "") -> str:
    """Exposure vs benchmark for one grouping — a whole client portfolio, or
    named managers side by side. Call list_groupings first.

    Args:
        grouping: raw column name from list_groupings, not the display label.
        client_name: for whole-portfolio exposure.
        managers: OR 1-5 exact names, comma-separated, each alone at 100%.
    """
    names = [n.strip() for n in (managers or "").split(",") if n.strip()]
    if bool(client_name) == bool(names):
        return ("Error: give exactly one of client_name or managers "
                "(comma-separated, 1-5 names).")
    if len(names) > 5:
        return f"Error: {len(names)} managers given; 5 at most."

    c = client()
    bad = _check_grouping(c, grouping)
    if bad:
        return bad
    source = _exposures_source(c)

    # ── whole client portfolio ───────────────────────────────────────────
    if client_name:
        port = c.get(f"/portfolio/{_q(client_name)}")
        if port.get("error"):
            return f"Error: {port['error']}"
        mgrs = [{"matched_name": m.get("matched_name"),
                 "current_weight": m.get("current_weight"),
                 "proposed_weight": m.get("proposed_weight")}
                for m in (port.get("managers") or [])]
        d = c.post("/portfolio_exposures",
                   {"managers": mgrs, "grouping": grouping,
                    "client_name": client_name})
        if d.get("error"):
            return f"Error: {d['error']}"
        rows = [(r.get("label"), r.get("benchmark"), r.get("current"),
                 r.get("delta_current")) for r in (d.get("rows") or [])]
        return table(rows, ["group", "benchmark_wt", "portfolio_wt", "active_wt"],
                     note=(f"Exposures — {client_name} by {grouping} "
                           f"(vs {d.get('benchmark_name', 'benchmark')}). "
                           f"Percent. {source}"))

    # ── named managers, each at 100% weight, pivoted into one table ──────
    # The API has no multi-manager mode, so this is one call per manager. The
    # bucket set is identical across them (benchmark-derived), so the columns
    # line up; preserve bucket order from the first response rather than
    # sorting, because quintiles are ordered Q1..Q5 and sorting would scramble.
    by_mgr, order, bench, bench_name = {}, [], {}, None
    lookup = _manager_tabs(c)
    for nm in names:
        tab = lookup.get(nm.lower())
        if tab is None:
            return (f"Error: no manager named {nm!r}. Use find_entity to get "
                    "the exact spelling.")
        d = c.post("/portfolio_exposures", {
            "managers": [{"matched_name": nm, "tab": tab,
                          "current_weight": 1.0, "proposed_weight": 1.0}],
            "grouping": grouping})
        if d.get("error"):
            return f"Error ({nm}): {d['error']}"
        bench_name = bench_name or d.get("benchmark_name")
        by_mgr[nm] = {}
        for r in (d.get("rows") or []):
            lb = r.get("label")
            if lb not in order:
                order.append(lb)
                bench[lb] = r.get("benchmark")
            by_mgr[nm][lb] = r.get("current")

    # Default missing buckets to 0, not blank. The endpoint returns the full
    # benchmark-derived bucket set per call (sectors a manager avoids come back
    # as explicit 0), so a bucket present for one manager and absent for another
    # means that manager genuinely holds none of it. Blank would read as
    # "unknown" and invite a hedge where the answer is simply zero.
    rows = [(lb, bench.get(lb), *[by_mgr[n].get(lb, 0) for n in names])
            for lb in order]
    return table(rows, ["group", "benchmark_wt", *names],
                 note=(f"Exposures by {grouping}, each manager alone at 100% "
                       f"(vs {bench_name or 'benchmark'}). Percent. {source}"))


@tool_error_boundary
def get_attribution_themes(benchmark: str = "", period: str = "") -> str:
    """Benchmark theme discovery: which sector / industry / country / metric
    combinations drove the benchmark's return, and which punched above their
    weight. Slow (30-80s). See the server instructions for how to read impact
    and intensity.

    Args:
        benchmark: exact name from get_status "attribution benchmarks";
            empty = first available.
        period: e.g. "31-MAR-2026 to 30-JUN-2026"; empty = the quarter.
    """
    try:
        d = client().get("/attribution_themes", benchmark=benchmark, period=period)
    except PCToolError as e:
        return _err(e)
    if d.get("error"):
        return f"Error: {d['error']}"
    rec = d.get("reconciliation") or {}
    ok = (rec.get("sum_weight_ok") and rec.get("partition_sum_ok")
          and rec.get("total_matches_reported") is not False)
    head = kv([
        ("benchmark", d.get("benchmark")), ("period", d.get("period")),
        ("benchmark return (bps)", d.get("r_b_bps")),
        ("securities", d.get("n_securities")),
        ("groups tested", d.get("n_candidates")),
        ("reconciled", "yes" if ok else "NO — treat rankings as unverified"),
        ("share-of-return ratio available",
         "yes" if d.get("ratio_available") else
         "no (benchmark return too close to zero for a ratio to mean anything)"),
    ], note="Benchmark theme discovery")

    def block(key, title):
        rows = [(r.get("label"), r.get("w"), r.get("r_g"), r.get("excess"),
                 round(r.get("e_g_bps") or 0, 1), r.get("share"), r.get("intensity"))
                for r in (d.get(key) or [])]
        return table(rows, ["theme", "weight", "group_return", "vs_bmk",
                            "impact_bps", "share_of_dispersion", "intensity"],
                     note=f"\n{title}")

    return "\n".join([head,
                      block("contributors", "Top contributors (by impact)"),
                      block("detractors", "Top detractors (by impact)"),
                      block("most_outsized", "Most outsized (by intensity)")])


@tool_error_boundary
def get_holdings_overlap(client_name: str) -> str:
    """Pairwise holdings overlap between a client's managers — how much of the
    portfolio is genuinely duplicated across sleeves. 'common_weight' is the
    overlapping weight inside the pair; 'scaled_common' weights it by each
    sleeve's share of the portfolio, which is the figure that matters for
    concentration. Requires a FactSet exposures file to be loaded.

    Args:
        client_name: exact client name from list_clients.
    """
    try:
        c = client()
        port = c.get(f"/portfolio/{_q(client_name)}")
        if port.get("error"):
            return f"Error: {port['error']}"
        # weight_file_name matters: overlap resolves sleeves by client
        # ownership, and dropping it loses the mapping for some sleeves.
        mgrs = [{"matched_name": m.get("matched_name"),
                 "weight_file_name": m.get("weight_file_name"),
                 "current_weight": m.get("current_weight"),
                 "proposed_weight": m.get("proposed_weight")}
                for m in (port.get("managers") or [])]
        d = c.post("/holdings_overlap", {"managers": mgrs, "client_name": client_name})
    except PCToolError as e:
        return _err(e)
    if d.get("error"):
        return f"Error: {d['error']}"

    rows = []
    for p in (d.get("pairs") or []):
        internal = p.get("internal") or {}
        scaled = p.get("scaled") or {}
        rows.append((p.get("name_i"), p.get("name_j"),
                     internal.get("common_weight"), scaled.get("common_weight"),
                     internal.get("shared_count"), internal.get("jaccard")))
    rows.sort(key=lambda r: -(r[2] or 0))
    warn = d.get("cash_warnings") or []
    unmatched = d.get("unmatched") or []
    note = (f"Holdings overlap — {client_name} "
            f"(vs {d.get('benchmark_name', '?')}, {d.get('weight_state', 'current')} "
            f"weights, matched on {d.get('match_basis', '?')}). Percent.")
    if unmatched:
        note += f"\nNot matched to holdings data: {', '.join(map(str, unmatched))}"
    if warn:
        note += f"\nCash warnings: {'; '.join(map(str, warn))}"
    return table(rows, ["manager_a", "manager_b", "common_weight",
                        "scaled_common", "shared_holdings", "jaccard"],
                 note=note)


TOOLS = [
    get_status, list_clients, list_managers, find_entity,
    get_manager_detail, get_client_portfolio, get_portfolio_contribution,
    get_peer_group, list_groupings, get_exposures, get_attribution_themes,
    get_holdings_overlap, export_workbook,
]
