import { useMemo, useState } from 'react'
import Section from './ui/Section.jsx'
import RepoCard from './RepoCard.jsx'
import LanguageDonut from './ui/LanguageDonut.jsx'
import Pagination from './ui/Pagination.jsx'
import { usePagination } from '../hooks/usePagination.js'
import { filterSortRepos } from '../lib/repoFilter.js'
import { langColor } from '../lib/langColors.js'

function RepoList({ repos }) {
  if (repos.length === 0) {
    return (
      <p className="surface rounded-xl p-8 text-center font-mono text-sm text-slate-400">
        <span className="text-amber">$</span> no repositories match your filters.
      </p>
    )
  }
  return (
    <ul className="surface divide-y divide-line overflow-hidden rounded-xl">
      {repos.map((r) => (
        <RepoCard key={r.id} repo={r} />
      ))}
    </ul>
  )
}

export default function RepoGrid({ repos, loading, error }) {
  const [search, setSearch] = useState('')
  const [language, setLanguage] = useState('all')
  const [sort, setSort] = useState('recent')

  const languages = useMemo(() => {
    const counts = {}
    for (const r of repos) if (r.language) counts[r.language] = (counts[r.language] || 0) + 1
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [repos])

  const langTotal = useMemo(() => languages.reduce((s, l) => s + l.count, 0) || 1, [languages])

  const shown = useMemo(
    () => filterSortRepos(repos, { search, language, sort }),
    [repos, search, language, sort],
  )

  const { page, setPage, pageCount, pageItems } = usePagination(shown, 8, `${search}|${language}|${sort}`)
  const goPage = (p) => {
    setPage(p)
    document.getElementById('repos')?.scrollIntoView({ behavior: 'smooth' })
  }

  const chip = (name, count, color) => {
    const active = language === name
    return (
      <button
        key={name}
        onClick={() => setLanguage(active ? 'all' : name)}
        aria-pressed={active}
        className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-mono text-xs transition-colors ${
          active ? 'bg-primary text-ink' : 'surface text-slate-300 hover:text-primary'
        }`}
      >
        {color && <span className="h-2 w-2 rounded-full" style={{ background: color }} />}
        {name}
        <span className={active ? 'text-ink/70' : 'text-slate-500'}>{count}</span>
      </button>
    )
  }

  return (
    <Section id="repos" title="Repositories" subtitle="Everything public, pulled live from the GitHub API.">
      {error && (
        <p className="surface rounded-xl p-6 text-center text-slate-300">
          Live GitHub data is unavailable right now.{' '}
          <a className="text-primary underline" href="https://github.com/somarjez?tab=repositories" target="_blank" rel="noreferrer">
            View repositories on GitHub →
          </a>
        </p>
      )}

      {!error && (
        <>
          <div className="mb-4 font-mono text-sm text-slate-500">
            <span className="text-amber">$</span> ls ./repos
            {language !== 'all' && <span className="text-primary"> --lang={language}</span>}
            {search && <span className="text-primary"> --grep="{search}"</span>}
            {!loading && <span className="text-slate-600"> · {shown.length} {shown.length === 1 ? 'result' : 'results'}</span>}
          </div>

          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search repositories…"
                aria-label="Search repositories"
                className="surface w-full rounded-lg py-2.5 pl-11 pr-4 font-mono text-sm outline-none focus:border-primary/60"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort repositories"
              className="surface rounded-lg px-4 py-2.5 font-mono text-sm outline-none"
            >
              <option value="recent">Recently updated</option>
              <option value="stars">Most stars</option>
              <option value="name">Name (A–Z)</option>
            </select>
          </div>

          {loading ? (
            <ul className="surface divide-y divide-line overflow-hidden rounded-xl">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="h-16 animate-pulse" />
              ))}
            </ul>
          ) : languages.length === 0 ? (
            <>
              <RepoList repos={pageItems} />
              <Pagination page={page} pageCount={pageCount} onChange={goPage} />
            </>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
              {/* Live language distribution: hover a slice or click to filter */}
              <aside className="surface h-fit rounded-xl p-5 lg:sticky lg:top-24">
                <div className="mb-4 font-mono text-xs text-slate-500"># language_distribution</div>
                <LanguageDonut languages={languages} total={langTotal} active={language} onSelect={setLanguage} />
                <div className="mt-6 flex flex-wrap gap-2">
                  {chip('all', repos.length, null)}
                  {languages.map((l) => chip(l.name, l.count, langColor(l.name)))}
                </div>
              </aside>

              <div>
                <RepoList repos={pageItems} />
                <Pagination page={page} pageCount={pageCount} onChange={goPage} />
              </div>
            </div>
          )}
        </>
      )}
    </Section>
  )
}
