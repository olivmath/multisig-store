import { useState, useEffect } from "react";
import { Plus, Trash2, AlertTriangle, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useNotifications } from "../contexts/NotificationContext";
import { CopyableAddress } from "./CopyableAddress";
import { isValidAddress } from "../utils/validation";

interface CreateWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAddress: string;
  onCreate: (wallet: { owners: string[]; required: number }) => void;
  isCreating?: boolean;
}

const CreateWalletModal = ({ isOpen, onClose, connectedAddress, onCreate, isCreating = false }: CreateWalletModalProps) => {
  const [owners, setOwners] = useState<string[]>([connectedAddress]);
  const [newOwner, setNewOwner] = useState("");
  const [required, setRequired] = useState(1);
  const { addNotification } = useNotifications();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setOwners([connectedAddress]);
      setNewOwner("");
      setRequired(1);
    }
  }, [isOpen, connectedAddress]);

  const addOwner = () => {
    const trimmedOwner = newOwner.trim();

    if (!trimmedOwner) {
      addNotification({
        type: 'error',
        title: 'Address Required',
        message: 'Please enter an owner address.',
      });
      return;
    }

    if (!isValidAddress(trimmedOwner)) {
      addNotification({
        type: 'error',
        title: 'Invalid Address',
        message: 'Please enter a valid Ethereum address.',
      });
      return;
    }

    if (owners.includes(trimmedOwner)) {
      addNotification({
        type: 'error',
        title: 'Duplicate Owner',
        message: 'This address is already added.',
      });
      return;
    }

    setOwners([...owners, trimmedOwner]);
    setNewOwner("");
    addNotification({
      type: 'success',
      title: 'Owner Added!',
      message: 'New owner successfully configured.',
    });
  };

  const removeOwner = (index: number) => {
    if (owners[index] === connectedAddress) {
      addNotification({
        type: 'error',
        title: 'Cannot Remove',
        message: 'You cannot remove yourself as an owner.',
      });
      return;
    }
    const newOwners = owners.filter((_, i) => i !== index);
    setOwners(newOwners);
    if (required > newOwners.length) {
      setRequired(newOwners.length);
    }
    addNotification({
      type: 'success',
      title: 'Owner Removed',
      message: 'Owner removed from wallet.',
    });
  };

  const handleCreate = async () => {
    if (owners.length === 0) {
      addNotification({
        type: 'error',
        title: 'No Owners',
        message: 'At least one owner is required.',
      });
      return;
    }

    if (required <= 0 || required > owners.length) {
      addNotification({
        type: 'error',
        title: 'Invalid Configuration',
        message: `Required signatures must be between 1 and ${owners.length}.`,
      });
      return;
    }

    onCreate({ owners, required });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            Configure New Multisig Wallet
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
                  <CopyableAddress address={owner} className="flex-1 truncate" identiconSize={32} />
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
                placeholder="Ethereum address (0x...)"
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
              <span className="text-muted-foreground">out of {owners.length} owners</span>
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
              <p className="text-sm font-medium">Smart Contract Cost</p>
              <p className="text-sm text-muted-foreground">
                This multisig contract will be deployed for <span className="text-primary font-semibold">0.01 ETH</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-border">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isCreating}>
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
                Deploying...
              </>
            ) : (
              "Deploy Multisig Contract"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWalletModal;
