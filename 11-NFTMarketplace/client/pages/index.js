import React, { useContext, useEffect } from 'react';

import Style from '../styles/index.module.css';
import {
	HeroSection,
	Service,
	BigNFTSlider,
	Subscribe,
	Title,
	Category,
	Filter,
	NFTCard,
	Collection,
	FollowerTab,
	AudioLive,
	Slider,
	Brand,
	Video,
} from '../components/componentsindex';

// IMPORTING CONTRACT DATA
import { NFTMarketplaceContext } from '@/Context/NFTMarketplaceContext';

const Home = () => {
	const { checkIfWalletConnected } = useContext(NFTMarketplaceContext);

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	return (
		<div className={Style.homePage}>
			<HeroSection />
			<Service />
			<BigNFTSlider />
			<Title
				heading='Audio Collection'
				paragraph='Discover the most outstanding NTFs in all topics of life'
			/>
			<AudioLive />
			<FollowerTab />
			<Slider />
			<Collection />
			<Title
				heading='Featured NFTs'
				paragraph='Discover the most outstanding NTFs in all topics of life'
			/>
			<Filter />
			<NFTCard />
			<Title
				heading='Browse by category'
				paragraph='Explore the NFTs in the most featured categories'
			/>
			<Category />
			<Subscribe />
			<Brand />
			<Video />
		</div>
	);
};

export default Home;
