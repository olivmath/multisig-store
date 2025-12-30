import { X, Plus, Trash2, Loader2 } from "lucide-react";
import { useDemoMode } from "../DemoModeContext";
import Identicon from "../../components/Identicon";

export function DemoCreateWalletModal() {
  const demoMode = useDemoMode();

  // Demo owners
  const demoOwners = [
    demoMode.userAddress,
    "0x8ba1f109551bD432803012645Ac136ddd64DBA72" as `0x${string}`,
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => demoMode.closeModal()}
      />

      {/* Modal */}
      <div
        data-demo="wallet-modal"
        className="relative w-full max-w-lg mx-4 bg-card rounded-2xl border border-border shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Create Multisig Wallet</h2>
          <button
            onClick={() => demoMode.closeModal()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Owners Section */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Wallet Owners
            </label>
            <div className="space-y-3">
              {demoOwners.map((owner, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <Identicon address={owner} size={32} className="rounded-lg" />
                  <span className="flex-1 font-mono text-sm truncate">
                    {owner}
                  </span>
                  {index > 0 && (
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {index === 0 && (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted">
                      You
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add Owner Input */}
            <div data-demo="owner-input" className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Enter Ethereum address (0x...)"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
                defaultValue="0x..."
              />
              <button className="px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Add at least 2 owners for a multisig wallet
            </p>
          </div>

          {/* Required Signatures */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Required Signatures
            </label>
            <div data-demo="required-input" className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={demoOwners.length}
                defaultValue={2}
                className="flex-1 h-2 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
              />
              <div className="flex items-center gap-2 text-2xl font-bold min-w-[80px] justify-center">
                <span>2</span>
                <span className="text-muted-foreground">/</span>
                <span className="text-muted-foreground">{demoOwners.length}</span>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Number of approvals needed to execute transactions
            </p>
          </div>

          {/* Cost Info */}
          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              <strong>Deployment Cost:</strong> 0.01 ETH
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This fee covers the smart contract deployment on the blockchain
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end gap-3">
          <button
            onClick={() => demoMode.closeModal()}
            className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            data-demo="deploy-wallet-btn"
            onClick={() => demoMode.createWallet()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin hidden" />
            Deploy Wallet
          </button>
        </div>
      </div>
    </div>
  );
}
