'use client'

import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/lib/wagmi/config'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ReactNode } from 'react'

// Create a client outside the component to avoid re-creating it on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export function Providers({ children }: { children: ReactNode }) {
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
