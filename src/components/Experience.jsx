import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function Experience() {
  return (
    <Section id="experience" title="Experience" subtitle="Campus support, freelance data and web work, and school immersion.">
      <ol className="relative ml-3 border-l border-line">
        {site.experience.map((job, i) => (
          <li key={`${job.role}-${job.period}`} className="relative pb-10 pl-6 last:pb-0 sm:pl-8">
            <span
              className="absolute -left-[8px] top-6 h-3.5 w-3.5 rounded-full border-2 border-primary bg-ink"
              aria-hidden="true"
            />
            <Reveal delay={Math.min(i, 3) * 0.05}>
              <article className="surface rounded-xl p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-bold text-foreground">{job.role}</h3>
                  <span className="font-mono text-xs text-primary">{job.period}</span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {job.org} <span className="text-subtle">· {job.type}</span>
                </p>
                <p className="mt-0.5 font-mono text-xs text-subtle">{job.location}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-pretty text-sm leading-relaxed text-muted marker:text-primary">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
