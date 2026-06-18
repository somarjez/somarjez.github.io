import { useEffect, useRef, useState } from 'react'

export function useTypewriter(lines, { speed = 28, linePause = 350 } = {}) {
  const full = lines.join('\n')
  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [text, setText] = useState(reduce ? full : '')
  const [done, setDone] = useState(reduce)
  const iRef = useRef(0)

  useEffect(() => {
    if (reduce) return
    let timer
    const step = () => {
      const i = iRef.current
      if (i >= full.length) {
        setDone(true)
        return
      }
      setText(full.slice(0, i + 1))
      iRef.current = i + 1
      const pause = full[i] === '\n' ? linePause : speed
      timer = setTimeout(step, pause)
    }
    timer = setTimeout(step, speed)
    return () => clearTimeout(timer)
  }, [full, reduce, speed, linePause])

  return { text, done }
}
