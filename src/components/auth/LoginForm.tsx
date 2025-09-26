/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { LoginResolver, LoginSchema } from '@/schema/login';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { login } from '@/actions/auth/login';
import { Loader2 } from 'lucide-react';

export const LoginForm = () => {
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<LoginSchema>({
		defaultValues: { email: '', password: '' },
		resolver: LoginResolver,
	});

	const onSubmit = (formData: LoginSchema) => {
		startTransition(() => {
			setError('');
			setSuccess('');
			login(formData)
				.then((data: any) => {
					if (data.success) {
						setSuccess(data.success);
						router.push('/setup');
					} else if (data.error) {
						setError(data.error);
					}
				})
				.catch((data: any) => {
					setError(data.error);
				});
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
