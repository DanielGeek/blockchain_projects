## Steps for create you own solana token and mint 1000

### Get Solana set up on your computer!
- url: https://github.com/LearnWithArjun/solana-env-setup 

- create a token: spl-token create-token --url devnet

- token address GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz

- Create account from my token address: spl-token create-account GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet

- account address: CFyX4xhLNhN2ShQR8uaTtp3PbXpj8fNPYdsBKT4oamTB

- Get token address balance: spl-token balance GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz --url devnet

- Mint 100 token for this token address: spl-token mint GKY8TupE8b8LZEhpjv8x3ErjQpb1fQ3PR1NR5Z8Kojuz 1000 --url devnet