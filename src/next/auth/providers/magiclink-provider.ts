import Nodemailer from 'next-auth/providers/nodemailer';
import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const magicLinkSchema = z.object({
	email: z.email('This is not valid email address'),
});

export type MagicLinkSchema = z.infer<typeof magicLinkSchema>;
export const MagicLinkResolver = zodResolver(magicLinkSchema);

export const MagiclinkProvider: Provider = Nodemailer({
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
