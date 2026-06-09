export function filterSortRepos(repos, { search, language, sort }) {
  const q = (search || '').trim().toLowerCase()
  let out = (repos || []).filter((r) => {
    const matchesQ =
      !q ||
      r.name.toLowerCase().includes(q) ||
      (r.description || '').toLowerCase().includes(q)
    const matchesLang = language === 'all' || r.language === language
    return matchesQ && matchesLang
  })

  out = [...out]
  if (sort === 'stars') out.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
  else if (sort === 'name') out.sort((a, b) => a.name.localeCompare(b.name))
  else out.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)) // recent
  return out
}
