# Web3 - Build a Peer-to-Peer Network

For this project, you need to create a distributed peer-to-peer network in the build-a-peer-to-peer-network folder. You are started with some boilerplate code and files, you should not need to change any of the boilerplate code. The node-1 folder represents a node on your network. The files in it will be cloned and used to run all the other nodes on the network. You only need to change the index.js file in there.

To build the project, use the imported WebSocket and WebSocketServer variables to create a Web Socket server in the index.js file that listens for incoming socket connections and creates a socket connection to all the other nodes on the network.

To test if your nodes are connecting to each other, run node clone-node.js to clone your node-1. It will use the next available folder number, and the PORT in its .env file will correspond to that. e.g. The first time you clone a node, it will create a node-2 folder with 4002 set as the PORT. After that, go into each of your node-X folders in their own terminal and run node index.js to start each of the servers. If you want to make changes to your node after that, you can run node delete-nodes.js to delete all the nodes except node-1, then make your changes to node-1, and clone it again.

When you think you are done, run at least three nodes that all connect to each other.

# User Stories:
Your index.js should create a web socket server listening on the port in its .env file.

When a web socket server starts, it should attempt to open a socket connection to all the addresses in the known-peers.json array. Use the predefined knownPeers variable.

Whenever a socket connection to a server is established, it should send a message that is a stringified JSON object of { type: 'HANDSHAKE', data: <array> } to it. data should be an array of addresses that your server is connected to, including the server's own address.

When a server receives the above message, it should attempt to open a socket connection to all the addresses in the data array that it is not already connected to.

You should keep track of all the addresses a server is connected to. You can use the predefined connectedAddresses array.

When a socket disconnects, you should remove it from your connectedAddresses array.

You should keep track of the servers you are attempting to make a connection to so you don't try to make more than one connection to the same server. You can use the predefined attemptingToConnectToAddress variable. Be sure to remove an address after you establish a connection or fail to connect.

A server should never attempt to create a socket connection to its own address.

You should clone your node-1 folder at least two times.

All of your nodes should have the exact same code, with the exception of the .env file.
