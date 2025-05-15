import { NextResponse } from 'next/server';

export function middleware(request) {
    // Only redirect requests to the homepage
    if (request.nextUrl.pathname === '/') {
        // Check if this is the first visit by looking for a cookie
        const hasVisited = request.cookies.get('has_visited');

        if (!hasVisited) {
            // Set a cookie to track that the user has visited
            const response = NextResponse.redirect(new URL('/loading-page', request.url));
            response.cookies.set('has_visited', 'true', {
                maxAge: 60 * 60, // 1 hour
                path: '/',
            });
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
};