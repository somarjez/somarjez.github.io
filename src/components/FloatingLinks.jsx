import { site } from '../config/site.js'

const LINKS = [
  { label: 'GitHub', href: site.links.github, icon: 'fab fa-github' },
  { label: 'LinkedIn', href: site.links.linkedin, icon: 'fab fa-linkedin-in' },
  { label: 'Email', href: `mailto:${site.links.email}`, icon: 'fas fa-envelope', mail: true },
  { label: 'Resume', href: site.links.resume, icon: 'fas fa-file-lines' },
]

function linkProps(l) {
  return l.mail
    ? { href: l.href, 'aria-label': l.label }
    : { href: l.href, target: '_blank', rel: 'noreferrer', 'aria-label': l.label }
}

const base =
  'grid h-12 w-12 place-items-center rounded-full text-base transition-all duration-200 ' +
  'border border-primary/30 bg-panel/90 text-muted shadow-md ' +
  'backdrop-blur hover:bg-primary hover:text-ink hover:shadow-lg hover:scale-110'

export default function FloatingLinks() {
  return (
    <>
      {/* Desktop: vertical dock pinned to the right edge */}
      <div className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3.5 md:flex">
        {LINKS.map((l) => (
          <a key={l.label} {...linkProps(l)} className={`group relative ${base}`}>
            <i className={l.icon} aria-hidden="true" />
            <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {l.label}
            </span>
          </a>
        ))}
      </div>

      {/* Mobile: cluster bottom-right */}
      <div className="fixed bottom-5 right-5 z-40 flex gap-2.5 md:hidden">
        {LINKS.map((l) => (
          <a key={l.label} {...linkProps(l)} className={base}>
            <i className={l.icon} aria-hidden="true" />
          </a>
        ))}
      </div>
    </>
  )
}
