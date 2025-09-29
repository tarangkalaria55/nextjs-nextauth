import Credentials from 'next-auth/providers/credentials';

import type { Provider } from 'next-auth/providers';
import { getUserByEmail } from '@/db/getUserByEmail';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const credentialSchema = z.object({
	email: z.email({ error: 'Invalid email' }),
	password: z
		.string({ error: 'Password is required' })
		.min(1, 'Password is required'),
});

export type CredentialSchema = z.infer<typeof credentialSchema>;
export const CredentialResolver = zodResolver(credentialSchema);

export const CredentialsProvider: Provider = Credentials({
	name: 'credentials',
	credentials: {
		email: {
			type: 'email',
			label: 'Email',
			placeholder: 'johndoe@gmail.com',
		},
		password: {
			type: 'password',
			label: 'Password',
			placeholder: '*****',
		},
	},
	authorize: async (credentials) => {
		try {
			const { email, password } =
				await credentialSchema.parseAsync(credentials);

			const user = await getUserByEmail(email);

			if (!user || !user.password) {
				return null;
			}

			const isPasswordValid = password == user.password;

			if (!isPasswordValid) {
				return null;
			}

			return {
				id: user.id,
				email: user.email,
				name: user.name,
			};
		} catch (error) {
			console.error('Error during authentication:', error);
			return null;
		}
	},
});
