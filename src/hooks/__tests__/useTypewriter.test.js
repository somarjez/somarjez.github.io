import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useTypewriter } from '../useTypewriter.js'

describe('useTypewriter', () => {
  it('returns full text immediately under reduced motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const { result } = renderHook(() => useTypewriter(['$ whoami', '> Jezreel']))
    expect(result.current.text).toBe('$ whoami\n> Jezreel')
    expect(result.current.done).toBe(true)
  })
})
