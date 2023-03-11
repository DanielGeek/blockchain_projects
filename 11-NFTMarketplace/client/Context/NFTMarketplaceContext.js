import React, { useState, useEffect, useContext } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

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
const connectiongWithSmartContract = async () => {
	try {
		const web3Modal = new Web3Modal();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);
		return contract;
	} catch (error) {
		console.log('Something went wrong connecting with contract ', error);
	}
};

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvier = ({ children }) => {
	const titleData = 'Discover, collect and sell NFTs';

	const [currentAccount, setCurrentAccount] = useState('');

	// CHECK IF WALLET IS CONNECTED
	const checkIfWalletConnected = async () => {
		try {
			if (!window.ethereum) return console.log('Install MetaMask');

			const accounts = await window.ethereum.request({
				method: 'eth_accounts',
			});

			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log('No account found');
			}
		} catch (error) {
			console.log('Something wrong while connecting to wallet ', error);
		}
	};

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	// CONNECT WALLET FUNCTION
	const connectWallet = async () => {
		try {
			if (!window.ethereum) return console.log('Install MetaMask');

			const accounts = await window.ethereum.request({
				method: 'eth_requestAccount',
			});

			setCurrentAccount(accounts[0]);
			window.location.reload();
		} catch (error) {
			console.log('Error while connecting to wallet');
		}
	};

	// UPLOAD TO IPFS FUNCTION
	const uploadToIPFS = async (file) => {
		try {
			const added = await client.add({ content: file });
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;
			return url;
		} catch (error) {
			console.log('Error Uploading to IPFS');
		}
	};

	// CREATE NFT FUNCTION
	const createNFT = async (formInput, fileUrl, router) => {
		const { name, description, price } = formInput;

		if (!name || !description || !price || !fileUrl)
			return console.log('Data is missing');

		const data = JSON.stringify({ name, description, image: fileUrl });

		try {
			const added = await client.add(data);
			const url = `https://ipfs.infura.io/ipfs/${added.path}`;

			await createSale(url, price);
		} catch (error) {
			console.log('Error while adding data to ipfs ', error);
		}
	};

	// createSale FUNCTION
	const createSale = async (url, formInputPrice, isReselling, id) => {
		try {
			const price = ethers.utils.parseUnits(formInputPrice, 'ether');
			const contract = connectiongWithSmartContract();

			const listingPrice = await contract.getListingPrice();

			const transaction = !isReselling
				? await contract.createToken(url, price, {
						value: listingPrice.toString(),
				  })
				: await contract.reSellToken(url, price, {
						value: listingPrice.toString(),
				  });
			await transaction.wait();
		} catch (error) {
			console.log('Error while creating sale');
		}
	};

	// FETCHNFTS FUNCTION
	const fetchNFTs = async () => {
		try {
			const provider = new ethers.provider.JsonRpcProvider();
			const contract = fetchContract(provider);

			const data = await contract.fetchMarketItem();

			const items = await Promise.all(
				data.map(
					async ({ tokenId, seller, owner, price: unformattedPrice }) => {
						const tokenURI = await contract.tokenURI(tokenId);

						const {
							data: { image, name, description },
						} = await axios.get(tokenURI);
						const price = ethers.utils.formatUnits(
							unformattedPrice.toString(),
							'ether'
						);

						return {
							price,
							tokenId: tokenId.toNumber(),
							seller,
							owner,
							image,
							name,
							description,
							tokenURI,
						};
					}
				)
			);
			return items;
		} catch (error) {
			console.log('Error while fetching NFTs');
		}
	};

	return (
		<NFTMarketplaceContext.Provider
			value={{ connectWallet, uploadToIPFS, createNFT, fetchNFTs, titleData }}
		>
			{children}
		</NFTMarketplaceContext.Provider>
	);
};
