import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { site } from '../config/site.js'

const LINKS = [
  { label: 'GitHub', href: site.links.github, icon: 'fab fa-github' },
  { label: 'LinkedIn', href: site.links.linkedin, icon: 'fab fa-linkedin-in' },
  { label: 'Email', href: `mailto:${site.links.email}`, icon: 'fas fa-envelope', mail: true },
  { label: 'Resume', href: site.links.resume, icon: 'fas fa-file-lines' },
]

const CYCLE_MS = 1800

function linkProps(l) {
  return l.mail
    ? { href: l.href, 'aria-label': l.label }
    : { href: l.href, target: '_blank', rel: 'noreferrer', 'aria-label': l.label }
}

const base =
  'grid h-12 w-12 place-items-center rounded-full text-base transition-all duration-200 ' +
  'border border-primary/30 bg-panel/90 text-muted shadow-md ' +
  'backdrop-blur hover:bg-primary hover:text-black hover:shadow-lg hover:scale-110 dark:hover:text-white'

export default function FloatingLinks() {
  const reduce = useReducedMotion()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return undefined
    const id = setInterval(() => setActiveIndex((i) => (i + 1) % LINKS.length), CYCLE_MS)
    return () => clearInterval(id)
  }, [reduce, paused])

  const showAuto = !reduce && !paused

  return (
    <>
      {/* Desktop: vertical dock pinned to the right edge */}
      <div
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3.5 md:flex"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {LINKS.map((l, i) => {
          const isAuto = showAuto && i === activeIndex
          return (
            <a
              key={l.label}
              {...linkProps(l)}
              className={`group relative ${base} ${isAuto ? 'scale-110 border-primary bg-primary text-black shadow-lg dark:text-white' : ''}`}
            >
              <i className={l.icon} aria-hidden="true" />
              <span
                className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md border border-line bg-panel px-2.5 py-1 font-mono text-xs text-foreground shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${isAuto ? 'opacity-100' : 'opacity-0'}`}
              >
                {l.label}
              </span>
            </a>
          )
        })}
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
