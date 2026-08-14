export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="section-band border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        {title && (
          <div className="mb-12 max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {title}
            </h2>
            {subtitle && <p className="mt-3 text-muted">{subtitle}</p>}
            <div className="mt-5 h-px w-16 bg-primary/60" />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
