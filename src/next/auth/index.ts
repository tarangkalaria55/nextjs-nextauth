import NextAuth from 'next-auth';

import { authConfig } from './config/authConfig';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
