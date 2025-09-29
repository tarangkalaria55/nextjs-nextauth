import { NextAuthConfig } from 'next-auth';
import { env } from '@/lib/env';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { providers } from '../providers/providers';

export const authConfig = {
	debug: process.env.NODE_ENV !== 'production',
	providers: providers,
	pages: {
		signIn: '/auth/signin',
		// newUser: '/profile',
	},
	adapter: PrismaAdapter(prisma),
	secret: env.AUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.picture = user.image;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
				session.user.image = token.picture as string;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;
