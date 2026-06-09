import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import About from '../About.jsx'

describe('About', () => {
  it('renders the three focus pillars', () => {
    render(<About />)
    expect(screen.getByText('Full-Stack Web')).toBeInTheDocument()
    expect(screen.getByText('Mobile Apps')).toBeInTheDocument()
    expect(screen.getByText('AI / Machine Learning')).toBeInTheDocument()
  })

  it('shows the degree line and no student/year framing', () => {
    render(<About />)
    expect(screen.getByText(/BS Computer Science/)).toBeInTheDocument()
    expect(screen.queryByText(/3rd year/i)).toBeNull()
    expect(screen.queryByText(/student/i)).toBeNull()
  })
})
