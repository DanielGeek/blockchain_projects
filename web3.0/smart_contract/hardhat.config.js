
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      // you alchemy api key
      url: '',
      // your meta mask private key
      accounts: [ '' ]
    }
  }
}