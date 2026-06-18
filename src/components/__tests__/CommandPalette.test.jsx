import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CommandPalette from '../CommandPalette.jsx'

const commands = [
  { id: 'projects', label: 'Go to Projects', hint: 'section', run: vi.fn() },
  { id: 'github', label: 'Open GitHub', hint: 'link', run: vi.fn() },
]

describe('CommandPalette', () => {
  it('filters commands by query', () => {
    render(<CommandPalette open commands={commands} onClose={() => {}} />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'git' } })
    expect(screen.getByText('Open GitHub')).toBeInTheDocument()
    expect(screen.queryByText('Go to Projects')).toBeNull()
  })

  it('runs a command on click and closes', () => {
    const onClose = vi.fn()
    render(<CommandPalette open commands={commands} onClose={onClose} />)
    fireEvent.click(screen.getByText('Go to Projects'))
    expect(commands[0].run).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })

  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} commands={commands} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
