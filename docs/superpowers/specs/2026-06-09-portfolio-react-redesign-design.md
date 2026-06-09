# Portfolio Redesign — `somarjez.github.io` v2

**Date:** 2026-06-09
**Owner:** Jezreel Ramos (`somarjez`)
**Status:** Approved — ready for implementation plan

## Goal

Rebuild the existing single-file `index.html` portfolio as a modern, interactive
React application that **lists every public GitHub repository (and any public
organizations) live**, showcases featured work, and reads as a "sellable",
job-market-ready portfolio.

## Decisions (locked)

| Topic | Decision |
|-------|----------|
| Stack | React 18 + Vite + TailwindCSS + Framer Motion |
| Hosting | GitHub Pages, deployed via GitHub Actions (Pages source = "GitHub Actions") |
| Vite base | `/` (user page served at root) |
| Repo display | Live fetch all repos on load + curated Featured highlights |
| Repo scope | Show all repos equally in one interactive grid (no hiding/grouping) |
| Orgs | Fetch live; render conditionally (currently none public) |
| Contact form | Formspree (free) with `mailto:` fallback |
| Brand | Keep dark cyan/teal identity; add light/dark toggle (default dark) |

## Architecture

Single-page app, component-based. Data flows from one GitHub data hook down to
presentational sections.

```
src/
  main.jsx                 # React entry, mounts <App>
  App.jsx                  # layout: Nav + sections + Footer; theme provider
  index.css                # Tailwind directives + CSS vars (brand tokens)
  config/
    site.js                # name, bio, education, skills, contact links, GH username
    featured.js            # curated featured projects (repo name -> rich meta)
  hooks/
    useGitHub.js           # fetch user+repos(+orgs), localStorage cache (1h TTL), loading/error
    useScrollSpy.js        # active-section tracking for nav
  lib/
    github.js              # API calls + derive stats (stars, languages, account age)
  components/
    Nav.jsx                # fixed glass nav, scroll-spy, mobile hamburger, theme toggle
    Hero.jsx               # aurora bg, name/role, live "X repos · Y stars" badge, CTAs
    About.jsx              # photo + updated bio + education
    Skills.jsx             # 4 skill categories (from config)
    GitHubStats.jsx        # animated counters + language-distribution bar
    Featured.jsx           # curated rich project cards (tilt on hover)
    RepoGrid.jsx           # ALL repos; search + language filter + sort controls
    RepoCard.jsx           # one repo: name, desc, lang dot, stars, updated, link
    Orgs.jsx               # conditional org strip (hidden when none)
    Contact.jsx            # Formspree form + contact details, mailto fallback
    Footer.jsx
    Background.jsx         # animated aurora/grid layer
    ui/                    # Section wrapper, AnimatedCounter, Reveal (Framer Motion)
public/
  me.jpg                   # moved from images/
.github/workflows/deploy.yml
vite.config.js
tailwind.config.js
postcss.config.js
package.json
```

### Component contracts (the units)

- **useGitHub()** — *does:* fetches `users/somarjez`, `users/somarjez/repos?per_page=100&sort=updated`, and `users/somarjez/orgs`; caches each in `localStorage` keyed with a 1-hour TTL; returns `{ user, repos, orgs, stats, loading, error }`. *Depends on:* `lib/github.js`. *Used by:* App, passed via props/context to Hero, GitHubStats, RepoGrid, Featured, Orgs. *Testable:* mock `fetch`, assert cache hit/miss + stat derivation.
- **lib/github.js `deriveStats(user, repos)`** — pure function → `{ totalRepos, totalStars, languages: [{name,count}], topLanguage, accountAgeYears }`. Pure ⇒ unit-testable with no network.
- **RepoGrid** — *does:* renders all repos with live `search` (name+desc), `language` filter chips (derived from repos), and `sort` (recent|stars|name). State is local. *Depends on:* repo list (props). *Testable:* given a repo array, filtering/sorting produces expected subset/order.
- **Featured** — *does:* maps `config/featured.js` entries onto matching live repos (falls back to static meta if a repo is missing). *Depends on:* repos + featured config.
- **Orgs** — renders nothing when `orgs.length === 0`.
- **Contact** — posts to Formspree endpoint from `config/site.js`; on failure or missing endpoint, falls back to opening a prefilled `mailto:`.

