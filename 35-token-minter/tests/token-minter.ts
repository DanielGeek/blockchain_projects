import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenMinter } from "../target/types/token_minter";
import assert from "assert";

describe("token-minter", () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.TokenMinter as Program<TokenMinter>;
    let mint = null;
    let metadata = null;
    let payer = null;

    it("Initializes token with metadata", async () => {
        // Generate a new keypair for mint
        mint = anchor.web3.Keypair.generate();
        // Use the provider's wallet as payer
        payer = anchor.web3.Keypair.generate();
        metadata = anchor.web3.Keypair.generate();

        // Parameters for initialization
        const initTokenParams = {
            name: "TestToken",
            symbol: "TTK",
            uri: "https://example.com/token-metadata",
            decimals: 0,
        };
        const TOKEN_METADATA_PROGRAM_ID = "5oajiRspfB6C5ogVj6F58aLav2pyG921M83MjVRrRnqC";

        // await program.provider.connection.confirmTransaction(
        //     await program.provider.connection.requestAirdrop(payer.publicKey, 1000000000),
        //     "confirmed"
        // );


        const tx = await program.methods.initToken(initTokenParams)
            .accounts({
                metadata: metadata.publicKey,  // Usa la nueva clave pública generada
                mint: mint.publicKey,
                payer: payer.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            })
            .signers([mint, metadata, payer])  // Asegúrate de incluir metadata en los signers si es necesario
            .rpc();
        console.log("Transaction signature", tx);

        // Check if the token was initialized correctly
        const mintAccount = await program.account.mint.fetch(mint.publicKey);
        assert.ok(mintAccount.mintAuthority.equals(payer.publicKey));
        assert.strictEqual(mintAccount.decimals, 0);
    });
});
