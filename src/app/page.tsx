'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { signIn, signOut, useSession } from 'next-auth/react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Home(props: PageProps<'/'>) {
	const { data: session } = useSession();

	const handleSignin = async () => {
		await signIn();
	};
	const handleSignout = async () => {
		await signOut();
	};
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				{session?.user ? (
					<Button onClick={handleSignout}>Sign out</Button>
				) : (
					<Button onClick={handleSignin}>Sign in</Button>
				)}

				<Image
					className="dark:invert"
					src="/next.svg"
					alt="Next.js logo"
					width={180}
					height={38}
					priority
				/>
			</main>
		</div>
	);
}
