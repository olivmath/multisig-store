import { useState } from 'react'
import { isAddress, parseEther, encodeFunctionData } from 'viem'
import { useMultiSig } from '@/hooks/useMultiSig'
import { tokenABI } from '@/lib/contracts/tokenABI'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface SubmitTransactionModalProps {
  multiSigAddress: `0x${string}`
  isOpen: boolean
  onClose: () => void
}

type TransactionType = 'ether' | 'erc20' | 'custom'

export function SubmitTransactionModal({
  multiSigAddress,
  isOpen,
  onClose,
}: SubmitTransactionModalProps) {
  const [txType, setTxType] = useState<TransactionType>('ether')
  const [destination, setDestination] = useState('')
  const [value, setValue] = useState('')
  const [tokenAddress, setTokenAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [data, setData] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { submitTransaction } = useMultiSig(multiSigAddress)

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!destination || !isAddress(destination)) {
      newErrors.destination = 'Invalid destination address'
    }

    if (txType === 'ether') {
      if (!value || parseFloat(value) <= 0) {
        newErrors.value = 'Value must be greater than 0'
      }
    }

    if (txType === 'erc20') {
      if (!tokenAddress || !isAddress(tokenAddress)) {
        newErrors.tokenAddress = 'Invalid token address'
      }
      if (!amount || parseFloat(amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0'
      }
    }

    if (txType === 'custom') {
      // Data is optional for custom, but validate if provided
      if (data && !data.startsWith('0x')) {
        newErrors.data = 'Data must start with 0x'
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
      if (txType === 'ether') {
        // Send ETH
        const ethValue = parseEther(value)
        submitTransaction(destination as `0x${string}`, ethValue, '0x')
      } else if (txType === 'erc20') {
        // Send ERC20
        const tokenAmount = parseEther(amount)
        const encodedData = encodeFunctionData({
          abi: tokenABI,
          functionName: 'transfer',
          args: [destination as `0x${string}`, tokenAmount],
        })

        submitTransaction(tokenAddress as `0x${string}`, BigInt(0), encodedData as `0x${string}`)
      } else {
        // Custom transaction
        const customValue = value ? parseEther(value) : BigInt(0)
        const customData = (data || '0x') as `0x${string}`
        submitTransaction(destination as `0x${string}`, customValue, customData)
      }

      // Reset form and close
      setDestination('')
      setValue('')
      setTokenAddress('')
      setAmount('')
      setData('')
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error submitting transaction:', error)
      alert('Failed to submit transaction. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full h-auto">
        <div className="space-y-6 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">New Transaction</h2>
              <p className="text-sm text-gray-400 mt-1">
                Submit a transaction for approval
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transaction Type Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Transaction Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant={txType === 'ether' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTxType('ether')}
                  className="w-full"
                >
                  ETH
                </Button>
                <Button
                  type="button"
                  variant={txType === 'erc20' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTxType('erc20')}
                  className="w-full"
                >
                  ERC20
                </Button>
                <Button
                  type="button"
                  variant={txType === 'custom' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTxType('custom')}
                  className="w-full"
                >
                  Custom
                </Button>
              </div>
            </div>

            {/* ETH Transaction */}
            {txType === 'ether' && (
              <>
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

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Value (ETH)
                  </label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm"
                  />
                  {errors.value && (
                    <p className="text-red-400 text-xs mt-1">{errors.value}</p>
                  )}
                </div>
              </>
            )}

            {/* ERC20 Transaction */}
            {txType === 'erc20' && (
              <>
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

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Amount (Tokens)
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
              </>
            )}

            {/* Custom Transaction */}
            {txType === 'custom' && (
              <>
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

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Value (ETH) <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0.0"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm"
                  />
                  {errors.value && (
                    <p className="text-red-400 text-xs mt-1">{errors.value}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Data (Hex) <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    placeholder="0x..."
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm resize-none"
                  />
                  {errors.data && (
                    <p className="text-red-400 text-xs mt-1">{errors.data}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    For contract interactions, encoded function call data
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Submit Transaction
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              This transaction will require approval from {txType === 'ether' ? 'other owners' : 'owners'} before execution
            </p>
          </form>
        </div>
      </Card>
    </div>
  )
}
