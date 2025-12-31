import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { DemoModeProvider, useDemoMode } from "./DemoModeContext";
import { TutorialMode } from "./TutorialMode";
import Dashboard from "../pages/Dashboard";
import WalletPage from "../pages/WalletPage";

function TutorialContent() {
  const navigate = useNavigate();
  const demoMode = useDemoMode();

  const handleComplete = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Demo mode banner */}
      <div className="bg-yellow-500/20 text-yellow-800 dark:text-yellow-200 py-2 px-4 text-center text-sm font-medium">
        <span className="bg-yellow-500 text-black px-2 py-0.5 rounded mr-2 text-xs font-bold">
          DEMO MODE
        </span>
        This is an interactive tutorial with mock data. No real transactions will occur.
      </div>

      {/* Render real components based on demo state */}
      {demoMode.currentWallet ? (
        <WalletPage />
      ) : (
        <Dashboard />
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
