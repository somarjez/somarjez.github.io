import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Certifications from '../Certifications.jsx'
import { site } from '../../config/site.js'

describe('Certifications', () => {
  it('renders the first page of certification titles', () => {
    render(<Certifications />)
    expect(screen.getAllByText(/Introduction to Modern AI/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Apply AI: Update Your Resume/)).toBeInTheDocument()
  })

  it('shows issuer and credential id for credentials that have them', () => {
    render(<Certifications />)
    expect(screen.getAllByText(/Cisco Networking Academy/).length).toBeGreaterThan(0)
    const withId = site.certifications.find((c) => c.credentialId)
    expect(screen.getByText(new RegExp(withId.credentialId))).toBeInTheDocument()
  })

  it('paginates when there is more than one page', () => {
    render(<Certifications />)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })
})
