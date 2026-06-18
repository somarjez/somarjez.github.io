# Terminal-Accented Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio from a generic glass template into a distinctive, terminal-accented, Tokyo Night dark-only experience with three signature interactions (terminal boot hero, ⌘K command palette, cursor spotlight + 3D tilt).

**Architecture:** Keep the React + Vite + Tailwind single-page app and its section order. Remap the existing Tailwind color tokens to Tokyo Night (so existing classNames and tests keep working), force dark mode and delete the theme toggle, then restyle each section and add small single-purpose components/hooks for the signature interactions. No new dependencies — reuse `framer-motion`.

**Tech Stack:** React 18, Vite 5, Tailwind 3, framer-motion 11, Vitest + Testing Library, Font Awesome (CDN), JetBrains Mono / Space Grotesk / Inter (Google Fonts).

## Global Constraints

- **No new runtime dependencies.** Reuse `framer-motion` and built-in browser APIs.
- **Dark-only.** Remove `useTheme`, the Nav toggle, all `html:not(.dark)` CSS, and any "toggle theme" action. `<html>` stays `class="dark"`.
- **Palette (Tokyo Night), exact hex:** bg `#0a0e14`, surface `#0d1117`, surface2 `#11161f`, line `#1f2430`, line-bright `#2a3040`, text `#c0caf5`, muted `#565f89`, cyan/primary `#7dcfff`, violet/accent `#bb9af7`, amber `#e0af68`, green `#9ece6a`, red/secondary `#f7768e`.
- **Keep Tailwind color names** `ink`, `panel`, `line`, `primary`, `accent`, `secondary` (remap hex only) so existing classNames/tests survive; add `amber`, `green`, `panel-2`, `line-bright`.
- **Accessibility:** every animation respects `prefers-reduced-motion: reduce`; pointer effects disabled on touch / no-hover; command palette is keyboard + ARIA correct; WCAG AA contrast.
- **Fonts/roles:** JetBrains Mono = terminal chrome/labels/`$`; Space Grotesk = display headings; Inter = body.
- **Verification per task:** `npm test` stays green and `npm run build` succeeds before committing.
- **Section order unchanged:** Hero → About → Skills → GitHubStats → Featured → RepoGrid → Orgs → Contact → Footer.

---

### Task 1: Tokyo Night token foundation + dark-only

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Nav.jsx`
- Delete: `src/hooks/useTheme.js`

**Interfaces:**
- Produces: Tailwind tokens (`ink`, `panel`, `panel-2`, `line`, `line-bright`, `primary`, `primary-dark`, `accent`, `secondary`, `amber`, `green`, legacy `dark/darker/darkest`); CSS helpers `.glass`, `.gradient-text`, `.term-window`, `.term-cursor`, `.scanlines`. App renders `<Nav />` with no theme props.

- [ ] **Step 1: Run the suite to capture the green baseline**

Run: `npm test`
Expected: PASS (all existing tests green). Note the count.

- [ ] **Step 2: Remap colors in `tailwind.config.js`**

Replace the `colors` object with:

```js
colors: {
  ink: '#0a0e14',
  panel: '#0d1117',
  'panel-2': '#11161f',
  line: '#1f2430',
  'line-bright': '#2a3040',
  primary: '#7dcfff',
  'primary-dark': '#5aa8d8',
  accent: '#bb9af7',
  secondary: '#f7768e',
  amber: '#e0af68',
  green: '#9ece6a',
  // legacy aliases → Tokyo Night near-bg shades
  dark: '#0a0e14',
  darker: '#070a0f',
  darkest: '#05070b',
},
```

Add a `blink` keyframe + animation alongside the existing ones:

```js
keyframes: {
  // ...existing float, grid-move...
  blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
},
animation: {
  // ...existing...
  blink: 'blink 1s step-end infinite',
},
```

- [ ] **Step 3: Rewrite `src/index.css` for dark-only + terminal helpers**

Replace the whole file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #7dcfff;
  --accent: #bb9af7;
  --spotlight-x: 50%;
  --spotlight-y: 0%;
}

html { scroll-behavior: smooth; }

body {
  @apply bg-ink text-slate-100 font-sans antialiased;
  line-height: 1.6;
}

h1, h2, h3 { font-family: 'Space Grotesk', 'Inter', sans-serif; letter-spacing: -0.01em; }

.glass {
  @apply backdrop-blur-xl border;
  background: rgba(125, 207, 255, 0.03);
  border-color: rgba(125, 207, 255, 0.10);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Terminal window chrome */
.term-window {
  @apply rounded-xl border border-line bg-panel/80 backdrop-blur-xl;
  box-shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
}

/* Blinking caret */
.term-cursor {
  display: inline-block;
  width: 0.6ch;
  background: var(--primary);
  @apply animate-blink;
}

/* Faint CRT scanlines layer */
.scanlines {
  background-image: repeating-linear-gradient(
    0deg, rgba(125, 207, 255, 0.025) 0px, rgba(125, 207, 255, 0.025) 1px, transparent 1px, transparent 3px
  );
}

@media (prefers-reduced-motion: reduce) {
  .animate-float, .animate-grid-move, .animate-blink {
    animation: none !important;
  }
  .term-cursor { opacity: 1; }
}
```

