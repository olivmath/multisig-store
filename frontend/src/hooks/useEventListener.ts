import { useWatchContractEvent } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { multiSigABI } from '@/lib/contracts/multiSigABI'

export function useMultiSigEvents(multiSigAddress: `0x${string}` | undefined) {
  const queryClient = useQueryClient()

  // Listen for SubmitTransaction events
  useWatchContractEvent({
    address: multiSigAddress,
    abi: multiSigABI,
    eventName: 'SubmitTransaction',
    onLogs(logs) {
      console.log('New transaction submitted:', logs)
      // Invalidate queries to refetch data
      queryClient.invalidateQueries()
    },
    enabled: !!multiSigAddress,
  })

  // Listen for ConfirmTransaction events
  useWatchContractEvent({
    address: multiSigAddress,
    abi: multiSigABI,
    eventName: 'ConfirmTransaction',
    onLogs(logs) {
      console.log('Transaction confirmed:', logs)
      queryClient.invalidateQueries()
    },
    enabled: !!multiSigAddress,
  })

  // Listen for ExecuteTransaction events
  useWatchContractEvent({
    address: multiSigAddress,
    abi: multiSigABI,
    eventName: 'ExecuteTransaction',
    onLogs(logs) {
      console.log('Transaction executed:', logs)
      queryClient.invalidateQueries()
    },
    enabled: !!multiSigAddress,
  })

  // Listen for Deposit events
  useWatchContractEvent({
    address: multiSigAddress,
    abi: multiSigABI,
    eventName: 'Deposit',
    onLogs(logs) {
      console.log('Deposit received:', logs)
      queryClient.invalidateQueries()
    },
    enabled: !!multiSigAddress,
  })
}
