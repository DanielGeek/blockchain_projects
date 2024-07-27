import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, MEMO_PROGRAM_ID } from '@solana/actions'
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';


export const GET = (req: Request) => {

  const payload: ActionGetResponse = {
    icon: new URL("/solana_devs.jpg", new URL(req.url).origin).toString(),
    label: "Send Memo",
    description: "This is a super simple Action",
    title: "Memo Demo",
  };

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS
  });
}

export const OPTIONS = GET;

export const POST = async (req: Request) => {
  try {
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (error) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const transaction = new Transaction();

    transaction.add(
      // note: `createPostResponse` requires at least 1 non-memo instruction
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1000,
      }),
      new TransactionInstruction({
        programId: new PublicKey(MEMO_PROGRAM_ID),
        data: Buffer.from("this is a simple memo message", "utf-8"),
        keys: [],
      }),
    );

    transaction.feePayer = account;

    const connection = new Connection(clusterApiUrl("devnet"));
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
      },
      // signers: []
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  } catch (error) {
    return Response.json("An unknown error occurred", { status: 400 });
  }
};