### Data flow

`App` calls `useGitHub()` once → passes `user/repos/orgs/stats` to sections.
No global store needed (single fetch, read-only). Theme via a small context +
`localStorage`. Loading state shows skeleton cards; error state shows a friendly
message with a link to the GitHub profile (graceful degradation — the page still
renders all static content).

### Error handling

- Network/rate-limit error → cached data if available, else skeletons then an
  inline notice ("Live GitHub data unavailable, view profile →"). Static sections
  (hero, about, skills, featured static meta, contact) always render.
- Formspree error → `mailto:` fallback.
- Missing profile image → initials avatar fallback.

## Content (preserved + updated)

- **Name/role:** Jezreel Ramos — 3rd-Year BSCS-IS Student & Developer, Philippines 🇵🇭
- **Updated bio:** "A 3rd-year BS Computer Science (Information Systems) student
  from the Philippines who builds full-stack web, mobile, and AI-driven
  applications. Work spans Flutter mobile commerce (Findify), Flask/Django web
  platforms (Quizera e-learning, e-commerce), and machine-learning research —
  including a hybrid ML + Knowledge-Representation system for affordable housing
  in the Philippines. Works across C#/.NET, Java/Spring, Python, TypeScript,
  React/Next.js, and Dart, with a focus on clean architecture, real-world impact,
  and shipping."
- **Education:** BS Computer Science — Information Systems, 3rd Year.
- **Skills (4 groups, verbatim):** Core Languages (C#/.NET, Java/Spring,
  Python/Django/Flask, JavaScript, TypeScript, Dart); Backend & Database
  (Firebase/Firestore, MySQL/PostgreSQL, SQLite, RESTful APIs, GCP, JWT);
  Frontend & Mobile (React/Next.js, Flutter/Dart, HTML5/CSS3, Tailwind,
  Responsive, UI/UX); Tools (Git/GitHub, VS Code/IntelliJ, Figma).
- **Contact links (verbatim):** email `jezreelramoz@gmail.com`,
  GitHub `github.com/somarjez`, LinkedIn `linkedin.com/in/jezreel-ramos-49b029350`,
  Facebook `facebook.com/thenthen05`, portfolio `somarjez.github.io`.
- **Featured projects (curated):** Findify (Flutter mobile e-commerce, demo
  https://youtu.be/BgZDwtQfKKk), Flask-Ecommerce, 404 DreamTeam ML+KRR housing AI,
  Quizera e-learning, Simple Resume Analyzer (Python), Dart/Flutter Banking System.

## Creative / interactive layer

Aurora gradient + subtle animated grid background; glassmorphism cards;
Framer Motion scroll-reveal on every section; tilt-on-hover featured cards;
animated stat counters; language-distribution bar; scroll-spy sticky nav;
mobile hamburger; light/dark toggle (default dark).

## Deployment

`.github/workflows/deploy.yml`: on push to `main` → `npm ci` → `npm run build`
→ upload `dist/` artifact → `actions/deploy-pages`. Repo Settings → Pages →
Source = "GitHub Actions" (one-time manual step, documented in README).

## Testing

- Unit (Vitest): `deriveStats`, RepoGrid filter/sort logic, cache TTL logic in
  `useGitHub`, Featured config→repo mapping, Orgs empty-render.
- Build smoke: `npm run build` succeeds; `npm run preview` serves the SPA.
- Manual: live data loads, search/filter/sort work, responsive at mobile widths,
  theme toggle persists, contact fallback works.

## Out of scope (YAGNI)

Blog/CMS, i18n, backend server, analytics, private-repo/token auth (orgs stay
public-only unless the user later adds a token), per-repo detail pages.
