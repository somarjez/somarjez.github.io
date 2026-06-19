import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Avatar from '../Avatar.jsx'

describe('Avatar', () => {
  it('renders the image when a src is provided', () => {
    render(<Avatar src="/me.jpg" alt="Jezreel Ramos" initials="JR" />)
    expect(screen.getByRole('img', { name: 'Jezreel Ramos' })).toHaveAttribute('src', '/me.jpg')
  })

  it('falls back to initials when the image fails to load', () => {
    render(<Avatar src="/missing.jpg" alt="Jezreel Ramos" initials="JR" />)
    fireEvent.error(screen.getByRole('img', { name: 'Jezreel Ramos' }))
    expect(screen.getByText('JR')).toBeInTheDocument()
  })
})
