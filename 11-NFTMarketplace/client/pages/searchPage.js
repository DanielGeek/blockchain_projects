import React from 'react';

//INTRNAL IMPORT
import Style from '../styles/searchPage.module.css';
import { Slider, Brand } from '../components/componentsindex';
import { SearchBar } from '../SearchPage/searchBarIndex';
import { Filter } from '../components/componentsindex';

import { NFTCardTwo, Banner } from '../collectionPage/collectionIndex';
import images from '../img';

const searchPage = () => {
	const collectionArray = [
		{
			title: 'Hello NFT',
			id: 1,
			name: 'Daniel Ángel',
			collection: 'GYm',
			price: '00664 ETH',
			like: 243,
			image: images.user1,
			nftImage: images.nft_image_1,
			time: {
				days: 21,
				hours: 40,
				minutes: 81,
				seconds: 15,
			},
		},
		{
			title: 'Buddy NFT',
			id: 2,
			name: 'Elizabeth Ángel',
			collection: 'Home',
			price: '0000004 ETH',
			like: 243,
			image: images.user2,
			nftImage: images.nft_image_2,
			time: {
				days: 77,
				hours: 11,
				minutes: 21,
				seconds: 45,
			},
		},
		{
			title: 'Gym NFT',
			id: 3,
			name: 'Jessica Baettig',
			collection: 'GYm',
			price: '0000064 ETH',
			like: 243,
			image: images.user3,
			nftImage: images.nft_image_3,
			time: {
				days: 37,
				hours: 20,
				minutes: 11,
				seconds: 55,
			},
		},
		{
			title: 'Home NFT',
			id: 4,
			name: 'Ruth Ángel',
			collection: 'GYm',
			price: '4664 ETH',
			like: 243,
			image: images.user4,
			nftImage: images.nft_image_1,
			time: {
				days: 87,
				hours: 29,
				minutes: 10,
				seconds: 15,
			},
		},
	];
	return (
		<div className={Style.searchPage}>
			<Banner bannerImage={images.creatorbackground2} />
			<SearchBar />
			<Filter />
			<NFTCardTwo NFTData={collectionArray} />
			<Slider />
			<Brand />
		</div>
	);
};

export default searchPage;
