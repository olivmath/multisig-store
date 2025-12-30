import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Identicon from './Identicon'

interface CopyableAddressProps {
  address: string
  className?: string
  showIdenticon?: boolean
  identiconSize?: number
}

export function CopyableAddress({
  address,
  className = '',
  showIdenticon = true,
  identiconSize = 20
}: CopyableAddressProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Full address
  const fullAddress = address
  // Medium truncation: 10...8
  const mediumAddress = `${address.slice(0, 10)}...${address.slice(-8)}`
  // Short truncation: 6...4
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

  return (
    <button
      onClick={handleCopy}
      className={`group flex items-center gap-2 font-mono text-sm hover:text-primary transition-colors ${className}`}
      title={address}
    >
      {showIdenticon && (
        <Identicon address={address} size={identiconSize} className="flex-shrink-0" />
      )}

      {/* Full address - visible only on xl screens */}
      <span className="hidden xl:inline">{fullAddress}</span>

      {/* Medium address - visible on lg screens only */}
      <span className="hidden lg:inline xl:hidden">{mediumAddress}</span>

      {/* Short address - visible on sm and md screens */}
      <span className="hidden sm:inline lg:hidden">{shortAddress}</span>

      {/* Very short - visible only on xs screens (below sm) */}
      <span className="inline sm:hidden">{shortAddress}</span>

      {copied ? (
        <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
      ) : (
        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
      )}
    </button>
  )
}
