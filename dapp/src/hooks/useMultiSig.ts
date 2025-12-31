import { useReadContract, useWriteContract } from 'wagmi'
import { multiSigABI } from '../config/contracts/multiSigABI'
import { useDemoModeOptional } from '../tutorial/DemoModeContext'

export function useMultiSig(multiSigAddress: `0x${string}` | undefined) {
  const demoMode = useDemoModeOptional()

  // Read: Get owners
  const { data: owners } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'getOwners',
    query: {
      enabled: !!multiSigAddress && !demoMode,
    },
  })

  // Read: Get required confirmations
  const { data: required } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'required',
    query: {
      enabled: !!multiSigAddress && !demoMode,
    },
  })

  // Read: Get transaction count
  const { data: txCount } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'txCount',
    query: {
      enabled: !!multiSigAddress && !demoMode,
    },
  })

  // Write: Submit transactions (shared hook to track tx hash)
  const { writeContract: submitTx, data: submitTxHash } = useWriteContract()

  const submitETH = (to: `0x${string}`, amount: bigint) => {
    if (demoMode) {
      demoMode.createTransaction()
      return
    }
    if (!multiSigAddress) return
    submitTx({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitETH',
      args: [to, amount],
    })
  }

  const submitERC20 = (token: `0x${string}`, to: `0x${string}`, amount: bigint) => {
    if (demoMode) {
      demoMode.createTransaction()
      return
    }
    if (!multiSigAddress) return
    submitTx({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitERC20',
      args: [token, to, amount],
    })
  }

  const submitCustomTransaction = (to: `0x${string}`, value: bigint, data: `0x${string}`) => {
    if (demoMode) {
      demoMode.createTransaction()
      return
    }
    if (!multiSigAddress) return
    submitTx({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitCustom',
      args: [to, value, data],
    })
  }

  // Write: Confirm transaction
  const { writeContract: confirm, data: confirmTxHash } = useWriteContract()

  const confirmTransaction = (txId: bigint) => {
    if (demoMode) {
      demoMode.confirmTransaction()
      return
    }
    if (!multiSigAddress) return
    confirm({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'confirmTransaction',
      args: [txId],
    })
  }

  // Demo mode: return mock data
  if (demoMode && multiSigAddress) {
    const walletData = demoMode.getWalletData(multiSigAddress)
    return {
      owners: walletData?.owners || [],
      required: walletData?.required || 0,
      txCount: walletData?.txCount || 0,
      submitETH,
      submitERC20,
      submitCustomTransaction,
      submitTxHash: undefined,
      confirmTransaction,
      confirmTxHash: undefined,
    }
  }

  return {
    owners: (owners as `0x${string}`[]) || [],
    required: required ? Number(required) : 0,
    txCount: txCount ? Number(txCount) : 0,
    submitETH,
    submitERC20,
    submitCustomTransaction,
    submitTxHash,
    confirmTransaction,
    confirmTxHash,
  }
}
