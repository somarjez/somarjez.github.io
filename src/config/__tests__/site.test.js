import { describe, it, expect } from 'vitest'
import { site } from '../site.js'

describe('site config', () => {
  it('uses no em dashes in headline copy (banned punctuation)', () => {
    const text = `${site.role} ${site.roleSub} ${site.tagline} ${site.hero} ${site.bio} ${site.education.degree}`
    expect(text).not.toMatch(/—|--/)
  })

  it('leads with the four priority roles in order', () => {
    expect(site.roles).toEqual([
      'Data Analyst',
      'Web Developer',
      'Project Management',
      'AI / Machine Learning',
    ])
  })

  it('exposes five project-grounded skill categories in order', () => {
    expect(site.skills).toHaveLength(5)
    expect(site.skills.map((s) => s.title)).toEqual([
      'Languages',
      'Frontend & Mobile',
      'Backend & Data',
      'AI / Machine Learning',
      'Tools',
    ])
  })

  it('defines the four focus pillars, each with a blurb', () => {
    expect(site.focus.map((f) => f.label)).toEqual([
      'Data Analysis',
      'Web Development',
      'Project Management',
      'AI / Machine Learning',
    ])
    for (const f of site.focus) {
      expect(typeof f.blurb).toBe('string')
      expect(f.blurb.length).toBeGreaterThan(0)
    }
  })

  it('keeps a degree line with no year field', () => {
    expect(site.education.degree).toMatch(/BS Computer Science/)
    expect(site.education.year).toBeUndefined()
  })

  it('has a one-line tagline', () => {
    expect(typeof site.tagline).toBe('string')
    expect(site.tagline.length).toBeGreaterThan(0)
  })

  it('lists certification programs each with a title, description, and skills', () => {
    expect(Array.isArray(site.certifications)).toBe(true)
    expect(site.certifications.length).toBeGreaterThanOrEqual(6)
    for (const c of site.certifications) {
      expect(typeof c.title).toBe('string')
      expect(c.title.length).toBeGreaterThan(0)
      expect(typeof c.description).toBe('string')
      expect(c.description.length).toBeGreaterThan(0)
      expect(Array.isArray(c.skills)).toBe(true)
      expect(c.skills.length).toBeGreaterThan(0)
    }
  })
})
