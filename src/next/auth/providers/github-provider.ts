import Github from 'next-auth/providers/github';
import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';
import { ProviderType } from './types';

const GithubProvider: Provider = Github({
	name: ProviderType.Github,
	clientId: env.AUTH_GITHUB_ID,
	clientSecret: env.AUTH_GITHUB_SECRET,
});

export default GithubProvider;
