import type { Provider as NextAuthProvider } from 'next-auth/providers';
import CredentialsProvider from './credentials-provider';
import NodemailerProvider from './nodemailer-provider';

export const providers: NextAuthProvider[] = [
	CredentialsProvider,
	NodemailerProvider,
];

export const providerMap = providers
	.map((provider) => {
		if (typeof provider === 'function') {
			const providerData = provider();
			return { id: providerData.id, name: providerData.name };
		} else {
			return { id: provider.id, name: provider.name };
		}
	})
	.filter((provider) => provider.id !== 'credentials');

export const isProviderHasCredential = providerMap.length != providers.length;
