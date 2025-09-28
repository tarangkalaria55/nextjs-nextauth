'use client';

export const Separator = () => {
	return (
		<div className="my-4 relative">
			<div className="absolute inset-0 flex items-center">
				<div className="w-full border-t border-gray-600" />
			</div>
			<div className="relative flex justify-center text-sm">
				<span className="px-2 bg-[#2f3136] text-gray-400">
					Or continue with
				</span>
			</div>
		</div>
	);
};
