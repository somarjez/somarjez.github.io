import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Certifications from '../Certifications.jsx'
import { site } from '../../config/site.js'

describe('Certifications', () => {
  it('renders every certification program title', () => {
    render(<Certifications />)
    for (const c of site.certifications) {
      expect(screen.getAllByText(new RegExp(c.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).length).toBeGreaterThan(0)
    }
  })

  it('shows issuer and credential id for credentials that have them', () => {
    render(<Certifications />)
    expect(screen.getAllByText(/Cisco Networking Academy/).length).toBeGreaterThan(0)
    const withId = site.certifications.find((c) => c.credentialId)
    expect(screen.getByText(new RegExp(withId.credentialId))).toBeInTheDocument()
  })
})
