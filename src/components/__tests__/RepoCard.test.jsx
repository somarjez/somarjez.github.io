import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import RepoCard from '../RepoCard.jsx'

const base = {
  name: 'repo',
  description: 'a repo',
  language: 'Python',
  stargazers_count: 3,
  forks_count: 0,
  updated_at: '2025-01-01T00:00:00Z',
  html_url: 'https://github.com/somarjez/repo',
}

describe('RepoCard buttons', () => {
  it('shows a Demo button linking to homepage when set', () => {
    render(<RepoCard repo={{ ...base, homepage: 'https://demo.app' }} />)
    expect(screen.getByRole('link', { name: /^demo$/i })).toHaveAttribute('href', 'https://demo.app')
  })

  it('omits the Demo button when homepage is empty', () => {
    render(<RepoCard repo={{ ...base, homepage: '' }} />)
    expect(screen.queryByRole('link', { name: /^demo$/i })).toBeNull()
  })

  it('always renders a Code link to the repo', () => {
    render(<RepoCard repo={{ ...base, homepage: null }} />)
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveAttribute('href', base.html_url)
  })
})
