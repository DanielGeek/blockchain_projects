# help full commands
## genera a new wallet address
`solana-keygen new -o id.json`

## request solana
`solana airdrop 2 {wallet_address} --url devnet`

## Deploy and generate programId
`anchor build`

## Fix errors with ahash
`cargo update -p ahash@0.8.11 --precise 0.8.6`

## get programId
`solana address -k ./target/deploy/chainlink_solana_dapp-keypair.json`