import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Shield, Coins, ArrowUpRight, Check } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import Identicon from "@/components/Identicon";
import TransactionList, { Transaction } from "@/components/TransactionList";
import TransactionModal from "@/components/TransactionModal";
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

interface WalletData {
  id: string;
  address: string;
  name: string;
  owners: string[];
  required: number;
  balance: string;
}

interface CustomToken {
  address: string;
  balance: string;
}

interface PendingWallet {
  id: string;
  name: string;
  address: string;
  pendingCount: number;
}

const WalletPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectedAddress, setConnectedAddress] = useState<string>("");
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [allWallets, setAllWallets] = useState<WalletData[]>([]);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedToken, setSelectedToken] = useState("eth");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [customToken, setCustomToken] = useState<CustomToken | null>(null);
  const [isAddingCustomToken, setIsAddingCustomToken] = useState(false);
  const [pendingWallets, setPendingWallets] = useState<PendingWallet[]>([]);

  useEffect(() => {
    const address = localStorage.getItem("connectedAddress");
    if (!address) {
      navigate("/");
      return;
    }
    setConnectedAddress(address);

    // Load all wallets from localStorage
    const savedWallets = localStorage.getItem("wallets");
    if (savedWallets) {
      const wallets: WalletData[] = JSON.parse(savedWallets);
      setAllWallets(wallets);
      const foundWallet = wallets.find(w => w.id === id);
      if (foundWallet) {
        setWallet(foundWallet);
      } else {
        navigate("/dashboard");
        return;
      }

      // Calculate pending transactions per wallet for notifications
      const pending: PendingWallet[] = [];
      wallets.forEach(w => {
        if (w.owners.includes(address)) {
          const savedTxs = localStorage.getItem(`wallet_${w.id}_transactions`);
          let pendingCount = 0;
          
          if (savedTxs) {
            const txs = JSON.parse(savedTxs);
            pendingCount = txs.filter((tx: any) => tx.status === "pending").length;
          } else {
            if (w.id === "1") pendingCount = 2;
            if (w.id === "2") pendingCount = 1;
          }
          
          if (pendingCount > 0) {
            pending.push({
              id: w.id,
              name: w.name,
              address: w.address,
              pendingCount
            });
          }
        }
      });
      setPendingWallets(pending);
    } else {
      navigate("/dashboard");
      return;
    }

    // Load custom token if saved
    const savedCustomToken = localStorage.getItem(`wallet_${id}_custom_token`);
    if (savedCustomToken) {
      setCustomToken(JSON.parse(savedCustomToken));
    }

    // Load transactions
    const savedTxs = localStorage.getItem(`wallet_${id}_transactions`);
    if (savedTxs) {
      const parsedTxs = JSON.parse(savedTxs);
      setTransactions(parsedTxs.map((tx: any) => ({
        ...tx,
        createdAt: new Date(tx.createdAt)
      })));
    } else {
      // Initialize with mock transactions
      const mockTxs: Transaction[] = [
        {
          id: "tx1",
          type: "ether",
          destination: "0xabcdef1234567890abcdef1234567890abcdef12",
          value: "0.5",
          confirmations: 1,
          required: 2,
          status: "pending",
          createdAt: new Date(Date.now() - 3600000)
        },
        {
          id: "tx2",
          type: "erc20",
          destination: "0x567890abcdef1234567890abcdef123456789012",
          value: "1000",
          token: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          confirmations: 2,
          required: 2,
          status: "confirmed",
          txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          createdAt: new Date(Date.now() - 86400000)
        }
      ];
      setTransactions(mockTxs);
      localStorage.setItem(`wallet_${id}_transactions`, JSON.stringify(mockTxs));
    }
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("connectedAddress");
    toast({
      title: "Disconnected",
      description: "You have been successfully disconnected.",
      variant: "default",
    });
    setTimeout(() => navigate("/"), 500);
  };

  const handleCreateTransaction = (tx: { type: string; destination: string; value: string; token?: string; data?: string }) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: tx.type as "ether" | "erc20" | "custom",
      destination: tx.destination,
      value: tx.value,
      token: tx.token,
      data: tx.data,
      confirmations: 1,
      required: wallet?.required || 2,
      status: "pending",
      createdAt: new Date()
    };
    const updatedTxs = [newTx, ...transactions];
    setTransactions(updatedTxs);
    localStorage.setItem(`wallet_${id}_transactions`, JSON.stringify(updatedTxs));

    // Update pending wallets
    updatePendingWallets(updatedTxs);

    // Show success toast
    toast({
      title: "Transaction Created!",
      description: `New ${tx.type} transaction submitted for approval.`,
      variant: "default",
    });
  };

  const handleConfirmTransaction = (txId: string) => {
    const updatedTxs = transactions.map(tx => {
      if (tx.id === txId) {
        const newConfirmations = tx.confirmations + 1;
        const isNowConfirmed = newConfirmations >= tx.required;
        return {
          ...tx,
          confirmations: newConfirmations,
          status: isNowConfirmed ? "confirmed" as const : "pending" as const,
          txHash: isNowConfirmed ? `0x${Math.random().toString(16).slice(2)}` : undefined
        };
      }
      return tx;
    });
    setTransactions(updatedTxs);
    localStorage.setItem(`wallet_${id}_transactions`, JSON.stringify(updatedTxs));

    // Update pending wallets
    updatePendingWallets(updatedTxs);

    // Show success toast
    const updatedTx = updatedTxs.find(t => t.id === txId);
    if (updatedTx?.status === "confirmed") {
      toast({
        title: "Transaction Executed!",
        description: "The transaction has been confirmed and executed successfully.",
        variant: "default",
      });
    } else {
      toast({
        title: "Confirmation Added!",
        description: `Transaction now has ${updatedTx?.confirmations}/${updatedTx?.required} confirmations.`,
        variant: "default",
      });
    }
  };

  const updatePendingWallets = (currentTxs: Transaction[]) => {
    const pending: PendingWallet[] = [];
    allWallets.forEach(w => {
      if (w.owners.includes(connectedAddress)) {
        let pendingCount = 0;
        
        if (w.id === id) {
          pendingCount = currentTxs.filter(tx => tx.status === "pending").length;
        } else {
          const savedTxs = localStorage.getItem(`wallet_${w.id}_transactions`);
          if (savedTxs) {
            const txs = JSON.parse(savedTxs);
            pendingCount = txs.filter((tx: any) => tx.status === "pending").length;
          }
        }
        
        if (pendingCount > 0) {
          pending.push({
            id: w.id,
            name: w.name,
            address: w.address,
            pendingCount
          });
        }
      }
    });
    setPendingWallets(pending);
  };

  const handleSaveCustomToken = () => {
    const trimmedAddress = customTokenAddress.trim();
    const isValidAddress =
      trimmedAddress &&
      trimmedAddress.startsWith("0x") &&
      trimmedAddress.length === 42 &&
      /^0x[a-fA-F0-9]{40}$/.test(trimmedAddress);

    if (isValidAddress) {
      const newCustomToken: CustomToken = {
        address: trimmedAddress,
        balance: (Math.random() * 10000).toFixed(2)
      };
      setCustomToken(newCustomToken);
      localStorage.setItem(`wallet_${id}_custom_token`, JSON.stringify(newCustomToken));
      setIsAddingCustomToken(false);
      setSelectedToken("custom");
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
    setSelectedToken(value);
    if (value === "custom" && !customToken) {
      setIsAddingCustomToken(true);
    } else {
      setIsAddingCustomToken(false);
    }
  };

  if (!wallet) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getDisplayBalance = () => {
    switch (selectedToken) {
      case "eth":
        return wallet.balance;
      case "usdt":
        return "5,000.00";
      case "usdc":
        return "3,250.00";
      case "custom":
        return customToken?.balance || "0.00";
      default:
        return wallet.balance;
    }
  };

  const getTokenSymbol = () => {
    switch (selectedToken) {
      case "eth":
        return "ETH";
      case "usdt":
        return "USDT";
      case "usdc":
        return "USDC";
      case "custom":
        return "TOKEN";
      default:
        return "ETH";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        address={connectedAddress}
        balance="2.45"
        network="mainnet"
        pendingWallets={pendingWallets}
        onLogout={handleLogout}
      />

      <main className="container px-4 py-8">
        {/* Wallet Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl font-semibold">{wallet.name}</h1>
          </div>
          <p className="font-mono text-muted-foreground">
            {wallet.address}
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
              {wallet.owners.map((owner, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Identicon address={owner} size={32} />
                  <span className="font-mono text-sm truncate">
                    {owner.slice(0, 10)}...{owner.slice(-8)}
                  </span>
                  {owner === connectedAddress && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">You</span>
                  )}
                </div>
              ))}
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
                {wallet.required}<span className="text-2xl text-muted-foreground">/{wallet.owners.length}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-4">Approvals needed</p>
              <div className="mt-auto progress-gold">
                <div
                  className="progress-gold-fill"
                  style={{ width: `${(wallet.required / wallet.owners.length) * 100}%` }}
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
              <Select value={selectedToken} onValueChange={handleTokenChange}>
                <SelectTrigger className="w-28 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 flex flex-col justify-center text-center py-4 border-t border-border/50">
              {isAddingCustomToken ? (
                <div className="space-y-3">
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
                        setIsAddingCustomToken(false);
                        setCustomTokenAddress("");
                        setSelectedToken("eth");
                      }}
                      className="flex-1"
                    >
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
                  {selectedToken === "custom" && customToken && (
                    <p className="text-xs text-muted-foreground font-mono mt-2">
                      {customToken.address.slice(0, 10)}...{customToken.address.slice(-8)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Button */}
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

        {/* Transactions List */}
        <TransactionList
          transactions={transactions}
          onConfirm={handleConfirmTransaction}
        />
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
