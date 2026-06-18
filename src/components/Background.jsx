export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-b from-[#0a0e14] via-[#0a0e14] to-[#070a0f]">
      <div
        className="absolute inset-0 animate-float opacity-70"
        style={{
          background:
            'radial-gradient(circle at 18% 20%, rgba(125,207,255,0.10) 0%, transparent 45%),' +
            'radial-gradient(circle at 82% 12%, rgba(187,154,247,0.10) 0%, transparent 45%),' +
            'radial-gradient(circle at 50% 88%, rgba(158,206,106,0.06) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 animate-grid-move opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(125,207,255,0.04) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(125,207,255,0.04) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="scanlines absolute inset-0 opacity-60" />
    </div>
  )
}
