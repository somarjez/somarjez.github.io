import { useState } from 'react'
import Lightbox from './ui/Lightbox.jsx'

export default function CredentialEvidence({ credential }) {
  const { badge, certificate, certificatePreview, title } = credential
  const [previewOpen, setPreviewOpen] = useState(false)

  return (
    <div
      className={`grid overflow-hidden border-b border-line bg-panel-2 ${badge ? 'md:grid-cols-[minmax(220px,30%)_1fr]' : ''}`}
      data-certificate-only={badge ? undefined : 'true'}
    >
      {badge && (
        <div data-badge-panel className="flex min-h-52 items-center justify-center border-b border-line bg-panel p-8 md:border-b-0 md:border-r">
          <img
            src={badge}
            alt={`${title} badge`}
            className="h-40 w-40 object-contain drop-shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="relative min-h-64 overflow-hidden bg-panel p-3">
        <button type="button" onClick={() => setPreviewOpen(true)} aria-label={`View full ${title} certificate preview`} className="group block h-full w-full cursor-zoom-in text-left">
        <img
          src={certificatePreview}
          alt={`${title} certificate preview`}
          className="h-full max-h-[28rem] w-full object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
          decoding="async"
        />
        </button>
        <a href={certificate} target="_blank" rel="noreferrer" aria-label={`Open ${title} certificate`} className="absolute bottom-5 right-5 rounded-md border border-line bg-panel/95 px-3 py-1.5 font-mono text-xs text-muted shadow-sm hover:text-primary">
          Open certificate <i className="fas fa-arrow-up-right-from-square ml-1" aria-hidden="true" />
        </a>
        <Lightbox open={previewOpen} title={title} src={certificatePreview} alt={`${title} full certificate preview`} onClose={() => setPreviewOpen(false)} />
      </div>
    </div>
  )
}
