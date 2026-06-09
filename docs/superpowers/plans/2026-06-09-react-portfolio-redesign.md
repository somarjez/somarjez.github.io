# React Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `somarjez.github.io` as a React + Vite + Tailwind single-page portfolio that lists every public GitHub repo/org live, showcases featured projects, and auto-deploys to GitHub Pages.

**Architecture:** Vite SPA. One `useGitHub()` hook fetches user/repos/orgs (localStorage-cached, 1h TTL) and derives stats; presentational section components consume that data via props. Pure logic (stat derivation, repo filter/sort, cache TTL) is unit-tested with Vitest; UI gets render smoke tests. GitHub Actions builds `dist/` and deploys to Pages.

**Tech Stack:** React 18, Vite, TailwindCSS 3, Framer Motion, Vitest + @testing-library/react + jsdom.

---

## File Structure

```
package.json, vite.config.js, tailwind.config.js, postcss.config.js
index.html (Vite entry), vitest.setup.js
.github/workflows/deploy.yml
public/me.jpg
src/
  main.jsx, App.jsx, index.css
  config/site.js, config/featured.js
  lib/github.js
  hooks/useGitHub.js, hooks/useScrollSpy.js, hooks/useTheme.js
  components/Background.jsx, Nav.jsx, Hero.jsx, About.jsx, Skills.jsx,
    GitHubStats.jsx, Featured.jsx, RepoGrid.jsx, RepoCard.jsx, Orgs.jsx,
    Contact.jsx, Footer.jsx
  components/ui/Section.jsx, Reveal.jsx, AnimatedCounter.jsx
  lib/__tests__/github.test.js
  components/__tests__/RepoGrid.test.jsx
```

GitHub username is `somarjez` throughout.

---

### Task 1: Scaffold Vite React project

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `vitest.setup.js`, `src/main.jsx`, `src/App.jsx`, `src/index.css`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "somarjez-portfolio",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "framer-motion": "^11.3.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.6",
    "@testing-library/react": "^16.0.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "vite": "^5.3.3",
    "vitest": "^2.0.2"
  }
}
```

- [ ] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// User page served at root, so base '/'
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.js',
  },
})
```

- [ ] **Step 3: Create `vitest.setup.js`**

```js
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Create `postcss.config.js`**

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Create `tailwind.config.js`**

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00d9ff',
        'primary-dark': '#00b8d4',
        accent: '#4ecdc4',
        secondary: '#ff6b6b',
        dark: '#0a0e27',
        darker: '#070b1f',
        darkest: '#04081a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate(0,0) rotate(0deg)' },
          '50%': { transform: 'translate(-30px,30px) rotate(180deg)' },
        },
        'grid-move': {
          '0%': { transform: 'translate(0,0)' },
          '100%': { transform: 'translate(60px,60px)' },
        },
      },
      animation: {
        float: 'float 25s ease-in-out infinite',
        'grid-move': 'grid-move 30s linear infinite',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jezreel Ramos — Computer Science Student & Developer</title>
    <meta name="description" content="BS Computer Science (Information Systems) student building full-stack web, mobile, and AI applications." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #00d9ff;
  --accent: #4ecdc4;
}

html { scroll-behavior: smooth; }

body {
  @apply bg-darker text-slate-100 font-sans antialiased;
  line-height: 1.6;
}
html:not(.dark) body { @apply bg-slate-50 text-slate-900; }

.glass {
  @apply backdrop-blur-xl border;
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
}
html:not(.dark) .glass {
  background: rgba(255,255,255,0.7);
  border-color: rgba(0,0,0,0.08);
}
.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

- [ ] **Step 8: Create `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 9: Create `src/App.jsx` (stub)**

```jsx
export default function App() {
  return <h1 className="p-10 text-3xl gradient-text">Portfolio loading…</h1>
}
```

- [ ] **Step 10: Install and verify build**

Run: `npm install`
Run: `npm run build`
Expected: Vite builds successfully, creates `dist/index.html`.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite React + Tailwind + Vitest project"
```

---

### Task 2: `deriveStats` pure function (TDD)

**Files:**
- Create: `src/lib/github.js`, `src/lib/__tests__/github.test.js`

- [ ] **Step 1: Write the failing test** — create `src/lib/__tests__/github.test.js`

```js
import { describe, it, expect } from 'vitest'
import { deriveStats } from '../github.js'

