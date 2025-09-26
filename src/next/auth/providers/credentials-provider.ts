import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/schemas/signInSchema';
import { getUserByEmail } from '@/db/getUserFromDb';
import { ZodError } from 'zod';
import { CredentialsSignin } from 'next-auth';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';

class InvalidCredentialsError extends CredentialsSignin {
	code = 'Invalid username or password.'; // Optional: custom message
}

class ValidationError extends CredentialsSignin {
	code = 'Input validation failed.'; // General message for Zod errors
}

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

			// logic to salt and hash password
			const pwHash = password;

			// logic to verify if the user exists
			const user = await getUserByEmail(email, pwHash);

			if (!user) {
				// No user found, so this is their first attempt to login
				// Optionally, this is also the place you could do a user registration
				throw new InvalidCredentialsError();
			}

			// return user object with their profile data
			return user;
		} catch (error) {
			if (error instanceof ZodError) {
				throw new ValidationError();
			} else if (error instanceof CredentialsSignin) {
				throw error;
			} else if (error instanceof Error) {
				const err = new CredentialsSignin(error.message, error);
				err.code = 'Something went wrong';
				throw err;
			}
			return null;
		}
	},
});

export default CredentialsProvider;
