import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import AnimatedCounter from './ui/AnimatedCounter.jsx'

export default function GitHubStats({ stats, loading }) {
  const cards = [
    { label: 'Repositories', value: stats.totalRepos, icon: 'fa-folder' },
    { label: 'Total Stars', value: stats.totalStars, icon: 'fa-star' },
    { label: 'Languages', value: stats.languages.length, icon: 'fa-code' },
    { label: 'Years on GitHub', value: Math.max(1, stats.accountAgeYears), icon: 'fa-calendar' },
  ]

  return (
    <Section id="stats" title="GitHub at a glance" subtitle="Pulled live from the GitHub API.">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.05}>
            <div className="surface rounded-xl p-5">
              <div className="font-mono text-xs text-slate-500">
                <span className="text-amber">$</span> {c.label.toLowerCase().replace(/\s+/g, '_')}
              </div>
              <div className="mt-2 font-display text-3xl font-extrabold text-primary">
                {loading ? '—' : <AnimatedCounter value={c.value} />}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
