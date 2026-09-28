export function SocialIcon({ name, size = 18 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', 'aria-hidden': true } as const
  if (name === 'Instagram')
    return (
      <svg {...p} fill="none" stroke="currentColor" strokeWidth={1.6}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  if (name === 'TikTok')
    return (
      <svg {...p} fill="currentColor">
        <path d="M16.6 3c.4 2.3 1.9 3.8 4.2 4v3.1c-1.5 0-2.9-.4-4.2-1.2v6.4c0 3.5-2.8 6.2-6.3 6.2S4 18.8 4 15.3s2.8-6.2 6.3-6.2c.3 0 .7 0 1 .1v3.2c-.3-.1-.6-.2-1-.2-1.7 0-3.1 1.4-3.1 3.1s1.4 3.1 3.1 3.1 3.2-1.4 3.2-3.1V3h3.1z" />
      </svg>
    )
  return (
    <svg {...p} fill="currentColor">
      <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 9h3v12H3V9zm6 0h2.9v1.7c.4-.8 1.5-1.9 3.4-1.9 3.2 0 3.7 2.1 3.7 4.8V21h-3v-6.6c0-1.6 0-3.5-2.1-3.5s-2.5 1.7-2.5 3.4V21H9V9z" />
    </svg>
  )
}
