# Terminal-Accented Portfolio Redesign — Design Spec

**Date:** 2026-06-18
**Author:** Jezreel Ramos (with Claude)
**Status:** Approved, pending implementation plan

## Goal

Replace the current "Refined Midnight" glassmorphic portfolio — which reads as a
generic template — with a distinctive, **terminal-accented** experience that is
creative and interactive yet professional and recruiter-scannable.

The site stays a React + Vite + Tailwind single-page app with live GitHub data.
This is a visual/interaction redesign, not a re-architecture.

## Creative Direction

- **Direction:** Terminal / Dev, calibrated as **terminal-accented** — the hero
  and navigation carry the terminal metaphor; content sections (about, skills,
  projects) stay clean, readable, and polished with mono-flavored details.
- **Palette:** Tokyo Night, **dark-only** (the light-mode toggle is removed).
- **Signature interactions:** terminal boot hero, ⌘K command palette, cursor
  spotlight + 3D card tilt.

Rejected on purpose (YAGNI): full-terminal mode, live contribution heatmap,
easter-egg commands, sound, blog, light mode.

## Design Language

### Color tokens (Tokyo Night, dark-only)

| Token      | Hex                  | Use                                  |
| ---------- | -------------------- | ------------------------------------ |
| `bg`       | `#0a0e14`            | base canvas                          |
| `surface`  | `#0d1117`            | cards, terminal window               |
| `surface2` | `#11161f`            | elevated / hover                     |
| `line`     | `#1f2430`            | borders (hover → `#2a3040`)          |
| `text`     | `#c0caf5`            | body text                            |
| `muted`    | `#565f89`            | secondary text                       |
| `cyan`     | `#7dcfff`            | primary / links / focus              |
| `violet`   | `#bb9af7`            | secondary accent                     |
| `amber`    | `#e0af68`            | `$` prompts, highlights              |
| `green`    | `#9ece6a`            | prompt / success / "available"       |
| `red`      | `#f7768e`            | rare alerts/errors                   |

All text/background pairings must meet WCAG AA (4.5:1 for body, 3:1 for large).

### Typography (reuse existing fonts, new roles)

- **JetBrains Mono** — terminal chrome, section labels, `$` prefixes, code, palette.
- **Space Grotesk** — large display headings.
- **Inter** — body prose.

### Tailwind / CSS changes

- `tailwind.config.js`: replace the current color set (`ink`, `panel`, `primary`,
  `accent`, legacy `dark/darker/darkest`) with the Tokyo Night tokens above. Keep
  the `darkMode: 'class'` setting harmless but the app forces dark; remove reliance
  on it for light styling.
- `index.css`: remove the `html:not(.dark)` light-mode branches; restyle `.glass`
  and `.gradient-text` to the new palette; add terminal helpers (window chrome,
  blinking cursor, scanline/grid background).
- `index.html` / `main.jsx`: ensure the root element is always dark (set `dark`
  class once, or drop the class dependency entirely).

## Layout — Section by Section

The section order is unchanged: Hero → About → Skills → GitHub Stats → Featured →
Repo Grid → Orgs → Contact → Footer.

- **Nav** — slim editor/terminal tab bar: `~/jezreel` path on the left, scrollspy
  highlighting the active "file" (section), a `⌘K` hint chip, and social links.
  The theme toggle is removed.
- **Hero** — a terminal *window* with chrome (traffic-light dots + title like
  `jezreel@portfolio: ~`). It boots and types a short session: `$ whoami` →
  name + role, location line, and an `available for opportunities` status. CTAs
  render as commands: `./explore-work` and `./contact`. Live GitHub stats appear
  as command output (`repos · stars · languages`).
- **About** — clean prose column beside a "manifest" card that lists the focus
  pillars as commented `key = value` lines; education as one quiet line.
- **Skills** — readable category grid. Each card is titled like a file
  (`languages.json`, `frontend.tsx`, …); tags are syntax-colored pills.
- **GitHub Stats** — terminal-output stat tiles reusing the existing
  `AnimatedCounter`.
- **Featured** — polished project cards with `$`-prefixed titles, language dots,
  and the existing Demo/Code buttons; cards get spotlight + 3D tilt.
