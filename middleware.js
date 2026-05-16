import { NextResponse } from 'next/server'

export function middleware(request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const encoded = authHeader.split(' ')[1]

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')

    const [user, password] = decoded.split(':')

    if (
      user === process.env.BASIC_AUTH_USER &&
      password === process.env.BASIC_AUTH_PASSWORD
    ) {
      return NextResponse.next()
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: ['/((?!_next|favicon.ico).*)'],
}