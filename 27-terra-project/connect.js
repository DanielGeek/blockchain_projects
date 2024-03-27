const { LCDClient } = require("@terra-money/terra.js");
require("dotenv").config();


const main = async () => {
    // connect to bombay testnet
    const terra = new LCDClient({
        URL: process.env.TERRA_NODE_URL,
        chainID: process.env.TERRA_CHAIN_ID,
    });
    console.log('Successfully connected to Terra node');
    return terra;
}

main().then((resp) => {
    console.log(resp);
}).catch((err) => {
    console.error(err);
});
