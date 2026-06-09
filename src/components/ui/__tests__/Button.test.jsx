import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Button from '../Button.jsx'

describe('Button', () => {
  it('renders an external link with label and solid variant classes', () => {
    render(<Button href="https://example.com" variant="solid">Live Demo</Button>)
    const link = screen.getByRole('link', { name: /live demo/i })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
    expect(link.className).toMatch(/from-primary/)
  })

  it('applies outline variant classes', () => {
    render(<Button href="https://example.com" variant="outline">Code</Button>)
    expect(screen.getByRole('link', { name: /code/i }).className).toMatch(/border-line/)
  })
})
