import { useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import Logo from './ui/Logo.jsx'
import ThemeToggle from './ui/ThemeToggle.jsx'

const LINKS = [
  ['home', 'home'],
  ['about', 'about'],
  ['certs', 'certs'],
  ['projects', 'projects'],
  ['github', 'github'],
  ['orgs', 'orgs'],
  ['contact', 'contact'],
]
const LINK_IDS = LINKS.map(([id]) => id)

export default function Nav({ onOpenPalette, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(LINK_IDS)

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="glass fixed inset-x-0 top-0 z-50 border-b border-line px-5 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button onClick={() => go('home')} aria-label="Home" className="flex items-center gap-2.5 font-mono text-sm text-slate-500">
          <Logo size={30} />
          <span className="font-semibold text-slate-700">jezreel</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`rounded-md px-2.5 py-1 font-mono text-sm transition-colors ${
                active === id ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {label}
            </button>
          ))}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={onOpenPalette}
            className="ml-2 flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-xs text-slate-500 hover:border-primary/50 hover:text-primary"
            aria-label="Open command palette"
          >
            <span>⌘K</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="text-xl text-slate-600" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
            <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="mt-3 flex flex-col gap-2 md:hidden">
          {LINKS.map(([id, label]) => (
            <button key={id} onClick={() => go(id)} className="text-left font-mono text-sm text-slate-700">
              {label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
}
