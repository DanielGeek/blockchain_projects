import { withIronSession } from "next-iron-session";
import contract from "../../public/contracts/NftMarket.json";

type NETWORK = typeof contract.networks;

type ATTRIBUTE = { trait_type: string | any[]; value: string | any[]; }

const targetNetwork = process.env.NEXT_PUBLIC_NETWORK_ID as keyof NETWORK;

export const contractAddress = contract["networks"][targetNetwork]["address"];

export function withSession(handler: any) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD as string,
    cookieName: "nft-auth-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production" ? true : false
    }
  })
}

export const isValidAttribute = (attribute: ATTRIBUTE) => {
  return typeof attribute.trait_type === "string" &&
          typeof attribute.value === "string" &&
          attribute.trait_type.length > 0 &&
          attribute.value.length > 0;
};