- [ ] **Step 4: Force dark in `src/main.jsx`**

Replace the `document.documentElement.classList.toggle(...)` line with:

```js
document.documentElement.classList.add('dark')
```

- [ ] **Step 5: Remove the theme hook from `src/App.jsx`**

Delete the `import { useTheme }` line and the `const { theme, toggle } = useTheme()` line. Change the Nav usage to `<Nav />` (no props).

- [ ] **Step 6: Drop the toggle from `src/components/Nav.jsx` (minimal change only)**

Change the signature `export default function Nav({ theme, onToggleTheme })` → `export default function Nav()`. Delete the desktop theme `<button onClick={onToggleTheme} ...>` (the `fa-sun`/`fa-moon` button) and the mobile "Toggle … mode" button. Leave the rest of Nav as-is for now (full restyle is Task 9).

- [ ] **Step 7: Delete `src/hooks/useTheme.js`**

```bash
git rm src/hooks/useTheme.js
```

- [ ] **Step 8: Verify tests still pass and build works**

Run: `npm test`
Expected: PASS, same count as Step 1 (the Button test checks `from-primary`/`border-line` which still exist).
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: Tokyo Night dark-only theme tokens, drop theme toggle"
```

---

### Task 2: Tokyo Night background

**Files:**
- Modify: `src/components/Background.jsx`

**Interfaces:**
- Produces: a fixed `-z-10` background using the Tokyo Night palette + scanlines; no API change.

- [ ] **Step 1: Replace `Background.jsx`**

```jsx
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#0a0e14] via-[#0a0e14] to-[#070a0f]">
      <div
        className="absolute inset-0 animate-float opacity-70"
        style={{
          background:
            'radial-gradient(circle at 18% 20%, rgba(125,207,255,0.10) 0%, transparent 45%),' +
            'radial-gradient(circle at 82% 12%, rgba(187,154,247,0.10) 0%, transparent 45%),' +
            'radial-gradient(circle at 50% 88%, rgba(158,206,106,0.06) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 animate-grid-move opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,207,255,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(125,207,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="scanlines absolute inset-0 opacity-60" />
    </div>
  )
}
```

- [ ] **Step 2: Verify build, then commit**

Run: `npm run build` → succeeds.

```bash
git add src/components/Background.jsx
git commit -m "feat: Tokyo Night gradient + grid + scanline background"
```

---

### Task 3: Cursor spotlight (hook + layer)

**Files:**
- Create: `src/hooks/usePointerSpotlight.js`
- Create: `src/hooks/__tests__/usePointerSpotlight.test.js`
- Create: `src/components/Spotlight.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces: `usePointerSpotlight()` — attaches an rAF-throttled `pointermove` listener that sets CSS vars `--spotlight-x`/`--spotlight-y` on `document.documentElement`; no-op when `matchMedia('(hover: none)')` or `(prefers-reduced-motion: reduce)` match. Returns nothing. `<Spotlight />` renders the fixed glow layer.

- [ ] **Step 1: Write the failing test**

```js
// src/hooks/__tests__/usePointerSpotlight.test.js
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePointerSpotlight } from '../usePointerSpotlight.js'

describe('usePointerSpotlight', () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty('--spotlight-x')
  })

  it('does nothing when reduced motion or no-hover is preferred', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const addSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => usePointerSpotlight())
    expect(addSpy).not.toHaveBeenCalledWith('pointermove', expect.any(Function))
  })

  it('attaches a pointermove listener when motion is allowed', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const addSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => usePointerSpotlight())
    expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function), expect.anything())
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/hooks/__tests__/usePointerSpotlight.test.js`
Expected: FAIL ("Failed to resolve import ../usePointerSpotlight.js").

- [ ] **Step 3: Implement the hook**

```js
// src/hooks/usePointerSpotlight.js
import { useEffect } from 'react'

export function usePointerSpotlight() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduce || noHover) return

    let raf = 0
    let nextX = 0
    let nextY = 0
    const root = document.documentElement
    const apply = () => {
      raf = 0
      root.style.setProperty('--spotlight-x', `${nextX}px`)
      root.style.setProperty('--spotlight-y', `${nextY}px`)
    }
    const onMove = (e) => {
      nextX = e.clientX
      nextY = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/hooks/__tests__/usePointerSpotlight.test.js`
