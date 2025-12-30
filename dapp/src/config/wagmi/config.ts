import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'

const sepoliaRpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL
const walletConnectProjectId = import.meta.env.VITE_WC_PROJECT_ID

export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    }),
  ],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
})
