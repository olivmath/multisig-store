import { parseEther } from "viem";

export const DEMO_USER = {
  address: "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00" as `0x${string}`,
  balance: parseEther("10"),
};

export const DEMO_OWNERS = [
  "0x742d35Cc6634C0532925a3b844Bc9e7595f8fE00", // Demo user
  "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
  "0xabc123def456789012345678901234567890abcd",
] as `0x${string}`[];

// Start with empty wallets - wallet is added during tutorial
export const DEMO_WALLETS: Array<{
  address: `0x${string}`;
  owners: `0x${string}`[];
  required: number;
  balance: bigint;
  txCount: number;
}> = [];

// Single transaction shown on wallet page
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
];

export const DEMO_NEW_WALLET = {
  address: "0xNewMultiSig22222222222222222222222222222" as `0x${string}`,
  owners: DEMO_OWNERS,
  required: 2,
  balance: parseEther("5.5"),
  txCount: 1,
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
