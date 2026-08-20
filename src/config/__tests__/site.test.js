import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { site } from '../site.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const publicFile = (url) => path.join(root, 'public', url.replace(/^\//, ''))

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

  it('uses URL-safe local certificate and preview paths that exist', () => {
    expect(site.certifications).toHaveLength(12)
    for (const credential of site.certifications) {
      for (const field of ['certificate', 'certificatePreview']) {
        expect(credential[field]).toMatch(/^\/credentials\/[a-z0-9/-]+\.(pdf|jpg|webp)$/)
        expect(fs.existsSync(publicFile(credential[field]))).toBe(true)
      }
      if (credential.badge) {
        expect(fs.existsSync(publicFile(credential.badge))).toBe(true)
      }
    }
  })

  it('uses evidence-grounded metadata for newly supplied credentials', () => {
    expect(site.certifications).toEqual(expect.arrayContaining([
      expect.objectContaining({
        title: 'Are your s3crets safe? Fortifying Your Arsenal Against AWS Bucket Breaches',
        issuer: 'GC Bitbarkada',
        issued: 'Oct 1, 2025',
      }),
      expect.objectContaining({
        title: 'Integrated OS – Be More Digi-TALINO',
        issuer: 'Integrated Office Solutions, Inc.',
        issued: 'Sep 5, 2025',
      }),
      expect.objectContaining({
        title: 'AI-Driven Software Development: From Wireframe to App – with a Focus on Security and Assurance',
        issuer: 'Computer Science Society Organization',
        issued: 'Dec 3, 2025',
      }),
    ]))
  })

  it('defines semantic light and dark theme tokens', () => {
    const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8')
    for (const token of ['--color-ink', '--color-panel', '--color-foreground', '--color-muted', '--color-primary']) {
      expect(css).toContain(token)
    }
    expect(css).toMatch(/\.dark\s*\{/)
  })

  it('keeps all configured local portfolio assets present', () => {
    const urls = site.certifications.flatMap((credential) => [
      credential.badge,
      credential.certificate,
      credential.certificatePreview,
    ]).filter(Boolean)

    for (const url of urls) {
      expect(fs.existsSync(publicFile(url)), `missing public asset: ${url}`).toBe(true)
    }
  })

  it('bootstraps the persisted theme before the page body can paint', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
    expect(html.indexOf("localStorage.getItem('portfolio-theme')")).toBeGreaterThan(-1)
    expect(html.indexOf("document.documentElement.classList.toggle('dark'")).toBeGreaterThan(-1)
    expect(html.indexOf('<body')).toBeGreaterThan(html.indexOf("localStorage.getItem('portfolio-theme')"))
  })
})
