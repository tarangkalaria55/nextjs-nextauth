import { prisma } from '@/prisma';

export async function getUserByEmail(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email, password: password },
  });
  return user;
}
