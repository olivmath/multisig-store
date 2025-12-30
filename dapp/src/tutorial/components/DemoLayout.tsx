import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Bell, Moon, Sun, Wallet, ChevronDown } from "lucide-react";
import Logo from "../../components/Logo";
import { useDemoMode } from "../DemoModeContext";
import { formatEther } from "viem";

interface DemoLayoutProps {
  children: ReactNode;
}

export function DemoLayout({ children }: DemoLayoutProps) {
  const demoMode = useDemoMode();
  const balance = parseFloat(formatEther(demoMode.userBalance)).toFixed(4);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Announcement Banner */}
      <div className="flex-shrink-0 bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 py-4 px-4 text-center text-sm font-medium">
        <span className="bg-yellow-500 text-black px-2 py-0.5 rounded mr-2 text-xs font-bold">
          DEMO MODE
        </span>
        This is an interactive tutorial with mock data. No real transactions will occur.
      </div>

      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/tutorial" className="hidden sm:block">
            <Logo size="md" />
          </Link>
          <Link to="/tutorial" className="block sm:hidden">
            <Logo size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            {/* Theme Toggle (mock) */}
            <button className="h-10 w-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors">
              <Sun className="w-5 h-5 dark:hidden" />
              <Moon className="w-5 h-5 hidden dark:block" />
            </button>

            {/* Notification Bell */}
            <button
              data-demo="notifications"
              className="relative h-10 w-10 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                2
              </span>
            </button>

            {/* Network Selector (mock) */}
            <div className="h-10 flex items-center gap-2 px-3 rounded-lg border border-border bg-card">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{balance} ETH</span>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Sepolia
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Connect Button (mock - showing connected) */}
            <button className="h-10 flex items-center gap-2 px-4 rounded-lg bg-primary text-primary-foreground font-medium">
              <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">
                0x
              </span>
              <span className="hidden sm:inline">0x742d...fE00</span>
            </button>
          </div>
        </div>
      </header>

      {/* Body - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="flex-shrink-0 border-t border-border bg-card py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            MultiSig Store - Demo Tutorial
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-sm text-primary hover:underline"
            >
              Exit Tutorial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
