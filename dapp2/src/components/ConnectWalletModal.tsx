import { useConnect, useAccount } from "wagmi";
import { ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const ConnectWalletModal = ({ isOpen, onClose, onConnect }: ConnectWalletModalProps) => {
  const { connectors, connect, isPending } = useConnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      onConnect(address);
      onClose();
    }
  }, [isConnected, address, onConnect, onClose]);

  const handleConnect = async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId);
    if (connector) {
      connect({ connector });
    }
  };

  const getConnectorIcon = (id: string) => {
    if (id.includes('metamask') || id === 'io.metamask') return "🦊";
    if (id.includes('walletConnect')) return "🔗";
    if (id.includes('coinbase')) return "💰";
    return "🦊";
  };

  const getConnectorDescription = (name: string) => {
    if (name.toLowerCase().includes('metamask')) return "Connect using browser extension";
    if (name.toLowerCase().includes('walletconnect')) return "Scan with mobile wallet";
    if (name.toLowerCase().includes('coinbase')) return "Connect using Coinbase";
    return "Connect using browser extension";
  };

  // Filter and sort connectors: MetaMask first, then WalletConnect
  const filteredConnectors = connectors
    .filter((connector) => {
      const id = connector.id.toLowerCase();

      // Show WalletConnect
      if (id.includes('walletconnect')) return true;

      // Show MetaMask or treat first injected as MetaMask
      if (id.includes('metamask') || id === 'io.metamask') return true;

      // Show Injected only if no MetaMask is available
      if (id === 'injected' && !connectors.some(c => c.id.includes('metamask'))) {
        return true;
      }

      return false;
    })
    .sort((a, b) => {
      // MetaMask/Injected first
      const aIsMetaMask = a.id.includes('metamask') || a.id === 'io.metamask' || a.id === 'injected';
      const bIsMetaMask = b.id.includes('metamask') || b.id === 'io.metamask' || b.id === 'injected';

      if (aIsMetaMask && !bIsMetaMask) return -1;
      if (!aIsMetaMask && bIsMetaMask) return 1;
      return 0;
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Connect Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {filteredConnectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector.id)}
              disabled={isPending}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:bg-secondary hover:border-primary/30 transition-all duration-200 group disabled:opacity-50"
            >
              <span className="text-3xl">{getConnectorIcon(connector.id)}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold group-hover:text-primary transition-colors">
                  {connector.name === 'Injected' ? 'MetaMask' : connector.name}
                </p>
                <p className="text-sm text-muted-foreground">{getConnectorDescription(connector.name)}</p>
              </div>
              {isPending ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              )}
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-center text-muted-foreground">
            By connecting, you agree to our{" "}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectWalletModal;
