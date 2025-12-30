import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DemoModeProvider, useDemoMode } from "./DemoModeContext";
import { TutorialMode } from "./TutorialMode";
import { DemoDashboard } from "./components/DemoDashboard";
import { DemoWalletPage } from "./components/DemoWalletPage";
import { DemoCreateWalletModal } from "./components/DemoCreateWalletModal";
import { DemoCreateTransactionModal } from "./components/DemoCreateTransactionModal";

function TutorialContent() {
  const navigate = useNavigate();
  const demoMode = useDemoMode();

  const handleComplete = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {demoMode.currentWallet ? (
        <DemoWalletPage />
      ) : (
        <DemoDashboard />
      )}

      {demoMode.isModalOpen && demoMode.modalType === "wallet" && (
        <DemoCreateWalletModal />
      )}
      {demoMode.isModalOpen && demoMode.modalType === "transaction" && (
        <DemoCreateTransactionModal />
      )}

      <TutorialMode onComplete={handleComplete} />
    </div>
  );
}

export default function TutorialPage() {
  return (
    <DemoModeProvider>
      <TutorialContent />
    </DemoModeProvider>
  );
}
