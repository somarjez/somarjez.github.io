import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Skills from '../Skills.jsx'

describe('Skills', () => {
  it('renders the curated HTML and JavaScript course competencies', () => {
    render(<Skills />)

    const courseSkills = [
      'HTML Fundamentals',
      'Structuring Web Content',
      'HTML Forms',
      'Web Accessibility',
      'Multimedia Integration',
      'JavaScript Fundamentals',
      'Data Types',
      'Control Flow',
      'Functions',
      'Exception Handling',
      'Algorithmic Thinking',
    ]

    for (const skill of courseSkills) {
      expect(screen.getByText(skill)).toBeInTheDocument()
    }
  })
})
