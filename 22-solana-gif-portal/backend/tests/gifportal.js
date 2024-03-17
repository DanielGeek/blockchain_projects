const anchor = require("@coral-xyz/anchor");
const Program = require("@coral-xyz/anchor");

const main = async () => {
    console.log("Starting test...");
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.Gifportal;
    const baseAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.startStuffOff({
        accounts: {
            baseAccount: baseAccount.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [baseAccount]
    });

    console.log("Your transaction signature ", tx);

    let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Gif Count ", account.totalGifs.toString());

    await program.rpc.addGif({
        accounts: {
            baseAccount: baseAccount.publicKey,
        },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("Gif Count ", account.totalGifs.toString());
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
