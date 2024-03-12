## Steps for create you own solana token and mint 1000

### Get Solana set up on your computer!
- url: https://github.com/LearnWithArjun/solana-env-setup 

- Put solanas in your account by using pubkey: solana airdrop 2 your-pub-key --url devnet

- create a token: spl-token create-token --url devnet

- token address GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz

- Create account from my token address: spl-token create-account GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet

- account address: CFyX4xhLNhN2ShQR8uaTtp3PbXpj8fNPYdsBKT4oamTB

- Get token address balance: spl-token balance GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet

- Mint 100 token for this token address: spl-token mint GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz 1000 --url devnet

- Get total supply: spl-token supply GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet

- Limit minting token: spl-token authorize GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz mint --disable --url devnet

- Burn token from account: spl-token burn CFyX4xhLNhN2ShQR8uaTtp3PbXpj8fNPYdsBKT4oamTB 100 --url devnet

- Phantom wallet address devnet: AUhPKUcijAntXRSiu3dK4Bfqbs3oFLs2yaPsbpY3WDS4

- Transfer 150 token to another Solana address: spl-token transfer GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz 150 AUhPKUcijAntXRSiu3dK4Bfqbs3oFLs2yaPsbpY3WDS4 --url devnet --fund-recipient
