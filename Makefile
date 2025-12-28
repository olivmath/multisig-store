test:
	forge test -vv

test-fuzz:
	forge test --match-path "test/MultiSigFuzz.t.sol" -vv

test-invariant:
	forge test --match-path "test/MultiSigInvariant.t.sol" -vv

test-halmos:
	halmos --root . --contract MultiSigHalmosTest

test-all:
	forge test -vv
	forge test --match-path "test/MultiSigFuzz.t.sol" -vv
	forge test --match-path "test/MultiSigInvariant.t.sol" -vv

coverage:
	forge coverage

clean:
	forge clean
	rm -rf frontend/.next
	rm -rf frontend/node_modules
	rm -rf envio/node_modules

deploy-local:
	forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast --account ff80

deploy-sepolia:
	forge script script/Deploy.s.sol --rpc-url ${SEPOLIA_RPC_URL} --account sepolia --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY}

deploy-mainnet:
	forge script script/Deploy.s.sol --rpc-url ${MAINNET_RPC_URL} --account sepolia --broadcast --verify --etherscan-api-key ${ETHERSCAN_API_KEY}

indexer-dev:
	cd envio && npm run dev

indexer-codegen:
	cd envio && npm run codegen

frontend-dev:
	cd frontend && npm run dev

frontend-build:
	cd frontend && npm run build

dev-all:
	make indexer-dev & make frontend-dev
