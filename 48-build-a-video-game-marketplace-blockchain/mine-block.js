import {
  getBlockchain,
  getTransactions,
  writeBlockchain,
  writeTransactions
} from './blockchain-helpers.js';

import sha256 from 'crypto-js/sha256.js';
// Add your code below

const blockchain = getBlockchain();
const lastBlock = blockchain[blockchain.length-1];
const transactions = getTransactions();

let hash = '';
let nonce = 0;

while(!hash.startsWith('00')) {
    nonce++;
    hash = sha256(nonce + lastBlock.hash + JSON.stringify(transactions)).toString();
}

const newBlock = {
    nonce,
    hash,
    previousHash: lastBlock.hash,
    transactions,
};

blockchain.push(newBlock);
writeBlockchain(blockchain);

writeTransactions([]);
