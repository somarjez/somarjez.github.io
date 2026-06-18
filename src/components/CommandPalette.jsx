import { useEffect, useMemo, useRef, useState } from 'react'

export default function CommandPalette({ open, commands, onClose }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands
  }, [query, commands])

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  if (!open) return null

  const choose = (cmd) => {
    cmd?.run()
    onClose()
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]) }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Command palette"
        className="term-window w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="font-mono text-amber">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a command…"
            aria-label="Command query"
            className="w-full bg-transparent font-mono text-sm text-slate-100 outline-none placeholder:text-slate-600"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-slate-500">ESC</kbd>
        </div>
        <ul className="max-h-72 overflow-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-3 font-mono text-sm text-slate-500">no matches</li>
          )}
          {results.map((c, i) => (
            <li key={c.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(c)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-mono text-sm ${
                  i === active ? 'bg-primary/10 text-primary' : 'text-slate-300'
                }`}
              >
                <span>{c.label}</span>
                <span className="text-[10px] uppercase tracking-wider text-slate-600">{c.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
