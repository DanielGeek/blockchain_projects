const { LCDClient, MnemonicKey, MsgSend, isTxError } = require("@terra-money/terra.js");
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

    const wallet = terra.wallet(mk);
    const toAddress = "terra1h8ljdmae7lx05kjj79c9ekscwsyjd3yr8wyvdn";

    const msg = new MsgSend(wallet.key.accAddress, toAddress, {
        // This send 1 LUNA token
        uluna: 1 * 1000000,
    });
    const tx = await wallet.createAndSignTx({
        msgs: [msg],
        memo: "Hello! This is my first transaction!",
    });

    const txResult = await terra.tx.broadcast(tx);

    if (isTxError(txResult)) {
        console.error(txResult);
        throw new Error();
    }

    console.log("logs:", txResult.logs);
};

main().then((resp) => {
    console.log(resp);
}).catch((err) => {
    console.error(err);
});
