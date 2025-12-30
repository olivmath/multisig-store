import { Wallet, Users, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Identicon from "./Identicon";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  id: string;
  address: string;
  name: string;
  owners: string[];
  required: number;
  balance: string;
  totalTransactions?: number;
  pendingTransactions?: number;
  className?: string;
}

const WalletCard = ({ id, address, name, owners, required, balance, totalTransactions = 0, pendingTransactions = 0, className }: WalletCardProps) => {

  return (
    <Link 
      to={`/wallet/${id}`}
      className={cn(
        "group block relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-hover",
        className
      )}
    >
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-gold-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-lg">{name}</h3>
            <p className="text-xs text-muted-foreground font-mono">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
          </div>
        </div>
      </div>

      {/* Owners */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Owners</span>
        </div>
        <div className="flex -space-x-2">
          {owners.slice(0, 4).map((owner, i) => (
            <Identicon key={i} address={owner} size={28} />
          ))}
          {owners.length > 4 && (
            <div className="w-8 h-8 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-xs font-medium">
              +{owners.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Total Transactions</span>
          </div>
          <p className="text-xl font-display font-bold text-foreground">{totalTransactions}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <p className="text-xl font-display font-bold text-primary">{pendingTransactions}</p>
        </div>
      </div>

      {/* Required signatures */}
      <div className="mb-4 py-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Required Signatures</span>
          <span className="text-sm font-semibold text-primary">{required}/{owners.length}</span>
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Balance</span>
        <span className="text-lg font-display font-semibold">
          {balance} <span className="text-primary text-sm">ETH</span>
        </span>
      </div>
    </Link>
  );
};

export default WalletCard;
