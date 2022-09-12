require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    "version": "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      accounts: [process.env.META_MASK_PRIVATE_KEY] // viene de la configuración de la billetera
    }
  },
  etherscan: {
    apiKey:process.env.ETHERSCAN_API_KEY
  }
};
