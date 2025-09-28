import NextAuth from 'next-auth';

import { authConfig } from './config/authConfig';

export { providers } from './providers/providers';

export const { handlers, signIn, signOut } = NextAuth(authConfig);
