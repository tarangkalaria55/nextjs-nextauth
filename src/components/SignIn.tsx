'use client';

import { signIn } from '@/next-auth/auth';
import { ProviderType } from '@/next-auth/auth.types';

export function SignIn() {
	const credentialsAction = (formData: FormData) => {
		signIn(ProviderType.Credentials, formData);
	};

	const nodemailAction = (formData: FormData) => {
		signIn(ProviderType.Email, formData);
	};

	return (
		<div>
			<form action={credentialsAction}>
				<label htmlFor="credentials-email">
					Email
					<input type="email" id="credentials-email" name="email" />
				</label>
				<label htmlFor="credentials-password">
					Password
					<input type="password" id="credentials-password" name="password" />
				</label>
				<input type="submit" value="Sign In with Credentials" />
			</form>
			<form action={nodemailAction}>
				<label htmlFor="email-email">
					Email
					<input type="email" id="email-email" name="email" />
				</label>
				<button type="submit">Sign In with Email</button>
			</form>
		</div>
	);
}
