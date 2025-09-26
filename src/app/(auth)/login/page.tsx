import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { Separator } from '@/components/auth/Separator';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export default function LoginPage() {
	return (
		<AuthLayout title="Welcome Back!">
			<LoginForm />
			<Separator />
			<GoogleAuthButton text="Sign In with Google" />
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-400">
					Do not have an account?{' '}
					<Link
						href="/signup"
						className="pl-1.5 font-medium text-[#3ba55c] hover:text-[#2d7d46]"
					>
						Sign up
					</Link>
				</p>
			</div>
		</AuthLayout>
	);
}
