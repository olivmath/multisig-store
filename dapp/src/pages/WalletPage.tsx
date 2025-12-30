import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, Shield, ArrowLeft, Plus } from "lucide-react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useNotifications } from "../contexts/NotificationContext";
import { Layout } from "../components/Layout";
import { CopyableAddress } from "../components/CopyableAddress";
import { BalanceCard } from "../components/BalanceCard";
import Identicon from "../components/Identicon";
import { TransactionCard } from "../components/TransactionCard";
import CreateTransactionModal from "../components/CreateTransactionModal";
import { useMultiSig } from "../hooks/useMultiSig";

const WalletPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addNotification } = useNotifications();

  const walletAddress = id as `0x${string}` | undefined;
  const { owners, required, txCount, submitETH, submitERC20, submitCustomTransaction, submitTxHash } = useMultiSig(walletAddress);

  const { isLoading: isSubmitting, isSuccess: isSubmitSuccess } = useWaitForTransactionReceipt({
    hash: submitTxHash,
  });

  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  }, [isConnected, navigate]);

  useEffect(() => {
    if (isSubmitSuccess) {
      addNotification({
        type: 'success',
        title: 'Transaction Submitted!',
        message: 'Your transaction has been submitted and is awaiting confirmations.',
        walletAddress: walletAddress,
      });
      setIsModalOpen(false);
    }
  }, [isSubmitSuccess, addNotification, walletAddress]);

  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Wallet Header */}
        <div className="mb-8 flex items-center gap-4">
          <Identicon address={walletAddress} size={56} className="rounded-xl flex-shrink-0" />
          <div>
            <h1 className="font-display text-3xl font-semibold">
              Multisig Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </h1>
            <CopyableAddress address={walletAddress} className="text-muted-foreground" showIdenticon={false} truncate="long" />
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Owners Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Owners</h3>
            </div>
            <div className="flex-1">
              {owners.map((owner, index) => (
                <div key={index} className="flex items-center gap-2 py-2 border-b border-border/50 last:border-0">
                  <CopyableAddress address={owner} className="text-sm" identiconSize={28} truncate="short" />
                </div>
              ))}
            </div>
          </div>

          {/* Required Signatures Card */}
          <div className="rounded-2xl border border-border bg-card p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold uppercase tracking-wide text-sm">Required Signatures</h3>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-4xl font-bold">
                {required} / {owners.length}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Approvals required
              </p>
            </div>
          </div>

          {/* Balance Card */}
          <BalanceCard walletAddress={walletAddress} />
        </div>

        {/* Transactions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Transactions</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
              New Transaction
            </button>
          </div>
          {txCount === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-lg font-medium mb-2">No Transactions</p>
              <p className="text-muted-foreground">This wallet hasn't executed any transactions yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Click "New Transaction" above to create your first transaction.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: txCount }, (_, i) => BigInt(i)).reverse().map((txId) => (
                <TransactionCard
                  key={txId.toString()}
                  multiSigAddress={walletAddress}
                  txId={txId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Transaction Modal */}
      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitETH={submitETH}
        onSubmitERC20={submitERC20}
        onSubmitCustom={submitCustomTransaction}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
};

export default WalletPage;
