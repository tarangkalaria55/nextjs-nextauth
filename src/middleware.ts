import { NextResponse } from 'next/server';
import { createRouteMatcher } from '@/lib/routeMatcher';
import { auth } from '@/next/auth';

const isHomeRoute = createRouteMatcher(['/', '/dashboard']);
const isPublicRoute = createRouteMatcher(['/auth(.*)']);

export default auth((req) => {
	const { nextUrl, auth: session } = req;
	const isLoggedIn = !!session;

	const isProtectedRoute = !isPublicRoute(req);

	if (isHomeRoute(req)) {
		return NextResponse.next();
	}

	// If trying to access /profile while not logged in
	if (!isLoggedIn && isProtectedRoute) {
		const loginUrl = new URL('/auth/signin', nextUrl.origin);
		return NextResponse.redirect(loginUrl);
	}

	// If trying to access /login or /signup while already logged in
	if (isLoggedIn && !isProtectedRoute) {
		const dashboardUrl = new URL('/', nextUrl.origin);
		return NextResponse.redirect(dashboardUrl);
	}

	// For all other cases, allow the request to pass through
	return NextResponse.next();
});

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
