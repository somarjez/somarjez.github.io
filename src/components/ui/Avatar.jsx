import { useState } from 'react'

// Shows the image when it loads; falls back to a monogram so the layout never
// breaks if the photo is missing or fails to load.
export default function Avatar({ src, alt, initials, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`grid place-items-center bg-primary/10 font-display text-xl font-bold text-primary ${className}`}
    >
      {initials}
    </div>
  )
}
