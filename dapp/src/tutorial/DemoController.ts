export type DemoAction =
  | { type: "openModal"; modalType: "wallet" | "transaction" }
  | { type: "closeModal" }
  | { type: "createWallet" }
  | { type: "selectWallet"; address: string }
  | { type: "createTransaction" }
  | { type: "confirmTransaction" };

export interface DemoStep {
  id: number;
  name: string;
  actions: DemoAction[];
}

// Actions are executed BEFORE the step is shown
// So step 2 needs to open the modal so that step 2 can show the owner input
export const DEMO_STEPS: DemoStep[] = [
  {
    id: 0,
    name: "welcome",
    actions: [],
  },
  {
    id: 1,
    name: "purchase-button",
    actions: [],
  },
  {
    id: 2,
    name: "owner-input",
    actions: [
      { type: "openModal", modalType: "wallet" },
    ],
  },
  {
    id: 3,
    name: "required-input",
    actions: [],
  },
  {
    id: 4,
    name: "deploy-button",
    actions: [],
  },
  {
    id: 5,
    name: "wallet-deployed",
    actions: [
      { type: "createWallet" },
      { type: "closeModal" },
    ],
  },
  {
    id: 6,
    name: "wallet-page",
    actions: [
      { type: "selectWallet", address: "0xNewMultiSig22222222222222222222222222222" },
    ],
  },
  {
    id: 7,
    name: "create-transaction-button",
    actions: [],
  },
  {
    id: 8,
    name: "transaction-types",
    actions: [
      { type: "openModal", modalType: "transaction" },
    ],
  },
  {
    id: 9,
    name: "transaction-form",
    actions: [],
  },
  {
    id: 10,
    name: "transaction-submitted",
    actions: [
      { type: "createTransaction" },
      { type: "closeModal" },
    ],
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
