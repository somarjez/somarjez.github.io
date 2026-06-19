import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import TiltCard from './ui/TiltCard.jsx'
import Pagination from './ui/Pagination.jsx'
import { usePagination } from '../hooks/usePagination.js'
import { site } from '../config/site.js'

export default function Certifications() {
  const { page, setPage, pageCount, pageItems } = usePagination(site.certifications, 4)

  const goPage = (p) => {
    setPage(p)
    document.getElementById('certs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section id="certs" title="Certifications" subtitle="Verified coursework and credentials">
      <div className="grid gap-6 md:grid-cols-2">
        {pageItems.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05}>
            <TiltCard className="surface flex h-full flex-col rounded-xl">
              <div className="flex items-center gap-2 border-b border-line px-5 py-3">
                <i className={`fas ${c.icon} text-primary`} aria-hidden="true" />
                <span className="font-mono text-sm text-slate-200">
                  <span className="text-amber">$</span> {c.title}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="font-mono text-xs text-slate-400">
                  <span className="text-primary">{c.issuer}</span>
                  {c.issued && <span className="text-slate-600"> · issued {c.issued}</span>}
                </div>
                {c.credentialId && (
                  <div className="mt-1 break-all font-mono text-[11px] text-slate-500">
                    id: {c.credentialId}
                  </div>
                )}

                {c.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{c.description}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {c.skills.map((s) => (
                    <span key={s} className="rounded-md border border-line bg-primary/5 px-2.5 py-1 font-mono text-xs text-accent">
                      {s}
                    </span>
                  ))}
                </div>

                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-1.5 self-start rounded-lg border border-line bg-panel/40 px-3 py-1.5 font-mono text-xs text-slate-200 transition-colors hover:border-primary/60 hover:text-primary"
                  >
                    <i className="fas fa-certificate" aria-hidden="true" />
                    Show credential
                    <i className="fas fa-arrow-up-right-from-square text-[10px]" aria-hidden="true" />
                  </a>
                )}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={goPage} />
    </Section>
  )
}
