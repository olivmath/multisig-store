import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import DashboardHeader from "@/components/DashboardHeader";
import WalletCard from "@/components/WalletCard";
import CreateWalletModal from "@/components/CreateWalletModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMultiSigFactory } from "@/hooks/useMultiSigFactory";
import { useMultiSig } from "@/hooks/useMultiSig";
import { usePendingWallets } from "@/hooks/usePendingWallets";
import { formatEther } from "viem";
import { useState } from "react";

interface WalletData {
  id: string;
  address: string;
  name: string;
  owners: string[];
  required: number;
  balance: string;
}

interface PendingWallet {
  id: string;
  name: string;
  address: string;
  pendingCount: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { address: connectedAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: balance } = useBalance({ address: connectedAddress });

  const { userMultiSigs, createMultiSig, isCreating, isSuccess, refetchUserMultiSigs } = useMultiSigFactory();
  const pendingWallets = usePendingWallets(userMultiSigs);

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (isSuccess) {
      refetchUserMultiSigs();
    }
  }, [isSuccess, refetchUserMultiSigs]);

  // Refetch wallets when connected address changes
  useEffect(() => {
    if (connectedAddress) {
      refetchUserMultiSigs();
    }
  }, [connectedAddress, refetchUserMultiSigs]);

  const handleLogout = () => {
    disconnect();
    toast({
      title: "Disconnected",
      description: "You have been successfully disconnected.",
      variant: "default",
    });
    setTimeout(() => navigate("/"), 500);
  };

  const handleCreateWallet = (wallet: { name: string; owners: string[]; required: number }) => {
    const ownersAddresses = wallet.owners.map(addr => addr as `0x${string}`);
    createMultiSig(ownersAddresses, wallet.required);

    toast({
      title: "Creating Wallet...",
      description: "Please confirm the transaction in your wallet.",
      variant: "default",
    });
  };

  if (!connectedAddress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        address={connectedAddress}
        balance={balance ? formatEther(balance.value) : "0"}
        network="sepolia"
        pendingWallets={pendingWallets}
        onLogout={handleLogout}
      />

      <main className="container px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-semibold mb-2">My Wallets</h1>
            <p className="text-muted-foreground">
              Manage your multisig wallets and transactions
            </p>
          </div>
          <Button
            variant="gold"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isCreating}
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            {isCreating ? "Creating..." : "Create New Wallet"}
          </Button>
        </div>

        {/* Wallets Grid - Asymmetric layout */}
        {userMultiSigs.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-3">No wallets found</h2>
            <p className="text-muted-foreground mb-6">Create your first multisig wallet to get started</p>
            <Button variant="gold" onClick={() => setIsCreateModalOpen(true)} disabled={isCreating}>
              {isCreating ? "Creating..." : "Create First Wallet"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMultiSigs.map((walletAddress, index) => (
              <MultiSigWalletCard
                key={walletAddress}
                address={walletAddress}
                className={index === 0 ? "md:col-span-2 lg:col-span-1" : ""}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Wallet Modal */}
      <CreateWalletModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        connectedAddress={connectedAddress}
        onCreate={handleCreateWallet}
      />
    </div>
  );
};

// Component to display individual MultiSig wallet card with data from blockchain
function MultiSigWalletCard({ address, className }: { address: `0x${string}`; className?: string }) {
  const { owners, required, txCount } = useMultiSig(address);
  const { data: balance } = useBalance({ address });

  // Always render WalletCard, even during loading
  // Use a placeholder owner address if data is still loading
  const displayOwners = owners && owners.length > 0 ? owners : [address];
  const displayRequired = required || 1;

  return (
    <WalletCard
      id={address}
      address={address}
      name={`Wallet ${address.slice(0, 6)}...${address.slice(-4)}`}
      owners={displayOwners}
      required={displayRequired}
      balance={balance ? formatEther(balance.value) : "0"}
      className={className}
    />
  );
}

export default Dashboard;
