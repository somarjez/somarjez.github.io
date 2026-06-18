export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      {title && (
        <div className="mb-12 text-center">
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-primary/70">// {id || 'section'}</p>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && <p className="mt-3 font-mono text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
