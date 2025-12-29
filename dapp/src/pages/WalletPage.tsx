import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Shield, Coins, ArrowUpRight, Plus, Check, X } from "lucide-react";
import { useAccount, useDisconnect, useBalance, useReadContract } from "wagmi";
import { formatUnits, formatEther, parseEther, parseUnits } from "viem";
import DashboardHeader from "@/components/DashboardHeader";
import Identicon from "@/components/Identicon";
import TransactionModal from "@/components/TransactionModal";
import { TransactionCard } from "@/components/TransactionCard";
import { EventListener } from "@/components/EventListener";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMultiSig } from "@/hooks/useMultiSig";
import { useMultiSigFactory } from "@/hooks/useMultiSigFactory";
import { usePendingWallets } from "@/hooks/usePendingWallets";
import { tokenABI } from "@/lib/contracts/tokenABI";

const WalletPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { address: connectedAddress, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: userBalance } = useBalance({ address: connectedAddress });

  const walletAddress = id as `0x${string}` | undefined;
  const { owners, required, txCount, submitETH, submitERC20, submitCustomTransaction } = useMultiSig(walletAddress);
  const { data: walletBalance } = useBalance({ address: walletAddress });
  const { userMultiSigs } = useMultiSigFactory();
  const pendingWallets = usePendingWallets(userMultiSigs);

  // Token selection state
  const [selectedToken, setSelectedToken] = useState<"eth" | "custom">("eth");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [savedCustomToken, setSavedCustomToken] = useState<`0x${string}` | null>(null);
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

  // Load saved custom token from localStorage
  useEffect(() => {
    if (walletAddress) {
      const saved = localStorage.getItem(`wallet_${walletAddress}_custom_token`);
      if (saved) {
        setSavedCustomToken(saved as `0x${string}`);
      }
    }
  }, [walletAddress]);

  // Get custom token balance
  const { data: customTokenBalance } = useReadContract({
    address: savedCustomToken || undefined,
    abi: tokenABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: !!savedCustomToken && !!walletAddress && selectedToken === "custom",
    },
  });

  // Get custom token decimals
  const { data: customTokenDecimals } = useReadContract({
    address: savedCustomToken || undefined,
    abi: tokenABI,
    functionName: 'decimals',
    query: {
      enabled: !!savedCustomToken && selectedToken === "custom",
    },
  });

  // Get custom token symbol
  const { data: customTokenSymbol } = useReadContract({
    address: savedCustomToken || undefined,
    abi: tokenABI,
    functionName: 'symbol',
    query: {
      enabled: !!savedCustomToken && selectedToken === "custom",
    },
  });

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  const handleLogout = () => {
    disconnect();
    toast({
      title: "Disconnected",
      description: "You have been successfully disconnected.",
      variant: "default",
    });
    setTimeout(() => navigate("/"), 500);
  };

  const handleSaveCustomToken = () => {
    const trimmedAddress = customTokenAddress.trim();
    const isValidAddress =
      trimmedAddress &&
      trimmedAddress.startsWith("0x") &&
      trimmedAddress.length === 42 &&
      /^0x[a-fA-F0-9]{40}$/.test(trimmedAddress);

    if (isValidAddress && walletAddress) {
      setSavedCustomToken(trimmedAddress as `0x${string}`);
      localStorage.setItem(`wallet_${walletAddress}_custom_token`, trimmedAddress);
      setIsAddingToken(false);
      setCustomTokenAddress("");
      toast({
        title: "Token Saved!",
        description: "Custom token has been successfully added.",
        variant: "default",
      });
    } else {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum token address (0x followed by 40 hexadecimal characters).",
        variant: "destructive",
      });
    }
  };

  const handleTokenChange = (value: string) => {
    if (value === "custom") {
      if (!savedCustomToken) {
        setIsAddingToken(true);
      }
      setSelectedToken("custom");
    } else {
      setSelectedToken("eth");
      setIsAddingToken(false);
    }
  };

  const getDisplayBalance = () => {
    if (selectedToken === "eth") {
      return walletBalance ? formatUnits(walletBalance.value, 18) : "0";
    } else if (selectedToken === "custom" && customTokenBalance && customTokenDecimals) {
      return formatUnits(customTokenBalance as bigint, customTokenDecimals as number);
    }
    return "0";
  };

  const getTokenSymbol = () => {
    if (selectedToken === "eth") return "ETH";
    if (selectedToken === "custom" && customTokenSymbol) return customTokenSymbol as string;
    return "TOKEN";
  };

  const handleCreateTransaction = (tx: { type: string; destination: string; value: string; token?: string; data?: string }) => {
    try {
      const destination = tx.destination as `0x${string}`;

      if (tx.type === "ether") {
        // Simple ETH transfer using submitETH
        const amount = parseEther(tx.value);
        submitETH(destination, amount);

        toast({
          title: "Transaction Submitted!",
          description: "ETH transfer transaction has been submitted. Please confirm in your wallet.",
          variant: "default",
        });
      } else if (tx.type === "erc20" && tx.token) {
        // ERC20 transfer using submitERC20
        const tokenAddress = tx.token as `0x${string}`;
        const amount = parseUnits(tx.value, 18); // Assuming 18 decimals
        submitERC20(tokenAddress, destination, amount);

        toast({
          title: "Transaction Submitted!",
          description: "ERC20 transfer transaction has been submitted. Please confirm in your wallet.",
          variant: "default",
        });
      } else if (tx.type === "custom") {
        // Custom transaction using submitCustomTransaction
        const value = tx.value ? parseEther(tx.value) : BigInt(0);
        const data = (tx.data || '0x') as `0x${string}`;
        submitCustomTransaction(destination, value, data);

        toast({
          title: "Transaction Submitted!",
          description: "Custom transaction has been submitted. Please confirm in your wallet.",
          variant: "default",
        });
      } else {
        throw new Error("Invalid transaction type");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to create transaction",
        variant: "destructive",
      });
    }
  };

  if (!connectedAddress || !walletAddress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {walletAddress && <EventListener walletAddresses={[walletAddress]} />}

      <DashboardHeader
        address={connectedAddress}
        balance={userBalance ? formatEther(userBalance.value) : "0"}
        network="sepolia"
        pendingWallets={pendingWallets}
        onLogout={handleLogout}
      />

      <main className="container px-4 py-8">
        {/* Wallet Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-semibold">
              Wallet {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </h1>
          </div>
          <p className="font-mono text-muted-foreground">
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
            <div className="flex-1 flex flex-col justify-center space-y-3 pt-2 border-t border-border/50">
              {owners.length > 0 ? (
                owners.map((owner, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Identicon address={owner} size={32} />
                    <span className="font-mono text-sm truncate">
                      {owner.slice(0, 10)}...{owner.slice(-8)}
                    </span>
                    {owner === connectedAddress && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">You</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">Loading owners...</p>
              )}
            </div>
          </div>

          {/* Required Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Required</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center py-4 border-t border-border/50">
              <p className="text-5xl font-display font-bold text-primary mb-2">
                {required}<span className="text-2xl text-muted-foreground">/{owners.length}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-4">Approvals needed</p>
              <div className="mt-auto progress-gold">
                <div
                  className="progress-gold-fill"
                  style={{ width: `${owners.length > 0 ? (required / owners.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Coins className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Balance</h3>
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedToken} onValueChange={handleTokenChange}>
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress || '');
                    toast({
                      title: "Address Copied!",
                      description: "Wallet address copied to clipboard. Send funds to this address.",
                      variant: "default",
                    });
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Funds
                </Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center py-4 border-t border-border/50">
              {isAddingToken ? (
                <div className="space-y-3 px-4">
                  <p className="text-sm text-muted-foreground mb-2">Enter token contract address</p>
                  <Input
                    placeholder="0x..."
                    value={customTokenAddress}
                    onChange={(e) => setCustomTokenAddress(e.target.value)}
                    className="font-mono text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveCustomToken();
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAddingToken(false);
                        setCustomTokenAddress("");
                        setSelectedToken("eth");
                      }}
                      className="flex-1 gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={handleSaveCustomToken}
                      className="flex-1 gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                  {customTokenAddress && customTokenAddress.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {customTokenAddress.trim().length}/42 characters
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-4xl font-display font-bold">
                    {getDisplayBalance()}
                  </p>
                  <span className="text-lg text-primary font-medium mt-1">
                    {getTokenSymbol()}
                  </span>
                  {selectedToken === "custom" && savedCustomToken && (
                    <p className="text-xs text-muted-foreground font-mono mt-2">
                      {savedCustomToken.slice(0, 10)}...{savedCustomToken.slice(-8)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Transactions</h2>
          <Button
            variant="gold"
            onClick={() => setIsTransactionModalOpen(true)}
            className="gap-2"
          >
            <ArrowUpRight className="w-4 h-4" />
            New Transaction
          </Button>
        </div>

        {/* Transactions Section */}
        {txCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: txCount }, (_, i) => BigInt(i)).reverse().map((txId) => (
              <TransactionCard
                key={txId.toString()}
                multiSigAddress={walletAddress}
                txId={txId}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Coins className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">No Transactions Yet</h3>
              <p className="text-muted-foreground mb-4">
                This wallet hasn't created any transactions yet.
              </p>
              <p className="text-sm text-muted-foreground">
                Click "New Transaction" above to create your first transaction.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onCreate={handleCreateTransaction}
      />
    </div>
  );
};

export default WalletPage;
