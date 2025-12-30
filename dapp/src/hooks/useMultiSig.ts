import { useReadContract, useWriteContract } from 'wagmi'
import { multiSigABI } from '../config/contracts/multiSigABI'

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

  // Write: Submit ETH transaction
  const { writeContract: submitEth } = useWriteContract()

  const submitETH = (to: `0x${string}`, amount: bigint) => {
    if (!multiSigAddress) return
    submitEth({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitETH',
      args: [to, amount],
    })
  }

  // Write: Submit ERC20 transaction
  const { writeContract: submitErc20 } = useWriteContract()

  const submitERC20 = (token: `0x${string}`, to: `0x${string}`, amount: bigint) => {
    if (!multiSigAddress) return
    submitErc20({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitERC20',
      args: [token, to, amount],
    })
  }

  // Write: Submit custom transaction
  const { writeContract: submitCustom } = useWriteContract()

  const submitCustomTransaction = (to: `0x${string}`, value: bigint, data: `0x${string}`) => {
    if (!multiSigAddress) return
    submitCustom({
      address: multiSigAddress,
      abi: multiSigABI,
      functionName: 'submitCustom',
      args: [to, value, data],
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
    submitETH,
    submitERC20,
    submitCustomTransaction,
    confirmTransaction,
    confirmTxHash,
    executeTransaction,
  }
}
