import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import RepoCard from './RepoCard.jsx'

function orgDisplayName(org) {
  return org.name || org.login.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())
}

export default function OrgProjects({ orgGroups }) {
  if (!orgGroups || orgGroups.length === 0) return null

  return (
    <Section id="orgs" title="Organizations" subtitle="Teams and communities I build with">
      <div className="space-y-12">
        {orgGroups.map(({ org, repos }) => {
          const shown = (repos || []).filter((r) => !r.fork && r.name !== 'demo-repository')
          return (
            <div key={org.login}>
              <Reveal>
                <a
                  href={org.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass group flex items-center gap-4 rounded-xl border border-line p-4 transition-colors hover:border-primary/50"
                >
                  <img src={org.avatar_url} alt={orgDisplayName(org)} className="h-14 w-14 rounded-lg" />
                  <div className="min-w-0">
                    <div className="font-mono text-sm font-semibold text-slate-100 group-hover:text-primary">
                      <span className="text-amber">@</span>
                      {org.login}
                    </div>
                    <p className="truncate text-sm text-slate-400">
                      {org.description || orgDisplayName(org)}
                    </p>
                  </div>
                </a>
              </Reveal>

              {shown.length > 0 && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((r) => (
                    <Reveal key={r.id} delay={0.05}>
                      <RepoCard repo={r} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
