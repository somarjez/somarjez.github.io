import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Reveal from '../Reveal.jsx'

describe('Reveal', () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  })

  it('does not hide content when reduced motion is preferred', () => {
    render(<Reveal><span>Accessible content</span></Reveal>)
    expect(screen.getByText('Accessible content').parentElement).not.toHaveStyle({ opacity: '0' })
  })
})