describe('deriveStats', () => {
  const user = { created_at: '2020-01-01T00:00:00Z' }
  const repos = [
    { name: 'a', stargazers_count: 3, language: 'JavaScript' },
    { name: 'b', stargazers_count: 1, language: 'Python' },
    { name: 'c', stargazers_count: 0, language: 'JavaScript' },
    { name: 'd', stargazers_count: 0, language: null },
  ]

  it('counts repos and stars', () => {
    const s = deriveStats(user, repos)
    expect(s.totalRepos).toBe(4)
    expect(s.totalStars).toBe(4)
  })

  it('aggregates languages sorted by count, ignoring null', () => {
    const s = deriveStats(user, repos)
    expect(s.languages[0]).toEqual({ name: 'JavaScript', count: 2 })
    expect(s.topLanguage).toBe('JavaScript')
    expect(s.languages.find((l) => l.name === null)).toBeUndefined()
  })

  it('computes a non-negative account age in years', () => {
    const s = deriveStats(user, repos)
    expect(s.accountAgeYears).toBeGreaterThanOrEqual(0)
  })

  it('is safe with empty input', () => {
    const s = deriveStats(null, [])
    expect(s.totalRepos).toBe(0)
    expect(s.totalStars).toBe(0)
    expect(s.languages).toEqual([])
    expect(s.topLanguage).toBe(null)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- github`
Expected: FAIL — `deriveStats is not a function` / module not found.

- [ ] **Step 3: Write minimal implementation** — create `src/lib/github.js`

```js
export function deriveStats(user, repos) {
  const list = Array.isArray(repos) ? repos : []
  const totalRepos = list.length
  const totalStars = list.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

  const counts = {}
  for (const r of list) {
    if (!r.language) continue
    counts[r.language] = (counts[r.language] || 0) + 1
  }
  const languages = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  let accountAgeYears = 0
  if (user?.created_at) {
    const ms = Date.now() - new Date(user.created_at).getTime()
    accountAgeYears = Math.max(0, Math.floor(ms / (365.25 * 24 * 3600 * 1000)))
  }

  return {
    totalRepos,
    totalStars,
    languages,
    topLanguage: languages[0]?.name ?? null,
    accountAgeYears,
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- github`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/github.js src/lib/__tests__/github.test.js
git commit -m "feat: add deriveStats with tests"
```

---

### Task 3: Cached fetch helpers (TDD)

**Files:**
- Modify: `src/lib/github.js`
- Modify: `src/lib/__tests__/github.test.js`

- [ ] **Step 1: Add failing tests for `cacheGet`/`cacheSet`** — append to `src/lib/__tests__/github.test.js`

```js
import { cacheGet, cacheSet } from '../github.js'

describe('cache', () => {
  beforeEach(() => localStorage.clear())

  it('returns null on miss', () => {
    expect(cacheGet('k', 1000)).toBe(null)
  })

  it('returns value within TTL', () => {
    cacheSet('k', { a: 1 })
    expect(cacheGet('k', 60_000)).toEqual({ a: 1 })
  })

  it('returns null when expired', () => {
    cacheSet('k', { a: 1 })
    const raw = JSON.parse(localStorage.getItem('k'))
    raw.t = Date.now() - 10_000
    localStorage.setItem('k', JSON.stringify(raw))
    expect(cacheGet('k', 5_000)).toBe(null)
  })
})
```

Add `import { describe, it, expect, beforeEach } from 'vitest'` (update the existing import line to include `beforeEach`).

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- github`
Expected: FAIL — `cacheGet is not a function`.

- [ ] **Step 3: Implement cache + fetch helpers** — append to `src/lib/github.js`

```js
const API = 'https://api.github.com'

export function cacheSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }))
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function cacheGet(key, ttlMs) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { t, v } = JSON.parse(raw)
    if (Date.now() - t > ttlMs) return null
    return v
  } catch {
    return null
  }
}

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return res.json()
}

const TTL = 60 * 60 * 1000 // 1 hour

