import { useState } from 'react'
import { useScrollSpy } from '../hooks/useScrollSpy.js'
import Logo from './ui/Logo.jsx'
import ThemeToggle from './ui/ThemeToggle.jsx'

const GROUPS = [
  { id: 'home', label: 'Home', links: [['home', 'Overview']] },
  { id: 'about', label: 'About', links: [['about', 'About'], ['skills', 'Skills']] },
  { id: 'projects', label: 'Work', links: [['projects', 'Featured projects'], ['academic-projects', 'Academic projects'], ['github', 'GitHub'], ['orgs', 'Organizations']] },
  { id: 'certs', label: 'Credentials', links: [['certs', 'Certifications']] },
  { id: 'contact', label: 'Contact', links: [['contact', 'Contact']] },
]
const LINK_IDS = GROUPS.flatMap((group) => group.links.map(([id]) => id))

export default function Nav({ onOpenPalette, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(null)
  const active = useScrollSpy(LINK_IDS)

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="glass fixed inset-x-0 top-0 z-50 border-b border-line px-5 py-2.5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <button onClick={() => go('home')} aria-label="Home" className="flex items-center gap-2.5 font-mono text-sm text-muted">
          <Logo size={30} />
          <span className="font-semibold text-foreground">jezreel</span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {GROUPS.map((group) => group.links.length === 1 ? (
            <button key={group.id} onClick={() => go(group.links[0][0])} className={`rounded-md px-2.5 py-1 font-mono text-sm transition-colors ${active === group.links[0][0] ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground'}`}>
              {group.label}
            </button>
          ) : (
            <div key={group.id} className="relative" onMouseLeave={() => setOpenGroup((value) => (value === group.id ? null : value))}>
              <button onClick={() => setOpenGroup((value) => (value === group.id ? null : group.id))} aria-expanded={openGroup === group.id} aria-haspopup="true" className={`rounded-md px-2.5 py-1 font-mono text-sm transition-colors ${group.links.some(([id]) => active === id) ? 'bg-primary/10 text-primary' : 'text-muted hover:text-foreground'}`}>
                {group.label} <i className="fas fa-chevron-down ml-1 text-[10px]" aria-hidden="true" />
              </button>
              {openGroup === group.id && <div className="absolute left-0 top-full mt-2 w-52 rounded-lg border border-line bg-panel p-1.5 shadow-xl">
                {group.links.map(([id, label]) => <button key={id} onClick={() => { setOpenGroup(null); go(id) }} className="block w-full rounded-md px-3 py-2 text-left font-mono text-xs text-muted hover:bg-panel-2 hover:text-primary">{label}</button>)}
              </div>}
            </div>
          ))}
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={onOpenPalette}
            className="ml-2 flex items-center gap-1.5 rounded-md border border-line px-2 py-1 font-mono text-xs text-muted hover:border-primary/50 hover:text-primary"
            aria-label="Open command palette"
          >
            <span>⌘K</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button className="text-xl text-muted" onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu">
            <i className={`fas ${open ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="mt-3 flex flex-col gap-2 md:hidden">
          {GROUPS.map((group) => (
            <div key={group.id} className="border-b border-line pb-2">
              {group.links.length === 1 ? <button onClick={() => go(group.links[0][0])} className="text-left font-mono text-sm text-foreground">{group.label}</button> : <>
                <div className="mb-1 font-mono text-xs uppercase tracking-widest text-subtle">{group.label}</div>
                <div className="grid gap-1 pl-2">{group.links.map(([id, label]) => <button key={id} onClick={() => go(id)} className="text-left font-mono text-sm text-foreground">{label}</button>)}</div>
              </>}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
