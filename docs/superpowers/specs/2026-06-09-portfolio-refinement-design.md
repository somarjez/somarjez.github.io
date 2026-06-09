# Portfolio Refinement — Design Spec

**Date:** 2026-06-09
**Repo:** `somarjez.github.io` (React + Vite + Tailwind SPA)
**Goal:** Make the portfolio read as a professional-yet-creative developer portfolio: sharper copy, project-grounded skills, clear demo/code buttons, and a refined "Midnight" visual system.

---

## 1. Scope

In scope:
- Rewrite role/title, hero description, and About Me copy (remove student/"3rd Year" framing).
- Replace the education year-badge card with a "Focus" card; keep one quiet education line.
- Regroup Skills & Technologies into five project-grounded categories.
- Add labeled Demo / Code **buttons** to Featured Project cards and Repo grid cards (shown only when the link exists).
- Apply the "Refined Midnight" visual system (palette, typography, restraint).

Out of scope:
- Changing the live GitHub data flow (`useGitHub` / `fetchGitHub` / `deriveStats`) — it already works.
- Adding a CMS or making curated content dynamic. Curated content stays in `src/config/*`.
- Contact form backend changes.

## 2. Dynamic vs. curated (clarification, no change)

- **Dynamic (live GitHub API, 1h localStorage cache):** repository grid, GitHub stats (repo count, stars, languages), and live star counts on featured cards. Updates automatically when repos change.
- **Curated (hand-edited config):** which projects are featured, their titles/descriptions/tech tags (`src/config/featured.js`); bio, role, skills, education (`src/config/site.js`).
- **New dynamic touch:** Repo cards will surface a repo's GitHub `homepage` field as a Demo button — so setting a repo's "Website" on GitHub makes a demo button appear with no code change.

## 3. Content changes (`src/config/site.js`)

**role:** `Full-Stack & AI Developer`
**roleSub (new, optional):** `Web · Mobile · Machine Learning`

**bio (full, used in About Me):**
> I'm a developer who builds across the stack — web, mobile, and AI. My work spans Flutter mobile commerce, Flask and Django web platforms, and machine-learning research, including a hybrid ML + Knowledge-Representation system for affordable housing in the Philippines. I care about clean architecture, thoughtful UX, and shipping work that solves real problems. I'm comfortable across C#/.NET, Java/Spring, Python, TypeScript, React/Next.js, and Dart.

**Hero description (derived):** first two sentences of `bio`, or a dedicated short field:
> I build full-stack web, mobile, and AI-driven applications — from Flutter commerce apps to Flask/Django platforms and machine-learning systems for real-world problems.

**education:** keep as one quiet line, no year/level:
- `degree: 'BS Computer Science — Information Systems'`
- Drop the `year` field and its badge from the UI.

**focus (new):** three pillars for the About "Focus" card:
- `Full-Stack Web`
- `Mobile Apps`
- `AI / Machine Learning`

**skills (regrouped, five categories):**

| icon | title | tags |
|---|---|---|
| fa-code | Languages | Python, Dart, TypeScript, JavaScript, C# (.NET), Java |
| fa-palette | Frontend & Mobile | React / Next.js, Flutter, Tailwind CSS, HTML5 / CSS3 |
| fa-server | Backend & Data | Flask, Django, Firebase / Firestore, SQLite, MySQL / PostgreSQL, REST APIs |
| fa-brain | AI / Machine Learning | Python ML, Jupyter, Knowledge Representation & Reasoning, Data Analysis |
| fa-tools | Tools | Git / GitHub, VS Code, Figma |

## 4. Component changes

### About (`src/components/About.jsx`)
- Heading reframed: `Full-Stack & AI Developer` (drop "Computer Science Student").
- Body uses new `bio`.
- Replace the education year-badge card with:
  - A **Focus card**: three pills/items from `site.focus`.
  - A quiet education line beneath (small, muted): degree only, no badge.

### Hero (`src/components/Hero.jsx`)
- `role` + new `roleSub` line.
- Short description from the dedicated hero field (not naive `.split('. ')`).
- Keep the live stats line and the two CTAs, restyled to the new system.

### Featured cards (`src/components/Featured.jsx`)
- Remove the small top-right icon links.
- Add a button row at the card bottom:
  - `Live Demo ↗` — solid accent button — rendered only if `p.demo`.
  - `Code` — outline button with GitHub icon — rendered only if `p.source`.
- Keep icon, title, description, tech tags, and live star count.

### Repo grid cards (`src/components/RepoCard.jsx`)
- Card remains keyboard/click accessible.
- Add a button row:
  - `Demo ↗` — shown only if `repo.homepage` is a non-empty URL.
  - `Code` — links to `repo.html_url`.
- Restructure so buttons are real `<a>` elements (avoid nested-anchor issues): the card is a container `<div>`; the title links to the repo; buttons are separate anchors.

### Reusable button (new: `src/components/ui/Button.jsx`)
- A single `Button` component rendering an `<a>`, with a `variant` prop: `solid` (accent gradient) and `outline` (bordered, subtle), plus optional leading/trailing icon. Used by Featured and Repo cards for consistency.

## 5. Visual system — "Refined Midnight"

**Tailwind theme (`tailwind.config.js`):**
- Colors:
  - `ink` `#0B0B12` (page base), `panel` `#14141F`, `panel-2` `#1B1B28`
  - `accent` `#6D5EF8` (indigo), `accent-2` `#A78BFA` (violet)
  - `text` `#ECECF2`, `muted` `#8A8AA0`, `line` `#262635`
  - Keep `primary` as an alias of `accent` and `dark`/`darker` as aliases of `ink`/`panel` so existing class references keep working; new work uses the new names. No mass rename required.
- Fonts:
  - `display`: Space Grotesk (headings)
  - `sans`: Inter (body)
  - `mono`: JetBrains Mono (stats, labels, section numbers)

**Global styles (`src/index.css`):**
- Update background to ink, glass panels to subtler translucency over `panel`.
- Dial back neon glow; tighten heading tracking; consistent spacing rhythm.
- `gradient-text` uses accent→accent-2.

**Fonts loading (`index.html`):**
- Add Space Grotesk to the Google Fonts link (Inter + JetBrains Mono already present or added).

**Accent restraint:** accent reserved for buttons, key highlights, section numbers/labels, and the gradient name — not large fills.

## 6. Testing

- Existing unit tests (`github.test.js`, `RepoGrid.test.jsx`) must continue to pass.
- `RepoCard` change: update/extend its render test to assert a Demo button appears when `homepage` is set and is absent when not.
- `Featured` Card: add a render smoke test asserting Demo button presence keys off `demo`, Code off `source`.
- `npm run build` must succeed; verify no leftover references to removed theme tokens.

## 7. Acceptance criteria

1. No "3rd Year" / "student" framing anywhere in rendered output.
2. Role reads `Full-Stack & AI Developer`; About uses the new bio; Focus card shows three pillars; one quiet education line remains.
3. Skills show the five project-grounded categories above.
4. Featured cards render `Live Demo`/`Code` buttons exactly when those links exist.
5. Repo cards render a `Demo` button when `homepage` is set; always render a `Code`/repo link.
6. The site uses the Refined Midnight palette and Space Grotesk/Inter/JetBrains Mono typography.
7. `npm run build` passes and existing + new tests are green.
8. Live GitHub data flow is unchanged and still populates stats and the repo grid.
