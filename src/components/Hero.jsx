import { motion } from 'framer-motion'
import { site } from '../config/site.js'

export default function Hero({ stats, loading }) {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center px-5 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
          Available for opportunities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl font-extrabold md:text-7xl"
        >
          <span className="gradient-text">{site.name}</span>
        </motion.h1>

        <p className="mt-4 font-display text-xl text-slate-200 md:text-2xl">{site.role}</p>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-accent/80">{site.roleSub}</p>
        <p className="mx-auto mt-5 max-w-2xl text-slate-400">{site.hero}</p>

        {!loading && (
          <div className="mt-6 font-mono text-sm text-primary">
            {stats.totalRepos} repositories · {stats.totalStars} stars · {stats.languages.length} languages
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href="#projects" className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-ink transition-transform hover:scale-105">
            <i className="fas fa-rocket mr-2" aria-hidden="true" /> Explore My Work
          </a>
          <a href="#contact" className="glass rounded-full px-6 py-3 font-semibold transition-transform hover:scale-105">
            <i className="fas fa-paper-plane mr-2" aria-hidden="true" /> Let's Collaborate
          </a>
        </div>
      </div>
    </section>
  )
}
