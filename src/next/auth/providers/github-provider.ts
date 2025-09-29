import Github from 'next-auth/providers/github';
import { env } from '@/lib/env';
import type { Provider } from 'next-auth/providers';

const GithubProvider: Provider = Github({
	clientId: env.AUTH_GITHUB_ID,
	clientSecret: env.AUTH_GITHUB_SECRET,
	allowDangerousEmailAccountLinking: true,
});

export default GithubProvider;
