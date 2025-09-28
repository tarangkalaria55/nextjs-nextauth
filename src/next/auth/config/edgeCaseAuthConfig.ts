import { NextAuthConfig } from 'next-auth';
import { providers } from '../providers/providers';

export const edgeCaseAuthConfig = {
	debug: process.env.NODE_ENV !== 'production',
	providers: providers,
	pages: {
		signIn: '/signin',
	},
} satisfies NextAuthConfig;
