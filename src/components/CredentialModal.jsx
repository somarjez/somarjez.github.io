import { useEffect } from 'react'
import CredentialEvidence from './CredentialEvidence.jsx'

export default function CredentialModal({ credential, onClose }) {
  useEffect(() => {
    if (!credential) return undefined
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [credential, onClose])

  if (!credential) return null

  const { title, issuer, issued, description, skills, credentialId, controlNumber, url } = credential

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/90 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} details`}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div className="surface relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close credential details"
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-lg border border-line bg-panel/95 text-muted hover:border-primary hover:text-primary"
        >
          <i className="fas fa-xmark" aria-hidden="true" />
        </button>
        <CredentialEvidence credential={credential} />
        <div className="p-6 md:p-8">
          <h3 className="font-display text-2xl font-bold text-foreground">{title}</h3>
          <p className="mt-2 font-mono text-sm text-primary">
            {issuer}
            {issued && <span className="text-muted"> · {issued}</span>}
          </p>
          <p className="mt-5 max-w-[65ch] leading-relaxed text-muted">{description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs">
            {credentialId && <p className="break-all text-subtle">id: {credentialId}</p>}
            {controlNumber && <p className="break-all text-subtle">control: {controlNumber}</p>}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-line bg-panel px-3 py-2 text-muted hover:border-primary/60 hover:text-primary"
              >
                Verify official record
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
