# Dibbs 2.0 — Website Design Rules (Copy/Paste for other AIs)

Use this document as the **single source of truth** for any new pages (`.html`), pitch decks (`.pptx`), videos, thumbnails, or marketing assets. The goal is a **premium, “confidential spec”** aesthetic: dark surfaces, gold accents, sharp typography, clean grids, and subtle motion.

---

## Brand vibe (non‑negotiable)

- **Positioning**: high-end, investor-grade, “master spec + evidence” document.
- **Tone**: calm confidence, data-forward, no hypey SaaS fluff.
- **Look**: premium dark UI, restrained gold highlights, editorial spacing, minimal gradients.
- **Avoid**: playful colors, glassy neon, busy illustrations, heavy shadows, cartoon icons.

---

## Color system (tokens)

Use **dark mode** as the default. Light mode is an alternate theme, not the primary identity.

### Core tokens (default / Night)

- **Background**: `#0B0C0E` (`--black`)
- **Surfaces**
  - `#111316` (`--surface`)
  - `#181B1F` (`--surface2`)
  - `#1E2228` (`--surface3`)
- **Text**
  - Primary: `#F2EDE4` (`--white`)
  - Secondary: `#9BA3B2` (`--mist2`)
  - Tertiary: `#7A8091` (`--mist`)
- **Borders**
  - Subtle: `rgba(255,255,255,.07)` (`--border`)
  - Strong: `rgba(255,255,255,.12)` (`--border2`)
- **Accent (gold)**
  - Primary: `#D4A843` (`--gold`)
  - Bright: `#F0C96A` (`--gold2`)
  - Dim fill: `rgba(212,168,67,.15)` (`--gold-dim`)
  - Border: `rgba(212,168,67,.25)` (`--gold-border`)
- **Supporting accents**
  - Teal: `#3ECFB2` + `rgba(62,207,178,.12)`
  - Blue: `#5B9CF6` + `rgba(91,156,246,.12)`
  - Red: `#E85D5D` + `rgba(232,93,93,.12)`
  - Amber: `#F0A84E` + `rgba(240,168,78,.12)`

### Light mode mapping (optional)

Light mode should keep the **same hierarchy**, not invent new colors:

- **Background**: `#F6F1E9`
- **Surface**: `#FFFFFF`
- **Surface2**: `#FBF7F0`
- **Surface3**: `#F2EBDD`
- **Text primary**: `#1A1612`
- **Text secondary**: `#6B6258` / `#8A8076`
- **Borders**: `rgba(26,22,18,.10)` / `rgba(26,22,18,.16)`

---

## Typography (readability-first)

### Fonts

- **Display / headings**: **Syne** (bold, modern, premium)
- **Body text**: **Inter** (high readability)
- **Labels / meta / UI chrome**: **DM Mono** (small uppercase)

### Usage rules

- **H1/H2**: Syne, heavy weight (700–800), tight line-height (~1.0–1.1), slight negative tracking OK.
- **Body**: Inter 14–17px web; avoid excessive letter-spacing.
- **Labels**: DM Mono, 9.5–11px, uppercase, letter-spacing 0.12–0.20em.
- **Never** use mono for paragraphs.
- **Never** use long ALL CAPS sentences outside labels.

---

## Layout + spacing

- **Max content width**: ~`1240px` (use centered container)
- **Section padding**: `clamp(64px, 8vw, 112px)` vertical; `clamp(24px, 6vw, 80px)` horizontal
- **Grid rhythm**: 12–16px gaps inside cards; 24–48px between blocks; 48px between section header and body.
- **Borders**: always subtle; avoid heavy outlines.
- **Radius**:
  - Small: `8px` (chips, small cards)
  - Large: `12px` (primary cards, callouts)

---

## Components (standard patterns)

### Cover / hero

- Full-viewport cover with:
  - **Noise overlay** (very subtle)
  - **Grid overlay** (gold at ~6% opacity)
  - **Radial glow** (gold dim)
- Eyebrow label: DM Mono + gold accent rule line.

### Sticky nav

- Sticky top bar, blurred backdrop, subtle border.
- Links are DM Mono uppercase.
- Active state: gold text + gold underline.
- Include right-side links to `Overview`, `Pitch`, `Validation`, `Spec` + **Theme toggle**.

### Stat cards

- 4-up grid, 2px gutter, top accent line in gold.
- Big number uses Syne; label uses DM Mono.

### Callouts

- Rounded 12px, colored dim background + matching border:
  - Gold for “north star / key point”
  - Teal for “positive / compliance / moat”
  - Red for “risk / pain”
  - Blue for “insight / data”

### Evidence / proof cards

- Dark surface card, subtle border, mono metadata, highlighted numbers in gold.
- Hover = tiny lift; no strong shadows.

### Tables

- Header row dark surface2, uppercase mono headers, subtle borders.
- Highlight “Sourced” row with gold-dim background.

### CTA + footer

- CTA section uses the grid overlay again.
- Footer is simple: Syne logo text + mono note.

---

## Motion rules (lightweight, production)

- Prefer **CSS-only** micro-interactions.
- Always include `prefers-reduced-motion: reduce` to disable animation/transition.
- Approved motions:
  - **Glow pulse** (8s ease-in-out, subtle scale 1 → 1.06)
  - **Reveal**: translateY(16–20px) + opacity 0 → 1
  - **Hover lift**: translateY(-2px to -3px)
  - **Underline fade** on nav hover
- Avoid:
  - Parallax
  - Heavy scroll-jank animations
  - Rapid looping animations
  - Large springy bounces

---

## Content style (how to write)

- Use **short, specific sentences**.
- Prefer **numbers** and named sources (NAHB, AGC, etc).
- Use “proof blocks” (quotes, receipts, deltas) instead of generic claims.
- Avoid “revolutionary,” “game-changing,” “next-gen,” etc.

---

## File/page conventions (this project)

- Pages: `index.html` (overview); sales docs in `site/` — `site/pitch.html`, `site/demand.html` (validation), `site/plansheet.html` (spec); mocks in `mockup/`; prototypes in `reference/`
- Always include:
  - Sticky nav (or top strip) with links between all pages
  - Theme toggle using `localStorage` key: `dibbs_theme`
  - Progress bar + gentle fade-in reveals

---

## Quick prompt you can paste into another AI

> Build a new page/deck/video in the Dibbs 2.0 style. Use premium dark UI, gold accents, Syne headings, Inter body, DM Mono labels. Use the exact token palette, spacing, card patterns, sticky nav, and subtle CSS-only animations with reduced-motion support. Keep it “confidential spec + evidence,” data-forward, minimal gradients, no neon, no heavy shadows.

