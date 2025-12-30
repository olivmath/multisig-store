import { Plus, ShoppingCart, Users, Shield, Clock } from "lucide-react";
import { formatEther } from "viem";
import { useDemoMode } from "../DemoModeContext";
import { DemoLayout } from "./DemoLayout";
import Identicon from "../../components/Identicon";
import { CopyableAddress } from "../../components/CopyableAddress";
import { EthereumIcon } from "../../components/EthereumIcon";

export function DemoDashboard() {
  const demoMode = useDemoMode();

  return (
    <DemoLayout>
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
              data-demo="purchase-wallet"
              onClick={() => demoMode.openModal("wallet")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              Purchase New Wallet
            </button>
          </div>
        </div>

        {/* Wallets Grid */}
        {demoMode.wallets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="p-6 rounded-full bg-muted mb-4">
              <ShoppingCart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Wallets Found</h3>
            <p className="text-muted-foreground mb-6">
              Purchase your first multisig wallet to begin
            </p>
          </div>
        ) : (
          <div data-demo="wallet-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoMode.wallets.map((wallet) => (
              <DemoWalletCard
                key={wallet.address}
                wallet={wallet}
                onClick={() => demoMode.selectWallet(wallet.address)}
              />
            ))}
          </div>
        )}
      </div>
    </DemoLayout>
  );
}

interface DemoWalletCardProps {
  wallet: {
    address: `0x${string}`;
    owners: `0x${string}`[];
    required: number;
    balance: bigint;
    txCount: number;
    transactions?: Array<{ executed: boolean }>;
  };
  onClick: () => void;
}

function DemoWalletCard({ wallet, onClick }: DemoWalletCardProps) {
  const pendingCount = wallet.transactions?.filter((tx) => !tx.executed).length || 0;
  const balance = parseFloat(formatEther(wallet.balance)).toFixed(4);

  return (
    <div
      data-demo="wallet-card"
      onClick={onClick}
      className="group rounded-2xl bg-card border border-border p-6 hover:border-primary/50 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Identicon address={wallet.address} size={40} className="rounded-xl flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <CopyableAddress
            address={wallet.address}
            className="font-medium"
            truncate="short"
            showIdenticon={false}
          />
        </div>
      </div>

      {/* Balance */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Balance</p>
        <p className="text-xl font-semibold flex items-center gap-2">
          <EthereumIcon className="w-5 h-5 text-blue-500" />
          {balance} ETH
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Owners</p>
            <p className="font-medium">{wallet.owners.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Required</p>
            <p className="font-medium">{wallet.required} / {wallet.owners.length}</p>
          </div>
        </div>
      </div>

      {/* Pending Badge */}
      {pendingCount > 0 && (
        <div className="mt-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">{pendingCount} pending</span>
        </div>
      )}
    </div>
  );
}
