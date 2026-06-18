import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProjectDetail } from '../Featured.jsx'

const base = { title: 'Demo Project', icon: 'fa-flask', category: 'Web', description: 'desc', tech: ['Python'] }

describe('Featured ProjectDetail buttons', () => {
  it('shows Live Demo only when a demo link exists', () => {
    render(<ProjectDetail project={{ ...base, demo: 'https://youtu.be/x', source: null }} live={null} />)
    expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', 'https://youtu.be/x')
    expect(screen.queryByRole('link', { name: /^code$/i })).toBeNull()
  })

  it('shows Code only when a source link exists', () => {
    render(<ProjectDetail project={{ ...base, demo: null, source: 'https://github.com/x' }} live={null} />)
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveAttribute('href', 'https://github.com/x')
    expect(screen.queryByRole('link', { name: /live demo/i })).toBeNull()
  })

  it('renders the category and a thesis badge when flagged', () => {
    render(<ProjectDetail project={{ ...base, category: 'AI / ML', thesis: true, demo: null, source: null }} live={null} />)
    expect(screen.getByText('AI / ML')).toBeInTheDocument()
    expect(screen.getByText('thesis')).toBeInTheDocument()
  })
})
