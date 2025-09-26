import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		AUTH_SECRET: z.string().min(1),

		DATABASE_URL: z.string().min(1),

		GITHUB_ID: z.string().min(1),
		GITHUB_SECRET: z.string().min(1),

		EMAIL_SERVER_USER: z.string().min(1),
		EMAIL_SERVER_PASSWORD: z.string().min(1),
		EMAIL_SERVER_HOST: z.string().min(1),
		EMAIL_SERVER_PORT: z.number().min(1),
		EMAIL_FROM: z.email().min(1),
	},
	client: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	},
	emptyStringAsUndefined: false,
	// Called when the schema validation fails.
	onValidationError: (issues) => {
		console.error('❌ Invalid environment variables:', issues);
		throw new Error('Invalid environment variables');
	},
	// Called when server variables are accessed on the client.
	onInvalidAccess: () => {
		throw new Error(
			'❌ Attempted to access a server-side environment variable on the client'
		);
	},
});
