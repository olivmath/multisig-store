import { formatEther, formatUnits } from 'viem'

interface Transaction {
  txType: number
  token: `0x${string}`
  to: `0x${string}`
  amount: bigint
  executed: boolean
  data: `0x${string}`
}

interface TokenInfo {
  symbol?: string
  decimals?: number
}

interface DecodedTransaction {
  type: 'eth' | 'erc20' | 'custom'
  displayValue: string
  symbol: string
  destination: string | null
  tokenContract?: string
  calldata?: string
}

export function decodeTransaction(
  tx: Transaction,
  tokenInfo?: TokenInfo
): DecodedTransaction {
  const txType = Number(tx.txType)

  // ETH Transfer (txType === 0)
  if (txType === 0) {
    return {
      type: 'eth',
      displayValue: formatEther(tx.amount),
      symbol: 'ETH',
      destination: tx.to,
    }
  }

  // ERC20 Transfer (txType === 1)
  if (txType === 1) {
    const decimals = tokenInfo?.decimals ?? 18
    const symbol = tokenInfo?.symbol ?? 'TOKEN'

    return {
      type: 'erc20',
      displayValue: formatUnits(tx.amount, decimals),
      symbol,
      destination: tx.to,
      tokenContract: tx.token,
    }
  }

  // Custom Transaction (txType === 2)
  return {
    type: 'custom',
    displayValue: tx.amount > 0 ? formatEther(tx.amount) : '0',
    symbol: 'ETH',
    destination: tx.to || null,
    calldata: tx.data || '0x',
  }
}
