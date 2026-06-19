import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { site } from '../config/site.js'
import { featured } from '../config/featured.js'
import TerminalWindow from './ui/TerminalWindow.jsx'
import Avatar from './ui/Avatar.jsx'
import { useTypewriter } from '../hooks/useTypewriter.js'

const EASE_OUT = [0.22, 1, 0.36, 1]

const STACK_COLOR = {
  Python: '#4b8bbe', 'Machine Learning': '#bb9af7', Jupyter: '#f37726', Flask: '#9ece6a',
  Django: '#2dd4a7', React: '#61dafb', JavaScript: '#f1e05a', TypeScript: '#3178c6',
  HTML: '#e34c26', Flutter: '#54c5f8', Dart: '#00b4ab', Firebase: '#ffca28',
  MySQL: '#6c9bd1', PostgreSQL: '#7aa6d6', Laravel: '#ff5a45',
}
const stackColor = (name) => STACK_COLOR[name] || '#7dcfff'

function StackBars({ items }) {
  const reduce = useReducedMotion()
  const max = items[0]?.count || 1
  return (
    <div className="mt-2 space-y-1.5">
      {items.map((s, i) => (
        <div key={s.name} className="flex items-center gap-3 font-mono text-xs">
          <span className="w-28 shrink-0 truncate text-slate-300">{s.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/70">
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${(s.count / max) * 100}%`, background: stackColor(s.name), transformOrigin: 'left' }}
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.06 }}
            />
          </div>
          <span className="w-4 shrink-0 text-right tabular-nums text-slate-500">{s.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function Hero({ stats, loading }) {
  const reduce = useReducedMotion()
  const first = site.name.split(' ')[0]

  const { languages, stackBars, stackAlso } = useMemo(() => {
    const LANGS = new Set(['Python', 'JavaScript', 'TypeScript', 'Dart', 'Java', 'C#', 'HTML', 'SQL'])
    const counts = {}
    for (const p of featured) {
      for (const raw of p.tech) {
        const t = raw === 'Django REST' ? 'Django' : raw
        counts[t] = (counts[t] || 0) + 1
      }
    }
    const ranked = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    const stack = ranked.filter((s) => !LANGS.has(s.name))
    return {
      languages: ranked.filter((s) => LANGS.has(s.name)),
      stackBars: stack.filter((s) => s.count >= 2),
      stackAlso: stack.filter((s) => s.count < 2).map((s) => s.name),
    }
  }, [])

  const lines = [
    '$ cat interests.txt',
    `> ${site.roles.join(' · ')}`,
    '$ cat stack.txt',
    `> ${site.stack.join(' · ')}`,
    '$ cat now.txt',
    '> building OSCA-AgeSense, our ML thesis 🧠',
    '$ status --now',
    `> open to internships & collaboration · ${site.location}`,
  ]
  const { text, done } = useTypewriter(lines, { speed: 14, linePause: 55, chunk: 3 })

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-5 py-28">
      <div className="w-full max-w-5xl">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
          {/* Window A — intro + session */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="lg:z-10 lg:w-[56%]"
          >
            <TerminalWindow title="jezreel@portfolio: ~">
              <div className="mb-5 flex items-center gap-4 border-b border-line pb-5">
                <Avatar
                  src="/me2.webp"
                  alt={site.name}
                  initials="JR"
                  className="h-20 w-20 shrink-0 rounded-2xl ring-2 ring-primary/40"
                />
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-bold leading-tight text-slate-50">
                    Hi! I&apos;m <span className="text-primary">{first}</span> <span aria-hidden="true">👋</span>
                    <span className="sr-only">. {site.name}, {site.roles.join(', ')}.</span>
                  </h1>
                  <p className="mt-1.5 text-pretty text-sm leading-relaxed text-slate-400">{site.tagline}</p>
                </div>
              </div>

              <pre className="whitespace-pre-wrap break-words text-slate-200">
                {text.split('\n').map((ln, i) => (
                  <span key={i} className={ln.startsWith('>') ? 'text-primary' : 'text-green'}>
                    {ln + '\n'}
                  </span>
                ))}
                {!done && <span className="term-cursor">&nbsp;</span>}
              </pre>

              <div className="mt-6 flex flex-wrap gap-3 font-sans">
                <a href="#projects" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]">
                  <span className="font-mono">./view-projects</span>
                </a>
                <a href="#contact" className="rounded-lg border border-line bg-panel/40 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-primary/60 hover:text-white">
                  <span className="font-mono">./contact</span>
                </a>
              </div>
            </TerminalWindow>
          </motion.div>

          {/* Window B — analytics, staggered + overlapping */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.12 }}
            className="lg:z-20 lg:-ml-8 lg:mt-20 lg:w-[52%]"
          >
            <TerminalWindow title="~/analytics" className="shadow-2xl ring-1 ring-white/5">
              <div className="font-mono text-xs text-slate-500">
                <span className="text-amber">$</span> analyze ./projects --languages
              </div>
              <StackBars items={languages} />

              <div className="mt-4 font-mono text-xs text-slate-500">
                <span className="text-amber">$</span> analyze ./projects --stack
              </div>
              <StackBars items={stackBars} />

              {stackAlso.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-slate-500">
                  <span className="text-slate-600">also:</span>
                  {stackAlso.map((name) => (
                    <span key={name} className="rounded border border-line px-1.5 py-0.5 text-slate-400">{name}</span>
                  ))}
                </div>
              )}

              {!loading && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4 font-mono text-xs text-slate-500">
                  <span><span className="text-slate-200 tabular-nums">{stats.totalRepos}</span> repos</span>
                  <span><span className="text-slate-200 tabular-nums">{stats.totalStars}</span> stars</span>
                  <span><span className="text-slate-200 tabular-nums">{featured.length}</span> featured</span>
                  <span><span className="text-slate-200 tabular-nums">{Math.max(1, stats.accountAgeYears)}</span>y on GitHub</span>
                </div>
              )}
            </TerminalWindow>
          </motion.div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          press <kbd className="rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-slate-300">⌘K</kbd> to navigate
        </p>
      </div>
    </section>
  )
}
