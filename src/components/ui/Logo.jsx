// JZRL monogram: the four initials locked into a 2x2 grid inside a rounded
// terminal tile. Cyan on near-black to match the Tokyo Night theme.
export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="Jezreel Ramos (JZRL)"
    >
      <rect x="3" y="3" width="58" height="58" rx="15" fill="#0d1117" stroke="#7dcfff" strokeWidth="2.5" />
      {/* faint quadrant divider for the grid lockup */}
      <g stroke="#7dcfff" strokeOpacity="0.18" strokeWidth="1.5">
        <line x1="32" y1="14" x2="32" y2="50" />
        <line x1="14" y1="32" x2="50" y2="32" />
      </g>
      <g
        fontFamily="'JetBrains Mono','SFMono-Regular',ui-monospace,monospace"
        fontWeight="800"
        fill="#7dcfff"
        textAnchor="middle"
      >
        <text x="22" y="29" fontSize="19">J</text>
        <text x="43" y="29" fontSize="19">Z</text>
        <text x="22" y="52" fontSize="19">R</text>
        <text x="43" y="52" fontSize="19">L</text>
      </g>
    </svg>
  )
}
