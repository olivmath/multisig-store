import { createRoot } from "react-dom/client";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from "./App.tsx";
import "./index.css";
import { config } from './lib/wagmi/config'
import { NotificationProvider } from './contexts/NotificationContext'

// Enable dark mode by default for the black/gold aesthetic
document.documentElement.classList.add("dark");

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <WagmiProvider config={config}>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </WagmiProvider>
  </QueryClientProvider>
);
