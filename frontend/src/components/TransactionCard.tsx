import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { multiSigABI } from '@/lib/contracts/multiSigABI'
import { Button } from './ui/Button'
import { cn } from '@/lib/utils/cn'

interface TransactionCardProps {
  multiSigAddress: `0x${string}`
  txId: bigint
}

interface Transaction {
  destination: `0x${string}`
  value: bigint
  executed: boolean
  data: `0x${string}`
}

export function TransactionCard({ multiSigAddress, txId }: TransactionCardProps) {
  const { address: userAddress } = useAccount()
  const { required, confirmTransaction, executeTransaction } = useMultiSig(multiSigAddress)

  // Read transaction data
  const { data: txData, isLoading: txLoading } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'transactions',
    args: [txId],
  })

  const tx = txData as Transaction | undefined

  // Read if transaction is confirmed (has enough confirmations)
  const { data: isConfirmed } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'isConfirmed',
    args: [txId],
  })

  // Read if user has confirmed this transaction
  const { data: hasUserConfirmed } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'confirmations',
    args: userAddress ? [txId, userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })

  if (txLoading || !tx || !required) {
    return (
      <div className="bg-gray-800/50 rounded-md p-4 animate-pulse">
        <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
    )
  }

  const getStatusColor = () => {
    if (tx.executed) return 'bg-green-500/10 text-green-400 border-green-500/30'
    if (isConfirmed) return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
  }

  const getStatusText = () => {
    if (tx.executed) return 'Executed'
    if (isConfirmed) return 'Ready to Execute'
    return 'Pending'
  }

  const handleConfirm = () => {
    confirmTransaction(txId)
  }

  const handleExecute = () => {
    executeTransaction(txId)
  }

  // Check if it's an ETH transfer (no data or empty data)
  const isETHTransfer = !tx.data || tx.data === '0x' || tx.data === '0x0' || tx.data.length <= 2

  return (
    <div className="bg-gray-800/50 rounded-md p-6 space-y-4 border border-gray-700 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">TX #{txId.toString()}</span>
            <span
              className={cn(
                'text-xs px-2 py-1 rounded-full border font-medium',
                getStatusColor()
              )}
            >
              {getStatusText()}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {isETHTransfer ? 'Send ETH' : 'Contract Interaction'}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold">
            {tx.value > 0 ? `${formatEther(tx.value)} ETH` : '--'}
          </p>
        </div>
      </div>

      {/* Destination */}
      <div className="space-y-1">
        <p className="text-xs text-gray-500">Destination</p>
        <p className="font-mono text-sm">
          {tx.destination ? `${tx.destination.slice(0, 10)}...${tx.destination.slice(-8)}` : 'Invalid address'}
        </p>
      </div>

      {/* Confirmations Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Status</p>
          <p className="text-xs text-gray-400">
            {isConfirmed ? `${required} of ${required}` : `Pending (need ${required})`}
          </p>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              tx.executed ? 'bg-green-500' : isConfirmed ? 'bg-blue-500' : 'bg-yellow-500'
            )}
            style={{
              width: isConfirmed ? '100%' : '50%',
            }}
          />
        </div>
      </div>

      {/* Actions */}
      {!tx.executed && (
        <div className="flex gap-3 pt-2">
          {!hasUserConfirmed && (
            <Button variant="secondary" size="sm" onClick={handleConfirm} className="flex-1">
              Confirm
            </Button>
          )}
          {isConfirmed && (
            <Button variant="primary" size="sm" onClick={handleExecute} className="flex-1">
              Execute
            </Button>
          )}
          {hasUserConfirmed && !isConfirmed && (
            <div className="flex-1 text-center text-sm text-gray-400 py-2">
              ✓ You confirmed this transaction
            </div>
          )}
        </div>
      )}

      {tx.executed && (
        <div className="text-center text-sm text-green-400 py-2">✓ Transaction executed</div>
      )}
    </div>
  )
}
