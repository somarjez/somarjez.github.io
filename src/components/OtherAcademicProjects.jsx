import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { academicProjects } from '../config/academicProjects.js'

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
              <div className="surface overflow-hidden rounded-2xl">
                <img
                  src={project.image}
                  alt={`${project.title} project screenshot`}
                  className="aspect-video h-full w-full object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
              </div>
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
