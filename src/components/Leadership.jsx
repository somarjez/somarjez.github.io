import { site } from '../config/site.js'
import Reveal from './ui/Reveal.jsx'
import Section from './ui/Section.jsx'

export default function Leadership() {
  return (
    <Section
      id="leadership"
      title="Leadership & Service"
      subtitle="Campus governance, community stewardship, and team leadership."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {site.leadership.map((group, index) => (
          <Reveal key={group.org} delay={index * 0.08} className="h-full">
            <article className="surface h-full overflow-hidden rounded-xl">
              <header className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-xl text-primary">
                  <i className={`fas ${group.icon}`} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-accent">{group.category}</p>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground">{group.org}</h3>
                </div>
              </header>

              {group.distinction && (
                <div className="mx-5 mt-5 rounded-lg border border-amber/30 bg-amber/10 p-4 sm:mx-6">
                  <div className="flex gap-3">
                    <i className="fas fa-award mt-0.5 text-amber" aria-hidden="true" />
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-amber">Academic distinction</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{group.distinction}</p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="divide-y divide-line px-5 sm:px-6">
                {group.roles.map((role) => (
                  <li key={`${role.title}-${role.period}`} className="py-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h4 className="font-display font-bold text-foreground">{role.title}</h4>
                      <span className="font-mono text-xs text-primary">{role.period}</span>
                    </div>
                    {role.unit && <p className="mt-1 text-sm leading-relaxed text-muted">{role.unit}</p>}
                    {role.achievement && (
                      <p className="mt-3 flex items-center gap-2 text-sm font-medium text-amber">
                        <i className="fas fa-medal" aria-hidden="true" />
                        {role.achievement}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
