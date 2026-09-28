import Image from 'next/image'

/*
  A photo slot.

  With a src it renders an optimized next/image, sized per device.
  Without one it renders an obvious placeholder: dashed border, a photo icon
  and the alt text, so it reads as "photo missing" instead of a purple slab.

  To fill one: drop the file in /public/photos and set `src` in lib/site.ts.
*/
/**
 * Note: the wrapper only adds `relative` when the caller hasn't passed its own
 * position class. Hardcoding `relative` used to override an incoming
 * `absolute`, which silently broke the overlapping collage on the home page.
 */
export default function PhotoFrame({
  src,
  alt,
  className = '',
  style,
  sizes = '(min-width: 1024px) 400px, 80vw',
  priority,
}: {
  src: string | null
  alt: string
  className?: string
  style?: React.CSSProperties
  sizes?: string
  priority?: boolean
}) {
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className)
  return (
    <figure
      className={`${positioned ? '' : 'relative'} m-0 overflow-hidden rounded-3xl ${src ? 'border border-peri/20' : ''} ${className}`}
      style={src ? { boxShadow: '0 20px 50px rgba(0,0,0,0.45)', ...style } : style}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={`${alt} (foto pendiente)`}
          className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-peri/35 px-4 text-center"
          style={{ background: 'rgba(71, 18, 107, 0.28)' }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-peri/50">
            <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="17.6" cy="8.4" r="1" fill="currentColor" />
          </svg>
          <span className="text-[11px] font-light uppercase tracking-[0.18em] text-peri/60">Foto pendiente</span>
          <span className="max-w-[18ch] text-[11px] font-light leading-snug text-white/40">{alt}</span>
        </div>
      )}
    </figure>
  )
}