Expected: PASS.

- [ ] **Step 5: Create the `Spotlight` layer**

```jsx
// src/components/Spotlight.jsx
export default function Spotlight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[5] hidden md:block"
      style={{
        background:
          'radial-gradient(360px circle at var(--spotlight-x) var(--spotlight-y), rgba(125,207,255,0.08), transparent 70%)',
      }}
    />
  )
}
```

- [ ] **Step 6: Wire into `App.jsx`**

Add `import Spotlight from './components/Spotlight.jsx'` and `import { usePointerSpotlight } from './hooks/usePointerSpotlight.js'`. Call `usePointerSpotlight()` in the component body, and render `<Spotlight />` right after `<Background />`.

- [ ] **Step 7: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add -A
git commit -m "feat: cursor-reactive spotlight layer (reduced-motion/touch safe)"
```

---

### Task 4: TiltCard wrapper

**Files:**
- Create: `src/components/ui/TiltCard.jsx`
- Create: `src/components/ui/__tests__/TiltCard.test.jsx`

**Interfaces:**
- Produces: `<TiltCard className children>` — wraps children in a div that tilts toward the pointer on hover via inline transform; no-op (renders a plain div, no transform listeners) when `(hover: none)` or `(prefers-reduced-motion: reduce)`. Always renders children and forwards `className`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/__tests__/TiltCard.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TiltCard from '../TiltCard.jsx'

describe('TiltCard', () => {
  it('renders children and forwards className', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    render(<TiltCard className="glass"><span>inside</span></TiltCard>)
    expect(screen.getByText('inside')).toBeInTheDocument()
    expect(screen.getByTestId('tilt-card').className).toMatch(/glass/)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/ui/__tests__/TiltCard.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `TiltCard`**

```jsx
// src/components/ui/TiltCard.jsx
import { useRef, useState } from 'react'

const MAX = 6 // degrees

