import type { NextAuthConfig } from 'next-auth';

import Nodemailer from 'next-auth/providers/nodemailer';
import { env } from './lib/env';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from './schemas/signInSchema';
import { ZodError } from 'zod';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/prisma';
import { getUserByEmail } from '@/db/getUserFromDb';

export default {
	adapter: PrismaAdapter(prisma),
	providers: [
		Credentials({
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
						await signInSchema.parseAsync(credentials);

					// logic to salt and hash password
					const pwHash = password;

					// logic to verify if the user exists
					const user = await getUserByEmail(email, pwHash);

					if (!user) {
						// No user found, so this is their first attempt to login
						// Optionally, this is also the place you could do a user registration
						throw new Error('Invalid credentials.');
					}

					// return user object with their profile data
					return user;
				} catch (error) {
					if (error instanceof ZodError) {
						// Return `null` to indicate that the credentials are invalid
						return null;
					}
					return null;
				}
			},
		}),
		Nodemailer({
			server: {
				host: env.EMAIL_SERVER_HOST,
				port: env.EMAIL_SERVER_PORT,
				auth: {
					user: env.EMAIL_SERVER_USER,
					pass: env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: env.EMAIL_FROM,
		}),
	],
} satisfies NextAuthConfig;
