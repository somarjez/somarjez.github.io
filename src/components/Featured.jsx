import { motion } from 'framer-motion'
import Section from './ui/Section.jsx'
import { featured } from '../config/featured.js'

function Card({ p, live }) {
  const stars = live?.stargazers_count ?? 0
  return (
    <motion.div
      whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      className="glass flex h-full flex-col rounded-2xl p-6"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl text-darker">
          <i className={`fas ${p.icon}`} />
        </span>
        <div className="flex gap-3 text-slate-300">
          {p.source && (
            <a href={p.source} target="_blank" rel="noreferrer" title="Source" className="hover:text-primary">
              <i className="fab fa-github" />
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer" title="Demo" className="hover:text-primary">
              <i className="fas fa-play" />
            </a>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold">{p.title}</h3>
      <p className="mt-2 flex-1 text-sm text-slate-400">{p.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span key={t} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">{t}</span>
        ))}
      </div>
      {stars > 0 && (
        <div className="mt-3 text-xs text-slate-500">
          <i className="fas fa-star text-yellow-400" /> {stars}
        </div>
      )}
    </motion.div>
  )
}

export default function Featured({ repos }) {
  const byName = Object.fromEntries((repos || []).map((r) => [r.name.toLowerCase(), r]))
  return (
    <Section id="projects" title="Featured Projects" subtitle="Selected work worth a closer look">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <Card key={p.title} p={p} live={p.repo ? byName[p.repo] : null} />
        ))}
      </div>
    </Section>
  )
}
