# Portfolio Credentials and Light Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved editorial credential layout with simultaneous badge/certificate evidence, a light-default persistent dark toggle, accurate credential content, supplied project screenshots, and a separate alternating academic-project section.

**Architecture:** Keep the React/Vite single-page structure and make the feature data-driven. A small theme module and hook own root-class persistence; focused evidence and academic-project components render configuration records; semantic Tailwind colors resolve through CSS variables for both themes; generated static preview assets keep certificate rendering fast and consistent.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, Framer Motion 11, Vitest 2, Testing Library, Python 3 with `pypdfium2==4.30.0` as a one-time preview-generation tool.

## Global Constraints

- Preserve all existing unrelated working-tree changes.
- Light mode is the default when `localStorage` contains no explicit preference.
- Dark mode is activated only by the persisted `dark` preference and the root `html.dark` class.
- The hero terminal and command palette remain intentionally dark in both themes.
- Every supplied credential displays a real first-page preview; Cisco credentials display badge and certificate preview simultaneously.
- Public asset paths use lowercase ASCII slugs with hyphens and no spaces, smart quotes, ampersands, or parentheses.
- The four additional academic projects do not remain in the featured explorer.
- Do not invent project links, certificate claims, technologies, issuers, or dates.
- Keep all interactive elements keyboard accessible and honor `prefers-reduced-motion`.
- Do not add a runtime PDF library or a new application route.

---

## File Structure

### New source files

- `src/lib/theme.js` — pure theme constants, stored-value parsing, and root-class application.
- `src/hooks/useTheme.js` — React state and persistence wrapper around the pure theme functions.
- `src/components/ui/ThemeToggle.jsx` — accessible sun/moon theme control.
- `src/components/CredentialEvidence.jsx` — badge/certificate preview composition.
- `src/components/OtherAcademicProjects.jsx` — alternating editorial project rows.
- `src/config/academicProjects.js` — the four additional academic-project records.
- `scripts/render-credential-previews.py` — deterministic first-page PDF preview generation.
- `requirements-tools.txt` — pinned one-time preview-generation dependency.

### New tests

- `src/lib/__tests__/theme.test.js`
- `src/hooks/__tests__/useTheme.test.js`
- `src/components/ui/__tests__/ThemeToggle.test.jsx`
- `src/components/__tests__/CredentialEvidence.test.jsx`
- `src/components/__tests__/OtherAcademicProjects.test.jsx`
- `src/config/__tests__/academicProjects.test.js`

### Modified source files

- `index.html`, `src/main.jsx`, `src/App.jsx`, `src/components/Nav.jsx`
- `src/components/Certifications.jsx`, `src/components/Featured.jsx`
- `src/config/site.js`, `src/config/featured.js`
- `src/index.css`, `tailwind.config.js`
- Theme-consumer components already modified on this branch: `About.jsx`, `Background.jsx`, `CommandPalette.jsx`, `Contact.jsx`, `FloatingLinks.jsx`, `Footer.jsx`, `Hero.jsx`, `OrgProjects.jsx`, `RepoCard.jsx`, `RepoGrid.jsx`, `Skills.jsx`, `Spotlight.jsx`, `ui/Button.jsx`, `ui/LanguageDonut.jsx`, `ui/Pagination.jsx`, `ui/Section.jsx`, and `ui/TerminalWindow.jsx`.

### Static assets

- `public/credentials/badges/*.png`
- `public/credentials/certificates/*.{pdf,jpg}`
- `public/credentials/previews/*.{webp,jpg}`
- `public/project-images/*.png`

---

### Task 1: Theme State, Persistence, and Toggle

**Files:**
- Create: `src/lib/theme.js`
- Create: `src/lib/__tests__/theme.test.js`
- Create: `src/hooks/useTheme.js`
- Create: `src/hooks/__tests__/useTheme.test.js`
- Create: `src/components/ui/ThemeToggle.jsx`
- Create: `src/components/ui/__tests__/ThemeToggle.test.jsx`
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `index.html`

**Interfaces:**
- Produces: `THEME_STORAGE_KEY = 'portfolio-theme'`.
- Produces: `readStoredTheme(storage): 'light' | 'dark'`.
- Produces: `applyTheme(theme, root): void`.
- Produces: `useTheme(): { theme: 'light' | 'dark', toggleTheme: () => void }`.
- Produces: `ThemeToggle({ theme, onToggle })`.
- Consumers: `App` calls `useTheme`; `Nav` receives `theme` and `onToggleTheme`.

- [ ] **Step 1: Add failing pure theme tests**

```js
import { beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from '../theme.js'

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to light when no stored preference exists', () => {
    expect(readStoredTheme(localStorage)).toBe('light')
  })

  it('restores only a valid stored dark preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(readStoredTheme(localStorage)).toBe('dark')
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia')
    expect(readStoredTheme(localStorage)).toBe('light')
  })

  it('applies dark by toggling the root class and color scheme', () => {
    applyTheme('dark', document.documentElement)
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    applyTheme('light', document.documentElement)
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
```

- [ ] **Step 2: Run the theme utility test and verify RED**

Run: `npm test -- src/lib/__tests__/theme.test.js`  
Expected: FAIL because `src/lib/theme.js` does not exist.

- [ ] **Step 3: Implement the pure theme module**

```js
export const THEME_STORAGE_KEY = 'portfolio-theme'

export function readStoredTheme(storage = window.localStorage) {
  return storage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
}

export function applyTheme(theme, root = document.documentElement) {
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}
```

- [ ] **Step 4: Run the theme utility test and verify GREEN**

Run: `npm test -- src/lib/__tests__/theme.test.js`  
Expected: 3 tests PASS.

- [ ] **Step 5: Add failing hook and toggle tests**

