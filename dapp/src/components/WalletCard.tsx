import { Users, Clock, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CopyableAddress } from "./CopyableAddress";
import Identicon from "./Identicon";

interface WalletCardProps {
  address: string;
  owners: string[];
  required: number;
  txCount: number;
  pendingCount: number;
  balance?: string;
}

const WalletCard = ({ address, owners, required, txCount, pendingCount, balance }: WalletCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/wallet/${address}`)}
      className="w-full min-h-[200px] text-left rounded-2xl bg-card border border-border p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Identicon address={address} size={40} className="rounded-xl" />
          <div>
            <h3 className="font-semibold text-lg">MultiSig Wallet</h3>
            <CopyableAddress address={address} className="text-xs text-muted-foreground" showIdenticon={false} truncate="short" />
          </div>
        </div>
        {balance && (
          <div className="flex items-center gap-1.5 text-right">
            <Wallet className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold">{balance} ETH</span>
          </div>
        )}
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
