# PC Tool MCP server (local, for Claude Desktop)

Query the tool's data by asking Claude Desktop in plain English — clients,
portfolios, manager clone profiles, peer groups, FactSet exposures, benchmark
attribution.

## This never ships to production

The backend Dockerfile copies `*.py` (a **top-level** glob) plus `db/` and
`migrations/`. Subdirectories are not matched, so this whole package is
version-controlled but **never enters the container image**. Verified: of the
37 files the image receives, zero come from `assistant/`.

Nor is it a server in the exposure sense. Claude Desktop launches it as a
subprocess and talks to it over a stdio pipe; it listens on no port and accepts
no connections. It is a *client* of the Flask API, not a new way in.

Access is governed by what your laptop can already reach. Pointed at
`localhost:3001` it only works while **your own** backend is running, and no
password is involved at all — the shared-password gate lives in the Next.js
middleware and is production-only, so local Flask has no auth.

**Remote access is off by default.** `PC_TOOL_URL` must be loopback unless you
set `PC_TOOL_ALLOW_REMOTE=1` *and* supply a password, so "local only" is a
property of the code rather than of configuration discipline.

## Setup

### 1. Install the dependency

One package; the HTTP client is stdlib.

```bash
cd backend
./venv/Scripts/python.exe -m pip install -r assistant/requirements.txt
```

### 2. Check it works

With the backend running (`start` skill, or
`cd backend && ./venv/Scripts/python.exe run.py`):

```bash
./venv/Scripts/python.exe assistant/mcp_server.py --selftest
```

Expect `target: http://localhost:3001 (local)`, `11 registered`, and `ok`
against every tool that takes no arguments.

### 3. Point Claude Desktop at it

**Use the app: `Settings -> Developer -> Edit Config`.** It opens the file the
app actually reads, whichever way Claude Desktop was installed. Do not guess the
path.

Why that matters: a **Microsoft Store (MSIX)** install virtualizes `%APPDATA%`,
so the config is NOT at `%APPDATA%\Claude\`. It lives at

```
%LOCALAPPDATA%\Packages\Claude_<packageid>\LocalCache\Roaming\Claude\claude_desktop_config.json
```

A file created at the plain `%APPDATA%\Claude\` path is simply never read.
(Standard non-Store installs do use `%APPDATA%\Claude\`.) To find it manually,
search `%LOCALAPPDATA%\Packages` for `claude_desktop_config.json`.

**Quit Claude Desktop before editing.** Closing the window leaves it running in
the tray, and a running app rewrites this file from memory on exit — silently
discarding your edit. Quit from the tray, or confirm no `claude` processes
remain.

**Add the `mcpServers` key; do not replace the file.** It already holds settings
such as `preferences` and `coworkUserFilesPath`.

```json
{
  "...": "existing keys stay exactly as they are",
  "mcpServers": {
    "pc-tool": {
      "command": "C:\\Users\\JuanBest\\CloneTool\\tool\\backend\\venv\\Scripts\\python.exe",
      "args": ["C:\\Users\\JuanBest\\CloneTool\\tool\\backend\\assistant\\mcp_server.py"],
      "env": { "PC_TOOL_URL": "http://localhost:3001" }
    }
  }
}
```

Absolute paths and doubled backslashes are required — Claude Desktop gives the
subprocess no useful working directory. Then restart the app.

A second packaged build (`Claude-3p`) keeps its own separate config; editing one
does not configure the other.

### 4. Ask it something

Start the backend first, then in Claude Desktop:

> Which clients are set up and what benchmark does each use?
> What's in the CALSTRS portfolio, and which managers overlap most?
> Break down CALSTRS contribution — which managers earned skill vs style?

## Tools

All read-only. No `/run`, no uploads, no weight edits, no deletes.

| Tool | Purpose |
|---|---|
| `get_status` | What data is loaded; whether clones are stale |
| `list_clients` | Client accounts and their benchmarks |
| `list_managers` | Every cloned manager, optionally by peer group |
| `find_entity` | **Resolve a spelling to the exact key** — see below |
| `get_manager_detail` | One manager's style buckets, betas, fit, skill |
| `get_client_portfolio` | A client's line-up with weights and loadings |
| `get_portfolio_contribution` | Per-manager style vs skill decomposition |
| `get_peer_group` | A whole peer group ranked by skill |
| `list_groupings` | Valid grouping column names — call before `get_exposures` |
| `get_exposures` | Exposure vs benchmark for a client **or** 1–5 named managers |
| `get_attribution_themes` | Benchmark theme discovery (slow: 30–80s, fix pending) |
| `get_holdings_overlap` | Pairwise sleeve overlap |
| `export_workbook` | Save returns / dispersion to .xlsx for offline analysis |

### Token cost, and why there are 13 tools and not 30

Tool *definitions* are re-sent on **every message**; answers are paid once.
Measured: ~2,182 tokens standing for all 13 tools, versus ~250 tokens to answer
*both* of "what are Martin's sector exposures" and "chart three managers against
the benchmark's ROE quintiles".

So adding tools is the expensive move and answering questions is nearly free.
That is why `get_exposures` takes either a client or a list of managers rather
than being split in two, why shared vocabulary lives in the server
`instructions` (sent once per session) rather than repeated in every docstring,
and why there is no tool-per-endpoint. Budget: keep `tools/list` under ~2,200
tokens; measure it rather than assuming.

### Whole-dataset questions

For anything needing the full dataset — long return histories, custom screens,
regressions — use `export_workbook` rather than pulling rows. It returns a path
in ~80 tokens for ~80,000 cells; the same data inline would be ~100k tokens.
You then attach the file to Claude, because files written by an MCP server are
**not** a documented input to Claude Desktop's code-execution sandbox.

### Why `find_entity` matters

The same manager is keyed four different ways across the system — returns
workbook `'Decatur'`, weights workbook `'Mac Alpha EAFE + Canada SC'`, FactSet
section `'XPNBCAHE-Ballina'`, eVestment `'Firm: Strategy'`. Without resolving
first, Claude guesses a spelling, the endpoint 404s, and you get a confident
wrong answer rather than a missing one. The server instructions tell Claude to
call it first; this is the single biggest determinant of whether answers are
trustworthy.

### Result size

`/peer_group_view/EAFE` is ~79 KB of raw JSON and `/manager_detail` carries
four 299-point return series. Every tool trims to a compact table, caps rows,
and says `showing N of M` rather than silently truncating. Typical output is
under 1 KB.

## Environment variables

| Variable | Default | Meaning |
|---|---|---|
| `PC_TOOL_URL` | `http://localhost:3001` | Where to query |
| `PC_TOOL_ALLOW_REMOTE` | unset | Must be `1` to allow a non-loopback URL |
| `PC_TOOL_PASSWORD` | unset | Shared gate password; only needed for remote |
| `PC_TOOL_TIMEOUT` | `120` | Per-request seconds |
| `PC_TOOL_EXPORT_DIR` | `~/Claude` | Where `export_workbook` saves files |
| `PC_TOOL_LOG_LEVEL` | `INFO` | stderr log level (captured into `mcp.log`) |

