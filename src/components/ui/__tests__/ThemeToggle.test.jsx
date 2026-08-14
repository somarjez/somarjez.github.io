import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ThemeToggle from '../ThemeToggle.jsx'

describe('ThemeToggle', () => {
  it('describes the next theme and invokes the toggle', () => {
    const onToggle = vi.fn()
    const { rerender } = render(<ThemeToggle theme="light" onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: 'Switch to dark mode' }))
    expect(onToggle).toHaveBeenCalledOnce()
    rerender(<ThemeToggle theme="dark" onToggle={onToggle} />)
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })
})
