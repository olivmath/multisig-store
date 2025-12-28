import { useAccount, useConnect, useDisconnect } from 'wagmi'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">MultiSig Wallet</h1>
          <p className="text-gray-500">Secure multi-signature ethereum wallets</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-md p-6 space-y-4">
          {isConnected ? (
            <>
              <div>
                <p className="text-sm text-gray-500 mb-2">Connected Address:</p>
                <p className="font-mono text-white">{address}</p>
              </div>
              <button
                onClick={() => disconnect()}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">Connect your wallet to continue</p>
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => connect({ connector })}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connect {connector.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
