'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
import { Label } from '@/components/ui/label';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [isSent, setIsSent] = useState(false);
	const { data: session, status } = useSession();
	const router = useRouter();

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) {
			toast.error('Please enter your email.');
			return;
		}
		setIsLoading(true);
		try {
			const res = await fetch('/api/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});
			if (!res.ok) {
				const error = await res.json();
				toast.error(error.message || 'Failed to send reset email.');
				return;
			}
			toast.success('Reset email sent! Check your inbox (and spam folder).');
			setIsSent(true);
			setEmail(''); // Clear input
		} catch (error) {
			toast.error('An error occurred sending the reset email.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex items-center justify-center p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Forgot Password</CardTitle>
					<CardDescription>
						Enter your email to receive a reset link
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					{isSent ? (
						<div className="text-center">
							<p className="text-muted-foreground">
								Check your email for the reset link.
							</p>
							<Button
								onClick={() => setIsSent(false)}
								variant="link"
								className="mt-4"
							>
								Send another email
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									disabled={isLoading}
								/>
							</div>
							<Button
								type="submit"
								className="w-full"
								disabled={isLoading || !email}
							>
								{isLoading ? 'Sending...' : 'Send Reset Link'}
							</Button>
						</form>
					)}

					<div className="text-center text-sm text-muted-foreground">
						<Link href="/login" className="text-primary underline">
							Back to Sign In
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
