import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CredentialEvidence from '../CredentialEvidence.jsx'

const base = {
  title: 'Introduction to Modern AI',
  badge: '/credentials/badges/introduction-to-modern-ai.png',
  certificate: '/credentials/certificates/introduction-to-modern-ai.pdf',
  certificatePreview: '/credentials/previews/introduction-to-modern-ai.webp',
}

describe('CredentialEvidence', () => {
  it('shows badge and certificate preview together', () => {
    render(<CredentialEvidence credential={base} />)
    expect(screen.getByRole('img', { name: 'Introduction to Modern AI badge' })).toHaveAttribute('src', base.badge)
    expect(screen.getByRole('img', { name: 'Introduction to Modern AI certificate preview' })).toHaveAttribute('src', base.certificatePreview)
    expect(screen.getByRole('link', { name: 'Open Introduction to Modern AI certificate' })).toHaveAttribute('href', base.certificate)
  })

  it('uses the full evidence area when no badge exists', () => {
    const { container } = render(<CredentialEvidence credential={{ ...base, badge: null }} />)
    expect(screen.queryByText(/issuer badge/i)).toBeNull()
    expect(container.querySelector('[data-certificate-only="true"]')).toBeInTheDocument()
  })
})
