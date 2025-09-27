import type { Provider as NextAuthProvider } from 'next-auth/providers';
import { ProviderType } from './types';
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

const providerMap = providers.map((provider) => {
	if (typeof provider === 'function') {
		const providerData = provider();
		return { id: providerData.id, name: providerData.name };
	} else {
		return { id: provider.id, name: provider.name };
	}
});

export const credentialProvider = providerMap.find(
	(provider) => provider.name === ProviderType.Credentials
);

export const emailProvider = providerMap.find(
	(provider) => provider.name === ProviderType.Email
);

export const oAuthProviderMap = providerMap.filter(
	(provider) =>
		provider.name !== ProviderType.Credentials &&
		provider.name !== ProviderType.Email
);
