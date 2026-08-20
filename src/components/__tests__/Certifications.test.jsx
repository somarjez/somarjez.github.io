import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Certifications from '../Certifications.jsx'
import { site } from '../../config/site.js'

describe('Certifications', () => {
  it('renders the first page of certification titles as a compact grid', () => {
    render(<Certifications />)
    expect(screen.getByText('Introduction to Data Science')).toBeInTheDocument()
    expect(screen.getByText('Data Science Essentials with Python')).toBeInTheDocument()
    expect(screen.getByText('Data Analytics Essentials')).toBeInTheDocument()
    expect(screen.getByText('Introduction to Modern AI')).toBeInTheDocument()
  })

  it('paginates when there is more than one page', () => {
    render(<Certifications />)
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('shows four credentials per page', () => {
    render(<Certifications />)
    expect(screen.getByText('Introduction to Modern AI')).toBeInTheDocument()
    expect(screen.queryByText('Apply AI: Update Your Resume')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /next/i }))
    expect(screen.getByText('Apply AI: Update Your Resume')).toBeInTheDocument()
  })

  it('opens a detail dialog with badge, certificate evidence, and credential id on click', () => {
    render(<Certifications />)
    fireEvent.click(screen.getByRole('button', { name: /view introduction to data science credential details/i }))
    expect(screen.getByRole('dialog', { name: /introduction to data science details/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Introduction to Data Science certificate preview' })).toBeInTheDocument()

    const withId = site.certifications.find((c) => c.credentialId)
    fireEvent.click(screen.getByRole('button', { name: 'Close credential details' }))
    fireEvent.click(screen.getByRole('button', { name: new RegExp(`view ${withId.title} credential details`, 'i') }))
    expect(screen.getByText(new RegExp(withId.credentialId))).toBeInTheDocument()
  })
})
