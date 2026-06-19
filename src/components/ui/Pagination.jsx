export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null

  const btn =
    'rounded-md surface px-3 py-1.5 font-mono text-sm text-slate-300 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-300'

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <button type="button" className={btn} onClick={() => onChange(page - 1)} disabled={page === 0}>
        ‹ prev
      </button>
      <span className="font-mono text-sm text-slate-500" aria-live="polite">
        page {page + 1} / {pageCount}
      </span>
      <button type="button" className={btn} onClick={() => onChange(page + 1)} disabled={page === pageCount - 1}>
        next ›
      </button>
    </nav>
  )
}