```jsx
// src/hooks/__tests__/useTheme.test.js
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from '../useTheme.js'
import { THEME_STORAGE_KEY } from '../../lib/theme.js'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('starts light and persists a dark toggle', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')
  })
})

// src/components/ui/__tests__/ThemeToggle.test.jsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ThemeToggle from '../ThemeToggle.jsx'

describe('ThemeToggle', () => {
  it('describes the next theme and invokes the toggle', () => {
    const onToggle = vi.fn()
    const { rerender } = render(<ThemeToggle theme="light" onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(onToggle).toHaveBeenCalledOnce()
    rerender(<ThemeToggle theme="dark" onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run the hook/toggle tests and verify RED**

Run: `npm test -- src/hooks/__tests__/useTheme.test.js src/components/ui/__tests__/ThemeToggle.test.jsx`  
Expected: FAIL because `useTheme.js` and `ThemeToggle.jsx` do not exist.

- [ ] **Step 7: Implement the hook and toggle**

```js
// src/hooks/useTheme.js
import { useCallback, useEffect, useState } from 'react'
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from '../lib/theme.js'

export function useTheme() {
  const [theme, setTheme] = useState(() => readStoredTheme())

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  return { theme, toggleTheme }
}
```

```jsx
// src/components/ui/ThemeToggle.jsx
export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel text-muted transition-colors hover:border-primary/60 hover:text-primary"
    >
      <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" />
    </button>
  )
}
```

- [ ] **Step 8: Wire the theme without a startup flash**

Use this bootstrap in `src/main.jsx` before `createRoot`:

```js
import { applyTheme, readStoredTheme } from './lib/theme.js'

