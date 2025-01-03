import { FunctionComponent } from "react";
import { useListedNfts } from "@hooks/web3";
import NftItem from "../item";
import { Spinner } from "@ui";

const NftList: FunctionComponent = () => {
  const { nfts } = useListedNfts();

  if (nfts.isLoading) {
    return <Spinner /> 
  }

  return (
    <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
      { nfts.data?.map( nft => 
        <div key={nft.meta.image} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
          <NftItem
            item={nft}
            buyNft={nfts.buyNft}
          />
        </div>
      )}
    </div>
  )
}

export default NftList;