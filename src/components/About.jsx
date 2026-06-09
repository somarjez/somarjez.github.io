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
          <h3 className="text-2xl font-bold">
            Computer Science Student & <span className="gradient-text">Developer</span>
          </h3>
          <p className="mt-4 text-slate-300">{site.bio}</p>
          <div className="glass mt-6 rounded-xl p-5">
            <h4 className="font-semibold text-primary">
              <i className="fas fa-graduation-cap mr-2" />
              {site.education.degree}
              <span className="ml-2 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                {site.education.year}
              </span>
            </h4>
            <p className="mt-2 text-sm text-slate-400">{site.education.detail}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
