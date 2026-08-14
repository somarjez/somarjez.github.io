export default function Spotlight() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[5] hidden md:block"
      style={{
        background:
          'radial-gradient(360px circle at var(--spotlight-x) var(--spotlight-y), rgb(var(--color-primary) / 0.08), transparent 70%)',
      }}
    />
  )
}
