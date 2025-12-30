'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi/config'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
