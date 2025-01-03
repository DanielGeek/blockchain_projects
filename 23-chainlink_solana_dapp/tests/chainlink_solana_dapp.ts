import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChainlinkSolanaDapp } from "../target/types/chainlink_solana_dapp";

interface ResultAccount {
  value: anchor.BN; // or number, depending on how you wish to handle i128 in JS
}

const CHAINLINK_FEED = "HgTtcbcmp5BeThax5AU8vg4VwK79qAvAKKFMs8txMLW6";
const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";

describe("chainlink_solana_dapp", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.ChainlinkSolanaDapp as Program<ChainlinkSolanaDapp>;

  it("Queries SOL/USD Price Feed", async () => {
    const resultAccount = anchor.web3.Keypair.generate();

    await program.rpc.execute({
      accounts: {
        resultAccount: resultAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        chainlinkFeed: CHAINLINK_FEED,
        chainlinkProgram: CHAINLINK_PROGRAM_ID
      },
      signers: [resultAccount],
    });
    const latestPrice = await program.account.resultAccount.fetch(
      resultAccount.publicKey
    );
    console.log("Price is: " + latestPrice.value.toNumber() / 10000000);
  });
});
