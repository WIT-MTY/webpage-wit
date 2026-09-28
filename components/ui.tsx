import Link from 'next/link'

type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'glass'
  external?: boolean
  className?: string
}

/** The landing page's two pill buttons: glowing gradient, and glass. */
export function Button({ href, children, variant = 'primary', external, className = '' }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-9 py-3.5 text-[12px] font-medium uppercase tracking-[0.2em] no-underline transition-transform duration-200 hover:-translate-y-0.5'
  const styles =
    variant === 'primary'
      ? 'text-white bg-[linear-gradient(135deg,#7c22c7_0%,#47126b_100%)] shadow-[0_0_30px_rgba(124,34,199,0.45),0_4px_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_45px_rgba(124,34,199,0.65),0_8px_30px_rgba(0,0,0,0.4)]'
      : 'glass-strong text-white/90 hover:bg-white/16'
  const cls = `${base} ${styles} ${className}`

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

/** Small tracked label, used once per section at most. */
export function MicroLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`m-0 text-[10px] font-normal uppercase tracking-[0.6em] text-peri/60 ${className}`}>{children}</p>
  )
}

export function Heading({
  children,
  as: Tag = 'h2',
  className = '',
}: {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}) {
  return (
    <Tag
      className={`m-0 font-display font-extrabold leading-[1.02] tracking-[-0.01em] text-white ${className}`}
      style={{ textShadow: '0 0 40px rgba(139,48,208,0.35)' }}
    >
      {children}
    </Tag>
  )
}

/** Thin fading rule from the landing page. */
export function Rule({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-px w-20 ${className}`}
      style={{ background: 'linear-gradient(to right, transparent, rgba(198,200,238,0.35), transparent)' }}
    />
  )
}

export function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-6 lg:px-10 ${className}`}>{children}</div>
}
