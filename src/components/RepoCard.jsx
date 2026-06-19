import { langColor } from '../lib/langColors.js'
import Button from './ui/Button.jsx'

// A single repository as a terminal directory-listing row.
export default function RepoCard({ repo }) {
  const updated = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short',
  })
  const demo = repo.homepage && repo.homepage.trim() ? repo.homepage : null

  return (
    <li className="group flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary/[0.04] sm:flex-row sm:items-center sm:gap-5">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <h4 className="font-mono font-medium text-slate-100">
            <span className="mr-1.5 text-amber">$</span>
            <a href={repo.html_url} target="_blank" rel="noreferrer" className="break-words hover:text-primary">
              {repo.name}
            </a>
          </h4>
          {repo.language && (
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
              <span className="h-2 w-2 rounded-full" style={{ background: langColor(repo.language) }} />
              {repo.language}
            </span>
          )}
        </div>
        <p className="mt-1.5 line-clamp-1 text-sm text-slate-400">
          {repo.description || 'No description provided.'}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4 font-mono text-xs text-slate-500">
        <span><i className="fas fa-star mr-1 text-amber" aria-hidden="true" />{repo.stargazers_count}</span>
        {repo.forks_count > 0 && <span><i className="fas fa-code-branch mr-1" aria-hidden="true" />{repo.forks_count}</span>}
        <span className="hidden sm:inline">{updated}</span>
      </div>

      <div className="flex shrink-0 gap-2 sm:opacity-80 sm:transition-opacity sm:group-hover:opacity-100">
        {demo && (
          <Button href={demo} variant="solid" icon="fas fa-arrow-up-right-from-square">Demo</Button>
        )}
        <Button href={repo.html_url} variant="outline" icon="fab fa-github">Code</Button>
      </div>
    </li>
  )
}
