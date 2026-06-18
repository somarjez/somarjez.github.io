import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Certifications from '../Certifications.jsx'
import { site } from '../../config/site.js'

describe('Certifications', () => {
  it('renders every certification program title', () => {
    render(<Certifications />)
    for (const c of site.certifications) {
      expect(screen.getByText(new RegExp(c.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))).toBeInTheDocument()
    }
  })
})
