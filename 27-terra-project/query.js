const { LCDClient, MnemonicKey } = require("@terra-money/terra.js");
require("dotenv").config();


const main = async () => {
    // connect to bombay testnet
    const terra = new LCDClient({
        URL: process.env.TERRA_NODE_URL,
        chainID: process.env.TERRA_CHAIN_ID,
    });
    const mk = new MnemonicKey({
        mnemonic: process.env.MNEMONIC,
    });

    // const nodeInfo = await terra.tendermint.nodeInfo();
    // console.log("nodeInfo: ", nodeInfo);

    // const validatorSet = await terra.tendermint.validatorSet();
    // console.log("validatorSet", validatorSet);

    // const accountInfo = await terra.auth.accountInfo(mk.accAddress);
    // console.log("accountInfo: ", accountInfo);

    // const exchangeRates = await terra.oracle.exchangeRates();
    // console.log("exchangeRates: ", exchangeRates);

    const proposals = await terra.gov.proposals();
    console.log("proposals: ", proposals);
}

main().then((resp) => {
    console.log(resp);
}).catch((err) => {
    console.error(err);
});
