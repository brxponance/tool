# Attribution — benchmark theme discovery

Design + data spec for the Attribution tab. Agreed 2026-08-11→13, implemented
(P1) 2026-10-06.

This document exists because the original design lived only in a PDF outside
the repo and in a plan file that has since been cleaned up. `journal.md`
referenced "the design plan + FactSet pull spec journaled earlier this month"
and no such entry was ever written. Everything load-bearing is now here.

---

## The question

Which sector / industry / country / metric combinations in the **benchmark**
contributed an outsized share of performance relative to their weight — in
either direction?

Worked example: Japanese technology, semis in particular, contributing 20 % of
the return on 5 % of the weight should be flagged.

## The maths

Per security `s`: average weight `wₛ`, contribution to return `cₛ` (both
decimals internally; FactSet writes percents, the parser divides by 100).

```
w_G = Σ wₛ            group weight
c_G = Σ cₛ            group contribution
R_b = Σ cₛ (all s)    benchmark total return
R_G = c_G / w_G       group return
E_G = w_G (R_G − R_b) = c_G − w_G·R_b     ← the ranking metric, in bps
```

### Why E_G and not a share-of-performance ratio

**The benchmark return can be zero or negative.** Any metric shaped like
`c_G / R_b` divides by zero or silently inverts exactly then — which is also
precisely when an outsized contributor is most interesting (everything else
fell, this group carried it).

`E_G` never divides by `R_b`. It is an absolute quantity in return units,
reading as *"this group added (or cost) X bps versus holding it at the
benchmark's own average return."* It is also additive: `Σ E_G = 0` across a
complete partition, which is the strongest self-check available and is asserted
on every request.

### The "outsized" measure

```
dispersion = Σₛ |cₛ − wₛ·R_b|        total active dispersion, always > 0
share_G    = |E_G| / dispersion      group's share of it
intensity  = share_G / w_G           share per unit of weight
```

`intensity > 1` means the group drives more of the benchmark's active
dispersion than its size alone implies. This is the robust form of the "20 % of
return on 5 % of weight" intuition, and unlike the ratio it is defined at every
`R_b`.

`φ_G = c_G/R_b` and `excess_share = φ_G − w_G` are computed **only** when
`R_b ≥ +50 bps` — above the floor *and positive* — and are returned as nullable
fields. They answer the question in the form it is usually asked — *a group
holding 20 % of the benchmark should account for 20 % of its return; how far
past that did it land?* — and are shown beside `E_G` in the table.

They are a restatement of `E_G`, not a second measure: **`φ_G − w_G = E_G/R_b`
exactly**. Since `R_b` is one number for the whole table, ranking on either is
the same ranking — *while `R_b > 0`*.

**Why positive-only, not `|R_b|`.** Dividing by a negative `R_b` does not make
the figure noisy, it reverses it. Measured on EM's −303 bps July: China
cushioned the fall (`E_G` **+243 bps**) and reports **−80 pp**, while the
momentum pocket that drove the loss (`E_G` **−556 bps**) reports **+183 pp**.
Read left to right the column states the opposite of what happened. The framing
itself presumes a positive return to take a share of. **They must never rank,
gate, or headline anything; `E_G` is the sort key in every regime.**

(`ratio = φ_G/w_G` was the earlier multiplicative form of this. It was dropped:
it carries the same meaning as the difference but distorts it, reading 12.8× on
a group whose overshoot is +221 pp purely because `R_b` was small.)

### Three views, not one list

`E_G` favours large groups (what moved the benchmark). `intensity` favours
concentrated ones (what punched above its weight). A 25 %-weight sector beating
by 60 bps and a 3 %-weight industry beating by 900 bps are both worth knowing,
and neither ranking surfaces the other. So the UI offers **Top contributors**
and **Top detractors** (signed `E_G`, separate tables so a strong detractor is
never crowded out by winners) plus **Most outsized** (`intensity`).

### Language

Because `R_b` can be any sign, headers and narrative are phrased off `E_G`
("added 100 bps vs benchmark" / "cost 75 bps vs benchmark"). Never "contributed
20 % of performance" — that is false when `R_b ≤ 0`. A positive `E_G` in a down
quarter means *cushioned the decline*.

## Candidates

- **Singles** — every value of each categorical column, and the **top and
  bottom quintile only** of each continuous metric (`THEME_QUINTILES`).
  Vocabulary is reused wholesale from `exposures_engine.CATEGORICAL_COLS` /
  `CONTINUOUS_COLS`, so the groupings offered here are exactly those the
  Exposures tab shows.
- **Why not Q2–Q4.** A theme should name something you could hold a view
  about. "High-ROE names beat the market" is one; "mid-ROE names beat the
  market" is not — the middle of a distribution has no economic direction, so a
  Q3 bucket topping the table says the cut-points landed somewhere, not that
  anything happened. They also crowded out real findings, filling four of the
  top five contributors on EAFE + Canada before being dropped. Cutting them
  takes candidates from ~6,300 to ~1,600.
- **Pairs** — intersections across different columns. Capped at pairs.
- **Weight floor** 1 %. Applied to singles *first*: since
  `w(A∩B) ≤ min(w_A, w_B)`, a single below the floor cannot appear in any
  qualifying pair, which keeps the pair sweep small (~7 k candidates over 2.5 k
  securities runs in well under a second).
- **Nesting** — a group whose weight is ≥ 90 % explained by an already-surfaced
  stronger group is flagged `nested_in` and withheld from the headline list.
  Without this, "Energy", "Oil Gas & Consumable Fuels" and
  "Energy × Oil Gas & Consumable Fuels" take three of the top three slots for
  what is one finding.
