const anchor = require("@coral-xyz/anchor");
const Program = require("@coral-xyz/anchor");

const main = async () => {
    console.log("Starting test...");
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Gifportal;

    const tx = await program.rpc.startStuffOff();
    console.log("Your transaction signature ", tx);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
runMain();
