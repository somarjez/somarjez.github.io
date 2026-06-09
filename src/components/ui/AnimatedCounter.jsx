import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ value, duration = 1200 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setN(Math.round(p * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return <span ref={ref}>{n}</span>
}
