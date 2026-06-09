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

const API = 'https://api.github.com'

export function cacheSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: value }))
  } catch {
    /* storage full / unavailable — ignore */
  }
}

export function cacheGet(key, ttlMs) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const { t, v } = JSON.parse(raw)
    if (Date.now() - t > ttlMs) return null
    return v
  } catch {
    return null
  }
}

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  return res.json()
}

const TTL = 60 * 60 * 1000 // 1 hour

export async function fetchGitHub(username) {
  const key = `gh:${username}`
  const cached = cacheGet(key, TTL)
  if (cached) return cached

  const [user, repos, orgs] = await Promise.all([
    getJson(`${API}/users/${username}`),
    getJson(`${API}/users/${username}/repos?per_page=100&sort=updated`),
    getJson(`${API}/users/${username}/orgs`).catch(() => []),
  ])
  const data = { user, repos, orgs }
  cacheSet(key, data)
  return data
}
