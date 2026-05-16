import { NextResponse } from 'next/server'

export function middleware(request) {
  const authHeader = request.headers.get('authorization')

  // 1. Validate that the header exists AND is specifically for Basic Auth
  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      // Safely extract the encoded credentials
      const encoded = authHeader.substring(6).trim()
      const decoded = atob(encoded)
      const [user, password] = decoded.split(':')

      if (
        user === process.env.BASIC_AUTH_USER &&
        password === process.env.BASIC_AUTH_PASSWORD
      ) {
        return NextResponse.next()
      }
    } catch (e) {
      // 2. CRITICAL FIX: Log the error message as a string, NOT the raw error object.
      // This prevents the Edge Runtime serialization crash.
      console.error('Basic Auth Decode Error:', e instanceof Error ? e.message : String(e))
    }
  }

  // 3. Use NextResponse instead of the standard Web Response for Next.js consistency
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}