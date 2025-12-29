import { useAccount, useReadContract } from 'wagmi'
import { formatEther, formatUnits } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { multiSigABI } from '@/lib/contracts/multiSigABI'
import { tokenABI } from '@/lib/contracts/tokenABI'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Clock } from 'lucide-react'

interface TransactionCardProps {
  multiSigAddress: `0x${string}`
  txId: bigint
}

interface Transaction {
  destination: `0x${string}`
  value: bigint
  executed: boolean
  data: `0x${string}`
}

export function TransactionCard({ multiSigAddress, txId }: TransactionCardProps) {
  const { address: userAddress } = useAccount()
  const { required, confirmTransaction } = useMultiSig(multiSigAddress)

  // Read transaction data
  const { data: txData, isLoading: txLoading } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'transactions',
    args: [txId],
  })

  const tx = txData as Transaction | undefined

  // Try to decode ERC20 transfer if transaction has data
  const decodedERC20 = tx?.data?.startsWith('0xa9059cbb') && tx.data.length === 138
    ? (() => {
        try {
          // Extract destination address from the calldata
          // Structure: 0xa9059cbb (8 chars) + padded address (64 chars) + amount (64 chars)
          // Address is in the last 40 chars of the first parameter
          const destinationHex = '0x' + tx.data.slice(34, 74)
          const amountHex = '0x' + tx.data.slice(74, 138)

          console.log('Decoding ERC20 transfer:', {
            fullData: tx.data,
            dataLength: tx.data.length,
            destinationHex,
            amountHex,
            tokenContract: tx.destination,
          })

          return {
            destination: destinationHex as `0x${string}`,
            amount: BigInt(amountHex),
            tokenContract: tx.destination,
          }
        } catch (error) {
          console.error('Failed to decode ERC20:', error)
          return null
        }
      })()
    : null

  // Read token info if it's an ERC20 transaction
  const { data: tokenSymbol } = useReadContract({
    address: decodedERC20?.tokenContract,
    abi: tokenABI,
    functionName: 'symbol',
    query: {
      enabled: !!decodedERC20,
    },
  })

  const { data: tokenDecimals } = useReadContract({
    address: decodedERC20?.tokenContract,
    abi: tokenABI,
    functionName: 'decimals',
    query: {
      enabled: !!decodedERC20,
    },
  })

  // Read if user has confirmed this transaction
  const { data: hasUserConfirmed } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'confirmations',
    args: userAddress ? [txId, userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })

  if (txLoading || !tx || !required) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 animate-pulse">
        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-muted rounded w-2/3"></div>
      </div>
    )
  }

  const getStatusColor = () => {
    if (tx.executed) return 'bg-green-500/10 text-green-600 border-green-500/30'
    return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
  }

  const getStatusText = () => {
    if (tx.executed) return 'Executed'
    return 'Pending'
  }

  const handleConfirm = () => {
    confirmTransaction(txId)
  }

  // Decode transaction data
  const decodeTransaction = () => {
    // Check if it's ERC20 transfer
    if (decodedERC20) {
      const decimals = (tokenDecimals as number) || 18
      const symbol = (tokenSymbol as string) || 'TOKENS'

      return {
        type: 'erc20' as const,
        tokenContract: decodedERC20.tokenContract,
        destination: decodedERC20.destination,
        value: decodedERC20.amount,
        displayValue: formatUnits(decodedERC20.amount, decimals),
        symbol: symbol,
      }
    }

    // Check if has data (bytes)
    const hasData = tx.data && tx.data !== '0x' && tx.data.length > 2

    if (!hasData) {
      // Simple ETH transfer
      return {
        type: 'eth' as const,
        destination: tx.destination,
        value: tx.value || BigInt(0),
        displayValue: tx.value ? formatEther(tx.value) : '0',
        symbol: 'ETH',
      }
    }

    // Custom contract interaction
    return {
      type: 'custom' as const,
      destination: tx.destination,
      calldata: tx.data,
      value: tx.value || BigInt(0),
    }
  }

  const txInfo = decodeTransaction()

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono">TX #{txId.toString()}</span>
            <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {tx.executed ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Clock className="w-4 h-4 text-yellow-600" />
            )}
            <p className="text-sm text-muted-foreground">
              {txInfo.type === 'eth' && 'Send ETH'}
              {txInfo.type === 'erc20' && 'Send ERC20 Token'}
              {txInfo.type === 'custom' && 'Custom Transaction'}
            </p>
          </div>
        </div>

        <div className="text-right">
          {txInfo.type === 'eth' && (
            <p className="text-2xl font-display font-bold text-primary">
              {txInfo.displayValue} {txInfo.symbol}
            </p>
          )}
          {txInfo.type === 'erc20' && (
            <p className="text-2xl font-display font-bold text-primary">
              {txInfo.displayValue} {txInfo.symbol}
            </p>
          )}
          {txInfo.type === 'custom' && tx.value > 0 && (
            <p className="text-2xl font-display font-bold text-primary">
              {formatEther(tx.value)} ETH
            </p>
          )}
        </div>
      </div>

      {/* Token Contract (for ERC20) */}
      {txInfo.type === 'erc20' && (
        <div className="space-y-1 py-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Token Contract</p>
          <p className="font-mono text-sm">
            {txInfo.tokenContract.slice(0, 10)}...{txInfo.tokenContract.slice(-8)}
          </p>
        </div>
      )}

      {/* Destination */}
      <div className="space-y-1 py-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          {txInfo.type === 'erc20' ? 'Recipient' : 'Destination'}
        </p>
        {txInfo.destination ? (
          <p className="font-mono text-sm">
            {txInfo.destination.slice(0, 10)}...{txInfo.destination.slice(-8)}
          </p>
        ) : (
          <p className="font-mono text-sm text-destructive">Invalid address</p>
        )}
      </div>

      {/* Calldata (for custom transactions) */}
      {txInfo.type === 'custom' && (
        <div className="space-y-1 py-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Calldata</p>
          <p className="font-mono text-xs break-all bg-muted/50 p-2 rounded">
            {txInfo.calldata}
          </p>
        </div>
      )}

      {/* Confirmations Progress */}
      <div className="space-y-2 pb-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Status</p>
          <p className="text-xs text-muted-foreground">
            Need {required} confirmations
          </p>
        </div>
        <div className="progress-gold">
          <div
            className={`h-2 rounded-full transition-all ${
              tx.executed ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{
              width: tx.executed ? '100%' : '50%',
            }}
          />
        </div>
        {!tx.executed && (
          <p className="text-xs text-muted-foreground text-center pt-1">
            Transaction will execute automatically when threshold is reached
          </p>
        )}
      </div>

      {/* Actions */}
      {!tx.executed && (
        <div className="flex gap-3 pt-2 border-t border-border/50">
          {!hasUserConfirmed ? (
            <Button variant="outline" size="sm" onClick={handleConfirm} className="flex-1">
              Confirm Transaction
            </Button>
          ) : (
            <div className="flex-1 text-center text-sm text-green-600 py-2 font-medium">
              ✓ You confirmed this transaction
            </div>
          )}
        </div>
      )}

      {tx.executed && (
        <div className="text-center text-sm text-green-600 py-2 font-medium border-t border-border/50">
          ✓ Transaction executed successfully
        </div>
      )}
    </div>
  )
}
