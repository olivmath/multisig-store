import { useEffect } from 'react'
import { useAccount, usePublicClient } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { multiSigFactoryABI } from '@/config/contracts/multiSigFactoryABI'
import { multiSigABI } from '@/config/contracts/multiSigABI'
import { CONTRACTS } from '@/config/contracts/addresses'
import { useNotifications } from '@/contexts/NotificationContext'

export function useBlockchainEvents(walletAddresses: `0x${string}`[]) {
  const { address: userAddress } = useAccount()
  const { addNotification } = useNotifications()
  const publicClient = usePublicClient()
  const factoryAddress = CONTRACTS[sepolia.id].MultiSigFactory

  useEffect(() => {
    if (!publicClient || !userAddress) return

    const unwatchFns: (() => void)[] = []

    // Listen for new MultiSig wallets created where user is an owner
    const unwatchFactory = publicClient.watchContractEvent({
      address: factoryAddress,
      abi: multiSigFactoryABI,
      eventName: 'MultiSigCreated',
      onLogs: (logs) => {
        logs.forEach((log) => {
          const { multiSig, creator, owners } = log.args as {
            multiSig: string
            creator: string
            owners: string[]
          }

          // Check if user is one of the owners
          if (owners.some((owner) => owner.toLowerCase() === userAddress.toLowerCase())) {
            const isCreator = creator.toLowerCase() === userAddress.toLowerCase()

            addNotification({
              type: 'new_wallet',
              title: isCreator ? 'Wallet Created' : 'New Wallet',
              message: isCreator
                ? `You created a new MultiSig wallet`
                : `You were added as an owner to a new MultiSig wallet`,
              walletAddress: multiSig,
            })
          }
        })
      },
    })
    unwatchFns.push(unwatchFactory)

    // Listen for events on each wallet
    walletAddresses.forEach((walletAddress) => {
      // Listen for new transactions
      const unwatchSubmit = publicClient.watchContractEvent({
        address: walletAddress,
        abi: multiSigABI,
        eventName: 'SubmitTransaction',
        onLogs: (logs) => {
          logs.forEach((log) => {
            const { txId } = log.args as { txId: bigint }

            addNotification({
              type: 'new_transaction',
              title: 'New Transaction',
              message: `A new transaction requires your approval`,
              walletAddress,
              txId: Number(txId),
            })
          })
        },
      })
      unwatchFns.push(unwatchSubmit)

      // Listen for confirmations
      const unwatchConfirm = publicClient.watchContractEvent({
        address: walletAddress,
        abi: multiSigABI,
        eventName: 'ConfirmTransaction',
        onLogs: (logs) => {
          logs.forEach((log) => {
            const { owner, txId } = log.args as { owner: string; txId: bigint }

            // Only notify if it's not the current user who confirmed
            if (owner.toLowerCase() !== userAddress.toLowerCase()) {
              addNotification({
                type: 'transaction_confirmed',
                title: 'Transaction Confirmed',
                message: `An owner confirmed transaction #${Number(txId)}`,
                walletAddress,
                txId: Number(txId),
              })
            }
          })
        },
      })
      unwatchFns.push(unwatchConfirm)

      // Listen for executions
      const unwatchExecute = publicClient.watchContractEvent({
        address: walletAddress,
        abi: multiSigABI,
        eventName: 'ExecuteTransaction',
        onLogs: (logs) => {
          logs.forEach((log) => {
            const { txId } = log.args as { txId: bigint }

            addNotification({
              type: 'transaction_executed',
              title: 'Transaction Executed',
              message: `Transaction #${Number(txId)} was executed successfully`,
              walletAddress,
              txId: Number(txId),
            })
          })
        },
      })
      unwatchFns.push(unwatchExecute)
    })

    // Cleanup function
    return () => {
      unwatchFns.forEach((unwatch) => unwatch())
    }
  }, [publicClient, userAddress, walletAddresses, addNotification, factoryAddress])
}
