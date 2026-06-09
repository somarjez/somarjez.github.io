# Portfolio Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the portfolio into a professional-yet-creative site: "Refined Midnight" theme, sharper copy (no student/year framing), project-grounded skills, and Demo/Code buttons on Featured and Repo cards.

**Architecture:** Pure config + component edits in the existing React + Vite + Tailwind SPA. Curated content stays in `src/config/*`; the live GitHub data flow (`useGitHub`/`fetchGitHub`/`deriveStats`) is untouched. A new shared `Button` UI component standardizes Demo/Code links. Visual changes live in `tailwind.config.js`, `src/index.css`, and `index.html`.

**Tech Stack:** React 18, Vite 5, TailwindCSS 3, Framer Motion, Vitest + @testing-library/react + jsdom.

---

## File Structure

| File | Responsibility | Action |
|---|---|---|
| `tailwind.config.js` | Color tokens + display font | Modify |
| `src/index.css` | Base bg, glass, heading font, gradient-text vars | Modify |
| `index.html` | Fonts link, title, meta description | Modify |
| `vitest.setup.js` | jest-dom + IntersectionObserver stub | Modify |
| `src/config/site.js` | role, bio, education, focus, skills | Modify |
| `src/config/__tests__/site.test.js` | Assert content shape | Create |
| `src/components/ui/Button.jsx` | Shared Demo/Code button | Create |
| `src/components/ui/__tests__/Button.test.jsx` | Button render test | Create |
| `src/components/About.jsx` | Reframed heading, focus card, quiet education | Modify |
| `src/components/__tests__/About.test.jsx` | About render test | Create |
| `src/components/Featured.jsx` | Demo/Code buttons; export `Card` | Modify |
| `src/components/__tests__/Featured.test.jsx` | Card button logic test | Create |
| `src/components/RepoCard.jsx` | Demo (homepage) + Code buttons | Modify |
| `src/components/__tests__/RepoCard.test.jsx` | RepoCard button test | Create |
| `src/components/Hero.jsx` | role + roleSub + hero copy | Modify |

`Skills.jsx` and `GitHubStats.jsx` need **no** code change — they consume `site.skills` and live data, and inherit the new `primary`/`accent` colors automatically.

---

### Task 1: Theme foundation (Refined Midnight)

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `index.html`
- Modify: `vitest.setup.js`

- [ ] **Step 1: Update Tailwind colors and fonts**

Replace the `theme.extend.colors` and `theme.extend.fontFamily` blocks in `tailwind.config.js` so the file reads:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B12',
        panel: '#14141F',
        'panel-2': '#1B1B28',
        line: '#262635',
        primary: '#6D5EF8',
        'primary-dark': '#5B4FE0',
        accent: '#A78BFA',
        secondary: '#ff6b6b',
        // legacy aliases so existing classNames keep working
        dark: '#0B0B12',
        darker: '#070b1f',
        darkest: '#04081a',
      },
      fontFamily: {
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
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

- [ ] **Step 2: Update base styles in `src/index.css`**

Replace the whole file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #6D5EF8;
  --accent: #A78BFA;
}

html { scroll-behavior: smooth; }

body {
  @apply bg-ink text-slate-100 font-sans antialiased;
  line-height: 1.6;
}
html:not(.dark) body { @apply bg-slate-50 text-slate-900; }

h1, h2, h3 { font-family: 'Space Grotesk', 'Inter', sans-serif; letter-spacing: -0.01em; }

.glass {
  @apply backdrop-blur-xl border;
  background: rgba(255,255,255,0.04);
  border-color: rgba(255,255,255,0.08);
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

@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-grid-move {
    animation: none !important;
  }
}
```

- [ ] **Step 3: Update fonts link, title, and meta in `index.html`**

Replace the `<title>`, the description `<meta>`, and the Google Fonts `<link>` so the `<head>` contains:

```html
    <title>Jezreel Ramos — Full-Stack & AI Developer</title>
    <meta name="description" content="Full-stack developer building web, mobile, and AI-driven applications across React, Flutter, Flask/Django, and machine learning." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
