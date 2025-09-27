'use client';

import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const magicLinkSchema = z.object({
	email: z.email('This is not valid email address'),
});

type MagicLinkSchema = z.infer<typeof magicLinkSchema>;
const MagicLinkResolver = zodResolver(magicLinkSchema);

export const MagicLinkForm = () => {
	const form = useForm<MagicLinkSchema>({
		defaultValues: { email: '' },
		resolver: MagicLinkResolver,
	});

	const onSubmit = async (formData: MagicLinkSchema) => {
		await signIn('credentials', formData);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-3">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Email address</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your email address"
										{...field}
										className="bg-[#40444b] text-white border-gray-600 focus:border-2 focus:border-[#2d7d46]"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button
					type="submit"
					className="mt-8 w-full bg-[#3ba55c] hover:bg-[#2d7d46] text-white"
				>
					Sign in using Email
				</Button>
			</form>
		</Form>
	);
};
