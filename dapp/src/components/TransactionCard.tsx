import { useAccount, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { multiSigABI } from '@/lib/contracts/multiSigABI'
import { tokenABI } from '@/lib/contracts/tokenABI'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowUpRight, Coins, Code } from 'lucide-react'
import { decodeTransaction } from '@/lib/utils/decodeTransaction'
import { useEffect } from 'react'

interface TransactionCardProps {
  multiSigAddress: `0x${string}`
  txId: bigint
}

interface Transaction {
  txType: number
  token: `0x${string}`
  to: `0x${string}`
  amount: bigint
  executed: boolean
  data: `0x${string}`
}

export function TransactionCard({ multiSigAddress, txId }: TransactionCardProps) {
  const { address: userAddress } = useAccount()
  const { required, confirmTransaction, confirmTxHash } = useMultiSig(multiSigAddress)

  // Read transaction data
  const { data: txData, isLoading: txLoading, refetch: refetchTx } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'transactions',
    args: [txId],
  })

  // Convert array response to object
  const tx: Transaction | undefined = txData
    ? {
        txType: Number((txData as any)[0]),
        token: (txData as any)[1] as `0x${string}`,
        to: (txData as any)[2] as `0x${string}`,
        amount: (txData as any)[3] as bigint,
        executed: (txData as any)[4] as boolean,
        data: (txData as any)[5] as `0x${string}`,
      }
    : undefined

  // Read token info if it's an ERC20 transaction (txType === 1)
  const isERC20 = tx && Number(tx.txType) === 1

  const { data: tokenSymbol } = useReadContract({
    address: tx?.token,
    abi: tokenABI,
    functionName: 'symbol',
    query: {
      enabled: isERC20,
    },
  })

  const { data: tokenDecimals } = useReadContract({
    address: tx?.token,
    abi: tokenABI,
    functionName: 'decimals',
    query: {
      enabled: isERC20,
    },
  })

  // Read confirmation count for this transaction
  const { data: confirmationCount, refetch: refetchConfCount } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'confirmationCount',
    args: [txId],
  })

  // Read if user has confirmed this transaction
  const { data: hasUserConfirmed, refetch: refetchConfirmation } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'confirmations',
    args: userAddress ? [txId, userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  })

  // Wait for confirmation transaction to complete and refetch data
  const { isLoading: isConfirmPending, isSuccess: isConfirmSuccess } = useWaitForTransactionReceipt({
    hash: confirmTxHash,
  })

  // Auto-refetch when confirmation completes
  useEffect(() => {
    if (isConfirmSuccess) {
      console.log('[TransactionCard] Confirmation complete, refetching data...')
      // Refetch transaction data after 2 seconds to allow blockchain state to update
      setTimeout(() => {
        refetchTx()
        refetchConfirmation()
        refetchConfCount()
      }, 2000)
    }
  }, [isConfirmSuccess, refetchTx, refetchConfirmation, refetchConfCount])

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

  // Use utility function to decode transaction
  const txInfo = decodeTransaction(tx, {
    symbol: tokenSymbol as string,
    decimals: tokenDecimals as number,
  })

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
            {txInfo.type === 'eth' && (
              <ArrowUpRight className="w-4 h-4 text-primary" />
            )}
            {txInfo.type === 'erc20' && (
              <Coins className="w-4 h-4 text-primary" />
            )}
            {txInfo.type === 'custom' && (
              <Code className="w-4 h-4 text-primary" />
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
          {txInfo.type === 'custom' && tx.amount > 0 && (
            <p className="text-2xl font-display font-bold text-primary">
              {formatEther(tx.amount)} ETH
            </p>
          )}
        </div>
      </div>

      {/* Token Contract (for ERC20) or Spacer */}
      {txInfo.type === 'erc20' ? (
        <div className="space-y-1 py-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Token Contract</p>
          <p className="font-mono text-sm">
            {txInfo.tokenContract.slice(0, 10)}...{txInfo.tokenContract.slice(-8)}
          </p>
        </div>
      ) : (
        <div className="py-3 border-t border-border/50 opacity-0 pointer-events-none">
          <p className="text-xs uppercase tracking-wide">Spacer</p>
          <p className="text-sm">Placeholder</p>
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
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Confirmations</p>
          <p className="text-sm font-semibold">
            {confirmationCount ? Number(confirmationCount) : 0}/{required}
          </p>
        </div>
        <div className="progress-gold">
          <div
            className={`h-2 rounded-full transition-all ${
              tx.executed ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{
              width: tx.executed ? '100%' : `${((confirmationCount ? Number(confirmationCount) : 0) / required) * 100}%`,
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleConfirm}
              disabled={isConfirmPending}
              className="flex-1"
            >
              {isConfirmPending ? 'Confirming...' : 'Confirm Transaction'}
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