## Known limitation: no history

Exposures come from **one** loaded FactSet snapshot — uploading another replaces
it. There is no "as of date X"; a date question can only mean the currently
loaded file. `get_exposures` stamps that filename onto every answer so a result
can never be silently mis-dated, and `get_status` reports it. Real date
selection needs the historical-storage work discussed for attribution.

### Pointing at the deployment (optional)

Add `"PC_TOOL_ALLOW_REMOTE": "1"`, `"PC_TOOL_PASSWORD": "..."` and the ALB URL.
Note what this means: the deployment is internet-facing HTTP with one shared
password, so anyone holding that password already has full read **and write**
access through a browser. The MCP server grants nothing new — but putting the
password in a config file is a decision worth making deliberately.

The login route allows **10 attempts per 15 minutes** and then locks the IP
out, so the client logs in once and re-logins at most once per 401. It never
retries in a loop.

## Troubleshooting

**Claude Desktop doesn't list `pc-tool`** — JSON syntax error, a relative path,
the wrong config file, or it wasn't restarted. Run the selftest first to rule
out the server.

**A broken config fails silently in the UI.** The only evidence is
`%LOCALAPPDATA%\Claude\Logs\main.log`:

```
[info]  Reading claude_desktop_config.json from <path>
[error] Error reading or parsing config file (SyntaxError)
[warn]  Refusing config write: the load was degraded ...
```

That `Reading ... from <path>` line is the definitive answer to which file the
app uses. The "refusing config write" guard is protective — it stops the app
overwriting a config it could not parse. Note JavaScript's `JSON.parse` is
stricter than Python's `json`: a UTF-8 BOM, `NaN` or `Infinity` all fail there
while Python accepts them.

**`mcp.log` is empty after a restart** — the server was never spawned, so the
problem is the config, not the server.

**Every tool says "Could not reach the PC Tool"** — the backend isn't running.

**"not loopback"** — `PC_TOOL_URL` points somewhere remote without
`PC_TOOL_ALLOW_REMOTE=1`. Intended behaviour.

**Answers name a manager that doesn't exist** — Claude skipped `find_entity`.
Ask it to look the name up first.
