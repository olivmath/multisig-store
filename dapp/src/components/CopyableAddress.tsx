import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyableAddressProps {
  address: string
  truncate?: boolean
  className?: string
}

export function CopyableAddress({ address, truncate = true, className = '' }: CopyableAddressProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayAddress = truncate
    ? `${address.slice(0, 10)}...${address.slice(-8)}`
    : address

  return (
    <button
      onClick={handleCopy}
      className={`group flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors ${className}`}
    >
      <span>{displayAddress}</span>
      {copied ? (
        <Check className="w-3 h-3 text-green-500" />
      ) : (
        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </button>
  )
}
