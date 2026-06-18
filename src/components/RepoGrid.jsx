import { useMemo, useState } from 'react'
import Section from './ui/Section.jsx'
import RepoCard from './RepoCard.jsx'
import { filterSortRepos } from '../lib/repoFilter.js'

export default function RepoGrid({ repos, loading, error }) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState('recent')

  const languages = useMemo(() => {
    const set = new Set(repos.map((r) => r.language).filter(Boolean))
    return ['all', ...[...set].sort()]
  }, [repos])

  const shown = useMemo(
    () => filterSortRepos(repos, { search, language, sort }),
    [repos, search, language, sort],
  )

  return (
    <Section id="repos" title="All Repositories" subtitle={loading ? 'Live from GitHub' : `${repos.length} public repositories, live from GitHub`}>
      {error && (
        <p className="glass rounded-xl p-6 text-center text-slate-300">
          Live GitHub data is unavailable right now.{' '}
          <a className="text-primary underline" href="https://github.com/somarjez?tab=repositories" target="_blank" rel="noreferrer">
            View repositories on GitHub →
          </a>
        </p>
      )}

      {!error && (
        <>
          <div className="mb-4 font-mono text-sm text-slate-500">
            <span className="text-amber">$</span> ls ./projects{' '}
            {language !== 'all' && <span className="text-primary">--lang={language}</span>}
          </div>
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repositories…"
                aria-label="Search repositories"
                className="glass w-full rounded-lg py-2.5 pl-11 pr-4 font-mono text-sm outline-none focus:border-primary/60"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort repositories"
              className="glass rounded-lg px-4 py-2.5 font-mono text-sm outline-none"
            >
              <option value="recent">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                aria-pressed={language === l}
                className={`rounded-md px-3 py-1 font-mono text-xs transition-colors ${
                  language === l ? 'bg-primary text-ink' : 'glass text-slate-300 hover:text-primary'
                }`}
              >
                {l === 'all' ? 'All' : l}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass h-40 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <p className="text-center text-slate-400">No repositories match your filters.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((r) => (
                <RepoCard key={r.id} repo={r} />
              ))}
            </div>
          )}
        </>
      )}
    </Section>
  )
}