export async function fetchGitHub(username) {
  const key = `gh:${username}`
  const cached = cacheGet(key, TTL)
  if (cached) return cached

  const [user, repos, orgs] = await Promise.all([
    getJson(`${API}/users/${username}`),
    getJson(`${API}/users/${username}/repos?per_page=100&sort=updated`),
    getJson(`${API}/users/${username}/orgs`).catch(() => []),
  ])
  const data = { user, repos, orgs }
  cacheSet(key, data)
  return data
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- github`
Expected: PASS (all cache + deriveStats tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/github.js src/lib/__tests__/github.test.js
git commit -m "feat: add cached GitHub fetch helpers with tests"
```

---

### Task 4: `useGitHub` and `useTheme` hooks

**Files:**
- Create: `src/hooks/useGitHub.js`, `src/hooks/useTheme.js`

- [ ] **Step 1: Create `src/hooks/useGitHub.js`**

```js
import { useEffect, useState } from 'react'
import { fetchGitHub, deriveStats } from '../lib/github.js'

export function useGitHub(username) {
  const [state, setState] = useState({
    user: null,
    repos: [],
    orgs: [],
    stats: deriveStats(null, []),
    loading: true,
    error: null,
  })

  useEffect(() => {
    let alive = true
    fetchGitHub(username)
      .then(({ user, repos, orgs }) => {
        if (!alive) return
        setState({
          user,
          repos,
          orgs,
          stats: deriveStats(user, repos),
          loading: false,
          error: null,
        })
      })
      .catch((error) => {
        if (!alive) return
        setState((s) => ({ ...s, loading: false, error: error.message }))
      })
    return () => {
      alive = false
    }
  }, [username])

  return state
}
```

- [ ] **Step 2: Create `src/hooks/useTheme.js`**

```js
import { useEffect, useState } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark',
  )
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}
```

- [ ] **Step 3: Verify it compiles** (no separate test; covered by build)

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useGitHub.js src/hooks/useTheme.js
git commit -m "feat: add useGitHub and useTheme hooks"
```

---

### Task 5: Site + featured config (content)

**Files:**
- Create: `src/config/site.js`, `src/config/featured.js`

- [ ] **Step 1: Create `src/config/site.js`**

```js
export const site = {
  username: 'somarjez',
  name: 'Jezreel Ramos',
  role: '3rd-Year BSCS-IS Student & Developer',
  location: 'Philippines 🇵🇭',
  bio: "A 3rd-year BS Computer Science (Information Systems) student from the Philippines who builds full-stack web, mobile, and AI-driven applications. My work spans Flutter mobile commerce (Findify), Flask/Django web platforms (Quizera e-learning, e-commerce), and machine-learning research — including a hybrid ML + Knowledge-Representation system for affordable housing in the Philippines. I work across C#/.NET, Java/Spring, Python, TypeScript, React/Next.js, and Dart, with a focus on clean architecture, real-world impact, and shipping.",
  education: {
    degree: 'BS Computer Science — Information Systems',
    year: '3rd Year',
    detail:
      'Focus on software engineering, database systems, machine learning, and information technology management.',
  },
  // Replace with a real Formspree form id; falls back to mailto when empty.
  formspreeId: '',
  links: {
    email: 'jezreelramoz@gmail.com',
    github: 'https://github.com/somarjez',
    linkedin: 'https://linkedin.com/in/jezreel-ramos-49b029350',
    facebook: 'https://www.facebook.com/thenthen05',
    website: 'https://somarjez.github.io/',
  },
  skills: [
    {
      icon: 'fa-code',
      title: 'Core Programming Languages',
      tags: ['C# (.NET)', 'Java (Spring)', 'Python (Django/Flask)', 'JavaScript', 'TypeScript', 'Dart'],
    },
    {
      icon: 'fa-server',
      title: 'Backend & Database',
      tags: ['Firebase/Firestore', 'MySQL/PostgreSQL', 'SQLite', 'RESTful APIs', 'Google Cloud Platform', 'JWT Authentication'],
    },
    {
      icon: 'fa-palette',
      title: 'Frontend & Mobile',
      tags: ['React.js/Next.js', 'Flutter/Dart', 'HTML5/CSS3', 'Tailwind CSS', 'Responsive Design', 'UI/UX Principles'],
    },
    {
      icon: 'fa-tools',
      title: 'Tools & Technologies',
      tags: ['Git/GitHub', 'VS Code/IntelliJ', 'Figma'],
    },
  ],
}
```

- [ ] **Step 2: Create `src/config/featured.js`**

```js
// Keyed by repo name (lowercase) when it exists on GitHub; `repo` may be null
// for projects hosted under a different repo name (e.g. Findify).
export const featured = [
  {
    repo: null,
    title: 'Findify — Mobile E-Commerce Platform',
    icon: 'fa-mobile-screen',
    description:
      'A cross-platform Flutter e-commerce app with product discovery, cart, and Firebase-backed auth and data.',
    tech: ['Flutter', 'Dart', 'Firebase'],
    source: 'https://github.com/somarjez/Findify',
    demo: 'https://youtu.be/BgZDwtQfKKk',
  },
  {
    repo: '404-dreamteamfinal-project-ml-krr-1ay2526',
    title: 'AI for Affordable Housing (ML + KRR)',
    icon: 'fa-brain',
    description:
      'A hybrid AI platform combining Machine Learning and Knowledge Representation & Reasoning for sustainable housing choices in the Philippines.',
    tech: ['Python', 'Jupyter', 'Machine Learning'],
    source: 'https://github.com/somarjez/404-DreamTeamFinal-Project-ML-KRR-1AY2526',
    demo: null,
  },
  {
    repo: 'quizera---e-learning-platform',
    title: 'Quizera — E-Learning Platform',
    icon: 'fa-graduation-cap',
    description: 'A quiz-based e-learning platform for interactive assessments and learning.',
    tech: ['Flask', 'HTML', 'Python'],
    source: 'https://github.com/somarjez/Quizera---E-learning-Platform',
    demo: null,
  },
  {
    repo: 'flask-ecommerce',
    title: 'Flask E-Commerce',
    icon: 'fa-cart-shopping',
    description: 'A full-stack e-commerce web app built with Flask, featuring product catalog and checkout flow.',
    tech: ['Flask', 'Python', 'SQLite'],
    source: 'https://github.com/somarjez/Flask-Ecommerce',
    demo: null,
  },
  {
    repo: 'simple-resume-analyzer',
    title: 'Resume Analyzer',
    icon: 'fa-file-lines',
    description: 'A Python tool that parses and analyzes resumes to surface key skills and insights.',
    tech: ['Python'],
    source: 'https://github.com/somarjez/Simple-Resume-Analyzer',
    demo: null,
  },
  {
    repo: 'dart_flutter_bankingsystem',
    title: 'Flutter Banking System',
    icon: 'fa-building-columns',
    description: 'A Dart/Flutter banking system demo with account management and transaction flows.',
    tech: ['Dart', 'Flutter'],
    source: 'https://github.com/somarjez/Dart_Flutter_BankingSystem',
    demo: null,
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/config/site.js src/config/featured.js
git commit -m "feat: add site and featured project config"
```

---

### Task 6: UI primitives (Section, Reveal, AnimatedCounter)

**Files:**
- Create: `src/components/ui/Section.jsx`, `src/components/ui/Reveal.jsx`, `src/components/ui/AnimatedCounter.jsx`

- [ ] **Step 1: Create `src/components/ui/Reveal.jsx`**

```jsx
import { motion } from 'framer-motion'

export default function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 2: Create `src/components/ui/Section.jsx`**

```jsx
export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      {title && (
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Create `src/components/ui/AnimatedCounter.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ value, duration = 1200 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setN(Math.round(p * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return <span ref={ref}>{n}</span>
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui
git commit -m "feat: add Section, Reveal, AnimatedCounter UI primitives"
```

---

### Task 7: Background + Nav

**Files:**
- Create: `src/components/Background.jsx`, `src/components/Nav.jsx`, `src/hooks/useScrollSpy.js`

- [ ] **Step 1: Create `src/components/Background.jsx`**

```jsx
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-dark to-darker">
      <div className="absolute inset-0 animate-float opacity-70"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(0,217,255,0.15) 0%, transparent 50%),' +
            'radial-gradient(circle at 80% 20%, rgba(255,107,107,0.10) 0%, transparent 50%),' +
            'radial-gradient(circle at 40% 80%, rgba(78,205,196,0.12) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 animate-grid-move opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(45deg, transparent 49%, rgba(0,217,255,0.03) 50%, transparent 51%),' +
            'linear-gradient(-45deg, transparent 49%, rgba(78,205,196,0.03) 50%, transparent 51%)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 2: Create `src/hooks/useScrollSpy.js`**

```js
import { useEffect, useState } from 'react'

export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + offset
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= pos) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offset])
  return active
}
```

- [ ] **Step 3: Create `src/components/Nav.jsx`**

```jsx
import { useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy.js'

const LINKS = [
  ['home', 'Home'],
  ['about', 'About'],
  ['stats', 'GitHub'],
  ['projects', 'Projects'],
  ['repos', 'Repositories'],
  ['contact', 'Contact'],
]

export default function Nav({ theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(LINKS.map(([id]) => id))

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="glass fixed inset-x-0 top-0 z-50 px-5 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button onClick={() => go('home')} className="font-mono text-lg font-bold gradient-text">
          &lt;jezreel/&gt;
        </button>
        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`text-sm transition-colors hover:text-primary ${
                active === id ? 'text-primary' : 'text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
          <button onClick={onToggleTheme} aria-label="Toggle theme" className="text-slate-300 hover:text-primary">
            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
          </button>
        </div>
        <button className="md:hidden text-xl text-slate-200" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </div>
      {open && (
        <div className="mt-3 flex flex-col gap-3 md:hidden">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="text-left text-sm text-slate-200">
              {label}
            </button>
          ))}
          <button onClick={onToggleTheme} className="text-left text-sm text-slate-200">
            Toggle {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/Background.jsx src/components/Nav.jsx src/hooks/useScrollSpy.js
git commit -m "feat: add animated background and scroll-spy nav"
```

---

### Task 8: Hero

**Files:**
- Create: `src/components/Hero.jsx`

- [ ] **Step 1: Create `src/components/Hero.jsx`**

```jsx
import { motion } from 'framer-motion'
import { site } from '../config/site.js'

export default function Hero({ stats, loading }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-5 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          Available for opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-extrabold md:text-7xl"
        >
          <span className="gradient-text">{site.name}</span>
        </motion.h1>

        <p className="mt-4 text-xl text-slate-300 md:text-2xl">{site.role}</p>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">{site.bio.split('. ').slice(0, 2).join('. ')}.</p>

        {!loading && (
          <div className="mt-6 font-mono text-sm text-primary">
            {stats.totalRepos} repositories · {stats.totalStars} stars · {stats.languages.length} languages
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#projects" className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-darker transition-transform hover:scale-105">
            <i className="fas fa-rocket mr-2" /> Explore My Work
          </a>
          <a href="#contact" className="glass rounded-full px-6 py-3 font-semibold transition-transform hover:scale-105">
            <i className="fas fa-paper-plane mr-2" /> Let's Collaborate
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: add Hero with live GitHub badge"
```

---

### Task 9: About + Skills

**Files:**
- Create: `src/components/About.jsx`, `src/components/Skills.jsx`

- [ ] **Step 1: Create `src/components/About.jsx`**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function About() {
  return (
    <Section id="about" title="About Me">
      <div className="grid items-center gap-10 md:grid-cols-[300px_1fr]">
        <Reveal className="mx-auto">
          <img
            src="/me.jpg"
            alt={site.name}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className="h-64 w-64 rounded-2xl object-cover shadow-2xl ring-2 ring-primary/40"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="text-2xl font-bold">
            Computer Science Student & <span className="gradient-text">Developer</span>
          </h3>
          <p className="mt-4 text-slate-300">{site.bio}</p>
          <div className="glass mt-6 rounded-xl p-5">
            <h4 className="font-semibold text-primary">
              <i className="fas fa-graduation-cap mr-2" />
              {site.education.degree}
              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                {site.education.year}
              </span>
            </h4>
            <p className="mt-2 text-sm text-slate-400">{site.education.detail}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Create `src/components/Skills.jsx`**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function Skills() {
  return (
    <Section title="Skills & Technologies">
      <div className="grid gap-6 md:grid-cols-2">
        {site.skills.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.05}>
            <div className="glass h-full rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-3 font-semibold">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-darker">
                  <i className={`fas ${cat.icon}`} />
                </span>
                {cat.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((t) => (
                  <span key={t} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.jsx src/components/Skills.jsx
git commit -m "feat: add About and Skills sections"
```

---

### Task 10: GitHubStats

**Files:**
- Create: `src/components/GitHubStats.jsx`

- [ ] **Step 1: Create `src/components/GitHubStats.jsx`**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import AnimatedCounter from './ui/AnimatedCounter.jsx'

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', Dart: '#00B4AB', Blade: '#f7523f',
  'Jupyter Notebook': '#DA5B0B', CSS: '#563d7c', Java: '#b07219',
}

export default function GitHubStats({ stats, loading }) {
  const cards = [
    { label: 'Repositories', value: stats.totalRepos, icon: 'fa-folder' },
    { label: 'Total Stars', value: stats.totalStars, icon: 'fa-star' },
    { label: 'Languages', value: stats.languages.length, icon: 'fa-code' },
    { label: 'Years on GitHub', value: Math.max(1, stats.accountAgeYears), icon: 'fa-calendar' },
  ]
  const total = stats.languages.reduce((s, l) => s + l.count, 0) || 1

  return (
    <Section id="stats" title="GitHub at a Glance" subtitle="Pulled live from the GitHub API">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.05}>
            <div className="glass rounded-2xl p-6 text-center">
              <i className={`fas ${c.icon} mb-3 text-2xl text-primary`} />
              <div className="text-4xl font-extrabold">
                {loading ? '—' : <AnimatedCounter value={c.value} />}
              </div>
              <div className="mt-1 text-sm text-slate-400">{c.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {!loading && stats.languages.length > 0 && (
        <Reveal delay={0.1}>
          <div className="glass mt-8 rounded-2xl p-6">
            <h4 className="mb-4 font-semibold">Language Distribution</h4>
            <div className="flex h-4 overflow-hidden rounded-full">
              {stats.languages.map((l) => (
                <div
                  key={l.name}
                  title={`${l.name} · ${l.count}`}
                  style={{ width: `${(l.count / total) * 100}%`, background: LANG_COLORS[l.name] || '#64748b' }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
              {stats.languages.slice(0, 8).map((l) => (
                <span key={l.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[l.name] || '#64748b' }} />
                  {l.name} ({l.count})
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/GitHubStats.jsx
git commit -m "feat: add live GitHub stats with language distribution"
```

---

### Task 11: Featured projects

**Files:**
- Create: `src/components/Featured.jsx`

- [ ] **Step 1: Create `src/components/Featured.jsx`**

```jsx
import { motion } from 'framer-motion'
import Section from './ui/Section.jsx'
import { featured } from '../config/featured.js'

function Card({ p, live }) {
  const stars = live?.stargazers_count ?? 0
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="glass flex h-full flex-col rounded-2xl p-6"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl text-darker">
          <i className={`fas ${p.icon}`} />
        </span>
        <div className="flex gap-3 text-slate-300">
          {p.source && (
            <a href={p.source} target="_blank" rel="noreferrer" title="Source" className="hover:text-primary">
              <i className="fab fa-github" />
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" title="Demo" className="hover:text-primary">
              <i className="fas fa-play" />
            </a>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold">{p.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-400">{p.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span key={t} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{t}</span>
        ))}
      </div>
      {stars > 0 && (
        <div className="mt-3 text-xs text-slate-500">
          <i className="fas fa-star text-yellow-400" /> {stars}
        </div>
      )}
    </motion.div>
  )
}

export default function Featured({ repos }) {
  const byName = Object.fromEntries((repos || []).map((r) => [r.name.toLowerCase(), r]))
  return (
    <Section id="projects" title="Featured Projects" subtitle="Selected work worth a closer look">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <Card key={p.title} p={p} live={p.repo ? byName[p.repo] : null} />
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Featured.jsx
git commit -m "feat: add featured projects with tilt cards and live stars"
```

---

### Task 12: RepoCard + RepoGrid filter/sort (TDD on logic)

**Files:**
- Create: `src/components/RepoCard.jsx`, `src/components/RepoGrid.jsx`, `src/lib/repoFilter.js`, `src/components/__tests__/RepoGrid.test.jsx`

- [ ] **Step 1: Write failing test for filter/sort logic** — create `src/lib/repoFilter.js` test at `src/components/__tests__/RepoGrid.test.jsx`

```jsx
import { describe, it, expect } from 'vitest'
import { filterSortRepos } from '../../lib/repoFilter.js'

const repos = [
  { name: 'alpha', description: 'first', language: 'Python', stargazers_count: 5, updated_at: '2025-01-01T00:00:00Z' },
  { name: 'beta', description: 'second JS app', language: 'JavaScript', stargazers_count: 2, updated_at: '2025-06-01T00:00:00Z' },
  { name: 'gamma', description: null, language: 'Python', stargazers_count: 9, updated_at: '2024-01-01T00:00:00Z' },
]

describe('filterSortRepos', () => {
  it('filters by search across name and description (case-insensitive)', () => {
    expect(filterSortRepos(repos, { search: 'js', language: 'all', sort: 'recent' }).map(r => r.name)).toEqual(['beta'])
    expect(filterSortRepos(repos, { search: 'ALPHA', language: 'all', sort: 'recent' }).map(r => r.name)).toEqual(['alpha'])
  })

  it('filters by language', () => {
    expect(filterSortRepos(repos, { search: '', language: 'Python', sort: 'name' }).map(r => r.name)).toEqual(['alpha', 'gamma'])
  })

  it('sorts by stars desc', () => {
    expect(filterSortRepos(repos, { search: '', language: 'all', sort: 'stars' }).map(r => r.name)).toEqual(['gamma', 'alpha', 'beta'])
  })

  it('sorts by recent (updated_at desc)', () => {
    expect(filterSortRepos(repos, { search: '', language: 'all', sort: 'recent' }).map(r => r.name)).toEqual(['beta', 'alpha', 'gamma'])
  })

  it('sorts by name asc', () => {
    expect(filterSortRepos(repos, { search: '', language: 'all', sort: 'name' }).map(r => r.name)).toEqual(['alpha', 'beta', 'gamma'])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- RepoGrid`
Expected: FAIL — `filterSortRepos is not a function`.

- [ ] **Step 3: Implement `src/lib/repoFilter.js`**

```js
export function filterSortRepos(repos, { search, language, sort }) {
  const q = (search || '').trim().toLowerCase()
  let out = (repos || []).filter((r) => {
    const matchesQ =
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    const matchesLang = language === 'all' || r.language === language
    return matchesQ && matchesLang
  })

  out = [...out]
  if (sort === 'stars') out.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
  else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name))
  else out.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // recent
  return out
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- RepoGrid`
Expected: PASS (5 tests).

- [ ] **Step 5: Create `src/components/RepoCard.jsx`**

```jsx
const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', Dart: '#00B4AB', Blade: '#f7523f',
  'Jupyter Notebook': '#DA5B0B', CSS: '#563d7c', Java: '#b07219',
}

export default function RepoCard({ repo }) {
  const updated = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short',
  })
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="glass group flex h-full flex-col rounded-xl p-5 transition-all hover:-translate-y-1 hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-slate-100 group-hover:text-primary">
          <i className="fas fa-folder mr-2 text-primary/70" />
          {repo.name}
        </h4>
        <i className="fas fa-arrow-up-right-from-square text-xs text-slate-500" />
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-400">
        {repo.description || 'No description provided.'}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[repo.language] || '#64748b' }} />
            {repo.language}
          </span>
        )}
        <span><i className="fas fa-star mr-1 text-yellow-400" />{repo.stargazers_count}</span>
        {repo.forks_count > 0 && <span><i className="fas fa-code-branch mr-1" />{repo.forks_count}</span>}
        <span className="ml-auto">{updated}</span>
      </div>
    </a>
  )
}
```

- [ ] **Step 6: Create `src/components/RepoGrid.jsx`**

```jsx
import { useMemo, useState } from 'react'
import Section from './ui/Section.jsx'
import RepoCard from './RepoCard.jsx'
import { filterSortRepos } from '../lib/repoFilter.js'

export default function RepoGrid({ repos, loading, error }) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState('recent')

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean))
    return ['all', ...[...set].sort()]
  }, [repos])

  const shown = useMemo(
    () => filterSortRepos(repos, { search, language, sort }),
    [repos, search, language, sort],
  )

  return (
    <Section id="repos" title="All Repositories" subtitle={`${repos.length} public repositories, live from GitHub`}>
      {error && (
        <p className="glass rounded-xl p-6 text-center text-slate-300">
          Live GitHub data is unavailable right now.{' '}
          <a className="text-primary underline" href="https://github.com/somarjez?tab=repositories" target="_blank" rel="noreferrer">
            View repositories on GitHub →
          </a>
        </p>
      )}

      {!error && (
        <>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repositories…"
                className="glass w-full rounded-full py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary/60"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="glass rounded-full px-4 py-2.5 text-sm outline-none"
            >
              <option value="recent">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`rounded-full px-3 py-1 text-xs transition-colors ${
                  language === l ? 'bg-primary text-darker' : 'glass text-slate-300 hover:text-primary'
                }`}
              >
                {l === 'all' ? 'All' : l}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass h-40 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <p className="text-center text-slate-400">No repositories match your filters.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((r) => (
                <RepoCard key={r.id} repo={r} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
```

- [ ] **Step 7: Run tests + build**

Run: `npm test -- RepoGrid`
Expected: PASS.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 8: Commit**

```bash
git add src/lib/repoFilter.js src/components/RepoCard.jsx src/components/RepoGrid.jsx src/components/__tests__/RepoGrid.test.jsx
git commit -m "feat: add interactive repo grid with search/filter/sort and tests"
```

---

### Task 13: Orgs (conditional)

**Files:**
- Create: `src/components/Orgs.jsx`

- [ ] **Step 1: Create `src/components/Orgs.jsx`**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'

export default function Orgs({ orgs }) {
  if (!orgs || orgs.length === 0) return null
  return (
    <Section id="orgs" title="Organizations" subtitle="Communities and teams I'm part of">
      <div className="flex flex-wrap justify-center gap-6">
        {orgs.map((o, i) => (
          <Reveal key={o.id} delay={i * 0.05}>
            <a
              href={`https://github.com/${o.login}`}
              target="_blank"
              rel="noreferrer"
              className="glass flex flex-col items-center gap-3 rounded-2xl p-6 transition-transform hover:-translate-y-1"
            >
              <img src={o.avatar_url} alt={o.login} className="h-16 w-16 rounded-xl" />
              <span className="text-sm font-medium">{o.login}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/components/Orgs.jsx
git commit -m "feat: add conditional organizations section"
```

---

### Task 14: Contact (Formspree + mailto fallback) + Footer

**Files:**
- Create: `src/components/Contact.jsx`, `src/components/Footer.jsx`

- [ ] **Step 1: Create `src/components/Contact.jsx`**

```jsx
import { useState } from 'react'
import Section from './ui/Section.jsx'
import { site } from '../config/site.js'

const CONTACTS = [
  { icon: 'fa-envelope', label: 'Email', value: site.links.email, href: `mailto:${site.links.email}` },
  { icon: 'fa-github', brand: true, label: 'GitHub', value: 'github.com/somarjez', href: site.links.github },
  { icon: 'fa-linkedin', brand: true, label: 'LinkedIn', value: 'Connect professionally', href: site.links.linkedin },
  { icon: 'fa-map-marker-alt', label: 'Location', value: site.location, href: null },
]

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const data = Object.fromEntries(new FormData(form))

    if (!site.formspreeId) {
      window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent(
        data.subject || 'Portfolio contact',
      )}&body=${encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (!res.ok) throw new Error('send failed')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent(
        data.subject || 'Portfolio contact',
      )}&body=${encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)}`
    }
  }

  return (
    <Section id="contact" title="Let's Connect" subtitle="Open to opportunities and collaborations">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-slate-300">
            Whether you have a project idea, need a development partner, or just want to talk tech — I'd love to hear from you.
          </p>
          {CONTACTS.map((c) => {
            const inner = (
              <div className="glass flex items-center gap-4 rounded-xl p-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-darker">
                  <i className={`${c.brand ? 'fab' : 'fas'} ${c.icon}`} />
                </span>
                <div>
                  <div className="text-sm font-semibold">{c.label}</div>
                  <div className="text-sm text-slate-400">{c.value}</div>
                </div>
              </div>
            )
            return c.href ? (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="block">{inner}</a>
            ) : (
              <div key={c.label}>{inner}</div>
            )
          })}
        </div>

        <form onSubmit={onSubmit} className="glass space-y-4 rounded-2xl p-6">
          <input name="name" required placeholder="Full Name"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <input name="email" type="email" required placeholder="Email Address"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <input name="subject" required placeholder="Subject"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <textarea name="message" required rows={5} placeholder="Your message…"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <button type="submit" disabled={status === 'sending'}
            className="w-full rounded-full bg-gradient-to-r from-primary to-accent py-3 font-semibold text-darker transition-transform hover:scale-[1.02] disabled:opacity-60">
            <i className="fas fa-paper-plane mr-2" />
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent! ✓' : 'Send Message'}
          </button>
          {status === 'sent' && <p className="text-center text-sm text-green-400">Thanks — I'll get back to you soon!</p>}
        </form>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Create `src/components/Footer.jsx`**

```jsx
import { site } from '../config/site.js'

const SOCIAL = [
  { icon: 'fab fa-github', href: site.links.github },
  { icon: 'fab fa-linkedin', href: site.links.linkedin },
  { icon: 'fas fa-envelope', href: `mailto:${site.links.email}` },
  { icon: 'fab fa-facebook-f', href: site.links.facebook },
  { icon: 'fas fa-globe', href: site.links.website },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 text-center">
      <div className="mb-5 flex justify-center gap-4">
        {SOCIAL.map((s) => (
          <a key={s.icon} href={s.href} target="_blank" rel="noreferrer"
            className="glass grid h-11 w-11 place-items-center rounded-full text-slate-300 transition-colors hover:text-primary">
            <i className={s.icon} />
          </a>
        ))}
      </div>
      <p className="text-slate-400">© {new Date().getFullYear()} {site.name}. Crafted with 💙 and lots of ☕</p>
      <p className="mt-2 text-sm text-slate-500">{site.role} · Open to Opportunities</p>
    </footer>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/Contact.jsx src/components/Footer.jsx
git commit -m "feat: add contact form (Formspree + mailto fallback) and footer"
```

---

### Task 15: Assemble App

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Replace `src/App.jsx`**

```jsx
import { useGitHub } from './hooks/useGitHub.js'
import { useTheme } from './hooks/useTheme.js'
import { site } from './config/site.js'
import Background from './components/Background.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Skills from './components/Skills.jsx'
import GitHubStats from './components/GitHubStats.jsx'
import Featured from './components/Featured.jsx'
import RepoGrid from './components/RepoGrid.jsx'
import Orgs from './components/Orgs.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const { repos, orgs, stats, loading, error } = useGitHub(site.username)
  const { theme, toggle } = useTheme()

  return (
    <>
      <Background />
      <Nav theme={theme} onToggleTheme={toggle} />
      <main>
        <Hero stats={stats} loading={loading} />
        <About />
        <Skills />
        <GitHubStats stats={stats} loading={loading} />
        <Featured repos={repos} />
        <RepoGrid repos={repos} loading={loading} error={error} />
        <Orgs orgs={orgs} />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Run full test suite + build**

Run: `npm test`
Expected: PASS (all suites).
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Manual smoke test**

Run: `npm run dev`
Open the dev URL. Verify: hero shows live repo/star counts, stats counters animate, featured cards render, repo grid loads all repos with working search/filter/sort, contact form falls back to mailto, theme toggle persists across reload. Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: assemble full portfolio app"
```

---

### Task 16: Migrate assets, remove old site, add deploy workflow

**Files:**
- Create: `public/me.jpg` (move from `images/me.jpg`)
- Delete: `images/me.jpg`, old root `index.html` (replaced by Vite entry — already overwritten in Task 1)
- Create: `.github/workflows/deploy.yml`, `.gitignore`, `README.md`

- [ ] **Step 1: Move profile image**

```bash
mkdir -p public
git mv images/me.jpg public/me.jpg
rmdir images 2>/dev/null || true
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules
dist
.DS_Store
*.local
```

- [ ] **Step 3: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Create `README.md`**

```markdown
# somarjez.github.io

Personal portfolio of Jezreel Ramos. Built with React, Vite, TailwindCSS, and
Framer Motion. Lists GitHub repositories and organizations live from the
GitHub REST API.

## Develop

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
deploys to GitHub Pages.

**One-time setup:** GitHub repo → Settings → Pages → Build and deployment →
Source = **GitHub Actions**.

## Customize

- Personal content, links, skills, Formspree id: `src/config/site.js`
- Featured projects: `src/config/featured.js`
```

- [ ] **Step 5: Verify clean build from scratch**

Run: `rm -rf dist && npm run build`
Expected: build succeeds; `dist/` contains `index.html` and `assets/`, and `me.jpg` is copied into `dist/`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore: migrate assets to public/, add Pages workflow and README"
```

---

### Task 17: Final verification

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: all suites PASS.

- [ ] **Step 2: Production preview smoke test**

Run: `npm run build && npm run preview`
Open the preview URL. Confirm every section renders, GitHub data loads, and all interactive controls work. Stop the server.

- [ ] **Step 3: Confirm no stray references to the old single-file site**

Run: `git status` and `ls`
Expected: no `images/` dir, no legacy root `index.html` content (only the Vite entry), `public/me.jpg` present.

- [ ] **Step 4: Final commit (if anything outstanding)**

```bash
git add -A
git commit -m "chore: final portfolio verification" || echo "nothing to commit"
```

---

## Notes for the implementer

- **Rate limits:** Unauthenticated GitHub API = 60 requests/hour/IP. The hook
  makes 3 requests then caches for 1 hour in localStorage, so repeated visits
  cost nothing. During heavy dev/testing you may hit the limit — the error state
  renders gracefully and the cache will serve once populated.
- **`repo` keys in `featured.js`** are matched against live repo names
  lowercased. If a repo is renamed/missing, the card still renders from static
  metadata (just without live star count).
- **Formspree:** set `formspreeId` in `src/config/site.js` to enable real form
  submissions; until then the form opens the user's mail client.
- **Tailwind dark mode** is class-based on `<html>`; `index.html` ships with
  `class="dark"` so first paint is dark.
