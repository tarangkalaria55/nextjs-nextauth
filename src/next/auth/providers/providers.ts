import type { Provider as NextAuthProvider } from 'next-auth/providers';
import { CredentialsProvider } from './credentials-provider';
import { MagiclinkProvider } from './magiclink-provider';
import GoogleProvider from './google-provider';
import GithubProvider from './github-provider';

export {
	CredentialResolver,
	credentialSchema,
	type CredentialSchema,
} from './credentials-provider';
export {
	MagicLinkResolver,
	magicLinkSchema,
	type MagicLinkSchema,
} from './magiclink-provider';

export const providers: NextAuthProvider[] = [
	CredentialsProvider,
	MagiclinkProvider,
	GoogleProvider,
	GithubProvider,
];
