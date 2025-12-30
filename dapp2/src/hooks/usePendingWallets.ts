import { useReadContracts, useAccount } from 'wagmi'
import { multiSigABI } from '@/lib/contracts/multiSigABI'
import { useMemo } from 'react'

interface PendingWallet {
  id: string
  name: string
  address: string
  pendingCount: number
}

export function usePendingWallets(walletAddresses: `0x${string}`[]) {
  const { address: userAddress } = useAccount()

  // Build contracts array to fetch all transactions data
  const contracts = useMemo(() => {
    const calls = []
    for (const walletAddress of walletAddresses) {
      // Get txCount for each wallet
      calls.push({
        address: walletAddress,
        abi: multiSigABI,
        functionName: 'txCount',
      })
    }
    return calls
  }, [walletAddresses])

  // Fetch transaction counts
  const { data: txCountResults } = useReadContracts({
    contracts: contracts as any,
    query: {
      enabled: contracts.length > 0,
    },
  })

  // For each wallet, check transactions that need confirmation
  const txCheckContracts = useMemo(() => {
    if (!txCountResults) return []

    const calls = []
    for (let i = 0; i < walletAddresses.length; i++) {
      const walletAddress = walletAddresses[i]
      const txCountResult = txCountResults[i]

      if (txCountResult?.result) {
        const txCount = Number(txCountResult.result)

        // For each transaction, check if it needs user confirmation
        for (let txId = 0; txId < txCount; txId++) {
          // Check if transaction is executed
          calls.push({
            address: walletAddress,
            abi: multiSigABI,
            functionName: 'transactions',
            args: [BigInt(txId)],
          })
          // Check if user has confirmed
          calls.push({
            address: walletAddress,
            abi: multiSigABI,
            functionName: 'confirmations',
            args: userAddress ? [BigInt(txId), userAddress] : undefined,
          })
        }
      }
    }
    return calls
  }, [walletAddresses, txCountResults, userAddress])

  // Fetch transaction details and user confirmations
  const { data: txDetailsResults } = useReadContracts({
    contracts: txCheckContracts as any,
    query: {
      enabled: txCheckContracts.length > 0 && !!userAddress,
    },
  })

  // Process results to find pending wallets
  const pendingWallets: PendingWallet[] = useMemo(() => {
    if (!txCountResults || !txDetailsResults || !userAddress) return []

    const pendingMap = new Map<string, number>()

    let resultIndex = 0
    for (let i = 0; i < walletAddresses.length; i++) {
      const walletAddress = walletAddresses[i]
      const txCountResult = txCountResults[i]

      if (txCountResult?.result) {
        const txCount = Number(txCountResult.result)

        for (let txId = 0; txId < txCount; txId++) {
          const txResult = txDetailsResults[resultIndex]
          const confirmationResult = txDetailsResults[resultIndex + 1]
          resultIndex += 2

          if (txResult?.result && confirmationResult !== undefined) {
            const tx = txResult.result as any
            const hasUserConfirmed = confirmationResult.result as boolean

            // Count if transaction is not executed and user hasn't confirmed
            if (!tx.executed && !hasUserConfirmed) {
              const current = pendingMap.get(walletAddress) || 0
              pendingMap.set(walletAddress, current + 1)
            }
          }
        }
      }
    }

    return Array.from(pendingMap.entries()).map(([address, count]) => ({
      id: address,
      name: `Wallet ${address.slice(0, 6)}...${address.slice(-4)}`,
      address,
      pendingCount: count,
    }))
  }, [walletAddresses, txCountResults, txDetailsResults, userAddress])

  return pendingWallets
}
