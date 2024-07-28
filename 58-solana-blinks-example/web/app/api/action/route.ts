import { ActionGetResponse, ActionPostResponse, ActionPostRequest, ACTIONS_CORS_HEADERS } from '@solana/actions';
import { clusterApiUrl, Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

export async function GET(request: Request) {
  const responseBody: ActionGetResponse = {
    icon: "https://pbs.twimg.com/media/GRHA6miWUAA1okz.jpg:large",
    description: "This is Solana demo blink.",
    title: "Do Blick!",
    label: "Click me!",
    links: {
      actions: [
        {
          href: request.url,
          label: "Same action"
        },
        {
          href: `${request.url}?action=another`,
          label: "Another action"
        },
        {
          href: `${request.url}?action=nickname&param={nameParam}&param={amountParam}`,
          label: "With param",
          parameters: [
            {
              name: "nameParam",
              label: "nickname",
              required: true
            },
            {
              name: "amountParam",
              label: "amount",
              required: true
            }
          ]
        },
      ]
    },
    // disabled: true
    // error: {
    //   message: "This blink is not implemented yet!"
    // },
  };

  return Response.json(responseBody, {headers: ACTIONS_CORS_HEADERS});
}

export async function POST(request: Request) {
  const myPubKey = process.env.PUB_KEY || '';
  console.log({myPubKey})
  const requestBody: ActionPostRequest = await request.json();
  const userPubKey = requestBody.account;
  console.log(userPubKey);

  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const param = url.searchParams.get('param');
  console.log(`perfoming action ${action}`);

  const user = new PublicKey(userPubKey);

  const connection = new Connection(clusterApiUrl("mainnet-beta"));
  const ix = SystemProgram.transfer({
    fromPubkey: user,
    toPubkey: new PublicKey(myPubKey),
    lamports: 1
  });

  let name = userPubKey;
  const tx = new Transaction();
  if (action == "another") {
    tx.add(ix);
  } else if (action == "nickname") {
    name = param!
  }
  tx.feePayer = user;
  const bh = (await connection.getLatestBlockhash({commitment: "finalized"})).blockhash;
  console.log(`using blockchain ${bh}`);
  tx.recentBlockhash = bh;
  const serialTX = tx.serialize({requireAllSignatures: false, verifySignatures: false}).toString("base64");
  
  const response: ActionPostResponse = {
    transaction: serialTX,
    message: `Hello ${name}`
  };

  return Response.json(response, {headers: ACTIONS_CORS_HEADERS});
}

export async function OPTIONS(request: Request) {
  return new Response(null, {headers: ACTIONS_CORS_HEADERS});
}
