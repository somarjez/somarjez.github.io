import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import Pagination from './ui/Pagination.jsx'
import CredentialEvidence from './CredentialEvidence.jsx'
import { usePagination } from '../hooks/usePagination.js'
import { site } from '../config/site.js'

export default function Certifications() {
  const { page, setPage, pageCount, pageItems } = usePagination(site.certifications, 2)

  const goPage = (nextPage) => {
    setPage(nextPage)
    document.getElementById('certs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section id="certs" title="Certifications" subtitle="Verified coursework, credentials, and professional development.">
      <div className="space-y-10">
        {pageItems.map((credential, index) => (
          <Reveal key={credential.title} delay={index * 0.05}>
            <article className="surface overflow-hidden rounded-xl">
              <CredentialEvidence credential={credential} />
              <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_280px]">
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">{credential.title}</h3>
                  <p className="mt-2 font-mono text-sm text-primary">
                    {credential.issuer}
                    {credential.issued && <span className="text-muted"> · {credential.issued}</span>}
                  </p>
                  <p className="mt-5 max-w-[65ch] leading-relaxed text-muted">{credential.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {credential.skills.map((skill) => (
                      <span key={skill} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-end gap-3 font-mono text-xs">
                  {credential.credentialId && <p className="break-all text-subtle">id: {credential.credentialId}</p>}
                  {credential.controlNumber && <p className="break-all text-subtle">control: {credential.controlNumber}</p>}
                  {credential.url && (
                    <a
                      href={credential.url}
                      target="_blank"
                      rel="noreferrer"
                      className="self-start rounded-lg border border-line bg-panel px-3 py-2 text-muted hover:border-primary/60 hover:text-primary"
                    >
                      Verify official record
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={goPage} />
    </Section>
  )
}
