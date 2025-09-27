'use server';

import { LoginSchema, loginSchema } from '@/schema/login';
import { signIn } from '@/next/auth';

export const login = async (formData: LoginSchema) => {
	const email = formData['email'] as string;
	const password = formData['password'] as string;

	const validatedFields = loginSchema.safeParse({
		email: formData.email as string,
		password: formData.password as string,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Login failed. Please check your input.',
		};
	}

	try {
		const result = await signIn('credentials', {
			redirect: false,
			callbackUrl: '/setup',
			email,
			password,
		});

		if (result?.error) {
			return { error: 'Invalid email or password' };
		} else {
			return { success: 'Login successfully' };
		}
	} catch {
		return { error: 'Login failed' };
	}
};
