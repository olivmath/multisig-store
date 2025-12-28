import { useState } from 'react'
import { isAddress, parseEther, encodeFunctionData } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { tokenABI } from '@/lib/contracts/tokenABI'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface SubmitTransactionFormProps {
  multiSigAddress: `0x${string}`
}

type TransactionType = 'eth' | 'erc20'

export function SubmitTransactionForm({ multiSigAddress }: SubmitTransactionFormProps) {
  const [txType, setTxType] = useState<TransactionType>('eth')
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { submitTransaction } = useMultiSig(multiSigAddress)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!destination || !isAddress(destination)) {
      newErrors.destination = 'Invalid destination address'
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (txType === 'erc20') {
      if (!tokenAddress || !isAddress(tokenAddress)) {
        newErrors.tokenAddress = 'Invalid token address'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      if (txType === 'eth') {
        // Send ETH
        const value = parseEther(amount)
        submitTransaction(destination as `0x${string}`, value, '0x')
      } else {
        // Send ERC20
        const tokenAmount = parseEther(amount)
        const data = encodeFunctionData({
          abi: tokenABI,
          functionName: 'transfer',
          args: [destination as `0x${string}`, tokenAmount],
        })

        submitTransaction(tokenAddress as `0x${string}`, BigInt(0), data as `0x${string}`)
      }

      // Reset form
      setDestination('')
      setAmount('')
      setTokenAddress('')
      setErrors({})
    } catch (error) {
      console.error('Error submitting transaction:', error)
      alert('Failed to submit transaction. Please try again.')
    }
  }

  return (
    <Card>
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Submit Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={txType === 'eth' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTxType('eth')}
            >
              Send ETH
            </Button>
            <Button
              type="button"
              variant={txType === 'erc20' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTxType('erc20')}
            >
              Send ERC20
            </Button>
          </div>

          {/* Token Address (only for ERC20) */}
          {txType === 'erc20' && (
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">
                Token Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm"
              />
              {errors.tokenAddress && (
                <p className="text-red-400 text-xs mt-1">{errors.tokenAddress}</p>
              )}
            </div>
          )}

          {/* Destination */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Destination Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm"
            />
            {errors.destination && (
              <p className="text-red-400 text-xs mt-1">{errors.destination}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">
              Amount {txType === 'eth' ? '(ETH)' : '(Tokens)'}
            </label>
            <input
              type="text"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm"
            />
            {errors.amount && (
              <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Submit Transaction
          </Button>

          <p className="text-xs text-gray-500 text-center">
            This transaction will need {txType === 'eth' ? 'approval' : 'approval'} from other owners before execution
          </p>
        </form>
      </div>
    </Card>
  )
}
