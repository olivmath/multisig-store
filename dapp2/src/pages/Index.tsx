import { useState } from "react";
import { ArrowRight, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import StatsCard from "@/components/StatsCard";
import ConnectWalletModal from "@/components/ConnectWalletModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useGlobalStats } from "@/hooks/useGlobalStats";

const Index = () => {
  const { toast } = useToast();
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleConnect = (address: string) => {
    toast({
      title: "Wallet Connected!",
      description: `Successfully connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      variant: "default",
    });
    setTimeout(() => navigate("/dashboard"), 500);
  };

  // Read real stats from blockchain
  const stats = useGlobalStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Logo showTagline size="md" />
            <Button variant="gold" className="gap-2" onClick={() => setIsConnectModalOpen(true)}>
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

        {/* Content */}
        <div className="relative container px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
              <Store className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Next-Generation Blockchain Security</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 animate-fade-up">
              MultiSig<span className="text-primary">Store</span>
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 text-muted-foreground font-sans font-normal">
                Secure Multi-Signature Digital Wallets
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Buy your secure multisig digital wallets. <br/> Protect your shared assets with multiple signatures.
            </p>

            {/* CTA */}


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <StatsCard
                title="Active Wallets"
                value={stats.activeWallets.toLocaleString()}
              />
              <StatsCard
                title="Unique Owners"
                value={stats.uniqueOwners.toLocaleString()}
              />
              <StatsCard
                title="Total Transactions"
                value={stats.totalTransactions.toLocaleString()}
              />
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>



      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © 2025 MultiSigStore @ olivmath. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Connect Modal */}
      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default Index;
