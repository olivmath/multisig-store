import { useReadContract, useWriteContract } from 'wagmi'
import { multiSigABI } from '@/lib/contracts/multiSigABI'

export function useMultiSig(multiSigAddress: `0x${string}` | undefined) {
  // Read: Get owners
  const { data: owners } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'getOwners',
    query: {
      enabled: !!multiSigAddress,
    },
  })

  // Read: Get required confirmations
  const { data: required } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'required',
    query: {
      enabled: !!multiSigAddress,
    },
  })

  // Read: Get transaction count
  const { data: txCount } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'txCount',
    query: {
      enabled: !!multiSigAddress,
    },
  })

  // Write: Submit transaction
  const { writeContract: submit } = useWriteContract()

  const submitTransaction = (destination: `0x${string}`, value: bigint, data: `0x${string}`) => {
    if (!multiSigAddress) return
    submit({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitTransaction',
      args: [destination, value, data],
    })
  }

  // Write: Confirm transaction
  const { writeContract: confirm, data: confirmTxHash } = useWriteContract()

  const confirmTransaction = (txId: bigint) => {
    if (!multiSigAddress) return
    confirm({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'confirmTransaction',
      args: [txId],
    })
  }

  // Write: Execute transaction
  const { writeContract: execute } = useWriteContract()

  const executeTransaction = (txId: bigint) => {
    if (!multiSigAddress) return
    execute({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'executeTransaction',
      args: [txId],
    })
  }

  return {
    owners: (owners as `0x${string}`[]) || [],
    required: required ? Number(required) : 0,
    txCount: txCount ? Number(txCount) : 0,
    submitTransaction,
    confirmTransaction,
    confirmTxHash,
    executeTransaction,
  }
}
