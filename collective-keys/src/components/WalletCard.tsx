import { Wallet, Users } from "lucide-react";
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
  className?: string;
}

const WalletCard = ({ id, address, name, owners, required, balance, className }: WalletCardProps) => {
  const progress = (required / owners.length) * 100;

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

      {/* Required signatures */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Required</span>
          <span className="text-sm font-semibold text-primary">{required}/{owners.length}</span>
        </div>
        <div className="progress-gold">
          <div 
            className="progress-gold-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Balance */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">Balance</span>
        <span className="text-lg font-display font-semibold">
          {balance} <span className="text-primary text-sm">ETH</span>
        </span>
      </div>

      {/* Hover indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default WalletCard;
