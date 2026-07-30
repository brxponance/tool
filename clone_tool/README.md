# Aapryl Clone Tool

Portfolio cloning analysis tool with Flask web interface.

## Quick Start

### 1. Setup Virtual Environment

```bash
python -m venv venv
```

### 2. Install Dependencies

```bash
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 3. Run the App

```bash
.\venv\Scripts\python.exe app.py
```

Or on a custom port (e.g., 3001):

```bash
.\venv\Scripts\python.exe -c "from app import app; app.run(host='127.0.0.1', port=3001)"
```

### 4. Open in Browser

- Default: `http://localhost:5050`
- Custom: `http://localhost:3001`

## Stop the Server

Press `CTRL+C` in the terminal.

## Holdings Overlap (Portfolio tab)

A pairwise holdings-overlap matrix appears on the Portfolio tab, above the
Market Cycle chart. For each pair of held managers it shows the number of
shared securities and the common weight (Σ min(wᵢ,wⱼ) over shared holdings).

- **Current / Proposed** toggle — which portfolio state to reflect.
- **Strategy / Client-scaled** weight basis:
  - *Strategy* uses each manager's own position weights (measures how alike
    the two strategies are, independent of allocation).
  - *Client-scaled* scales each position by the manager's allocation in the
    client portfolio (measures actual doubling-up in the client's book).
- **Match on — Security / Issuer:**
  - *Security* matches holdings by exact SEDOL (A-shares, H-shares, ADRs and
    preferreds count as separate securities).
  - *Issuer* collapses share classes: A/H shares, ADRs/GDRs and preferreds of
    the same issuer count as one holding, with weights summed within each
    manager before comparison. A guard keeps distinct firms that share a
    short name (e.g. "Tokai Corp." vs "Tokai Holdings Corporation") separate.
    The drill-down flags rows that fold more than two underlying share-class
    lines.
- Click any cell (or a "most overlap" chip) to drill down to the shared
  securities, with each manager's weight and the min column. Long lists cap
  at the top 25 with a "show all" toggle; the totals row always reflects all
  shared names.

Holdings come from the FactSet Exposures file uploaded on the Setup tab, so
the section only appears once that file is loaded.

## Firm Qualitative Data

Upload a firm-level qualitative workbook on the Setup tab ("Firm / Strategy
Qualitative" zone). It's cached and refreshed exactly like the weights file —
re-upload or use "Reload Inputs" to update it.

Format (single sheet, one row per firm):
- Columns: `Firm`, `Firm AUM ($mm)`, `Ownership`, `Diverse/Female Ownership %`.
- Enter the firm name as the stem its strategies share (e.g. "Arga",
  "CastleArk"). Each buy-list strategy is mapped to a firm by PREFIX MATCH:
  firm "Arga" captures "Arga", "Arga ISC", "Arga xUS", "ARGA Global". When
  several firms could match, the longest firm name wins.
- No strategy rows and no strategy AUM.

Where it shows up:
- Portfolio tab — an expandable chevron on each manager row reveals firm,
  firm AUM, diverse/woman %, ownership, sibling strategies, and (when a firm
  has multiple held strategies) the total weight held with that firm.
- Portfolio tab — a "Diverse / Woman Owned" panel below Portfolio Edge shows
  the weight to majority-owned (>=50%) diverse/woman-owned firms, current vs
  proposed, plus the diverse-firm count ratio. Rolls strategies up to firms.
- Peer Groups tab — the Manager Skill vs Static Clone table gains two sortable
  columns: Firm AUM and Div/Woman %.

Managers without a matching firm render as em-dashes; a partial upload never
breaks a table.

## Client AUM (weights file)

The manager-weights workbook may carry each client's total assets in COLUMN C
of the client-header row, next to the client name:
`[A: Client name] [B: Benchmark] [C: Total AUM in $]`. The figure is entered in
raw dollars (e.g. 2500000000) and displayed in full ($2,500,000,000). When
present, the Portfolio Managers table shows a "Client Total AUM" banner row and
an AUM column group with two sub-columns per manager — Current and Proposed —
each computed as (weight × client total AUM). The proposed AUM updates live as
proposed weights are edited. Older weights files without the AUM cell continue
to work; the AUM cells render as em-dashes.
