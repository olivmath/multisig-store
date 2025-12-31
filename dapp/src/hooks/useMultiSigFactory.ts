import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { multiSigFactoryABI } from '../config/contracts/multiSigFactoryABI'
import { CONTRACTS, CREATION_FEE } from '../config/contracts/addresses'
import { useDemoModeOptional } from '../tutorial/DemoModeContext'

export function useMultiSigFactory() {
  const demoMode = useDemoModeOptional()
  const { address: userAddress } = useAccount()
  const factoryAddress = CONTRACTS[sepolia.id].MultiSigFactory

  // Read user's multisigs (as owner, not just as creator)
  const { data: userMultiSigs, refetch: refetchUserMultiSigs } = useReadContract({
    address: factoryAddress,
    abi: multiSigFactoryABI,
    functionName: 'getOwnerMultiSigs',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !demoMode,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  })

  // Write: Create new multisig
  const { writeContract, data: hash, isPending } = useWriteContract()

  const createMultiSig = (owners: `0x${string}`[], required: number) => {
    if (demoMode) {
      demoMode.createWallet()
      return
    }
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

  // Demo mode: return mock data
  if (demoMode) {
    return {
      userMultiSigs: demoMode.wallets.map(w => w.address),
      createMultiSig,
      isCreating: false,
      isSuccess: demoMode.newWalletCreated,
      refetchUserMultiSigs: () => Promise.resolve({ data: undefined }),
    }
  }

  return {
    userMultiSigs: (userMultiSigs as `0x${string}`[]) || [],
    createMultiSig,
    isCreating: isPending || isConfirming,
    isSuccess,
    refetchUserMultiSigs,
  }
}
