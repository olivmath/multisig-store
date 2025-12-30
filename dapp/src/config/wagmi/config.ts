import { http, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'

const sepoliaRpcUrl = import.meta.env.VITE_SEPOLIA_RPC_URL

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
})
