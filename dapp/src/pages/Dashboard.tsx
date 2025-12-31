import { useEffect, useState, useMemo } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { useNotifications } from "../contexts/NotificationContext";
import { Layout } from "../components/Layout";
import WalletCard from "../components/WalletCard";
import CreateWalletModal from "../components/CreateWalletModal";
import { useMultiSigFactory } from "../hooks/useMultiSigFactory";
import { useReadContract, useReadContracts, useBalance } from "wagmi";
import { formatEther } from "viem";
import { multiSigABI } from "../config/contracts/multiSigABI";
import { useDemoModeOptional } from "../tutorial/DemoModeContext";

const Dashboard = () => {
  const demoMode = useDemoModeOptional();
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { userMultiSigs, createMultiSig, isCreating, isSuccess, refetchUserMultiSigs } = useMultiSigFactory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  // In demo mode, use demo state for modal control
  const effectiveIsModalOpen = demoMode ? demoMode.isModalOpen && demoMode.modalType === "wallet" : isModalOpen;
  const setEffectiveIsModalOpen = demoMode
    ? (open: boolean) => { if (!open) demoMode.closeModal(); else demoMode.openModal("wallet"); }
    : setIsModalOpen;

  useEffect(() => {
    // Don't redirect in demo mode
    if (demoMode) return;
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate, demoMode]);

  useEffect(() => {
    if (isSuccess) {
      addNotification({
        type: 'success',
        title: 'Wallet Created',
        message: 'You deployed a new multisig wallet.',
      });
      setEffectiveIsModalOpen(false);
      refetchUserMultiSigs();
    }
  }, [isSuccess, refetchUserMultiSigs, addNotification, setEffectiveIsModalOpen]);

  const handleCreateWallet = ({ owners, required }: { owners: string[]; required: number }) => {
    createMultiSig(owners as `0x${string}`[], required);
  };

  // In demo mode, use demo user address
  const effectiveAddress = demoMode ? demoMode.userAddress : address;

  return (
    <Layout hasWallets={userMultiSigs.length > 0}>
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
              data-tour="purchase-wallet"
              data-demo="purchase-wallet"
              onClick={() => setEffectiveIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Purchase New Wallet
            </button>
          </div>
        </div>

        {/* Wallets Grid */}
        {userMultiSigs.length === 0 ? (
          <div data-tour="empty-state" className="flex flex-col items-center justify-center py-16">
            <div className="p-6 rounded-full bg-muted mb-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Wallets Found</h3>
            <p className="text-muted-foreground mb-6">
              Purchase your first multisig wallet to begin
            </p>
            <button
              onClick={() => setEffectiveIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Purchase Your First Wallet
            </button>
          </div>
        ) : (
          <div data-tour="wallet-cards" data-demo="wallet-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userMultiSigs.map((walletAddress) => (
              <WalletCardWrapper key={walletAddress} address={walletAddress} />
            ))}
          </div>
        )}
      </div>

      {/* Create Wallet Modal */}
      {effectiveAddress && (
        <CreateWalletModal
          isOpen={effectiveIsModalOpen}
          onClose={() => setEffectiveIsModalOpen(false)}
          connectedAddress={effectiveAddress}
          onCreate={handleCreateWallet}
          isCreating={isCreating}
        />
      )}
    </Layout>
  );
};

// Wrapper to fetch wallet data
const WalletCardWrapper = ({ address }: { address: string }) => {
  const demoMode = useDemoModeOptional();

  const { data: owners } = useReadContract({
    address: address as `0x${string}`,
    abi: multiSigABI,
    functionName: 'getOwners',
    query: { enabled: !demoMode },
  });

  const { data: required } = useReadContract({
    address: address as `0x${string}`,
    abi: multiSigABI,
    functionName: 'required',
    query: { enabled: !demoMode },
  });

  const { data: txCount } = useReadContract({
    address: address as `0x${string}`,
    abi: multiSigABI,
    functionName: 'txCount',
    query: { enabled: !demoMode },
  });

  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    query: { enabled: !demoMode },
  });

  // Get all transactions to count pending ones
  const txCountNum = txCount ? Number(txCount) : 0;

  const transactionContracts = useMemo(() => {
    if (demoMode || txCountNum === 0) return [];
    return Array.from({ length: txCountNum }, (_, i) => ({
      address: address as `0x${string}`,
      abi: multiSigABI,
      functionName: 'transactions' as const,
      args: [BigInt(i)],
    }));
  }, [address, txCountNum, demoMode]);

  const { data: transactionsData } = useReadContracts({
    contracts: transactionContracts,
    query: {
      enabled: transactionContracts.length > 0 && !demoMode,
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

  // Demo mode: use mock data
  if (demoMode) {
    const walletData = demoMode.getWalletData(address as `0x${string}`);
    if (!walletData) return null;

    const demoPendingCount = walletData.transactions?.filter(tx => !tx.executed).length || 0;
    const demoBalance = parseFloat(formatEther(walletData.balance)).toFixed(4);

    return (
      <DemoWalletCard
        address={address}
        owners={walletData.owners as string[]}
        required={walletData.required}
        txCount={walletData.txCount}
        pendingCount={demoPendingCount}
        balance={demoBalance}
        onSelect={() => demoMode.selectWallet(address as `0x${string}`)}
      />
    );
  }

  if (!owners || !required || txCount === undefined) {
    return (
      <div className="rounded-2xl bg-card border border-border p-6 min-h-[200px] animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-muted rounded-xl" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="space-y-1">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-5 w-8 bg-muted rounded" />
          </div>
          <div className="space-y-1">
            <div className="h-3 w-16 bg-muted rounded" />
            <div className="h-5 w-8 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  const balance = balanceData ? parseFloat(formatEther(balanceData.value)).toFixed(4) : '0';

  return (
    <WalletCard
      address={address}
      owners={owners as string[]}
      required={Number(required)}
      txCount={txCountNum}
      pendingCount={pendingCount}
      balance={balance}
    />
  );
};

// Demo mode wallet card that doesn't navigate but calls selectWallet
interface DemoWalletCardProps {
  address: string;
  owners: string[];
  required: number;
  txCount: number;
  pendingCount: number;
  balance?: string;
  onSelect: () => void;
}

const DemoWalletCard = ({ address, owners, required, txCount, pendingCount, balance, onSelect }: DemoWalletCardProps) => {
  return (
    <button
      data-demo="wallet-card"
      onClick={onSelect}
      className="w-full min-h-[200px] text-left rounded-2xl bg-card border border-border p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-xl" />
          <div>
            <h3 className="font-semibold text-lg">MultiSig Wallet</h3>
            <span className="text-xs text-muted-foreground">{address.slice(0, 6)}...{address.slice(-4)}</span>
          </div>
        </div>
        {balance && (
          <div className="flex items-center gap-1.5 text-right">
            <span className="font-semibold">{balance} ETH</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <div className="text-sm">
          <span className="font-medium">{owners.length}</span> owners
          <span className="text-muted-foreground"> · </span>
          <span className="font-medium">{required}</span> required
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Transactions</p>
          <p className="font-semibold">{txCount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Pending</p>
          <p className="font-semibold">{pendingCount}</p>
        </div>
      </div>
    </button>
  );
};

export default Dashboard;
