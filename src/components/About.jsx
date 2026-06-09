import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function About() {
  return (
    <Section id="about" title="About Me">
      <div className="grid items-center gap-10 md:grid-cols-[300px_1fr]">
        <Reveal className="mx-auto">
          <img
            src="/me.jpg"
            alt={site.name}
            onError={(e) => { e.currentTarget.style.display = 'none' }}
            className="h-64 w-64 rounded-2xl object-cover shadow-2xl ring-2 ring-primary/40"
          />
        </Reveal>
        <Reveal delay={0.1}>
          <h3 className="font-display text-2xl font-bold">
            Full-Stack & <span className="gradient-text">AI Developer</span>
          </h3>
          <p className="mt-4 text-slate-300">{site.bio}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {site.focus.map((f) => (
              <div key={f.label} className="glass rounded-xl p-4 text-center">
                <i className={`fas ${f.icon} text-lg text-accent`} aria-hidden="true" />
                <p className="mt-2 text-sm font-medium text-slate-200">{f.label}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-500">
            <i className="fas fa-graduation-cap mr-2 text-primary/70" aria-hidden="true" />
            {site.education.degree}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
