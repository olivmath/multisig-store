import { Store } from "lucide-react";
import Logo from "../components/Logo";
import StatsCard from "../components/StatsCard";
import ThemeToggle from "../components/ThemeToggle";
import ConnectButton from "../components/ConnectButton";
import { useGlobalStats } from "../hooks/useGlobalStats";

const Index = () => {
  const stats = useGlobalStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Logo showTagline size="md" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        {/* Content */}
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Store className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next-Generation Blockchain Security</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 animate-fade-up">
              MultiSig<span className="text-primary">Store</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 text-muted-foreground font-normal">
                Secure Multi-Signature Digital Wallets
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Buy your secure multisig digital wallets. <br /> Protect your shared assets with multiple signatures.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <StatsCard title="Active Wallets" value={stats.activeWallets.toLocaleString()} />
              <StatsCard title="Unique Owners" value={stats.uniqueOwners.toLocaleString()} />
              <StatsCard title="Total Transactions" value={stats.totalTransactions.toLocaleString()} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © 2025 MultiSigStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
