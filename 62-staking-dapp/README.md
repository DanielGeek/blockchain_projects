# Token Staking DApp with Earn Rewards on Any Blockchain 


[Live Demo](https://strong-starship-c72e35.netlify.app/)

Token Staking DApp & Earn Rewards with ICO using Next.js, WAGMI, Solidity and Deploy on Any Blockchain!

Decentralized application using Next.js, WAGMI, and Solidity on any blockchain.

## Project Overview

![alt text](https://www.daulathussain.com/wp-content/uploads/2024/08/Create-a-Token-Staking-DApp-Earn-Rewards-on-Any-Blockchain.jpg)

Kindly follow the following Instructions to run the project in your system and install the necessary requirements


#### Setup

#### Install Vs Code Editor

```
  URL: https://code.visualstudio.com/download
  GET: VsCode Editor
```

#### NodeJs & NPM Version

```
  URL: https://nodejs.org/en/download
  NodeJs: v18.17.1 || LATEST VERSION
  NPM: 8.19.2 || LATEST VERSION
```

#### RPU URL PROVIDER

```
  NAME: ANKR.COM
  URL: https://www.ankr.com/rpc/
```

#### FORMSPREE

```
  # FORMSPREE
  URL: https://formspree.io/
```

#### Google Cloud Web3

Google Cloud Web3 will provide you with some free test faucets which you can transfer to your wallet address for deploying the contract

```
  Get: Free Test Faucets
  URL : https://cloud.google.com/application/web3/faucet/ethereum
```

#### RemixID

We are using RemixID for deploying the contract and generation of the ABI in the project, but you can use any other tools like Hardhat, etc.

```
  OPEN: RemixID
  URL: https://remix-project.org
```

#### PACKAGES

```
  {
  "name": "staking-dapp",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@formspree/react": "^2.5.1",
    "@headlessui/react": "^1.6.6",
    "@heroicons/react": "^1.0.6",
    "@next/font": "13.4.13",
    "@nextui-org/react": "^1.0.0-beta.9",
    "@rainbow-me/rainbowkit": "^0.4.6",
    "ethers": "^5.7.2",
    "next": "13.4.13",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-icons": "^4.10.1",
    "wagmi": "^0.6.4"
  }
}

```

#### ENVIROMENT VARIABLES

```
# STAKING DAPP ADDRESS
NEXT_PUBLIC_STAKING_DAPP =
NEXT_PUBLIC_TOKEN_ICO =

# TOKEN ADDRESS
NEXT_PUBLIC_DEPOSIT_TOKEN =
NEXT_PUBLIC_REWARD_TOKEN =
NEXT_PUBLIC_TOKEN_LOGO = https://gateway.pinata.cloud/ipfs/QmXTwJ2GgxbWET7uxyKaidT2isPF83YhQP77acskvZbCGu

# ADMIN
NEXT_PUBLIC_ADMIN_ADDRESS =


# CURRANY
NEXT_PUBLIC_CURRENCY = ETH
NEXT_PUBLIC_CHAIN_ID = 17000
NEXT_PUBLIC_NETWORK_NAME = Holesky
NEXT_PUBLIC_NETWORK_DECIMALS = 18
NEXT_PUBLIC_NETWORK = holesky

# RPC URLS

NEXT_PUBLIC_HOLESKY_RPC_URL = https://rpc.ankr.com/eth_holesky
NEXT_PUBLIC_ADDRESS_EXPLORER = https://holesky.etherscan.io/address/
NEXT_PUBLIC_TOKEN_EXPLORER = https://holesky.etherscan.io/token/
NEXT_PUBLIC_EXPLORER = https://holesky.etherscan.io/

# FORMSPREE
NEXT_PUBLIC_FORMSPREE_API =

```
### Deployed Staking Contract Address
[0x3DB4b32D210a0530a39053Ecb556aADE67510ec7](https://holesky.etherscan.io/address/0x3db4b32d210a0530a39053ecb556aade67510ec7)


### Deployed TBC Token (TBC)
[0x9e781d74d30afadf292fbe746a3dbc71280427bc](https://holesky.etherscan.io/token/0x9e781d74d30afadf292fbe746a3dbc71280427bc)


### Deployed TokenICO
[0xDBeCeDa642c27AA1a34c3E3fC2F2Fe57710D40bf](https://holesky.etherscan.io/address/0xDBeCeDa642c27AA1a34c3E3fC2F2Fe57710D40bf)
