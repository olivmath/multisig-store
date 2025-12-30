import { ArrowLeft, Plus, Users, Shield, Check, Clock } from "lucide-react";
import { formatEther } from "viem";
import { useDemoMode } from "../DemoModeContext";
import { DemoLayout } from "./DemoLayout";
import Identicon from "../../components/Identicon";
import { CopyableAddress } from "../../components/CopyableAddress";
import { EthereumIcon } from "../../components/EthereumIcon";

export function DemoWalletPage() {
  const demoMode = useDemoMode();
  const wallet = demoMode.currentWallet;

  if (!wallet) return null;

  const balance = parseFloat(formatEther(wallet.balance)).toFixed(4);

  return (
    <DemoLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => demoMode.selectWallet(null as any)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Wallet Header */}
        <div className="mb-8 flex items-center gap-4">
          <Identicon address={wallet.address} size={56} className="rounded-xl flex-shrink-0" />
          <div>
            <h1 className="font-display text-3xl font-semibold">
              Multisig Wallet
            </h1>
            <CopyableAddress address={wallet.address} className="text-muted-foreground" showIdenticon={false} truncate="long" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Owners Card */}
          <div data-demo="owners-list" className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Owners</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {wallet.owners.map((owner, index) => (
                <div key={index} className="flex items-center gap-2 py-2 border-b border-border/50 last:border-0">
                  <CopyableAddress address={owner} className="text-sm" identiconSize={28} truncate="short" />
                </div>
              ))}
            </div>
          </div>

          {/* Required Signatures Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Required Signatures</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-4xl font-bold">
                {wallet.required} / {wallet.owners.length}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Approvals required
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <div data-demo="wallet-balance" className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[200px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-blue-500/10">
                <EthereumIcon className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Balance</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-4xl font-bold">
                {balance} <span className="text-lg text-muted-foreground">ETH</span>
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">USDC</span>
                  <span className="font-medium">1,500.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">DAI</span>
                  <span className="font-medium">250.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Transactions</h2>
            <button
              data-demo="create-transaction"
              onClick={() => demoMode.openModal("transaction")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              New Transaction
            </button>
          </div>

          {wallet.transactions && wallet.transactions.length > 0 ? (
            <div data-demo="transactions-list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallet.transactions.map((tx, index) => (
                <DemoTransactionCard
                  key={index}
                  tx={tx}
                  required={wallet.required}
                  isFirst={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-lg font-medium mb-2">No Transactions</p>
              <p className="text-muted-foreground">This wallet hasn't executed any transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}

interface DemoTransactionCardProps {
  tx: {
    id: number;
    txType: number;
    to: `0x${string}`;
    amount: bigint;
    executed: boolean;
    confirmCount: number;
    confirmedBy: `0x${string}`[];
  };
  required: number;
  isFirst: boolean;
}

function DemoTransactionCard({ tx, required, isFirst }: DemoTransactionCardProps) {
  const demoMode = useDemoMode();
  const amount = parseFloat(formatEther(tx.amount)).toFixed(4);
  const typeLabels = ["ETH", "ERC20", "Custom"];
  const typeColors = [
    "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  ];

  return (
    <div
      data-demo={isFirst ? "transaction-card" : undefined}
      className={`rounded-2xl border bg-card p-5 ${
        tx.executed ? "border-green-500/30" : "border-yellow-500/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${typeColors[tx.txType]}`}>
          {typeLabels[tx.txType]}
        </span>
        <span className={`flex items-center gap-1.5 text-sm font-medium ${
          tx.executed ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
        }`}>
          {tx.executed ? (
            <>
              <Check className="w-4 h-4" />
              Executed
            </>
          ) : (
            <>
              <Clock className="w-4 h-4" />
              Pending
            </>
          )}
        </span>
      </div>

      {/* Recipient */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-1">To</p>
        <CopyableAddress address={tx.to} truncate="short" className="text-sm" />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-1">Amount</p>
        <p className="text-lg font-semibold">{amount} ETH</p>
      </div>

      {/* Confirmations */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {tx.confirmedBy.slice(0, 3).map((addr, i) => (
              <Identicon key={i} address={addr} size={24} className="rounded-full border-2 border-card" />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {tx.confirmCount} / {required}
          </span>
        </div>

        {!tx.executed && isFirst && (
          <button
            data-demo="confirm-tx-btn"
            onClick={() => demoMode.confirmTransaction()}
            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
        )}
      </div>
    </div>
  );
}
