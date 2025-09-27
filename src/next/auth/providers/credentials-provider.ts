import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/schema/signInSchema';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';
import { getUserByEmail } from '@/db/getUserByEmail';

const CredentialsProvider: Provider = Credentials({
	name: ProviderType.Credentials,
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
			const { email, password } = await signInSchema.parseAsync(credentials);

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

export default CredentialsProvider;
