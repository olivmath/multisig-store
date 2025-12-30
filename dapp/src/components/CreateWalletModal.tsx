import { useState } from "react";
import { X, Plus, Trash2, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Identicon from "./Identicon";

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAddress: string;
  onCreate: (wallet: { owners: string[]; required: number }) => void;
}

const CreateWalletModal = ({ isOpen, onClose, connectedAddress, onCreate }: CreateWalletModalProps) => {
  const { toast } = useToast();
  const [owners, setOwners] = useState<string[]>([connectedAddress]);
  const [newOwner, setNewOwner] = useState("");
  const [required, setRequired] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const addOwner = () => {
    const trimmedOwner = newOwner.trim();

    if (!trimmedOwner) {
      toast({
        title: "Empty Address",
        description: "Please enter an owner address.",
        variant: "destructive",
      });
      return;
    }

    if (!trimmedOwner.startsWith("0x") || trimmedOwner.length !== 42 || !/^0x[a-fA-F0-9]{40}$/.test(trimmedOwner)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters).",
        variant: "destructive",
      });
      return;
    }

    if (owners.includes(trimmedOwner)) {
      toast({
        title: "Duplicate Owner",
        description: "This address is already added as an owner.",
        variant: "destructive",
      });
      return;
    }

    setOwners([...owners, trimmedOwner]);
    setNewOwner("");
    toast({
      title: "Owner Added!",
      description: "New owner has been added successfully.",
      variant: "default",
    });
  };

  const removeOwner = (index: number) => {
    if (owners[index] === connectedAddress) {
      toast({
        title: "Cannot Remove",
        description: "You cannot remove yourself as an owner.",
        variant: "destructive",
      });
      return;
    }
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
    if (required > newOwners.length) {
      setRequired(newOwners.length);
    }
    toast({
      title: "Owner Removed",
      description: "Owner has been removed from the wallet.",
      variant: "default",
    });
  };

  const handleCreate = async () => {
    if (owners.length === 0) {
      toast({
        title: "No Owners",
        description: "At least one owner is required.",
        variant: "destructive",
      });
      return;
    }

    if (required <= 0 || required > owners.length) {
      toast({
        title: "Invalid Required Signatures",
        description: `Required signatures must be between 1 and ${owners.length}.`,
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onCreate({ owners, required });
    setIsCreating(false);
    onClose();
    // Reset form
    setOwners([connectedAddress]);
    setRequired(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            Get your New Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">

          {/* Owners */}
          <div className="space-y-3">
            <Label>Owners</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {owners.map((owner, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
                >
                  <Identicon address={owner} size={32} />
                  <span className="flex-1 font-mono text-sm truncate">
                    {owner.slice(0, 10)}...{owner.slice(-8)}
                  </span>
                  {owner === connectedAddress ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">You</span>
                  ) : (
                    <button
                      onClick={() => removeOwner(index)}
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add Owner */}
            <div className="flex gap-2">
              <Input
                placeholder="0x..."
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                className="bg-background font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addOwner();
                  }
                }}
              />
              <Button variant="gold-outline" size="icon" onClick={addOwner}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Required Signatures */}
          <div className="space-y-2">
            <Label htmlFor="required">Required Signatures</Label>
            <div className="flex items-center gap-4">
              <Input
                id="required"
                type="number"
                min={1}
                max={owners.length}
                value={required}
                onChange={(e) => setRequired(Math.min(Math.max(1, parseInt(e.target.value) || 1), owners.length))}
                className="bg-background w-24"
              />
              <span className="text-muted-foreground">of {owners.length} owners</span>
            </div>
            {required > 0 && required < owners.length && (
              <div className="progress-gold mt-2">
                <div 
                  className="progress-gold-fill"
                  style={{ width: `${(required / owners.length) * 100}%` }}
                />
              </div>
            )}
          </div>

          {/* Fee Warning */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Wallet Price</p>
              <p className="text-sm text-muted-foreground">
                The price for this digital multisig wallet is <span className="text-primary font-semibold">0.01 ETH</span>.
              </p>
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
            disabled={owners.length === 0 || required <= 0 || required > owners.length || isCreating}
          >
            {isCreating ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              "Confirm Creation"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWalletModal;
