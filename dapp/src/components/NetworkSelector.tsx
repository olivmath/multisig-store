import { useAccount, useBalance, useSwitchChain, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { anvil } from '../config/wagmi/config'
import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { formatEther } from 'viem'

const networks = [
  { chain: sepolia, label: 'Sepolia', color: 'bg-purple-500' },
  { chain: anvil, label: 'Anvil', color: 'bg-orange-500' },
]

export function NetworkSelector() {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { data: balance } = useBalance({ address })
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentNetwork = networks.find((n) => n.chain.id === chainId) || networks[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNetworkSwitch = (chainId: number) => {
    switchChain({ chainId })
    setIsOpen(false)
  }

  const formattedBalance = balance
    ? parseFloat(formatEther(balance.value)).toFixed(4)
    : '0.0000'

  return (
    <div className="flex items-center gap-3">
      {/* Balance */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border">
        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
        </svg>
        <span className="text-sm font-medium">{formattedBalance} ETH</span>
      </div>

      {/* Network Selector */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors"
        >
          <div className={`w-2 h-2 rounded-full ${currentNetwork.color}`} />
          <span className="text-sm font-medium">{currentNetwork.label}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 rounded-lg bg-card border border-border shadow-lg overflow-hidden z-50">
            {networks.map((network) => (
              <button
                key={network.chain.id}
                onClick={() => handleNetworkSwitch(network.chain.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                  chainId === network.chain.id ? 'bg-primary/10 text-primary' : ''
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${network.color}`} />
                <span>{network.label}</span>
                {chainId === network.chain.id && (
                  <span className="ml-auto text-xs text-primary">Active</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
