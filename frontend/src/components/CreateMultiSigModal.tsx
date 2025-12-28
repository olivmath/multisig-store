import { useState } from 'react'
import { isAddress } from 'viem'
import { useMultiSigFactory } from '@/hooks/useMultiSigFactory'
import { Button } from './ui/Button'
import { Card } from './ui/Card'

interface CreateMultiSigModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateMultiSigModal({ isOpen, onClose }: CreateMultiSigModalProps) {
  const [owners, setOwners] = useState<string[]>([''])
  const [required, setRequired] = useState(1)
  const [errors, setErrors] = useState<Record<number, string>>({})
  const { createMultiSig, isCreating, isSuccess, refetchUserMultiSigs } = useMultiSigFactory()

  if (!isOpen) return null

  if (isSuccess) {
    setTimeout(() => {
      refetchUserMultiSigs()
      onClose()
    }, 2000)
  }

  const addOwner = () => {
    setOwners([...owners, ''])
  }

  const removeOwner = (index: number) => {
    if (owners.length > 1) {
      setOwners(owners.filter((_, i) => i !== index))
    }
  }

  const updateOwner = (index: number, value: string) => {
    const newOwners = [...owners]
    newOwners[index] = value
    setOwners(newOwners)

    // Validate
    if (value && !isAddress(value)) {
      setErrors({ ...errors, [index]: 'Invalid address' })
    } else {
      const newErrors = { ...errors }
      delete newErrors[index]
      setErrors(newErrors)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validOwners = owners.filter(o => isAddress(o)) as `0x${string}`[]

    if (validOwners.length === 0) {
      alert('Please add at least one valid owner address')
      return
    }

    if (required < 1 || required > validOwners.length) {
      alert(`Required confirmations must be between 1 and ${validOwners.length}`)
      return
    }

    createMultiSig(validOwners, required)
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Create MultiSig Wallet</h2>
              <p className="text-sm text-gray-400 mt-1">Fee: 0.01 ETH · Sepolia Testnet</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              disabled={isCreating}
            >
              ✕
            </button>
          </div>

          {isSuccess ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 text-center">
              <p className="text-green-400">✓ MultiSig created successfully!</p>
              <p className="text-sm text-gray-400 mt-2">Refreshing...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Owners */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">
                    Owners ({owners.length})
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addOwner}
                  >
                    + Add Owner
                  </Button>
                </div>

                {owners.map((owner, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="0x..."
                        value={owner}
                        onChange={(e) => updateOwner(index, e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-600 font-mono text-sm"
                      />
                      {errors[index] && (
                        <p className="text-red-400 text-xs mt-1">{errors[index]}</p>
                      )}
                    </div>
                    {owners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOwner(index)}
                        className="px-3 py-2 text-gray-400 hover:text-white"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Required Confirmations */}
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Required Confirmations
                </label>
                <input
                  type="number"
                  min="1"
                  max={owners.length}
                  value={required}
                  onChange={(e) => setRequired(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many owners must approve a transaction (1-{owners.length})
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full"
                isLoading={isCreating}
                disabled={Object.keys(errors).length > 0}
              >
                {isCreating ? 'Creating...' : 'Create MultiSig Wallet'}
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  )
}
