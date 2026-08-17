import { fireEvent, render, screen } from '@testing-library/react'
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

  it('presents the badge as a larger square evidence tile', () => {
    const { container } = render(<CredentialEvidence credential={base} />)
    expect(container.querySelector('[data-badge-panel]')).toHaveClass('min-h-52')
    expect(screen.getByRole('img', { name: 'Introduction to Modern AI badge' })).toHaveClass('h-40', 'w-40')
  })

  it('opens a full certificate preview without changing the verification link', () => {
    render(<CredentialEvidence credential={base} />)
    fireEvent.click(screen.getByRole('button', { name: /view full introduction to modern ai certificate preview/i }))
    expect(screen.getByRole('dialog', { name: /introduction to modern ai screenshot/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /introduction to modern ai full certificate preview/i })).toHaveAttribute('src', base.certificatePreview)
  })
})
