import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useMultiSigFactory } from '@/hooks/useMultiSigFactory'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { CreateMultiSigModal } from '@/components/CreateMultiSigModal'

export function Dashboard() {
  const { isConnected } = useAccount()
  const { userMultiSigs } = useMultiSigFactory()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">Please connect your wallet to view your multisig wallets</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My MultiSig Wallets</h1>
            <p className="text-gray-400 mt-1">
              {userMultiSigs.length} wallet{userMultiSigs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>+ Create New Wallet</Button>
        </div>

        {/* Create Modal */}
        <CreateMultiSigModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />

        {/* Wallets Grid */}
        {userMultiSigs.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 space-y-4">
              <svg className="w-16 h-16 mx-auto opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">No MultiSig Wallets Yet</h3>
                <p className="text-sm">Create your first multisig wallet to get started</p>
              </div>
              <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Wallet
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userMultiSigs.map((address) => (
              <WalletCard key={address} address={address} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function WalletCard({ address }: { address: `0x${string}` }) {
  const { owners, required } = useMultiSig(address)

  return (
    <Link to={`/multisig/${address}`}>
      <Card className="hover:border-blue-600/50 cursor-pointer transition-all hover:scale-[1.02]">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">MultiSig Address</p>
            <p className="font-mono text-sm">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>

          <div className="pt-3 border-t border-gray-800 flex justify-between text-sm">
            <span className="text-gray-400">{owners.length} owners</span>
            <span className="text-blue-400">{required}/{owners.length} required</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

// Import at top
import { useMultiSig } from '@/hooks/useMultiSig'
