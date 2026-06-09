import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import AnimatedCounter from './ui/AnimatedCounter.jsx'

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', Dart: '#00B4AB', Blade: '#f7523f',
  'Jupyter Notebook': '#DA5B0B', CSS: '#563d7c', Java: '#b07219',
}

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
            <div className="glass rounded-2xl p-6 text-center">
              <i className={`fas ${c.icon} mb-3 text-2xl text-primary`} />
              <div className="text-4xl font-extrabold">
                {loading ? '—' : <AnimatedCounter value={c.value} />}
              </div>
              <div className="mt-1 text-sm text-slate-400">{c.label}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {!loading && stats.languages.length > 0 && (
        <Reveal delay={0.1}>
          <div className="glass mt-8 rounded-2xl p-6">
            <h4 className="mb-4 font-semibold">Language Distribution</h4>
            <div className="flex h-4 overflow-hidden rounded-full">
              {stats.languages.map((l) => (
                <div
                  key={l.name}
                  title={`${l.name} · ${l.count}`}
                  style={{ width: `${(l.count / total) * 100}%`, background: LANG_COLORS[l.name] || '#64748b' }}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-400">
              {stats.languages.slice(0, 8).map((l) => (
                <span key={l.name} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[l.name] || '#64748b' }} />
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
