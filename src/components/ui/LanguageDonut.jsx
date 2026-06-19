import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { langColor } from '../../lib/langColors.js'

const SIZE = 200
const STROKE = 26
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R

// Interactive language ring. The chart is decorative (aria-hidden); the
// accessible, keyboard-operable filtering lives in the legend chips beside it.
export default function LanguageDonut({ languages, total, active, onSelect }) {
  const reduce = useReducedMotion()
  const [hover, setHover] = useState(null)

  let acc = 0
  const segs = languages.map((l) => {
    const frac = l.count / total
    const s = { ...l, len: frac * C, start: acc }
    acc += frac * C
    return s
  })

  const focus = hover || (active !== 'all' ? languages.find((l) => l.name === active) : null)

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <motion.svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full -rotate-90"
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <circle cx={SIZE / 2} cy={SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={STROKE} />
        {segs.map((s) => {
          const dim = (active !== 'all' && active !== s.name) || (hover && hover.name !== s.name)
          const isHover = hover && hover.name === s.name
          return (
            <circle
              key={s.name}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={langColor(s.name)}
              strokeWidth={isHover ? STROKE + 5 : STROKE}
              strokeDasharray={`${Math.max(0, s.len - 2)} ${C - s.len + 2}`}
              strokeDashoffset={-s.start}
              style={{ opacity: dim ? 0.25 : 1 }}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect(active === s.name ? 'all' : s.name)}
            />
          )
        })}
      </motion.svg>

      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-3xl font-bold tabular-nums text-slate-50">
            {focus ? focus.count : total}
          </div>
          <div className="max-w-[8rem] truncate font-mono text-xs text-slate-400">
            {focus ? focus.name : 'repos'}
          </div>
        </div>
      </div>
    </div>
  )
}
