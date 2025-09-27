import NextAuth from 'next-auth';

import { config } from './config';

export {
	providers,
	credentialProvider,
	emailProvider,
	oAuthProviderMap,
} from './providers/providers';

export const { handlers, auth, signIn, signOut } = NextAuth(config);
