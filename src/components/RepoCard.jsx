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
        <h4 className="font-semibold text-slate-100">
          <span className="mr-1 font-mono text-amber">$</span>
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="font-mono hover:text-primary">
            {repo.name}
          </a>
        </h4>
      </div>
      <p className="mt-2 flex-1 text-sm text-slate-400">
        {repo.description || 'No description provided.'}
      </p>
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: langColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span><i className="fas fa-star mr-1 text-amber" aria-hidden="true" />{repo.stargazers_count}</span>
        {repo.forks_count > 0 && <span><i className="fas fa-code-branch mr-1" aria-hidden="true" />{repo.forks_count}</span>}
        <span className="ml-auto">{updated}</span>
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
