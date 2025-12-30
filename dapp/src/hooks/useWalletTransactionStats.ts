import { useReadContracts } from 'wagmi'
import { multiSigABI } from '@/config/contracts/multiSigABI'
import { useMemo } from 'react'

export function useWalletTransactionStats(walletAddress: `0x${string}` | undefined) {
  // Get transaction count - refetch every 3 seconds to catch new transactions
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
      refetchInterval: 3000, // Refetch every 3 seconds
      refetchOnWindowFocus: true,
      staleTime: 0, // Always consider data stale
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
      refetchInterval: 3000, // Refetch every 3 seconds to catch status changes
      refetchOnWindowFocus: true,
      staleTime: 0, // Always consider data stale
    },
  })

  // Count pending transactions (not executed)
  const pendingCount = useMemo(() => {
    if (!transactionsData) return 0

    const pending = transactionsData.filter((txResult) => {
      if (!txResult?.result) return false
      // Transaction result is an array: [txType, token, to, amount, executed, data]
      const tx = txResult.result as any[]
      const executed = tx[4] as boolean  // Index 4 is the executed field
      return !executed
    }).length

    console.log('[useWalletTransactionStats] Recalculating pending count:', {
      walletAddress,
      totalTx: transactionsData.length,
      pendingTx: pending,
      rawData: transactionsData.map(r => ({
        result: r?.result,
        executed: r?.result ? (r.result as any[])[4] : undefined
      })),
      timestamp: new Date().toISOString()
    })

    return pending
  }, [transactionsData, walletAddress])

  return {
    totalTransactions: txCount,
    pendingTransactions: pendingCount,
  }
}
