import { useState } from "react";
import { ArrowUpRight, Check, Clock, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Identicon from "./Identicon";

export interface Transaction {
  id: string;
  type: "ether" | "erc20" | "custom";
  destination: string;
  value: string;
  token?: string;
  data?: string;
  confirmations: number;
  required: number;
  status: "pending" | "confirmed" | "executed";
  txHash?: string;
  createdAt: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
  onConfirm: (txId: string) => void;
}

const TransactionList = ({ transactions, onConfirm }: TransactionListProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const filteredTxs = transactions.filter(tx => {
    if (filter === "all") return true;
    if (filter === "pending") return tx.status === "pending";
    if (filter === "confirmed") return tx.status === "confirmed" || tx.status === "executed";
    return true;
  });

  const handleConfirm = async (txId: string) => {
    setConfirmingId(txId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onConfirm(txId);
    setConfirmingId(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ether": return "ETH";
      case "erc20": return "ERC20";
      case "custom": return "Custom";
      default: return type;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transactions */}
      <div className="space-y-3">
        {filteredTxs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No transactions found</p>
          </div>
        ) : (
          filteredTxs.map((tx) => {
            const progress = (tx.confirmations / tx.required) * 100;
            const isConfirmed = tx.confirmations >= tx.required;

            return (
              <div
                key={tx.id}
                className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 hover:border-primary/20 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Icon & Type */}
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isConfirmed ? 'bg-primary/10' : 'bg-secondary'}`}>
                      <ArrowUpRight className={`w-5 h-5 ${isConfirmed ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary">
                          {getTypeLabel(tx.type)}
                        </span>
                        {tx.token && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {tx.token.slice(0, 6)}...
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tx.createdAt.toLocaleDateString('en-US')} at {tx.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Destination & Value */}
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Identicon address={tx.destination} size={24} />
                      <span className="font-mono text-sm">
                        {tx.destination.slice(0, 8)}...{tx.destination.slice(-6)}
                      </span>
                    </div>
                    <span className="text-lg font-display font-semibold">
                      {tx.value} <span className="text-primary text-sm">{tx.type === "erc20" ? "Tokens" : "ETH"}</span>
                    </span>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-4">
                    {/* Progress */}
                    <div className="min-w-[120px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-semibold ${isConfirmed ? 'text-primary' : 'text-muted-foreground'}`}>
                          {tx.confirmations}/{tx.required}
                        </span>
                        {isConfirmed && (
                          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Confirmed
                          </span>
                        )}
                      </div>
                      <div className="progress-gold">
                        <div
                          className="progress-gold-fill"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!isConfirmed && (
                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => handleConfirm(tx.id)}
                          disabled={confirmingId === tx.id}
                          className="min-w-[100px]"
                        >
                          {confirmingId === tx.id ? (
                            <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          ) : (
                            "Confirm"
                          )}
                        </Button>
                      )}
                      {tx.txHash && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`https://etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Custom Data */}
                {tx.type === "custom" && tx.data && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Data:</p>
                    <code className="text-xs font-mono bg-secondary px-2 py-1 rounded break-all">
                      {tx.data.slice(0, 66)}...
                    </code>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TransactionList;
