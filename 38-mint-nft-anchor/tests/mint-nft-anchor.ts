import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { MintNftAnchor } from "../target/types/mint_nft_anchor";

describe("mint-nft-anchor", () => {

    const testNftTitle = "Youtube NFT!";
    const testNftSymbol = "TUBE";
    const testNftUri = "";

    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.MintNftAnchor as Program<MintNftAnchor>;

    it("Is initialized!", async () => {
        // Add your test here.
        const tx = await program.methods.initialize().rpc();
        console.log("Your transaction signature", tx);
    });
});
