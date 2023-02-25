import '@/styles/globals.css';

import { NavBar } from '../components/componentsindex';

export const MyApp = ({ Component, pageProps }) => (
	<div>
		<NavBar />
		<Component {...pageProps} />
	</div>
);

export default MyApp;
