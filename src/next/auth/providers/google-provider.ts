import Google from 'next-auth/providers/google';
import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';

const GoogleProvider: Provider = Google({
	name: ProviderType.Google,
	clientId: env.AUTH_GOOGLE_ID,
	clientSecret: env.AUTH_GOOGLE_SECRET,
	allowDangerousEmailAccountLinking: true,
});

export default GoogleProvider;
