import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Store,
  Wallet,
  Users,
  Send,
  CheckCircle2,
  Shield,
  ArrowRight,
  ArrowLeft,
  X,
  HelpCircle,
} from "lucide-react";

interface TutorialStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight?: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    icon: <Store className="w-12 h-12 text-primary" />,
    title: "Welcome to MultiSig Store",
    description:
      "MultiSig Store provides secure multisignature wallets for teams and organizations. Protect your digital assets with collective security.",
    highlight: "Enterprise-grade security for shared assets",
  },
  {
    icon: <Wallet className="w-12 h-12 text-primary" />,
    title: "Purchase Your Wallet",
    description:
      "Click 'Purchase New Wallet' to deploy your own multisig smart contract on-chain. Configure the owners and required signatures.",
    highlight: "Each wallet is a unique smart contract",
  },
  {
    icon: <Users className="w-12 h-12 text-primary" />,
    title: "Add Owners",
    description:
      "Add multiple wallet owners by entering their Ethereum addresses. Each owner can propose and confirm transactions.",
    highlight: "You are automatically added as the first owner",
  },
  {
    icon: <Shield className="w-12 h-12 text-primary" />,
    title: "Set Required Signatures",
    description:
      "Define how many confirmations are needed to execute a transaction. For example, 2 of 3 owners must approve.",
    highlight: "More signatures = more security",
  },
  {
    icon: <Send className="w-12 h-12 text-primary" />,
    title: "Create Transactions",
    description:
      "Send ETH, ERC20 tokens, or execute custom smart contract calls. All transactions require multi-party approval.",
    highlight: "Supports ETH, tokens, and custom calls",
  },
  {
    icon: <CheckCircle2 className="w-12 h-12 text-primary" />,
    title: "Confirm & Execute",
    description:
      "Review pending transactions and confirm them. Once the required number of confirmations is reached, the transaction executes automatically.",
    highlight: "Automatic execution on threshold",
  },
];

const TUTORIAL_STORAGE_KEY = "multisig-store-tutorial-seen";

interface TutorialProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export function Tutorial({ forceOpen, onClose }: TutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setIsOpen(forceOpen);
      setCurrentStep(0);
      return;
    }

    const hasSeenTutorial = localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    setIsOpen(false);
    setCurrentStep(0);
    onClose?.();
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  const step = tutorialSteps[currentStep];
  const isLastStep = currentStep === tutorialSteps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-lg bg-card border-border p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-muted transition-colors z-10"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / tutorialSteps.length) * 100}%`,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
              {step.icon}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4">{step.title}</h2>

          {/* Description */}
          <p className="text-muted-foreground mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* Highlight */}
          {step.highlight && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
              {step.highlight}
            </div>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {tutorialSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentStep
                  ? "bg-primary w-6"
                  : index < currentStep
                  ? "bg-primary/50"
                  : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
          <div>
            {!isFirstStep && (
              <Button variant="ghost" onClick={handlePrevious}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {currentStep + 1} of {tutorialSteps.length}
            </span>
          </div>

          <div>
            <Button variant="gold" onClick={handleNext}>
              {isLastStep ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Button to reopen tutorial
export function TutorialButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
    >
      <HelpCircle className="w-4 h-4" />
      <span>View Tutorial</span>
    </button>
  );
}
