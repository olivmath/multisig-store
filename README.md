# **Copywriting Catalog - MultiSig Store**

## **Voice & Tone Principles:**
- **Collective Security:** Emphasize shared protection
- **Technical Sophistication:** Use precise blockchain terms, accessible to teams
- **Trust & Authority:** Convey institutional-grade security
- **Clear Action:** Direct, compelling calls-to-action

---

## **Metadata & SEO (`dapp2/index.html`)**

- **Page Title:** `MultiSig Store | Smart Contract Multisignature Wallets`
- **Meta Description:** `Purchase pre-deployed multisig smart contracts on-chain. Collective security for teams, DAOs, and shared asset management.`
- **Meta Author:** `MultiSig Store`
- **Social Title (og:title):** `MultiSig Store - Smart Contract Multisignature Wallets`
- **Social Description:** `Multisig wallets as a service. Buy your pre-deployed smart contract protected by multiple signatures.`
- **Twitter Handle:** `@MultiSigStore`

---

## **Homepage (`src/pages/Index.tsx`)**

### **Header**
- **Main Button:** `Launch App`

### **Hero Section**
- **Badge:** `Enterprise Blockchain Security`
- **Main Title:** `Collective Protection for Digital Assets`
- **Subtitle:** `MultiSig Store: Multisignature Wallets as a Service`
- **Supporting Paragraph:** `Purchase your pre-deployed multisig smart contract on-chain. Manage shared funds with institutional security and multi-party approvals.`

### **Global Statistics**
- **Stat Card Title:** `Active Wallets`
- **Stat Card Title:** `Unique Owners`
- **Stat Card Title:** `Secure Transactions`

### **Footer**
- **Copyright:** `© 2025 MultiSig Store. All rights reserved.`

### **Notifications (Toasts)**
- **Title (Successful Connection):** `Wallet Connected!`
- **Description:** `Successfully connected to wallet {address}`

---

## **Reusable Components**

### **Logo (`Logo.tsx`)**
- **Brand Name:** `MultiSig Store`
- **Tagline:** `Collective Security for Shared Assets`

### **Wallet Connection Modal**
- **Modal Title:** `Connect Wallet`
- **Description (MetaMask):** `Connect via browser extension`
- **Description (WalletConnect):** `Connect via mobile wallet`
- **Description (Coinbase):** `Connect via Coinbase Wallet`
- **Footer Text:** `By connecting, you agree to our `
- **Link:** `Terms of Service`

### **Wallet Creation Modal**
- **Modal Title:** `Configure New Multisig Wallet`
- **Field Label:** `Owners`
- **Placeholder:** `Ethereum address (0x...)`
- **Current Owner Tag:** `You`
- **Label:** `Required Signatures`
- **Support Text:** `out of {number} owners`
- **Warning Title:** `Smart Contract Cost`
- **Warning Text:** `This multisig contract will be deployed for 0.01 ETH.`
- **Cancel Button:** `Cancel`
- **Creating Button:** `Deploying...`
- **Confirm Button:** `Deploy Multisig Contract`

### **Creation Notifications**
- **Empty Address:** `Address Required` / `Please enter an owner address.`
- **Invalid Address:** `Invalid Address` / `Please enter a valid Ethereum address.`
- **Duplicate Owner:** `Duplicate Owner` / `This address is already added.`
- **Owner Added:** `Owner Added!` / `New owner successfully configured.`
- **Remove Error:** `Cannot Remove` / `You cannot remove yourself as an owner.`
- **Owner Removed:** `Owner Removed` / `Owner removed from wallet.`
- **No Owners:** `No Owners` / `At least one owner is required.`
- **Invalid Signatures:** `Invalid Configuration` / `Required signatures must be between 1 and {number}.`

---

## **Dashboard**

### **Dashboard Main Page**
- **Title:** `Your Multisig Wallets`
- **Description:** `Manage all your multi-signature wallets`
- **Create Button:** `Purchase New Wallet`
- **Creating Button:** `Processing...`
- **Empty State:** `No Wallets Found` / `Purchase your first multisig wallet to begin`
- **Card Name:** `Multisig Wallet {address}`