export default function TiltCard({ className = '', children }) {
  const ref = useRef(null)
  const [t, setT] = useState('')
  const enabled = () =>
    typeof window !== 'undefined' &&
    !window.matchMedia('(hover: none)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e) => {
    if (!enabled() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setT(`perspective(800px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`)
  }
  const reset = () => setT('')

  return (
    <div
      ref={ref}
      data-testid="tilt-card"
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transform: t, transition: 'transform 120ms ease-out', transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/__tests__/TiltCard.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TiltCard.jsx src/components/ui/__tests__/TiltCard.test.jsx
git commit -m "feat: TiltCard hover-tilt wrapper (reduced-motion/touch no-op)"
```

---

### Task 5: TerminalWindow chrome

**Files:**
- Create: `src/components/ui/TerminalWindow.jsx`
- Create: `src/components/ui/__tests__/TerminalWindow.test.jsx`

**Interfaces:**
- Produces: `<TerminalWindow title className children>` — a `.term-window` with a title bar (three traffic-light dots + mono `title`) and a body wrapper. Renders `title` text and children.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/ui/__tests__/TerminalWindow.test.jsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TerminalWindow from '../TerminalWindow.jsx'

describe('TerminalWindow', () => {
  it('renders the title and children', () => {
    render(<TerminalWindow title="jezreel@portfolio: ~"><p>body</p></TerminalWindow>)
    expect(screen.getByText('jezreel@portfolio: ~')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/ui/__tests__/TerminalWindow.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `TerminalWindow`**

```jsx
// src/components/ui/TerminalWindow.jsx
export default function TerminalWindow({ title = '~', className = '', children }) {
  return (
    <div className={`term-window overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-panel-2/60 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#f7768e]" />
        <span className="h-3 w-3 rounded-full bg-[#e0af68]" />
        <span className="h-3 w-3 rounded-full bg-[#9ece6a]" />
        <span className="ml-3 font-mono text-xs text-slate-500">{title}</span>
      </div>
      <div className="p-5 font-mono text-sm leading-7 sm:p-6">{children}</div>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/components/ui/__tests__/TerminalWindow.test.jsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/TerminalWindow.jsx src/components/ui/__tests__/TerminalWindow.test.jsx
git commit -m "feat: TerminalWindow chrome component"
```

---

### Task 6: useTypewriter hook

**Files:**
- Create: `src/hooks/useTypewriter.js`
- Create: `src/hooks/__tests__/useTypewriter.test.js`

**Interfaces:**
- Produces: `useTypewriter(lines, opts?)` where `lines` is `string[]`. Returns `{ text, done }` where `text` is the currently-typed string (newline-joined progress) and `done` is true when finished. Under `prefers-reduced-motion: reduce`, returns the full text immediately with `done === true`.

- [ ] **Step 1: Write the failing test**

```js
// src/hooks/__tests__/useTypewriter.test.js
import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useTypewriter } from '../useTypewriter.js'

describe('useTypewriter', () => {
  it('returns full text immediately under reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const { result } = renderHook(() => useTypewriter(['$ whoami', '> Jezreel']))
    expect(result.current.text).toBe('$ whoami\n> Jezreel')
    expect(result.current.done).toBe(true)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/hooks/__tests__/useTypewriter.test.js`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `useTypewriter`**

```js
// src/hooks/useTypewriter.js
import { useEffect, useRef, useState } from 'react'

export function useTypewriter(lines, { speed = 28, linePause = 350 } = {}) {
  const full = lines.join('\n')
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [text, setText] = useState(reduce ? full : '')
  const [done, setDone] = useState(reduce)
  const iRef = useRef(0)

  useEffect(() => {
    if (reduce) return
    let timer
    const step = () => {
      const i = iRef.current
      if (i >= full.length) {
        setDone(true)
        return
      }
      setText(full.slice(0, i + 1))
      iRef.current = i + 1
      const pause = full[i] === '\n' ? linePause : speed
      timer = setTimeout(step, pause)
    }
    timer = setTimeout(step, speed)
    return () => clearTimeout(timer)
  }, [full, reduce, speed, linePause])

  return { text, done }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/hooks/__tests__/useTypewriter.test.js`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTypewriter.js src/hooks/__tests__/useTypewriter.test.js
git commit -m "feat: useTypewriter hook with reduced-motion fallback"
```

---

### Task 7: Terminal boot Hero

**Files:**
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: `TerminalWindow` (Task 5), `useTypewriter` (Task 6), `site` config, `framer-motion`.
- Produces: Hero terminal section; still accepts `{ stats, loading }`.

- [ ] **Step 1: Replace `Hero.jsx`**

```jsx
import { motion } from 'framer-motion'
import { site } from '../config/site.js'
import TerminalWindow from './ui/TerminalWindow.jsx'
import { useTypewriter } from '../hooks/useTypewriter.js'

export default function Hero({ stats, loading }) {
  const lines = [
    '$ whoami',
    `> ${site.name} — ${site.role}`,
    '$ cat location.txt',
    `> ${site.location}`,
    '$ cat status.txt',
    '> available for opportunities',
  ]
  const { text, done } = useTypewriter(lines)

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-5 py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl"
      >
        <TerminalWindow title="jezreel@portfolio: ~">
          <pre className="whitespace-pre-wrap break-words text-slate-200">
            {text.split('\n').map((ln, i) => (
              <span key={i} className={ln.startsWith('>') ? 'text-primary' : 'text-green'}>
                {ln + '\n'}
              </span>
            ))}
            {!done && <span className="term-cursor">&nbsp;</span>}
          </pre>

          {!loading && (
            <div className="mt-4 border-t border-line pt-4 text-xs text-slate-500">
              <span className="text-amber">$</span> stats —{' '}
              {stats.totalRepos} repos · {stats.totalStars} stars · {stats.languages.length} languages
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3 font-sans">
            <a href="#projects" className="rounded-lg bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-105">
              <span className="font-mono">./explore-work</span>
            </a>
            <a href="#contact" className="rounded-lg border border-line bg-panel/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-primary/60 hover:text-white">
              <span className="font-mono">./contact</span>
            </a>
          </div>
        </TerminalWindow>

        <p className="mt-6 text-center text-xs text-slate-500">
          press <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-slate-300">⌘K</kbd> to navigate
        </p>
      </motion.div>
    </section>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add src/components/Hero.jsx
git commit -m "feat: terminal boot hero with typewriter session"
```

---

### Task 8: ⌘K command palette

**Files:**
- Create: `src/lib/commands.js`
- Create: `src/hooks/useCommandPalette.js`
- Create: `src/components/CommandPalette.jsx`
- Create: `src/components/__tests__/CommandPalette.test.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `site` config.
- Produces:
  - `buildCommands(site)` → array of `{ id, label, hint, run }` (run is a function).
  - `useCommandPalette()` → `{ open, setOpen }`; toggles `open` on `⌘K`/`Ctrl+K`, closes on `Escape`.
  - `<CommandPalette open onClose commands />` — modal with a filter input (`role="dialog"`, `aria-label="Command palette"`), arrow/enter selection, runs the command then calls `onClose`.

- [ ] **Step 1: Write the failing test**

```jsx
// src/components/__tests__/CommandPalette.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CommandPalette from '../CommandPalette.jsx'

const commands = [
  { id: 'projects', label: 'Go to Projects', hint: 'section', run: vi.fn() },
  { id: 'github', label: 'Open GitHub', hint: 'link', run: vi.fn() },
]

describe('CommandPalette', () => {
  it('filters commands by query', () => {
    render(<CommandPalette open commands={commands} onClose={() => {}} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'git' } })
    expect(screen.getByText('Open GitHub')).toBeInTheDocument()
    expect(screen.queryByText('Go to Projects')).toBeNull()
  })

  it('runs a command on click and closes', () => {
    const onClose = vi.fn()
    render(<CommandPalette open commands={commands} onClose={onClose} />)
    fireEvent.click(screen.getByText('Go to Projects'))
    expect(commands[0].run).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} commands={commands} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/components/__tests__/CommandPalette.test.jsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/commands.js`**

```js
// src/lib/commands.js
function goTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export function buildCommands(site) {
  return [
    { id: 'home', label: 'Go to Home', hint: 'section', run: () => goTo('home') },
    { id: 'about', label: 'Go to About', hint: 'section', run: () => goTo('about') },
    { id: 'stats', label: 'Go to GitHub stats', hint: 'section', run: () => goTo('stats') },
    { id: 'projects', label: 'Go to Projects', hint: 'section', run: () => goTo('projects') },
    { id: 'repos', label: 'Go to Repositories', hint: 'section', run: () => goTo('repos') },
    { id: 'contact', label: 'Go to Contact', hint: 'section', run: () => goTo('contact') },
    { id: 'github', label: 'Open GitHub', hint: 'link', run: () => window.open(site.links.github, '_blank', 'noopener') },
    { id: 'linkedin', label: 'Open LinkedIn', hint: 'link', run: () => window.open(site.links.linkedin, '_blank', 'noopener') },
    { id: 'email', label: 'Copy email address', hint: 'action', run: () => navigator.clipboard?.writeText(site.links.email) },
  ]
}
```

- [ ] **Step 4: Implement `src/hooks/useCommandPalette.js`**

```js
// src/hooks/useCommandPalette.js
import { useEffect, useState } from 'react'

export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return { open, setOpen }
}
```

- [ ] **Step 5: Implement `src/components/CommandPalette.jsx`**

```jsx
// src/components/CommandPalette.jsx
import { useEffect, useMemo, useRef, useState } from 'react'

export default function CommandPalette({ open, commands, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands
  }, [query, commands])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  if (!open) return null

  const choose = (cmd) => {
    cmd?.run()
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Command palette"
        className="term-window w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="font-mono text-amber">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command…"
            aria-label="Command query"
            className="w-full bg-transparent font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-slate-500">ESC</kbd>
        </div>
        <ul className="max-h-72 overflow-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-3 font-mono text-sm text-slate-500">no matches</li>
          )}
          {results.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(c)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm ${
                  i === active ? 'bg-primary/10 text-primary' : 'text-slate-300'
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-600">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run src/components/__tests__/CommandPalette.test.jsx`
Expected: PASS (all three).

- [ ] **Step 7: Wire into `App.jsx`**

Add imports:
```js
import CommandPalette from './components/CommandPalette.jsx'
import { useCommandPalette } from './hooks/useCommandPalette.js'
import { buildCommands } from './lib/commands.js'
```
In the component body:
```js
const { open, setOpen } = useCommandPalette()
const commands = buildCommands(site)
```
Render `<CommandPalette open={open} commands={commands} onClose={() => setOpen(false)} />` just before `<Footer />`. Pass `onOpenPalette={() => setOpen(true)}` to `<Nav />` (Nav consumes it in Task 9).

- [ ] **Step 8: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add -A
git commit -m "feat: ⌘K command palette with keyboard navigation"
```

---

### Task 9: Nav as terminal tab bar

**Files:**
- Modify: `src/components/Nav.jsx`

**Interfaces:**
- Consumes: `useScrollSpy`, `onOpenPalette` prop from App (Task 8).
- Produces: restyled Nav with `~/jezreel` path, scrollspy tabs, ⌘K hint button.

- [ ] **Step 1: Replace `Nav.jsx`**

```jsx
import { useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy.js'

const LINKS = [
  ['home', 'home'],
  ['about', 'about'],
  ['stats', 'github'],
  ['projects', 'projects'],
  ['repos', 'repos'],
  ['contact', 'contact'],
]
const LINK_IDS = LINKS.map(([id]) => id)

export default function Nav({ onOpenPalette }) {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(LINK_IDS)

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="glass fixed inset-x-0 top-0 z-50 border-b border-line px-5 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button onClick={() => go('home')} className="font-mono text-sm text-slate-400">
          <span className="text-green">~</span>/<span className="gradient-text font-semibold">jezreel</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`rounded-md px-2.5 py-1 font-mono text-sm transition-colors ${
                active === id ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={onOpenPalette}
            className="ml-2 flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-xs text-slate-500 hover:border-primary/50 hover:text-primary"
            aria-label="Open command palette"
          >
            <span>⌘K</span>
          </button>
        </div>

        <button className="text-xl text-slate-200 md:hidden" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
          <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} />
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="mt-3 flex flex-col gap-2 md:hidden">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="text-left font-mono text-sm text-slate-200">
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add src/components/Nav.jsx
git commit -m "feat: terminal tab-bar nav with scrollspy + ⌘K hint"
```

---

### Task 10: About — manifest card

**Files:**
- Modify: `src/components/About.jsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `site`. Must keep focus-pillar labels and the degree line (About.test.jsx asserts `Full-Stack Web`, `Mobile Apps`, `AI / Machine Learning`, and `/BS Computer Science/`).

- [ ] **Step 1: Replace `About.jsx`**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function About() {
  return (
    <Section id="about" title="About Me">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_360px]">
        <Reveal>
          <h3 className="font-display text-2xl font-bold">
            Full-Stack & <span className="gradient-text">AI Developer</span>
          </h3>
          <p className="mt-4 text-slate-300">{site.bio}</p>
          <p className="mt-5 font-mono text-sm text-slate-500">
            <span className="text-amber">$</span> {site.education.degree}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="term-window">
            <div className="flex items-center gap-2 border-b border-line bg-panel-2/60 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#f7768e]" />
              <span className="h-3 w-3 rounded-full bg-[#e0af68]" />
              <span className="h-3 w-3 rounded-full bg-[#9ece6a]" />
              <span className="ml-3 font-mono text-xs text-slate-500">focus.config</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-7">
              <span className="text-slate-500"># core focus areas</span>{'\n'}
              {site.focus.map((f) => (
                <span key={f.label}>
                  <span className="text-primary">focus</span>
                  <span className="text-slate-500"> = </span>
                  <span className="text-green">"{f.label}"</span>{'\n'}
                </span>
              ))}
            </pre>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify (About.test must stay green) and commit**

Run: `npx vitest run src/components/__tests__/About.test.jsx` → PASS.
Run: `npm run build` → succeeds.

```bash
git add src/components/About.jsx
git commit -m "feat: About with focus.config manifest card"
```

---

### Task 11: Skills — file cards

**Files:**
- Modify: `src/components/Skills.jsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `TiltCard` (Task 4), `site`.

- [ ] **Step 1: Replace `Skills.jsx`**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import TiltCard from './ui/TiltCard.jsx'
import { site } from '../config/site.js'

const FILE = ['languages.json', 'frontend.tsx', 'backend.py', 'ml.ipynb', 'tools.sh']

export default function Skills() {
  return (
    <Section title="Skills & Technologies">
      <div className="grid gap-6 md:grid-cols-2">
        {site.skills.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.05}>
            <TiltCard className="glass h-full rounded-xl">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                <i className={`fas ${cat.icon} text-primary`} aria-hidden="true" />
                <span className="font-mono text-sm text-slate-300">{FILE[i] || `${cat.title}.txt`}</span>
              </div>
              <div className="p-5">
                <h4 className="mb-3 text-sm font-semibold text-slate-200">{cat.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((t) => (
                    <span key={t} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

- [ ] **Step 2: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add src/components/Skills.jsx
git commit -m "feat: Skills as file-tab cards with tilt"
```

---

### Task 12: GitHub stats — terminal output tiles

**Files:**
- Modify: `src/components/GitHubStats.jsx`

**Interfaces:**
- Consumes: `Section`, `Reveal`, `AnimatedCounter`, `langColor`. Keep `{ stats, loading }` shape.

- [ ] **Step 1: Replace the cards grid markup**

Replace the `<div className="grid grid-cols-2 gap-4 md:grid-cols-4">…</div>` block (the four stat cards) with:

```jsx
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.05}>
            <div className="glass rounded-xl p-5">
              <div className="font-mono text-xs text-slate-500">
                <span className="text-amber">$</span> {c.label.toLowerCase().replace(/\s+/g, '_')}
              </div>
              <div className="mt-2 font-display text-3xl font-extrabold text-primary">
                {loading ? '—' : <AnimatedCounter value={c.value} />}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
```

Keep the existing `cards`/`total` definitions and the Language Distribution block unchanged except: change the wrapper `className="glass mt-8 rounded-2xl p-6"` → `className="glass mt-8 rounded-xl p-6"` and the heading to `<h4 className="mb-4 font-mono text-sm text-slate-300"># language_distribution</h4>`.

- [ ] **Step 2: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add src/components/GitHubStats.jsx
git commit -m "feat: GitHub stats as terminal-output tiles"
```

---

### Task 13: Featured + RepoCard with `$` titles and tilt

**Files:**
- Modify: `src/components/Featured.jsx`
- Modify: `src/components/RepoCard.jsx`

**Interfaces:**
- Consumes: `TiltCard` (Task 4), existing `Button`, `featured`, `langColor`. Featured.test.jsx asserts Live Demo / Code link behavior — keep `Button` usage and labels intact.

- [ ] **Step 1: Update `Featured.jsx` Card to use TiltCard + `$` title**

Add `import TiltCard from './ui/TiltCard.jsx'` at the top. Replace the `<motion.div …>` wrapper opening and closing tags of `Card` with a `TiltCard`, and prefix the title with a mono `$`:

```jsx
export function Card({ p, live }) {
  const stars = live?.stargazers_count ?? 0
  return (
    <TiltCard className="glass flex h-full flex-col rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl text-ink">
          <i className={`fas ${p.icon}`} aria-hidden="true" />
        </span>
        {stars > 0 && (
          <span className="font-mono text-xs text-slate-400">
            <i className="fas fa-star text-amber" aria-hidden="true" /> {stars}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-bold">
        <span className="font-mono text-amber">$ </span>{p.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-400">{p.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span key={t} className="rounded-md border border-line bg-primary/5 px-2 py-0.5 font-mono text-xs text-accent">{t}</span>
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
    </TiltCard>
  )
}
```

Remove the now-unused `import { motion } from 'framer-motion'` line.

- [ ] **Step 2: Update `RepoCard.jsx` accents**

Change the folder icon + title block so the name is `$`-prefixed and the star icon uses `text-amber`. Replace the `<h4>` and the stars `<span>` lines:

```jsx
      <h4 className="font-semibold text-slate-100">
        <span className="mr-1 font-mono text-amber">$</span>
        <a href={repo.html_url} target="_blank" rel="noreferrer" className="font-mono hover:text-primary">
          {repo.name}
        </a>
      </h4>
```
and
```jsx
        <span><i className="fas fa-star mr-1 text-amber" aria-hidden="true" />{repo.stargazers_count}</span>
```
Also change the card wrapper rounding `rounded-xl` (keep) and hover border to `hover:border-primary/50` (already present).

- [ ] **Step 3: Verify (Featured.test must stay green) and commit**

Run: `npx vitest run src/components/__tests__/Featured.test.jsx src/components/__tests__/RepoCard.test.jsx` → PASS.
Run: `npm run build` → succeeds.

```bash
git add src/components/Featured.jsx src/components/RepoCard.jsx
git commit -m "feat: project cards with \$ titles and 3D tilt"
```

---

### Task 14: RepoGrid `$ ls` filter bar

**Files:**
- Modify: `src/components/RepoGrid.jsx`

**Interfaces:**
- Consumes: `Section`, `RepoCard`, `filterSortRepos`. RepoGrid.test.jsx must stay green (keep the search input `aria-label="Search repositories"`, the sort `<select>` with its options, and the language filter buttons with `aria-pressed`).

- [ ] **Step 1: Add a mono command prefix above the controls**

Immediately inside `{!error && (<>` , before the `<div className="mb-6 flex flex-col gap-4 …">`, add:

```jsx
          <div className="mb-4 font-mono text-sm text-slate-500">
            <span className="text-amber">$</span> ls ./projects{' '}
            {language !== 'all' && <span className="text-primary">--lang={language}</span>}
          </div>
```

- [ ] **Step 2: Restyle controls to mono (keep all aria/handlers)**

In the search `<input>`, change `className` to `glass w-full rounded-lg py-2.5 pl-11 pr-4 font-mono text-sm outline-none focus:border-primary/60`. In the sort `<select>`, change `className` to `glass rounded-lg px-4 py-2.5 font-mono text-sm outline-none`. For each language button, change the active branch to `bg-primary text-ink` and keep `glass text-slate-300 hover:text-primary` for inactive; prefix the label with nothing (leave text). Do not change any `aria-*`, `value`, or `onChange`/`onClick` handlers.

- [ ] **Step 3: Verify (RepoGrid.test must stay green) and commit**

Run: `npx vitest run src/components/__tests__/RepoGrid.test.jsx` → PASS.
Run: `npm run build` → succeeds.

```bash
git add src/components/RepoGrid.jsx
git commit -m "feat: RepoGrid \$ ls filter bar, mono controls"
```

---

### Task 15: Orgs, Contact, Footer, Section polish

**Files:**
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Orgs.jsx`
- Modify: `src/components/ui/Section.jsx`

**Interfaces:**
- Consumes: existing imports. Keep Contact form field names/aria and the Formspree→mailto logic unchanged.

- [ ] **Step 1: Section — mono index label above headings**

In `Section.jsx`, replace the heading block with a mono section marker above the title:

```jsx
      {title && (
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">// {id || 'section'}</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && <p className="mt-3 font-mono text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}
```

- [ ] **Step 2: Contact — mono labels + token colors**

In `Contact.jsx`: change the contact-tile icon background `text-darker` → `text-ink`; change the submit button gradient text `text-darker` → `text-ink`; change the four form inputs/textarea border classes to use `border-line bg-panel/40 focus:border-primary/60` (replace `border-white/10 bg-white/5`); change the error `text-secondary` stays (now red `#f7768e`). Prefix each `CONTACTS` label render with a mono `$` is optional — instead change the contact tile `<div className="text-sm font-semibold">` to add `font-mono`. Keep all `name`, `aria-label`, `required`, and `onSubmit` logic unchanged.

- [ ] **Step 3: Footer — EOF + blinking cursor**

Replace the two `<p>` lines in `Footer.jsx` with:

```jsx
      <p className="font-mono text-sm text-slate-500">
        <span className="text-amber">$</span> echo "© {new Date().getFullYear()} {site.name}"
      </p>
      <p className="mt-2 font-mono text-xs text-slate-600">
        {site.role} · open to opportunities <span className="term-cursor align-middle">&nbsp;</span>
      </p>
```
Also change the social icon hover wrapper to `border border-line` by keeping `glass` (already fine).

- [ ] **Step 4: Orgs — mono label + token rounding**

In `Orgs.jsx`, change the anchor `className` `rounded-2xl` → `rounded-xl` and add `border border-line`, and change the `<span className="text-sm font-medium">` → `<span className="font-mono text-sm text-slate-300">`.

- [ ] **Step 5: Verify and commit**

Run: `npm test` → PASS. `npm run build` → succeeds.

```bash
git add src/components/Contact.jsx src/components/Footer.jsx src/components/Orgs.jsx src/components/ui/Section.jsx
git commit -m "feat: terminal-flavored Contact, Footer, Orgs, Section labels"
```

---

### Task 16: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: all suites PASS (original tests + new TiltCard, TerminalWindow, useTypewriter, usePointerSpotlight, CommandPalette).

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: succeeds with no errors.

- [ ] **Step 3: Manual smoke checklist (via `npm run dev`)**

Verify each, then note results:
- Hero terminal types out and settles; `⌘K` hint visible.
- `⌘K` / `Ctrl+K` opens the palette; typing filters; ↑/↓ + Enter navigates/runs; Esc closes; clicking a "Go to" scrolls.
- Nav tabs highlight on scroll; `~/jezreel` and ⌘K button present; no theme toggle anywhere.
- Hover a Skills/Featured card → subtle tilt; move mouse → spotlight glow follows (desktop).
- Projects show `$` titles, Demo/Code buttons work; RepoGrid search/sort/lang filters work and show `$ ls ./projects`.
- Contact submit falls back to mailto (formspreeId empty); Footer shows `$ echo …` + blinking cursor.
- Set OS "reduce motion" → reload: hero shows final text instantly, no tilt, no spotlight, no blink.

- [ ] **Step 4: Final commit (if any manual fixes were needed)**

```bash
git add -A
git commit -m "chore: final polish after redesign smoke test"
```

---

## Self-Review

**Spec coverage:**
- Tokyo Night dark-only tokens → Task 1. ✓
- Background → Task 2. ✓
- Spotlight → Task 3. ✓ · Tilt → Task 4 (used in 11, 13). ✓
- Terminal window + boot hero → Tasks 5–7. ✓
- ⌘K palette (keyboard, ARIA, actions, no theme toggle) → Task 8. ✓
- Nav tab bar → Task 9. ✓
- About / Skills / Stats / Featured+Repo / RepoGrid / Orgs+Contact+Footer+Section → Tasks 10–15. ✓
- Accessibility (reduced-motion, touch) → built into Tasks 3, 4, 6; verified Task 16. ✓
- Tests kept green + new tests → each task; final Task 16. ✓
- No new deps → Global Constraints; nothing added. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code. ✓

**Type consistency:** `buildCommands(site)` → `{id,label,hint,run}` consumed identically by `CommandPalette` and tests; `useCommandPalette` → `{open,setOpen}` used in App; `useTypewriter` → `{text,done}` used in Hero; `usePointerSpotlight()` returns void; `TiltCard`/`TerminalWindow` props match their usages. ✓
