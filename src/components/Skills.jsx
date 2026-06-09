import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function Skills() {
  return (
    <Section title="Skills & Technologies">
      <div className="grid gap-6 md:grid-cols-2">
        {site.skills.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.05}>
            <div className="glass h-full rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-3 font-semibold">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-darker">
                  <i className={`fas ${cat.icon}`} />
                </span>
                {cat.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {cat.tags.map((t) => (
                  <span key={t} className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
