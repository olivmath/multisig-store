import { useAccount, useReadContract } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { multiSigFactoryABI } from '../config/contracts/multiSigFactoryABI'
import { CONTRACTS } from '../config/contracts/addresses'

export function useMultiSigFactory() {
  const { address: userAddress } = useAccount()
  const factoryAddress = CONTRACTS[sepolia.id].MultiSigFactory

  const { data: userMultiSigs, refetch: refetchUserMultiSigs } = useReadContract({
    address: factoryAddress,
    abi: multiSigFactoryABI,
    functionName: 'getOwnerMultiSigs',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  })

  return {
    userMultiSigs: (userMultiSigs as `0x${string}`[]) || [],
    refetchUserMultiSigs,
  }
}
