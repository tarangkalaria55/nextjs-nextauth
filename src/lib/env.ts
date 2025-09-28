import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		AUTH_SECRET: z.string().min(1),

		DATABASE_URL: z.string().min(1),

		AUTH_RESEND_KEY: z.string().min(1),
		AUTH_RESEND_EMAIL_FROM: z.string().min(1),

		AUTH_GITHUB_ID: z.string().min(1), //.optional().or(z.literal('')),
		AUTH_GITHUB_SECRET: z.string().min(1),

		AUTH_GOOGLE_ID: z.string().min(1),
		AUTH_GOOGLE_SECRET: z.string().min(1),

		EMAIL_SERVER_USER: z.string().min(1),
		EMAIL_SERVER_PASSWORD: z.string().min(1),
		EMAIL_SERVER_HOST: z.string().min(1),
		EMAIL_SERVER_PORT: z.coerce.number().min(1),
		EMAIL_FROM: z.email().min(1),
	},
	client: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1).optional().or(z.literal('')),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
	},
	emptyStringAsUndefined: false,
	// Called when the schema validation fails.
	onValidationError: (issues) => {
		console.error('❌ Invalid environment variables:', issues);

		const msg = issues
			.map(
				(issue, idx) =>
					`MESSAGE_${idx + 1}: ${issue.message}; PATH_${idx + 1}: ${JSON.stringify(issue.path ?? '')};`
			)
			.join();
		throw new Error('Invalid environment variables: ' + msg);
	},
	// Called when server variables are accessed on the client.
	onInvalidAccess: (variable) => {
		throw new Error(
			`❌ Attempted to access a server-side environment variable: ${variable} on the client`
		);
	},
});