- **Quintile labels carry the metric name** (`ROE Q1 (High)`, not `Q1 (High)`);
  two metrics' Q1 buckets are otherwise indistinguishable.

## The FactSet pull

The existing group-exposures template **plus two columns**:

- `Average Weight`
- `Contribution To Return`

Keep `SEDOL`, `Port. Ending Weight`, all grouping columns and all metric
columns.

**Do not rename `Port. Ending Weight`.** `exposures_engine` locates it by name
(`WEIGHT_HEADERS`), taking the last occurrence so the quarterly Total block's
ending weight is the current snapshot. Moving it is now safe; renaming it is
not. The two weights answer different questions: ending weight = what we hold
now, average weight = what we held across the period.

Until 2026-10-06 that read was positional (`row[2]`) and this spec said the
column must not move. The Q3 pull then inserted `Port. Average Weight` ahead of
it, and the Exposures tab silently reported July average weights as holdings —
same shape, still summing to 100, no error. Hence matching by name.

No total-return column is needed: `R_b = Σc`, and the section header row
already carries FactSet's own portfolio total, used as a checksum.

### Monthly vs quarterly average weight

**Pull the 4-block layout (3 monthly blocks + quarterly Total). Use the
quarterly block for P1.**

Quarterly average weight is not merely sufficient, it is *strictly closer to
FactSet* than anything derived from monthly data. Per-stock monthly
contributions do not sum to the quarterly contribution (FactSet links
geometrically), so the quarterly block's `Contribution To Return` is already
FactSet's own linked answer. Pairing that block's `Average Weight` with that
block's contribution is FactSet's own convention and makes `R_G ≡ c_G/w_G`
reconcile by construction.

**Never derive a quarterly weight by averaging three monthly average weights.**
That requires choosing an averaging scheme, differs from a time-weighted
quarterly average once weights trend, and breaks reconciliation.

Pull monthly anyway: P2's Brinson tables need it (allocation/selection on
quarterly averages cannot equal FactSet's linked monthly split — that is what
Cariño is for), P3 persistence reads month-level trajectories, and it is the
same file.

*Not independently verified:* FactSet's precise internal definition of
`Average Weight` is not documented in this repo (`factset_programmatic_env/`
is the quant/backtest API, not Portfolio Analysis methodology). The above rests
on reconciliation checks that passed exactly against "Contribution example.xlsx"
on 2026-08-12. The per-request `Σc = R_b` assertion guards it going forward.

### Rejected: the client-grouped composite export

"Composite Components" layout (managers as components of a client). Rebasing it
to manager space (`ctr ÷ avg weight`) was measured on 2026-08-13 to err up to
**+912 bps** for sleeves funded or terminated mid-quarter (CALSTRS-CastleArk
ending weight 0; Polen ramping 8.8 % → 21.8 %), and 4–50 bps even for steady
sleeves. Unusable as the input. It does carry FactSet-exact client-space
manager contributions, so keep it as an optional future supplement for
client-exact reporting — never as a substitute.

**Period boundaries must match across every pull.** An earlier pair mixed
29-MAY with 31-MAY month-ends, which alone breaks reconciliation.

## Phasing

| | |
|---|---|
| **P1** (done) | Parser, theme discovery, selection UI. Benchmark pull only. |
| **P2** | Manager positioning vs selected themes, Brinson-Fachler tables, client roll-up via a monthly components weights file. Needs sleeve files + that weights file. |
| **P3** | Magnitude-aware persistence (6-quarter window, baseline = mean of q1–q5 active weight, materiality = max(~100 bps, k × the manager's own dispersion); classifies consistent bias / recent shift / newly initiated-exited) and narrative. Deterministic template first, LLM polish later. |

P2 additionally needs a **monthly components weights file**: per client account,
per month, each sleeve's weight (average weight preferred), sleeve names
matching the section names. Client roll-up is then
`month-by-month Σ(weight × manager monthly theme ctr)`, linked — which captures
mid-quarter fundings and terminations (weight 0 ↔ positive across months is
also the add/remove signal feeding P3).

## Code

| | |
|---|---|
| `backend/attribution_engine.py` | `parse_attribution_file`, `discover_themes`, `reconcile` |
| `backend/app.py` | `POST /upload_attribution`, `GET /attribution_themes`, `state['attribution_data']` |
| `backend/tests/test_attribution_engine.py` | acceptance tests, incl. the degenerate-`R_b` cases |
| `frontend/src/features/attribution/components/theme-discovery-section.tsx` | the three views |

## Verification

Reconciliation must be exact before any ranking is trusted. Every response
carries a `reconciliation` block and the UI shows a red banner when it fails:

1. `Σ wₛ = 1.0` per section.
2. `Σ cₛ` equals the section header row's reported total.
3. `Σ E_G = 0` across a complete partition (GICS Sector).

Plus the degenerate cases, covered by the test script:

- `R_b = 0` exactly, one strong group, rest negative → it ranks top; `E_G` and
  `share` finite; `phi`/`excess_share` suppressed, not `NaN`/`Infinity`.
- `R_b < 0` → a group with `c_G = 0` reports **positive** `E_G`.
- `R_b > 0` with a large detractor → it appears in the detractor table.
- `R_b` inside the floor **or negative** → share-of-return columns blank,
  every other column populated.

Monthly contributions will **not** sum to the quarterly block. Expected —
FactSet links geometrically. Do not "fix" it.
