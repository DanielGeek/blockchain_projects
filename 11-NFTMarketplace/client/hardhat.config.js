require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

const account = process.env.METAMASK_PRIVATE_KEY;
console.log({account})

module.exports = {
	defaultNetwork: 'mumbai',
	networks: {
		mumbai: {
			url: 'https://rpc-mumbai.maticvigil.com',
			accounts: [
				account,
			],
			chainId: 80001,
			gas: 2100000,
			gasPrice: 8000000000,
		},
	},
	solidity: '0.8.4',
};
