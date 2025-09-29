// utils/routeMatcher.ts
import { NextRequest } from 'next/server';

/**
 * Creates a route matching function from an array of patterns.
 *
 * It supports standard RegExp syntax and simplifies the common Clerk-style
 * pattern of appending (.*) for all sub-paths.
 *
 * @param patterns An array of route patterns (strings).
 * e.g., ['/public', '/sign-in(.*)', '^/api/protected/']
 * @returns A function that takes a NextRequest and returns true if the
 * request URL's pathname matches any of the patterns.
 */
export function createRouteMatcher(patterns: string[]) {
	const regexes: RegExp[] = patterns.map((pattern) => {
		// 1. If the pattern is a simple string that does not start with a regex
		//    anchor (like '^'), assume it's a prefix match and anchor it.
		//    e.g., '/dashboard' becomes '^/dashboard$'
		//    e.g., '/dashboard(.*)' is handled by the user-supplied regex.
		if (
			!pattern.startsWith('^') &&
			!pattern.endsWith('$') &&
			!pattern.includes('(')
		) {
			return new RegExp(`^${pattern}$`);
		}

		// 2. Handle patterns that end with the Clerk-style wildcard `(.*)`
		//    This is already a valid regex pattern, so we just wrap it to be safe.
		//    e.g., '/dashboard(.*)' becomes new RegExp('/dashboard(.*)')
		if (pattern.endsWith('(.*)')) {
			// Ensure it starts with an anchor for security
			const regexString = pattern.startsWith('/')
				? `^${pattern}`
				: `^/${pattern}`;
			return new RegExp(regexString);
		}

		// 3. For all other explicit regex or complex patterns, use them directly.
		return new RegExp(pattern);
	});

	return (req: NextRequest): boolean => {
		// Get the pathname without any trailing slash (except for the root '/')
		const pathname = req.nextUrl.pathname;

		// Next.js convention: Clerk's matcher typically uses the raw pathname.
		// We normalize it slightly to avoid matching issues with trailing slashes.
		const normalizedPathname =
			pathname === '/' ? '/' : pathname.replace(/\/$/, '');

		return regexes.some((regex) => regex.test(normalizedPathname));
	};
}
