import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../App.jsx'

vi.mock('../hooks/useGitHub.js', () => ({
  useGitHub: () => ({
    repos: [],
    orgGroups: [],
    stats: { totalRepos: 0, totalStars: 0, languages: [], accountAgeYears: 0 },
    loading: false,
    error: null,
  }),
}))
vi.mock('../hooks/usePointerSpotlight.js', () => ({ usePointerSpotlight: () => {} }))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App leadership section', () => {
  it('renders Leadership and Service between Experience and Certifications', () => {
    const { container } = render(<App />)

    expect(screen.getByRole('heading', { name: 'Leadership & Service' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Laguna State Polytechnic University - Santa Cruz Campus' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Santa Cruz Bible Christian Church' })).toBeInTheDocument()
    expect(screen.getByText('LSPU Senior High School - Graduated with High Honors')).toBeInTheDocument()
    expect(screen.getByText('STRASUC qualifier and silver medalist')).toBeInTheDocument()
    expect(screen.queryByText(/Pedro Guevara|English and Forensic Club/)).toBeNull()

    const sections = [...container.querySelectorAll('main > section')].map((section) => section.id)
    expect(sections.indexOf('experience')).toBeLessThan(sections.indexOf('leadership'))
    expect(sections.indexOf('leadership')).toBeLessThan(sections.indexOf('certs'))
  })
})
