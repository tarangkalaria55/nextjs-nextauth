import { PrismaClient } from '@prisma/client';

declare global {
	// allow global `prisma` to be set only in dev
	var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'development') {
	if (!globalThis.prisma) {
		globalThis.prisma = new PrismaClient();
	}
	prisma = globalThis.prisma;
} else {
	prisma = new PrismaClient();
}

export default prisma;