```

- [ ] **Step 4: Add an IntersectionObserver stub to `vitest.setup.js`**

Replace the file with (keeps jest-dom, adds the stub so components using framer-motion `whileInView` render in jsdom):

```js
import '@testing-library/jest-dom'

if (typeof globalThis.IntersectionObserver === 'undefined') {
  globalThis.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return [] }
  }
}
```

- [ ] **Step 5: Verify build and existing tests still pass**

Run: `npm run build`
Expected: build succeeds, no Tailwind "class does not exist" errors.

Run: `npx vitest run`
Expected: existing 12 tests still PASS.

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.js src/index.css index.html vitest.setup.js
git commit -m "style: apply Refined Midnight theme tokens, fonts, and test stub"
```

---

### Task 2: Professional content config

**Files:**
- Modify: `src/config/site.js`
- Test: `src/config/__tests__/site.test.js`

- [ ] **Step 1: Write the failing test**

Create `src/config/__tests__/site.test.js`:

```js
import { describe, it, expect } from 'vitest'
import { site } from '../site.js'

describe('site config', () => {
  it('has no student/year framing in role, subtitle, bio, or education', () => {
    const text = `${site.role} ${site.roleSub} ${site.bio} ${JSON.stringify(site.education)}`
    expect(text).not.toMatch(/\b(3rd|student|year)\b/i)
  })

  it('exposes five project-grounded skill categories in order', () => {
    expect(site.skills).toHaveLength(5)
    expect(site.skills.map((s) => s.title)).toEqual([
      'Languages',
      'Frontend & Mobile',
      'Backend & Data',
      'AI / Machine Learning',
      'Tools',
    ])
  })

  it('defines three focus pillars', () => {
    expect(site.focus.map((f) => f.label)).toEqual([
      'Full-Stack Web',
      'Mobile Apps',
      'AI / Machine Learning',
    ])
  })

  it('keeps a degree line with no year field', () => {
    expect(site.education.degree).toMatch(/BS Computer Science/)
    expect(site.education.year).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/config/__tests__/site.test.js`
Expected: FAIL (current `site.role` contains "3rd-Year", `site.skills` has 4 categories, `site.focus` undefined).

- [ ] **Step 3: Rewrite `src/config/site.js`**

Replace the whole file with:

```js
export const site = {
  username: 'somarjez',
  name: 'Jezreel Ramos',
  role: 'Full-Stack & AI Developer',
  roleSub: 'Web · Mobile · Machine Learning',
  location: 'Philippines 🇵🇭',
  hero:
    'I build full-stack web, mobile, and AI-driven applications — from Flutter commerce apps to Flask/Django platforms and machine-learning systems for real-world problems.',
  bio: "I'm a developer who builds across the stack — web, mobile, and AI. My work spans Flutter mobile commerce, Flask and Django web platforms, and machine-learning research, including a hybrid ML + Knowledge-Representation system for affordable housing in the Philippines. I care about clean architecture, thoughtful UX, and shipping work that solves real problems. I'm comfortable across C#/.NET, Java/Spring, Python, TypeScript, React/Next.js, and Dart.",
  education: {
    degree: 'BS Computer Science — Information Systems',
    detail: 'Focus on software engineering, database systems, and machine learning.',
  },
  focus: [
    { icon: 'fa-layer-group', label: 'Full-Stack Web' },
    { icon: 'fa-mobile-screen', label: 'Mobile Apps' },
    { icon: 'fa-brain', label: 'AI / Machine Learning' },
  ],
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
      title: 'Languages',
      tags: ['Python', 'Dart', 'TypeScript', 'JavaScript', 'C# (.NET)', 'Java'],
    },
    {
      icon: 'fa-palette',
      title: 'Frontend & Mobile',
      tags: ['React / Next.js', 'Flutter', 'Tailwind CSS', 'HTML5 / CSS3'],
    },
    {
      icon: 'fa-server',
      title: 'Backend & Data',
      tags: ['Flask', 'Django', 'Firebase / Firestore', 'SQLite', 'MySQL / PostgreSQL', 'REST APIs'],
    },
    {
      icon: 'fa-brain',
      title: 'AI / Machine Learning',
      tags: ['Python ML', 'Jupyter', 'Knowledge Representation & Reasoning', 'Data Analysis'],
    },
    {
      icon: 'fa-tools',
      title: 'Tools',
      tags: ['Git / GitHub', 'VS Code', 'Figma'],
    },
  ],
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/config/__tests__/site.test.js`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/config/site.js src/config/__tests__/site.test.js
git commit -m "content: professional copy, focus pillars, project-grounded skills"
```

---

### Task 3: Shared Button component

**Files:**
- Create: `src/components/ui/Button.jsx`
- Test: `src/components/ui/__tests__/Button.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/__tests__/Button.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from '../Button.jsx'

