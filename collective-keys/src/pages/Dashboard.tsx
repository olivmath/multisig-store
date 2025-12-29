import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import WalletCard from "@/components/WalletCard";
import CreateWalletModal from "@/components/CreateWalletModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const [connectedAddress, setConnectedAddress] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [pendingWallets, setPendingWallets] = useState<PendingWallet[]>([]);

  useEffect(() => {
    const address = localStorage.getItem("connectedAddress");
    if (!address) {
      navigate("/");
      return;
    }
    setConnectedAddress(address);

    // Load wallets from localStorage
    const savedWallets = localStorage.getItem("wallets");
    let loadedWallets: WalletData[] = [];
    
    if (savedWallets) {
      loadedWallets = JSON.parse(savedWallets);
      setWallets(loadedWallets);
    } else {
      // Initialize with mock data
      const mockWallets: WalletData[] = [
        {
          id: "1",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          name: "Treasury Team",
          owners: [address, "0xabcdef1234567890abcdef1234567890abcdef12", "0x567890abcdef1234567890abcdef123456789012"],
          required: 2,
          balance: "12.45"
        },
        {
          id: "2",
          address: "0xfedcba0987654321fedcba0987654321fedcba09",
          name: "Development Fund",
          owners: [address, "0x1111111111111111111111111111111111111111", "0x2222222222222222222222222222222222222222", "0x3333333333333333333333333333333333333333", "0x4444444444444444444444444444444444444444"],
          required: 3,
          balance: "89.12"
        },
        {
          id: "3",
          address: "0x9876543210fedcba9876543210fedcba98765432",
          name: "Marketing Budget",
          owners: [address, "0x5555555555555555555555555555555555555555"],
          required: 2,
          balance: "5.00"
        }
      ];
      loadedWallets = mockWallets;
      setWallets(mockWallets);
      localStorage.setItem("wallets", JSON.stringify(mockWallets));
    }

    // Calculate pending transactions per wallet
    const pending: PendingWallet[] = [];
    loadedWallets.forEach(wallet => {
      // Check if connected address is an owner
      if (wallet.owners.includes(address)) {
        const savedTxs = localStorage.getItem(`wallet_${wallet.id}_transactions`);
        let pendingCount = 0;
        
        if (savedTxs) {
          const txs = JSON.parse(savedTxs);
          pendingCount = txs.filter((tx: any) => tx.status === "pending").length;
        } else {
          // Mock: some wallets have pending transactions
          if (wallet.id === "1") pendingCount = 2;
          if (wallet.id === "2") pendingCount = 1;
        }
        
        if (pendingCount > 0) {
          pending.push({
            id: wallet.id,
            name: wallet.name,
            address: wallet.address,
            pendingCount
          });
        }
      }
    });
    
    setPendingWallets(pending);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("connectedAddress");
    toast({
      title: "Disconnected",
      description: "You have been successfully disconnected.",
      variant: "default",
    });
    setTimeout(() => navigate("/"), 500);
  };

  const handleCreateWallet = (wallet: { name: string; owners: string[]; required: number }) => {
    const newWallet: WalletData = {
      id: Date.now().toString(),
      address: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 34)}`,
      name: wallet.name,
      owners: wallet.owners,
      required: wallet.required,
      balance: "0.00"
    };
    const updatedWallets = [...wallets, newWallet];
    setWallets(updatedWallets);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));

    toast({
      title: "Wallet Created!",
      description: `${wallet.name} has been created successfully with ${wallet.owners.length} owners.`,
      variant: "default",
    });

    setTimeout(() => navigate(`/wallet/${newWallet.id}`), 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        address={connectedAddress}
        balance="2.45"
        network="mainnet"
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
            className="gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Wallet
          </Button>
        </div>

        {/* Wallets Grid - Asymmetric layout */}
        {wallets.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-3">No wallets found</h2>
            <p className="text-muted-foreground mb-6">Create your first multisig wallet to get started</p>
            <Button variant="gold" onClick={() => setIsCreateModalOpen(true)}>
              Create First Wallet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet, index) => (
              <WalletCard
                key={wallet.id}
                {...wallet}
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

export default Dashboard;
