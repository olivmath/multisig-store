import { http, createConfig } from 'wagmi'
import { sepolia, foundry } from 'wagmi/chains'
import { injected, walletConnect } from '@wagmi/connectors'

const sepoliaRpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL
const walletConnectProjectId = import.meta.env.VITE_WC_PROJECT_ID

// Anvil uses the same chain config as foundry (id: 31337)
export const anvil = {
  ...foundry,
  name: 'Anvil',
}

const connectors = []

// Always add injected connector (MetaMask, etc)
connectors.push(injected())

// Only add WalletConnect if projectId is configured
if (walletConnectProjectId) {
  connectors.push(
    walletConnect({
      projectId: walletConnectProjectId,
      metadata: {
        name: 'MultiSigStore',
        description: 'Secure Multi-Signature Digital Wallets',
        url: 'https://multisigstore.vercel.app',
        icons: ['https://multisigstore.vercel.app/favicon.ico'],
      },
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-z-index': '9999',
        },
      },
    })
  )
}

export const config = createConfig({
  chains: [sepolia, anvil],
  connectors,
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
    [anvil.id]: http('http://127.0.0.1:8545'),
  },
})
