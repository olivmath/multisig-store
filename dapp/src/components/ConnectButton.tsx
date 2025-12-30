import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Wallet, LogOut, ChevronDown } from "lucide-react";

const ConnectButton = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isConnected && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [isConnected, navigate, location]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          <Wallet className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm">{formatAddress(address)}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-20">
              <button
                onClick={() => {
                  disconnect();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // Filter connectors like dapp2 does
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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg z-20 p-2">
            {filteredConnectors.map((connector) => (
              <button
                key={connector.id}
                onClick={() => {
                  connect({ connector });
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-left"
              >
                <span className="text-2xl">
                  {connector.id.includes('metamask') || connector.id === 'injected' ? '🦊' : '🔗'}
                </span>
                <div>
                  <p className="font-medium text-sm">
                    {connector.name === 'Injected' ? 'MetaMask' : connector.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {connector.id.includes('walletConnect') ? 'Scan with mobile' : 'Browser extension'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectButton;
