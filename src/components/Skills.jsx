import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import TiltCard from './ui/TiltCard.jsx'
import { site } from '../config/site.js'

const FILE = ['languages.json', 'frontend.tsx', 'backend.py', 'ml.ipynb', 'tools.sh']

export default function Skills() {
  return (
    <Section title="Skills & Technologies">
      <div className="grid gap-6 md:grid-cols-2">
        {site.skills.map((cat, i) => (
          <Reveal key={cat.title} delay={i * 0.05}>
            <TiltCard className="surface h-full rounded-xl">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                <i className={`fas ${cat.icon} text-primary`} aria-hidden="true" />
                <span className="font-mono text-sm text-slate-300">{FILE[i] || `${cat.title}.txt`}</span>
              </div>
              <div className="p-5">
                <h4 className="mb-3 text-sm font-semibold text-slate-200">{cat.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {cat.tags.map((t) => (
                    <span key={t} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                      {t}
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
