import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const walletOptions = [
  { 
    id: "metamask", 
    name: "MetaMask", 
    icon: "🦊",
    description: "Connect using browser extension"
  },
  { 
    id: "walletconnect", 
    name: "WalletConnect", 
    icon: "🔗",
    description: "Scan with mobile wallet"
  },
  { 
    id: "coinbase", 
    name: "Coinbase Wallet", 
    icon: "💰",
    description: "Connect using Coinbase"
  },
];

const ConnectWalletModal = ({ isOpen, onClose, onConnect }: ConnectWalletModalProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (walletId: string) => {
    setConnecting(walletId);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Generate mock address
    const mockAddress = `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 34)}`;
    onConnect(mockAddress);
    setConnecting(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Connect Wallet</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet.id)}
              disabled={connecting !== null}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:bg-secondary hover:border-primary/30 transition-all duration-200 group disabled:opacity-50"
            >
              <span className="text-3xl">{wallet.icon}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold group-hover:text-primary transition-colors">
                  {wallet.name}
                </p>
                <p className="text-sm text-muted-foreground">{wallet.description}</p>
              </div>
              {connecting === wallet.id ? (
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
