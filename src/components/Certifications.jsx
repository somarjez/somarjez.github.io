import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import TiltCard from './ui/TiltCard.jsx'
import { site } from '../config/site.js'

export default function Certifications() {
  return (
    <Section id="certs" title="Certifications" subtitle="Verified coursework and credentials">
      <div className="grid gap-6 md:grid-cols-2">
        {site.certifications.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <TiltCard className="glass h-full rounded-xl">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                <i className={`fas ${c.icon} text-primary`} aria-hidden="true" />
                <span className="font-mono text-sm text-slate-300">
                  <span className="text-amber">$</span> {c.title}
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <span key={s} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
