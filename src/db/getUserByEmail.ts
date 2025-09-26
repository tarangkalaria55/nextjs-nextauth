import { prisma } from '@/lib/prisma';

export async function getUserByEmail(email: string) {
	const user = await prisma.user.findUnique({
		where: {
			email: email as string,
		},
	});
	return user;
}
