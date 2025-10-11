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

## Next thing you'll want to do is run these three commands separately

```bash
solana config set --url devnet
```

```bash
solana-keygen recover 'prompt:?key=0/0' -o ~/phantom-keypair.json
```

```bash
solana config set --keypair ~/phantom-keypair.json
```

```bash
solana config set --commitment confirmed
```

This will output something like this:

```bash
Config File: /Users/thepunisher/.config/solana/cli/config.yml
RPC URL: https://api.devnet.solana.com 
WebSocket URL: wss://api.devnet.solana.com/ (computed)
Keypair Path: /Users/thepunisher/.config/solana/id.json 
Commitment: confirmed
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

- token address 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2

- Create account from my token address:

```bash
spl-token create-account 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2 --url devnet
```

- token account address: 5XnXLqrfSTfFhkx1YT1zQr9b9HvC85NBF9EQR8qSSxPT

- Get token address balance:

```bash
spl-token balance 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2 --url devnet
```

- Mint 1000 tokens for this token address:

```bash
spl-token mint 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2 1000 --url devnet
```

- Get total supply:

```bash
spl-token supply 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2 --url devnet
```

- Limit minting token:

```bash
spl-token authorize 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2 mint --disable --url devnet
```

- Burn tokens of token account address:

```bash
spl-token burn 5XnXLqrfSTfFhkx1YT1zQr9b9HvC85NBF9EQR8qSSxPT 100 --url devnet
```

- Phantom Number 2 wallet address devnet: CpmBmbscfNX8zM5qnqoTyhUYPsFSpxZJAP3hMT8Jt91E

- Transfer 150 token to another Solana address:

```bash
spl-token transfer 6sfZmzfzjZtXXXSWZikWzczU89NcUZL4qAAS7tndYWZ2 150 CpmBmbscfNX8zM5qnqoTyhUYPsFSpxZJAP3hMT8Jt91E --url devnet --fund-recipient
```
