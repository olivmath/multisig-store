import { sepolia } from 'wagmi/chains'

const factoryAddress = import.meta.env.VITE_MULTISIG_FACTORY_ADDRESS

export const CONTRACTS = {
  [sepolia.id]: {
    MultiSigFactory: factoryAddress as `0x${string}`,
  },
}

export const CREATION_FEE = BigInt(0)
