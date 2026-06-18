import { site } from '../config/site.js'

const SOCIAL = [
  { icon: 'fab fa-github', label: 'GitHub', href: site.links.github },
  { icon: 'fab fa-linkedin', label: 'LinkedIn', href: site.links.linkedin },
  { icon: 'fas fa-envelope', label: 'Email', href: `mailto:${site.links.email}` },
  { icon: 'fab fa-facebook-f', label: 'Facebook', href: site.links.facebook },
  { icon: 'fas fa-globe', label: 'Website', href: site.links.website },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 text-center">
      <div className="mb-5 flex justify-center gap-4">
        {SOCIAL.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
            className="glass grid h-11 w-11 place-items-center rounded-full text-slate-300 transition-colors hover:text-primary">
            <i className={s.icon} aria-hidden="true" />
          </a>
        ))}
      </div>
      <p className="font-mono text-sm text-slate-500">
        <span className="text-amber">$</span> echo "© {new Date().getFullYear()} {site.name}"
      </p>
      <p className="mt-2 font-mono text-xs text-slate-600">
        {site.role} · open to opportunities <span className="term-cursor align-middle">&nbsp;</span>
      </p>
    </footer>
  )
}
