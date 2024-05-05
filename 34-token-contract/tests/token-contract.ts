import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenContract } from "../target/types/token_contract";
import {
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createInitializeMintInstruction,
} from "@solana/spl-token";
import { assert } from "chai";

describe("token-contract", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.TokenContract as Program<TokenContract>;
    const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    let associatedTokenAccount = undefined;

    // Utilidad para verificar el saldo antes de realizar operaciones
    async function checkBalanceAndExecute(transaction, accounts, minBalance = 0.1) {
        const provider = anchor.AnchorProvider.env();
        const key = provider.wallet.publicKey;
        const balance = await provider.connection.getBalance(key);
        const balanceInSOL = balance / anchor.web3.LAMPORTS_PER_SOL;

        console.log(`Current balance is ${balanceInSOL} SOL`);

        if (balanceInSOL < minBalance) {
            console.error("Not enough SOL to perform the transaction.");
            assert.fail("Insufficient SOL to perform the transaction.");
        } else {
            console.log("Sufficient SOL, proceeding with the transaction...");
            const result = await provider.sendAndConfirm(transaction, accounts);
            console.log("Transaction confirmed:", result);
            return result;
        }
    }

    it("Mint a token", async () => {
        const key = anchor.AnchorProvider.env().wallet.publicKey;
        const lamports = await program.provider.connection.getMinimumBalanceForRentExemption(MINT_SIZE);

        associatedTokenAccount = await getAssociatedTokenAddress(mintKey.publicKey, key);
        const mint_tx = new anchor.web3.Transaction().add(
            anchor.web3.SystemProgram.createAccount({
                fromPubkey: key,
                newAccountPubkey: mintKey.publicKey,
                space: MINT_SIZE,
                programId: TOKEN_PROGRAM_ID,
                lamports,
            }),
            createInitializeMintInstruction(mintKey.publicKey, 0, key, key),
            createAssociatedTokenAccountInstruction(key, associatedTokenAccount, key, mintKey.publicKey)
        );

        await checkBalanceAndExecute(mint_tx, [mintKey]);

        // Executes our code to mint our token into our specified ATA
        await program.methods.mintToken().accounts({
            mint: mintKey.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
            tokenAccount: associatedTokenAccount,
            payer: key,
        }).rpc();

        const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAmount.amount;
        assert.equal(minted, 10);
    });

    it("Transfer token", async () => {
        const myWallet = anchor.AnchorProvider.env().wallet.publicKey;
        const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
        const toATA = await getAssociatedTokenAddress(mintKey.publicKey, toWallet.publicKey);

        const transfer_tx = new anchor.web3.Transaction().add(
            createAssociatedTokenAccountInstruction(myWallet, toATA, toWallet.publicKey, mintKey.publicKey)
        );

        await checkBalanceAndExecute(transfer_tx, []);

        await program.methods.transferToken().accounts({
            tokenProgram: TOKEN_PROGRAM_ID,
            from: associatedTokenAccount,
            signer: myWallet,
            to: toATA,
        }).rpc();

        const minted = (await program.provider.connection.getParsedAccountInfo(associatedTokenAccount)).value.data.parsed.info.tokenAmount.amount;
        assert.equal(minted, 5);
    });
});
