import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import About from '../About.jsx'

describe('About', () => {
  it('renders the four focus pillars', () => {
    render(<About />)
    expect(screen.getByText('Data Analysis')).toBeInTheDocument()
    expect(screen.getByText('Web Development')).toBeInTheDocument()
    expect(screen.getByText('Project Management')).toBeInTheDocument()
    expect(screen.getByText('AI / Machine Learning')).toBeInTheDocument()
  })

  it('shows the degree line', () => {
    render(<About />)
    expect(screen.getByText(/BS Computer Science/)).toBeInTheDocument()
  })
})
