import { langColor } from '../lib/langColors.js'

export default function RepoCard({ repo }) {
  const updated = new Date(repo.updated_at).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short',
  })
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="glass group flex h-full flex-col rounded-xl p-5 transition-all hover:-translate-y-1 hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-slate-100 group-hover:text-primary">
          <i className="fas fa-folder mr-2 text-primary/70" />
          {repo.name}
        </h4>
        <i className="fas fa-arrow-up-right-from-square text-xs text-slate-500" />
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
        <span><i className="fas fa-star mr-1 text-yellow-400" />{repo.stargazers_count}</span>
        {repo.forks_count > 0 && <span><i className="fas fa-code-branch mr-1" />{repo.forks_count}</span>}
        <span className="ml-auto">{updated}</span>
      </div>
    </a>
  )
}
