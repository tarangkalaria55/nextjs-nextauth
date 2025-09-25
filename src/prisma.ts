import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `prisma` to be set only in dev
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}
