/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: [
			'spozz-nft-marketplace.infura-ipfs.io',
			'daniel-nft-marketplace.infura-ipfs.io',
			'infura-ipfs.io',
		],
	},
};

module.exports = nextConfig;
