import {
  getTransactions,
  writeTransactions,
  getWallets,
  writeWallets
} from './blockchain-helpers.js';

import EC from 'elliptic';
const ec = new EC.ec('p192');

const newWalletName = process.argv[2];
// Add your code below

const keyPair = ec.genKeyPair();
const pub = keyPair.getPublic('hex');
const priv = keyPair.getPrivate('hex');

const wallets = getWallets();

wallets[newWalletName] = {
    publicKey:pub,
    privateKey:priv
};

writeWallets(wallets);

const transactions = getTransactions();

const newTransaction = {
    buyerAddress: null,
    sellerAddress: pub,
    price: 40
};

transactions.push(newTransaction);
writeTransactions(transactions);
