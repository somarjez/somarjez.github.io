import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function About() {
  return (
    <Section id="about" title="About me" subtitle="A fourth-year Computer Science student building toward data, web, project management, and AI.">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <p className="max-w-[65ch] text-pretty text-lg leading-relaxed text-muted">
            {site.bio}
          </p>
          <p className="mt-6 font-mono text-sm text-muted">
            <span className="text-amber">$</span> {site.education.degree}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="divide-y divide-line">
            {site.focus.map((f) => (
              <li key={f.label} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <i className={`fas ${f.icon}`} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display font-semibold text-foreground">{f.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{f.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
