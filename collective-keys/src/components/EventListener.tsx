import { useBlockchainEvents } from '@/hooks/useBlockchainEvents'

interface EventListenerProps {
  walletAddresses: `0x${string}`[]
}

export function EventListener({ walletAddresses }: EventListenerProps) {
  useBlockchainEvents(walletAddresses)
  return null
}
