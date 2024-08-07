import {
  getAddressBalance,
  getTransactions,
  getItemPrice,
  writeTransactions
} from './blockchain-helpers.js';

import EC from 'elliptic';
const ec = new EC.ec('p192');

const buyerPrivateKey = process.argv[2];
const itemBought = process.argv[3];
// Add your code below

const keyPair = ec.keyFromPrivate(buyerPrivateKey);
const publicKey = keyPair.getPublic('hex');

const price = getItemPrice(itemBought);
const signature = keyPair.sign(publicKey + price + itemBought).toDER('hex');

const transactions = getTransactions();
const newTransaction = {
    buyerAddress: publicKey,
    sellerAddress: null,
    price,
    itemBought,
    signature
};

const balance = getAddressBalance(publicKey);
if (balance >= price) {
    transactions.push(newTransaction);
    writeTransactions(transactions);
}
