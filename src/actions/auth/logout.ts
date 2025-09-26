'use server';

import { signOut } from '@/next/auth';

export const logout: typeof signOut = async (option) => {
	return await signOut(option);
};
