import { motion, useReducedMotion } from 'framer-motion'
import { site } from '../config/site.js'
import TerminalWindow from './ui/TerminalWindow.jsx'
import Avatar from './ui/Avatar.jsx'
import { useTypewriter } from '../hooks/useTypewriter.js'
import { langColor } from '../lib/langColors.js'

const EASE_OUT = [0.22, 1, 0.36, 1]

function LangBars({ languages }) {
  const reduce = useReducedMotion()
  const top = languages.slice(0, 5)
  const max = top[0]?.count || 1

  return (
    <div className="mt-3 space-y-2">
      {top.map((l, i) => (
        <div key={l.name} className="flex items-center gap-3 font-mono text-xs">
          <span className="w-24 shrink-0 truncate text-slate-300">{l.name}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/70">
            <motion.div
              className="h-full rounded-full"
              style={{ width: `${(l.count / max) * 100}%`, background: langColor(l.name), transformOrigin: 'left' }}
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 + i * 0.08 }}
            />
          </div>
          <span className="w-6 text-right tabular-nums text-slate-500">{l.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function Hero({ stats, loading }) {
  const reduce = useReducedMotion()
  const first = site.name.split(' ')[0]
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
  const { text, done } = useTypewriter(lines)
  const showData = done && !loading && stats.languages.length > 0

  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-5 py-28">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className="w-full max-w-3xl"
      >
        <TerminalWindow title="jezreel@portfolio: ~">
          {/* Personal intro header */}
          <div className="mb-5 flex items-center gap-4 border-b border-line pb-5">
            <Avatar
              src="/me.jpg"
              alt={site.name}
              initials="JR"
              className="h-16 w-16 shrink-0 rounded-xl ring-2 ring-primary/30"
            />
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold text-slate-50">
                Hi! I&apos;m {first} <span aria-hidden="true">👋</span>
                <span className="sr-only">. {site.name}, {site.roles.join(', ')}.</span>
              </h1>
              <p className="mt-1 text-pretty text-sm leading-relaxed text-slate-400">
                {site.tagline}
              </p>
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

          {/* Live analytics: show the data-analyst identity with real GitHub data */}
          <motion.div
            className="mt-5 border-t border-line pt-4"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: done ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
          >
            <div className="font-mono text-xs text-slate-500">
              <span className="text-amber">$</span> analyze ./github --languages
            </div>

            {loading && <div className="mt-3 font-mono text-xs text-slate-600">fetching live data…</div>}
            {showData && <LangBars languages={stats.languages} />}

            {!loading && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs text-slate-500">
                <span><span className="text-slate-300 tabular-nums">{stats.totalRepos}</span> repos</span>
                <span><span className="text-slate-300 tabular-nums">{stats.totalStars}</span> stars</span>
                <span><span className="text-slate-300 tabular-nums">{stats.languages.length}</span> languages</span>
                <span><span className="text-slate-300 tabular-nums">{Math.max(1, stats.accountAgeYears)}</span>y on GitHub</span>
              </div>
            )}
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-3 font-sans">
            <a href="#projects" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]">
              <span className="font-mono">./view-projects</span>
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
