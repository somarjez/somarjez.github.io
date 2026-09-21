import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lightbox from './Lightbox.jsx'

// Swipeable image strip. One image renders like a plain zoomable image; several
// scroll sideways (touch/trackpad swipe, arrows, dots). Click opens the Lightbox.
export default function ImageCarousel({ images, title, noun, imgClass = '', caption }) {
  const reduce = useReducedMotion()
  const trackRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const count = images.length
  const multi = count > 1

  const scrollTo = (next) => {
    const track = trackRef.current
    const clamped = Math.max(0, Math.min(count - 1, next))
    setIndex(clamped)
    if (track?.scrollTo) track.scrollTo({ left: clamped * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' })
  }

  const onScroll = (event) => {
    const { scrollLeft, clientWidth } = event.currentTarget
    if (clientWidth) setIndex(Math.round(scrollLeft / clientWidth))
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); scrollTo(index + 1) }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); scrollTo(index - 1) }
  }

  const arrow = 'absolute top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-panel/90 text-muted shadow-md backdrop-blur transition-colors hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-30'

  return (
    <div
      className="relative"
      role={multi ? 'group' : undefined}
      aria-roledescription={multi ? 'carousel' : undefined}
      aria-label={multi ? `${title} ${noun}s` : undefined}
      onKeyDown={multi ? onKeyDown : undefined}
    >
      <div
        ref={trackRef}
        onScroll={multi ? onScroll : undefined}
        className={`flex h-full w-full overflow-x-auto ${multi ? 'snap-x snap-mandatory' : ''} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
      >
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => { setIndex(i); setLightboxOpen(true) }}
            aria-label={`View full ${title} ${noun}`}
            className="group block w-full shrink-0 cursor-zoom-in snap-center text-left"
          >
            <img
              src={src}
              alt={multi ? `${title} ${noun} ${i + 1} of ${count}` : `${title} ${noun}`}
              className={`w-full object-contain transition-transform duration-500 group-hover:scale-[1.01] ${imgClass}`}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {multi && (
        <>
          <button type="button" onClick={() => scrollTo(index - 1)} disabled={index === 0} aria-label={`Previous ${noun}`} className={`${arrow} left-2`}>
            <i className="fas fa-chevron-left text-xs" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => scrollTo(index + 1)} disabled={index === count - 1} aria-label={`Next ${noun}`} className={`${arrow} right-2`}>
            <i className="fas fa-chevron-right text-xs" aria-hidden="true" />
          </button>
          <div className="mt-2 flex items-center justify-center gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Show ${noun} ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-5 bg-primary' : 'w-2 bg-line-bright hover:bg-primary/60'}`}
              />
            ))}
          </div>
        </>
      )}

      {caption && (
        <span className="mt-2 block text-center font-mono text-xs text-muted">
          {multi ? `${index + 1} / ${count} · ${caption}` : caption}
        </span>
      )}

      <Lightbox open={lightboxOpen} title={title} src={images[index]} alt={`${title} full ${noun}`} onClose={() => setLightboxOpen(false)} />
    </div>
  )
}
