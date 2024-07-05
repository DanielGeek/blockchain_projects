require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337, // Usar un chainId diferente al 1 para evitar conflictos
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL,
        blockNumber: 12345678 // Opcional: especificar un número de bloque específico
      }
    }
  },
  solidity: "0.6.6",
};
