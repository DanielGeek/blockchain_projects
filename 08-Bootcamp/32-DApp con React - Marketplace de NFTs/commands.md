# Commands

## Compile contracts

npx hardhat compile

## Deploy to Sepolia

npx hardhat run src/backend/scripts/deploy.js --network sepolia

## Verify on Etherscan (Optional)

npx hardhat verify --network sepolia <MARKETPLACE_ADDRESS> 1
npx hardhat verify --network sepolia <NFT_ADDRESS>

## Run frontend

npm start
