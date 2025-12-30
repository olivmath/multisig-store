import type { Metadata } from 'next'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/700.css'
import '../index.css'
import { Providers } from '@/components/Providers'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: 'MultiSigStore - Secure Multi-Signature Wallets',
  description: 'Buy your secure multisig digital wallets. Protect your shared assets with multiple signatures.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
