import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@solana/actions'


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
