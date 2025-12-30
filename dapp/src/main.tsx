import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import './index.css'
import App from './App'
import { config } from './config/wagmi/config'
import { NotificationProvider } from './contexts/NotificationContext'
import { TutorialProvider } from './contexts/TutorialContext'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <NotificationProvider>
            <TutorialProvider>
              <App />
            </TutorialProvider>
          </NotificationProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
