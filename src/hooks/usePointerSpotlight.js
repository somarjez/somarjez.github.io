import { useEffect } from 'react'

export function usePointerSpotlight() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noHover = window.matchMedia('(hover: none)').matches
    if (reduce || noHover) return

    let raf = 0
    let nextX = 0
    let nextY = 0
    const root = document.documentElement
    const apply = () => {
      raf = 0
      root.style.setProperty('--spotlight-x', `${nextX}px`)
      root.style.setProperty('--spotlight-y', `${nextY}px`)
    }
    const onMove = (e) => {
      nextX = e.clientX
      nextY = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
}
