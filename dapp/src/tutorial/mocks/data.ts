import { parseEther, parseUnits } from "viem";

export const DEMO_USER = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00" as `0x${string}`,
  balance: parseEther("10"),
};

export const DEMO_OWNERS = [
  "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00", // Demo user
  "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  "0xabc123def456789012345678901234567890abcd",
] as `0x${string}`[];

export const DEMO_WALLETS = [
  {
    address: "0xMultiSig111111111111111111111111111111111" as `0x${string}`,
    owners: DEMO_OWNERS,
    required: 2,
    balance: parseEther("5.5"),
    txCount: 3,
  },
];

export const DEMO_TRANSACTIONS = [
  {
    id: 0,
    txType: 0, // ETH
    to: "0xRecipient111111111111111111111111111111" as `0x${string}`,
    amount: parseEther("0.5"),
    data: "0x" as `0x${string}`,
    executed: false,
    confirmCount: 1,
    confirmedBy: [DEMO_OWNERS[1]],
  },
  {
    id: 1,
    txType: 1, // ERC20
    to: "0xRecipient222222222222222222222222222222" as `0x${string}`,
    amount: parseUnits("100", 6), // 100 USDC
    data: "0x" as `0x${string}`,
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as `0x${string}`, // USDC
    executed: true,
    confirmCount: 2,
    confirmedBy: [DEMO_OWNERS[0], DEMO_OWNERS[1]],
  },
  {
    id: 2,
    txType: 0, // ETH
    to: "0xRecipient333333333333333333333333333333" as `0x${string}`,
    amount: parseEther("1.0"),
    data: "0x" as `0x${string}`,
    executed: true,
    confirmCount: 2,
    confirmedBy: [DEMO_OWNERS[0], DEMO_OWNERS[2]],
  },
];

export const DEMO_NEW_WALLET = {
  address: "0xNewMultiSig22222222222222222222222222222" as `0x${string}`,
  owners: [
    DEMO_USER.address,
    "0x1111111111111111111111111111111111111111" as `0x${string}`,
  ],
  required: 2,
  balance: parseEther("0"),
  txCount: 0,
};

export const DEMO_NEW_TRANSACTION = {
  id: 0,
  txType: 0,
  to: "0xRecipientNew11111111111111111111111111" as `0x${string}`,
  amount: parseEther("0.1"),
  data: "0x" as `0x${string}`,
  executed: false,
  confirmCount: 1,
  confirmedBy: [DEMO_USER.address],
};
