import Joyride, { CallBackProps, STATUS, Step, ACTIONS, EVENTS } from "react-joyride";
import { useTutorial } from "../contexts/TutorialContext";

const tourSteps: Step[] = [
  {
    target: "body",
    content: (
      <div className="text-center">
        <h3 className="text-lg font-bold mb-2">Welcome to MultiSig Store!</h3>
        <p>
          Let me show you how to create and manage your multisignature wallets.
          This tour will guide you through the main features.
        </p>
      </div>
    ),
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="purchase-wallet"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Purchase New Wallet</h3>
        <p>
          Click here to deploy a new multisig smart contract. You'll configure
          the owners and required signatures.
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="wallet-cards"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Your Wallets</h3>
        <p>
          Your multisig wallets appear here. Each card shows the wallet address,
          owners, required signatures, and pending transactions.
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  {
    target: '[data-tour="theme-toggle"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Theme Toggle</h3>
        <p>Switch between dark and light modes for your comfort.</p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="notifications"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Notifications</h3>
        <p>
          Stay updated with transaction confirmations, new proposals, and wallet
          activity. A badge shows unread notifications.
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="network-selector"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Network & Balance</h3>
        <p>
          View your ETH balance and switch between networks (Sepolia testnet or
          local Anvil).
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="connect-wallet"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Wallet Connection</h3>
        <p>
          Your connected wallet address is shown here. Click to disconnect or
          view your account.
        </p>
      </div>
    ),
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="tutorial-button"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Need Help?</h3>
        <p>
          You can restart this tour anytime by clicking the Tutorial button in
          the footer.
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
];

// Steps for when no wallets exist
const emptyStateSteps: Step[] = [
  tourSteps[0], // Welcome
  {
    target: '[data-tour="empty-state"]',
    content: (
      <div>
        <h3 className="text-lg font-bold mb-2">Getting Started</h3>
        <p>
          You don't have any wallets yet. Click the button below to purchase
          your first multisig wallet!
        </p>
      </div>
    ),
    placement: "top",
    disableBeacon: true,
  },
  tourSteps[3], // Theme toggle
  tourSteps[4], // Notifications
  tourSteps[5], // Network selector
  tourSteps[6], // Connect wallet
  tourSteps[7], // Tutorial button
];

interface GuidedTourProps {
  hasWallets?: boolean;
}

export function GuidedTour({ hasWallets = false }: GuidedTourProps) {
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

  const steps = hasWallets ? tourSteps : emptyStateSteps;

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
        last: "Finish",
        next: "Next",
        skip: "Skip Tour",
      }}
      styles={{
        options: {
          arrowColor: "hsl(var(--card))",
          backgroundColor: "hsl(var(--card))",
          overlayColor: "rgba(0, 0, 0, 0.75)",
          primaryColor: "hsl(45, 100%, 50%)",
          textColor: "hsl(var(--foreground))",
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: "0.75rem",
          padding: "1.25rem",
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
          padding: "0.5rem 1rem",
          fontWeight: 500,
        },
        buttonBack: {
          color: "hsl(var(--muted-foreground))",
          marginRight: "0.5rem",
        },
        buttonSkip: {
          color: "hsl(var(--muted-foreground))",
        },
        buttonClose: {
          color: "hsl(var(--muted-foreground))",
        },
        spotlight: {
          borderRadius: "0.75rem",
        },
      }}
      floaterProps={{
        styles: {
          floater: {
            filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))",
          },
        },
      }}
    />
  );
}
