import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'

const sepoliaRpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL
const walletConnectProjectId = import.meta.env.VITE_WC_PROJECT_ID

const connectors = []

// Always add injected connector (MetaMask, etc)
connectors.push(injected())

// Only add WalletConnect if projectId is configured
if (walletConnectProjectId) {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      showQrModal: true,
    })
  )
}

export const config = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
})
