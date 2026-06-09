import { describe, it, expect } from 'vitest'
import { filterSortRepos } from '../../lib/repoFilter.js'

const repos = [
  { name: 'alpha', description: 'first', language: 'Python', stargazers_count: 5, updated_at: '2025-01-01T00:00:00Z' },
  { name: 'beta', description: 'second JS app', language: 'JavaScript', stargazers_count: 2, updated_at: '2025-06-01T00:00:00Z' },
  { name: 'gamma', description: null, language: 'Python', stargazers_count: 9, updated_at: '2024-01-01T00:00:00Z' },
]

describe('filterSortRepos', () => {
  it('filters by search across name and description (case-insensitive)', () => {
    expect(filterSortRepos(repos, { search: 'js', language: 'all', sort: 'recent' }).map(r => r.name)).toEqual(['beta'])
    expect(filterSortRepos(repos, { search: 'ALPHA', language: 'all', sort: 'recent' }).map(r => r.name)).toEqual(['alpha'])
  })

  it('filters by language', () => {
    expect(filterSortRepos(repos, { search: '', language: 'Python', sort: 'name' }).map(r => r.name)).toEqual(['alpha', 'gamma'])
  })

  it('sorts by stars desc', () => {
    expect(filterSortRepos(repos, { search: '', language: 'all', sort: 'stars' }).map(r => r.name)).toEqual(['gamma', 'alpha', 'beta'])
  })

  it('sorts by recent (updated_at desc)', () => {
    expect(filterSortRepos(repos, { search: '', language: 'all', sort: 'recent' }).map(r => r.name)).toEqual(['beta', 'alpha', 'gamma'])
  })

  it('sorts by name asc', () => {
    expect(filterSortRepos(repos, { search: '', language: 'all', sort: 'name' }).map(r => r.name)).toEqual(['alpha', 'beta', 'gamma'])
  })
})
