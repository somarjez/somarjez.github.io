import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import OrgProjects from '../OrgProjects.jsx'

const orgGroups = [
  {
    org: {
      login: 'santacruz-bible-christian-church',
      name: null,
      description: 'Church management and web projects',
      avatar_url: 'https://example.com/a.png',
      html_url: 'https://github.com/santacruz-bible-christian-church',
    },
    repos: [
      { id: 1, name: 'sbcc-management-system', fork: false, html_url: 'https://github.com/x', description: 'Mgmt', language: 'JavaScript', stargazers_count: 0, forks_count: 0, updated_at: '2026-01-01T00:00:00Z' },
      { id: 2, name: 'demo-repository', fork: false, html_url: 'https://github.com/y', description: 'demo', language: 'HTML', stargazers_count: 0, forks_count: 0, updated_at: '2026-01-01T00:00:00Z' },
    ],
  },
]

describe('OrgProjects', () => {
  it('renders nothing without org groups', () => {
    const { container } = render(<OrgProjects orgGroups={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the org and its real repos, hiding the demo repo', () => {
    render(<OrgProjects orgGroups={orgGroups} />)
    expect(screen.getByText(/santacruz-bible-christian-church/)).toBeInTheDocument()
    expect(screen.getByText('sbcc-management-system')).toBeInTheDocument()
    expect(screen.queryByText('demo-repository')).toBeNull()
  })
})
