'use client';

import React from 'react';

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
	return (
		<div className="min-h-screen bg-[#36393f] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-white">
					{title}
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-[#2f3136] py-8 px-4 shadow sm:rounded-lg sm:px-10">
					{children}
				</div>
			</div>
		</div>
	);
};
