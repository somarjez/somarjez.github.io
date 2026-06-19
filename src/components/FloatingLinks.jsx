import { site } from '../config/site.js'

const LINKS = [
  { label: 'GitHub', href: site.links.github, icon: 'fab fa-github' },
  { label: 'LinkedIn', href: site.links.linkedin, icon: 'fab fa-linkedin-in' },
  { label: 'Resume', href: site.links.resume, icon: 'fas fa-file-lines' },
]

export default function FloatingLinks() {
  return (
    <>
      {/* Desktop: vertical dock pinned to the right edge */}
      <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={l.label}
            className="group relative grid h-11 w-11 place-items-center rounded-full surface text-slate-300 shadow-lg transition-colors hover:border-primary/60 hover:text-primary"
          >
            <i className={l.icon} aria-hidden="true" />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md surface px-2 py-1 font-mono text-xs text-slate-200 opacity-0 transition-opacity group-hover:opacity-100">
              {l.label}
            </span>
          </a>
        ))}
      </div>

      {/* Mobile: compact cluster bottom-right */}
      <div className="fixed bottom-4 right-4 z-40 flex gap-2 md:hidden">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            aria-label={l.label}
            className="grid h-11 w-11 place-items-center rounded-full surface text-slate-300 shadow-lg transition-colors hover:text-primary"
          >
            <i className={l.icon} aria-hidden="true" />
          </a>
        ))}
      </div>
    </>
  )
}
