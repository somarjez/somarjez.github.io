import { useRef, useState } from 'react'

const MAX = 6 // degrees

export default function TiltCard({ className = '', children }) {
  const ref = useRef(null)
  const [t, setT] = useState('')
  const enabled = () =>
    typeof window !== 'undefined' &&
    !window.matchMedia('(hover: none)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onMove = (e) => {
    if (!enabled() || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setT(`perspective(800px) rotateY(${px * MAX}deg) rotateX(${-py * MAX}deg)`)
  }
  const reset = () => setT('')

  return (
    <div
      ref={ref}
      data-testid="tilt-card"
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ transform: t, transition: 'transform 120ms ease-out', transformStyle: 'preserve-3d' }}
      className={className}
    >
      {children}
    </div>
  )
}
