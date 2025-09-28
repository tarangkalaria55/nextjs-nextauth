'use client';

import { Button } from '@/components/ui/button';
import {
	signIn,
	SignInAuthorizationParams,
	SignInOptions,
} from 'next-auth/react';
import type { ProviderId } from 'next-auth/providers';

interface OAuthFormProps {
	text: string;
	icon?: React.ReactNode;
	provider: ProviderId | undefined;
	options?: SignInOptions<true>;
	authorizationParams?: SignInAuthorizationParams;
}

export const OAuthForm: React.FC<OAuthFormProps> = ({
	text,
	icon,
	provider,
	options,
	authorizationParams,
}) => {
	const submitHandler = async () => {
		await signIn(provider, options, authorizationParams);
	};
	return (
		<form action={submitHandler}>
			<Button className="my-1 w-full bg-white text-gray-700 hover:bg-slate-100">
				{icon}
				Sign in with {text}
			</Button>
		</form>
	);
};
