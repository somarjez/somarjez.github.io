export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      {/* Divider between sections */}
      <div className="mb-14 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
        <span className="h-1.5 w-1.5 rotate-45 bg-line" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
      </div>

      {title && (
        <div className="mb-12 max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-slate-50 md:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
          <div className="mt-5 h-px w-16 bg-primary/60" />
        </div>
      )}
      {children}
    </section>
  )
}
