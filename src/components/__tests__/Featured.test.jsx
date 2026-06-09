import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from '../Featured.jsx'

const base = { title: 'Demo Project', icon: 'fa-flask', description: 'desc', tech: ['Python'] }

describe('Featured Card buttons', () => {
  it('shows Live Demo only when demo link exists', () => {
    render(<Card p={{ ...base, demo: 'https://youtu.be/x', source: null }} live={null} />)
    expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', 'https://youtu.be/x')
    expect(screen.queryByRole('link', { name: /^code$/i })).toBeNull()
  })

  it('shows Code only when source link exists', () => {
    render(<Card p={{ ...base, demo: null, source: 'https://github.com/x' }} live={null} />)
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveAttribute('href', 'https://github.com/x')
    expect(screen.queryByRole('link', { name: /live demo/i })).toBeNull()
  })
})
