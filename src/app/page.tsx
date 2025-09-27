'use client';

import { logout } from '@/actions/auth/logout';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
	const router = useRouter();
	const handleSignin = async () => {
		router.push('/login');
	};
	const handleSignout = async () => {
		// router.push('/login');
		await logout();
	};
	return (
		<div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<Button onClick={handleSignin}>Sign in</Button>
				<Button onClick={handleSignout}>Sign out</Button>
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
