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
