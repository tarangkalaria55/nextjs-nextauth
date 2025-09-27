'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { CredentialForm } from '@/components/auth/CredentialForm';
import { Separator } from '@/components/auth/Separator';
import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { OAuthForm } from '@/components/auth/OAuthForm';
import Link from 'next/link';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SigninPage = () => {
	const { data: session } = useSession();

	useEffect(() => {
		if (session) {
			signOut({ redirect: false });
		}
	}, [session]);

	return (
		<AuthLayout title="Welcome Back!">
			<CredentialForm />
			<Separator />
			<MagicLinkForm />
			<Separator />
			<OAuthForm
				text="Google"
				icon={<GoogleIcon />}
				provider="google"
				options={{ redirectTo: '/' }}
			/>
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
};

export default SigninPage;
