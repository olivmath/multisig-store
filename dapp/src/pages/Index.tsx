import { Store, Github, Linkedin, FileCode } from "lucide-react";
import Logo from "../components/Logo";
import StatsCard from "../components/StatsCard";
import ThemeToggle from "../components/ThemeToggle";
import ConnectButton from "../components/ConnectButton";
import Silk from "../components/Silk";
import { AnnouncementBanner } from "../components/AnnouncementBanner";
import { useGlobalStats } from "../hooks/useGlobalStats";

const Index = () => {
  const stats = useGlobalStats();

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Announcement Banner */}
      <AnnouncementBanner variant="promo" storageKey="new-version-banner-v1">
        New version available! Now with <strong>custom token tracking</strong> and improved security.
      </AnnouncementBanner>

      {/* Header - Fixed */}
      <header className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div className="hidden sm:block">
            <Logo showTagline size="md" />
          </div>
          <div className="block sm:hidden">
            <Logo size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ConnectButton variant="launch" />
          </div>
        </div>
      </header>

      {/* Hero Section - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <section className="relative min-h-full flex items-center justify-center overflow-hidden">
          {/* Silk Background */}
          <div className="absolute inset-0">
            <Silk
              speed={5}
              scale={1}
              color="#D4AF37"
              noiseIntensity={1.5}
              rotation={0}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />

          {/* Content */}
          <div className="relative container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
                <Store className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Enterprise Blockchain Security</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 animate-fade-up">
                Collective Protection
                <span className="block text-2xl md:text-3xl lg:text-4xl mt-4 text-muted-foreground font-normal">
                  for Digital Assets
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl font-medium text-primary mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
                MultiSig Store: Multisignature Wallets as a Service
              </p>

              {/* Subheadline */}
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
                Purchase your pre-deployed multisig smart contract on-chain. Manage shared funds with institutional security and multi-party approvals.
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
                <StatsCard title="Active Wallets" value={stats.activeWallets.toLocaleString()} />
                <StatsCard title="Unique Owners" value={stats.uniqueOwners.toLocaleString()} />
                <StatsCard title="Secure Transactions" value={stats.totalTransactions.toLocaleString()} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Fixed */}
      <footer className="flex-shrink-0 border-t border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <p className="text-sm text-muted-foreground">
            © 2025 MultiSig Store @{" "}
            <a
              href="https://github.com/olivmath"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              olivmath
            </a>
            {" "}- All rights reserved
          </p>
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
              href="https://www.linkedin.com/in/olivmath/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
