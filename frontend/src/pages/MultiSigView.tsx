import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { useMultiSigEvents } from '@/hooks/useEventListener'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { SubmitTransactionModal } from '@/components/SubmitTransactionModal'
import { TransactionTimeline } from '@/components/TransactionTimeline'

export function MultiSigView() {
  const { address } = useParams<{ address: `0x${string}` }>()
  const { isConnected } = useAccount()
  const multiSigAddress = address as `0x${string}`
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false)

  const { owners, required, txCount } = useMultiSig(multiSigAddress)
  const { data: balance } = useBalance({ address: multiSigAddress })

  // Listen for real-time events - DISABLED temporarily due to RPC rate limit
  // useMultiSigEvents(multiSigAddress)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view this multisig</p>
        </Card>
      </div>
    )
  }

  if (!address) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Invalid Address</h2>
          <p className="text-gray-400">No multisig address provided</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">MultiSig Wallet</h1>
          <p className="font-mono text-sm text-gray-400">
            {address}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Owners */}
          <Card>
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Owners</p>
              <p className="text-3xl font-bold">{owners.length}</p>
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <div className="pt-2 space-y-2">
                  {owners.slice(0, 3).map((owner, index) => (
                    <div key={owner} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-medium">
                        {index + 1}
                      </div>
                      <p className="font-mono text-xs text-gray-400">
                        {owner.slice(0, 6)}...{owner.slice(-4)}
                      </p>
                    </div>
                  ))}
                  {owners.length > 3 && (
                    <p className="text-xs text-gray-500 pl-8">+{owners.length - 3} more</p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Card 2: Required Confirmations */}
          <Card>
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Required Confirmations</p>
              <p className="text-3xl font-bold">
                {required}/{owners.length}
              </p>
              <div className="pt-2 border-t border-gray-800">
                <p className="text-sm text-gray-400 pt-2">
                  {required === 1 ? '1 signature needed' : `${required} signatures needed`}
                </p>
              </div>
            </div>
          </Card>

          {/* Card 3: Balance */}
          <Card>
            <div className="space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Balance</p>
              <p className="text-3xl font-bold">
                {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0.0000'}
              </p>
              <div className="pt-2 border-t border-gray-800">
                <p className="text-sm text-gray-400 pt-2">ETH</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Submit Transaction Modal */}
        <SubmitTransactionModal
          multiSigAddress={multiSigAddress}
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
        />

        {/* Transactions Timeline */}
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Transactions</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">{txCount} total</span>
                <Button onClick={() => setIsSubmitModalOpen(true)} size="sm">
                  + New Transaction
                </Button>
              </div>
            </div>
            <TransactionTimeline multiSigAddress={multiSigAddress} txCount={txCount} />
          </div>
        </Card>
      </div>
    </div>
  )
}
