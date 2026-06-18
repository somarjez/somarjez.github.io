import { langColor } from '../lib/langColors.js'
import Button from './ui/Button.jsx'

export default function RepoCard({ repo }) {
  const updated = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short',
  })
  const demo = repo.homepage && repo.homepage.trim() ? repo.homepage : null
  return (
    <div className="surface group flex h-full flex-col rounded-xl p-5 transition-all hover:-translate-y-1 hover:border-primary/50">
      <div className="flex items-start justify-between gap-3">
        <h4 className="min-w-0 font-mono font-semibold text-slate-100">
          <span className="mr-1 text-amber">$</span>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="break-words hover:text-primary">
            {repo.name}
          </a>
        </h4>
        {repo.language && (
          <span className="flex shrink-0 items-center gap-1.5 rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-slate-300">
            <span className="h-2 w-2 rounded-full" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
        {repo.description || 'No description provided.'}
      </p>

      <div className="mt-4 flex items-center gap-4 font-mono text-xs text-slate-500">
        <span><i className="fas fa-star mr-1 text-amber" aria-hidden="true" />{repo.stargazers_count}</span>
        {repo.forks_count > 0 && <span><i className="fas fa-code-branch mr-1" aria-hidden="true" />{repo.forks_count}</span>}
        <span className="ml-auto">updated {updated}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {demo && (
          <Button href={demo} variant="solid" icon="fas fa-arrow-up-right-from-square">Demo</Button>
        )}
        <Button href={repo.html_url} variant="outline" icon="fab fa-github">Code</Button>
      </div>
    </div>
  )
}
