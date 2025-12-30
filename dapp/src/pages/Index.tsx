import { Store, Github, Linkedin, FileCode } from "lucide-react";
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
          <div className="hidden sm:block">
            <Logo showTagline size="md" />
          </div>
          <div className="block sm:hidden">
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <ConnectButton variant="launch" />
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
              <span className="text-sm font-medium text-primary">Enterprise Blockchain Security</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 animate-fade-up">
              Collective Protection
              <span className="block text-3xl md:text-4xl lg:text-5xl mt-4 text-muted-foreground font-normal">
                for Digital Assets
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl font-medium text-primary mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              MultiSig Store: Multisignature Wallets as a Service
            </p>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.15s" }}>
              Purchase your pre-deployed multisig smart contract on-chain. Manage shared funds with institutional security and multi-party approvals.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <StatsCard title="Active Wallets" value={stats.activeWallets.toLocaleString()} />
              <StatsCard title="Unique Owners" value={stats.uniqueOwners.toLocaleString()} />
              <StatsCard title="Secure Transactions" value={stats.totalTransactions.toLocaleString()} />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <a
              href="https://sepolia.etherscan.io/address/0x76ADE170939349b9Ec9730342962b32443601c29#code"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              title="View Contract"
            >
              <FileCode className="w-4 h-4" />
              <span className="hidden sm:inline">Contract</span>
            </a>
            <a
              href="https://github.com/olivmath/multisig-store"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              title="GitHub Repository"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/olivmath/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
