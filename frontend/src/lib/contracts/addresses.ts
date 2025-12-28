import { sepolia } from 'viem/chains'

export const CONTRACTS = {
  [sepolia.id]: {
    MultiSigFactory: '0x0AD969705210C5C7693848F243Be805C55A99e06' as `0x${string}`,
    Token: '0x' as `0x${string}`, // TODO: Deploy Token TK1 to Sepolia
  },
} as const

export const CREATION_FEE = BigInt('10000000000000000') // 0.01 ETH
