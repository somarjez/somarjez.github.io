import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import AnimatedCounter from './ui/AnimatedCounter.jsx'
import { langColor } from '../lib/langColors.js'

export default function GitHubStats({ stats, loading }) {
  const cards = [
    { label: 'Repositories', value: stats.totalRepos, icon: 'fa-folder' },
    { label: 'Total Stars', value: stats.totalStars, icon: 'fa-star' },
    { label: 'Languages', value: stats.languages.length, icon: 'fa-code' },
    { label: 'Years on GitHub', value: Math.max(1, stats.accountAgeYears), icon: 'fa-calendar' },
  ]
  const total = stats.languages.reduce((s, l) => s + l.count, 0) || 1

  return (
    <Section id="stats" title="GitHub at a Glance" subtitle="Pulled live from the GitHub API">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.05}>
            <div className="glass rounded-xl p-5">
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

      {!loading && stats.languages.length > 0 && (
        <Reveal delay={0.1}>
          <div className="glass mt-8 rounded-xl p-6">
            <h4 className="mb-4 font-mono text-sm text-slate-300"># language_distribution</h4>
            <div className="flex h-4 overflow-hidden rounded-full">
              {stats.languages.map((l) => (
                <div
                  key={l.name}
                  title={`${l.name} · ${l.count}`}
                  style={{ width: `${(l.count / total) * 100}%`, background: langColor(l.name) }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
              {stats.languages.slice(0, 8).map((l) => (
                <span key={l.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(l.name) }} />
                  {l.name} ({l.count})
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