### **Dashboard Notifications**
- **Disconnected:** `Disconnected` / `Session ended successfully.`
- **Creating Wallet:** `Deploying Contract...` / `Please confirm the transaction in your wallet.`

### **Dashboard Header**
- **Popover Title:** `Pending Transactions`
- **Description:** `Wallets awaiting your approval`
- **Badge:** `{number} pending`
- **Empty State:** `No pending transactions`
- **Network Button:** `Network: {name}`
- **Disconnect Menu:** `Disconnect`

---

## **Wallet Page**

### **Header**
- **Title:** `Multisig Wallet: {address}`

### **Info Cards**
- **Title:** `Owners`
- **Loading:** `Loading owners...`
- **Tag:** `You`
- **Title:** `Required Signatures`
- **Description:** `Approvals required`
- **Title:** `Balance`
- **Button:** `Add Funds`
- **Tokens:** `ETH`, `Custom Token`

### **Custom Token**
- **Instruction:** `Add custom token contract`
- **Placeholder:** `Contract address (0x...)`
- **Buttons:** `Cancel`, `Save Token`
- **Character Counter:** `{number}/42 characters`
- **Fallback:** `TOKEN`

### **Transactions Section**
- **Title:** `Transactions`
- **Button:** `New Transaction`
- **Empty State:** `No Transactions` / `This wallet hasn't executed any transactions yet.` / `Click "New Transaction" above to create your first transaction.`

### **Transaction Card**
- **ID:** `Transaction #{number}`
- **Status:** `Executed`, `Pending`
- **Types:** `Send ETH`, `Send Token`, `Custom Transaction`
- **Labels:** `Token Contract`, `Recipient`, `Destination`
- **Invalid Address:** `Invalid address`
- **Calldata:** `Transaction Data`
- **Confirmations:** `Confirmations`
- **Auto-execute Warning:** `This transaction will execute automatically when threshold is reached`
- **Insufficient Balance:** `Insufficient Balance` / `This wallet needs {amount} ETH but only has {balance}. Add funds before confirming.`
- **Confirming Button:** `Confirming...`
- **Button:** `Confirm Transaction`
- **User Confirmation:** `✓ You confirmed this transaction`
- **Execution:** `✓ Transaction executed successfully`

### **New Transaction Modal**
- **Title:** `Create New Transaction`
- **Label:** `Transaction Type`
- **Options:** `Ether (ETH)`, `ERC20 Token`, `Custom Transaction`
- **Labels:** `Token Contract`, `Recipient`, `Amount (ETH)`, `Value`, `Data (Hexadecimal)`
- **Buttons:** `Cancel`, `Creating...`, `Create Transaction`

---

## **Notifications (Bell)**

- **Menu Title:** `Notifications`
- **Button:** `Mark all as read`
- **Empty State:** `No notifications`
- **Time:** `just now`, `{n}m ago`, `{n}h ago`, `{n}d ago`

### **Notification Types:**
- **New Wallet (Creator):** `Wallet Created` / `You deployed a new multisig wallet`
- **New Wallet (Owner):** `New Wallet` / `You were added as an owner to a multisig wallet`
- **New Transaction:** `New Transaction` / `A new transaction requires your approval`
- **Transaction Confirmed:** `Transaction Confirmed` / `An owner confirmed transaction #{number}`
- **Transaction Executed:** `Transaction Executed` / `Transaction #{number} was executed successfully`

---

## **404 Page**

- **Error Code:** `404`
- **Message:** `Page Not Found`
- **Link:** `Return to Home`

---

## **Generic UI Text**

- **Breadcrumb:** `More`
- **Carousel:** `Previous slide`, `Next slide`
- **Modal/Dialog:** `Close`
- **Pagination:** `Previous page`, `Previous`, `Next page`, `Next`, `More pages`
- **Sheet/Sidebar:** `Close`, `Toggle sidebar`

