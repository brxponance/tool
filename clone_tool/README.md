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

## Firm / Strategy Qualitative Data

Upload a qualitative workbook on the Setup tab ("Firm / Strategy Qualitative"
zone). It's cached and refreshed exactly like the weights file — re-upload or
use "Reload Inputs" to update it.

Layout (single sheet, layered): a header row, then repeating blocks of a firm
row followed by its strategy rows.
- Columns: `Firm / Strategy`, `Firm AUM ($mm)`, `Ownership`,
  `Diverse/Female Ownership %`, `Strategy AUM ($mm)`.
- A firm row has Firm AUM / Ownership / Diverse% filled and Strategy AUM blank.
- Strategy rows have only a name (matching the returns-file column header
  exactly) and that strategy's own AUM. Blank rows separate firm blocks.
- Firm-level fields (AUM, ownership, diverse %) are inherited by all the
  firm's strategies.

Where it shows up:
- Portfolio tab — an expandable chevron on each manager row reveals firm,
  firm/strategy AUM, diverse/woman %, ownership, sibling strategies, and (when
  a firm has multiple held strategies) the total weight held with that firm.
- Portfolio tab — a "Diverse / Woman Owned" panel below Portfolio Edge shows
  the weight to majority-owned (≥50%) diverse/woman-owned firms, current vs
  proposed, plus the diverse-firm count ratio. Rolls strategies up to firms.
- Peer Groups tab — the Manager Skill vs Static Clone table gains three
  sortable columns: Firm AUM, Strat AUM, Div/Woman %.

Managers without a qualitative record render as em-dashes; a partial upload
never breaks a table. Names are joined to the returns headers via the same
fuzzy matcher used elsewhere.
