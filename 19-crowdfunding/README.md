## Calculator Dapp with Rust and Solana network

### Commandas to use
- anchor init project-name
- anchor build
- anchor test

## genere a new pubKey on solana
- solana-keygen new -o id.json

### Solana pubkey
`36fraLfgEwxMfibXpjBGUoHad6jTHDRDbmd9CcddvMJ1`

### get your solana
`solana airdrop 2 36fraLfgEwxMfibXpjBGUoHad6jTHDRDbmd9CcddvMJ1 --url devnet`

### deploy Dapp
`anchor deploy`

### program id
`MGhpSzfSMQveQZH5u9qiDr19op7W1gNpwYwHajB7Yy5`

### Fixed ahash error
- cargo update -p ahash@0.8.11 --precise 0.8.6
