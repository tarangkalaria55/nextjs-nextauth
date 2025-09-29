import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	transpilePackages: ['@t3-oss/env-nextjs', '@t3-oss/env-core'],
	async redirects() {
		return [
			{
				source: '/auth',
				destination: '/auth/signin',
				permanent: true,
			},
			{
				source: '/',
				destination: '/dashboard',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
