import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
  const reduce = useReducedMotion()

  return (
    <Section id="certs" title="Certifications" subtitle="Verified coursework, credentials, and professional development." variant="wide">
      <motion.div layout={!reduce}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={page}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.25 }}
            className="grid grid-cols-2 gap-5 lg:grid-cols-4"
          >
            {pageItems.map((credential, index) => (
              <Reveal key={credential.title} delay={index * 0.05}>
                <CredentialCard credential={credential} onOpen={() => setActive(credential)} />
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} scrollTargetId="certs" />

      <CredentialModal credential={active} onClose={() => setActive(null)} />
    </Section>
  )
}
