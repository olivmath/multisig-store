import { useEffect, useState, useMemo } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { toast } from "sonner";
import { Layout } from "../components/Layout";
import WalletCard from "../components/WalletCard";
import CreateWalletModal from "../components/CreateWalletModal";
import { useMultiSigFactory } from "../hooks/useMultiSigFactory";
import { useReadContract, useReadContracts } from "wagmi";
import { multiSigABI } from "../config/contracts/multiSigABI";

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { userMultiSigs, createMultiSig, isCreating, isSuccess, refetchUserMultiSigs } = useMultiSigFactory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Wallet Created", {
        description: "You deployed a new multisig wallet.",
      });
      setIsModalOpen(false);
      refetchUserMultiSigs();
    }
  }, [isSuccess, refetchUserMultiSigs]);

  const handleCreateWallet = ({ owners, required }: { owners: string[]; required: number }) => {
    createMultiSig(owners as `0x${string}`[], required);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Multisig Wallets</h1>
              <p className="text-muted-foreground">
                Manage all your multi-signature wallets
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Purchase New Wallet
            </button>
          </div>
        </div>

        {/* Wallets Grid */}
        {userMultiSigs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 rounded-full bg-muted mb-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Wallets Found</h3>
            <p className="text-muted-foreground mb-6">
              Purchase your first multisig wallet to begin
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Purchase Your First Wallet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMultiSigs.map((walletAddress) => (
              <WalletCardWrapper key={walletAddress} address={walletAddress} />
            ))}
          </div>
        )}
      </div>

      {/* Create Wallet Modal */}
      {address && (
        <CreateWalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          connectedAddress={address}
          onCreate={handleCreateWallet}
          isCreating={isCreating}
        />
      )}
    </Layout>
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

  const { data: txCount } = useReadContract({
    address: address as `0x${string}`,
    abi: multiSigABI,
    functionName: 'txCount',
  });

  // Get all transactions to count pending ones
  const txCountNum = txCount ? Number(txCount) : 0;

  const transactionContracts = useMemo(() => {
    if (txCountNum === 0) return [];
    return Array.from({ length: txCountNum }, (_, i) => ({
      address: address as `0x${string}`,
      abi: multiSigABI,
      functionName: 'transactions' as const,
      args: [BigInt(i)],
    }));
  }, [address, txCountNum]);

  const { data: transactionsData } = useReadContracts({
    contracts: transactionContracts,
    query: {
      enabled: transactionContracts.length > 0,
    },
  });

  // Count pending transactions (executed === false)
  const pendingCount = useMemo(() => {
    if (!transactionsData) return 0;
    return transactionsData.filter((txResult) => {
      if (!txResult?.result) return false;
      const tx = txResult.result as unknown as any[];
      const executed = tx[4] as boolean; // Index 4 is executed field
      return !executed;
    }).length;
  }, [transactionsData]);

  if (!owners || !required || txCount === undefined) {
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
      txCount={txCountNum}
      pendingCount={pendingCount}
    />
  );
};

export default Dashboard;
