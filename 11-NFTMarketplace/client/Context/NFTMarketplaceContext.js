import React, { useState, useEffect, useContext } from 'react';
import Wenb3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

// INTERNAL IMPORT
import { nftMarketplaceAddress, NFTMarketplaceABI } from './constants';

// FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
	new ethers.Contract(
		nftMarketplaceAddress,
		NFTMarketplaceABI,
		signerOrProvider
	);

// CONNECTION WITH SMART CONTRACT

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvier = ({ children }) => {
	const titleData = 'Discover, collect and sell NFTs';

	return (
		<NFTMarketplaceContext.Provider value={{ titleData }}>
			{children}
		</NFTMarketplaceContext.Provider>
	);
};
