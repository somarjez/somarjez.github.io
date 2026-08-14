const VARIANTS = {
  solid: 'bg-primary text-ink hover:scale-[1.03] hover:bg-primary-dark',
  outline: 'border border-line bg-panel text-muted hover:border-primary/60 hover:text-primary',
}

export default function Button({ href, variant = 'solid', icon, trailingIcon, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${VARIANTS[variant]}`}
    >
      {icon && <i className={icon} aria-hidden="true" />}
      <span>{children}</span>
      {trailingIcon && <i className={trailingIcon} aria-hidden="true" />}
    </a>
  )
}
