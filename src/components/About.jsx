import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import { site } from '../config/site.js'

export default function About() {
  return (
    <Section id="about" title="About Me">
      <div className="grid items-start gap-10 md:grid-cols-[1fr_360px]">
        <Reveal>
          <h3 className="font-display text-2xl font-bold">
            Full-Stack & <span className="gradient-text">AI Developer</span>
          </h3>
          <p className="mt-4 text-slate-300">{site.bio}</p>
          <p className="mt-5 font-mono text-sm text-slate-500">
            <span className="text-amber">$</span> {site.education.degree}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="term-window">
            <div className="flex items-center gap-2 border-b border-line bg-panel-2/60 px-4 py-2.5">
              <span className="h-3 w-3 rounded-full bg-[#f7768e]" />
              <span className="h-3 w-3 rounded-full bg-[#e0af68]" />
              <span className="h-3 w-3 rounded-full bg-[#9ece6a]" />
              <span className="ml-3 font-mono text-xs text-slate-500">focus.config</span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-sm leading-7">
              <span className="text-slate-500"># core focus areas</span>{'\n'}
              {site.focus.map((f) => (
                <span key={f.label}>
                  <span className="text-primary">focus</span>
                  <span className="text-slate-500"> = </span>
                  <span className="text-green">"</span>
                  <span className="text-green">{f.label}</span>
                  <span className="text-green">"</span>{'\n'}
                </span>
              ))}
            </pre>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
