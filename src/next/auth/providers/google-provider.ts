import Google from 'next-auth/providers/google';
import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';

const GoogleProvider: Provider = Google({
	name: ProviderType.Google,
	clientId: env.GOOGLE_ID,
	clientSecret: env.GOOGLE_SECRET,
});

export default GoogleProvider;
