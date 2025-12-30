import { useEffect, useCallback } from "react";
import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useDemoMode } from "./DemoModeContext";
import { executeStepActions, getStepById } from "./DemoController";

const joyrideSteps: Step[] = [
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Welcome to MultiSig Store!</h3>
        <p className="mb-3">
          This interactive tutorial will guide you through the entire application.
          You'll learn how to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Purchase and deploy a multisig wallet</li>
          <li>Create and submit transactions</li>
          <li>Confirm pending transactions</li>
          <li>Track notifications</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Just click "Next" and watch the magic happen!
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-demo="wallet-cards"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Your Wallets Dashboard</h3>
        <p className="mb-3">
          This is where all your multisig wallets are displayed. Each card shows:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong>Wallet address:</strong> Click to copy</li>
          <li><strong>Owners count:</strong> Number of authorized signers</li>
          <li><strong>Required signatures:</strong> Approvals needed</li>
          <li><strong>Balance:</strong> ETH held in the wallet</li>
          <li><strong>Pending transactions:</strong> Awaiting confirmation</li>
        </ul>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-demo="purchase-wallet"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Purchase New Wallet</h3>
        <p className="mb-3">
          Click this button to deploy a new multisig smart contract on the blockchain.
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm mb-3">
          <p className="font-medium mb-2">What is a Multisig Wallet?</p>
          <p className="text-muted-foreground">
            A shared wallet where multiple parties must approve transactions.
            For example, a 2-of-3 wallet requires 2 out of 3 owners to approve.
          </p>
        </div>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Cost: 0.01 ETH (deployment fee)
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-demo="wallet-modal"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Create Wallet Modal</h3>
        <p className="mb-3">
          This is where you configure your new multisig wallet before deployment.
        </p>
        <p className="text-sm text-muted-foreground">
          Let's walk through the configuration options...
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-demo="owner-input"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Add Wallet Owners</h3>
        <p className="mb-3">
          Enter the Ethereum addresses of all wallet owners. Each owner will be able to:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>Propose new transactions</li>
          <li>Confirm pending transactions</li>
          <li>Revoke their confirmations</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Tip: Your connected address is automatically added as the first owner.
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-demo="required-input"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Required Signatures</h3>
        <p className="mb-3">
          Set how many owner signatures are required to execute a transaction.
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm mb-3">
          <p className="font-medium mb-2">Common configurations:</p>
          <ul className="space-y-1 text-muted-foreground">
            <li><strong>2-of-3:</strong> Good balance of security and flexibility</li>
            <li><strong>3-of-5:</strong> Higher security for larger treasuries</li>
            <li><strong>2-of-2:</strong> Both parties must agree (partnerships)</li>
          </ul>
        </div>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Cannot be changed after deployment!
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-demo="wallet-cards"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Deployed!</h3>
        <p className="mb-3">
          Your new multisig wallet has been deployed to the blockchain!
        </p>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm mb-3">
          <p className="text-green-600 dark:text-green-400 font-medium">
            The new wallet card now appears in your dashboard.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Click on a wallet card to open it and manage transactions.
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-demo="wallet-card"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Open Wallet Details</h3>
        <p className="mb-3">
          Click on any wallet card to access its full management page.
        </p>
        <p className="text-sm text-muted-foreground">
          Let's explore what you can do inside a wallet...
        </p>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Management Page</h3>
        <p className="mb-3">
          This is where you manage a specific multisig wallet. From here you can:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>View wallet balance and token holdings</li>
          <li>See all wallet owners and required signatures</li>
          <li>Create new transactions</li>
          <li>Confirm or revoke pending transactions</li>
          <li>Track transaction history</li>
        </ul>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-demo="wallet-balance"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Balance</h3>
        <p className="mb-3">
          The balance card shows all assets held in this multisig:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong>ETH balance:</strong> Native Ethereum</li>
          <li><strong>Token balances:</strong> ERC20 tokens you've added</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Click "+ Add Token" to track custom ERC20 tokens.
        </p>
      </div>
    ),
    placement: "left",
    disableBeacon: true,
  },
  {
    target: '[data-demo="owners-list"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Wallet Owners</h3>
        <p className="mb-3">
          All addresses authorized to sign transactions for this wallet.
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">
            The "Required Signatures" shows how many of these owners
            must approve before a transaction can execute.
          </p>
        </div>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-demo="create-transaction"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Create New Transaction</h3>
        <p className="mb-3">
          Click here to propose a new transaction. All owners will be notified.
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Remember: The transaction won't execute until enough owners confirm!
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-demo="tx-modal"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Transaction Modal</h3>
        <p className="mb-3">
          This is where you create new transactions. There are three types available.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-demo="tx-type-tabs"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Transaction Types</h3>
        <div className="space-y-3 text-sm">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Ether (ETH)</p>
            <p className="text-muted-foreground">
              Send ETH to any Ethereum address. Simple transfers.
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
            <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">ERC20 Token</p>
            <p className="text-muted-foreground">
              Transfer tokens like USDC, DAI, LINK. Requires token contract address.
            </p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
            <p className="font-medium text-orange-600 dark:text-orange-400 mb-1">Custom</p>
            <p className="text-muted-foreground">
              Call any smart contract function. For advanced users.
            </p>
          </div>
        </div>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-demo="tx-form"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Transaction Details</h3>
        <p className="mb-3">
          Fill in the transaction details:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li><strong>Recipient:</strong> The address receiving funds</li>
          <li><strong>Amount:</strong> How much to send</li>
          <li><strong>Token:</strong> (For ERC20) The token contract address</li>
        </ul>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-demo="transactions-list"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Transaction Submitted!</h3>
        <p className="mb-3">
          Your transaction has been submitted and is now pending confirmation.
        </p>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm">
          <p className="text-yellow-600 dark:text-yellow-400">
            As the creator, your confirmation is automatically counted.
            Now other owners need to confirm.
          </p>
        </div>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-demo="transaction-card"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Pending Transaction</h3>
        <p className="mb-3">
          Each transaction card shows:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li><strong>Type:</strong> ETH, Token, or Custom</li>
          <li><strong>Recipient:</strong> Where funds will be sent</li>
          <li><strong>Amount:</strong> Value being transferred</li>
          <li><strong>Confirmations:</strong> Current / Required approvals</li>
          <li><strong>Status:</strong> Pending, Executed, or Failed</li>
        </ul>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-demo="confirm-tx-btn"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Confirm Transaction</h3>
        <p className="mb-3">
          As a wallet owner, you can confirm pending transactions by clicking this button.
        </p>
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="text-muted-foreground">
            Once the required number of confirmations is reached,
            the transaction automatically executes!
          </p>
        </div>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-demo="transaction-card"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Transaction Executed!</h3>
        <p className="mb-3">
          The transaction has received enough confirmations and was executed successfully!
        </p>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm">
          <p className="text-green-600 dark:text-green-400 font-medium">
            Funds have been transferred to the recipient.
          </p>
        </div>
      </div>
    ),
    placement: "right",
    disableBeacon: true,
  },
  {
    target: '[data-demo="notifications"]',
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Notifications</h3>
        <p className="mb-3">
          The notification bell shows important events in real-time:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3">
          <li>New transactions proposed by other owners</li>
          <li>Transactions confirmed or executed</li>
          <li>Wallet creation confirmations</li>
        </ul>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          A red badge shows the number of unread notifications.
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: "body",
    content: (
      <div className="text-left">
        <h3 className="text-lg font-bold mb-3">Tutorial Complete!</h3>
        <p className="mb-3">
          You've learned everything you need to use MultiSig Store:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
          <li>How to purchase and deploy multisig wallets</li>
          <li>How to create and submit transactions</li>
          <li>The difference between ETH, Token, and Custom transactions</li>
          <li>How the confirmation process works</li>
          <li>Where to find notifications</li>
        </ul>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
          <p className="font-medium text-primary">
            Ready to get started for real? Connect your wallet and purchase your first multisig!
          </p>
        </div>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
];

interface TutorialModeProps {
  onComplete?: () => void;
}

export function TutorialMode({ onComplete }: TutorialModeProps) {
  const demoMode = useDemoMode();

  const handleCallback = useCallback((data: CallBackProps) => {
    const { status, action, type, index } = data;

    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
      const step = getStepById(index + 1);
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
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onComplete?.();
    }

    if (action === ACTIONS.CLOSE && type === EVENTS.STEP_AFTER) {
      onComplete?.();
    }
  }, [demoMode, onComplete]);

  useEffect(() => {
    const step = getStepById(0);
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

  return (
    <Joyride
      steps={joyrideSteps}
      run={true}
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
          maxWidth: "480px",
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
