// it can find in the folder artifacts/contracts, but we move it to the folder Context
import nftMarketplace from './NFTMarketplace.json?raw';
import nftMarketplaceBin from './NFTMarketplaceBIN.json?raw';

// deployed contract Address npx hardhat run scripts/deploy.js --network localhost
export const nftMarketplaceAddress =
	'0x5FbDB2315678afecb367f032d93F642f64180aa3';
export const NFTMarketplaceABI = nftMarketplace.abi;
export const NFTMarketplaceBIN = nftMarketplaceBin;
