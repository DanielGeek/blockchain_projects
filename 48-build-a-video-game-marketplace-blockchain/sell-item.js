import {
  getAddressItems,
  getItemPrice,
  getTransactions,
  writeTransactions
} from './blockchain-helpers.js';

import EC from 'elliptic';
const ec = new EC.ec('p192');

const sellerPrivateKey = process.argv[2];
const itemSold = process.argv[3];
// Add your code below

const transactions = getTransactions();
const price = getItemPrice(itemSold) - 5;

const keyPair = ec.keyFromPrivate(sellerPrivateKey);
const publicKey = keyPair.getPublic('hex');
const items = getAddressItems(publicKey);
const signature = keyPair.sign(publicKey + price + itemSold).toDER('hex');

const newTransaction = {
    buyerAddress: null,
    sellerAddress: publicKey,
    price,
    itemSold,
    signature
};

if(items[itemSold] >= 1) {
    transactions.push(newTransaction);
    writeTransactions(transactions);
}
