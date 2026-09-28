import type { Metadata, Viewport } from 'next'
import '@fontsource-variable/raleway/wght.css'
import '@fontsource-variable/raleway/wght-italic.css'
import '@fontsource-variable/playfair-display/wght.css'
import './globals.css'
import Atmosphere from '@/components/Atmosphere'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MotionGovernor from '@/components/MotionGovernor'
import Lumi from '@/components/Lumi'
import RegisterPrompt from '@/components/RegisterPrompt'

export const metadata: Metadata = {
  title: {
    default: 'WIT · Women in Technology',
    template: '%s · WIT',
  },
  description:
    'Women in Technology es un grupo estudiantil del Tecnológico de Monterrey, Campus Monterrey, que busca atender la brecha de género en el ámbito de la tecnología.',
  // Link preview shown in WhatsApp, iMessage, LinkedIn, Slack and Instagram DMs.
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: 'WIT · Women in Technology',
    title: 'WIT · Women in Technology',
    description: 'Tech needs WIT. Grupo estudiantil del Tecnológico de Monterrey, Campus Monterrey.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'WIT · Women in Technology' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
}

export const viewport: Viewport = {
  themeColor: '#080414',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen overflow-x-hidden">
        <a
          href="#contenido"
          className="fixed left-3 top-3 z-[100] -translate-y-[150%] rounded-md bg-white px-3 py-2 text-sm font-semibold text-night focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <Atmosphere />
        <MotionGovernor />
        <Nav />
        <main id="contenido">{children}</main>
        <Lumi />
        <RegisterPrompt />
        <Footer />
      </body>
    </html>
  )
}
