# MultiSig Factory

A complete multi-signature wallet solution with factory deployment, event indexing, and a beautiful frontend interface.

## Features

- **MultiSig Contract**: Secure multi-signature wallet implementation
- **Factory Contract**: Deploy unlimited MultiSig wallets with custom configurations
- **Comprehensive Testing**: Unit tests, fuzz tests, invariant tests, and formal verification with Halmos
- **Event Indexing**: Real-time event indexing with Envio and GraphQL API
- **Modern Frontend**: Beautiful, responsive UI built with Next.js, TailwindCSS, and RainbowKit

## Project Structure

```
.
├── src/                    # Solidity contracts
│   ├── MultiSig.sol       # MultiSig wallet implementation
│   └── MultiSigFactory.sol # Factory for deploying MultiSig wallets
├── test/                   # Comprehensive test suite
│   ├── MultiSig.t.sol     # Unit tests
│   ├── MultiSigFuzz.t.sol # Fuzz tests
│   ├── MultiSigInvariant.t.sol # Invariant tests
│   ├── MultiSigHalmos.t.sol    # Formal verification tests
│   └── MultiSigFactory.t.sol   # Factory tests
├── script/                 # Deployment scripts
│   └── Deploy.s.sol       # Factory deployment script
├── envio/                  # Event indexer
│   ├── config.yaml        # Indexer configuration
│   ├── schema.graphql     # GraphQL schema
│   └── src/               # Event handlers
└── frontend/               # Next.js frontend
    ├── app/               # App router pages
    ├── components/        # React components
    └── lib/              # Utilities and configs
```

## Installation

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) (v18+)
- [Docker Compose](https://docs.docker.com/compose/install/) (required for Envio indexer)
- [Halmos](https://github.com/a16z/halmos) (optional, for formal verification)

**Installing Docker Compose:**
```bash
# Option 1: Docker Desktop (includes Docker Compose)
# Download from: https://www.docker.com/products/docker-desktop/

# Option 2: Via Homebrew (macOS/Linux)
brew install docker-compose

# Option 3: Via package manager (Linux)
sudo apt-get install docker-compose  # Debian/Ubuntu
```

### Setup

```bash
# Install all dependencies
make install

# Or install separately:
forge install                 # Solidity dependencies
cd frontend && npm install   # Frontend dependencies
cd envio && npm install      # Indexer dependencies
```

## Testing

### Run all tests

```bash
make test-all
```

### Unit tests

```bash
make test
```

### Fuzz tests

```bash
make test-fuzz
```

### Invariant tests

```bash
make test-invariant
```

### Formal verification with Halmos

```bash
make test-halmos
```

### Test coverage

```bash
make coverage
```

## Deployment

### Local deployment (Anvil)

```bash
# Start Anvil
anvil

# Deploy
make deploy-local
```

### Testnet deployment (Sepolia)

```bash
export SEPOLIA_RPC_URL=your_rpc_url
export PRIVATE_KEY=your_private_key
export ETHERSCAN_API_KEY=your_etherscan_key

make deploy-sepolia
```

### Mainnet deployment

```bash
export MAINNET_RPC_URL=your_rpc_url
export PRIVATE_KEY=your_private_key
export ETHERSCAN_API_KEY=your_etherscan_key

make deploy-mainnet
```

## Event Indexing with Envio

### Configuration

1. Update `envio/config.yaml` with your deployed contract addresses
2. Configure the network and start block

### Run the indexer

```bash
make indexer-dev
```

The GraphQL API will be available at `http://localhost:8080/v1/graphql`

## Frontend

### Configuration

1. Copy the environment file:

```bash
cd frontend
cp .env.example .env.local
```

2. Update `.env.local`:

```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

Get a WalletConnect project ID at [cloud.walletconnect.com](https://cloud.walletconnect.com)

### Run the frontend

```bash
make frontend-dev
```

The frontend will be available at `http://localhost:3000`

### Build for production

```bash
make frontend-build
```

## Usage

### Creating a MultiSig Wallet

1. Connect your wallet on the frontend
2. Navigate to "Create" page
3. Enter the factory contract address
4. Add owner addresses
5. Set the number of required confirmations
6. Click "Create MultiSig"

### Using Your MultiSig Wallet

#### Submit a Transaction

```solidity
multiSig.submitTransaction(
    destinationAddress,
    valueInWei,
    encodedData
);
```

#### Confirm a Transaction

```solidity
multiSig.confirmTransaction(transactionId);
```

#### Execute a Transaction

```solidity
multiSig.executeTransaction(transactionId);
```

## Contract Details

### MultiSig Contract

**Key Features:**
- Multiple owners with configurable confirmation requirements
- Submit, confirm, and execute transactions
- Automatic confirmation on submission by submitter
- Support for ETH transfers and contract calls
- Event emission for complete transaction history

**Events:**
- `Deposit(address indexed sender, uint256 value)`
- `SubmitTransaction(uint256 indexed txId, address indexed destination, uint256 value, bytes data)`
- `ConfirmTransaction(address indexed owner, uint256 indexed txId)`
- `ExecuteTransaction(uint256 indexed txId)`

### MultiSigFactory Contract

**Key Features:**
- Deploy unlimited MultiSig wallets
- Track all deployed wallets
- Track wallets by creator
- Gas-efficient deployment

**Events:**
- `MultiSigCreated(address indexed multiSig, address indexed creator, address[] owners, uint256 required, uint256 timestamp)`

## GraphQL Queries

### Get all MultiSig wallets

```graphql
query {
  MultiSigContract(order_by: { createdAt: desc }) {
    id
    address
    creator
    owners
    required
    createdAt
  }
}
```

### Get wallet details

```graphql
query GetMultiSig($address: String!) {
  MultiSigContract(where: { address: { _eq: $address } }) {
    id
    address
    owners
    required
    transactions {
      txId
      destination
      value
      executed
      confirmations {
        owner
      }
    }
  }
}
```

### Get global statistics

```graphql
query {
  GlobalStats {
    totalMultiSigs
    totalTransactions
    totalDeposits
    totalExecutedTransactions
  }
}
```

## Security Considerations

- All contracts have been thoroughly tested with unit, fuzz, invariant, and formal verification tests
- Owner addresses must be unique and non-zero
- Required confirmations must be between 1 and the number of owners
- Transactions cannot be executed without sufficient confirmations
- Executed transactions cannot be re-executed
- Failed external calls will revert with the original error message

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.
