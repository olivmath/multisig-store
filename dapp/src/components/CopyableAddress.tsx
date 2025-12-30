import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Identicon from './Identicon'

type TruncateLevel = 'short' | 'medium' | 'long'

interface CopyableAddressProps {
  address: string
  className?: string
  showIdenticon?: boolean
  identiconSize?: number
  truncate?: TruncateLevel
}

export function CopyableAddress({
  address,
  className = '',
  showIdenticon = true,
  identiconSize = 24,
  truncate = 'medium'
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getDisplayAddress = () => {
    switch (truncate) {
      case 'short':
        return `${address.slice(0, 6)}...${address.slice(-4)}`
      case 'medium':
        return `${address.slice(0, 8)}...${address.slice(-6)}`
      case 'long':
        return `${address.slice(0, 12)}...${address.slice(-10)}`
      default:
        return `${address.slice(0, 8)}...${address.slice(-6)}`
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`group flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors min-w-0 ${className}`}
      title={address}
    >
      {showIdenticon && (
        <Identicon address={address} size={identiconSize} className="flex-shrink-0" />
      )}

      <span className="truncate">{getDisplayAddress()}</span>

      {copied ? (
        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
      ) : (
        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
      )}
    </button>
  )
}
