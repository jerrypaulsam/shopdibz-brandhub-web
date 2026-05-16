import { NextResponse } from 'next/server'

export function middleware(request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    try {
      const encoded = authHeader.split(' ')[1]
      const decoded = atob(encoded)
      const [user, password] = decoded.split(':')

      if (
        user === process.env.BASIC_AUTH_USER &&
        password === process.env.BASIC_AUTH_PASSWORD
      ) {
        return NextResponse.next()
      }
    } catch (e) {
      // Silent catch: falls through to the prompt
    }
  }

  // Strictly formatted standard Web Response
  return new Response('Authentication required', {
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