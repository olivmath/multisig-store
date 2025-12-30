import { useState } from "react";
import { ArrowUpRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (tx: { type: string; destination: string; value: string; token?: string; data?: string }) => void;
}

const TransactionModal = ({ isOpen, onClose, onCreate }: TransactionModalProps) => {
  const { toast } = useToast();
  const [type, setType] = useState("ether");
  const [destination, setDestination] = useState("");
  const [value, setValue] = useState("");
  const [token, setToken] = useState("");
  const [data, setData] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    // Validate destination address
    const trimmedDestination = destination.trim();
    if (!trimmedDestination || !trimmedDestination.startsWith("0x") || trimmedDestination.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters).",
        variant: "destructive",
      });
      return;
    }

    // Validate value
    if (!value || parseFloat(value) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    // Validate token address for ERC20
    if (type === "erc20") {
      const trimmedToken = token.trim();
      if (!trimmedToken || !trimmedToken.startsWith("0x") || trimmedToken.length !== 42) {
        toast({
          title: "Invalid Token Address",
          description: "Please enter a valid token contract address.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate data for custom transactions
    if (type === "custom" && data && !data.trim().startsWith("0x")) {
      toast({
        title: "Invalid Data",
        description: "Transaction data must start with 0x.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onCreate({ type, destination: trimmedDestination, value, token: type === "erc20" ? token.trim() : undefined, data: type === "custom" ? data.trim() : undefined });
    setIsCreating(false);
    onClose();
    // Reset form
    setType("ether");
    setDestination("");
    setValue("");
    setToken("");
    setData("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <ArrowUpRight className="w-5 h-5 text-primary" />
            </div>
            New Transaction
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Transaction Type - FIXED POSITION */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ether">Ether (ETH)</SelectItem>
                <SelectItem value="erc20">ERC20 Token</SelectItem>
                <SelectItem value="custom">Custom (Data)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Token Address (ERC20 only) - Grows downward */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              type === "erc20" ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2">
              <Label htmlFor="token">Token Address</Label>
              <Input
                id="token"
                placeholder="0x..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="bg-background font-mono text-sm"
              />
            </div>
          </div>

          {/* Destination - Moves down when token field appears */}
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

          {/* Value - Moves down when token field appears */}
          <div className="space-y-2">
            <Label htmlFor="value">{type === "erc20" ? "Amount" : "Value (ETH)"}</Label>
            <Input
              id="value"
              type="number"
              step="0.0001"
              placeholder="0.0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-background"
            />
          </div>

          {/* Data (Custom only) - Grows downward */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              type === "custom" ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2">
              <Label htmlFor="data">Data (Hex)</Label>
              <Textarea
                id="data"
                placeholder="0x..."
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="bg-background font-mono text-sm min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="gold"
            className="flex-1"
            onClick={handleCreate}
            disabled={!destination || !value || isCreating}
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
