import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS } from '@solana/actions'
import { Connection, PublicKey } from '@solana/web3.js';

export const OPTIONS = GET;

export async function GET(request: Request) {
    const actionMetadata: ActionGetResponse = {
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkzcqsa9CEKuTEKeQACf23-NFIsd5LCWg9zA&s",
        title: "Vote for your favorite type of peanut butter!",
        description: "Vote between crunchy and smooth peanut butter.",
        label: "Vote",
        links: {
            actions: [
                {
                    label: "Vote for Crunchy",
                    href: "/api/vote?candidate=crunchy",
                    type: 'transaction'
                },
                {
                    label: "Vote for Smooth",
                    href: "/api/vote?candidate=smooth",
                    type: 'transaction'
                },
            ]
        }
    };

    return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if (candidate != "crunchy" && candidate != "smooth") {
        return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const body: ActionPostRequest = await request.json();
    let voter;

    try {
        voter = new PublicKey(body.account);
    } catch (error) {
        return new Response("Invalid account", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }
}
