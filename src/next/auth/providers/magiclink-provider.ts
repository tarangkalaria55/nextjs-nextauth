import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Resend from 'next-auth/providers/resend';

export const magicLinkSchema = z.object({
	email: z.email('This is not valid email address'),
});

export type MagicLinkSchema = z.infer<typeof magicLinkSchema>;
export const MagicLinkResolver = zodResolver(magicLinkSchema);

export const MagiclinkProvider: Provider = Resend({
	apiKey: env.AUTH_RESEND_KEY,
	from: env.AUTH_RESEND_EMAIL_FROM,
	secret: env.AUTH_SECRET,
});
