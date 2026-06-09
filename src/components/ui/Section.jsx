export default function Section({ id, title, subtitle, children }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-20 md:py-28">
      {title && (
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            <span className="gradient-text">{title}</span>
          </h2>
          {subtitle && <p className="mt-3 text-slate-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}
