import '@/styles/globals.css';

import { NavBar, Footer } from '../components/componentsindex';
import { NFTMarketplaceProvier } from '@/Context/NFTMarketplaceContext';

export const MyApp = ({ Component, pageProps }) => (
	<div>
		<NFTMarketplaceProvier>
			<NavBar />
			<Component {...pageProps} />
			<Footer />
		</NFTMarketplaceProvier>
	</div>
);

export default MyApp;
