# Sourced by Dibbs 2.0 — Sales Pitch Site

This folder contains a small, **static HTML microsite** used to help a client:

- clarify the idea and build plan
- review the investor story
- show proof/validation
- share a clean spec document

## Pages

- **`index.html` (Overview)**: executive summary (high signal). Links out to the other artifacts.
- **`pitch.html` (Pitch)**: investor narrative + numbers (kept clean; references validation instead of duplicating it).
- **`demand.html` (Validation)**: evidence library (quotes, reviews, comparisons).
- **`plansheet.html` (Spec)**: master specification + roadmap + build plan.

## Navigation

All pages include a **docs switcher**: **Overview / Pitch / Validation / Spec** (top right).

## Theme

- Light/Night toggle is included on all pages.
- Theme persists via `localStorage` key: **`dibbs_theme`**.

## Privacy / indexing

This project includes:

- `robots.txt` with `Disallow: /`
- `<meta name="robots" content="noindex,nofollow,...">` on all pages

Important: **noindex is not access control**. If you need true privacy, host behind **authentication** (password, private storage, or restricted access).

## Pitch deck export

- **Upgraded web-style deck**: `Sourced_Pitch_WebStyle.pptx`
- Generator script: `tools_generate_webstyle_pitch.py`
- Source deck referenced: `G:\\HQ Downloads\\Sourced_McKinsey.pptx`

## Design system

- Design rules / prompt: `DESIGN_RULES.md`
- Fonts: **Syne** (headings), **Inter** (body), **DM Mono** (labels)
