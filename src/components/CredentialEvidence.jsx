export default function CredentialEvidence({ credential }) {
  const { badge, certificate, certificatePreview, title } = credential

  return (
    <div
      className={`grid overflow-hidden border-b border-line bg-panel-2 ${badge ? 'md:grid-cols-[240px_1fr]' : ''}`}
      data-certificate-only={badge ? undefined : 'true'}
    >
      {badge && (
        <div className="flex items-center justify-center border-b border-line bg-panel p-8 md:border-b-0 md:border-r">
          <img
            src={badge}
            alt={`${title} badge`}
            className="h-32 w-32 object-contain drop-shadow-sm"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <a
        href={certificate}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${title} certificate`}
        className="group relative block min-h-52 overflow-hidden bg-panel"
      >
        <img
          src={certificatePreview}
          alt={`${title} certificate preview`}
          className="h-full max-h-80 w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.015]"
          loading="lazy"
          decoding="async"
        />
        <span className="absolute bottom-3 right-3 rounded-md border border-line bg-panel/95 px-3 py-1.5 font-mono text-xs text-muted shadow-sm group-hover:text-primary">
          Open certificate <i className="fas fa-arrow-up-right-from-square ml-1" aria-hidden="true" />
        </span>
      </a>
    </div>
  )
}
