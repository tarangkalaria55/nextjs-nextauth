import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			access_token: string;
			expires_at: number;
			refresh_token?: string;
			error?: 'RefreshTokenError';
		} & DefaultSession['user'];
	}
}
