import Section from './ui/Section.jsx'
import Button from './ui/Button.jsx'
import TiltCard from './ui/TiltCard.jsx'
import { featured } from '../config/featured.js'

export function Card({ p, live }) {
  const stars = live?.stargazers_count ?? 0
  return (
    <TiltCard className="surface flex h-full flex-col rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl text-ink">
          <i className={`fas ${p.icon}`} aria-hidden="true" />
        </span>
        {stars > 0 && (
          <span className="font-mono text-xs text-slate-400">
            <i className="fas fa-star text-amber" aria-hidden="true" /> {stars}
          </span>
        )}
      </div>
      <h3 className="font-display text-lg font-bold">
        <span className="font-mono text-amber">$ </span>{p.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-slate-400">{p.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span key={t} className="rounded-md border border-line bg-primary/5 px-2 py-0.5 font-mono text-xs text-accent">{t}</span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {p.demo && (
          <Button href={p.demo} variant="solid" icon="fas fa-play" trailingIcon="fas fa-arrow-up-right-from-square">
            Live Demo
          </Button>
        )}
        {p.source && (
          <Button href={p.source} variant="outline" icon="fab fa-github">
            Code
          </Button>
        )}
      </div>
    </TiltCard>
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
