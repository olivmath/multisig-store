import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useTutorial } from "../contexts/TutorialContext";

// Dashboard tour - explains how to get started
const dashboardSteps: Step[] = [
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Welcome to MultiSig Store!</h3>
        <p className="mb-3">
          A <strong>multisig wallet</strong> is a smart contract that requires multiple
          signatures to approve transactions. This provides extra security for your funds.
        </p>
        <p className="text-sm text-muted-foreground">
          Example: A 2-of-3 wallet needs 2 out of 3 owners to approve any transaction.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="purchase-wallet"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Step 1: Purchase Your Wallet</h3>
        <p className="mb-3">
          Click here to deploy your own multisig smart contract on the blockchain.
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-2">You'll need to configure:</p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Owners:</strong> Wallet addresses that can sign transactions</li>
            <li><strong>Required signatures:</strong> How many owners must approve</li>
          </ul>
        </div>
        <p className="mt-3 text-sm text-yellow-600 dark:text-yellow-400">
          Cost: 0.01 ETH (covers smart contract deployment)
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="wallet-cards"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Your Wallets</h3>
        <p className="mb-3">
          After purchasing, your wallets appear here. Each card shows:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong>Address:</strong> Click to copy the wallet address</li>
          <li><strong>Owners:</strong> Number of authorized signers</li>
          <li><strong>Required:</strong> Signatures needed to execute</li>
          <li><strong>Pending:</strong> Transactions awaiting approval</li>
        </ul>
        <p className="text-sm font-medium">
          Click on a wallet card to manage it and create transactions.
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-tour="notifications"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Notifications</h3>
        <p className="mb-3">
          Important events appear here in real-time:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>New transactions proposed by other owners</li>
          <li>Transactions confirmed or executed</li>
          <li>Wallet creation confirmations</li>
        </ul>
        <p className="mt-3 text-sm">
          A red badge shows the number of unread notifications.
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="tutorial-button"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Need Help?</h3>
        <p className="mb-3">
          You can restart this tutorial anytime by clicking here.
        </p>
        <p className="text-sm text-muted-foreground">
          Now go ahead and purchase your first wallet to continue learning!
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
];

// Empty state tour - when user has no wallets
const emptyStateSteps: Step[] = [
  dashboardSteps[0], // Welcome
  {
    target: '[data-tour="empty-state"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Getting Started</h3>
        <p className="mb-3">
          You don't have any wallets yet. Let's create your first one!
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-2">What is a Multisig Wallet?</p>
          <p className="text-muted-foreground">
            A shared wallet where multiple people must approve transactions.
            Perfect for teams, DAOs, or securing large amounts.
          </p>
        </div>
        <p className="mt-3 text-sm font-medium">
          Click the button below to purchase your first wallet!
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  dashboardSteps[3], // Notifications
  dashboardSteps[4], // Tutorial button
];

// Wallet page tour - explains transactions
export const walletPageSteps: Step[] = [
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Management</h3>
        <p className="mb-3">
          This is your multisig wallet dashboard. Here you can:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>View your wallet balance</li>
          <li>See all owners and required signatures</li>
          <li>Create and manage transactions</li>
          <li>Confirm pending transactions</li>
        </ul>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="wallet-balance"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Balance</h3>
        <p className="mb-3">
          Your wallet's ETH balance and any tracked tokens appear here.
        </p>
        <p className="text-sm text-muted-foreground">
          You can add custom ERC20 tokens to track by clicking "+ Add Token".
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-transaction"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Step 2: Create a Transaction</h3>
        <p className="mb-3">
          Click here to propose a new transaction. All owners will be notified.
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm mb-3">
          <p className="font-medium mb-2">Transaction Types:</p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong className="text-foreground">Ether (ETH):</strong> Send ETH to any address
            </li>
            <li>
              <strong className="text-foreground">ERC20 Token:</strong> Transfer tokens (USDC, DAI, etc.)
            </li>
            <li>
              <strong className="text-foreground">Custom:</strong> Call any smart contract function
            </li>
          </ul>
        </div>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          The transaction won't execute until enough owners confirm it!
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="transactions-list"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Pending Transactions</h3>
        <p className="mb-3">
          All proposed transactions appear here. Each shows:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong>Type:</strong> ETH, Token, or Custom call</li>
          <li><strong>Recipient:</strong> Where funds will be sent</li>
          <li><strong>Amount:</strong> How much will be transferred</li>
          <li><strong>Confirmations:</strong> Who has approved it</li>
        </ul>
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium mb-1">How confirmations work:</p>
          <p className="text-muted-foreground">
            Once the required number of owners confirm, the transaction
            executes automatically and funds are sent.
          </p>
        </div>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-tour="owners-list"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Owners</h3>
        <p className="mb-3">
          All addresses authorized to sign transactions for this wallet.
        </p>
        <p className="text-sm text-muted-foreground">
          Each owner can propose new transactions and confirm pending ones.
          The "required" number shows how many must approve before execution.
        </p>
      </div>
    ),
    placement: "left",
    disableBeacon: true,
  },
];

interface GuidedTourProps {
  hasWallets?: boolean;
  isWalletPage?: boolean;
}

export function GuidedTour({ hasWallets = false, isWalletPage = false }: GuidedTourProps) {
  const { showTutorial, closeTutorial } = useTutorial();

  const handleCallback = (data: CallBackProps) => {
    const { status, action, type } = data;

    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED ||
      (action === ACTIONS.CLOSE && type === EVENTS.STEP_AFTER)
    ) {
      closeTutorial();
    }
  };

  // Select appropriate steps based on context
  let steps: Step[];
  if (isWalletPage) {
    steps = walletPageSteps;
  } else if (hasWallets) {
    steps = dashboardSteps;
  } else {
    steps = emptyStateSteps;
  }

  return (
    <Joyride
      steps={steps}
      run={showTutorial}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      disableOverlayClose
      callback={handleCallback}
      locale={{
        back: "Back",
        close: "Close",
        last: "Got it!",
        next: "Next",
        skip: "Skip Tour",
      }}
      styles={{
        options: {
          arrowColor: "hsl(var(--card))",
          backgroundColor: "hsl(var(--card))",
          overlayColor: "rgba(0, 0, 0, 0.8)",
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
          padding: "0.625rem 1.25rem",
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
            filter: "drop-shadow(0 8px 32px rgba(0, 0, 0, 0.4))",
          },
        },
      }}
    />
  );
}
