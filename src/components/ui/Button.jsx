const VARIANTS = {
  solid: 'bg-gradient-to-r from-primary to-accent text-ink hover:scale-[1.03]',
  outline: 'border border-line bg-panel/40 text-slate-200 hover:border-primary/60 hover:text-white',
}

export default function Button({ href, variant = 'solid', icon, trailingIcon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-transform ${VARIANTS[variant]}`}
    >
      {icon && <i className={icon} aria-hidden="true" />}
      <span>{children}</span>
      {trailingIcon && <i className={trailingIcon} aria-hidden="true" />}
    </a>
  )
}
