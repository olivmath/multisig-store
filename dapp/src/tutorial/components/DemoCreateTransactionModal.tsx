import { X, Loader2 } from "lucide-react";
import { useDemoMode } from "../DemoModeContext";

export function DemoCreateTransactionModal() {
  const demoMode = useDemoMode();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => demoMode.closeModal()}
      />

      {/* Modal */}
      <div
        data-demo="tx-modal"
        className="relative w-full max-w-lg mx-4 bg-card rounded-2xl border border-border shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold">New Transaction</h2>
          <button
            onClick={() => demoMode.closeModal()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Transaction Type Tabs */}
          <div data-demo="tx-type-tabs" className="flex gap-2">
            <button className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium">
              Ether (ETH)
            </button>
            <button className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium">
              ERC20 Token
            </button>
            <button className="flex-1 px-4 py-3 rounded-xl border border-border hover:bg-muted transition-colors font-medium">
              Custom
            </button>
          </div>

          {/* Form */}
          <div data-demo="tx-form" className="space-y-4">
            {/* Recipient */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                placeholder="0x..."
                defaultValue="0xRecipientNew11111111111111111111111111"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount (ETH)
              </label>
              <input
                type="text"
                placeholder="0.0"
                defaultValue="0.1"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg font-semibold"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Available: 5.5 ETH
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              <strong>Note:</strong> This transaction will require {demoMode.currentWallet?.required || 2} owner
              confirmations before it can be executed.
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
            data-demo="submit-tx-btn"
            onClick={() => demoMode.createTransaction()}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin hidden" />
            Submit Transaction
          </button>
        </div>
      </div>
    </div>
  );
}