- **Repo Grid** — filterable list with a faux `$ ls projects --lang=…` filter bar;
  cards consistent with Featured.
- **Orgs** — compact card row.
- **Contact** — mono "message composer" styling; keeps the Formspree → mailto
  fallback behavior unchanged.
- **Footer** — minimal mono line ending on a blinking cursor + `EOF`.

## Signature Interactions

### 1. Terminal boot hero
A typewriter sequence with a blinking cursor that settles to the final rendered
state. Under `prefers-reduced-motion: reduce`, the final state renders instantly
with no typing animation. Implemented with the existing `framer-motion` or a small
custom hook — **no new dependencies**.

### 2. ⌘K command palette
A hand-rolled overlay (no new deps) opened by `⌘K` / `Ctrl+K` or a click on the
nav hint. Features:
- Fuzzy text filter over a static list of commands.
- Full keyboard navigation (↑/↓, Enter, ESC), focus trap, restores focus on close.
- ARIA: `role="dialog"`, labelled, listbox semantics for results.
- Actions: jump to each section, open GitHub / LinkedIn, copy email to clipboard.
  (No theme toggle action — site is dark-only.)

### 3. Cursor spotlight + 3D tilt
- A fixed radial-glow layer that follows the pointer via a CSS custom property,
  updated with an rAF-throttled `pointermove` handler.
- Subtle 3D tilt (`rotateX/rotateY`, small magnitude) on project/skill cards on
  hover, with a light sheen.
- Both are disabled on touch devices (no hover) and under reduced-motion.

### Background
Replace the purple radial blobs with a subtle Tokyo-night gradient plus a faint
grid/scanline texture. Keep it cheap (CSS only) and behind a reduced-motion guard
for any animated layer.

## Component Inventory

New components/hooks (small, single-purpose):
- `components/ui/TerminalWindow.jsx` — reusable window chrome wrapper.
- `components/ui/Typewriter.jsx` (or `hooks/useTypewriter.js`) — boot typing.
- `components/CommandPalette.jsx` — the ⌘K overlay.
- `hooks/useCommandPalette.js` — open/close + keyboard wiring.
- `hooks/usePointerSpotlight.js` — rAF-throttled pointer → CSS var.
- `components/ui/TiltCard.jsx` — hover tilt wrapper (no-op on touch/reduced-motion).

Removed:
- `hooks/useTheme.js` and the Nav theme toggle; all `html:not(.dark)` CSS.

Restyled (markup may change): `Nav`, `Hero`, `About`, `Skills`, `GitHubStats`,
`Featured`, `RepoCard`, `RepoGrid`, `Orgs`, `Contact`, `Footer`, `Background`.

## Accessibility & Performance

- Every animation (boot, tilt, spotlight, counters, background) respects
  `prefers-reduced-motion: reduce`.
- Command palette is fully keyboard operable and screen-reader labelled; a
  skip-to-content link is present.
- Color contrast meets WCAG AA.
- No new npm dependencies; reuse `framer-motion`. Pointer handler throttled to
  animation frames. No layout thrash from tilt (transform-only).

## Testing

- Keep the existing vitest suite green; update tests whose markup/queries change
  (`About`, `Featured`, `RepoCard`, `RepoGrid`, `Button`, `site` config).
- Remove/replace any test asserting the theme toggle.
- Add light tests:
  - Command palette opens on `⌘K`/`Ctrl+K`, filters, and runs an action.
  - Reduced-motion path renders hero content immediately (final state present).

## Acceptance Criteria

1. Site is dark-only Tokyo Night; no theme toggle anywhere.
2. Hero boots/types and settles; instant final state under reduced-motion.
3. ⌘K palette opens, filters, navigates by keyboard, and runs all listed actions.
4. Cursor spotlight + card tilt work on pointer devices, disabled on touch/RM.
5. All sections restyled per this spec; section order unchanged.
6. Live GitHub data, Demo/Code links, and Formspree→mailto fallback still work.
7. `npm test` passes; `npm run build` succeeds.
8. No new runtime dependencies added.
