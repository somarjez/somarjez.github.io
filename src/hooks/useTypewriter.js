import { useEffect, useRef, useState } from 'react'

export function useTypewriter(lines, { speed = 28, linePause = 350, chunk = 1 } = {}) {
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
      // Pause at line breaks; otherwise reveal `chunk` characters per tick.
      if (full[i] === '\n') {
        iRef.current = i + 1
        setText(full.slice(0, i + 1))
        timer = setTimeout(step, linePause)
        return
      }
      let end = Math.min(i + Math.max(1, chunk), full.length)
      const nl = full.indexOf('\n', i)
      if (nl !== -1 && nl < end) end = nl
      iRef.current = end
      setText(full.slice(0, end))
      timer = setTimeout(step, speed)
    }
    timer = setTimeout(step, speed)
    return () => clearTimeout(timer)
  }, [full, reduce, speed, linePause, chunk])

  return { text, done }
}
