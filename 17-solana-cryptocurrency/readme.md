# Steps for create you own solana token and mint 1000

## Prerequisites

- ⚙️ Install Rust.
- ☕️ Install Node, NPM, and Mocha
- 📚 Install Anchor
- With cargo install solana-cli

## Next steps

```bash
solana --version
```

```bash
cargo install spl-token-cli
```

## Get Solana set up on your computer

- url: [solana-env-setup](https://github.com/LearnWithArjun/solana-env-setup)

- Put solanas in your account by using pubkey:

```bash
solana airdrop 2 your-pub-key --url devnet
```

- create a token:

```bash
spl-token create-token --url devnet
```

- token address GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz

- Create account from my token address:

```bash
spl-token create-account GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet
```

- account address: CFyX4xhLNhN2ShQR8uaTtp3PbXpj8fNPYdsBKT4oamTB

- Get token address balance:

```bash
spl-token balance GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet
```

- Mint 100 token for this token address:

```bash
spl-token mint GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz 1000 --url devnet
```

- Get total supply:

```bash
spl-token supply GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet
```

- Limit minting token:

```bash
spl-token authorize GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz mint --disable --url devnet
```

- Burn token from account:

```bash
spl-token burn CFyX4xhLNhN2ShQR8uaTtp3PbXpj8fNPYdsBKT4oamTB 100 --url devnet
```

- Phantom Number 2 wallet address devnet: AUhPKUcijAntXRSiu3dK4Bfqbs3oFLs2yaPsbpY3WDS4

- Transfer 150 token to another Solana address:

```bash
spl-token transfer GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz 150 AUhPKUcijAntXRSiu3dK4Bfqbs3oFLs2yaPsbpY3WDS4 --url devnet --fund-recipient
```
