# Build a Fundraising Smart Contract

In this integrated project, you will create and deploy a smart contract to raise funds for your startup. The goal is to raise 150 tokens before the seventh block is mined.

## Description

You need to create and deploy a smart contract to this blockchain that raises funds for your startup. The goal is to raise 150 tokens before the seventh block is mined.

You are started with some boilerplate code and files in the `build-a-fundraising-smart-contract` folder, you should not need to change any of the boilerplate code. The `fundraising-contract` folder is the only place you need to write code. All the files in there are part of your contract.

The `initial-state.json` file is the initial state of an object your contract will store. All the `.js` files in that folder will be files the contract can run. The `on-transaction.js` file will run immediately after a transaction is sent to the address of your contract. The `on-new-block.js` file will run immediately after a new block is mined. Note: contract files will only run if its `status` variable is set to open.

## System of Files

### Example Files
- `get-favorite-number.js`
- `initial-state.json`
- `on-new-block.js`
- `on-transaction.js`
- `send-transaction.js`
- `set-favorite-number.js`

### Fundraising Contract Files
- `initial-state.json`
- `on-new-block.js`
- `on-transaction.js`
- `other-files.js`
- `add-transaction.js`
- `blockchain-helpers.js`
- `blockchain.json`
- `contract-wallets.json`
- `deploy-contract.js`
- `generate-wallet.js`
- `get-address-info.js`
- `init-blockchain.js`
- `mine-block.js`
- `README.md`
- `run-contract.js`
- `smart-contracts.json`
- `transactions.json`
- `validate-chain.js`
- `wallets.json`

---

## Key Learnings and Technologies Applied

1. **Smart Contract Development:**
   - Implemented a fundraising smart contract with specific goals and conditions.
   - Managed the contract's state and interactions using JavaScript.

2. **Blockchain Interaction:**
   - Deployed and tested smart contracts on a blockchain.
   - Handled transactions and ensured correct processing of contract logic.

3. **State Management:**
   - Used JSON files to manage and store the initial state and ongoing transactions.
   - Ensured the contract's state is correctly updated with each transaction.

4. **Event Handling:**
   - Developed event-driven code to handle transactions (`on-transaction.js`) and new block creation (`on-new-block.js`).

5. **Testing and Validation:**
   - Tested the contract's functionality thoroughly to ensure it meets the fundraising goals.
   - Validated the blockchain state to ensure integrity and correctness of transactions.

This project provided valuable experience in developing and deploying smart contracts, handling blockchain interactions, and managing state and transactions in a secure and efficient manner. It showcases my ability to work with blockchain technology and develop smart contracts to achieve specific business goals.
