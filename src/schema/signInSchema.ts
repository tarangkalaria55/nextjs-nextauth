import z from 'zod';

export const signInSchema = z.object({
	email: z.email({ error: 'Invalid email' }),
	password: z
		.string({ error: 'Password is required' })
		.min(1, 'Password is required'),
});
