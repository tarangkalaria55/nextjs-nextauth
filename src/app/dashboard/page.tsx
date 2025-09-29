'use client';

import { Button } from '@/components/ui/button';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function DashboardPage() {
	const { data: session } = useSession();

	const handleSignin = async () => {
		await signIn();
	};
	const handleSignout = async () => {
		await signOut();
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16">
			<main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
				<div className="flex gap-4 items-center flex-col">
					{!session ? (
						<form action={handleSignin}>
							<Button type="submit" size="lg" className="rounded-full text-xl">
								Sign in
							</Button>
						</form>
					) : (
						<>
							<p className="text-center mb-3">You are now signed in!</p>
							<pre>{JSON.stringify(session, null, 2)}</pre>
							<form action={handleSignout}>
								<Button
									type="submit"
									size="lg"
									className="rounded-full text-xl"
								>
									Sign Out
								</Button>
							</form>
						</>
					)}
				</div>
			</main>
		</div>
	);
}
