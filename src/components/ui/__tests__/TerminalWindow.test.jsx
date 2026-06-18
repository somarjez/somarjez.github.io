import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TerminalWindow from '../TerminalWindow.jsx'

describe('TerminalWindow', () => {
  it('renders the title and children', () => {
    render(<TerminalWindow title="jezreel@portfolio: ~"><p>body</p></TerminalWindow>)
    expect(screen.getByText('jezreel@portfolio: ~')).toBeInTheDocument()
    expect(screen.getByText('body')).toBeInTheDocument()
  })
})
