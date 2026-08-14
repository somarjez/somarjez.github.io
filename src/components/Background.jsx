export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div
        className="absolute inset-0 animate-float opacity-50"
        style={{
          background:
            'radial-gradient(circle at 18% 20%, rgb(var(--color-primary) / 0.09) 0%, transparent 45%),' +
            'radial-gradient(circle at 82% 12%, rgb(var(--color-accent) / 0.08) 0%, transparent 45%),' +
            'radial-gradient(circle at 50% 88%, rgb(var(--color-green) / 0.06) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 animate-grid-move opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--color-primary) / 0.06) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgb(var(--color-primary) / 0.06) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  )
}
