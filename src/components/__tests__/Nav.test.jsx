import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Nav from '../Nav.jsx'

describe('Nav theme controls', () => {
  it('provides the same accessible theme toggle for desktop and mobile navigation', () => {
    const onToggleTheme = vi.fn()
    render(<Nav onOpenPalette={() => {}} theme="light" onToggleTheme={onToggleTheme} />)

    const toggles = screen.getAllByRole('button', { name: 'Switch to dark mode' })
    expect(toggles).toHaveLength(2)
    fireEvent.click(toggles[0])
    expect(onToggleTheme).toHaveBeenCalledOnce()
  })
})
