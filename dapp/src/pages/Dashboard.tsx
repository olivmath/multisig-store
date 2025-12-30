import { useEffect } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import ConnectButton from "../components/ConnectButton";
import WalletCard from "../components/WalletCard";
import { useMultiSigFactory } from "../hooks/useMultiSigFactory";
import { useReadContract } from "wagmi";
import { multiSigABI } from "../config/contracts/multiSigABI";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const { userMultiSigs } = useMultiSigFactory();

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="hidden sm:block">
            <Logo size="md" />
          </div>
          <div className="block sm:hidden">
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wallets</h1>
              <p className="text-muted-foreground">
                Manage your multi-signature wallets
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Create Wallet
            </button>
          </div>
        </div>

        {/* Wallets Grid */}
        {userMultiSigs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 rounded-full bg-muted mb-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No wallets yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first multi-signature wallet to get started
            </p>
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-5 h-5" />
              Create Your First Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMultiSigs.map((walletAddress) => (
              <WalletCardWrapper key={walletAddress} address={walletAddress} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Wrapper to fetch wallet data
const WalletCardWrapper = ({ address }: { address: string }) => {
  const { data: owners } = useReadContract({
    address: address as `0x${string}`,
    abi: multiSigABI,
    functionName: 'getOwners',
  });

  const { data: required } = useReadContract({
    address: address as `0x${string}`,
    abi: multiSigABI,
    functionName: 'required',
  });

  if (!owners || !required) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 animate-pulse">
        <div className="h-24 bg-muted rounded" />
      </div>
    );
  }

  return (
    <WalletCard
      address={address}
      owners={owners as string[]}
      required={Number(required)}
    />
  );
};

export default Dashboard;
