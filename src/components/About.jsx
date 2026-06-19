import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import Avatar from './ui/Avatar.jsx'
import { site } from '../config/site.js'

export default function About() {
  return (
    <Section id="about" title="About me" subtitle="A Computer Science student building toward data, web, project management, and AI.">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <Reveal>
          <div className="flex items-center gap-5">
            <Avatar
              src="/me.jpg"
              alt={site.name}
              initials="JR"
              className="h-20 w-20 shrink-0 rounded-2xl ring-2 ring-primary/30"
            />
            <div>
              <h3 className="font-display text-2xl font-bold text-slate-50">
                Hi! I&apos;m {site.name.split(' ')[0]} <span aria-hidden="true">👋</span>
              </h3>
              <p className="mt-1 flex items-center gap-2 font-mono text-sm text-primary">
                {site.role}
                <span className="inline-flex items-center gap-1.5 text-green">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green" />
                  available
                </span>
              </p>
            </div>
          </div>

          <p className="mt-6 max-w-[65ch] text-pretty leading-relaxed text-slate-300">
            {site.bio}
          </p>
          <p className="mt-6 font-mono text-sm text-slate-500">
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
                  <h3 className="font-display font-semibold text-slate-100">{f.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.blurb}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
