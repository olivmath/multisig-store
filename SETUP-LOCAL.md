# Setup Local para Desenvolvimento

## Pré-requisitos

### 1. Instalar Docker Compose

O Envio indexer precisa do Docker Compose. Você tem algumas opções:

#### Opção A: Docker Desktop (Recomendado)
- Download: https://www.docker.com/products/docker-desktop/
- Inclui Docker e Docker Compose

#### Opção B: Docker Compose via Homebrew (Mais leve)
```bash
brew install docker-compose
```

#### Opção C: Usar Podman Compose
```bash
brew install podman-compose
```

Depois crie um symlink:
```bash
sudo ln -s $(which podman-compose) /usr/local/bin/docker-compose
```

### 2. Verificar instalação
```bash
docker-compose --version
```

## Passos para Setup Local

### 1. Iniciar Anvil
Em um terminal, rode:
```bash
anvil
```

Deixe rodando. O Anvil irá:
- Criar uma blockchain local na porta 8545
- Criar 10 contas de teste com 10,000 ETH cada
- Exibir as private keys (útil para testes)

### 2. Deploy dos Contratos
Em outro terminal:
```bash
cd /Users/olivmath/Documents/dev/multsig
make deploy-local
```

Isso vai:
- Deploy do MultiSigFactory
- Criar um MultiSig de exemplo com 3 owners
- Fundar o MultiSig com 100 ETH
- Salvar os endereços em `envio/deployed-addresses.txt`

### 3. Iniciar o Indexer Envio
```bash
cd envio
pnpm dev
```

O Envio vai:
- Subir um banco de dados PostgreSQL via Docker Compose
- Subir um servidor Hasura para GraphQL
- Começar a indexar eventos dos contratos
- GraphQL disponível em: http://localhost:8080/v1/graphql

### 4. Iniciar o Frontend
Em outro terminal:
```bash
cd frontend
cp .env.example .env.local
```

Edite `.env.local` e adicione:
```env
NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=seu_project_id_aqui
```

Obtenha um Project ID grátis em: https://cloud.walletconnect.com

Depois rode:
```bash
npm run dev
```

Frontend disponível em: http://localhost:3000

## Testando o Sistema

### Opção 1: Script Interativo
```bash
./script/interact-local.sh
```

Menu com opções para:
1. Submit transaction
2. Confirm transaction
3. Execute transaction
4. Send ETH
5. Get transaction count
6. Create new MultiSig
7. Full flow (submit + confirm + execute)

### Opção 2: Comandos Cast Manuais

**Endereços Anvil Padrão:**
- Account 0: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Account 1: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Account 2: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`

**Private Keys:**
- PK 0: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- PK 1: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

**Exemplo: Submit Transaction**
```bash
# Carregar endereço do MultiSig
source envio/deployed-addresses.txt

# Submit (como account 0)
cast send $MULTISIG_ADDRESS \
  "submitTransaction(address,uint256,bytes)" \
  0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
  1000000000000000000 \
  0x \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

**Confirmar Transaction**
```bash
cast send $MULTISIG_ADDRESS \
  "confirmTransaction(uint256)" \
  0 \
  --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d \
  --rpc-url http://localhost:8545
```

**Executar Transaction**
```bash
cast send $MULTISIG_ADDRESS \
  "executeTransaction(uint256)" \
  0 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --rpc-url http://localhost:8545
```

## Verificando os Eventos Indexados

Acesse o GraphQL Playground: http://localhost:8080/v1/graphql

**Query de exemplo:**
```graphql
query {
  MultiSigContract {
    id
    address
    creator
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
    deposits {
      sender
      value
    }
  }
}
```

## Troubleshooting

### Anvil não está respondendo
```bash
# Mate processos antigos
pkill anvil
# Reinicie
anvil
```

### Envio não conecta ao banco
```bash
# Pare os containers
cd envio
docker-compose down
# Reinicie
pnpm dev
```

### Reset completo
```bash
# Limpe tudo
pkill anvil
cd envio && docker-compose down -v
forge clean

# Recomece do zero
anvil  # em um terminal
make deploy-local  # em outro
cd envio && pnpm dev  # em outro
cd frontend && npm run dev  # em outro
```

## Estrutura dos Terminais

Você precisará de 4 terminais rodando simultaneamente:

```
Terminal 1: anvil
Terminal 2: cd envio && pnpm dev
Terminal 3: cd frontend && npm run dev
Terminal 4: comandos de teste (cast, interact-local.sh, etc)
```

## Próximos Passos

- Conecte sua carteira MetaMask no Anvil local:
  - Network: http://localhost:8545
  - Chain ID: 31337
  - Currency: ETH
  - Importe uma das private keys do Anvil

- Teste o frontend criando uma nova MultiSig
- Teste submitting, confirming e executing transactions
- Veja os dados sendo indexados em tempo real no GraphQL
