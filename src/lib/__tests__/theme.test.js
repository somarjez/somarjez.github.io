import { beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from '../theme.js'

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
  })

  it('defaults to dark when no stored preference exists', () => {
    expect(readStoredTheme(localStorage)).toBe('dark')
  })

  it('restores only a valid stored dark preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    expect(readStoredTheme(localStorage)).toBe('dark')
    localStorage.setItem(THEME_STORAGE_KEY, 'sepia')
    expect(readStoredTheme(localStorage)).toBe('dark')
  })

  it('applies dark by toggling the root class and color scheme', () => {
    applyTheme('dark', document.documentElement)
    expect(document.documentElement).toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    applyTheme('light', document.documentElement)
    expect(document.documentElement).not.toHaveClass('dark')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})