describe('Button', () => {
  it('renders an external link with label and solid variant classes', () => {
    render(<Button href="https://example.com" variant="solid">Live Demo</Button>)
    const link = screen.getByRole('link', { name: /live demo/i })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(link.className).toMatch(/from-primary/)
  })

  it('applies outline variant classes', () => {
    render(<Button href="https://example.com" variant="outline">Code</Button>)
    expect(screen.getByRole('link', { name: /code/i }).className).toMatch(/border-line/)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/__tests__/Button.test.jsx`
Expected: FAIL ("Failed to resolve import '../Button.jsx'").

- [ ] **Step 3: Create `src/components/ui/Button.jsx`**

```jsx
const VARIANTS = {
  solid: 'bg-gradient-to-r from-primary to-accent text-ink hover:scale-[1.03]',
  outline: 'border border-line bg-panel/40 text-slate-200 hover:border-primary/60 hover:text-white',
}

export default function Button({ href, variant = 'solid', icon, trailingIcon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-transform ${VARIANTS[variant]}`}
    >
      {icon && <i className={icon} aria-hidden="true" />}
      <span>{children}</span>
      {trailingIcon && <i className={trailingIcon} aria-hidden="true" />}
    </a>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/ui/__tests__/Button.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/Button.jsx src/components/ui/__tests__/Button.test.jsx
git commit -m "feat: shared Button component for demo/code links"
```

---

### Task 4: About — reframed heading, focus card, quiet education

**Files:**
- Modify: `src/components/About.jsx`
- Test: `src/components/__tests__/About.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/About.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import About from '../About.jsx'

describe('About', () => {
  it('renders the three focus pillars', () => {
    render(<About />)
    expect(screen.getByText('Full-Stack Web')).toBeInTheDocument()
    expect(screen.getByText('Mobile Apps')).toBeInTheDocument()
    expect(screen.getByText('AI / Machine Learning')).toBeInTheDocument()
  })

  it('shows the degree line and no student/year framing', () => {
    render(<About />)
    expect(screen.getByText(/BS Computer Science/)).toBeInTheDocument()
    expect(screen.queryByText(/3rd year/i)).toBeNull()
    expect(screen.queryByText(/student/i)).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/About.test.jsx`
Expected: FAIL (no "Full-Stack Web" text; current About says "Computer Science Student").

- [ ] **Step 3: Rewrite `src/components/About.jsx`**

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
          <h3 className="font-display text-2xl font-bold">
            Full-Stack & <span className="gradient-text">AI Developer</span>
          </h3>
          <p className="mt-4 text-slate-300">{site.bio}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {site.focus.map((f) => (
              <div key={f.label} className="glass rounded-xl p-4 text-center">
                <i className={`fas ${f.icon} text-lg text-accent`} aria-hidden="true" />
                <p className="mt-2 text-sm font-medium text-slate-200">{f.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            <i className="fas fa-graduation-cap mr-2 text-primary/70" aria-hidden="true" />
            {site.education.degree}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/About.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/About.jsx src/components/__tests__/About.test.jsx
git commit -m "feat: reframe About with focus pillars and quiet education line"
```

---

### Task 5: Featured — Demo/Code buttons

**Files:**
- Modify: `src/components/Featured.jsx`
- Test: `src/components/__tests__/Featured.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/Featured.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../Featured.jsx'

const base = { title: 'Demo Project', icon: 'fa-flask', description: 'desc', tech: ['Python'] }

describe('Featured Card buttons', () => {
  it('shows Live Demo only when demo link exists', () => {
    render(<Card p={{ ...base, demo: 'https://youtu.be/x', source: null }} live={null} />)
    expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', 'https://youtu.be/x')
    expect(screen.queryByRole('link', { name: /^code$/i })).toBeNull()
  })

  it('shows Code only when source link exists', () => {
    render(<Card p={{ ...base, demo: null, source: 'https://github.com/x' }} live={null} />)
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveAttribute('href', 'https://github.com/x')
    expect(screen.queryByRole('link', { name: /live demo/i })).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/Featured.test.jsx`
Expected: FAIL ("Card" is not an exported member; current file only default-exports Featured).

- [ ] **Step 3: Rewrite `src/components/Featured.jsx`**

```jsx
import { motion } from 'framer-motion'
import Section from './ui/Section.jsx'
import Button from './ui/Button.jsx'
import { featured } from '../config/featured.js'

export function Card({ p, live }) {
  const stars = live?.stargazers_count ?? 0
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="glass flex h-full flex-col rounded-2xl p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl text-ink">
          <i className={`fas ${p.icon}`} aria-hidden="true" />
        </span>
        {stars > 0 && (
          <span className="font-mono text-xs text-slate-400">
            <i className="fas fa-star text-yellow-400" aria-hidden="true" /> {stars}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-bold">{p.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-400">{p.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span key={t} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-accent">{t}</span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {p.demo && (
          <Button href={p.demo} variant="solid" icon="fas fa-play" trailingIcon="fas fa-arrow-up-right-from-square">
            Live Demo
          </Button>
        )}
        {p.source && (
          <Button href={p.source} variant="outline" icon="fab fa-github">
            Code
          </Button>
        )}
      </div>
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

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/Featured.test.jsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/Featured.jsx src/components/__tests__/Featured.test.jsx
git commit -m "feat: labeled Demo/Code buttons on featured project cards"
```

---

### Task 6: RepoCard — Demo (homepage) + Code buttons

**Files:**
- Modify: `src/components/RepoCard.jsx`
- Test: `src/components/__tests__/RepoCard.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/RepoCard.test.jsx`:

```jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RepoCard from '../RepoCard.jsx'

const base = {
  name: 'repo',
  description: 'a repo',
  language: 'Python',
  stargazers_count: 3,
  forks_count: 0,
  updated_at: '2025-01-01T00:00:00Z',
  html_url: 'https://github.com/somarjez/repo',
}

describe('RepoCard buttons', () => {
  it('shows a Demo button linking to homepage when set', () => {
    render(<RepoCard repo={{ ...base, homepage: 'https://demo.app' }} />)
    expect(screen.getByRole('link', { name: /^demo$/i })).toHaveAttribute('href', 'https://demo.app')
  })

  it('omits the Demo button when homepage is empty', () => {
    render(<RepoCard repo={{ ...base, homepage: '' }} />)
    expect(screen.queryByRole('link', { name: /^demo$/i })).toBeNull()
  })

  it('always renders a Code link to the repo', () => {
    render(<RepoCard repo={{ ...base, homepage: null }} />)
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveAttribute('href', base.html_url)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/RepoCard.test.jsx`
Expected: FAIL (current RepoCard has no Demo/Code buttons; whole card is one link).

- [ ] **Step 3: Rewrite `src/components/RepoCard.jsx`**

```jsx
import { langColor } from '../lib/langColors.js'
import Button from './ui/Button.jsx'

export default function RepoCard({ repo }) {
  const updated = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short',
  })
  const demo = repo.homepage && repo.homepage.trim() ? repo.homepage : null
  return (
    <div className="glass group flex h-full flex-col rounded-xl p-5 transition-all hover:-translate-y-1 hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-slate-100">
          <i className="fas fa-folder mr-2 text-primary/70" aria-hidden="true" />
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="hover:text-primary">
            {repo.name}
          </a>
        </h4>
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-400">
        {repo.description || 'No description provided.'}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span><i className="fas fa-star mr-1 text-yellow-400" aria-hidden="true" />{repo.stargazers_count}</span>
        {repo.forks_count > 0 && <span><i className="fas fa-code-branch mr-1" aria-hidden="true" />{repo.forks_count}</span>}
        <span className="ml-auto">{updated}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {demo && (
          <Button href={demo} variant="solid" icon="fas fa-arrow-up-right-from-square">Demo</Button>
        )}
        <Button href={repo.html_url} variant="outline" icon="fab fa-github">Code</Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/__tests__/RepoCard.test.jsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/RepoCard.jsx src/components/__tests__/RepoCard.test.jsx
git commit -m "feat: Demo (homepage) + Code buttons on repo cards"
```

---

### Task 7: Hero — role, subtitle, refined copy

**Files:**
- Modify: `src/components/Hero.jsx`

(No new unit test — Hero is presentational over `site`; covered by `site.test.js` content + build. Verify visually in Task 8.)

- [ ] **Step 1: Rewrite `src/components/Hero.jsx`**

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
          className="font-display text-5xl font-extrabold md:text-7xl"
        >
          <span className="gradient-text">{site.name}</span>
        </motion.h1>

        <p className="mt-4 font-display text-xl text-slate-200 md:text-2xl">{site.role}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-accent/80">{site.roleSub}</p>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">{site.hero}</p>

        {!loading && (
          <div className="mt-6 font-mono text-sm text-primary">
            {stats.totalRepos} repositories · {stats.totalStars} stars · {stats.languages.length} languages
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#projects" className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-ink transition-transform hover:scale-105">
            <i className="fas fa-rocket mr-2" aria-hidden="true" /> Explore My Work
          </a>
          <a href="#contact" className="glass rounded-full px-6 py-3 font-semibold transition-transform hover:scale-105">
            <i className="fas fa-paper-plane mr-2" aria-hidden="true" /> Let's Collaborate
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: hero role subtitle and refined description"
```

---

### Task 8: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: ALL tests PASS — original 12 plus new (site 4, Button 2, About 2, Featured 2, RepoCard 3) = 25 total.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: build succeeds, no errors or unknown-class warnings.

- [ ] **Step 3: Manual visual check**

Run: `npm run dev` and open the local URL. Confirm:
- Hero shows name in indigo→violet gradient, role "Full-Stack & AI Developer", mono subtitle, new description.
- About shows three focus pillars and a single quiet "BS Computer Science — Information Systems" line; no "3rd Year" / "Student".
- Skills show the five new categories.
- Featured cards show "Live Demo" and/or "Code" buttons only where links exist (Findify → Live Demo; AI/Quizera/Flask/Resume/Banking → Code).
- Repo cards show a "Code" button always, and a "Demo" button for any repo whose GitHub "Website" (homepage) is set.
- Background/panels use the darker "ink" base with the violet accent; Space Grotesk headings, Inter body.

- [ ] **Step 4: Commit any final tweaks (if needed)**

```bash
git add -A
git commit -m "chore: portfolio refinement final verification"
```

---

## Notes for the implementer

- **Do not** modify `src/hooks/useGitHub.js`, `src/lib/github.js`, or `src/lib/repoFilter.js` — the live data flow is intentionally unchanged.
- `Skills.jsx` and `GitHubStats.jsx` need no edits; they inherit the new colors and consume updated `site.skills`.
- The accent gradient is `from-primary to-accent` (indigo `#6D5EF8` → violet `#A78BFA`) everywhere, for consistency.
- To swap the signature color later, change only `primary`/`accent` in `tailwind.config.js` and the two `:root` vars in `src/index.css`.
