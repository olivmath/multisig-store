import { useReadContract, useReadContracts } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { multiSigFactoryABI } from '@/lib/contracts/multiSigFactoryABI'
import { multiSigABI } from '@/lib/contracts/multiSigABI'
import { CONTRACTS } from '@/lib/contracts/addresses'
import { useMemo } from 'react'

export function useGlobalStats() {
  const factoryAddress = CONTRACTS[sepolia.id].MultiSigFactory

  // Get all deployed multisigs
  const { data: allMultiSigs } = useReadContract({
    address: factoryAddress,
    abi: multiSigFactoryABI,
    functionName: 'getDeployedMultiSigs',
  })

  const multiSigAddresses = (allMultiSigs as `0x${string}`[]) || []
  const activeWallets = multiSigAddresses.length

  // Build contracts array for multicall
  const contracts = useMemo(() => {
    const calls = []
    for (const address of multiSigAddresses) {
      calls.push({
        address,
        abi: multiSigABI,
        functionName: 'getOwners',
      })
      calls.push({
        address,
        abi: multiSigABI,
        functionName: 'txCount',
      })
    }
    return calls
  }, [multiSigAddresses])

  // Fetch all data with multicall
  const { data: results } = useReadContracts({
    contracts: contracts as any,
    query: {
      enabled: contracts.length > 0,
    },
  })

  // Process results
  const { uniqueOwners, totalTransactions } = useMemo(() => {
    if (!results || results.length === 0) {
      return { uniqueOwners: 0, totalTransactions: 0 }
    }

    const allOwnersSet = new Set<string>()
    let txTotal = 0

    for (let i = 0; i < results.length; i += 2) {
      // owners result
      const ownersResult = results[i]
      if (ownersResult?.result) {
        const owners = ownersResult.result as `0x${string}`[]
        owners.forEach(owner => allOwnersSet.add(owner.toLowerCase()))
      }

      // txCount result
      const txCountResult = results[i + 1]
      if (txCountResult?.result) {
        txTotal += Number(txCountResult.result)
      }
    }

    return {
      uniqueOwners: allOwnersSet.size,
      totalTransactions: txTotal,
    }
  }, [results])

  return {
    activeWallets,
    uniqueOwners,
    totalTransactions,
  }
}
