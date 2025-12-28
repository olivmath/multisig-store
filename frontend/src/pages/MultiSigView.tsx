import { useParams } from 'react-router-dom'
import { useAccount, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { Card } from '@/components/ui/Card'
import { SubmitTransactionForm } from '@/components/SubmitTransactionForm'
import { TransactionTimeline } from '@/components/TransactionTimeline'

export function MultiSigView() {
  const { address } = useParams<{ address: `0x${string}` }>()
  const { isConnected } = useAccount()
  const multiSigAddress = address as `0x${string}`

  const { owners, required, txCount } = useMultiSig(multiSigAddress)
  const { data: balance } = useBalance({ address: multiSigAddress })

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
          <Card>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Balance</p>
              <p className="text-2xl font-bold">
                {balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} ETH` : '0 ETH'}
              </p>
            </div>
          </Card>

          <Card>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Owners</p>
              <p className="text-2xl font-bold">{owners.length}</p>
            </div>
          </Card>

          <Card>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Required Confirmations</p>
              <p className="text-2xl font-bold">
                {required}/{owners.length}
              </p>
            </div>
          </Card>
        </div>

        {/* Owners List */}
        <Card>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Owners</h2>
            <div className="space-y-2">
              {owners.map((owner, index) => (
                <div
                  key={owner}
                  className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-md"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="font-mono text-sm flex-1">{owner}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Submit Transaction */}
        <SubmitTransactionForm multiSigAddress={multiSigAddress} />

        {/* Transactions Timeline */}
        <Card>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Transactions</h2>
              <span className="text-sm text-gray-400">{txCount} total</span>
            </div>
            <TransactionTimeline multiSigAddress={multiSigAddress} txCount={txCount} />
          </div>
        </Card>
      </div>
    </div>
  )
}
