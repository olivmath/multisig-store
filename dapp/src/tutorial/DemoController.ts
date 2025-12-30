export type DemoAction =
  | { type: "navigate"; path: string }
  | { type: "click"; selector: string }
  | { type: "fill"; selector: string; value: string }
  | { type: "wait"; ms: number }
  | { type: "openModal"; modalType: "wallet" | "transaction" }
  | { type: "closeModal" }
  | { type: "createWallet" }
  | { type: "selectWallet"; address: string }
  | { type: "createTransaction" }
  | { type: "confirmTransaction" }
  | { type: "showNotification"; message: string };

export interface DemoStep {
  id: number;
  name: string;
  description: string;
  target: string;
  actions: DemoAction[];
  placement?: "center" | "top" | "bottom" | "left" | "right";
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 0,
    name: "welcome",
    description: "Welcome to MultiSig Store",
    target: "body",
    placement: "center",
    actions: [],
  },
  {
    id: 1,
    name: "dashboard-overview",
    description: "Your Wallets Dashboard",
    target: '[data-demo="wallet-cards"]',
    placement: "top",
    actions: [],
  },
  {
    id: 2,
    name: "purchase-button",
    description: "Purchase New Wallet",
    target: '[data-demo="purchase-wallet"]',
    placement: "bottom",
    actions: [],
  },
  {
    id: 3,
    name: "wallet-modal-open",
    description: "Create Wallet Modal",
    target: '[data-demo="wallet-modal"]',
    placement: "center",
    actions: [
      { type: "openModal", modalType: "wallet" },
    ],
  },
  {
    id: 4,
    name: "wallet-modal-owners",
    description: "Configure Owners",
    target: '[data-demo="owner-input"]',
    placement: "right",
    actions: [],
  },
  {
    id: 5,
    name: "wallet-modal-required",
    description: "Set Required Signatures",
    target: '[data-demo="required-input"]',
    placement: "right",
    actions: [],
  },
  {
    id: 6,
    name: "wallet-created",
    description: "Wallet Deployed",
    target: '[data-demo="wallet-cards"]',
    placement: "top",
    actions: [
      { type: "createWallet" },
      { type: "closeModal" },
    ],
  },
  {
    id: 7,
    name: "select-wallet",
    description: "Open Wallet Details",
    target: '[data-demo="wallet-card"]',
    placement: "right",
    actions: [
      { type: "selectWallet", address: "0xMultiSig111111111111111111111111111111111" },
    ],
  },
  {
    id: 8,
    name: "wallet-page-overview",
    description: "Wallet Management",
    target: "body",
    placement: "center",
    actions: [],
  },
  {
    id: 9,
    name: "wallet-balance",
    description: "Wallet Balance",
    target: '[data-demo="wallet-balance"]',
    placement: "left",
    actions: [],
  },
  {
    id: 10,
    name: "owners-list",
    description: "Wallet Owners",
    target: '[data-demo="owners-list"]',
    placement: "right",
    actions: [],
  },
  {
    id: 11,
    name: "create-transaction-button",
    description: "Create Transaction",
    target: '[data-demo="create-transaction"]',
    placement: "bottom",
    actions: [],
  },
  {
    id: 12,
    name: "transaction-modal",
    description: "Transaction Types",
    target: '[data-demo="tx-modal"]',
    placement: "center",
    actions: [
      { type: "openModal", modalType: "transaction" },
    ],
  },
  {
    id: 13,
    name: "transaction-types",
    description: "Select Transaction Type",
    target: '[data-demo="tx-type-tabs"]',
    placement: "top",
    actions: [],
  },
  {
    id: 14,
    name: "transaction-form",
    description: "Fill Transaction Details",
    target: '[data-demo="tx-form"]',
    placement: "right",
    actions: [],
  },
  {
    id: 15,
    name: "transaction-submitted",
    description: "Transaction Submitted",
    target: '[data-demo="transactions-list"]',
    placement: "top",
    actions: [
      { type: "createTransaction" },
      { type: "closeModal" },
    ],
  },
  {
    id: 16,
    name: "pending-transaction",
    description: "Pending Transaction",
    target: '[data-demo="transaction-card"]',
    placement: "right",
    actions: [],
  },
  {
    id: 17,
    name: "confirm-transaction",
    description: "Confirm Transaction",
    target: '[data-demo="confirm-tx-btn"]',
    placement: "top",
    actions: [],
  },
  {
    id: 18,
    name: "transaction-executed",
    description: "Transaction Executed",
    target: '[data-demo="transaction-card"]',
    placement: "right",
    actions: [
      { type: "confirmTransaction" },
    ],
  },
  {
    id: 19,
    name: "notifications",
    description: "Notifications",
    target: '[data-demo="notifications"]',
    placement: "bottom",
    actions: [],
  },
  {
    id: 20,
    name: "finish",
    description: "Tutorial Complete",
    target: "body",
    placement: "center",
    actions: [],
  },
];

export function getStepById(id: number): DemoStep | undefined {
  return DEMO_STEPS.find(step => step.id === id);
}

export function executeStepActions(
  step: DemoStep,
  handlers: {
    openModal: (type: "wallet" | "transaction") => void;
    closeModal: () => void;
    createWallet: () => void;
    selectWallet: (address: `0x${string}`) => void;
    createTransaction: () => void;
    confirmTransaction: () => void;
  }
): void {
  for (const action of step.actions) {
    switch (action.type) {
      case "openModal":
        handlers.openModal(action.modalType);
        break;
      case "closeModal":
        handlers.closeModal();
        break;
      case "createWallet":
        handlers.createWallet();
        break;
      case "selectWallet":
        handlers.selectWallet(action.address as `0x${string}`);
        break;
      case "createTransaction":
        handlers.createTransaction();
        break;
      case "confirmTransaction":
        handlers.confirmTransaction();
        break;
    }
  }
}
