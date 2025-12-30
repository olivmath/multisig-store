import { useState } from "react";
import { Bell, ChevronDown, LogOut, Wallet, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import Logo from "./Logo";
import Identicon from "./Identicon";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "./NotificationBell";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PendingWallet {
  id: string;
  name: string;
  address: string;
  pendingCount: number;
}

interface DashboardHeaderProps {
  address: string;
  balance: string;
  network: string;
  pendingWallets: PendingWallet[];
  onLogout: () => void;
}

const networks = [
  { id: sepolia.id, name: "Sepolia" },
  { id: 31337, name: "Anvil" },
];

const DashboardHeader = ({ address, balance, network, pendingWallets, onLogout }: DashboardHeaderProps) => {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalPending = pendingWallets.reduce((sum, w) => sum + w.pendingCount, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard">
          <Logo size="sm" />
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Real-time Notifications */}
          <NotificationBell />

          {/* Pending Transactions */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <CheckCircle className="w-5 h-5" />
                {totalPending > 0 && (
                  <span className="notification-badge">{totalPending}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-border">
                <h4 className="font-display font-semibold">Pending Transactions</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Wallets requiring your approval
                </p>
              </div>

              {pendingWallets.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {pendingWallets.map((wallet) => (
                    <Link
                      key={wallet.id}
                      to={`/wallet/${wallet.id}`}
                      className="flex items-center gap-3 p-4 hover:bg-secondary transition-colors border-b border-border last:border-b-0 group"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Wallet className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate group-hover:text-primary transition-colors">
                          {wallet.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">
                          {wallet.pendingCount} pending
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Bell className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No pending transactions
                  </p>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Network Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                {networks.find(n => n.id === chainId)?.name || "Network"}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {networks.map((net) => (
                <DropdownMenuItem
                  key={net.id}
                  onClick={() => {
                    switchChain({ chainId: net.id }, {
                      onSuccess: () => {
                        toast({
                          title: "Network Changed",
                          description: `Switched to ${net.name}`,
                          variant: "default",
                        });
                        // Refresh the page to reload contracts
                        window.location.reload();
                      },
                      onError: (error) => {
                        toast({
                          title: "Network Change Failed",
                          description: error.message,
                          variant: "destructive",
                        });
                      },
                    });
                  }}
                  className={chainId === net.id ? "bg-secondary" : ""}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${chainId === net.id ? 'bg-green-500' : 'bg-muted'}`} />
                    {net.name}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Balance */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="font-semibold">{balance}</span>
            <span className="text-primary text-sm">ETH</span>
          </div>

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Identicon address={address} size={28} />
                <span className="hidden md:inline font-mono text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
