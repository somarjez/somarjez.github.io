import { describe, expect, it } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { academicProjects } from '../academicProjects.js'
import { featured } from '../featured.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

describe('academic project configuration', () => {
  it('defines the four supplied academic projects in order', () => {
    expect(academicProjects.map((project) => project.title)).toEqual([
      'VogueVista',
      'ResumeAnalyzerTkinter',
      'Jez_OS',
      'YouGames',
    ])
  })

  it('keeps academic projects out of the featured explorer', () => {
    const academicSlugs = new Set(academicProjects.map((project) => project.slug))
    expect(featured.some((project) => academicSlugs.has(project.slug))).toBe(false)
  })

  it('uses URL-safe screenshots that exist', () => {
    for (const project of academicProjects) {
      expect(project.image).toMatch(/^\/project-images\/[a-z0-9-]+\.png$/)
      expect(fs.existsSync(path.join(root, 'public', project.image.replace(/^\//, '')))).toBe(true)
      expect(project.description.length).toBeGreaterThan(80)
      expect(project.tech.length).toBeGreaterThanOrEqual(3)
    }
  })
})
