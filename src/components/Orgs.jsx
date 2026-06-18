import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'

export default function Orgs({ orgs }) {
  if (!orgs || orgs.length === 0) return null
  return (
    <Section id="orgs" title="Organizations" subtitle="Communities and teams I'm part of">
      <div className="flex flex-wrap justify-center gap-6">
        {orgs.map((o, i) => (
          <Reveal key={o.id} delay={i * 0.05}>
            <a
              href={`https://github.com/${o.login}`}
              target="_blank"
              rel="noreferrer"
              className="glass flex flex-col items-center gap-3 rounded-xl border border-line p-6 transition-transform hover:-translate-y-1"
            >
              <img src={o.avatar_url} alt={o.login} className="h-16 w-16 rounded-xl" />
              <span className="font-mono text-sm text-slate-300">{o.login}</span>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
