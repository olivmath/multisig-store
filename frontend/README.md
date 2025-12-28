# MultiSig Wallet - Frontend

Premium fintech-style frontend para plataforma de carteiras multisig no Ethereum.

## 🎨 Design

- **Estilo**: Minimalista premium, inspirado em Apple/Swiss editorial
- **Cores**: Monocromático (#0A0A0A, #FFFFFF) + accent blue (#0066FF)
- **Tipografia**: SF Pro Display (system fonts)
- **Layout**: Assimetria sutil, whitespace abundante

## 🚀 Stack Técnica

- **Framework**: React 18 + Vite + TypeScript
- **Web3**: Viem + Wagmi v2 (hooks React para blockchain)
- **Styling**: Tailwind CSS v4
- **State**: React Query (@tanstack/react-query)
- **Routing**: React Router v7
- **Blockchain**: Ethereum Sepolia Testnet

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔧 Configuração

### Contratos

Os endereços dos contratos estão em `src/lib/contracts/addresses.ts`:

```typescript
export const CONTRACTS = {
  [sepolia.id]: {
    MultiSigFactory: '0x0AD969705210C5C7693848F243Be805C55A99e06',
    Token: '0x...' // Token ERC20 para testes (opcional)
  }
}
```

### Wagmi

Configurado para Sepolia em `src/lib/wagmi/config.ts`. Suporta:
- Injected wallets (MetaMask, etc.)
- WalletConnect (adicione VITE_WC_PROJECT_ID em .env)

## 📱 Funcionalidades

### Dashboard
- Lista de carteiras multisig do usuário
- Cards com endereço, saldo, owners
- Criação de nova carteira (fee: 0.01 ETH)

### Criar MultiSig
- Adicionar/remover owners dinamicamente
- Validação de endereços Ethereum
- Configurar confirmações requeridas (1-N)

### Visualizar Carteira
- Detalhes completos (saldo, owners, confirmações)
- Timeline de transações
- Submit de transações (ETH e ERC20)
- Confirmar e executar transações

### Real-time Updates
- Event listeners para transações
- Auto-refresh ao criar multisig
- Progress bar de confirmações

## 🎯 Fluxo de Uso

1. **Conectar Wallet**: MetaMask/WalletConnect
2. **Criar MultiSig**:
   - Adicionar endereços dos owners
   - Definir confirmações requeridas
   - Pagar 0.01 ETH
3. **Enviar Transação**:
   - Escolher tipo (ETH ou ERC20)
   - Preencher destino e valor
   - Submit
4. **Aprovar Transação**:
   - Outros owners confirmam
   - Quando atingir required → executar

## 🎨 Componentes UI

### Design System
- `Button`: 3 variantes (primary, secondary, ghost)
- `Card`: Layouts assimétricos
- `Badge`: Status indicators
- `Spinner`: Loading states

### Animações
- `fadeIn`: Entrada suave
- `slideIn`: Slide lateral
- `pulse-subtle`: Pulso suave para status pending

## 📁 Estrutura

```
src/
├── components/
│   ├── ui/              # Design system
│   ├── CreateMultiSigModal.tsx
│   ├── SubmitTransactionForm.tsx
│   ├── TransactionCard.tsx
│   └── TransactionTimeline.tsx
├── pages/
│   ├── Dashboard.tsx
│   └── MultiSigView.tsx
├── hooks/
│   ├── useMultiSigFactory.ts
│   ├── useMultiSig.ts
│   └── useEventListener.ts
├── lib/
│   ├── contracts/       # ABIs e endereços
│   ├── wagmi/          # Config Web3
│   └── utils/          # Helpers
└── styles/
    ├── globals.css
    └── design-tokens.css
```

## 🔗 Deploy

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build command
npm run build

# Publish directory
dist
```

### Variáveis de Ambiente

Criar `.env`:

```bash
# WalletConnect (opcional)
VITE_WC_PROJECT_ID=your_project_id

# Alchemy/Infura RPC (opcional, usa público se não definido)
VITE_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/...
```

## 🧪 Testes

1. **Conectar wallet** no Sepolia
2. **Ter ETH de teste**: [Sepolia Faucet](https://sepoliafaucet.com/)
3. **Criar MultiSig**:
   - Use endereços de teste ou crie múltiplas wallets
   - Required = 2 para testes multi-owner
4. **Enviar transação**
5. **Confirmar** com outros owners
6. **Executar** quando aprovada

## 🐛 Debug

### Transações não aparecem
- Verificar se está na rede Sepolia
- Conferir endereço do contrato em `addresses.ts`

### Wallet não conecta
- Verificar extensão do navegador
- Limpar cache da dApp

### Build falha
- Deletar `node_modules` e `npm install`
- Verificar versão Node >= 18

## 📜 Licença

MIT

## 🤝 Contribuição

PRs são bem-vindos!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add some AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

Feito com 🤖 [Claude Code](https://claude.com/claude-code)
