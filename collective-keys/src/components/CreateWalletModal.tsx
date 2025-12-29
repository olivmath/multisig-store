import { useState } from "react";
import { X, Plus, Trash2, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Identicon from "./Identicon";

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAddress: string;
  onCreate: (wallet: { name: string; owners: string[]; required: number }) => void;
}

const CreateWalletModal = ({ isOpen, onClose, connectedAddress, onCreate }: CreateWalletModalProps) => {
  const [name, setName] = useState("");
  const [owners, setOwners] = useState<string[]>([connectedAddress]);
  const [newOwner, setNewOwner] = useState("");
  const [required, setRequired] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const addOwner = () => {
    if (newOwner && newOwner.startsWith("0x") && newOwner.length === 42 && !owners.includes(newOwner)) {
      setOwners([...owners, newOwner]);
      setNewOwner("");
    }
  };

  const removeOwner = (index: number) => {
    if (owners[index] === connectedAddress) return;
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
    if (required > newOwners.length) {
      setRequired(newOwners.length);
    }
  };

  const handleCreate = async () => {
    if (!name || owners.length === 0 || required <= 0 || required > owners.length) return;
    setIsCreating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onCreate({ name, owners, required });
    setIsCreating(false);
    onClose();
    // Reset form
    setName("");
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
            Create New Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Wallet Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              placeholder="e.g. Treasury Team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>

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
              <p className="text-sm font-medium">Creation Fee</p>
              <p className="text-sm text-muted-foreground">
                Creating this wallet requires a fee of <span className="text-primary font-semibold">0.01 ETH</span> for contract deployment.
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
            disabled={!name || owners.length === 0 || required <= 0 || required > owners.length || isCreating}
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
