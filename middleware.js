import { NextResponse } from 'next/server'

export function middleware(request) {
  // Add your auth middleware logic here if needed
  return NextResponse.next()
}

// Configure which paths should use this middleware
export const config = {
  // Skip the loading page from authentication requirements
  matcher: ['/((?!api|_next/static|_next/image|my-logo.png|loading-page).*)'],
}