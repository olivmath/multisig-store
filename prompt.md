# Ladpage (Hero)

##  Header (Bottuns)

### Esquerda

1. Home (nome do projeto: MultiSigStore)

### Direita:

1. launch app

## Body

1. Headline / Título Principal
2. Subheadline / Subtítulo Secundário
3. Call to Action (CTA) / Botão de Ação (abre o modal para conectar a wallet)
4. 3 grandes cards com informações sobre:
   1. Wallets ativas
   2. Owners unicos
   3. Total de transações



# MyDashboard (apenas quando wallet está conectada)

##  Header (Bottuns)

### Esquerda

1. Home (nome do projeto: MultiSigStore)

### Direita:

2. Notificações (transações pendentes, mostra uma lista de todas transações pendentes nas wallet, ao clicar leva para a wallet page) 
3. Rede blockchain conectada (Ethereum Mainnet/Sepolia/etc)
4. Saldo da wallet (ETH)
5. Logout

## Body

1. botao de criar nova wallet com modal:
   - list de owners (a carteira conectada é automaticamente um owner)
   - campo required (sempre maior q 0 e menor que o total de owners)
   - warning da Fee
   - botao de confirmar criação (leva para a pagina da wallet quando transacao completa)

2. Dasboard com todas wallets em cards com:
- owners (mostrando identicons)
- saldo da wallet (ETH)
- required (2/3, 3/5)

# Wallet Page

## Header (Bottuns)

### Esquerda

1. Home (nome do projeto: MultiSigStore)

### Direita:

2. Notificações (transações pendentes, mostra uma lista de todas transações pendentes nas wallet, ao clicar leva para a wallet page) 
3. Rede blockchain conectada (Ethereum Mainnet/Sepolia/etc)
4. Saldo da wallet (ETH)
5. Logout

## Body

1. 3 cards da esquerda pra direita:
- card1: owners (mostrando identicons)
- card2: required (2/3, 3/5)
- card3: saldo da wallet (ETH, editavel para qualquer token erc20 [salvo localstorage])

2. botao de fazer transação abre modal:
- campo tipo: ether/erc20/custom
- campo token para erc20
- campo destination
- campo value para ether ou amount para erc20
- campo data para custom
- botao de confirmar transação

3. Transações, mostra uma lista de todas transações com filtros da wallet
- cada transação mostra:
  - tipo (ether/erc20/custom)
  - destination/token/contract
  - value/amount
  - data (para custom)
  - status ([1/5,2/5,3/5]/confirmed, quando passar o required deve ir para confirmed)
  - link para transação
  - datetime
  - botao para confirmar transação (se nao tiver confirmed)