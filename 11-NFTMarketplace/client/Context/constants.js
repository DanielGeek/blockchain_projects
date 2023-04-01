// it can find in the folder artifacts/contracts, but we move it to the folder Context
import nftMarketplace from './NFTMarketplace.json?raw';
import nftMarketplaceBin from './NFTMarketplaceBIN.json?raw';

// deployed contract Address npx hardhat run scripts/deploy.js --network localhost
// npx hardhat run --network mumbai deploy.js
export const nftMarketplaceAddress =
	'0x606B3A4AF217532060B631c493d039d50F036416';
export const NFTMarketplaceABI = nftMarketplace.abi;
export const NFTMarketplaceBIN = nftMarketplaceBin;
