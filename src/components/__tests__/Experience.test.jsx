import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Experience from '../Experience.jsx'
import { site } from '../../config/site.js'

describe('Experience', () => {
  it('renders every role with its organization and period', () => {
    render(<Experience />)
    expect(site.experience).toHaveLength(5)
    for (const job of site.experience) {
      expect(screen.getByRole('heading', { name: job.role })).toBeInTheDocument()
      expect(job.bullets.length).toBeGreaterThan(0)
      expect(job.skills.length).toBeGreaterThan(0)
    }
  })
})
