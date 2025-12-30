import { useReadContracts } from 'wagmi'
import { multiSigABI } from '@/lib/contracts/multiSigABI'
import { useMemo } from 'react'

export function useWalletTransactionStats(walletAddress: `0x${string}` | undefined) {
  // Get transaction count
  const { data: txCountResult } = useReadContracts({
    contracts: [
      {
        address: walletAddress,
        abi: multiSigABI,
        functionName: 'txCount',
      },
    ],
    query: {
      enabled: !!walletAddress,
    },
  })

  const txCount = txCountResult?.[0]?.result ? Number(txCountResult[0].result) : 0

  // Get all transactions
  const transactionContracts = useMemo(() => {
    if (!walletAddress || txCount === 0) return []

    const contracts = []
    for (let i = 0; i < txCount; i++) {
      contracts.push({
        address: walletAddress,
        abi: multiSigABI,
        functionName: 'transactions',
        args: [BigInt(i)],
      })
    }
    return contracts
  }, [walletAddress, txCount])

  const { data: transactionsData } = useReadContracts({
    contracts: transactionContracts as any,
    query: {
      enabled: transactionContracts.length > 0,
    },
  })

  // Count pending transactions (not executed)
  const pendingCount = useMemo(() => {
    if (!transactionsData) return 0

    return transactionsData.filter((txResult) => {
      if (!txResult?.result) return false
      const tx = txResult.result as any
      return !tx.executed
    }).length
  }, [transactionsData])

  return {
    totalTransactions: txCount,
    pendingTransactions: pendingCount,
  }
}
