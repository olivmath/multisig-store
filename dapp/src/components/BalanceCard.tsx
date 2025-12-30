import { useState, useEffect } from "react";
import { useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { ChevronDown, Plus, Trash2, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { tokenABI } from "@/config/contracts/tokenABI";

interface CustomToken {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
}

interface BalanceCardProps {
  walletAddress: `0x${string}`;
}

function TokenBalance({ walletAddress, token }: { walletAddress: `0x${string}`; token: CustomToken }) {
  const { data: balance } = useReadContract({
    address: token.address,
    abi: tokenABI,
    functionName: "balanceOf",
    args: [walletAddress],
    query: {
      refetchInterval: 10000,
    },
  });

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance as bigint, token.decimals)).toFixed(4)
    : "0.0000";

  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{token.symbol}</span>
      <span className="font-semibold">{formattedBalance}</span>
    </div>
  );
}

export function BalanceCard({ walletAddress }: BalanceCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTokens, setCustomTokens] = useState<CustomToken[]>([]);
  const [newTokenAddress, setNewTokenAddress] = useState("");

  const { data: ethBalance } = useBalance({ address: walletAddress });

  // Load custom tokens from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`customTokens-${walletAddress}`);
    if (stored) {
      try {
        setCustomTokens(JSON.parse(stored));
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, [walletAddress]);

  // Save custom tokens to localStorage
  useEffect(() => {
    if (customTokens.length > 0) {
      localStorage.setItem(`customTokens-${walletAddress}`, JSON.stringify(customTokens));
    }
  }, [customTokens, walletAddress]);

  const { data: tokenSymbol, isLoading: isLoadingSymbol } = useReadContract({
    address: newTokenAddress as `0x${string}`,
    abi: tokenABI,
    functionName: "symbol",
    query: {
      enabled: newTokenAddress.length === 42 && newTokenAddress.startsWith("0x"),
    },
  });

  const { data: tokenDecimals, isLoading: isLoadingDecimals } = useReadContract({
    address: newTokenAddress as `0x${string}`,
    abi: tokenABI,
    functionName: "decimals",
    query: {
      enabled: newTokenAddress.length === 42 && newTokenAddress.startsWith("0x"),
    },
  });

  const handleAddToken = () => {
    if (!newTokenAddress || newTokenAddress.length !== 42) {
      toast.error("Invalid Address", {
        description: "Please enter a valid token address.",
      });
      return;
    }

    if (customTokens.some((t) => t.address.toLowerCase() === newTokenAddress.toLowerCase())) {
      toast.error("Token Already Added", {
        description: "This token is already in your list.",
      });
      return;
    }

    if (!tokenSymbol || tokenDecimals === undefined) {
      toast.error("Invalid Token", {
        description: "Could not fetch token information. Make sure it's a valid ERC20 token.",
      });
      return;
    }

    const newToken: CustomToken = {
      address: newTokenAddress as `0x${string}`,
      symbol: tokenSymbol as string,
      decimals: Number(tokenDecimals),
    };

    setCustomTokens([...customTokens, newToken]);
    setNewTokenAddress("");
    setIsModalOpen(false);
    toast.success("Token Added!", {
      description: `${tokenSymbol} has been added to your balance list.`,
    });
  };

  const handleRemoveToken = (address: string) => {
    const updated = customTokens.filter((t) => t.address.toLowerCase() !== address.toLowerCase());
    setCustomTokens(updated);
    if (updated.length === 0) {
      localStorage.removeItem(`customTokens-${walletAddress}`);
    }
    toast.success("Token Removed", {
      description: "Token has been removed from your list.",
    });
  };

  const ethBalanceFormatted = ethBalance
    ? parseFloat(formatUnits(ethBalance.value, 18)).toFixed(4)
    : "0.0000";

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Balances</h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted"
            >
              <Plus className="w-3 h-3" />
              <span>Add Token</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 min-w-[140px]">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  + Custom Token
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {/* ETH Balance */}
          <div className="flex justify-between items-center py-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-muted-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
              </svg>
              <span className="text-sm text-muted-foreground">ETH</span>
            </div>
            <span className="font-semibold">{ethBalanceFormatted}</span>
          </div>

          {/* Custom Token Balances */}
          {customTokens.map((token) => (
            <div key={token.address} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 group">
              <span className="text-sm text-muted-foreground">{token.symbol}</span>
              <div className="flex items-center gap-2">
                <TokenBalance walletAddress={walletAddress} token={token} />
                <button
                  onClick={() => handleRemoveToken(token.address)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}

          {customTokens.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Click "Add Token" to track custom tokens
            </p>
          )}
        </div>
      </div>

      {/* Add Token Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              Add Custom Token
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tokenAddress">Token Contract Address</Label>
              <Input
                id="tokenAddress"
                placeholder="0x..."
                value={newTokenAddress}
                onChange={(e) => setNewTokenAddress(e.target.value)}
                className="bg-background font-mono text-sm"
              />
            </div>

            {newTokenAddress.length === 42 && tokenSymbol && (
              <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Token Found:</span>
                  <span className="font-semibold">{tokenSymbol as string}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">Decimals:</span>
                  <span className="text-sm">{tokenDecimals?.toString()}</span>
                </div>
              </div>
            )}

            {newTokenAddress.length === 42 && !tokenSymbol && !isLoadingSymbol && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">Could not find token at this address</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              className="flex-1"
              onClick={handleAddToken}
              disabled={!tokenSymbol || isLoadingSymbol || isLoadingDecimals}
            >
              {isLoadingSymbol || isLoadingDecimals ? "Loading..." : "Add Token"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
