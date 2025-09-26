'use server';

import { signIn as authSignIn } from '../next-auth/auth';

export async function signIn() {
	await authSignIn();
}
