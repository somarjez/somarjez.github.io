import { useState } from 'react'
import Section from './ui/Section.jsx'
import Reveal from './ui/Reveal.jsx'
import Pagination from './ui/Pagination.jsx'
import CredentialCard from './CredentialCard.jsx'
import CredentialModal from './CredentialModal.jsx'
import { usePagination } from '../hooks/usePagination.js'
import { site } from '../config/site.js'

export default function Certifications() {
  const { page, setPage, pageCount, pageItems } = usePagination(site.certifications, 4)
  const [active, setActive] = useState(null)

  const goPage = (nextPage) => {
    setPage(nextPage)
    document.getElementById('certs')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section id="certs" title="Certifications" subtitle="Verified coursework, credentials, and professional development.">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {pageItems.map((credential, index) => (
          <Reveal key={credential.title} delay={index * 0.05}>
            <CredentialCard credential={credential} onOpen={() => setActive(credential)} />
          </Reveal>
        ))}
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={goPage} />

      <CredentialModal credential={active} onClose={() => setActive(null)} />
    </Section>
  )
}
