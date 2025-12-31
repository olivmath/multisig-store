import { useAccount, useReadContract, useWaitForTransactionReceipt, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { multiSigABI } from '@/config/contracts/multiSigABI'
import { tokenABI } from '@/config/contracts/tokenABI'
import { Button } from '@/components/ui/button'
import { Coins, Code, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { decodeTransaction } from '@/utils/decodeTransaction'
import { useEffect } from 'react'
import Identicon from './Identicon'
import { CopyableAddress } from './CopyableAddress'
import { EthereumIcon } from './EthereumIcon'

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
  const { required, confirmTransaction, confirmTxHash, owners } = useMultiSig(multiSigAddress)

  // Read confirmers for this transaction
  const { data: confirmers, refetch: refetchConfirmers } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'getConfirmers',
    args: [txId],
    query: {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
      staleTime: 5000,
    },
  })

  // Read multisig balance to check if it can execute
  const { data: walletBalance } = useBalance({ address: multiSigAddress })

  // Read transaction data
  const { data: txData, isLoading: txLoading, refetch: refetchTx } = useReadContract({
    address: multiSigAddress,
    abi: multiSigABI,
    functionName: 'transactions',
    args: [txId],
    query: {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
      staleTime: 5000,
    },
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
    query: {
      refetchInterval: 10000,
      refetchOnWindowFocus: true,
      staleTime: 5000,
    },
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
        refetchConfirmers()
      }, 2000)
    }
  }, [isConfirmSuccess, refetchTx, refetchConfirmation, refetchConfCount, refetchConfirmers])

  if (txLoading || !tx || !required) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4 animate-pulse">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded-lg" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="h-6 w-24 bg-muted rounded" />
        </div>
        {/* TX ID */}
        <div className="h-3 w-28 bg-muted rounded" />
        {/* Destination */}
        <div className="space-y-1 py-3 border-t border-border/50">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
        </div>
        {/* Token/Calldata placeholder */}
        <div className="space-y-1 py-3 border-t border-border/50 min-h-[60px]">
          <div className="h-3 w-24 bg-muted rounded" />
          <div className="h-4 w-40 bg-muted rounded" />
        </div>
        {/* Confirmations */}
        <div className="space-y-3 py-3 border-t border-border/50">
          <div className="flex justify-between items-center">
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-4 w-12 bg-muted rounded" />
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="w-8 h-8 bg-muted rounded-full" />
          </div>
        </div>
        {/* Button */}
        <div className="pt-2 border-t border-border/50">
          <div className="h-9 w-full bg-muted rounded" />
        </div>
      </div>
    )
  }

  const handleConfirm = () => {
    confirmTransaction(txId)
  }

  // Use utility function to decode transaction
  const txInfo = decodeTransaction(tx, {
    symbol: tokenSymbol as string,
    decimals: tokenDecimals as number,
  })

  // Check if this confirmation will trigger execution
  const currentConfirmations = confirmationCount ? Number(confirmationCount) : 0
  const willExecute = !hasUserConfirmed && currentConfirmations + 1 >= required

  // Check if wallet has enough balance for ETH transactions
  const hasInsufficientBalance =
    willExecute &&
    txInfo.type === 'eth' &&
    walletBalance &&
    walletBalance.value < tx.amount

  // Get confirmers as array of addresses
  const confirmersList = (confirmers as `0x${string}`[]) || []

  // Helper to check if an owner has confirmed
  const hasOwnerConfirmed = (owner: `0x${string}`) => {
    return confirmersList.some((c) => c.toLowerCase() === owner.toLowerCase())
  }

  // Get transaction type label
  const getTypeLabel = () => {
    if (txInfo.type === 'eth') return 'Send ETH'
    if (txInfo.type === 'erc20') return 'Send Token'
    return 'Custom Transaction'
  }

  // Get transaction type icon
  const getTypeIcon = () => {
    if (txInfo.type === 'eth') return <EthereumIcon className="w-4 h-4" />
    if (txInfo.type === 'erc20') return <Coins className="w-4 h-4" />
    return <Code className="w-4 h-4" />
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 hover:border-primary/50 transition-colors">
      {/* Header: Type (left) + Value (right) */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`p-2 rounded-lg ${tx.executed ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'}`}>
            {getTypeIcon()}
          </span>
          <span className="font-medium">{getTypeLabel()}</span>
          {tx.executed && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/30">
              Executed
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-display font-bold text-primary">
            {txInfo.displayValue} {txInfo.symbol}
          </p>
        </div>
      </div>

      {/* TX ID */}
      <div className="text-xs text-muted-foreground font-mono">
        Transaction #{txId.toString()}
      </div>

      {/* Destination */}
      <div className="space-y-1 py-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Recipient</p>
        {txInfo.destination ? (
          <CopyableAddress address={txInfo.destination} />
        ) : (
          <p className="font-mono text-sm text-destructive">Invalid address</p>
        )}
      </div>

      {/* Token (for ERC20) or Calldata (for custom) or placeholder for alignment */}
      <div className="space-y-1 py-3 border-t border-border/50 min-h-[60px]">
        {txInfo.type === 'erc20' && txInfo.tokenContract ? (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Token Contract</p>
            <CopyableAddress address={txInfo.tokenContract} />
          </>
        ) : txInfo.type === 'custom' && txInfo.calldata && txInfo.calldata !== '0x' ? (
          <>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Transaction Data</p>
            <p className="font-mono text-xs break-all bg-muted/50 p-2 rounded">
              {txInfo.calldata}
            </p>
          </>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {/* Confirmations with owner icons */}
      <div className="space-y-3 py-3 border-t border-border/50">
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Confirmations</p>
          <p className="text-sm font-semibold">
            {confirmationCount ? Number(confirmationCount) : 0}/{required}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {owners.map((owner) => {
            const confirmed = hasOwnerConfirmed(owner)
            return (
              <div
                key={owner}
                className="relative group"
              >
                <div className="relative w-8 h-8">
                  <Identicon
                    address={owner}
                    size={32}
                    className={confirmed ? '' : 'opacity-30'}
                    copyable
                  />
                  {!confirmed && (
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed border-muted-foreground/50 pointer-events-none"
                    />
                  )}
                </div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {owner.slice(0, 4)}...{owner.slice(-2)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Insufficient Balance Warning */}
      {!tx.executed && hasInsufficientBalance && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
          <div className="text-xs text-destructive">
            <p className="font-semibold mb-1">Insufficient Balance</p>
            <p>
              This wallet needs {formatEther(tx.amount)} ETH but only has{' '}
              {walletBalance ? formatEther(walletBalance.value) : '0'}. Add funds before confirming.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 border-t border-border/50">
        {tx.executed ? (
          <Button variant="outline" size="sm" disabled className="w-full bg-green-500/10 text-green-600 border-green-500/30">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Transaction executed successfully
          </Button>
        ) : hasUserConfirmed ? (
          <Button variant="outline" size="sm" disabled className="w-full bg-green-500/10 text-green-600 border-green-500/30">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            You confirmed this transaction
          </Button>
        ) : (
          <Button
            variant="gold"
            size="sm"
            onClick={handleConfirm}
            disabled={isConfirmPending || hasInsufficientBalance}
            className="w-full"
          >
            {isConfirmPending ? 'Confirming...' : 'Confirm Transaction'}
          </Button>
        )}
      </div>
    </div>
  )
}
