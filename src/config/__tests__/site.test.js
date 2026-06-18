import { describe, it, expect } from 'vitest'
import { site } from '../site.js'

describe('site config', () => {
  it('has no student/year framing in role, subtitle, bio, or education', () => {
    const text = `${site.role} ${site.roleSub} ${site.bio} ${JSON.stringify(site.education)}`
    expect(text).not.toMatch(/\b(3rd|student|year)\b/i)
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

  it('defines three focus pillars', () => {
    expect(site.focus.map((f) => f.label)).toEqual([
      'Full-Stack Web',
      'Mobile Apps',
      'AI / Machine Learning',
    ])
  })

  it('keeps a degree line with no year field', () => {
    expect(site.education.degree).toMatch(/BS Computer Science/)
    expect(site.education.year).toBeUndefined()
  })

  it('has a one-line tagline with no student/year framing', () => {
    expect(typeof site.tagline).toBe('string')
    expect(site.tagline.length).toBeGreaterThan(0)
    expect(site.tagline).not.toMatch(/\b(3rd|student|year)\b/i)
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
