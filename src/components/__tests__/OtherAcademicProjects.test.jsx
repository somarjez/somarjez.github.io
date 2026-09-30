import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import OtherAcademicProjects from '../OtherAcademicProjects.jsx'

describe('OtherAcademicProjects', () => {
  it('renders all four screenshot-led academic projects', () => {
    render(<OtherAcademicProjects />)
    for (const title of ['VogueVista', 'ResumeAnalyzerTkinter', 'Jez_OS', 'YouGames']) {
      expect(screen.getByRole('heading', { name: title })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: `${title} project screenshot` })).toBeInTheDocument()
    }
  })

  it('labels project screenshots as full-image viewers', () => {
    render(<OtherAcademicProjects />)
    expect(screen.getByRole('button', { name: /view full voguevista screenshot/i })).toBeInTheDocument()
  })

  it('offers and opens the Linux boot experience only for Jez_OS', () => {
    render(<OtherAcademicProjects />)

    const launchers = screen.getAllByRole('button', { name: /launch jez_os linux boot simulation/i })
    expect(launchers).toHaveLength(1)

    fireEvent.click(launchers[0])
    expect(screen.getByRole('dialog', { name: /jez_os linux boot simulation/i })).toBeInTheDocument()
  })

  it('locks page scroll and restores launcher focus when Escape closes the simulation', () => {
    render(<OtherAcademicProjects />)
    const launcher = screen.getByRole('button', { name: /launch jez_os linux boot simulation/i })
    launcher.focus()

    fireEvent.click(launcher)
    expect(document.body.style.overflow).toBe('hidden')
    expect(screen.getByRole('button', { name: /close boot simulation/i })).toHaveFocus()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog', { name: /jez_os linux boot simulation/i })).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(launcher).toHaveFocus()
  })
})