applyTheme(readStoredTheme())
```

Remove `class="dark"` from `index.html`. In `App.jsx`, call:

```jsx
const { theme, toggleTheme } = useTheme()
<Nav onOpenPalette={() => setOpen(true)} theme={theme} onToggleTheme={toggleTheme} />
```

Update `Nav({ onOpenPalette, theme, onToggleTheme })` to render `ThemeToggle` before the command-palette button on desktop and beside the menu button on mobile.

- [ ] **Step 9: Run theme tests and the existing Nav-related suite**

Run: `npm test -- src/lib/__tests__/theme.test.js src/hooks/__tests__/useTheme.test.js src/components/ui/__tests__/ThemeToggle.test.jsx src/components/__tests__/CommandPalette.test.jsx`  
Expected: all listed tests PASS.

- [ ] **Step 10: Commit the isolated theme behavior**

```powershell
git add index.html src/main.jsx src/App.jsx src/components/Nav.jsx src/components/ui/ThemeToggle.jsx src/components/ui/__tests__/ThemeToggle.test.jsx src/hooks/useTheme.js src/hooks/__tests__/useTheme.test.js src/lib/theme.js src/lib/__tests__/theme.test.js
git commit -m "feat: add persistent light and dark theme toggle"
```

---

### Task 2: URL-Safe Credential Assets and Evidence-Grounded Data

**Files:**
- Create: `scripts/render-credential-previews.py`
- Create: `requirements-tools.txt`
- Create: `public/credentials/previews/*.{webp,jpg}`
- Create or replace: URL-safe files in `public/credentials/certificates/`
- Modify: `src/config/site.js`
- Modify: `src/config/__tests__/site.test.js`

**Interfaces:**
- Produces: every `site.certifications[]` record has `certificate` and `certificatePreview`.
- Produces: optional `badge`, `url`, and `controlNumber`; `credentialId` remains a string.
- Consumes: source PDFs in `portfolio-credentials/certifcates/`.

- [ ] **Step 1: Add failing credential integrity tests**

Add Node filesystem imports and these tests to `src/config/__tests__/site.test.js`:

```js
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const publicFile = (url) => path.join(root, 'public', url.replace(/^\//, ''))

it('uses URL-safe local certificate and preview paths that exist', () => {
  expect(site.certifications).toHaveLength(11)
  for (const credential of site.certifications) {
    for (const field of ['certificate', 'certificatePreview']) {
      expect(credential[field]).toMatch(/^\/credentials\/[a-z0-9/-]+\.(pdf|jpg|webp)$/)
      expect(fs.existsSync(publicFile(credential[field]))).toBe(true)
    }
    if (credential.badge) {
      expect(fs.existsSync(publicFile(credential.badge))).toBe(true)
    }
  }
})

it('uses evidence-grounded metadata for newly supplied credentials', () => {
  expect(site.certifications).toEqual(expect.arrayContaining([
    expect.objectContaining({
      title: 'Are your s3crets safe? Fortifying Your Arsenal Against AWS Bucket Breaches',
      issuer: 'GC Bitbarkada',
      issued: 'Oct 1, 2025',
    }),
    expect.objectContaining({
      title: 'Integrated OS – Be More Digi-TALINO',
      issuer: 'Integrated Office Solutions, Inc.',
      issued: 'Sep 5, 2025',
    }),
    expect.objectContaining({
      title: 'AI-Driven Software Development: From Wireframe to App – with a Focus on Security and Assurance',
      issuer: 'Computer Science Society Organization',
      issued: 'Dec 3, 2025',
    }),
  ]))
})
```

- [ ] **Step 2: Run the config test and verify RED**

Run: `npm test -- src/config/__tests__/site.test.js`  
Expected: FAIL because unsafe filenames, missing `certificatePreview`, and inaccurate metadata remain.

- [ ] **Step 3: Add the deterministic preview generator**

```text
# requirements-tools.txt
pypdfium2==4.30.0
Pillow==11.3.0
```

```python
# scripts/render-credential-previews.py
from pathlib import Path
import shutil
import pypdfium2 as pdfium

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "portfolio-credentials" / "certifcates"
DEST = ROOT / "public" / "credentials"

PDFS = {
    "4-hour Webinar on Data Privacy Awareness RAMOS_JEZREEL.pdf": "data-privacy-awareness",
    "ApplyAIUpdateYourResumev120260813-20-tp9b24.pdf": "apply-ai-update-your-resume",
    "Are your S3CretS Safe Forti&ing Your Certificate Jezreel R. Ramos.pdf": "aws-bucket-breaches",
    "CodeChum Certificate RamosJezreel-19903.pdf": "java-software-engineering-i",
    "DataAnalyticsEssentialsUpdate20260813-20-5fpb7t.pdf": "data-analytics-essentials",
    "DataScienceEssentialswithPythonv120260813-20-71nzrr.pdf": "data-science-essentials-with-python",
    "Integrated OS Be More DigiTalino Certificate_of_Participation_-361.pdf": "integrated-os-digi-talino",
    "IntrotoModernAIUpdate20260813-20-qjixfv.pdf": "introduction-to-modern-ai",
    "“AI-Powered Future  Mastering Prompt_JEZREEL_R_RAMOS.pdf": "ai-powered-future-prompt-engineering",
    "“Hour of Code”  (Bulk 1) Copy of OG BTFM x AI Ready ASEAN Programme_Certificate.pdf": "hour-of-code-ai-ready-asean",
}

for folder in (DEST / "certificates", DEST / "previews"):
    folder.mkdir(parents=True, exist_ok=True)

for filename, slug in PDFS.items():
    source = SOURCE / filename
    shutil.copyfile(source, DEST / "certificates" / f"{slug}.pdf")
    document = pdfium.PdfDocument(source)
    page = document[0]
    image = page.render(scale=1.6).to_pil().convert("RGB")
    image.thumbnail((1400, 1000))
    image.save(DEST / "previews" / f"{slug}.webp", "WEBP", quality=84, method=6)

seminar = SOURCE / "SEMINAR_AI-Driven_Software_Development.jpg"
shutil.copyfile(seminar, DEST / "certificates" / "ai-driven-software-development.jpg")
shutil.copyfile(seminar, DEST / "previews" / "ai-driven-software-development.jpg")
```

- [ ] **Step 4: Generate the certificate assets**

Run:

```powershell
python -m pip install -r requirements-tools.txt
python scripts/render-credential-previews.py
```

Expected: 10 sanitized PDFs, 10 WebP previews, one sanitized seminar JPG, and one seminar preview JPG exist under `public/credentials/`.

- [ ] **Step 5: Replace credential configuration with exact metadata**

Keep the four Cisco credential IDs and verification URLs already present. Use exact dates and descriptions from the approved spec. Each record must follow this shape:

```js
{
  icon: 'fa-lock',
  title: 'Are your s3crets safe? Fortifying Your Arsenal Against AWS Bucket Breaches',
  issuer: 'GC Bitbarkada',
  issued: 'Oct 1, 2025',
  credentialId: '',
  url: '',
  badge: null,
  certificate: '/credentials/certificates/aws-bucket-breaches.pdf',
  certificatePreview: '/credentials/previews/aws-bucket-breaches.webp',
  description:
    'A career-enhancement upskilling course focused on strengthening defenses against AWS bucket breaches.',
  skills: ['AWS Security', 'Bucket Security', 'Cloud Security'],
}
```

Use these exact `certificate`/`certificatePreview` slugs for all 11 records:

```text
introduction-to-modern-ai
apply-ai-update-your-resume
data-science-essentials-with-python
data-analytics-essentials
ai-powered-future-prompt-engineering
data-privacy-awareness
java-software-engineering-i
aws-bucket-breaches
integrated-os-digi-talino
ai-driven-software-development
hour-of-code-ai-ready-asean
```

Use this exact evidence map:

| Title | Issuer | Issued | Badge | Description/skills evidence |
|---|---|---:|---|---|
| Introduction to Modern AI | Cisco Networking Academy | Jun 18, 2026 | `introduction-to-modern-ai.png` | AI/ML basics, photo classification, object detection/segmentation, machine translation limits, LLM fundamentals, prompting, chatbot use cases, chatbot collaboration, tool use, multimodal prompting |
| Apply AI: Update Your Resume | Cisco Networking Academy | Jun 19, 2026 | `apply-ai-update-your-resume.png` | Redaction before public AI tools, privacy/accuracy/speed tradeoffs, accomplishment extraction, evidence-based bullets, LLM self-checks plus human validation, ATS-friendly skills, PDF styling, job-specific tailoring |
| Data Science Essentials with Python | Cisco Networking Academy | Jun 16, 2026 | `data-science-essentials-with-python.png` | CSV/DataFrame import, `eval()`, `query()`, `groupby()`, left merges, missing data and datatype cleaning, Matplotlib, readable charts, basic linear models, hypothesis testing |
| Data Analytics Essentials | Cisco Networking Academy | Jun 9, 2026 | `data-analytics-essentials.png` | Analytics process, data characteristics/acquisition, transformation, basic statistics/preparation, Excel, SQL, Tableau, portfolio evaluation |
| AI-Powered Future: Mastering Prompt Engineering in Generative AI | DICT Region V | Sep 6, 2025 | none | Prompt engineering and generative AI; store course code `DICTR5:2025-W-MPEG-1` as `credentialId` and control number `2025-IBWEB1146` as `controlNumber` |
| 4-hour Webinar on Data Privacy Awareness | DICT Region XI | Sep 10, 2025 | none | Attendance at the four-hour webinar hosted by the Davao del Sur Provincial Office; data privacy awareness only |
| Java Software Engineering I | CodeChum | Dec 9, 2025 | none | CMSC 309 Software Engineering 1, A.Y. 2025–2026, BSCS3A, score 400/431 |
| Are your s3crets safe? Fortifying Your Arsenal Against AWS Bucket Breaches | GC Bitbarkada | Oct 1, 2025 | none | AWS bucket-breach defense and cloud security; exclude unsupported Secrets Manager, IAM, environment-isolation, and DevSecOps claims |
| Integrated OS – Be More Digi-TALINO | Integrated Office Solutions, Inc. | Sep 5, 2025 | none | Productivity apps, digital communication, smart research, data safety, and security |
| AI-Driven Software Development: From Wireframe to App – with a Focus on Security and Assurance | Computer Science Society Organization | Dec 3, 2025 | none | Participation at Laguna State Polytechnic University, Santa Cruz Campus; wireframe-to-app development with security and assurance focus |
| Hour of Code — AI Ready ASEAN Programme | Break the Fake Movement / ASEAN Foundation | Aug 25, 2025 | none | Three hours via Zoom, implemented by Break the Fake Movement with the ASEAN Foundation and supported by Google.org and DICT Aurora |

- [ ] **Step 6: Run the config test and verify GREEN**

Run: `npm test -- src/config/__tests__/site.test.js`  
Expected: every site-config test PASS, including file existence and corrected metadata.

- [ ] **Step 7: Commit credential assets and configuration**

```powershell
git add requirements-tools.txt scripts/render-credential-previews.py src/config/site.js src/config/__tests__/site.test.js public/credentials/badges public/credentials/certificates public/credentials/previews
git commit -m "feat: add verified credential assets and metadata"
```

---

### Task 3: Editorial Credential Evidence Panels

**Files:**
- Create: `src/components/CredentialEvidence.jsx`
- Create: `src/components/__tests__/CredentialEvidence.test.jsx`
- Modify: `src/components/Certifications.jsx`
- Modify: `src/components/__tests__/Certifications.test.jsx`

**Interfaces:**
- Consumes: `credential.badge`, `credential.certificate`, `credential.certificatePreview`, and `credential.title`.
- Produces: `CredentialEvidence({ credential })`.
- `Certifications` paginates `site.certifications` with page size `2`.

- [ ] **Step 1: Write failing evidence tests**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CredentialEvidence from '../CredentialEvidence.jsx'

const base = {
  title: 'Introduction to Modern AI',
  badge: '/credentials/badges/introduction-to-modern-ai.png',
  certificate: '/credentials/certificates/introduction-to-modern-ai.pdf',
  certificatePreview: '/credentials/previews/introduction-to-modern-ai.webp',
}

describe('CredentialEvidence', () => {
  it('shows badge and certificate preview together', () => {
    render(<CredentialEvidence credential={base} />)
    expect(screen.getByRole('img', { name: 'Introduction to Modern AI badge' })).toHaveAttribute('src', base.badge)
    expect(screen.getByRole('img', { name: 'Introduction to Modern AI certificate preview' })).toHaveAttribute('src', base.certificatePreview)
    expect(screen.getByRole('link', { name: 'Open Introduction to Modern AI certificate' })).toHaveAttribute('href', base.certificate)
  })

  it('uses the full evidence area when no badge exists', () => {
    const { container } = render(<CredentialEvidence credential={{ ...base, badge: null }} />)
    expect(screen.queryByText(/issuer badge/i)).toBeNull()
    expect(container.querySelector('[data-certificate-only="true"]')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the evidence tests and verify RED**

Run: `npm test -- src/components/__tests__/CredentialEvidence.test.jsx`  
Expected: FAIL because `CredentialEvidence.jsx` does not exist.

- [ ] **Step 3: Implement `CredentialEvidence`**

```jsx
export default function CredentialEvidence({ credential }) {
  const { badge, certificate, certificatePreview, title } = credential
  return (
    <div
      className={`grid overflow-hidden border-b border-line bg-panel-2 ${badge ? 'md:grid-cols-[240px_1fr]' : ''}`}
      data-certificate-only={badge ? undefined : 'true'}
    >
      {badge && (
        <div className="flex items-center justify-center border-b border-line bg-panel p-8 md:border-b-0 md:border-r">
          <img
            src={badge}
            alt={`${title} badge`}
            className="h-32 w-32 object-contain drop-shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <a
        href={certificate}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${title} certificate`}
        className="group relative block min-h-52 overflow-hidden bg-panel"
      >
        <img
          src={certificatePreview}
          alt={`${title} certificate preview`}
          className="h-full max-h-80 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.015]"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-3 right-3 rounded-md border border-line bg-panel/95 px-3 py-1.5 font-mono text-xs text-muted shadow-sm group-hover:text-primary">
          Open certificate <i className="fas fa-arrow-up-right-from-square ml-1" aria-hidden="true" />
        </span>
      </a>
    </div>
  )
}
```

- [ ] **Step 4: Run evidence tests and verify GREEN**

Run: `npm test -- src/components/__tests__/CredentialEvidence.test.jsx`  
Expected: 2 tests PASS.

- [ ] **Step 5: Replace the certification grid tests with editorial pagination behavior**

Add to `Certifications.test.jsx`:

```jsx
import { fireEvent } from '@testing-library/react'

it('shows two editorial credentials per page', () => {
  render(<Certifications />)
  expect(screen.getByText('Introduction to Modern AI')).toBeInTheDocument()
  expect(screen.getByText('Apply AI: Update Your Resume')).toBeInTheDocument()
  expect(screen.queryByText('Data Science Essentials with Python')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: /next/i }))
  expect(screen.getByText('Data Science Essentials with Python')).toBeInTheDocument()
})

it('renders simultaneous badge and certificate evidence', () => {
  render(<Certifications />)
  expect(screen.getByRole('img', { name: 'Introduction to Modern AI badge' })).toBeInTheDocument()
  expect(screen.getByRole('img', { name: 'Introduction to Modern AI certificate preview' })).toBeInTheDocument()
})
```

- [ ] **Step 6: Run certification tests and verify RED**

Run: `npm test -- src/components/__tests__/Certifications.test.jsx`  
Expected: FAIL because six items render per page and the current component has no real preview.

- [ ] **Step 7: Implement the selected editorial layout**

Change `usePagination(site.certifications, 6)` to `usePagination(site.certifications, 2)`. Remove the two-column grid and `TiltCard`. Render:

```jsx
<div className="space-y-10">
  {pageItems.map((credential, index) => (
    <Reveal key={credential.title} delay={index * 0.05}>
      <article className="surface overflow-hidden rounded-xl">
        <CredentialEvidence credential={credential} />
        <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_280px]">
          <div>
            <h3 className="font-display text-2xl font-bold text-foreground">{credential.title}</h3>
            <p className="mt-2 font-mono text-sm text-primary">
              {credential.issuer}
              {credential.issued && <span className="text-muted"> · {credential.issued}</span>}
            </p>
            <p className="mt-5 max-w-[65ch] leading-relaxed text-muted">{credential.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {credential.skills.map((skill) => (
                <span key={skill} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-end gap-3 font-mono text-xs">
            {credential.credentialId && <p className="break-all text-subtle">id: {credential.credentialId}</p>}
            {credential.controlNumber && <p className="break-all text-subtle">control: {credential.controlNumber}</p>}
            {credential.url && (
              <a href={credential.url} target="_blank" rel="noreferrer" className="self-start rounded-lg border border-line bg-panel px-3 py-2 text-muted hover:border-primary/60 hover:text-primary">
                Verify official record
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  ))}
</div>
```

- [ ] **Step 8: Run credential tests and verify GREEN**

Run: `npm test -- src/components/__tests__/CredentialEvidence.test.jsx src/components/__tests__/Certifications.test.jsx`  
Expected: all credential component tests PASS.

- [ ] **Step 9: Commit the editorial credential UI**

```powershell
git add src/components/CredentialEvidence.jsx src/components/Certifications.jsx src/components/__tests__/CredentialEvidence.test.jsx src/components/__tests__/Certifications.test.jsx
git commit -m "feat: show badges and certificate previews together"
```

---

### Task 4: Separate Other Academic Projects

**Files:**
- Create: `src/config/academicProjects.js`
- Create: `src/config/__tests__/academicProjects.test.js`
- Create: `src/components/OtherAcademicProjects.jsx`
- Create: `src/components/__tests__/OtherAcademicProjects.test.jsx`
- Modify: `src/config/featured.js`
- Modify: `src/App.jsx`

**Interfaces:**
- Produces: `academicProjects: Array<{ slug, title, category, icon, image, description, tech }>`.
- Produces: `OtherAcademicProjects()`.
- Consumes: `Section`, `Reveal`, `academicProjects`, and `categoryStyle`.

- [ ] **Step 1: Write failing configuration tests**

```js
import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { academicProjects } from '../academicProjects.js'
import { featured } from '../featured.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

describe('academic project configuration', () => {
  it('defines the four supplied academic projects in order', () => {
    expect(academicProjects.map((project) => project.title)).toEqual([
      'VogueVista',
      'ResumeAnalyzerTkinter',
      'Jez_OS',
      'YouGames',
    ])
  })

  it('keeps academic projects out of the featured explorer', () => {
    const academicSlugs = new Set(academicProjects.map((project) => project.slug))
    expect(featured.some((project) => academicSlugs.has(project.slug))).toBe(false)
  })

  it('uses URL-safe screenshots that exist', () => {
    for (const project of academicProjects) {
      expect(project.image).toMatch(/^\/project-images\/[a-z0-9-]+\.png$/)
      expect(fs.existsSync(path.join(root, 'public', project.image.replace(/^\//, '')))).toBe(true)
      expect(project.description.length).toBeGreaterThan(80)
      expect(project.tech.length).toBeGreaterThanOrEqual(3)
    }
  })
})
```

- [ ] **Step 2: Run the configuration test and verify RED**

Run: `npm test -- src/config/__tests__/academicProjects.test.js`  
Expected: FAIL because `academicProjects.js` does not exist and the records remain in `featured`.

- [ ] **Step 3: Move the four records into `academicProjects.js`**

Use URL-safe public images:

```js
export const academicProjects = [
  {
    slug: 'voguevista',
    title: 'VogueVista',
    category: 'Web',
    icon: 'fa-shirt',
    image: '/project-images/voguevista.png',
    description:
      'A fashion e-commerce webpage built with HTML, CSS, and JavaScript, featuring product navigation, service highlights, promotional pricing, and a responsive product grid.',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    slug: 'resume-analyzer-tkinter',
    title: 'ResumeAnalyzerTkinter',
    category: 'AI / ML',
    icon: 'fa-file-magnifying-glass',
    image: '/project-images/resume-analyzer-tkinter.png',
    description:
      'A Python and Tkinter desktop application that compares resumes with job requirements using NLP and datasets, returning match scores, profile matches, keyword analysis, visualizations, and requirement-level feedback.',
    tech: ['Python', 'Tkinter', 'NLP', 'Pandas'],
  },
  {
    slug: 'jez-os',
    title: 'Jez_OS',
    category: 'Web',
    icon: 'fa-desktop',
    image: '/project-images/jez-os.png',
    description:
      'A JavaScript and Vue web-based operating-system simulation with a desktop interface, terminal, file tools, notes, settings, system utilities, browser, app store, diagnostics, and basic games.',
    tech: ['JavaScript', 'Vue.js', 'HTML', 'CSS'],
  },
  {
    slug: 'yougames',
    title: 'YouGames',
    category: 'Web',
    icon: 'fa-gamepad',
    image: '/project-images/yougames.png',
    description:
      'A searchable browser-game collection built with HTML, CSS, and JavaScript, including Tic-Tac-Toe, Snake, Tile Twister, Fruit Catch, Minesweeper, and Classic Snake with difficulty labels.',
    tech: ['HTML', 'CSS', 'JavaScript'],
  },
]
```

Copy the four supplied images to the URL-safe filenames above; do not delete the source files.

- [ ] **Step 4: Run the configuration test and verify GREEN**

Run: `npm test -- src/config/__tests__/academicProjects.test.js`  
Expected: all 3 tests PASS.

- [ ] **Step 5: Write the failing component test**

```jsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import OtherAcademicProjects from '../OtherAcademicProjects.jsx'

describe('OtherAcademicProjects', () => {
  it('renders all four screenshot-led academic projects', () => {
    render(<OtherAcademicProjects />)
    for (const title of ['VogueVista', 'ResumeAnalyzerTkinter', 'Jez_OS', 'YouGames']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: `${title} project screenshot` })).toBeInTheDocument()
    }
  })
})
```

- [ ] **Step 6: Run the component test and verify RED**

Run: `npm test -- src/components/__tests__/OtherAcademicProjects.test.jsx`  
Expected: FAIL because `OtherAcademicProjects.jsx` does not exist.

- [ ] **Step 7: Implement alternating editorial rows**

```jsx
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { academicProjects } from '../config/academicProjects.js'

export default function OtherAcademicProjects() {
  return (
    <Section
      id="academic-projects"
      title="Other Academic Projects"
      subtitle="Foundational work across web design, desktop NLP, systems simulation, and browser games."
    >
      <div className="space-y-14">
        {academicProjects.map((project, index) => (
          <Reveal key={project.slug}>
            <article className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="surface overflow-hidden rounded-2xl">
                <img
                  src={project.image}
                  alt={`${project.title} project screenshot`}
                  className="aspect-video h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">{project.category}</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground">{project.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((technology) => (
                    <span key={technology} className="rounded-md border border-line bg-panel-2 px-2.5 py-1 font-mono text-xs text-accent">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
```

Insert `<OtherAcademicProjects />` immediately after `<Featured repos={repos} />` in `App.jsx`.

- [ ] **Step 8: Run academic-project tests and verify GREEN**

Run: `npm test -- src/config/__tests__/academicProjects.test.js src/components/__tests__/OtherAcademicProjects.test.jsx src/components/__tests__/Featured.test.jsx`  
Expected: all tests PASS.

- [ ] **Step 9: Commit the academic-project section**

```powershell
git add src/App.jsx src/config/featured.js src/config/academicProjects.js src/config/__tests__/academicProjects.test.js src/components/OtherAcademicProjects.jsx src/components/__tests__/OtherAcademicProjects.test.jsx public/project-images/voguevista.png public/project-images/resume-analyzer-tkinter.png public/project-images/jez-os.png public/project-images/yougames.png
git commit -m "feat: add separate academic project showcase"
```

---

### Task 5: Current Project Screenshots and Grounded Descriptions

**Files:**
- Modify: `src/config/featured.js`
- Modify: `src/components/Featured.jsx`
- Modify: `src/components/__tests__/Featured.test.jsx`
- Create: URL-safe current-project images in `public/project-images/`

**Interfaces:**
- Every featured record except Quizera exposes an optional `image`.
- `ProjectDetail({ project, live })` renders `project.image` with `${title} project screenshot` alt text.
- Existing `source`, `demo`, live star count, category, and thesis behavior remain unchanged.

- [ ] **Step 1: Add failing screenshot and content tests**

```jsx
it('renders a supplied screenshot with specific alt text', () => {
  render(<ProjectDetail project={{ ...base, title: 'OSCA-AgeSense', image: '/project-images/osca-agesense.png' }} live={null} />)
  expect(screen.getByRole('img', { name: 'OSCA-AgeSense project screenshot' }))
    .toHaveAttribute('src', '/project-images/osca-agesense.png')
})
```

Add a config assertion:

```js
import { featured } from '../../config/featured.js'

it('keeps the featured explorer focused on seven current projects', () => {
  expect(featured).toHaveLength(7)
  expect(featured.map((project) => project.slug)).toEqual([
    'osca-agesense',
    'findify-mobile',
    'findify-web',
    'educational-rms',
    'quizera',
    '404-dreamteam',
    'sbcc-system',
  ])
})
```

- [ ] **Step 2: Run Featured tests and verify RED**

Run: `npm test -- src/components/__tests__/Featured.test.jsx`  
Expected: FAIL because the screenshot alt text currently omits “project” and image paths are not sanitized.

- [ ] **Step 3: Copy supplied screenshots to exact public names**

```text
AgeSense.png                 -> osca-agesense.png
Findify_Mobile.png           -> findify-mobile.png
Findify_Web.png              -> findify-web.png
educational-rms.png          -> educational-rms.png
404-dream-team.png           -> property-ai.png
sbcc-public.png              -> sbcc-management-system.png
```

Do not display `sbcc-admin.png` in this change.

- [ ] **Step 4: Update the seven featured records**

Use the URL-safe paths and evidence-grounded descriptions. Keep:

```js
{
  repo: '404-dreamteamfinal-project-ml-krr-1ay2526',
  slug: '404-dreamteam',
  title: 'PropertyAI — 404 DreamTeam',
  category: 'AI / ML',
  icon: 'fa-house-circle-check',
  image: '/project-images/property-ai.png',
  description:
    'An intelligent property recommendation system for affordable and sustainable housing choices, with natural-language search, criteria filters, future-price prediction, and ranked listing matches.',
  tech: ['Python', 'Jupyter', 'Machine Learning', 'KRR'],
  source: 'https://github.com/somarjez/404-DreamTeamFinal-Project-ML-KRR-1AY2526',
  demo: null,
}
```

Update `ProjectDetail` alt text to `${project.title} project screenshot`.

- [ ] **Step 5: Run Featured tests and verify GREEN**

Run: `npm test -- src/components/__tests__/Featured.test.jsx`  
Expected: all Featured tests PASS.

- [ ] **Step 6: Commit current-project evidence**

```powershell
git add src/config/featured.js src/components/Featured.jsx src/components/__tests__/Featured.test.jsx public/project-images/osca-agesense.png public/project-images/findify-mobile.png public/project-images/findify-web.png public/project-images/educational-rms.png public/project-images/property-ai.png public/project-images/sbcc-management-system.png
git commit -m "feat: add grounded current project screenshots"
```

---

### Task 6: Semantic Light/Dark Theme Across the Portfolio

**Files:**
- Modify: `tailwind.config.js`
- Modify: `src/index.css`
- Modify: `src/components/About.jsx`
- Modify: `src/components/Background.jsx`
- Modify: `src/components/Certifications.jsx`
- Modify: `src/components/CommandPalette.jsx`
- Modify: `src/components/Contact.jsx`
- Modify: `src/components/Featured.jsx`
- Modify: `src/components/FloatingLinks.jsx`
- Modify: `src/components/Footer.jsx`
- Modify: `src/components/Hero.jsx`
- Modify: `src/components/Nav.jsx`
- Modify: `src/components/OrgProjects.jsx`
- Modify: `src/components/RepoCard.jsx`
- Modify: `src/components/RepoGrid.jsx`
- Modify: `src/components/Skills.jsx`
- Modify: `src/components/Spotlight.jsx`
- Modify: `src/components/ui/Button.jsx`
- Modify: `src/components/ui/LanguageDonut.jsx`
- Modify: `src/components/ui/Pagination.jsx`
- Modify: `src/components/ui/Section.jsx`
- Modify: `src/components/ui/TerminalWindow.jsx`

**Interfaces:**
- Tailwind produces `bg-ink`, `bg-panel`, `bg-panel-2`, `border-line`, `text-foreground`, `text-muted`, `text-subtle`, `text-primary`, `text-accent`, `text-amber`, `text-green`, and `text-secondary` from CSS variables.
- Components use semantic classes; terminal-only content may retain fixed slate-on-dark classes.

- [ ] **Step 1: Add a failing semantic-token source test**

Add to `src/config/__tests__/site.test.js`:

```js
it('defines semantic light and dark theme tokens', () => {
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')
  for (const token of ['--color-ink', '--color-panel', '--color-foreground', '--color-muted', '--color-primary']) {
    expect(css).toContain(token)
  }
  expect(css).toMatch(/\.dark\s*\{/)
})
```

- [ ] **Step 2: Run the token test and verify RED**

Run: `npm test -- src/config/__tests__/site.test.js`  
Expected: FAIL because the current CSS defines only `--primary` and `--accent`.

- [ ] **Step 3: Convert Tailwind colors to CSS-variable-backed semantic tokens**

Replace the color extension with:

```js
const color = (name) => `rgb(var(--color-${name}) / <alpha-value>)`

colors: {
  ink: color('ink'),
  panel: color('panel'),
  'panel-2': color('panel-2'),
  line: color('line'),
  'line-bright': color('line-bright'),
  foreground: color('foreground'),
  muted: color('muted'),
  subtle: color('subtle'),
  primary: color('primary'),
  'primary-dark': color('primary-dark'),
  accent: color('accent'),
  secondary: color('secondary'),
  amber: color('amber'),
  green: color('green'),
  dark: color('ink'),
  darker: color('panel-2'),
  darkest: color('line'),
}
```

- [ ] **Step 4: Define exact light and dark CSS tokens**

```css
:root {
  --color-ink: 240 244 248;
  --color-panel: 255 255 255;
  --color-panel-2: 245 247 250;
  --color-line: 221 227 238;
  --color-line-bright: 200 210 227;
  --color-foreground: 30 41 59;
  --color-muted: 100 116 139;
  --color-subtle: 148 163 184;
  --color-primary: 25 118 210;
  --color-primary-dark: 21 101 192;
  --color-accent: 124 58 237;
  --color-secondary: 190 18 60;
  --color-amber: 180 83 9;
  --color-green: 21 128 61;
  --spotlight-x: 50%;
  --spotlight-y: 0%;
}

.dark {
  --color-ink: 10 14 20;
  --color-panel: 13 17 23;
  --color-panel-2: 17 22 31;
  --color-line: 31 41 55;
  --color-line-bright: 51 65 85;
  --color-foreground: 241 245 249;
  --color-muted: 148 163 184;
  --color-subtle: 100 116 139;
  --color-primary: 125 207 255;
  --color-primary-dark: 155 220 255;
  --color-accent: 187 154 247;
  --color-secondary: 247 118 142;
  --color-amber: 224 175 104;
  --color-green: 158 206 106;
}
```

Update `.surface`, `.glass`, section bands, focus rings, and body to use semantic variables. Keep `.term-window` fixed to `#0f172a` with light terminal text.

- [ ] **Step 5: Replace light-only utility classes with semantic classes**

Apply this mapping to non-terminal content:

```text
text-slate-800 / text-slate-700 / text-slate-50 -> text-foreground
text-slate-600 / text-slate-500 / text-slate-400 -> text-muted or text-subtle by hierarchy
bg-white -> bg-panel
bg-slate-50 / bg-slate-100 -> bg-panel-2
border-slate-* -> border-line
```

Explicit exceptions:

- Hero terminal contents, `TerminalWindow`, and `CommandPalette` inputs/results retain fixed `text-slate-100/300/400/500` on the dark terminal surface.
- `LanguageDonut` center text remains fixed light because its center is visually dark; change its empty ring stroke from `rgba(255,255,255,0.05)` to `rgb(var(--color-line) / 0.7)`.
- `Background` uses semantic `bg-ink` plus theme-aware radial/grid overlays instead of hard-coded light-only gradients.
- `Spotlight` uses `rgb(var(--color-primary) / 0.08)`.

- [ ] **Step 6: Run the complete component suite**

Run: `npm test -- src/components src/hooks src/lib src/config`  
Expected: all tests PASS with no invalid-class or render errors.

- [ ] **Step 7: Build and inspect generated CSS**

Run: `npm run build`  
Expected: Vite exits 0 and emits the production bundle without Tailwind or PostCSS errors.

- [ ] **Step 8: Commit full theme parity**

```powershell
git add tailwind.config.js src/index.css src/components src/config/__tests__/site.test.js
git commit -m "feat: apply semantic light and dark portfolio themes"
```

---

### Task 7: Asset Integrity, Regression Coverage, and Final Verification

**Files:**
- Modify: `src/config/__tests__/site.test.js`
- Modify: `src/components/__tests__/Certifications.test.jsx`
- Modify: `src/components/__tests__/Featured.test.jsx`
- Modify: `README.md`

**Interfaces:**
- Verification reads the final public asset URLs from configuration rather than maintaining a second manifest.
- README documents light-default behavior and the one-time preview regeneration command.

- [ ] **Step 1: Add final local-asset regression coverage**

Add:

```js
it('keeps all configured local portfolio assets present', () => {
  const urls = [
    ...site.certifications.flatMap((credential) => [
      credential.badge,
      credential.certificate,
      credential.certificatePreview,
    ]),
  ].filter(Boolean)

  for (const url of urls) {
    expect(fs.existsSync(publicFile(url)), `missing public asset: ${url}`).toBe(true)
  }
})
```

In `Featured.test.jsx`, import `featured` and assert every configured image begins with `/project-images/`. In `OtherAcademicProjects.test.jsx`, retain the four image accessibility assertions from Task 4.

- [ ] **Step 2: Run the regression tests**

Run: `npm test -- src/config/__tests__/site.test.js src/components/__tests__/Certifications.test.jsx src/components/__tests__/Featured.test.jsx src/components/__tests__/OtherAcademicProjects.test.jsx`  
Expected: all listed tests PASS.

- [ ] **Step 3: Document preview regeneration**

Add to `README.md`:

````markdown
## Credential previews

The portfolio serves sanitized certificate copies and first-page previews from
`public/credentials/`. Regenerate previews after replacing a source PDF:

```powershell
python -m pip install -r requirements-tools.txt
python scripts/render-credential-previews.py
```

Light mode is the default. The navigation toggle stores an explicit choice under
`portfolio-theme` in browser local storage.
````

- [ ] **Step 4: Run the full automated test suite**

Run: `npm test`  
Expected: Vitest reports 0 failed test files and 0 failed tests.

- [ ] **Step 5: Run the production build**

Run: `npm run build`  
Expected: Vite exits 0 and writes `dist/`.

- [ ] **Step 6: Check every configured public URL after build**

Run:

```powershell
@'
import fs from 'node:fs'
import { site } from './src/config/site.js'
import { featured } from './src/config/featured.js'
import { academicProjects } from './src/config/academicProjects.js'

const urls = [
  ...site.certifications.flatMap((item) => [item.badge, item.certificate, item.certificatePreview]),
  ...featured.map((item) => item.image),
  ...academicProjects.map((item) => item.image),
].filter(Boolean)

const missing = urls.filter((url) => !fs.existsSync(`public${url}`))
if (missing.length) {
  console.error(missing.join('\n'))
  process.exit(1)
}
console.log(`verified ${urls.length} configured assets`)
'@ | node
```

Expected: prints `verified 36 configured assets` and exits 0.

- [ ] **Step 7: Perform browser checks**

Run `npm run dev -- --host 127.0.0.1` and verify:

1. First visit is light even when the OS prefers dark.
2. Toggle changes every non-terminal surface and persists after refresh.
3. The mobile menu exposes the same toggle.
4. A Cisco credential visibly shows its badge and certificate preview at once.
5. A non-badge credential shows a full-width certificate preview.
6. Pagination shows two credentials per page and scrolls to `#certs`.
7. Current projects show supplied screenshots without distortion.
8. Other Academic Projects alternates on desktop and stacks screenshot-first on mobile.
9. Keyboard focus is visible on theme, pagination, project tabs, certificate links, and project links.
10. Reduced-motion mode disables reveal/tilt/background animations.

- [ ] **Step 8: List and remove obsolete unsafe public aliases**

First list the exact generated/public duplicates that have spaces, capitals, smart quotes, ampersands, or parentheses:

```powershell
$publicRoots = @(
  (Resolve-Path 'public/credentials/certificates').Path,
  (Resolve-Path 'public/project-images').Path
)
$unsafePublicFiles = foreach ($publicRoot in $publicRoots) {
  Get-ChildItem -LiteralPath $publicRoot -File |
    Where-Object { $_.Name -notmatch '^[a-z0-9.-]+$' }
}
$unsafePublicFiles | Select-Object FullName
```

Confirm every listed path is beneath one of the two resolved `publicRoots`, then remove only those public aliases. The source originals in `portfolio-credentials/` and `project-images/` remain untouched.

```powershell
$unsafePublicFiles | ForEach-Object { Remove-Item -LiteralPath $_.FullName -Force }
```

- [ ] **Step 9: Review the final diff for scope and unsafe filenames**

Run:

```powershell
git diff --check
git status --short
Get-ChildItem public/credentials,public/project-images -Recurse -File | Where-Object { $_.Name -notmatch '^[a-z0-9.-]+$' }
```

Expected: `git diff --check` has no errors; status contains only intended feature/design artifacts; the unsafe-filename command returns no public files.

- [ ] **Step 10: Commit verification documentation and remaining tests**

```powershell
git add README.md src/config/__tests__/site.test.js src/components/__tests__/Certifications.test.jsx src/components/__tests__/Featured.test.jsx src/components/__tests__/OtherAcademicProjects.test.jsx
git commit -m "test: verify portfolio evidence and theme behavior"
```

---

## Final Acceptance Checklist

- [ ] Light mode is the default with no stored preference.
- [ ] The dark toggle works on desktop and mobile and persists after refresh.
- [ ] Both themes meet readable contrast and retain the dark hero terminal.
- [ ] All 11 credentials use accurate titles, issuers, dates, descriptions, and URL-safe local files.
- [ ] Cisco credentials show a badge and actual certificate preview simultaneously.
- [ ] Certificate-only credentials display the preview at full evidence width.
- [ ] Two editorial credential panels appear per page.
- [ ] Seven current projects remain in the featured explorer.
- [ ] Four academic projects appear only in the alternating dedicated section.
- [ ] All supplied project screenshots selected by the spec render with specific alt text.
- [ ] Vitest and the Vite production build pass from a fresh command run.
- [ ] The final diff contains no unrelated edits or whitespace errors.
