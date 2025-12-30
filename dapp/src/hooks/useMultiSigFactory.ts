import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { multiSigFactoryABI } from '../config/contracts/multiSigFactoryABI'
import { CONTRACTS, CREATION_FEE } from '../config/contracts/addresses'

export function useMultiSigFactory() {
  const { address: userAddress } = useAccount()
  const factoryAddress = CONTRACTS[sepolia.id].MultiSigFactory

  // Read user's multisigs (as owner, not just as creator)
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

  // Write: Create new multisig
  const { writeContract, data: hash, isPending } = useWriteContract()

  const createMultiSig = (owners: `0x${string}`[], required: number) => {
    writeContract({
      address: factoryAddress,
      abi: multiSigFactoryABI,
      functionName: 'createMultiSig',
      args: [owners, BigInt(required)],
      value: CREATION_FEE,
    })
  }

  // Wait for TX confirmation
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  return {
    userMultiSigs: (userMultiSigs as `0x${string}`[]) || [],
    createMultiSig,
    isCreating: isPending || isConfirming,
    isSuccess,
    refetchUserMultiSigs,
  }
}
