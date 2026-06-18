import { useState } from 'react'
import Section from './ui/Section.jsx'
import { site } from '../config/site.js'

const CONTACTS = [
  { icon: 'fa-envelope', label: 'Email', value: site.links.email, href: `mailto:${site.links.email}` },
  { icon: 'fa-github', brand: true, label: 'GitHub', value: 'github.com/somarjez', href: site.links.github },
  { icon: 'fa-linkedin', brand: true, label: 'LinkedIn', value: 'Connect professionally', href: site.links.linkedin },
  { icon: 'fa-map-marker-alt', label: 'Location', value: site.location, href: null },
]

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('idle')
    const form = e.target
    const data = Object.fromEntries(new FormData(form))

    if (!site.formspreeId) {
      window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent(
        data.subject || 'Portfolio contact',
      )}&body=${encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)}`
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${site.formspreeId}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      if (!res.ok) throw new Error('send failed')
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
      window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent(
        data.subject || 'Portfolio contact',
      )}&body=${encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`)}`
    }
  }

  return (
    <Section id="contact" title="Let's Connect" subtitle="Open to opportunities and collaborations">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <p className="text-slate-300">
            Whether you have a project idea, need a development partner, or just want to talk tech — I'd love to hear from you.
          </p>
          {CONTACTS.map((c) => {
            const inner = (
              <div className="surface flex items-center gap-4 rounded-xl p-4">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <i className={`${c.brand ? 'fab' : 'fas'} ${c.icon}`} />
                </span>
                <div>
                  <div className="font-mono text-sm font-semibold">{c.label}</div>
                  <div className="text-sm text-slate-400">{c.value}</div>
                </div>
              </div>
            )
            return c.href ? (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer" className="block">{inner}</a>
            ) : (
              <div key={c.label}>{inner}</div>
            )
          })}
        </div>

        <form onSubmit={onSubmit} className="surface space-y-4 rounded-2xl p-6">
          <input name="name" required placeholder="Full Name" aria-label="Full Name"
            className="w-full rounded-lg border border-line bg-panel/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <input name="email" type="email" required placeholder="Email Address" aria-label="Email Address"
            className="w-full rounded-lg border border-line bg-panel/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <input name="subject" required placeholder="Subject" aria-label="Subject"
            className="w-full rounded-lg border border-line bg-panel/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <textarea name="message" required rows={5} placeholder="Your message…" aria-label="Your message"
            className="w-full rounded-lg border border-line bg-panel/40 px-4 py-2.5 text-sm outline-none focus:border-primary/60" />
          <button type="submit" disabled={status === 'sending'}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-ink transition-transform hover:scale-[1.02] disabled:opacity-60">
            <i className="fas fa-paper-plane mr-2" />
            {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent! ✓' : 'Send Message'}
          </button>
          <p role="status" aria-live="polite" className="text-center text-sm min-h-[1.25rem]">
            {status === 'sent' && <span className="text-green-400">Thanks — I'll get back to you soon!</span>}
            {status === 'error' && <span className="text-secondary">Send failed — opening your email client…</span>}
          </p>
        </form>
      </div>
    </Section>
  )
}
