import { TransactionCard } from './TransactionCard'

interface TransactionTimelineProps {
  multiSigAddress: `0x${string}`
  txCount: number
}

export function TransactionTimeline({ multiSigAddress, txCount }: TransactionTimelineProps) {
  if (txCount === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <svg
          className="w-16 h-16 mx-auto opacity-50 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-white mb-2">No Transactions Yet</h3>
        <p className="text-sm">Submit your first transaction to get started</p>
      </div>
    )
  }

  // Generate array of transaction IDs in reverse order (newest first)
  const txIds = Array.from({ length: txCount }, (_, i) => BigInt(txCount - 1 - i))

  return (
    <div className="space-y-3">
      {txIds.map((txId) => (
        <TransactionCard key={txId.toString()} multiSigAddress={multiSigAddress} txId={txId} />
      ))}
    </div>
  )
}
