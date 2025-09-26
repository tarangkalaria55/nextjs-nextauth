import NextAuth from 'next-auth';
import { providers } from './providers/providers';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/prisma';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	adapter: PrismaAdapter(prisma),
	providers: providers,
	session: {
		strategy: 'jwt',
	},
});
