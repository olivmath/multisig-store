import { useEffect, useCallback, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useDemoMode } from "./DemoModeContext";
import { executeStepActions, getStepById } from "./DemoController";

const joyrideSteps: Step[] = [
  // Step 1 - Welcome
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Welcome!</h3>
        <p className="mb-3">Now you'll learn how to:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Purchase and deploy a multisig wallet</li>
          <li>Create and submit transactions</li>
          <li>Confirm pending transactions</li>
          <li>Track notifications</li>
        </ol>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  // Step 2 - Purchase New Wallet
  {
    target: '[data-demo="purchase-wallet"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Purchase New Wallet</h3>
        <p className="mb-3">Click this button to:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Purchase your own multisig digital wallet</li>
          <li>Deploy your multisig on the blockchain</li>
        </ol>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Cost: 0.01 ETH
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  // Step 3 - Setup Owners
  {
    target: '[data-demo="owner-input"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Setup your Owners</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Add owners</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Tip: Your connected address is automatically added as the first owner.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  // Step 4 - Setup Required Signatures
  {
    target: '[data-demo="required-input"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Setup Required Signatures</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Set how many owner signatures are required to execute a transaction.
        </p>
        <p className="text-sm font-medium mb-2">Common configurations:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>2-of-3</li>
          <li>3-of-5</li>
          <li>2-of-2</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Tip: Cannot be changed after deployment!
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  // Step 5 - Deploy it!
  {
    target: '[data-demo="deploy-wallet-btn"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Deploy it!</h3>
        <p className="mb-3">Click this button to:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Deploy your multisig wallet on the blockchain</li>
          <li>Confirm the deployment transaction on your connected wallet</li>
        </ol>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Cost: 0.01 ETH
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  // Step 6 - Wallet Deployed!
  {
    target: '[data-demo="wallet-card"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Deployed!</h3>
        <p className="text-sm text-muted-foreground">
          Click on a wallet card to open it and manage transactions.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  // Step 7 - MultiSig Digital Wallet
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">MultiSig Digital Wallet</h3>
        <p className="text-sm text-muted-foreground">
          Here you can see all the information.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  // Step 8 - Create New Transaction
  {
    target: '[data-demo="create-transaction"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Create New Transaction</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          Click here to propose a new transaction.
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Tip: All owners will be notified.
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  // Step 9 - Setup Transaction Types
  {
    target: '[data-demo="tx-type-tabs"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Setup Transaction Types</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-foreground">Ether (ETH):</strong> Send ETH to any Ethereum address.</li>
          <li><strong className="text-foreground">ERC20 Token:</strong> Send any ERC20/721/1155.</li>
          <li><strong className="text-foreground">Custom:</strong> Send any calldata bytes.</li>
        </ol>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  // Step 10 - Setup Transaction Details
  {
    target: '[data-demo="tx-form"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Setup Transaction Details</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong className="text-foreground">Recipient:</strong> The address receiving funds</li>
          <li><strong className="text-foreground">Amount:</strong> How much to send</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Tip:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600 dark:text-yellow-400">
          <li>For ERC20: enter the token contract address.</li>
          <li>For Custom: enter the calldata hex string.</li>
        </ul>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  // Step 11 - Transaction Submitted!
  {
    target: '[data-demo="transactions-list"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Transaction Submitted!</h3>
        <p className="mb-3 text-sm text-muted-foreground">
          All owners will be notified.
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">Tip:</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-600 dark:text-yellow-400">
          <li>As the creator, your confirmation is automatically counted.</li>
          <li>Transactions will be executed automatically when they reach the required number of confirmations.</li>
        </ul>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
];

interface TutorialModeProps {
  onComplete?: () => void;
}

export function TutorialMode({ onComplete }: TutorialModeProps) {
  const demoMode = useDemoMode();
  const [stepIndex, setStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  const executeActionsForStep = useCallback((stepId: number) => {
    const step = getStepById(stepId);
    if (step) {
      executeStepActions(step, {
        openModal: demoMode.openModal,
        closeModal: demoMode.closeModal,
        createWallet: demoMode.createWallet,
        selectWallet: demoMode.selectWallet,
        createTransaction: demoMode.createTransaction,
        confirmTransaction: demoMode.confirmTransaction,
      });
    }
  }, [demoMode]);

  const handleCallback = useCallback((data: CallBackProps) => {
    const { status, action, type, index } = data;

    if (type === EVENTS.STEP_AFTER) {
      if (action === ACTIONS.NEXT) {
        const nextIndex = index + 1;
        // Pause Joyride
        setIsRunning(false);
        // Execute actions for next step
        executeActionsForStep(nextIndex);
        // Wait for React to render, then advance
        setTimeout(() => {
          setStepIndex(nextIndex);
          setIsRunning(true);
        }, 100);
      } else if (action === ACTIONS.PREV) {
        const prevIndex = index - 1;
        setStepIndex(prevIndex);
      } else if (action === ACTIONS.CLOSE) {
        onComplete?.();
      }
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onComplete?.();
    }
  }, [executeActionsForStep, onComplete]);

  // Execute actions for step 0 on mount
  useEffect(() => {
    executeActionsForStep(0);
  }, [executeActionsForStep]);

  return (
    <Joyride
      steps={joyrideSteps}
      stepIndex={stepIndex}
      run={isRunning}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      disableOverlayClose
      callback={handleCallback}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip Tutorial",
      }}
      styles={{
        options: {
          arrowColor: "hsl(var(--card))",
          backgroundColor: "hsl(var(--card))",
          overlayColor: "rgba(0, 0, 0, 0.85)",
          primaryColor: "hsl(45, 100%, 50%)",
          textColor: "hsl(var(--foreground))",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "0.75rem",
          padding: "1.5rem",
          maxWidth: "420px",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipTitle: {
          margin: 0,
          padding: 0,
        },
        tooltipContent: {
          padding: "0.5rem 0",
        },
        buttonNext: {
          backgroundColor: "hsl(45, 100%, 50%)",
          color: "hsl(0, 0%, 0%)",
          borderRadius: "0.5rem",
          padding: "0.75rem 1.5rem",
          fontWeight: 600,
          fontSize: "0.875rem",
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: "0.75rem",
          fontSize: "0.875rem",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
          fontSize: "0.875rem",
        },
        buttonClose: {
          color: "hsl(var(--muted-foreground))",
        },
        spotlight: {
          borderRadius: "0.75rem",
        },
        beacon: {
          display: "none",
        },
      }}
      floaterProps={{
        styles: {
          floater: {
            filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.5))",
          },
        },
      }}
    />
  );
}
