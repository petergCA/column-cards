# Column Cards

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

A lightweight [Home Assistant](https://www.home-assistant.io/) Lovelace card that lays its child cards out in **balanced CSS columns** — filling **top‑to‑bottom down each column, then across** — instead of the default left‑to‑right row order.

Useful when you have an alphabetically (or otherwise) sorted list and you want it to read *down* the columns like a printed list, not snake across rows.

```
Row layout (default grid)        Column layout (this card)
┌─────┬─────┬─────┐              ┌─────┬─────┬─────┐
│  1  │  2  │  3  │              │  1  │  5  │  9  │
│  4  │  5  │  6  │      →       │  2  │  6  │ 10  │
│  7  │  8  │  9  │              │  3  │  7  │ 11  │
│ 10  │ 11  │ 12  │              │  4  │  8  │ 12  │
└─────┴─────┴─────┘              └─────┴─────┴─────┘
```

It auto‑balances any number of cards (uses CSS multi‑column), so you never have to hard‑code a row count.

## Installation

### HACS (recommended)

1. In Home Assistant go to **HACS → Dashboard** (or **Frontend**).
2. Click the **⋮** menu (top‑right) → **Custom repositories**.
3. Add the repository:
   - **Repository:** `petergCA/column-cards`
   - **Category / Type:** `Dashboard` (a.k.a. `Lovelace` / `Plugin`)
4. Click **Add**, then find **Column Cards** in the list and **Download** it.
5. **Hard‑refresh** your browser (Ctrl/Cmd + Shift + R) so the new card loads.

HACS registers the dashboard resource for you automatically.

### Manual

1. Download `column-cards.js` from the [latest release](https://github.com/petergCA/column-cards/releases).
2. Copy it to `config/www/column-cards.js`.
3. Add it as a dashboard resource (**Settings → Dashboards → ⋮ → Resources**):
   - **URL:** `/local/column-cards.js`
   - **Type:** `JavaScript Module`
4. Hard‑refresh your browser.

## Usage

```yaml
type: custom:column-cards
columns: 3
column_gap: 8px
cards:
  - type: entity
    entity: sensor.one
  - type: entity
    entity: sensor.two
  - type: entity
    entity: sensor.three
  # ...
```

### Options

| Name           | Type   | Default | Description                                                                                 |
| -------------- | ------ | ------- | ------------------------------------------------------------------------------------------- |
| `type`         | string | —       | `custom:column-cards` (required)                                                            |
| `cards`        | list   | —       | List of card configs to lay out (required)                                                  |
| `columns`      | number | `3`     | Number of columns. Ignored if `column_width` is set                                         |
| `column_width` | string | —       | A CSS length (e.g. `220px`). When set, columns are created responsively to fit this width   |
| `column_gap`   | string | `8px`   | Gap between columns (also used as the vertical gap between cards)                            |

### With `auto-entities`

Pairs nicely with [auto-entities](https://github.com/thomasloven/lovelace-auto-entities) — sort your entities, and let this card flow them down the columns:

```yaml
type: custom:auto-entities
filter:
  include:
    - integration: spoolman
      options:
        type: custom:mushroom-template-card
        primary: "{{ state_attr(entity, 'filament_name') }}"
sort:
  method: attribute
  attribute: filament_name
card:
  type: custom:column-cards
  columns: 3
card_param: cards
```

## Why?

Home Assistant's built‑in `grid` card lays cards out **row‑major** (1‑2‑3 across, then 4‑5‑6). There's no built‑in option to flow **column‑major** (down then across), and `card-mod` CSS can't always reach cards nested inside other custom cards (e.g. tabbed cards). This card does the layout itself with plain CSS multi‑column, so it always works.

## License

[MIT](LICENSE)
