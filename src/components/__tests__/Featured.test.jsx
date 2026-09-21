import fs from 'node:fs'
import path from 'node:path'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Featured, { ProjectDetail } from '../Featured.jsx'
import { featured } from '../../config/featured.js'

const base = { title: 'Demo Project', icon: 'fa-flask', category: 'Web', description: 'desc', tech: ['Python'] }

describe('Featured ProjectDetail buttons', () => {
  it('shows Live Demo only when a demo link exists', () => {
    render(<ProjectDetail project={{ ...base, demo: 'https://youtu.be/x', source: null }} live={null} />)
    expect(screen.getByRole('link', { name: /live demo/i })).toHaveAttribute('href', 'https://youtu.be/x')
    expect(screen.queryByRole('link', { name: /^code$/i })).toBeNull()
  })

  it('shows Code only when a source link exists', () => {
    render(<ProjectDetail project={{ ...base, demo: null, source: 'https://github.com/x' }} live={null} />)
    expect(screen.getByRole('link', { name: /^code$/i })).toHaveAttribute('href', 'https://github.com/x')
    expect(screen.queryByRole('link', { name: /live demo/i })).toBeNull()
  })

  it('renders the category and a thesis badge when flagged', () => {
    render(<ProjectDetail project={{ ...base, category: 'AI / ML', thesis: true, demo: null, source: null }} live={null} />)
    expect(screen.getByText('AI / ML')).toBeInTheDocument()
    expect(screen.getByText('thesis')).toBeInTheDocument()
  })

  it('renders a supplied screenshot with specific alt text', () => {
    render(<ProjectDetail project={{ ...base, title: 'OSCA-AgeSense', image: '/project-images/osca-agesense.png' }} live={null} />)
    expect(screen.getByRole('img', { name: 'OSCA-AgeSense screenshot' }))
      .toHaveAttribute('src', '/project-images/osca-agesense.png')
  })

  it('opens the complete screenshot in an accessible lightbox', () => {
    render(<ProjectDetail project={{ ...base, title: 'OSCA-AgeSense', image: '/project-images/osca-agesense.png' }} live={null} />)
    fireEvent.click(screen.getByRole('button', { name: /view full osca-agesense screenshot/i }))
    expect(screen.getByRole('dialog', { name: /osca-agesense screenshot/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /osca-agesense full screenshot/i })).toHaveAttribute('src', '/project-images/osca-agesense.png')
  })

  it('keeps the featured explorer focused on nine current projects', () => {
    expect(featured).toHaveLength(9)
    expect(featured.map((project) => project.slug)).toEqual([
      'agriwise',
      'workwise-ph',
      'osca-agesense',
      'findify-mobile',
      'findify-web',
      'educational-rms',
      'quizera',
      '404-dreamteam',
      'sbcc-system',
    ])
  })

  it('uses the local project-image directory for every configured screenshot', () => {
    for (const project of featured.filter((item) => item.image)) {
      expect(project.image).toMatch(/^\/project-images\/[a-z0-9-]+\.png$/)
    }
  })

  it('lets multi-image projects be swiped through and every image file exists', () => {
    for (const project of featured.filter((item) => item.images)) {
      expect(project.images.length).toBeGreaterThan(1)
      for (const image of project.images) {
        expect(image).toMatch(/^\/project-images\/[a-z0-9-]+\.png$/)
        expect(fs.existsSync(path.join(process.cwd(), 'public', image))).toBe(true)
      }
    }
    const agriwise = featured.find((item) => item.slug === 'agriwise')
    render(<ProjectDetail project={agriwise} live={null} />)
    expect(screen.getAllByRole('img')).toHaveLength(3)
    fireEvent.click(screen.getByRole('button', { name: 'Next screenshot' }))
    expect(screen.getByRole('button', { name: 'Show screenshot 2 of 3' })).toHaveAttribute('aria-current', 'true')
  })

  it('moves focus with keyboard project-tab navigation', () => {
    render(<Featured repos={[]} />)
    const tablist = screen.getByRole('tablist', { name: 'Featured projects' })
    const firstTab = screen.getByRole('tab', { name: /agriwise$/ })
    firstTab.focus()
    fireEvent.keyDown(tablist, { key: 'ArrowDown' })
    expect(screen.getByRole('tab', { name: /workwise-ph$/ })).toHaveFocus()
  })
})
