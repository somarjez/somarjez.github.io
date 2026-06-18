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

const TTL = 10 * 60 * 1000 // 10 minutes — short enough that fresh repo/org data shows quickly

// Bump the cache prefix to invalidate older, longer-lived caches on existing visitors.
const CACHE_PREFIX = 'gh:v2'

export async function fetchGitHub(username, featuredOrgs = []) {
  const key = `${CACHE_PREFIX}:${username}:${featuredOrgs.join(',')}`
  const cached = cacheGet(key, TTL)
  if (cached) return cached

  const [user, repos, orgs] = await Promise.all([
    getJson(`${API}/users/${username}`),
    getJson(`${API}/users/${username}/repos?per_page=100&sort=updated`),
    getJson(`${API}/users/${username}/orgs`).catch(() => []),
  ])

  // Featured orgs are fetched explicitly — `/users/:user/orgs` only returns
  // orgs where membership is public, so private-membership orgs are invisible there.
  const orgGroups = (
    await Promise.all(
      featuredOrgs.map(async (login) => {
        const [org, orgRepos] = await Promise.all([
          getJson(`${API}/orgs/${login}`).catch(() => null),
          getJson(`${API}/orgs/${login}/repos?per_page=100&sort=updated`).catch(() => []),
        ])
        return org ? { org, repos: orgRepos } : null
      }),
    )
  ).filter(Boolean)

  const data = { user, repos, orgs, orgGroups }
  cacheSet(key, data)
  return data
}
