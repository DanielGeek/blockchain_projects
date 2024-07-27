import { ActionGetResponse, ActionPostRequest, ActionPostResponse } from '@solana/actions';


export async function GET(request: Request) {
  const response: ActionGetResponse = {
    icon: "https://pbs.twimg.com/media/GRHA6miWUAA1okz.jpg:large",
    description: "This is Solana demo blink.",
    title: "Do Blick!",
    label: "Click me!",
    error: {
      message: "This blink is not implemented yet!"
    },
  };

  return Response.json(response)
}

export async function POST(request: Request) {

  const postRequest: ActionPostRequest = await request.json();
  const userPubKey = postRequest.account;
  console.log(userPubKey);

  const response: ActionPostResponse = {
    transaction: "",
    message: `Hello ${userPubKey}`
  };

  return Response.json(response);
}
