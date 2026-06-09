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
