function isHeadingVisible(id) {
  const el = document.getElementById(id)
  if (!el) return true
  const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80
  const top = el.getBoundingClientRect().top
  return top >= navH - 4 && top <= window.innerHeight * 0.6
}

export default function Pagination({ page, pageCount, onChange, scrollTargetId }) {
  if (pageCount <= 1) return null

  const btn =
    'rounded-md surface px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-muted'
  const numBtn = (active) =>
    `rounded-md surface px-3 py-1.5 font-mono text-sm transition-colors ${
      active ? 'text-primary' : 'text-muted hover:text-primary'
    }`

  const go = (next) => {
    if (next < 0 || next > pageCount - 1) return
    onChange(next)
    if (scrollTargetId && !isHeadingVisible(scrollTargetId)) {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') go(page - 1)
    if (e.key === 'ArrowRight') go(page + 1)
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination" onKeyDown={onKeyDown}>
      <button type="button" className={btn} onClick={() => go(page - 1)} disabled={page === 0}>
        ‹ prev
      </button>

      {pageCount <= 7 ? (
        <span className="flex items-center gap-1.5">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-current={page === i ? 'page' : undefined}
              aria-label={`Page ${i + 1}`}
              className={numBtn(page === i)}
              onClick={() => go(i)}
            >
              {i + 1}
            </button>
          ))}
        </span>
      ) : (
        <span className="font-mono text-sm text-muted" aria-live="polite">
          page {page + 1} / {pageCount}
        </span>
      )}

      <button type="button" className={btn} onClick={() => go(page + 1)} disabled={page === pageCount - 1}>
        next ›
      </button>
    </nav>
  )
}
