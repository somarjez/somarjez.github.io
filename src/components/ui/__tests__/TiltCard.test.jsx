import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TiltCard from '../TiltCard.jsx'

describe('TiltCard', () => {
  it('renders children and forwards className', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    render(<TiltCard className="glass"><span>inside</span></TiltCard>)
    expect(screen.getByText('inside')).toBeInTheDocument()
    expect(screen.getByTestId('tilt-card').className).toMatch(/glass/)
  })
})
