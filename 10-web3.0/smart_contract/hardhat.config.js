
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      // you alchemy api key
      url: 'https://eth-ropsten.alchemyapi.io/v2/ixDb2yLWE7AOpbO-42WiOK7C5o6oN3RL',
      // your meta mask private key
      accounts: [ 'b137d74a3e730a93cbe3b39cd70159b59847ac69cfbc257838374f21b960effc' ]
    }
  }
}