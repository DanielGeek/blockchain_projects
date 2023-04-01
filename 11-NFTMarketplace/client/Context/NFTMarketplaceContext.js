import React, { useState, useEffect, useContext } from 'react';
import Wenb3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import axios from 'axios';
import { create as ipfsHttpClient } from 'ipfs-http-client';

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecretKey = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET_KEY;

const auth = `Basic ${Buffer.from(`${projectId}:${projectSecretKey}`).toString(
	'base64'
)}`;

// const subdomain = 'https://daniel-nft-marketplace.infura-ipfs.io';
const subdomain = process.env.NEXT_PUBLIC_INFURA_SUBDOMAIN;

const client = ipfsHttpClient({
	host: 'infura-ipfs.io',
	port: 5001,
	protocol: 'https',
	headers: {
		authorization: auth,
	},
});

// INTERNAL IMPORT
import {
	nftMarketplaceAddress,
	NFTMarketplaceABI,
	NFTMarketplaceBIN,
} from './constants';

export const NFTMarketplaceContext = React.createContext();

export const NFTMarketplaceProvier = ({ children }) => {
	const titleData = 'Discover, collect and sell NFTs';
	const [address, setAddress] = useState('');
	const [error, setError] = useState('');
	const [openError, setOpenError] = useState(false);
	const [currentAccount, setCurrentAccount] = useState('');
	const router = useRouter();

	const deploy = async (name = 'Daniel nft', symbol = 'dnft') => {
		console.log('entro');
		const provider = new ethers.providers.Web3Provider(ethereum);
		console.log({ provider });
		const signer = provider.getSigner();
		console.log({ signer });
		const factory = new ethers.ContractFactory(
			NFTMarketplaceABI,
			NFTMarketplaceBIN,
			signer
		);

		console.log({ factory });
		const contract = await factory.deploy();
		console.log({ contract });
		const doc = {
			chain: await signer.getChainId(),
			address: contract.address.toLowerCase(),
			owner: (await signer.getAddress()).toLowerCase(),
			name: name,
			symbol: symbol,
			t: 1,
			contractURI: null,
		};

		console.log('contract ', contract);
		console.log('doc ', doc);
		console.log(doc.address);
		setAddress(doc.address);

		return contract;
	};

	// FETCHING SMART CONTRACT
	const fetchContract = (signerOrProvider) => {
		return new ethers.Contract(
			// address,
			nftMarketplaceAddress,
			NFTMarketplaceABI,
			signerOrProvider
		);
	};

	// CONNECTION WITH SMART CONTRACT
	const connectingWithSmartContract = async () => {
		console.log({ address });
		try {
			const web3Modal = new Wenb3Modal();
			const connection = await web3Modal.connect();
			const provider = new ethers.providers.Web3Provider(connection);
			const signer = provider.getSigner();
			const contract = fetchContract(signer);
			return contract;
		} catch (error) {
			setOpenError(true);
			setError('Something went wrong while connecting with contract ', error);
		}
	};

	// CHECK IF WALLET IS CONNECTED
	const checkIfWalletConnected = async () => {
		try {
			if (!window.ethereum)
				return setOpenError(true), setError('Install MetaMask');

			const accounts = await window.ethereum.request({
				method: 'eth_accounts',
			});

			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				setOpenError(true);
				setError('No account found');
			}
		} catch (error) {
			setOpenError(true);
			setError('Something wrong while connecting to wallet ', error);
		}
	};

	useEffect(() => {
		checkIfWalletConnected();
		connectingWithSmartContract();
	}, []);

	// CONNECT WALLET FUNCTION
	const connectWallet = async () => {
		try {
			if (!window.ethereum)
				return setOpenError(true), setError('Install MetaMask');

			const accounts = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});

			setCurrentAccount(accounts[0]);
			// window.location.reload();
		} catch (error) {
			setOpenError(true);
			setError('Error while connecting to wallet ', error);
		}
	};

	// UPLOAD TO IPFS FUNCTION
	const uploadToIPFS = async (file) => {
		try {
			const added = await client.add({ content: file });
			const url = `${subdomain}/ipfs/${added.path}`;
			return url;
		} catch (error) {
			setOpenError(true);
			setError('Error Uploading to IPFS ', error);
		}
	};

	// CREATE NFT FUNCTION
	const createNFT = async (name, price, image, description, router) => {
		if (!name || !description || !price || !image)
			return setOpenError(true), setError('Data is missing');

		const data = JSON.stringify({ name, description, image });

		try {
			const added = await client.add(data);
			const url = `${subdomain}/ipfs/${added.path}`;

			await createSale(url, price);
			router.push('/searchPage');
		} catch (error) {
			setOpenError(true);
			setError('Error while adding data to ipfs ', error);
			console.log('Error while adding data to ipfs ', error);
		}
	};

	// createSale FUNCTION
	const createSale = async (url, formInputPrice, isReselling, id) => {
		try {
			const price = ethers.utils.parseUnits(formInputPrice, 'ether');
			const contract = await connectingWithSmartContract();
			console.log({ contract });
			const listingPrice = await contract.getListingPrice();

			const transaction = !isReselling
				? await contract.createToken(url, price, {
						value: listingPrice.toString(),
				  })
				: await contract.resellToken(id, price, {
						value: listingPrice.toString(),
				  });

			await transaction.wait();

			console.log(transaction);
		} catch (error) {
			setError('error while creating sale, ', error);
			setOpenError(true);
			console.log(error);
		}
	};

	// FETCHNFTS FUNCTION
	const fetchNFTs = async () => {
		try {
			// const provider = new ethers.providers.JsonRpcProvider(); // with localhost
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const contract = fetchContract(provider);

			const data = await contract.fetchMarketItems();
			const items = await Promise.all(
				data.map(
					async ({ tokenId, seller, owner, price: unformattedPrice }) => {
						const tokenURI = await contract.tokenURI(tokenId);
						console.log({ tokenURI });
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

			console.log(items);
			return items;
		} catch (error) {
			setError('Error while fetching NFTs ', error);
			setOpenError(true);
			console.log('Error while fetching NFTs ', error);
		}
	};

	useEffect(() => {
		fetchNFTs();
	}, []);

	// FETCHING MY NFT OR LISTED NFTs
	const fetchMyNFTsOrListedNFTs = async (type) => {
		try {
			if (currentAccount) {
				const contract = await connectingWithSmartContract();

				const data =
					type == 'fetchItemsListed'
						? await contract.fetchItemsListed()
						: await contract.fetchMyNFTs();

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
			}
		} catch (error) {
			setError('Error while fetching listed NFTs ', error);
			setOpenError(true);
		}
	};

	useEffect(() => {
		fetchMyNFTsOrListedNFTs();
	}, []);

	// BUY NFTs FUNCTION
	const buyNFT = async (nft) => {
		try {
			const contract = await connectingWithSmartContract();
			const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

			const transaction = await contract.createMarketSale(nft.tokenId, {
				value: price,
			});
			await transaction.wait();
			router.push('/author');
		} catch (error) {
			setError('Error while buying NFT ', error);
			setOpenError(true);
			console.log('Error while buying NFT', error);
		}
	};

	const addAccountsChangedListener = () => {
		window.ethereum.on('accountsChanged', () => {
			console.log('cambio en context');
			checkIfWalletConnected();
		});

		window.ethereum.on('chainChanged', () => {
			console.log('cambio en context');
			checkIfWalletConnected();
		});
	};

	useEffect(() => {
		addAccountsChangedListener();
	}, []);

	return (
		<NFTMarketplaceContext.Provider
			value={{
				deploy,
				checkIfWalletConnected,
				connectWallet,
				uploadToIPFS,
				createNFT,
				fetchNFTs,
				fetchMyNFTsOrListedNFTs,
				buyNFT,
				createSale,
				currentAccount,
				titleData,
				setOpenError,
				openError,
				error,
			}}
		>
			{children}
		</NFTMarketplaceContext.Provider>
	);
};
