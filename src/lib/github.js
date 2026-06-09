export function deriveStats(user, repos) {
  const list = Array.isArray(repos) ? repos : []
  const totalRepos = list.length
  const totalStars = list.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)

  const counts = {}
  for (const r of list) {
    if (!r.language) continue
    counts[r.language] = (counts[r.language] || 0) + 1
  }
  const languages = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  let accountAgeYears = 0
  if (user?.created_at) {
    const ms = Date.now() - new Date(user.created_at).getTime()
    accountAgeYears = Math.max(0, Math.floor(ms / (365.25 * 24 * 3600 * 1000)))
  }

  return {
    totalRepos,
    totalStars,
    languages,
    topLanguage: languages[0]?.name ?? null,
    accountAgeYears,
  }
}
