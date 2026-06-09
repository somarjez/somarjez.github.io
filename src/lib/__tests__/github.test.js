import { describe, it, expect, beforeEach } from 'vitest'
import { deriveStats } from '../github.js'

describe('deriveStats', () => {
  const user = { created_at: '2020-01-01T00:00:00Z' }
  const repos = [
    { name: 'a', stargazers_count: 3, language: 'JavaScript' },
    { name: 'b', stargazers_count: 1, language: 'Python' },
    { name: 'c', stargazers_count: 0, language: 'JavaScript' },
    { name: 'd', stargazers_count: 0, language: null },
  ]

  it('counts repos and stars', () => {
    const s = deriveStats(user, repos)
    expect(s.totalRepos).toBe(4)
    expect(s.totalStars).toBe(4)
  })

  it('aggregates languages sorted by count, ignoring null', () => {
    const s = deriveStats(user, repos)
    expect(s.languages[0]).toEqual({ name: 'JavaScript', count: 2 })
    expect(s.topLanguage).toBe('JavaScript')
    expect(s.languages.find((l) => l.name === null)).toBeUndefined()
  })

  it('computes a non-negative account age in years', () => {
    const s = deriveStats(user, repos)
    expect(s.accountAgeYears).toBeGreaterThanOrEqual(0)
  })

  it('is safe with empty input', () => {
    const s = deriveStats(null, [])
    expect(s.totalRepos).toBe(0)
    expect(s.totalStars).toBe(0)
    expect(s.languages).toEqual([])
    expect(s.topLanguage).toBe(null)
  })
})

import { cacheGet, cacheSet } from '../github.js'

describe('cache', () => {
  beforeEach(() => localStorage.clear())

  it('returns null on miss', () => {
    expect(cacheGet('k', 1000)).toBe(null)
  })

  it('returns value within TTL', () => {
    cacheSet('k', { a: 1 })
    expect(cacheGet('k', 60_000)).toEqual({ a: 1 })
  })

  it('returns null when expired', () => {
    cacheSet('k', { a: 1 })
    const raw = JSON.parse(localStorage.getItem('k'))
    raw.t = Date.now() - 10_000
    localStorage.setItem('k', JSON.stringify(raw))
    expect(cacheGet('k', 5_000)).toBe(null)
  })
})
