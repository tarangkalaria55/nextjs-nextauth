import { NextAuthConfig } from 'next-auth';
import { providers } from './providers/providers';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

export const config = {
	adapter: PrismaAdapter(prisma),
	providers: providers,
	secret: env.AUTH_SECRET,
	pages: {
		signIn: '/login',
	},
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
			}
			return session;
		},
	},
} satisfies NextAuthConfig;
