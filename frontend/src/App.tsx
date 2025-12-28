import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Dashboard } from './pages/Dashboard'
import { Button } from './components/ui/Button'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">MultiSig Wallet</h1>

          {isConnected ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400 font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
              <Button variant="ghost" size="sm" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              {connectors.map((connector) => (
                <Button
                  key={connector.id}
                  size="sm"
                  onClick={() => connect({ connector })}
                >
                  Connect Wallet
                </Button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <Dashboard />
    </div>
  )
}

export default App
