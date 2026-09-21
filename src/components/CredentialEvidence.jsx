import ImageCarousel from './ui/ImageCarousel.jsx'

export default function CredentialEvidence({ credential }) {
  const { badge, certificate, certificatePreview, certificatePreviews, title } = credential
  const previews = certificatePreviews || [certificatePreview]

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
        <ImageCarousel images={previews} title={title} noun="certificate preview" imgClass="max-h-[28rem]" />
        <a href={certificate} target="_blank" rel="noreferrer" aria-label={`Open ${title} certificate`} className="absolute bottom-5 right-5 rounded-md border border-line bg-panel/95 px-3 py-1.5 font-mono text-xs text-muted shadow-sm hover:text-primary">
          Open certificate <i className="fas fa-arrow-up-right-from-square ml-1" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
