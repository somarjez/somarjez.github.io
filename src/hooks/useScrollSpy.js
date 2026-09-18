import { useEffect, useState } from 'react'

export function useScrollSpy(ids, offset = 120) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const onScroll = () => {
      const pos = window.scrollY + offset
      let current = ids[0]
      let bestTop = -Infinity
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= pos && el.offsetTop > bestTop) {
          bestTop = el.offsetTop
          current = id
        }
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ids, offset])
  return active
}
