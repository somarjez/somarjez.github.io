import { renderHook } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { usePointerSpotlight } from '../usePointerSpotlight.js'

describe('usePointerSpotlight', () => {
  beforeEach(() => {
    document.documentElement.style.removeProperty('--spotlight-x')
  })

  it('does nothing when reduced motion or no-hover is preferred', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const addSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => usePointerSpotlight())
    expect(addSpy).not.toHaveBeenCalledWith('pointermove', expect.any(Function))
  })

  it('attaches a pointermove listener when motion is allowed', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    const addSpy = vi.spyOn(window, 'addEventListener')
    renderHook(() => usePointerSpotlight())
    expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function), expect.anything())
  })
})
