import { Wallet, Users, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WalletCardProps {
  address: string;
  owners: string[];
  required: number;
  txCount: number;
  pendingCount: number;
}

const WalletCard = ({ address, owners, required, txCount, pendingCount }: WalletCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/wallet/${address}`)}
      className="group w-full text-left relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-hover"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">MultiSig Wallet</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Owners</span>
        </div>
        <div className="text-sm">
          <span className="font-medium">{owners.length}</span> owners
          <span className="text-muted-foreground"> · </span>
          <span className="font-medium">{required}</span> required
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Transactions</p>
          <p className="font-semibold">{txCount}</p>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <p className="font-semibold">{pendingCount}</p>
        </div>
      </div>
    </button>
  );
};

export default WalletCard;
