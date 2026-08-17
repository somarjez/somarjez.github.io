import { useState } from 'react'
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { academicProjects } from '../config/academicProjects.js'
import Lightbox from './ui/Lightbox.jsx'

function ProjectImage({ project }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="surface overflow-hidden rounded-2xl">
        <button type="button" onClick={() => setOpen(true)} aria-label={`View full ${project.title} screenshot`} className="group block w-full cursor-zoom-in p-3 text-left">
          <img src={project.image} alt={`${project.title} project screenshot`} className="max-h-[30rem] w-full object-contain transition-transform duration-500 group-hover:scale-[1.01]" loading="lazy" decoding="async" />
          <span className="mt-2 block text-center font-mono text-xs text-muted">View full image</span>
        </button>
      </div>
      <Lightbox open={open} title={project.title} src={project.image} alt={`${project.title} full screenshot`} onClose={() => setOpen(false)} />
    </>
  )
}

export default function OtherAcademicProjects() {
  return (
    <Section
      id="academic-projects"
      title="Other Academic Projects"
      subtitle="Foundational work across web design, desktop NLP, systems simulation, and browser games."
    >
      <div className="space-y-14">
        {academicProjects.map((project, index) => (
          <Reveal key={project.slug}>
            <article className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${index % 2 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <ProjectImage project={project} />
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">{project.category}</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-foreground">{project.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-muted">{project.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((technology) => (
                    <span key={technology} className="rounded-md border border-line bg-panel-2 px-2.5 py-1 font-mono text-xs text-accent">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
