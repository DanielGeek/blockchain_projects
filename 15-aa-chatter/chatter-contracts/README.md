## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

### run function from contract ChetterMessage.s.sol
`forge script ./script/Chatter.s.sol --rpc-url https://rpc.sepolia.org --broadcast --sender 0x30727808d10af7495D82738f8ff22Ef5824ec372 --unlocked --chain-id 11155111 --verify`

### verify contract
`forge verify-contract --chain-id 11155111 0xd0F90CDF11516Ea23aEA3aCD602d94d262676846 Chatter --compiler-version 0.8.20 --watch`
