export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-dark to-darker">
      <div className="absolute inset-0 animate-float opacity-70"
        style={{
          background:
            'radial-gradient(circle at 20% 50%, rgba(0,217,255,0.15) 0%, transparent 50%),' +
            'radial-gradient(circle at 80% 20%, rgba(255,107,107,0.10) 0%, transparent 50%),' +
            'radial-gradient(circle at 40% 80%, rgba(78,205,196,0.12) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 animate-grid-move opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(45deg, transparent 49%, rgba(0,217,255,0.03) 50%, transparent 51%),' +
            'linear-gradient(-45deg, transparent 49%, rgba(78,205,196,0.03) 50%, transparent 51%)',
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
