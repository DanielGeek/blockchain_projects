const { LCDClient, MnemonicKey } = require("@terra-money/terra.js");
require("dotenv").config();


const main = async () => {
    // connect to bombay testnet
    const terra = new LCDClient({
        URL: process.env.TERRA_NODE_URL,
        chainID: process.env.TERRA_CHAIN_ID,
    });
    const mk = new MnemonicKey();

    console.log("address:", mk.accAddress);
    console.log("mnemonic:", mk.mnemonic);
}

main().then((resp) => {
    console.log(resp);
}).catch((err) => {
    console.error(err);
});
