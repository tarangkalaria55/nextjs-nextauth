import Nodemailer from 'next-auth/providers/nodemailer';
import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';

const NodemailerProvider: Provider = Nodemailer({
	name: ProviderType.Email,
	server: {
		host: env.EMAIL_SERVER_HOST,
		port: env.EMAIL_SERVER_PORT,
		auth: {
			user: env.EMAIL_SERVER_USER,
			pass: env.EMAIL_SERVER_PASSWORD,
		},
	},
	from: env.EMAIL_FROM,
});

export default NodemailerProvider;
