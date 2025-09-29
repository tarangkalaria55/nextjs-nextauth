/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// New Imports for React Hook Form and Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import GoogleIcon from '@/components/icons/GoogleIcon';
import GithubIcon from '@/components/icons/GithubIcon';

// --- Zod Schema Definitions ---

// 1. Schema for Email/Password (Credentials)
const LoginSchema = z.object({
	email: z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' }),
	rememberMe: z.boolean().default(false).optional(),
});
type LoginFormValues = z.infer<typeof LoginSchema>;

// 2. Schema for Magic Link
const MagicLinkSchema = z.object({
	magicEmail: z
		.string()
		.min(1, { message: 'Email is required' })
		.email({ message: 'Invalid email address' }),
});
type MagicLinkFormValues = z.infer<typeof MagicLinkSchema>;

// -----------------------------

export default function SigninPage() {
	// We use this state specifically for OAuth loading, since it's outside RHF control
	const [isLoading, setIsLoading] = useState(false);
	// Removed local state: emailForMagicLink

	const { data: session, status } = useSession();
	const router = useRouter();

	// --- 1. React Hook Form Setup for Credentials (Email/Password) ---
	const credentialForm = useForm<LoginFormValues>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
		mode: 'onBlur',
	});

	const {
		handleSubmit: handleCredentialSubmit,
		register: registerCredential,
		formState: {
			errors: credentialErrors,
			isSubmitting: isCredentialSubmitting,
		},
		watch: watchCredential,
		setValue: setCredentialValue,
	} = credentialForm;

	// --- 2. React Hook Form Setup for Magic Link ---
	const magicLinkForm = useForm<MagicLinkFormValues>({
		resolver: zodResolver(MagicLinkSchema),
		defaultValues: {
			magicEmail: '',
		},
		mode: 'onBlur',
	});

	const {
		handleSubmit: handleMagicSubmit,
		register: registerMagic,
		formState: { errors: magicErrors, isSubmitting: isMagicSubmitting },
		reset: resetMagicLink,
	} = magicLinkForm;

	// Combine RHF's isSubmitting with our local state for general UI loading checks
	const isOverallLoading =
		isLoading || isCredentialSubmitting || isMagicSubmitting;
	// -----------------------------

	// Redirect if already logged in
	useEffect(() => {
		if (status === 'loading') return;
		if (session) {
			router.push('/dashboard');
		}
	}, [session, status, router]);

	if (status === 'loading') {
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	// Credential Submission
	const onCredentialSubmit = async (values: LoginFormValues) => {
		try {
			const res = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
			});
			console.log('credentials', res);

			if (res?.error) {
				toast.error('Invalid credentials. Please try again.');
				return;
			}
			if (res?.ok) {
				toast.success('Login successful!');
				router.push(res.url || '/dashboard');
			}
		} catch (error) {
			toast.error('An error occurred during login.');
		}
	};

	// Magic Link Submission (RHF Managed)
	const onMagicLinkSubmit = async (values: MagicLinkFormValues) => {
		// isMagicSubmitting handles the loading state here
		try {
			const res = await signIn('resend', {
				email: values.magicEmail,
				redirect: false,
			});
			console.log('resend', res);

			if (res?.error) {
				toast.error(
					'Failed to send magic link. Please check your email and try again.'
				);
			} else {
				toast.success('Magic link sent! Check your inbox (and spam folder).');
				resetMagicLink(); // Clear input on success
			}
		} catch (error) {
			toast.error('An error occurred sending the magic link.');
		}
	};

	const handleOAuthSignIn = async (provider: 'google' | 'github') => {
		if (isOverallLoading) return; // Prevent multiple submissions

		setIsLoading(true);
		try {
			const res = await signIn(provider, { redirect: false });
			console.log(provider, res);

			if (res?.error) {
				toast.error(`OAuth error with ${provider}: ${res.error}`);
			} else if (res?.ok) {
				toast.success(`Signed in with ${provider} successfully!`);
				router.push(res.url ?? '/dashboard');
			} else {
				toast.warning('OAuth process incomplete. Please try again.');
			}
		} catch (error) {
			toast.error(`Failed to sign in with ${provider}.`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-md rounded-xl shadow-2xl border-primary/20">
				<CardHeader className="text-center">
					<CardTitle className="text-3xl text-gray-900 dark:text-gray-50">
						Welcome Back
					</CardTitle>
					<CardDescription className="text-md text-gray-500 dark:text-gray-400">
						Sign in to your account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Credential Form (Email + Password) */}
					<form
						onSubmit={handleCredentialSubmit(onCredentialSubmit)}
						className="space-y-6"
					>
						<div className="space-y-2">
							<Label htmlFor="email">Email Address</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								disabled={isOverallLoading}
								{...registerCredential('email')}
							/>
							{credentialErrors.email && (
								<p className="text-sm font-medium text-red-500">
									{credentialErrors.email.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								disabled={isOverallLoading}
								{...registerCredential('password')}
							/>
							{credentialErrors.password && (
								<p className="text-sm font-medium text-red-500">
									{credentialErrors.password.message}
								</p>
							)}
						</div>
						<div className="flex justify-between items-center">
							<Link
								href="/forgot-password"
								className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
							>
								Forgot Password?
							</Link>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="remember-me"
									checked={watchCredential('rememberMe')}
									onCheckedChange={(checked) =>
										setCredentialValue('rememberMe', !!checked, {
											shouldValidate: true,
										})
									}
									disabled={isOverallLoading}
								/>
								<Label
									htmlFor="remember-me"
									className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									Remember me
								</Label>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full font-semibold h-10 transition-transform duration-200 hover:scale-[1.01]"
							disabled={isOverallLoading}
						>
							{isCredentialSubmitting ? 'Signing In...' : 'Sign In'}
						</Button>
					</form>

					{/* Divider */}
					<div className="relative">
						<Separator />
						<span className="absolute px-3 text-muted-foreground bg-background top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
							or continue with
						</span>
					</div>

					{/* Magic Link Form (Resend Provider) */}
					<form
						onSubmit={handleMagicSubmit(onMagicLinkSubmit)}
						className="space-y-4"
					>
						<div className="space-y-2">
							<Label htmlFor="magic-email">Email for Magic Link</Label>
							<Input
								id="magic-email"
								type="email"
								placeholder="Enter your email to receive a magic link"
								{...registerMagic('magicEmail')}
								required
								disabled={isOverallLoading}
							/>
							{magicErrors.magicEmail && (
								<p className="text-sm font-medium text-red-500">
									{magicErrors.magicEmail.message}
								</p>
							)}
						</div>
						<Button
							type="submit"
							className="w-full font-semibold h-10 transition-transform duration-200 hover:scale-[1.01]"
							disabled={isOverallLoading}
						>
							{isMagicSubmitting ? 'Sending...' : 'Sign In with Magic Link'}
						</Button>
					</form>

					{/* OAuth Buttons */}
					<div className="space-y-2">
						<Button
							type="button"
							variant="outline"
							className="w-full h-10 text-lg text-primary font-medium border-1 border-primary/50"
							onClick={() => handleOAuthSignIn('google')}
							disabled={isOverallLoading}
						>
							<GoogleIcon />
							<span>Sign in with Google</span>
						</Button>
						<Button
							type="button"
							variant="outline"
							className="w-full h-10 text-lg text-primary font-medium border-1 border-primary/50"
							onClick={() => handleOAuthSignIn('github')}
							disabled={isOverallLoading}
						>
							<GithubIcon />
							<span>Sign in with GitHub</span>
						</Button>
					</div>

					{/* Sign Up Link */}
					<div className="text-center text-sm text-muted-foreground pt-4">
						Don&apos;t have an account?
						<Link
							href="/auth/signup"
							className="ml-2 text-primary font-semibold underline hover:no-underline"
						>
							Sign up
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
