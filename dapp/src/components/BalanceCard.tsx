import { useState, useEffect } from "react";
import { useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { Plus, Trash2, Coins } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNotifications } from "../contexts/NotificationContext";
import { tokenABI } from "@/config/contracts/tokenABI";
import Identicon from "./Identicon";
import { EthereumIcon } from "./EthereumIcon";

interface CustomToken {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
}

interface BalanceCardProps {
  walletAddress: `0x${string}`;
}

function TokenBalanceValue({ walletAddress, token }: { walletAddress: `0x${string}`; token: CustomToken }) {
  const { data: balance } = useReadContract({
    address: token.address,
    abi: tokenABI,
    functionName: "balanceOf",
    args: [walletAddress],
    query: {
      refetchInterval: 15000,
      staleTime: 5000,
    },
  });

  const formattedBalance = balance
    ? parseFloat(formatUnits(balance as bigint, token.decimals)).toFixed(4)
    : "0.0000";

  return <span className="font-semibold tabular-nums">{formattedBalance}</span>;
}

export function BalanceCard({ walletAddress }: BalanceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTokens, setCustomTokens] = useState<CustomToken[]>([]);
  const [newTokenAddress, setNewTokenAddress] = useState("");
  const { addNotification } = useNotifications();

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
      addNotification({
        type: 'error',
        title: 'Invalid Address',
        message: 'Please enter a valid token address.',
      });
      return;
    }

    if (customTokens.some((t) => t.address.toLowerCase() === newTokenAddress.toLowerCase())) {
      addNotification({
        type: 'error',
        title: 'Token Already Added',
        message: 'This token is already in your list.',
      });
      return;
    }

    if (!tokenSymbol || tokenDecimals === undefined) {
      addNotification({
        type: 'error',
        title: 'Invalid Token',
        message: "Could not fetch token information. Make sure it's a valid ERC20 token.",
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
    addNotification({
      type: 'success',
      title: 'Token Added!',
      message: `${tokenSymbol} has been added to your balance list.`,
    });
  };

  const handleRemoveToken = (address: string) => {
    const updated = customTokens.filter((t) => t.address.toLowerCase() !== address.toLowerCase());
    setCustomTokens(updated);
    if (updated.length === 0) {
      localStorage.removeItem(`customTokens-${walletAddress}`);
    }
    addNotification({
      type: 'success',
      title: 'Token Removed',
      message: 'Token has been removed from your list.',
    });
  };

  const ethBalanceFormatted = ethBalance
    ? parseFloat(formatUnits(ethBalance.value, 18)).toFixed(4)
    : "0.0000";

  return (
    <>
      <div className="rounded-2xl border border-border bg-card p-6 flex flex-col min-h-[200px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Balance</h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
          >
            <Plus className="w-4 h-4" />
            <span>Custom Token</span>
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* ETH Balance */}
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                <EthereumIcon className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm font-medium">ETH</span>
            </div>
            <span className="font-semibold tabular-nums">{ethBalanceFormatted}</span>
          </div>

          {/* Custom Token Balances */}
          {customTokens.map((token) => (
            <div key={token.address} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0 group">
              <div className="flex items-center gap-3">
                <Identicon address={token.address} size={28} />
                <span className="text-sm font-medium">{token.symbol}</span>
              </div>
              <div className="flex items-center gap-3">
                <TokenBalanceValue walletAddress={walletAddress} token={token} />
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
            <p className="text-xs text-muted-foreground mt-3">
              Add custom token contract
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
