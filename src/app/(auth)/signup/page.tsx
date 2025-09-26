import Link from 'next/link';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Separator } from '@/components/auth/Separator';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export default function SignUpPage() {
	return (
		<AuthLayout title="Welcome!">
			<SignUpForm />
			<Separator />
			<GoogleAuthButton text="Sign Up with Google" />
			<div className="mt-6 text-center">
				<p className="text-sm text-gray-400">
					Already have an account?{' '}
					<Link
						href="/login"
						className="pl-1.5 font-medium text-[#3ba55c] hover:text-[#2d7d46]"
					>
						Sign in
					</Link>
				</p>
			</div>
		</AuthLayout>
	);
}
