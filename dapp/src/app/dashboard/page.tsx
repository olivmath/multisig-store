'use client'

import { useEffect, useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import DashboardHeader from "@/components/DashboardHeader";
import WalletCard from "@/components/WalletCard";
import CreateWalletModal from "@/components/CreateWalletModal";
import { EventListener } from "@/components/EventListener";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMultiSigFactory } from "@/hooks/useMultiSigFactory";
import { usePendingWallets } from "@/hooks/usePendingWallets";
import { useWalletTransactionStats } from "@/hooks/useWalletTransactionStats";
import { useMultiSig } from "@/hooks/useMultiSig";
import { formatEther } from "viem";

export const dynamic = 'force-dynamic'

interface PendingWallet {
  id: string;
  name: string;
  address: string;
  pendingCount: number;
}

export default function Dashboard() {
  const { toast } = useToast();
  const router = useRouter();
  const { address: connectedAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: balance } = useBalance({ address: connectedAddress });

  const { userMultiSigs, createMultiSig, isCreating, isSuccess, refetchUserMultiSigs } = useMultiSigFactory();
  const pendingWallets = usePendingWallets(userMultiSigs);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

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
    setTimeout(() => router.push("/"), 500);
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
      <EventListener walletAddresses={userMultiSigs} />

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
            <h1 className="font-display text-3xl font-semibold mb-2">Store Wallets</h1>
            <p className="text-muted-foreground">
              Buy your multisig wallets!
            </p>
          </div>
          <Button
            variant="gold"
            size="lg"
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isCreating}
            className="gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            {isCreating ? "Buying..." : "Buy New Wallet"}
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
}

// Component to display individual MultiSig wallet card with data from blockchain
function MultiSigWalletCard({ address, className }: { address: `0x${string}`; className?: string }) {
  const { owners, required } = useMultiSig(address);
  const { data: balance } = useBalance({ address });
  const { totalTransactions, pendingTransactions } = useWalletTransactionStats(address);

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
      totalTransactions={totalTransactions}
      pendingTransactions={pendingTransactions}
      className={className}
    />
  );
}
