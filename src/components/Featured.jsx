import { useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Section from './ui/Section.jsx'
import Button from './ui/Button.jsx'
import { featured, categoryStyle } from '../config/featured.js'

const EASE_OUT = [0.22, 1, 0.36, 1]

function CategoryTag({ category }) {
  const s = categoryStyle[category] || categoryStyle.Web
  return (
    <span className={`rounded-md border px-2 py-0.5 font-mono text-[11px] ${s.ring} ${s.text}`}>
      {category}
    </span>
  )
}

export function ProjectDetail({ project, live }) {
  const stars = live?.stargazers_count ?? 0
  return (
    <div>
      {/* Project screenshot */}
      {project.image && (
        <div className="mb-6 overflow-hidden rounded-xl border border-line shadow-sm">
          <img
            src={project.image}
            alt={`${project.title} project screenshot`}
            className="h-48 w-full object-cover object-top transition-transform duration-500 hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl text-primary">
            <i className={`fas ${project.icon}`} aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">{project.title}</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <CategoryTag category={project.category} />
              {project.thesis && (
                <span className="rounded-md border border-amber/40 bg-amber/10 px-2 py-0.5 font-mono text-[11px] text-amber">
                  thesis
                </span>
              )}
            </div>
          </div>
        </div>
        {stars > 0 && (
          <span className="shrink-0 font-mono text-xs text-muted">
            <i className="fas fa-star text-amber" aria-hidden="true" /> {stars}
          </span>
        )}
      </div>

      <p className="mt-5 max-w-[65ch] text-pretty leading-relaxed text-muted">{project.description}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.demo && (
          <Button href={project.demo} variant="solid" icon="fas fa-play" trailingIcon="fas fa-arrow-up-right-from-square">
            Live Demo
          </Button>
        )}
        {project.source && (
          <Button href={project.source} variant="outline" icon="fab fa-github">
            Code
          </Button>
        )}
      </div>
    </div>
  )
}

export default function Featured({ repos }) {
  const byName = Object.fromEntries((repos || []).map((r) => [r.name.toLowerCase(), r]))
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const reduce = useReducedMotion()

  const project = featured[active]
  const live = project.repo ? byName[project.repo] : null

  const selectProject = (index) => {
    setActive(index)
    tabRefs.current[index]?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      selectProject((active + 1) % featured.length)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      selectProject((active - 1 + featured.length) % featured.length)
    } else if (e.key === 'Home') {
      e.preventDefault()
      selectProject(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      selectProject(featured.length - 1)
    }
  }

  return (
    <Section id="projects" title="Featured projects" subtitle="Academic and team work. Pick one to read the details.">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        <div
          role="tablist"
          aria-label="Featured projects"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="surface h-fit overflow-hidden rounded-xl"
        >
          <div className="border-b border-line px-4 py-2.5 font-mono text-xs text-muted">
            <span className="text-amber">$</span> ls ~/projects{' '}
            <span className="text-subtle">({featured.length})</span>
          </div>
          <ul className="max-h-[460px] overflow-y-auto p-1.5">
            {featured.map((p, i) => {
              const selected = i === active
              const s = categoryStyle[p.category] || categoryStyle.Web
              return (
                <li key={p.slug}>
                  <button
                    role="tab"
                    id={`proj-tab-${p.slug}`}
                    aria-selected={selected}
                    aria-controls="proj-panel"
                    tabIndex={selected ? 0 : -1}
                    ref={(node) => { tabRefs.current[i] = node }}
                    onClick={() => selectProject(i)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left font-mono text-sm transition-colors ${
                      selected ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-panel-2 hover:text-foreground'
                    }`}
                  >
                    <span className={`w-2 text-center ${selected ? 'text-primary' : 'text-transparent'}`}>›</span>
                    <span className="flex-1 truncate">{p.slug}</span>
                    <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        <div id="proj-panel" role="tabpanel" aria-labelledby={`proj-tab-${project.slug}`} className="surface rounded-xl p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
            >
              <ProjectDetail project={project} live={live} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  )
}
