import type { Provider as NextAuthProvider } from 'next-auth/providers';
import CredentialsProvider from './credentials-provider';
import NodemailerProvider from './nodemailer-provider';
import { ProviderType } from './types';
import GoogleProvider from './google-provider';
import GithubProvider from './github-provider';

export const providers: NextAuthProvider[] = [
	CredentialsProvider,
	NodemailerProvider,
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
