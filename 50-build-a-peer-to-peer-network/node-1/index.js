import { getTransactions, writeTransactions } from './blockchain-helpers.js';
import { getKnownPeerAddresses } from './network-helpers.js';

import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
dotenv.config();

const knownPeers = getKnownPeerAddresses();
const MY_PORT = process.env.PORT;
const MY_ADDRESS = `ws://localhost:${MY_PORT}`;
const transactions = getTransactions();
const openedSockets = [];
const connectedAddresses = [];
const attemptingToConnectAddresses = [];
// Add your code below

const myServer = new WebSocketServer({ port: MY_PORT });

myServer.on('connection', socket => {
    console.log('connection recieved');

    socket.on('message', dataString => {
        console.log('message received: ' + dataString);
    });
});
