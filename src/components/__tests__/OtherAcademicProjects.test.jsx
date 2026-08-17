import { render, screen } from '@testing-library/react'
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
})
