import { useState, useEffect } from "react";
import { ArrowUpRight, Coins, Code, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";
import { parseEther, parseUnits } from "viem";

type TransactionType = "eth" | "erc20" | "custom";

interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitETH: (to: `0x${string}`, amount: bigint) => void;
  onSubmitERC20: (token: `0x${string}`, to: `0x${string}`, amount: bigint) => void;
  onSubmitCustom: (to: `0x${string}`, value: bigint, data: `0x${string}`) => void;
  isSubmitting?: boolean;
}

const CreateTransactionModal = ({
  isOpen,
  onClose,
  onSubmitETH,
  onSubmitERC20,
  onSubmitCustom,
  isSubmitting = false,
}: CreateTransactionModalProps) => {
  const [txType, setTxType] = useState<TransactionType>("eth");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenDecimals, setTokenDecimals] = useState("18");
  const [calldata, setCalldata] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTxType("eth");
      setDestination("");
      setAmount("");
      setTokenAddress("");
      setTokenDecimals("18");
      setCalldata("");
    }
  }, [isOpen]);

  const isValidAddress = (addr: string) => {
    return addr.startsWith("0x") && addr.length === 42 && /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleSubmit = () => {
    // Validate destination
    if (!isValidAddress(destination)) {
      toast.error("Invalid Destination", {
        description: "Please enter a valid Ethereum address.",
      });
      return;
    }

    if (txType === "eth") {
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Invalid Amount", {
          description: "Please enter a valid amount.",
        });
        return;
      }
      try {
        const amountWei = parseEther(amount);
        onSubmitETH(destination as `0x${string}`, amountWei);
      } catch {
        toast.error("Invalid Amount", {
          description: "Please enter a valid ETH amount.",
        });
        return;
      }
    } else if (txType === "erc20") {
      if (!isValidAddress(tokenAddress)) {
        toast.error("Invalid Token Address", {
          description: "Please enter a valid token contract address.",
        });
        return;
      }
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Invalid Amount", {
          description: "Please enter a valid amount.",
        });
        return;
      }
      try {
        const decimals = parseInt(tokenDecimals) || 18;
        const amountUnits = parseUnits(amount, decimals);
        onSubmitERC20(tokenAddress as `0x${string}`, destination as `0x${string}`, amountUnits);
      } catch {
        toast.error("Invalid Amount", {
          description: "Please enter a valid token amount.",
        });
        return;
      }
    } else if (txType === "custom") {
      if (!calldata.startsWith("0x")) {
        toast.error("Invalid Calldata", {
          description: "Calldata must start with 0x.",
        });
        return;
      }
      try {
        const value = amount ? parseEther(amount) : BigInt(0);
        onSubmitCustom(destination as `0x${string}`, value, calldata as `0x${string}`);
      } catch {
        toast.error("Invalid Value", {
          description: "Please enter a valid ETH value.",
        });
        return;
      }
    }
  };

  const typeOptions = [
    { value: "eth", label: "Ether (ETH)", icon: ArrowUpRight },
    { value: "erc20", label: "ERC20 Token", icon: Coins },
    { value: "custom", label: "Custom Transaction", icon: Code },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border top-[20%] translate-y-0 data-[state=open]:slide-in-from-top-[20%]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            Create New Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Transaction Type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTxType(option.value as TransactionType)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-colors ${
                    txType === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  <option.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination">Recipient</Label>
            <Input
              id="destination"
              placeholder="0x..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-background font-mono text-sm"
            />
          </div>

          {/* Token Address (ERC20 only) */}
          {txType === "erc20" && (
            <div className="space-y-2">
              <Label htmlFor="tokenAddress">Token Contract</Label>
              <Input
                id="tokenAddress"
                placeholder="0x..."
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
                className="bg-background font-mono text-sm"
              />
            </div>
          )}

          {/* Amount (ETH and ERC20) */}
          {(txType === "eth" || txType === "erc20") && (
            <div className="space-y-2">
              <Label htmlFor="amount">{txType === "eth" ? "Amount (ETH)" : "Amount"}</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background"
                />
                {txType === "erc20" && (
                  <div className="flex items-center gap-2">
                    <Label htmlFor="decimals" className="text-xs whitespace-nowrap">Decimals:</Label>
                    <Input
                      id="decimals"
                      type="number"
                      min="0"
                      max="18"
                      value={tokenDecimals}
                      onChange={(e) => setTokenDecimals(e.target.value)}
                      className="bg-background w-16"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Transaction Fields */}
          {txType === "custom" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="value">Value</Label>
                <Input
                  id="value"
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="calldata">Data (Hexadecimal)</Label>
                <Input
                  id="calldata"
                  placeholder="0x..."
                  value={calldata}
                  onChange={(e) => setCalldata(e.target.value)}
                  className="bg-background font-mono text-sm"
                />
              </div>
            </>
          )}

          {/* Info */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Requires Confirmation</p>
              <p className="text-sm text-muted-foreground">
                This transaction will require approval from other wallet owners before execution.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="gold"
            className="flex-1"
            onClick={handleSubmit}
            disabled={!destination || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Create Transaction"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionModal;
