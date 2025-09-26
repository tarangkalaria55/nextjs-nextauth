'use server';

import { SignUpSchema, signUpSchema } from '@/schema/signup';
import { prisma } from '@/lib/prisma';

export const signUp = async (formData: SignUpSchema) => {
	const validatedFields = signUpSchema.safeParse({
		name: formData.name as string,
		email: formData.email as string,
		password: formData.password as string,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Sign up failed. Please check your input.',
		};
	}

	try {
		const hashedPassword = validatedFields.data.password;
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedFields.data.email },
		});

		if (existingUser) {
			return { error: 'User already exists!' };
		}

		await prisma.user.create({
			data: {
				name: validatedFields.data.name,
				email: validatedFields.data.email,
				password: hashedPassword,
			},
		});

		return { success: 'User created successfully!' };
	} catch (error) {
		return { error: `Sign up failed` };
	}
};
