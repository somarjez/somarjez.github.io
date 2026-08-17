import { useEffect } from 'react'

export default function Lightbox({ open, title, src, alt, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${title} screenshot`} onClick={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="relative max-h-[92vh] max-w-6xl rounded-xl border border-slate-700 bg-slate-900 p-2 shadow-2xl">
        <button type="button" onClick={onClose} aria-label="Close image viewer" className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg border border-slate-600 bg-slate-900/90 text-slate-200 hover:border-primary hover:text-primary">
          <i className="fas fa-xmark" aria-hidden="true" />
        </button>
        <img src={src} alt={alt} className="max-h-[86vh] max-w-full object-contain" />
      </div>
    </div>
  )
}
