'use client';

import { useTransition } from 'react';
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
import { useState } from 'react';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const credentialSchema = z.object({
	email: z.email('This is not valid email address'),
	password: z
		.string()
		.min(8, { message: 'Password must contain at least 8 characters' }),
});

export type CredentialSchema = z.infer<typeof credentialSchema>;
export const CredentialResolver = zodResolver(credentialSchema);

export const CredentialForm = () => {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const form = useForm<CredentialSchema>({
		defaultValues: { email: '', password: '' },
		resolver: CredentialResolver,
	});

	const onSubmit = (formData: CredentialSchema) => {
		startTransition(async () => {
			setError('');
			setSuccess('');

			try {
				await signIn('credentials', {
					email: formData.email,
					password: formData.password,
					redirectTo: '/profile',
				});

				// if (signInResult?.ok && !signInResult.error) {
				// 	toast('Email delivered', {
				// 		description: 'Check your inbox and spam',
				// 		action: {
				// 			label: 'Close',
				// 			onClick: () => true,
				// 		},
				// 	});
				// 	return;
				// }

				// router.push('/profile');
			} catch (error) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError('Opps! something went wrong');
				}
			}
		});
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
										disabled={isPending}
										className="bg-[#40444b] text-white border-gray-600 focus:border-2 focus:border-[#2d7d46]"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Password</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="Enter your password"
										{...field}
										disabled={isPending}
										className="bg-[#40444b] text-white border-gray-600 focus:border-2 focus:border-[#2d7d46]"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormError message={error} />
					<FormSuccess message={success} />
				</div>
				<Button
					type="submit"
					disabled={isPending}
					className="mt-8 w-full bg-[#3ba55c] hover:bg-[#2d7d46] text-white"
				>
					{isPending ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading...
						</>
					) : (
						'Login'
					)}
				</Button>
			</form>
		</Form>
	);
};
