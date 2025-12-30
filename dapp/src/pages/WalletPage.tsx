import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Shield, ArrowLeft } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import Logo from "../components/Logo";
import ThemeToggle from "../components/ThemeToggle";
import ConnectButton from "../components/ConnectButton";
import { NotificationBell } from "../components/NotificationBell";
import Identicon from "../components/Identicon";
import { useMultiSig } from "../hooks/useMultiSig";

const WalletPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isConnected } = useAccount();

  const walletAddress = id as `0x${string}` | undefined;
  const { owners, required, txCount } = useMultiSig(walletAddress);
  const { data: walletBalance } = useBalance({ address: walletAddress });

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
            <NotificationBell />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Wallet Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-semibold">
              Wallet {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </h1>
          </div>
          <p className="font-mono text-muted-foreground text-sm">
            {walletAddress}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Owners Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Owners</h3>
            </div>
            <div className="space-y-2 flex-1">
              {owners.map((owner, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-background/50">
                  <Identicon address={owner} size={24} />
                  <span className="font-mono text-xs text-muted-foreground">
                    {owner.slice(0, 8)}...{owner.slice(-6)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Signatures Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Required</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-4xl font-bold">
                {required} / {owners.length}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Signatures required to execute transactions
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                </svg>
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Balance</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-4xl font-bold">
                {walletBalance ? parseFloat(formatEther(walletBalance.value)).toFixed(4) : "0.0000"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">ETH</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-6">Transactions</h2>
          {txCount === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions yet</p>
              <p className="text-sm text-muted-foreground mt-2">Create your first transaction to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Total transactions: {txCount}</p>
              <p className="text-sm text-muted-foreground">
                Transaction list feature coming soon. You can see transactions on-chain using a block explorer.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WalletPage;
