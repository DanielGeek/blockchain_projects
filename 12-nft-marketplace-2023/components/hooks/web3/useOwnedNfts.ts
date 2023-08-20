import { CryptoHookFactory } from "@_types/hooks";
import { Nft } from "@_types/nft";
import { ethers } from "ethers";
import useSWR from "swr";
import { PINATA_GATEWAY_TOKEN } from "@providers/web3/utils";

type UseOwnedNftsResponse = {}

type OwnedNftsHookFactory = CryptoHookFactory<Nft[], UseOwnedNftsResponse>

export type UseOwnedNftsHook = ReturnType<OwnedNftsHookFactory>

// deps -> provider, ethereum, contract (web3State)
export const hookFactory: OwnedNftsHookFactory = ({contract}) => () => {
    const { data, ...swr } = useSWR(
        contract ? "web3/useOwnedNfts" : null,
        async () => {
            const nfts = [] as Nft[];
            const coreNfts = await contract!.getOwnedNfts();

            for (let i = 0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(`${tokenURI}?pinataGatewayToken=${PINATA_GATEWAY_TOKEN}`);
                const meta = await metaRes.json();

                nfts.push({
                    price: parseFloat(ethers.utils.formatEther(item.price)),
                    tokenId: item.tokenId.toNumber(),
                    creator: item.creator,
                    isListed: item.isListed,
                    meta
                });
                
            }
            
            return nfts;
        }
    )

    return {
        ...swr,
        data: data || [],
    };
}
