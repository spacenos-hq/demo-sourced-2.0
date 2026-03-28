# Sourced by Dibbs 2.0 — Sales Pitch

Static HTML used for client walkthroughs: overview, investor story, validation evidence, spec, mobile mocks, and internal prototypes.

## Folder layout

| Path | Purpose |
|------|---------|
| **`index.html`** | Main overview (start here). Links to everything below. |
| **`site/`** | Long-form sales documents: pitch, validation library, master spec, AI narrative slice. |
| **`mockup/`** | Mobile screen catalog (UX prompts 1–15) + shared `css/` and `js/`. |
| **`reference/`** | UX framework, AI ops demo, post-requirement slice; **`reference/index.html`** lists them. |
| **`docs/`** | Design notes and tooling (e.g. `DESIGN_RULES.md`). |

## Entry points

- **Overview:** [`index.html`](index.html)
- **Pitch:** [`site/pitch.html`](site/pitch.html)
- **Validation:** [`site/demand.html`](site/demand.html)
- **Spec:** [`site/plansheet.html`](site/plansheet.html)
- **AI section (standalone):** [`site/sourced_ai_section.html`](site/sourced_ai_section.html)
- **Mobile mockups:** [`mockup/index.html`](mockup/index.html)
- **Reference hub:** [`reference/index.html`](reference/index.html)

## Navigation

The overview and each `site/*.html` page include a **docs switcher** (Overview, Pitch, Validation, Spec) plus **Mockups** and **Reference** where space allows. Theme uses `localStorage` key **`dibbs_theme`** (shared across overview, mockup catalog, and reference hub).

## Privacy / indexing

- `robots.txt` disallows crawlers.
- Pages use `noindex` meta tags.

Noindex is not access control; use auth on the host if content must stay private.

## Design system

- Fonts: **Syne** (display), **Inter** (body), **DM Mono** (labels).
- Details: [`docs/DESIGN_RULES.md`](docs/DESIGN_RULES.md)

## Pitch deck export (legacy note)

- Generator / deck paths may live outside this repo; see git history or internal docs if needed.
