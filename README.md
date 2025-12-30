# MultiSigStore - Secure Multi-Signature Wallet Platform

A complete blockchain-based multi-signature wallet solution featuring a factory deployment system and a beautiful, responsive web interface built with modern technologies.

## Overview

MultiSigStore is a secure platform for creating and managing multi-signature wallets on Ethereum. It provides a factory contract for deploying unlimited MultiSig wallets and a modern frontend interface for easy interaction with your wallets.

### Key Features

- **Secure MultiSig Wallets**: Industry-standard multi-signature wallet implementation with configurable owner requirements
- **Three Transaction Types**: Support for ETH transfers, ERC20 token transfers, and custom contract calls
- **Factory Deployment**: Deploy unlimited MultiSig wallets with custom configurations through a single factory contract
- **Automatic Execution**: Transactions automatically execute when the required threshold is reached
- **Modern Frontend**: Beautiful, responsive UI built with React, TypeScript, Vite, and TailwindCSS
- **Real-time Updates**: Live transaction status updates and balance tracking
- **Network Support**: Works on Sepolia testnet and Anvil local network
- **Comprehensive Testing**: Full test coverage including unit tests, fuzz tests, invariant tests, and formal verification

## Deployed Contracts

### Sepolia Testnet
- **MultiSigFactory**: [`0x76ADE170939349b9Ec9730342962b32443601c29`](https://sepolia.etherscan.io/address/0x76ADE170939349b9Ec9730342962b32443601c29)
- **Creation Fee**: 0.01 ETH

## Project Structure

```
.
├── src/                      # Solidity smart contracts
│   ├── MultiSig.sol         # MultiSig wallet implementation
│   ├── MultiSigFactory.sol  # Factory for deploying wallets
│   └── MultiSigFacade.sol   # Abstract interface
├── test/                     # Comprehensive test suite
│   ├── MultiSig.t.sol       # Unit tests
│   ├── MultiSigFuzz.t.sol   # Fuzz tests
│   ├── MultiSigInvariant.t.sol # Invariant tests
│   ├── MultiSigHalmos.t.sol # Formal verification
│   └── MultiSigFactory.t.sol # Factory tests
├── script/                   # Deployment scripts
│   └── Deploy.s.sol         # Factory deployment
└── dapp/                     # Frontend application
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/          # Application pages
    │   ├── hooks/          # Custom React hooks
    │   └── lib/            # Utilities and configs
    ├── public/             # Static assets
    └── index.html          # Entry point
```

## How It Works

### Smart Contracts Architecture

#### MultiSigFactory Contract

The factory contract manages the creation and tracking of all MultiSig wallets:

- **Wallet Creation**: Deploy new MultiSig wallets with specified owners and confirmation requirements
- **Creation Fee**: Charges a configurable fee (default: 0.01 ETH) for creating wallets
- **Tracking**: Maintains lists of all deployed wallets, organized by creator and by owner
- **Event Emission**: Emits events for indexing and frontend updates

**Key Functions:**
```solidity
// Create a new MultiSig wallet
function createMultiSig(address[] owners, uint256 required) payable returns (address)

// Get all deployed wallets
function getDeployedMultiSigs() view returns (address[])

// Get wallets created by a specific address
function getCreatorMultiSigs(address creator) view returns (address[])

// Get wallets where an address is an owner
function getOwnerMultiSigs(address owner) view returns (address[])
```

#### MultiSig Contract

Each MultiSig wallet is an independent contract with the following features:

**Transaction Types:**

1. **ETH Transfers** (`submitETH`): Send native ETH to any address
2. **ERC20 Transfers** (`submitERC20`): Send ERC20 tokens to any address
3. **Custom Calls** (`submitCustom`): Execute arbitrary contract calls with custom data

**Transaction Lifecycle:**

1. **Submit**: Any owner creates a transaction (automatically receives first confirmation)
2. **Confirm**: Other owners confirm the transaction
3. **Auto-Execute**: When confirmations reach the required threshold, the transaction executes automatically
4. **Manual Execute**: Owners can also manually trigger execution if needed

**Storage Structure:**
```solidity
struct Transaction {
    TxType txType;      // ETH, ERC20, or CUSTOM
    address token;      // Token address (for ERC20)
    address to;         // Destination address
    uint256 amount;     // Amount to transfer
    bool executed;      // Execution status
    bytes data;         // Custom calldata (for CUSTOM type)
}
```

**Key Features:**
- Unique owner addresses (no duplicates)
- Configurable confirmation requirements (1 to N owners)
- Automatic confirmation by transaction submitter
- Protection against double execution
- Safe external call handling with error propagation
- Complete event logging for transparency

### Frontend Architecture

The frontend is built with modern web technologies and provides a seamless user experience:

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: TailwindCSS with custom design system
- **Blockchain**: Wagmi v2 for Ethereum interactions
- **Wallet Connection**: WalletConnect integration
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React

**Key Pages:**

1. **Home/Landing**: Displays global statistics (active wallets, unique owners, total transactions)
2. **Dashboard**: Shows all your MultiSig wallets with stats (balance, transactions, pending)
3. **Wallet Detail**: Complete wallet view with transactions, confirmations, and actions
4. **Create Wallet**: Modal for creating new MultiSig wallets

**Core Hooks:**

- `useMultiSigFactory`: Interact with the factory contract
- `useMultiSig`: Manage individual wallet operations
- `useWalletTransactionStats`: Track transaction statistics
- `usePendingWallets`: Monitor wallets with pending confirmations
- `useGlobalStats`: Fetch platform-wide statistics

**Design System:**

- Custom color scheme with yellow (#FFF873) accent color
- Responsive grid layouts
- Smooth animations and transitions
- Dark mode support (via system preferences)
- Accessible UI components

## Installation

### Prerequisites

- **[Foundry](https://book.getfoundry.sh/getting-started/installation)** - Ethereum development toolkit
- **[Node.js](https://nodejs.org/)** (v18+) - JavaScript runtime
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager

**Install Foundry:**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

**Install pnpm:**
```bash
npm install -g pnpm
```

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd multsig

# Install Solidity dependencies
forge install

# Install frontend dependencies
cd dapp
pnpm install
```

## Smart Contracts

### Testing

Run the comprehensive test suite:

```bash
# All tests
forge test

# Unit tests with verbosity
forge test -vvv

# Fuzz tests (extended runs)
forge test --fuzz-runs 10000

# Invariant tests
forge test --match-contract Invariant

# Formal verification with Halmos (requires installation)
halmos --contract MultiSigHalmosTest

# Coverage report
forge coverage
```

### Deployment

#### Local Deployment (Anvil)

```bash
# Terminal 1: Start Anvil
anvil

# Terminal 2: Deploy factory
forge script script/Deploy.s.sol:DeployFactory --rpc-url http://127.0.0.1:8545 --broadcast

# Note the deployed factory address from the output
```

#### Sepolia Deployment

```bash
# Set environment variables
export SEPOLIA_RPC_URL=<your_sepolia_rpc_url>
export PRIVATE_KEY=<your_private_key>
export ETHERSCAN_API_KEY=<your_etherscan_api_key>

# Deploy and verify
forge script script/Deploy.s.sol:DeployFactory \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify
```

### Interacting with Contracts (Cast)

```bash
# Get all deployed wallets
cast call <FACTORY_ADDRESS> "getDeployedMultiSigs()(address[])" --rpc-url <RPC_URL>

# Get wallet transaction count
cast call <MULTISIG_ADDRESS> "txCount()(uint256)" --rpc-url <RPC_URL>

# Get wallet owners
cast call <MULTISIG_ADDRESS> "getOwners()(address[])" --rpc-url <RPC_URL>

# Get transaction details
cast call <MULTISIG_ADDRESS> "transactions(uint256)" <TX_ID> --rpc-url <RPC_URL>
```

## Frontend Application

### Configuration

1. **Create environment file:**

```bash
cd dapp
cp .env.example .env
```

2. **Update `.env` with your values:**

```env
# Contract Address (same for both networks in this setup)
VITE_MULTISIG_FACTORY_ADDRESS=0x76ADE170939349b9Ec9730342962b32443601c29

# WalletConnect Project ID (get from https://cloud.walletconnect.com/)
VITE_WC_PROJECT_ID=your_project_id_here

# Sepolia RPC URL (recommended: Alchemy or Infura)
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
```

### Running the Frontend

#### Development Mode

```bash
cd dapp
pnpm dev
```

The application will be available at `http://localhost:5173`

#### Build for Production

```bash
cd dapp
pnpm build

# Preview production build
pnpm preview
```

### Using the Application

#### 1. Connect Wallet

1. Click "Launch App" on the home page
2. Connect your wallet (MetaMask, WalletConnect, etc.)
3. Switch to Sepolia or Anvil network if needed

#### 2. Create a MultiSig Wallet

1. Click "Buy New Wallet" button
2. Add owner addresses (including yourself)
3. Set required confirmations (must be ≥ 1 and ≤ number of owners)
4. Confirm transaction and pay 0.01 ETH creation fee
5. Wait for confirmation

#### 3. Submit a Transaction

1. Navigate to your wallet
2. Click "New Transaction"
3. Choose transaction type:
   - **Send ETH**: Enter recipient and amount
   - **Send ERC20**: Enter token address, recipient, and amount
   - **Custom Call**: Enter contract address, value, and calldata
4. Submit transaction (you'll automatically confirm it)

#### 4. Confirm a Transaction

1. Go to wallet detail page
2. Find pending transactions
3. Click "Confirm Transaction"
4. The transaction will execute automatically when threshold is reached

#### 5. Monitor Your Wallets

- View all your wallets on the dashboard
- Check wallet balances in real-time
- See total and pending transaction counts
- Track confirmation progress

## API Reference

### MultiSigFactory

```solidity
// Create a new MultiSig wallet
function createMultiSig(
    address[] calldata owners,
    uint256 required
) external payable returns (address multisig)

// View functions
function getDeployedMultiSigs() external view returns (address[])
function getCreatorMultiSigs(address creator) external view returns (address[])
function getOwnerMultiSigs(address owner) external view returns (address[])
function creationFee() external view returns (uint256)

// Admin function (owner only)
function updateCreationFee(uint256 newFee) external
```

### MultiSig

```solidity
// Submit transactions
function submitETH(address to, uint256 amount) external returns (uint256 txId)
function submitERC20(address token, address to, uint256 amount) external returns (uint256 txId)
function submitCustom(address to, uint256 value, bytes calldata data) external returns (uint256 txId)

// Confirm and execute
function confirmTransaction(uint256 txId) external
function executeTransaction(uint256 txId) external

// View functions
function getOwners() external view returns (address[])
function getConfirmers(uint256 txId) external view returns (address[])
function isConfirmed(uint256 txId) external view returns (bool)
function txCount() external view returns (uint256)
function required() external view returns (uint256)
function confirmationCount(uint256 txId) external view returns (uint256)
function transactions(uint256 txId) external view returns (Transaction)
function confirmations(uint256 txId, address owner) external view returns (bool)

// Receive ETH
receive() external payable
```

## Events

### MultiSigFactory Events

```solidity
event MultiSigCreated(
    address indexed multiSig,
    address indexed creator,
    address[] owners,
    uint256 required,
    uint256 timestamp
)
```

### MultiSig Events

```solidity
event Deposit(address indexed sender, uint256 value)

event SubmitTransaction(
    uint256 indexed txId,
    TxType txType,
    address indexed token,
    address indexed to,
    uint256 amount
)

event ConfirmTransaction(address indexed owner, uint256 indexed txId)

event ExecuteTransaction(uint256 indexed txId)
```

## Security Considerations

### Smart Contract Security

✅ **Implemented Protections:**

- Owner address uniqueness enforcement
- Zero address validation
- Valid confirmation requirement checks (1 ≤ required ≤ owners.length)
- Double execution prevention
- Automatic confirmation on submission
- Safe external call handling with error propagation
- Reentrancy protection via checks-effects-interactions pattern

⚠️ **Important Notes:**

- Owners cannot be removed or changed after wallet creation
- Failed transactions revert with original error messages
- ERC20 transfers require sufficient token balance in MultiSig
- Custom calls are executed with provided calldata - ensure correctness

### Frontend Security

- Private keys never leave the wallet
- All transactions require user confirmation
- Input validation on all forms
- Network verification before operations
- Balance checks before transaction submission

### Best Practices

1. **Use Hardware Wallets**: For production wallets with significant funds
2. **Test First**: Always test on testnet before mainnet deployment
3. **Verify Addresses**: Double-check all owner and destination addresses
4. **Adequate Confirmations**: Set required confirmations based on security needs
5. **Monitor Activity**: Regularly check wallet activity and pending transactions

## Development

### Contract Development

```bash
# Format code
forge fmt

# Generate gas report
forge test --gas-report

# Debug specific test
forge test --match-test testName -vvvv

# Create coverage report
forge coverage --report lcov
```

### Frontend Development

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Build analysis
pnpm build --analyze
```

## Troubleshooting

### Common Issues

**"Insufficient fee" error:**
- Ensure you're sending at least 0.01 ETH when creating a wallet

**"Insufficient balance" warning on confirmation:**
- The MultiSig wallet needs enough ETH/tokens to execute the transaction
- Deposit funds before confirming

**Network switching not working:**
- Ensure MetaMask is unlocked
- Manually switch network in MetaMask if automatic switching fails

**Transaction not executing:**
- Verify confirmation threshold is met
- Check wallet has sufficient balance
- Ensure destination address is valid

**Frontend not connecting:**
- Check `.env` file has correct values
- Verify RPC URL is working
- Clear browser cache and reload

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for all new features
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

MIT License - see LICENSE file for details

## Support

For questions, issues, or feature requests:

- Open an issue on GitHub
- Check existing issues for solutions
- Review the documentation

## Acknowledgments

- Built with [Foundry](https://github.com/foundry-rs/foundry)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Blockchain interactions via [Wagmi](https://wagmi.sh/)
- Styled with [TailwindCSS](https://tailwindcss.com/)

---

**Note**: This is testnet software. Use at your own risk. Always audit smart contracts before deploying to mainnet with real funds.
