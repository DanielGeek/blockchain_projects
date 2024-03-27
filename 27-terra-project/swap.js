const { LCDClient, MnemonicKey, MsgSwap, isTxError, Coin } = require("@terra-money/terra.js");
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

    const msg = new MsgSwap(
        wallet.key.accAddress,
        new Coin("uluna", "1000000"),
        "uusd"
    );
    const tx = await wallet.createAndSignTx({
        msgs: [msg],
        memo: "Hello! This is my first transaction!",
    });

    const txHash = await terra.tx.hash(tx);
    console.log("txHash: ", txHash);

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
